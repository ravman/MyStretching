import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View, StyleSheet, Platform, StatusBar,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import Tts from 'react-native-tts';

import HomeScreen    from './screens/HomeScreen';
import SessionScreen from './screens/SessionScreen';
import LibraryScreen from './screens/LibraryScreen';
import SettingsScreen from './screens/SettingsScreen';
import CompleteModal  from './components/CompleteModal';

import {useSession}      from './hooks/useSession';
import {useStorage}      from './hooks/useStorage';
import {useMusic}        from './hooks/useMusic';
import {useAlarmPolling, setupNotifications} from './hooks/useAlarms';

import {ALL_STRETCHES, QUICK_ROUTINES} from './data/stretches';
import {AppSettings, DEFAULT_SETTINGS, Stretch, Zone, ZONE_LABELS} from './data/types';
import {C} from './utils/theme';

// ── Navigator setup ──────────────────────────────
const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  Home: '🌅', Session: '▶️', Library: '📋', Settings: '⚙️',
};

export default function App() {
  // Persisted settings & extra stretches
  const [settings, setSettings] = useStorage<AppSettings>('settings', DEFAULT_SETTINGS);
  const [extraStretches, setExtraStretches] = useStorage<Stretch[]>('extraStretches', []);
  const [alarms] = useStorage<any[]>('alarms', []);

  // Session engine
  const session = useSession(settings);

  // Trainer text displayed in SessionScreen
  const [trainerText, setTrainerText] = useState(
    "Ready when you are. Tap Begin — or say your wake word.",
  );

  // Session metadata
  const [sessionTitle, setSessionTitle] = useState('Full Body Flow');
  const [showComplete, setShowComplete] = useState(false);

  // Music
  const [musicActive, setMusicActive] = useState(false);
  useMusic(settings.musicTrack, settings.musicVolume, musicActive);

  // TTS setup
  useEffect(() => {
    Tts.setDefaultRate(settings.speechRate, true);
    Tts.setDefaultPitch(1.0);
    // Update trainer bubble from TTS utterances — mirror via state
    Tts.addEventListener('tts-start', () => {});
  }, [settings.speechRate]);

  // Watch session state changes → update trainer text, show complete modal
  useEffect(() => {
    if (!session.currentStretch) return;
    const s = session.currentStretch;
    if (session.sessionState === 'idle') {
      setTrainerText(`Ready for: ${s.name}. Tap Begin.`);
    } else if (session.sessionState === 'playing') {
      // Mirror current cue — cues are spoken by useSession
      setTrainerText(s.cues[Math.min(session.activeStepIndex, s.cues.length - 1)]);
    } else if (session.sessionState === 'break') {
      const next = session.queue[session.index + 1];
      setTrainerText(next ? `Rest → ${next.name} coming up…` : 'Almost done!');
    }
  }, [
    session.sessionState,
    session.currentStretch,
    session.activeStepIndex,
    session.index,
    session.queue,
  ]);

  useEffect(() => {
    if (session.sessionState === 'done') {
      setShowComplete(true);
      setMusicActive(false);
    }
  }, [session.sessionState]);

  // ── Begin session helpers ────────────────────────
  const beginSession = useCallback((zone: Zone | 'all') => {
    const all = [...ALL_STRETCHES, ...extraStretches];
    const queue = zone === 'all' ? [...ALL_STRETCHES] : all.filter(s => s.zone === zone);
    const title = zone === 'all' ? 'Full Body Flow' : ZONE_LABELS[zone] ?? 'Custom';
    setSessionTitle(title);
    session.beginSession(queue);
    setMusicActive(true);
    setShowComplete(false);
  }, [session, extraStretches]);

  const beginQuick = useCallback((key: string) => {
    const r = QUICK_ROUTINES[key];
    if (!r) return;
    const queue = r.ids.map(id => ALL_STRETCHES.find(s => s.id === id)).filter(Boolean) as Stretch[];
    setSessionTitle(r.name);
    session.beginSession(queue);
    setMusicActive(true);
    setShowComplete(false);
  }, [session]);

  const quickStartOne = useCallback((stretch: Stretch) => {
    setSessionTitle(stretch.name);
    session.beginSession([stretch]);
    setMusicActive(true);
    setShowComplete(false);
  }, [session]);

  const handleEndSession = useCallback(() => {
    session.end();
    setMusicActive(false);
    setShowComplete(false);
  }, [session]);

  const handleAddStretch = useCallback((s: Stretch) => {
    setExtraStretches(prev => {
      if (prev.find(x => x.name === s.name)) return prev;
      return [...prev, s];
    });
  }, [setExtraStretches]);

  // ── Alarm polling (in-app) ───────────────────────
  useAlarmPolling(alarms, alarm => {
    session.speak(
      `Good morning! Time for your ${alarm.label} stretching session. Let's begin.`,
    );
  });

  // ── Notifications setup ──────────────────────────
  useEffect(() => { setupNotifications(); }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={C.bg}
          translucent={false}
        />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({route}) => ({
              headerShown: false,
              tabBarStyle: styles.tabBar,
              tabBarActiveTintColor: C.terra,
              tabBarInactiveTintColor: C.mist,
              tabBarLabelStyle: styles.tabLabel,
              tabBarIcon: ({focused}) => (
                <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
                  {TAB_ICONS[route.name]}
                </Text>
              ),
            })}>

            <Tab.Screen name="Home">
              {() => (
                <HomeScreen
                  onBeginSession={beginSession}
                  onBeginQuick={beginQuick}
                />
              )}
            </Tab.Screen>

            <Tab.Screen name="Session">
              {() => (
                <SessionScreen
                  sessionTitle={sessionTitle}
                  queue={session.queue}
                  index={session.index}
                  currentStretch={session.currentStretch}
                  timeLeft={session.timeLeft}
                  breakLeft={session.breakLeft}
                  sessionState={session.sessionState}
                  activeStepIndex={session.activeStepIndex}
                  progress={session.progress}
                  elapsedMinutes={session.elapsedMinutes}
                  settings={settings}
                  trainerText={trainerText}
                  onToggle={session.toggle}
                  onSkip={session.skip}
                  onEnd={handleEndSession}
                />
              )}
            </Tab.Screen>

            <Tab.Screen name="Library">
              {() => (
                <LibraryScreen
                  onQuickStart={quickStartOne}
                  extraStretches={extraStretches}
                  onAddStretch={handleAddStretch}
                />
              )}
            </Tab.Screen>

            <Tab.Screen name="Settings">
              {() => (
                <SettingsScreen
                  settings={settings}
                  onChange={setSettings}
                />
              )}
            </Tab.Screen>

          </Tab.Navigator>
        </NavigationContainer>

        {/* ── Session Complete Modal ── */}
        <CompleteModal
          visible={showComplete}
          minutes={session.elapsedMinutes}
          stretchCount={session.queue.length}
          onClose={() => {
            setShowComplete(false);
            session.end();
          }}
        />

      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  tabBar: {
    backgroundColor: C.panel,
    borderTopWidth: 1,
    borderTopColor: C.warm1,
    paddingBottom: Platform.OS === 'ios' ? 4 : 6,
    paddingTop: 6,
    height: Platform.OS === 'ios' ? 80 : 62,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  tabIcon: {fontSize: 18, opacity: 0.5},
  tabIconActive: {opacity: 1},
});
