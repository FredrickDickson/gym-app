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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    connectToLiveAPI();
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
    
    // Simple processor to extract PCM data
    // In a real app, use an AudioWorklet for better performance
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    
    processor.onaudioprocess = (e) => {
        if (!session) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32 to Int16
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
            pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        
        // Convert to Base64
        const base64 = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        
        session.sendRealtimeInput({
            media: {
                mimeType: "audio/pcm;rate=16000",
                data: base64
            }
        });
    };

    source.connect(processor);
    processor.connect(ctx.destination);

    // Connect to Gemini Live
    try {
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
                        setIsSpeaking(true);
                        playAudioChunk(base64Audio, ctx);
                    }
                    
                    if (message.serverContent?.turnComplete) {
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
                    parts: [{ text: "You are an energetic and motivating fitness coach. Keep responses concise and encouraging." }]
                }
            }
        });
        
        const sess = await sessionPromise;
        setSession(sess);

    } catch (err) {
        console.error("Failed to connect", err);
    }
  };

  const playAudioChunk = async (base64: string, ctx: AudioContext) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Decode PCM (assuming 24kHz output from Gemini usually, but let's try to decode or just play raw)
    // The Live API output format is PCM. We need to play it.
    // Ideally we queue these chunks. For simplicity here, we'll just try to play.
    
    // Note: Decoding raw PCM in browser requires creating a buffer manually.
    // Gemini Live output is typically 24000Hz PCM.
    
    const float32 = new Float32Array(bytes.length / 2);
    const dataView = new DataView(bytes.buffer);
    
    for (let i = 0; i < bytes.length / 2; i++) {
        const int16 = dataView.getInt16(i * 2, true); // Little endian
        float32[i] = int16 / 0x7FFF;
    }
    
    const buffer = ctx.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();
    
    source.onended = () => setIsSpeaking(false);
  };

  const disconnect = () => {
    if (session) {
        // session.close() might not exist on the interface depending on SDK version, 
        // but usually we just stop sending and close context.
    }
    if (audioContext) audioContext.close();
    if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
    setIsConnected(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center text-white">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 bg-white/10 rounded-full"
      >
        <X size={24} />
      </button>

      <div className="relative mb-12">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
            isSpeaking ? 'bg-[#FF6B6B] scale-110 shadow-[0_0_50px_rgba(255,107,107,0.5)]' : 
            isConnected ? 'bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'bg-gray-700'
        }`}>
            {isSpeaking ? (
                <Volume2 size={48} className="animate-pulse" />
            ) : (
                <Mic size={48} />
            )}
        </div>
        
        {/* Ripple effects */}
        {isConnected && (
            <>
                <div className="absolute inset-0 rounded-full border border-white/20 animate-ping" style={{ animationDuration: '2s' }}></div>
                <div className="absolute inset-0 rounded-full border border-white/10 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
            </>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-2">
        {isConnected ? (isSpeaking ? "Coach is speaking..." : "Listening...") : "Connecting..."}
      </h2>
      <p className="text-gray-400 text-center max-w-xs">
        Ask about your workout form, nutrition advice, or motivation!
      </p>
      
      {!isConnected && (
        <div className="mt-8 flex gap-2">
            <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      )}
    </div>
  );
};
