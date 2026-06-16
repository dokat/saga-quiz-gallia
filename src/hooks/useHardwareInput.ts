import { useEffect, useState, useCallback, useRef } from 'react';

export const useHardwareInput = (
  onInput: (key: string) => void,
  mode: 'TOUCHSCREEN' | 'BUZZER'
) => {
  const [isSerialSupported, setIsSerialSupported] = useState(false);
  const [serialConnected, setSerialConnected] = useState(false);
  const [serialPortName, setSerialPortName] = useState<string | null>(null);

  // Keep a mutable ref that always points to the latest onInput callback.
  // This prevents stale closures in the long-running readLoop stream reader.
  const onInputRef = useRef(onInput);
  onInputRef.current = onInput;

  useEffect(() => {
    if ('serial' in navigator) {
      setIsSerialSupported(true);
    }
  }, []);

  // 1. Keyboard Support (Enabled only in BUZZER mode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process keyboard input if in BUZZER mode
      if (mode !== 'BUZZER') return;

      // Ignore input if typing in an input field
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      onInputRef.current(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  // 2. Web Serial API Support (Enabled only in BUZZER mode)
  const connectSerial = useCallback(async () => {
    if (!('serial' in navigator)) {
      alert('Web Serial API is not supported in this browser (Use Chrome/Edge).');
      return;
    }

    try {
      // @ts-ignore - TypeScript might not have the latest Web Serial types by default
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      setSerialConnected(true);

      const info = port.getInfo();
      let portName = 'Périphérique USB';
      if (info.usbVendorId !== undefined && info.usbProductId !== undefined) {
        const vid = info.usbVendorId.toString(16).padStart(4, '0').toUpperCase();
        const pid = info.usbProductId.toString(16).padStart(4, '0').toUpperCase();
        if (info.usbVendorId === 0x2341) {
          portName = `Arduino (0x${vid})`;
        } else {
          portName = `USB (0x${vid}:0x${pid})`;
        }
      }
      setSerialPortName(portName);

      const textDecoder = new TextDecoderStream();
      port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();

      console.log('Serial port connected!');

      const readLoop = async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              reader.releaseLock();
              break;
            }
            // Only process serial input if in BUZZER mode
            if (value && mode === 'BUZZER') {
              const sanitized = value.trim();
              if (sanitized) {
                onInputRef.current(sanitized.toLowerCase());
              }
            }
          }
        } catch (error) {
          console.error('Serial read error:', error);
        } finally {
          setSerialConnected(false);
          setSerialPortName(null);
        }
      };

      readLoop();
    } catch (error) {
      console.error('Serial connection error:', error);
      setSerialConnected(false);
      setSerialPortName(null);
    }
  }, [mode]);

  return { connectSerial, serialConnected, isSerialSupported, serialPortName };
};
