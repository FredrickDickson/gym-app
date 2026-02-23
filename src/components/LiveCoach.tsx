import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Activity, Volume2 } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

interface LiveCoachProps {
  onClose: () => void;
}

export const LiveCoach: React.FC<LiveCoachProps> = ({ onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [audioWorkletNode, setAudioWorkletNode] = useState<AudioWorkletNode | null>(null);
  const [session, setSession] = useState<any>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [userTranscription, setUserTranscription] = useState<string>("");
  
  const audioQueue = useRef<Float32Array[]>([]);
  const isPlaying = useRef(false);

  useEffect(() => {
    const connect = async () => {
      try {
        await connectToLiveAPI();
      } catch (err) {
        console.error("Connection failed", err);
      }
    };
    connect();
    return () => {
      disconnect();
    };
  }, []);

  const connectToLiveAPI = async () => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      console.error("No API Key found");
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Setup Audio Context
    const ctx = new AudioContext({ sampleRate: 16000 });
    setAudioContext(ctx);

    // Setup Microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setMediaStream(stream);

    const source = ctx.createMediaStreamSource(stream);
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    
    // Connect to Gemini Live
    const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        callbacks: {
            onopen: () => {
                console.log("Live API Connected");
                setIsConnected(true);
            },
            onmessage: async (message: LiveServerMessage) => {
                // Handle Audio Output
                const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                if (base64Audio) {
                    processAudioChunk(base64Audio, ctx);
                }
                
                // Handle Transcription
                if (message.serverContent?.modelTurn?.parts[0]?.text) {
                    setTranscription(prev => prev + message.serverContent?.modelTurn?.parts[0]?.text);
                }

                if (message.serverContent?.turnComplete) {
                    setIsSpeaking(false);
                }

                // Handle User Transcription
                if (message.serverContent?.interrupted) {
                    audioQueue.current = [];
                    isPlaying.current = false;
                    setIsSpeaking(false);
                }
            },
            onclose: () => {
                console.log("Live API Closed");
                setIsConnected(false);
            },
            onerror: (err) => {
                console.error("Live API Error", err);
            }
        },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } }
            },
            systemInstruction: {
                parts: [{ text: "You are an energetic and motivating fitness coach. Keep responses concise and encouraging. You can see the user through their camera if they enable it, but for now focus on voice interaction." }]
            }
        }
    });

    processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
            pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        
        const base64 = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        
        sessionPromise.then((sess) => {
            sess.sendRealtimeInput({
                media: {
                    mimeType: "audio/pcm;rate=16000",
                    data: base64
                }
            });
        });
    };

    source.connect(processor);
    processor.connect(ctx.destination);

    const sess = await sessionPromise;
    setSession(sess);
  };

  const processAudioChunk = (base64: string, ctx: AudioContext) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    const float32 = new Float32Array(bytes.length / 2);
    const dataView = new DataView(bytes.buffer);
    for (let i = 0; i < bytes.length / 2; i++) {
        const int16 = dataView.getInt16(i * 2, true);
        float32[i] = int16 / 0x7FFF;
    }
    
    audioQueue.current.push(float32);
    if (!isPlaying.current) {
        playNextInQueue(ctx);
    }
  };

  const playNextInQueue = (ctx: AudioContext) => {
    if (audioQueue.current.length === 0) {
        isPlaying.current = false;
        setIsSpeaking(false);
        return;
    }

    isPlaying.current = true;
    setIsSpeaking(true);
    const float32 = audioQueue.current.shift()!;
    
    const buffer = ctx.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = () => playNextInQueue(ctx);
    source.start();
  };

  const disconnect = () => {
    if (audioContext) audioContext.close();
    if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
    setIsConnected(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center text-white p-6">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
      >
        <X size={24} />
      </button>

      <div className="relative mb-12">
        <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 ${
            isSpeaking ? 'bg-[#FF6B6B] scale-110 shadow-[0_0_60px_rgba(255,107,107,0.6)]' : 
            isConnected ? 'bg-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.4)]' : 'bg-gray-800'
        }`}>
            {isSpeaking ? (
                <Volume2 size={64} className="animate-pulse" />
            ) : (
                <Mic size={64} className={isConnected ? 'animate-bounce' : ''} />
            )}
        </div>
        
        {isConnected && (
            <>
                <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" style={{ animationDuration: '2s' }}></div>
                <div className="absolute inset-0 rounded-full border border-white/10 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
            </>
        )}
      </div>

      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-3xl font-bold tracking-tight">
            {isConnected ? (isSpeaking ? "Coach is speaking..." : "Listening...") : "Connecting to Coach..."}
        </h2>
        
        <div className="min-h-[100px] p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            {transcription ? (
                <p className="text-lg text-gray-200 leading-relaxed italic">"{transcription}"</p>
            ) : (
                <p className="text-gray-500 italic">
                    {isConnected ? "Try saying: 'Give me a quick motivation boost' or 'How is my form?'" : "Initializing secure voice link..."}
                </p>
            )}
        </div>
      </div>
      
      {!isConnected && (
        <div className="mt-12 flex gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      )}

      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] uppercase tracking-widest text-gray-500">
            <Activity size={12} className="text-green-500" />
            Real-time AI Coaching Active
        </div>
      </div>
    </div>
  );
};
