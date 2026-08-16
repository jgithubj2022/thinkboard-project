import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";

const TRIGGER_PATTERN = /\bcreate\s+(?:a\s+)?note\b/i;

const VoiceController = ({ onCreateNote, startRequest }) => {
  const recognitionRef = useRef(null);
  const startupTimerRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognition.onstart = () => {
        window.clearTimeout(startupTimerRef.current);
        setIsListening(true);
        setStatus("Listening for “create note…”");
        setError("");
      };
      recognition.onend = () => {
        window.clearTimeout(startupTimerRef.current);
        setIsListening(false);
      };
      recognition.onresult = async (event) => {
        const heard = event.results[0][0].transcript.trim();
        const trigger = heard.match(TRIGGER_PATTERN);
        setTranscript(heard);

        if (!trigger || trigger.index === undefined) {
          setStatus("Try saying “create note…”");
          return;
        }

        const content = heard.slice(trigger.index + trigger[0].length).trim();
        if (!content) {
          setStatus("Say your note after “create note”.");
          return;
        }

        try {
          setStatus("Saving voice note…");
          await onCreateNote({ title: content.slice(0, 14) + "...", content });
          setStatus("Voice note saved.");
        } catch (requestError) {
          setError(requestError.message || "The voice note could not be saved.");
        }
      };
      recognition.onnomatch = () => setStatus("I couldn't understand that. Please try again.");
      recognition.onerror = (event) => {
        window.clearTimeout(startupTimerRef.current);
        setIsListening(false);
        const messages = {
          "not-allowed": "Microphone access was blocked. Allow it in this site's browser permissions.",
          "audio-capture": "No working microphone was found.",
          "no-speech": "No speech was detected. Click the mic and try again.",
          network: "The browser's speech-recognition service could not be reached."
        };
        setError(messages[event.error] || `Voice input failed: ${event.error}`);
      };
      recognitionRef.current = recognition;

      return () => {
        window.clearTimeout(startupTimerRef.current);
        try { recognition.abort(); } catch { /* Recognition was already inactive. */ }
      };
    } catch {
      setError("Voice input could not start in this browser context.");
    }
  }, [onCreateNote]);

  const startListening = async () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      setError("Voice input is not supported in this browser.");
      return;
    }

    try {
      setError("");
      setStatus("Requesting microphone access…");

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Microphone access requires a secure HTTPS page."
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      stream.getTracks().forEach((track) => track.stop());

      setStatus("Starting speech recognition…");
      recognition.start();
      startupTimerRef.current = window.setTimeout(() => {
        try { recognition.abort(); } catch { /* Recognition never became active. */ }
        setIsListening(false);
        setStatus("");
        setError("Microphone access succeeded, but this browser did not start speech recognition.");
      }, 6000);
    } catch (error) {
      setIsListening(false);
      setStatus("");
      setError(
        error.name === "NotAllowedError"
          ? "Microphone access was denied."
          : error.message
      );
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    if (startRequest > 0 && !isListening) {
      startListening();
    }
  }, [startRequest]);

  return (
    <div className="card card-compact mb-4 border border-black/10 !bg-white !text-black shadow-sm">
      <div className="card-body">
        <div className="flex items-center justify-between gap-3">
          <div><h3 className="font-bold text-black">Voice pickup</h3><p className="text-xs text-black/55">Capture a transcript for a future note.</p></div>
          <button
            type="button"
            className={`btn btn-circle btn-sm ${
              isListening ? "btn-error" : "btn-primary"
            }`}
            onClick={toggleListening}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening ? (
              <Square className="size-3.5" />
            ) : (
              <Mic className="size-4" />
            )}
          </button>
          
        </div>
        {transcript && <p className="rounded-lg bg-base-200 p-3 text-sm">“{transcript}”</p>}
        {status && <p className="text-xs text-black/55">{status}</p>}
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    </div>
  );
};

export default VoiceController;
