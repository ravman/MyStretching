import {useState, useRef, useCallback, useEffect} from 'react';
import Tts from 'react-native-tts';
import {Stretch} from '../data/types';
import {AppSettings} from '../data/types';

export type SessionState = 'idle' | 'playing' | 'paused' | 'break' | 'done';

export function useSession(settings: AppSettings) {
  const [queue, setQueue] = useState<Stretch[]>([]);
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [breakLeft, setBreakLeft] = useState(0);
  const [state, setState] = useState<SessionState>('idle');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cueIndexRef = useRef(0);
  const totalRef = useRef(0);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const speak = useCallback(
    (text: string) => {
      Tts.stop();
      Tts.setDefaultRate(settings.speechRate, true);
      Tts.setDefaultPitch(1.0);
      Tts.speak(text);
    },
    [settings.speechRate],
  );

  const currentStretch = queue[index] ?? null;

  // Start or load a session
  const beginSession = useCallback(
    (stretches: Stretch[]) => {
      clearTimer();
      Tts.stop();
      setQueue(stretches);
      setIndex(0);
      setStartedAt(Date.now());
      setState('idle');
      cueIndexRef.current = 0;
      const first = stretches[0];
      if (first) {
        const dur = Math.round(first.duration * settings.pace);
        setTimeLeft(dur);
        totalRef.current = dur;
        setActiveStepIndex(0);
      }
      speak(
        "Welcome to your stretching session. Find a comfortable space. When you're ready, tap Begin — or say your wake word.",
      );
    },
    [settings.pace, speak],
  );

  // Load a specific stretch index (used after advance)
  const loadStretch = useCallback(
    (stretches: Stretch[], idx: number) => {
      const s = stretches[idx];
      if (!s) return;
      clearTimer();
      cueIndexRef.current = 0;
      const dur = Math.round(s.duration * settings.pace);
      setTimeLeft(dur);
      totalRef.current = dur;
      setIndex(idx);
      setActiveStepIndex(0);
      setState('idle');
    },
    [settings.pace],
  );

  const play = useCallback(() => {
    if (!currentStretch) return;
    if (!startedAt) setStartedAt(Date.now());
    setState('playing');
    const s = currentStretch;
    const total = totalRef.current;
    const cueStep = Math.floor(total / s.cues.length);

    speak(s.cues[0]);
    cueIndexRef.current = 1;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        const elapsed = total - next;

        // Step highlight
        const stepIdx = Math.min(
          Math.floor((elapsed / total) * s.steps.length),
          s.steps.length - 1,
        );
        setActiveStepIndex(stepIdx);

        // Cue dispatch
        if (
          cueIndexRef.current < s.cues.length &&
          elapsed >= cueIndexRef.current * cueStep
        ) {
          speak(s.cues[cueIndexRef.current]);
          cueIndexRef.current++;
        }

        if (next <= 0) {
          clearTimer();
          return 0;
        }
        return next;
      });
    }, 1000);
  }, [currentStretch, startedAt, speak]);

  // When timeLeft hits 0, advance automatically
  useEffect(() => {
    if (state === 'playing' && timeLeft === 0) {
      advance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, state]);

  const pause = useCallback(() => {
    clearTimer();
    setState('paused');
    speak('Paused. Rest as long as you need.');
  }, [speak]);

  const toggle = useCallback(() => {
    if (state === 'idle' || state === 'paused') play();
    else if (state === 'playing') pause();
  }, [state, play, pause]);

  const advance = useCallback(() => {
    clearTimer();
    const nextIdx = index + 1;
    if (nextIdx >= queue.length) {
      setState('done');
      Tts.stop();
      speak(
        'Wonderful work. You have completed your full stretching session. Your body is grateful.',
      );
      return;
    }
    const next = queue[nextIdx];
    setState('break');
    speak(`Well done. Rest for ${settings.breakDuration} seconds. Next: ${next.name}.`);
    setBreakLeft(settings.breakDuration);

    let br = settings.breakDuration;
    timerRef.current = setInterval(() => {
      br--;
      setBreakLeft(br);
      if (br <= 0) {
        clearTimer();
        loadStretch(queue, nextIdx);
        // auto-play after break
        setTimeout(() => play(), 400);
      }
    }, 1000);
  }, [index, queue, settings.breakDuration, loadStretch, play, speak]);

  const skip = useCallback(() => {
    clearTimer();
    advance();
  }, [advance, clearTimer]);

  const end = useCallback(() => {
    clearTimer();
    Tts.stop();
    setState('idle');
    setQueue([]);
    setIndex(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => clearTimer(), []);

  const progress =
    queue.length > 0
      ? (index + (totalRef.current > 0 ? 1 - timeLeft / totalRef.current : 0)) /
        queue.length
      : 0;

  const elapsedMinutes = startedAt
    ? Math.max(1, Math.round((Date.now() - startedAt) / 60000))
    : 0;

  return {
    queue,
    index,
    currentStretch,
    timeLeft,
    breakLeft,
    state,
    activeStepIndex,
    progress,
    elapsedMinutes,
    beginSession,
    toggle,
    skip,
    end,
    speak,
  };
}
