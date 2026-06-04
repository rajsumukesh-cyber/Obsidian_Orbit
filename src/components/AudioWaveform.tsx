import { useEffect, useRef, useState } from 'react';

export default function AudioWaveform({ isRecording }: { isRecording: boolean }) {
  const [dataArray, setDataArray] = useState<Uint8Array>(new Uint8Array(20));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (isRecording) {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 64;
      }

      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          sourceRef.current = audioContextRef.current!.createMediaStreamSource(stream);
          sourceRef.current.connect(analyserRef.current!);
          
          const bufferLength = analyserRef.current!.frequencyBinCount;
          const data = new Uint8Array(bufferLength);
          
          const animate = () => {
            analyserRef.current!.getByteFrequencyData(data);
            setDataArray(new Uint8Array(data));
            animationFrameRef.current = requestAnimationFrame(animate);
          };
          animate();
        })
        .catch(err => console.error("Error accessing microphone:", err));
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (sourceRef.current) {
        sourceRef.current.mediaStream.getTracks().forEach(track => track.stop());
        sourceRef.current.disconnect();
      }
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRecording]);

  return (
    <div className="flex items-center justify-center gap-1 h-12 w-full">
      {Array.from(dataArray).slice(0, 20).map((value, index) => (
        <div
          key={index}
          className="w-1 rounded-sm bg-primary transition-all duration-75"
          style={{ height: `${Math.max(4, ((value as number) / 255) * 48)}px` }}
        />
      ))}
    </div>
  );
}
