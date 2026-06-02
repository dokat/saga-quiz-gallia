import { useEffect, useState, useRef } from "react";

export function useMidi(onInput: (key: string) => void) {
    const [inputs, setInputs] = useState<MIDIInput[]>([]);

    const onInputRef = useRef(onInput);
    onInputRef.current = onInput;

    useEffect(() => {
        let midiAccess: MIDIAccess | null = null;

        async function initMIDI() {
            try {
                midiAccess = await navigator.requestMIDIAccess();

                const inputsArray = Array.from(midiAccess.inputs.values());
                setInputs(inputsArray);

                inputsArray.forEach((input) => {
                    input.onmidimessage = handleMIDIMessage;
                });

                midiAccess.onstatechange = () => {
                    const updatedInputs = Array.from(midiAccess?.inputs.values() || []);
                    setInputs(updatedInputs);

                    updatedInputs.forEach((input) => {
                        input.onmidimessage = handleMIDIMessage;
                    });
                };
            } catch (err) {
                console.error("MIDI not available", err);
            }
        }

        function handleMIDIMessage(event: any) {
            const [status, note, velocity] = event.data;

            const message = {
                status,
                note,
                velocity,
                type: status & 0xf0,
                timestamp: Date.now(),
            };

            console.log("MIDI:", message);
            if (onInputRef.current) {
                onInputRef.current(message.note.toString());
            }
        }

        initMIDI();

        return () => {
            if (midiAccess) {
                midiAccess.inputs.forEach((input) => {
                    input.onmidimessage = null;
                });
            }
        };
    }, []);

    return { inputs };
}