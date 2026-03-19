/**
 * Ambient music via pre-baked silent mp3 placeholder.
 * In production: bundle ambient OGG/MP3 assets per track under
 * android/app/src/main/res/raw/ and ios/MyStretching/Sounds/.
 *
 * Track keys map to filenames: forest.mp3, rain.mp3, bowls.mp3,
 * ocean.mp3, piano.mp3, birds.mp3
 */
import {useRef, useCallback, useEffect} from 'react';
import Sound from 'react-native-sound';

Sound.setCategory('Playback', true);

const TRACK_FILES: Record<string, string> = {
  forest: 'forest.mp3',
  rain:   'rain.mp3',
  bowls:  'bowls.mp3',
  ocean:  'ocean.mp3',
  piano:  'piano.mp3',
  birds:  'birds.mp3',
};

export function useMusic(track: string, volume: number, autoPlay: boolean) {
  const soundRef = useRef<Sound | null>(null);
  const playingRef = useRef(false);

  const stop = useCallback(() => {
    soundRef.current?.stop(() => soundRef.current?.release());
    soundRef.current = null;
    playingRef.current = false;
  }, []);

  const play = useCallback(() => {
    stop();
    const file = TRACK_FILES[track] ?? TRACK_FILES.forest;
    const s = new Sound(file, Sound.MAIN_BUNDLE, err => {
      if (err) return; // file not yet bundled — silent fail
      s.setVolume(volume);
      s.setNumberOfLoops(-1); // infinite loop
      s.play();
      playingRef.current = true;
    });
    soundRef.current = s;
  }, [track, volume, stop]);

  // Start / stop based on autoPlay
  useEffect(() => {
    if (autoPlay) play();
    else stop();
    return stop;
  }, [autoPlay, play, stop]);

  // Volume changes
  useEffect(() => {
    soundRef.current?.setVolume(volume);
  }, [volume]);

  return {play, stop};
}
