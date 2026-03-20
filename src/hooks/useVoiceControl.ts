import {useEffect, useRef, useCallback, useState} from 'react';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import {AppSettings} from '../data/types';

interface VoiceActions {
  onWake: () => void;
  onStop: () => void;
  onSkip: () => void;
}

export function useVoiceControl(
  settings: AppSettings,
  actions: VoiceActions,
  enabled: boolean,
) {
  const [isListening, setIsListening] = useState(false);
  const [lastHeard, setLastHeard] = useState('');
  const restartRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const startListening = useCallback(async () => {
    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch {}
  }, []);

  const stopListening = useCallback(async () => {
    try {
      await Voice.stop();
      await Voice.destroy();
    } catch {}
    setIsListening(false);
  }, []);

  useEffect(() => {
    if (!enabled) {
      stopListening();
      return;
    }

    const onResults = (e: SpeechResultsEvent) => {
      const heard = (e.value ?? []).join(' ').toLowerCase();
      setLastHeard(heard);

      if (heard.includes(settings.wakeWord.toLowerCase())) {
        actions.onWake();
      } else if (heard.includes(settings.stopWord.toLowerCase())) {
        actions.onStop();
      } else if (heard.includes(settings.skipWord.toLowerCase())) {
        actions.onSkip();
      }
    };

    const onEnd = () => {
      // Continuous listening: restart after short delay
      if (enabledRef.current) {
        restartRef.current = setTimeout(() => {
          if (enabledRef.current) startListening();
        }, 300);
      } else {
        setIsListening(false);
      }
    };

    const onError = (_e: SpeechErrorEvent) => {
      // Restart on error too
      if (enabledRef.current) {
        restartRef.current = setTimeout(() => {
          if (enabledRef.current) startListening();
        }, 1000);
      }
    };

    Voice.onSpeechResults = onResults;
    Voice.onSpeechEnd = onEnd;
    Voice.onSpeechError = onError;

    startListening();

    return () => {
      Voice.onSpeechResults = undefined;
      Voice.onSpeechEnd = undefined;
      Voice.onSpeechError = undefined;
      if (restartRef.current) clearTimeout(restartRef.current);
      stopListening();
    };
  }, [
    enabled,
    settings.wakeWord,
    settings.stopWord,
    settings.skipWord,
    actions,
    startListening,
    stopListening,
  ]);

  return {isListening, lastHeard};
}
