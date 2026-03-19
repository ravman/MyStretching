import React, {useCallback, useState} from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Alert, Modal, TextInput, Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {C, F, radius, shadow} from '../utils/theme';
import {Button, Card, SectionLabel, Toggle, Row, Chip} from '../components/UI';
import {ALL_STRETCHES, QUICK_ROUTINES} from '../data/stretches';
import {
  Alarm, AppSettings, Zone, ZONE_LABELS, DEFAULT_SETTINGS,
} from '../data/types';
import {useStorage} from '../hooks/useStorage';
import {scheduleAlarms} from '../hooks/useAlarms';

const ZONES: Array<{zone: Zone | 'all'; emoji: string; label: string; count: string}> = [
  {zone: 'all',       emoji: '✨', label: 'Full Body',       count: '20 stretches'},
  {zone: 'neck',      emoji: '🤸', label: 'Neck & Head',     count: '3 stretches'},
  {zone: 'shoulders', emoji: '💪', label: 'Shoulders & Arms',count: '4 stretches'},
  {zone: 'back',      emoji: '🧘', label: 'Back & Spine',    count: '4 stretches'},
  {zone: 'core',      emoji: '🌀', label: 'Core & Hips',     count: '4 stretches'},
  {zone: 'legs',      emoji: '🦵', label: 'Legs & Knees',    count: '3 stretches'},
  {zone: 'feet',      emoji: '🦶', label: 'Ankles & Feet',   count: '2 stretches'},
];

const TRACKS = [
  {key:'forest', label:'🌲 Forest'},
  {key:'rain',   label:'🌧 Rain'},
  {key:'bowls',  label:'🔔 Bowls'},
  {key:'ocean',  label:'🌊 Ocean'},
  {key:'piano',  label:'🎹 Piano'},
  {key:'birds',  label:'🐦 Birds'},
];

interface Props {
  onBeginSession: (zone: Zone | 'all') => void;
  onBeginQuick: (key: string) => void;
}

