import React, {useCallback, useEffect, useRef} from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, ScrollView, Easing,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {C, F, radius} from '../utils/theme';
import TimerRing from '../components/TimerRing';
import StretchIllustration from '../components/StretchIllustration';
import {SessionState} from '../hooks/useSession';
import {Stretch, ZONE_COLORS, ZONE_LABELS, Zone, AppSettings} from '../data/types';
import {useVoiceControl} from '../hooks/useVoiceControl';

interface Props {
  sessionTitle: string;
  queue: Stretch[];
  index: number;
  currentStretch: Stretch | null;
  timeLeft: number;
  breakLeft: number;
  sessionState: SessionState;
  activeStepIndex: number;
  progress: number;
  elapsedMinutes: number;
  settings: AppSettings;
  trainerText: string;
  onToggle: () => void;
  onSkip: () => void;
  onEnd: () => void;
}

export default function SessionScreen({
  sessionTitle, queue, index, currentStretch,
  timeLeft, breakLeft, sessionState,
  activeStepIndex, progress, elapsedMinutes,
  settings, trainerText,
  onToggle, onSkip, onEnd,
}: Props) {

  // Zone-based background colors
  const zone = currentStretch?.zone ?? 'default';
  const zc = ZONE_COLORS[zone as Zone] ?? ZONE_COLORS.default;

  // Animated background transition
  const bgAnim = useRef(new Animated.Value(0)).current;
  const prevZone = useRef(zone);

  useEffect(() => {
    if (prevZone.current !== zone) {
      bgAnim.setValue(0);
      Animated.timing(bgAnim, {
        toValue: 1, duration: 1000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }).start(() => { prevZone.current = zone; });
    }
  }, [zone, bgAnim]);

  // Floating particles
  const particles = useRef(
    Array.from({length: 10}, (_, i) => ({
      x: Math.random() * 100,
      delay: i * 700,
      duration: 7000 + Math.random() * 5000,
      size: 4 + Math.random() * 8,
      anim: new Animated.Value(0),
    })),
  ).current;

  useEffect(() => {
    particles.forEach(p => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(p.delay),
          Animated.timing(p.anim, {
            toValue: 1, duration: p.duration,
            easing: Easing.linear, useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
    });
  }, [particles]);

  // Voice control
  const voiceActions = useCallback(
    () => ({
      onWake: onToggle,
      onStop: () => { if (sessionState === 'playing') onToggle(); },
      onSkip,
    }),
    [onToggle, onSkip, sessionState],
  );
  const {isListening, lastHeard} = useVoiceControl(
    settings,
    voiceActions(),
    settings.voiceEnabled,
  );

  // Play/pause button label
  const btnLabel = (() => {
    if (sessionState === 'break') return `Rest… ${breakLeft}s`;
    if (sessionState === 'idle')  return index === 0 ? '▶  Begin' : '▶  Start';
    if (sessionState === 'playing') return '⏸  Pause';
    return '▶  Resume';
  })();

  const timerFraction =
    currentStretch && sessionState !== 'break'
      ? timeLeft / Math.round(currentStretch.duration * settings.pace)
      : 1;

  return (
    <View style={styles.root}>
      {/* ── Gradient Background ── */}
      <LinearGradient
        colors={[zc.bgStart, zc.bgEnd]}
        style={StyleSheet.absoluteFill}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}
      />

      {/* ── Floating Particles ── */}
      {particles.map((p, i) => {
        const translateY = p.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [400, -80],
        });
        const opacity = p.anim.interpolate({
          inputRange: [0, 0.15, 0.8, 1],
          outputRange: [0, 0.18, 0.08, 0],
        });
        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: `${p.x}%` as any,
                width: p.size, height: p.size,
                borderRadius: p.size / 2,
                backgroundColor: zc.accent,
                transform: [{translateY}],
                opacity,
              },
            ]}
          />
        );
      })}

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onEnd} style={styles.endBtn}>
            <Text style={styles.endBtnText}>✕ End</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{sessionTitle}</Text>
          <Text style={styles.headerStep}>{index + 1}/{queue.length}</Text>
        </View>

        {/* ── Progress Bar ── */}
        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <Animated.View
              style={[
                styles.progressFill,
                {width: `${Math.max(progress * 100, 1.5)}%`},
              ]}
            />
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}>

          {/* ── SVG Illustration ── */}
          {currentStretch && (
            <View style={styles.illustrationWrap}>
              {/* Glow orb behind illustration */}
              <View style={[styles.illustGlow, {backgroundColor: currentStretch.glowColor}]} />
              <StretchIllustration stretch={currentStretch} size={300} />
            </View>
          )}

          {/* ── Zone & Name ── */}
          <Text style={styles.zoneBadge}>
            {currentStretch ? (ZONE_LABELS[currentStretch.zone] ?? currentStretch.zone).toUpperCase() : ''}
          </Text>
          <Text style={styles.stretchName}>
            {sessionState === 'break'
              ? `Rest — ${queue[index + 1]?.name ?? ''} next`
              : (currentStretch?.name ?? '')}
          </Text>

          {/* ── Step List (highlights active step) ── */}
          {currentStretch && sessionState !== 'break' && (
            <View style={styles.stepList}>
              {currentStretch.steps.map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  <Text style={[
                    styles.stepBullet,
                    i === activeStepIndex && styles.stepBulletActive,
                  ]}>
                    {i === activeStepIndex ? '▸' : '·'}
                  </Text>
                  <Text style={[
                    styles.stepText,
                    i === activeStepIndex && styles.stepTextActive,
                  ]}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* ── Timer Ring ── */}
          <View style={styles.timerWrap}>
            <TimerRing
              progress={sessionState === 'break' ? breakLeft / settings.breakDuration : timerFraction}
              timeLeft={sessionState === 'break' ? breakLeft : timeLeft}
              accentColor={zc.accent}
              size={160}
              onPress={onToggle}>
              <View style={styles.timerInner}>
                <Text style={styles.timerNum}>
                  {sessionState === 'break'
                    ? breakLeft
                    : `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`}
                </Text>
                <Text style={styles.timerSub}>
                  {sessionState === 'break' ? 'REST' : 'REMAINING'}
                </Text>
              </View>
            </TimerRing>
          </View>

          {/* ── Trainer Bubble ── */}
          <View style={styles.trainerBubble}>
            <View style={styles.trainerAvatar}>
              <Text style={{fontSize: 14}}>🧘</Text>
            </View>
            <Text style={styles.trainerText}>{trainerText}</Text>
          </View>

          {/* ── Tip ── */}
          {currentStretch?.tip && sessionState !== 'break' && (
            <View style={styles.tipBox}>
              <Text style={styles.tipLabel}>TIP</Text>
              <Text style={styles.tipText}>{currentStretch.tip}</Text>
            </View>
          )}

        </ScrollView>

        {/* ── Voice Bar ── */}
        <View style={styles.voiceBar}>
          <View style={[
            styles.voiceDot,
            isListening && styles.voiceDotOn,
          ]} />
          <Text style={styles.voiceBarText}>
            {isListening
              ? `🎙 Listening · "${settings.wakeWord}" / "${settings.stopWord}" / "${settings.skipWord}"`
              : 'Voice off · Enable in Home tab'}
          </Text>
        </View>

        {/* ── Controls ── */}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={onToggle}
            style={[styles.btnPlay, sessionState === 'break' && styles.btnPlayBreak]}
            activeOpacity={0.85}>
            <Text style={styles.btnPlayText}>{btnLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSkip}
            style={styles.btnSkip}
            activeOpacity={0.85}>
            <Text style={styles.btnSkipText}>Skip →</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  safe: {flex: 1},
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 18, paddingTop: 8, paddingBottom: 6,
  },
  endBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.pill, paddingVertical: 7, paddingHorizontal: 14,
  },
  endBtnText: {fontSize: 12, color: C.white, fontFamily: F.body},
  headerTitle: {
    flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.6)',
    fontFamily: F.body, textAlign: 'center',
  },
  headerStep: {
    fontFamily: F.display, fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
  },

  progressWrap: {paddingHorizontal: 18, marginBottom: 6},
  progressBg: {height: 2, backgroundColor: 'rgba(255,255,255,0.09)', borderRadius: 1},
  progressFill: {
    height: 2, borderRadius: 1,
    backgroundColor: C.gold,
  },

  particle: {position: 'absolute'},

  scroll: {flex: 1},
  scrollContent: {
    alignItems: 'center', paddingHorizontal: 18,
    paddingTop: 8, paddingBottom: 16, gap: 10,
  },

  illustrationWrap: {
    width: 300, height: 200, alignItems: 'center',
    justifyContent: 'center', position: 'relative',
  },
  illustGlow: {
    position: 'absolute',
    width: 160, height: 160, borderRadius: 80,
    opacity: 0.2,
    // blur via shadow
    shadowColor: C.gold,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 0,
  },

  zoneBadge: {
    fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.5)', fontFamily: F.body,
  },
  stretchName: {
    fontFamily: F.display, fontSize: 26, fontWeight: '400',
    color: C.white, textAlign: 'center', lineHeight: 32,
  },

  stepList: {width: '100%', maxWidth: 320, gap: 2},
  stepRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 6},
  stepBullet: {
    fontSize: 14, color: 'rgba(255,255,255,0.35)',
    fontFamily: F.body, width: 14, marginTop: 1,
  },
  stepBulletActive: {color: C.gold},
  stepText: {
    flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.55)',
    fontFamily: F.body, lineHeight: 20,
  },
  stepTextActive: {color: C.white, fontWeight: '500'},

  timerWrap: {marginVertical: 4},
  timerInner: {alignItems: 'center'},
  timerNum: {
    fontFamily: F.display, fontSize: 42, fontWeight: '400',
    color: C.white, letterSpacing: -2,
  },
  timerSub: {
    fontSize: 9, letterSpacing: 2, textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.3)', fontFamily: F.body,
  },

  trainerBubble: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.md, padding: 12,
    width: '100%', maxWidth: 340,
  },
  trainerAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: C.sage, alignItems: 'center', justifyContent: 'center',
  },
  trainerText: {
    flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.82)',
    fontFamily: F.body, lineHeight: 18,
  },

  tipBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderLeftWidth: 3, borderLeftColor: C.gold,
    borderRadius: radius.sm, padding: 12,
    width: '100%', maxWidth: 340,
  },
  tipLabel: {
    fontSize: 9, fontWeight: '700', letterSpacing: 1.5,
    color: C.gold, fontFamily: F.body, marginBottom: 3,
  },
  tipText: {fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: F.body, lineHeight: 17},

  voiceBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 18, paddingVertical: 7,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)',
  },
  voiceDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  voiceDotOn: {backgroundColor: '#E55'},
  voiceBarText: {
    fontSize: 10, color: 'rgba(255,255,255,0.38)',
    fontFamily: F.body, flex: 1,
  },

  controls: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: 18, paddingBottom: 10, paddingTop: 6,
  },
  btnPlay: {
    flex: 2, backgroundColor: C.white, borderRadius: radius.pill,
    paddingVertical: 14, alignItems: 'center', justifyContent: 'center',
  },
  btnPlayBreak: {backgroundColor: C.sage},
  btnPlayText: {
    fontSize: 14, fontWeight: '700', color: C.deep, fontFamily: F.body,
  },
  btnSkip: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.pill,
    paddingVertical: 14, alignItems: 'center', justifyContent: 'center',
  },
  btnSkipText: {fontSize: 14, fontWeight: '600', color: C.white, fontFamily: F.body},
});
