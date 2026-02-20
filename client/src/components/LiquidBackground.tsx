import { useRef } from 'react';
import { useLiquidBackground } from '@/hooks/use-liquid-background';

interface LiquidBackgroundProps {
    className?: string;
    opacity?: number;
}

export function LiquidBackground({ className = '', opacity = 0.3 }: LiquidBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useLiquidBackground(canvasRef);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
            style={{ opacity }}
        />
    );
}