export default function HomeScreen({onBeginSession, onBeginQuick}: Props) {
  const [selectedZone, setSelectedZone] = useState<Zone | 'all'>('all');
  const [alarms, setAlarms]       = useStorage<Alarm[]>('alarms', []);
  const [settings, setSettings]   = useStorage<AppSettings>('settings', DEFAULT_SETTINGS);

  // Alarm modal state
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [alarmTime, setAlarmTime]   = useState('06:30');
  const [alarmLabel, setAlarmLabel] = useState('');
  const [alarmZone, setAlarmZone]   = useState<Zone | 'all'>('all');

  const saveAlarm = useCallback(() => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: alarmTime,
      label: alarmLabel || (alarmZone === 'all' ? 'Full Body' : ZONE_LABELS[alarmZone]),
      zone: alarmZone,
      enabled: true,
    };
    const updated = [...alarms, newAlarm];
    setAlarms(updated);
    scheduleAlarms(updated);
    setShowAlarmModal(false);
    setAlarmLabel('');
    setAlarmTime('06:30');
    setAlarmZone('all');
  }, [alarmTime, alarmLabel, alarmZone, alarms, setAlarms]);

  const deleteAlarm = useCallback((id: string) => {
    Alert.alert('Delete Reminder', 'Remove this reminder?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete', style: 'destructive',
        onPress: () => {
          const updated = alarms.filter(a => a.id !== id);
          setAlarms(updated);
          scheduleAlarms(updated);
        },
      },
    ]);
  }, [alarms, setAlarms]);

  const toggleAlarm = useCallback((id: string, val: boolean) => {
    const updated = alarms.map(a => a.id === id ? {...a, enabled: val} : a);
    setAlarms(updated);
    scheduleAlarms(updated);
  }, [alarms, setAlarms]);

  const formatTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${(h % 12) || 12}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* ── HERO ── */}
        <View style={styles.hero}>
          <View style={styles.heroDecor1} />
          <View style={styles.heroDecor2} />
          <Text style={styles.heroBadge}>DAILY MORNING RITUAL</Text>
          <Text style={styles.heroTitle}>My {'\n'}<Text style={styles.heroTitleItalic}>Stretching</Text></Text>
          <Text style={styles.heroSub}>20 stretches · neck to toes · voice-guided</Text>
          <Row style={styles.heroBtns}>
            <Button
              label="▶  Start Flow"
              onPress={() => onBeginSession(selectedZone)}
              style={styles.heroBtn}
              textStyle={{color: C.terra, fontSize: 14}}
              variant="secondary"
            />
            <Button
              label={settings.voiceEnabled ? '🎙 Voice On' : '🎙 Voice Off'}
              onPress={() => setSettings(s => ({...s, voiceEnabled: !s.voiceEnabled}))}
              variant="ghost"
              style={styles.heroVoiceBtn}
              textStyle={{color: 'rgba(255,255,255,0.85)', fontSize: 12}}
            />
          </Row>
        </View>

        {/* ── BODY AREA SELECTOR ── */}
        <SectionLabel text="Select body area for today" />
        <View style={styles.zoneGrid}>
          {ZONES.map(z => (
            <TouchableOpacity
              key={z.zone}
              onPress={() => setSelectedZone(z.zone)}
              activeOpacity={0.8}
              style={[
                styles.zoneChip,
                z.zone === 'all' && styles.zoneChipAll,
                selectedZone === z.zone && styles.zoneChipSel,
                z.zone === 'all' && selectedZone === z.zone && styles.zoneChipAllSel,
              ]}>
              <View style={[
                styles.zoneDot,
                z.zone === 'all' && {backgroundColor: C.gold},
                selectedZone === z.zone && z.zone !== 'all' && {backgroundColor: C.clay},
              ]} />
              <Text style={styles.zoneEmoji}>{z.emoji}</Text>
              <View style={styles.zoneInfo}>
                <Text style={[
                  styles.zoneName,
                  z.zone === 'all' && {color: C.white},
                ]}>{z.label}</Text>
                <Text style={[
                  styles.zoneCount,
                  z.zone === 'all' && {color: 'rgba(255,255,255,0.45)'},
                ]}>{z.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── QUICK ROUTINES ── */}
        <SectionLabel text="Quick routines" />
        <Row style={styles.quickRow}>
          {Object.entries(QUICK_ROUTINES).map(([key, r]) => {
            const icons: Record<string, string> = {quick5:'⚡', mobility:'🦋', evening:'🌙'};
            return (
              <TouchableOpacity
                key={key}
                onPress={() => onBeginQuick(key)}
                activeOpacity={0.8}
                style={[styles.quickCard, shadow.card]}>
                <Text style={styles.quickEmoji}>{icons[key]}</Text>
                <Text style={styles.quickName}>{r.name}</Text>
                <Text style={styles.quickDur}>{r.ids.length} stretches</Text>
              </TouchableOpacity>
            );
          })}
        </Row>

        {/* ── VOICE ACTIVATION STATUS ── */}
        <SectionLabel text="Voice activation" />
        <Card style={styles.voiceCard}>
          <Row>
            <View style={styles.voiceInfo}>
              <Text style={styles.cardTitle}>Voice Control</Text>
              <Text style={styles.cardSub}>
                Wake: <Text style={styles.wordHighlight}>"{settings.wakeWord}"</Text>
                {'  '}Stop: <Text style={styles.wordHighlight}>"{settings.stopWord}"</Text>
                {'  '}Skip: <Text style={styles.wordHighlight}>"{settings.skipWord}"</Text>
              </Text>
            </View>
            <View style={[
              styles.voiceDot,
              settings.voiceEnabled && styles.voiceDotOn,
            ]} />
            <Toggle
              value={settings.voiceEnabled}
              onChange={v => setSettings(s => ({...s, voiceEnabled: v}))}
            />
          </Row>
        </Card>

        {/* ── ALARMS ── */}
        <SectionLabel text="Reminders" />
        {alarms.length === 0 && (
          <Text style={styles.emptyText}>No reminders yet. Add one below.</Text>
        )}
        {alarms.map(alarm => (
          <Card key={alarm.id} style={styles.alarmCard}>
            <Row>
              <View style={{flex: 1}}>
                <Row>
                  <Text style={styles.alarmTime}>{formatTime(alarm.time)}</Text>
                  <View style={styles.alarmTag}>
                    <Text style={styles.alarmTagText}>{alarm.label}</Text>
                  </View>
                </Row>
                <Text style={styles.alarmZone}>
                  {alarm.zone === 'all' ? 'Full Body' : ZONE_LABELS[alarm.zone as Zone]} stretches
                </Text>
              </View>
              <TouchableOpacity onPress={() => deleteAlarm(alarm.id)} style={styles.delBtn}>
                <Text style={styles.delBtnText}>🗑</Text>
              </TouchableOpacity>
              <Toggle
                value={alarm.enabled}
                onChange={v => toggleAlarm(alarm.id, v)}
              />
            </Row>
          </Card>
        ))}
        <TouchableOpacity
          onPress={() => setShowAlarmModal(true)}
          style={styles.addAlarmBtn}>
          <Text style={styles.addAlarmText}>+ Add reminder</Text>
        </TouchableOpacity>

        {/* ── MUSIC ── */}
        <SectionLabel text="Background music" />
        <Card>
          <Row style={{marginBottom: 12}}>
            <Text style={{fontSize: 22, marginRight: 10}}>🎵</Text>
            <View style={{flex: 1}}>
              <Text style={styles.cardTitle}>Ambient Music</Text>
              <Text style={styles.cardSub}>Plays during your session</Text>
            </View>
          </Row>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Row>
              {TRACKS.map(t => (
                <Chip
                  key={t.key}
                  label={t.label}
                  selected={settings.musicTrack === t.key}
                  onPress={() => setSettings(s => ({...s, musicTrack: t.key}))}
                />
              ))}
            </Row>
          </ScrollView>
        </Card>

        <View style={{height: 32}} />
      </ScrollView>

      {/* ── ADD ALARM MODAL ── */}
      <Modal
        visible={showAlarmModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAlarmModal(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAlarmModal(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add Reminder</Text>
            <Text style={styles.modalSub}>Set a time and choose which stretches this reminder triggers.</Text>

            <Text style={styles.formLabel}>TIME</Text>
            <TextInput
              style={styles.formInput}
              value={alarmTime}
              onChangeText={setAlarmTime}
              placeholder="06:30"
              placeholderTextColor={C.mist}
              keyboardType="numbers-and-punctuation"
            />

            <Text style={styles.formLabel}>LABEL (OPTIONAL)</Text>
            <TextInput
              style={styles.formInput}
              value={alarmLabel}
              onChangeText={setAlarmLabel}
              placeholder="e.g. Morning Wake-Up"
              placeholderTextColor={C.mist}
            />

            <Text style={styles.formLabel}>BODY AREA</Text>
            <View style={styles.zoneGridSmall}>
              {ZONES.map(z => (
                <TouchableOpacity
                  key={z.zone}
                  onPress={() => setAlarmZone(z.zone)}
                  style={[
                    styles.zoneOptSmall,
                    alarmZone === z.zone && styles.zoneOptSel,
                  ]}>
                  <Text style={styles.zoneOptText}>
                    {z.emoji} {z.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button label="Save Reminder" onPress={saveAlarm} style={{marginTop: 20}} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: C.bg},
  scroll: {flex: 1},
  content: {padding: 16, gap: 16},

  // Hero
  hero: {
    backgroundColor: '#6B3F22',
    borderRadius: radius.xl,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  heroDecor1: {
    position: 'absolute', top: -50, right: -50,
    width: 170, height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  heroDecor2: {
    position: 'absolute', bottom: -30, left: 10,
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroBadge: {
    fontSize: 10, letterSpacing: 2.5, color: 'rgba(255,255,255,0.6)',
    fontFamily: F.body, marginBottom: 6,
  },
  heroTitle: {
    fontFamily: F.display, fontSize: 38, fontWeight: '400',
    color: C.white, lineHeight: 42, marginBottom: 4,
  },
  heroTitleItalic: {fontStyle: 'italic', opacity: 0.85},
  heroSub: {
    fontSize: 11, color: 'rgba(255,255,255,0.55)',
    fontFamily: F.body, marginBottom: 18,
  },
  heroBtns: {gap: 10, flexWrap: 'wrap'},
  heroBtn: {
    backgroundColor: C.white,
    borderColor: C.white,
    ...shadow.strong,
  },
  heroVoiceBtn: {
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },

  // Zone grid
  zoneGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4,
  },
  zoneChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.panel, borderWidth: 1.5, borderColor: C.warm1,
    borderRadius: radius.md, padding: 11,
    width: '47.5%',
  },
  zoneChipAll: {
    width: '100%', backgroundColor: C.deep, borderColor: C.deep,
  },
  zoneChipSel: {borderColor: C.clay, backgroundColor: C.soft},
  zoneChipAllSel: {backgroundColor: '#3A2818', borderColor: C.gold},
  zoneDot: {
    width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.warm2,
  },
  zoneEmoji: {fontSize: 17},
  zoneInfo: {flex: 1},
  zoneName: {fontSize: 12, fontWeight: '600', color: C.ink, fontFamily: F.body},
  zoneCount: {fontSize: 10, color: C.mist, fontFamily: F.body},

  // Quick routines
  quickRow: {gap: 8, marginBottom: 4},
  quickCard: {
    flex: 1, backgroundColor: C.panel, borderWidth: 1.5, borderColor: C.warm1,
    borderRadius: radius.md, padding: 12, alignItems: 'center',
  },
  quickEmoji: {fontSize: 22, marginBottom: 4},
  quickName: {fontSize: 11, fontWeight: '600', color: C.ink, fontFamily: F.body, textAlign: 'center'},
  quickDur: {fontSize: 10, color: C.mist, fontFamily: F.body},

  // Voice card
  voiceCard: {marginBottom: 4},
  voiceInfo: {flex: 1},
  voiceDot: {
    width: 9, height: 9, borderRadius: 4.5,
    backgroundColor: C.warm2, marginRight: 12,
  },
  voiceDotOn: {backgroundColor: '#E55'},
  wordHighlight: {color: C.clay, fontWeight: '600'},

  // Alarms
  alarmCard: {marginBottom: 8},
  alarmTime: {
    fontFamily: F.display, fontSize: 24, fontWeight: '400', color: C.ink,
  },
  alarmTag: {
    backgroundColor: C.soft, borderRadius: radius.pill,
    paddingHorizontal: 9, paddingVertical: 3, marginLeft: 8,
  },
  alarmTagText: {fontSize: 10, color: C.mist, fontFamily: F.body},
  alarmZone: {fontSize: 10, color: C.mist, fontFamily: F.body, marginTop: 2},
  delBtn: {padding: 6, marginRight: 10},
  delBtnText: {fontSize: 16},
  emptyText: {fontSize: 12, color: C.mist, fontFamily: F.body, marginBottom: 4},
  addAlarmBtn: {
    borderWidth: 1.5, borderColor: C.warm2, borderStyle: 'dashed',
    borderRadius: radius.md, padding: 12,
    alignItems: 'center', marginBottom: 4,
  },
  addAlarmText: {fontSize: 12, fontWeight: '600', color: C.clay, fontFamily: F.body},

  // Shared card text
  cardTitle: {fontSize: 14, fontWeight: '600', color: C.ink, fontFamily: F.body},
  cardSub:  {fontSize: 11, color: C.mist, fontFamily: F.body, marginTop: 1},

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.52)', justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: C.panel, borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl, padding: 22, paddingBottom: 40,
  },
  modalHandle: {
    width: 36, height: 3, backgroundColor: C.warm2,
    borderRadius: 2, alignSelf: 'center', marginBottom: 18,
  },
  modalTitle: {
    fontFamily: F.display, fontSize: 24, fontWeight: '400',
    color: C.ink, marginBottom: 4,
  },
  modalSub: {fontSize: 12, color: C.mist, fontFamily: F.body, marginBottom: 16},
  formLabel: {
    fontSize: 10, fontWeight: '700', letterSpacing: 1.5,
    color: C.mist, fontFamily: F.body, marginBottom: 6, marginTop: 12,
  },
  formInput: {
    backgroundColor: C.soft, borderWidth: 1.5, borderColor: C.warm1,
    borderRadius: radius.md, padding: 12, fontSize: 16,
    color: C.ink, fontFamily: F.body,
  },
  zoneGridSmall: {flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2},
  zoneOptSmall: {
    backgroundColor: C.soft, borderWidth: 1.5, borderColor: C.warm1,
    borderRadius: radius.sm, paddingVertical: 8, paddingHorizontal: 12,
  },
  zoneOptSel: {borderColor: C.terra, backgroundColor: C.white},
  zoneOptText: {fontSize: 12, color: C.ink, fontFamily: F.body},
});
