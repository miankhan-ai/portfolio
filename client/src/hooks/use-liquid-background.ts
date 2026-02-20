import { useEffect, useRef } from 'react';

// Declare the global type for the liquid background library
declare global {
    interface Window {
        LiquidBackground?: any;
    }
}

export function useLiquidBackground(canvasRef: React.RefObject<HTMLCanvasElement>) {
    const appRef = useRef<any>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        let mounted = true;

        const loadScript = () => {
            return new Promise((resolve, reject) => {
                // Check if already loaded
                if (window.LiquidBackground) {
                    resolve(window.LiquidBackground);
                    return;
                }

                const script = document.createElement('script');
                script.type = 'module';
                script.innerHTML = `
          import LiquidBackground from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.27/build/backgrounds/liquid1.min.js';
          window.LiquidBackground = LiquidBackground;
          window.dispatchEvent(new Event('liquidBackgroundLoaded'));
        `;

                const handleLoad = () => {
                    resolve(window.LiquidBackground);
                };

                window.addEventListener('liquidBackgroundLoaded', handleLoad, { once: true });

                script.onerror = reject;
                document.head.appendChild(script);

                // Cleanup listener if script fails
                setTimeout(() => {
                    window.removeEventListener('liquidBackgroundLoaded', handleLoad);
                }, 10000);
            });
        };

        const initLiquid = async () => {
            try {
                const LiquidBackground = await loadScript();

                if (!mounted || !canvasRef.current || !LiquidBackground) return;

                appRef.current = LiquidBackground(canvasRef.current);

                // Configure the liquid effect
                try {
                    // Remove the background image to show pure liquid effect
                    // await appRef.current.loadImage('https://assets.codepen.io/33787/liquid.webp');

                    if (appRef.current.liquidPlane?.material) {
                        appRef.current.liquidPlane.material.metalness = 0.75;
                        appRef.current.liquidPlane.material.roughness = 0.25;
                        // Set a solid color instead of image
                        appRef.current.liquidPlane.material.color.setHex(0x6366f1); // Primary color
                    }

                    if (appRef.current.liquidPlane?.uniforms?.displacementScale) {
                        appRef.current.liquidPlane.uniforms.displacementScale.value = 5;
                    }

                    if (appRef.current.setRain) {
                        appRef.current.setRain(false);
                    }
                } catch (configError) {
                    console.warn('Liquid background configuration warning:', configError);
                }
            } catch (error) {
                console.error('Failed to load liquid background:', error);
            }
        };

        initLiquid();

        return () => {
            mounted = false;
            if (appRef.current?.dispose) {
                try {
                    appRef.current.dispose();
                } catch (e) {
                    console.warn('Error disposing liquid background:', e);
                }
            }
        };
    }, [canvasRef]);
}
