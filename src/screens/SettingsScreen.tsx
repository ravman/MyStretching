import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import {C, F, radius} from '../utils/theme';
import {Toggle, Divider} from '../components/UI';
import {AppSettings, DEFAULT_SETTINGS} from '../data/types';

interface Props {
  settings: AppSettings;
  onChange: (s: AppSettings) => void;
}

const PACES = [
  {value: 0.75, label: 'Quick (75%)'},
  {value: 1.0,  label: 'Normal'},
  {value: 1.25, label: 'Gentle (125%)'},
  {value: 1.5,  label: 'Slow (150%)'},
];

const BREAKS = [3, 5, 8, 10];

export default function SettingsScreen({settings, onChange}: Props) {
  const set = <K extends keyof AppSettings>(key: K, val: AppSettings[K]) =>
    onChange({...settings, [key]: val});

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <Text style={styles.pageTitle}>Settings</Text>

        {/* ── VOICE ACTIVATION ── */}
        <Section title="🎙 Voice Activation">
          <SettingRow
            icon="▶️"
            label="Wake Word"
            desc="Say this to start / resume">
            <TextInput
              style={styles.wordInput}
              value={settings.wakeWord}
              onChangeText={v => set('wakeWord', v.toLowerCase().trim())}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              placeholderTextColor={C.mist}
            />
          </SettingRow>
          <Divider />
          <SettingRow
            icon="⏹️"
            label="Stop Word"
            desc="Say this to pause / stop">
            <TextInput
              style={styles.wordInput}
              value={settings.stopWord}
              onChangeText={v => set('stopWord', v.toLowerCase().trim())}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              placeholderTextColor={C.mist}
            />
          </SettingRow>
          <Divider />
          <SettingRow
            icon="⏭️"
            label="Skip Word"
            desc="Say this to skip a stretch">
            <TextInput
              style={styles.wordInput}
              value={settings.skipWord}
              onChangeText={v => set('skipWord', v.toLowerCase().trim())}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              placeholderTextColor={C.mist}
            />
          </SettingRow>
          <Divider />
          <SettingRow
            icon="🎙"
            label="Enable Voice"
            desc="Continuous microphone listening">
            <Toggle
              value={settings.voiceEnabled}
              onChange={v => set('voiceEnabled', v)}
            />
          </SettingRow>
        </Section>

        {/* ── AUDIO ── */}
        <Section title="🎵 Audio">
          <SettingRow icon="🔊" label="Music Volume">
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              step={0.05}
              value={settings.musicVolume}
              onValueChange={v => set('musicVolume', v)}
              minimumTrackTintColor={C.terra}
              maximumTrackTintColor={C.warm2}
              thumbTintColor={C.terra}
            />
          </SettingRow>
          <Divider />
          <SettingRow icon="🗣️" label="Trainer Volume">
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              step={0.05}
              value={settings.trainerVolume}
              onValueChange={v => set('trainerVolume', v)}
              minimumTrackTintColor={C.terra}
              maximumTrackTintColor={C.warm2}
              thumbTintColor={C.terra}
            />
          </SettingRow>
          <Divider />
          <SettingRow icon="🎚️" label="Speech Rate">
            <Slider
              style={styles.slider}
              minimumValue={0.6}
              maximumValue={1.4}
              step={0.05}
              value={settings.speechRate}
              onValueChange={v => set('speechRate', v)}
              minimumTrackTintColor={C.terra}
              maximumTrackTintColor={C.warm2}
              thumbTintColor={C.terra}
            />
          </SettingRow>
        </Section>

        {/* ── TIMING ── */}
        <Section title="⏱ Timing">
          <SettingRow icon="🐢" label="Pace" desc="Duration multiplier">
            <View style={styles.segControl}>
              {PACES.map(p => (
                <TouchableOpacity
                  key={p.value}
                  onPress={() => set('pace', p.value)}
                  style={[styles.seg, settings.pace === p.value && styles.segSel]}
                  activeOpacity={0.8}>
                  <Text style={[styles.segText, settings.pace === p.value && styles.segTextSel]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </SettingRow>
          <Divider />
          <SettingRow icon="⏸️" label="Rest Between Stretches">
            <View style={styles.segControl}>
              {BREAKS.map(b => (
                <TouchableOpacity
                  key={b}
                  onPress={() => set('breakDuration', b)}
                  style={[styles.seg, settings.breakDuration === b && styles.segSel]}
                  activeOpacity={0.8}>
                  <Text style={[styles.segText, settings.breakDuration === b && styles.segTextSel]}>
                    {b}s
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </SettingRow>
        </Section>

        {/* ── RESET ── */}
        <TouchableOpacity
          onPress={() => onChange(DEFAULT_SETTINGS)}
          style={styles.resetBtn}
          activeOpacity={0.8}>
          <Text style={styles.resetText}>Reset to Defaults</Text>
        </TouchableOpacity>

        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Helpers ──────────────────────────────────────
function Section({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function SettingRow({
  icon, label, desc, children,
}: {icon: string; label: string; desc?: string; children: React.ReactNode}) {
  return (
    <View style={styles.srow}>
      <Text style={styles.srowIcon}>{icon}</Text>
      <View style={styles.srowInfo}>
        <Text style={styles.srowLabel}>{label}</Text>
        {desc && <Text style={styles.srowDesc}>{desc}</Text>}
      </View>
      <View style={styles.srowCtrl}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: C.bg},
  scroll: {flex: 1},
  content: {padding: 16, gap: 16},
  pageTitle: {
    fontFamily: F.display, fontSize: 28, fontWeight: '400', color: C.deep,
  },

  section: {
    backgroundColor: C.panel, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: C.warm1, overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 10, fontWeight: '700', letterSpacing: 1.8,
    textTransform: 'uppercase', color: C.mist, fontFamily: F.body,
    padding: 14, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: C.warm1,
  },
  sectionBody: {},

  srow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14,
  },
  srowIcon: {fontSize: 18},
  srowInfo: {flex: 1},
  srowLabel: {fontSize: 13, fontWeight: '600', color: C.ink, fontFamily: F.body},
  srowDesc:  {fontSize: 11, color: C.mist, fontFamily: F.body, marginTop: 1},
  srowCtrl:  {alignItems: 'flex-end'},

  wordInput: {
    backgroundColor: C.soft, borderWidth: 1.5, borderColor: C.warm1,
    borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 7,
    fontSize: 13, color: C.ink, fontFamily: F.body, minWidth: 110,
    textAlign: 'center',
  },

  slider: {width: 120, height: 36},

  segControl: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 4, justifyContent: 'flex-end',
    maxWidth: 200,
  },
  seg: {
    backgroundColor: C.soft, borderWidth: 1.5, borderColor: C.warm1,
    borderRadius: radius.sm, paddingVertical: 6, paddingHorizontal: 10,
  },
  segSel: {backgroundColor: C.terra, borderColor: C.terra},
  segText: {fontSize: 11, color: C.ink, fontFamily: F.body, fontWeight: '500'},
  segTextSel: {color: C.white},

  resetBtn: {
    alignSelf: 'center',
    borderWidth: 1.5, borderColor: C.warm2,
    borderRadius: radius.pill,
    paddingVertical: 10, paddingHorizontal: 28,
  },
  resetText: {fontSize: 13, color: C.mist, fontFamily: F.body},
});
