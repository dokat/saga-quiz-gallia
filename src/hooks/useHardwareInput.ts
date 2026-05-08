import { useEffect, useState, useCallback } from 'react';

export const useHardwareInput = (onInput: (key: string) => void) => {
  const [isSerialSupported, setIsSerialSupported] = useState(false);
  const [serialConnected, setSerialConnected] = useState(false);

  useEffect(() => {
    if ('serial' in navigator) {
      setIsSerialSupported(true);
    }
  }, []);

  // 1. Native Keyboard Support (Option 2)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore input if typing in an input field
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      onInput(e.key.toLowerCase());
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onInput]);

  // 2. Web Serial API Support (Option 1)
  const connectSerial = useCallback(async () => {
    if (!('serial' in navigator)) {
      alert('Web Serial API is not supported in this browser (Use Chrome/Edge).');
      return;
    }

    try {
      // @ts-ignore - TypeScript might not have the latest Web Serial types by default
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 }); // Make sure your Arduino uses Serial.begin(9600)
      setSerialConnected(true);

      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();

      console.log('Serial port connected!');

      // Run reading loop in the background
      const readLoop = async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              reader.releaseLock();
              break;
            }
            if (value) {
              // Parse the string and ignore whitespace/newlines like \r \n
              const sanitized = value.trim();
              if (sanitized) {
                // We emit each character or command
                onInput(sanitized.toLowerCase());
              }
            }
          }
        } catch (error) {
          console.error('Serial read error:', error);
        } finally {
          setSerialConnected(false);
        }
      };

      readLoop();
    } catch (error) {
      console.error('Serial connection error:', error);
      setSerialConnected(false);
    }
  }, [onInput]);

  return { connectSerial, serialConnected, isSerialSupported };
};
