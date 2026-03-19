import React, {useState, useMemo, useCallback} from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, ScrollView, Modal, ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {C, F, radius, shadow} from '../utils/theme';
import {ALL_STRETCHES} from '../data/stretches';
import {Stretch, Zone, ZONE_LABELS} from '../data/types';
import {SectionLabel} from '../components/UI';

const FILTERS: Array<{zone: Zone | 'all'; label: string}> = [
  {zone: 'all',       label: 'All'},
  {zone: 'neck',      label: 'Neck'},
  {zone: 'shoulders', label: 'Shoulders'},
  {zone: 'back',      label: 'Back'},
  {zone: 'core',      label: 'Core'},
  {zone: 'legs',      label: 'Legs'},
  {zone: 'feet',      label: 'Feet'},
];

interface Props {
  onQuickStart: (stretch: Stretch) => void;
  extraStretches: Stretch[];
  onAddStretch: (s: Stretch) => void;
}

export default function LibraryScreen({onQuickStart, extraStretches, onAddStretch}: Props) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<Zone | 'all'>('all');

  // AI Find modal state
  const [showAI, setShowAI] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState<Stretch[]>([]);
  const [aiError, setAiError] = useState('');
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  const allStretches = useMemo(
    () => [...ALL_STRETCHES, ...extraStretches],
    [extraStretches],
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return allStretches.filter(s => {
      const matchZone = activeFilter === 'all' || s.zone === activeFilter;
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.zone.includes(q);
      return matchZone && matchQ;
    });
  }, [allStretches, query, activeFilter]);

  // AI search — calls Claude API (no backend; key comes from env or can be removed for offline)
  const runAiSearch = useCallback(async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiError('');
    setAiResults([]);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1200,
          system: `You are a certified stretching and mobility coach. Return ONLY a valid JSON array of 4 stretches. Each object: name (string), zone (one of: neck,shoulders,back,core,legs,feet), emoji (one emoji), duration (30-60), steps (4 short strings), cues (4 coaching strings), tip (string). No markdown. Raw JSON only.`,
          messages: [{role: 'user', content: `Find best stretches for: ${aiQuery}`}],
        }),
      });
      const data = await res.json();
      const txt = (data.content ?? []).map((b: any) => b.text ?? '').join('');
      const parsed: Stretch[] = JSON.parse(txt.replace(/```json|```/g, '').trim());
      const withIds = parsed.map((s, i) => ({
        ...s,
        id: 8000 + Date.now() % 1000 + i,
        glowColor: '#B5804A',
      }));
      setAiResults(withIds);
    } catch {
      setAiError('Could not load stretches. Please try again.');
    }
    setAiLoading(false);
  }, [aiQuery]);

  const handleAddAI = useCallback((s: Stretch) => {
    onAddStretch(s);
    setAddedIds(prev => new Set([...prev, s.id]));
  }, [onAddStretch]);

  const renderItem = useCallback(({item}: {item: Stretch}) => (
    <View style={[styles.stretchRow, shadow.card]}>
      <Text style={styles.srEmoji}>{item.emoji}</Text>
      <View style={styles.srInfo}>
        <Text style={styles.srName}>{item.name}</Text>
        <Text style={styles.srZone}>{ZONE_LABELS[item.zone] ?? item.zone}</Text>
        <Text style={styles.srDur}>⏱ {item.duration}s hold</Text>
      </View>
      <TouchableOpacity
        onPress={() => onQuickStart(item)}
        style={styles.goBtn}
        activeOpacity={0.8}>
        <Text style={styles.goBtnText}>▶ Go</Text>
      </TouchableOpacity>
    </View>
  ), [onQuickStart]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.root}>

        {/* ── Search + AI Find ── */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search stretches…"
            placeholderTextColor={C.mist}
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity
            onPress={() => { setShowAI(true); setAiResults([]); setAiError(''); setAiQuery(''); }}
            style={styles.aiBtn}
            activeOpacity={0.85}>
            <Text style={styles.aiBtnText}>✦ AI Find</Text>
          </TouchableOpacity>
        </View>

        {/* ── Zone Filters ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.zone}
              onPress={() => setActiveFilter(f.zone)}
              style={[styles.filterChip, activeFilter === f.zone && styles.filterChipSel]}
              activeOpacity={0.8}>
              <Text style={[styles.filterText, activeFilter === f.zone && styles.filterTextSel]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── List ── */}
        {filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No stretches found.</Text>
            <Text style={styles.emptyHint}>Try ✦ AI Find for custom ones!</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={s => String(s.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{height: 8}} />}
          />
        )}
      </View>

      {/* ── AI Find Modal ── */}
      <Modal
        visible={showAI}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAI(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAI(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>✦ Find Stretches with AI</Text>
            <Text style={styles.modalSub}>
              Describe a body part or condition — I'll find the right stretches.
            </Text>

            <View style={styles.aiInputRow}>
              <TextInput
                style={styles.aiInput}
                value={aiQuery}
                onChangeText={setAiQuery}
                placeholder="e.g. lower back pain, stiff wrists, tight calves…"
                placeholderTextColor={C.mist}
                returnKeyType="search"
                onSubmitEditing={runAiSearch}
                autoFocus
              />
              <TouchableOpacity onPress={runAiSearch} style={styles.aiGoBtn} activeOpacity={0.85}>
                <Text style={styles.aiGoBtnText}>Find</Text>
              </TouchableOpacity>
            </View>

            {aiLoading && (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={C.clay} />
                <Text style={styles.loadingText}>Searching…</Text>
              </View>
            )}

            {!!aiError && <Text style={styles.errorText}>{aiError}</Text>}

            {aiResults.map(s => (
              <View key={s.id} style={[styles.aiCard, shadow.card]}>
                <Text style={styles.aiEmoji}>{s.emoji}</Text>
                <View style={styles.aiInfo}>
                  <Text style={styles.aiName}>{s.name}</Text>
                  <Text style={styles.aiMeta}>
                    {s.zone}  ·  {s.duration}s
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleAddAI(s)}
                  disabled={addedIds.has(s.id)}
                  style={[styles.addBtn, addedIds.has(s.id) && styles.addBtnDone]}
                  activeOpacity={0.8}>
                  <Text style={[styles.addBtnText, addedIds.has(s.id) && {color: C.white}]}>
                    {addedIds.has(s.id) ? '✓ Added' : '+ Add'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={{height: 20}} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: C.bg},
  root: {flex: 1, padding: 16, gap: 12},

  searchRow: {flexDirection: 'row', gap: 8},
  searchInput: {
    flex: 1, backgroundColor: C.panel,
    borderWidth: 1.5, borderColor: C.warm1,
    borderRadius: radius.pill, paddingHorizontal: 16,
    paddingVertical: 10, fontSize: 14, color: C.ink, fontFamily: F.body,
  },
  aiBtn: {
    backgroundColor: C.deep, borderRadius: radius.pill,
    paddingHorizontal: 16, paddingVertical: 10,
    justifyContent: 'center',
  },
  aiBtnText: {fontSize: 12, fontWeight: '600', color: C.white, fontFamily: F.body},

  filterScroll: {flexGrow: 0},
  filterContent: {gap: 7, paddingRight: 4},
  filterChip: {
    backgroundColor: C.panel, borderWidth: 1.5, borderColor: C.warm1,
    borderRadius: radius.pill, paddingVertical: 7, paddingHorizontal: 14,
  },
  filterChipSel: {backgroundColor: C.terra, borderColor: C.terra},
  filterText: {fontSize: 11, color: C.ink, fontFamily: F.body, fontWeight: '500'},
  filterTextSel: {color: C.white},

  listContent: {paddingBottom: 32},
  stretchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: C.panel, borderWidth: 1.5, borderColor: C.warm1,
    borderRadius: radius.md, padding: 12,
  },
  srEmoji: {fontSize: 26},
  srInfo: {flex: 1},
  srName: {fontSize: 14, fontWeight: '600', color: C.ink, fontFamily: F.body},
  srZone: {
    fontSize: 10, color: C.mist, textTransform: 'uppercase',
    letterSpacing: 0.8, fontFamily: F.body, marginTop: 2,
  },
  srDur: {fontSize: 10, color: C.clay, fontFamily: F.body, marginTop: 2},
  goBtn: {
    backgroundColor: C.soft, borderWidth: 1.5, borderColor: C.warm1,
    borderRadius: radius.pill, paddingVertical: 6, paddingHorizontal: 12,
  },
  goBtnText: {fontSize: 11, fontWeight: '600', color: C.terra, fontFamily: F.body},

  emptyWrap: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  emptyText: {fontSize: 14, color: C.mist, fontFamily: F.body},
  emptyHint: {fontSize: 12, color: C.clay, fontFamily: F.body, marginTop: 4},

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: C.panel, borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl, padding: 22, paddingBottom: 36,
    maxHeight: '85%',
  },
  handle: {
    width: 36, height: 3, backgroundColor: C.warm2,
    borderRadius: 2, alignSelf: 'center', marginBottom: 18,
  },
  modalTitle: {
    fontFamily: F.display, fontSize: 22, fontWeight: '400',
    color: C.ink, marginBottom: 4,
  },
  modalSub: {fontSize: 12, color: C.mist, fontFamily: F.body, marginBottom: 16},
  aiInputRow: {flexDirection: 'row', gap: 8, marginBottom: 14},
  aiInput: {
    flex: 1, backgroundColor: C.soft,
    borderWidth: 1.5, borderColor: C.warm1,
    borderRadius: radius.md, padding: 11,
    fontSize: 14, color: C.ink, fontFamily: F.body,
  },
  aiGoBtn: {
    backgroundColor: C.deep, borderRadius: radius.md,
    paddingHorizontal: 16, justifyContent: 'center',
  },
  aiGoBtnText: {fontSize: 13, fontWeight: '600', color: C.white, fontFamily: F.body},
  loadingRow: {flexDirection: 'row', gap: 10, alignItems: 'center', padding: 16},
  loadingText: {fontSize: 13, color: C.mist, fontFamily: F.body},
  errorText: {fontSize: 12, color: '#B84040', padding: 8, fontFamily: F.body},
  aiCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.warm1,
    borderRadius: radius.md, padding: 12, marginBottom: 8,
  },
  aiEmoji: {fontSize: 24},
  aiInfo: {flex: 1},
  aiName: {fontSize: 13, fontWeight: '600', color: C.ink, fontFamily: F.body},
  aiMeta: {
    fontSize: 10, color: C.mist, textTransform: 'uppercase',
    letterSpacing: 0.8, fontFamily: F.body, marginTop: 2,
  },
  addBtn: {
    backgroundColor: C.soft, borderWidth: 1.5, borderColor: C.warm1,
    borderRadius: radius.pill, paddingVertical: 6, paddingHorizontal: 12,
  },
  addBtnDone: {backgroundColor: C.sage, borderColor: C.sage},
  addBtnText: {fontSize: 11, fontWeight: '600', color: C.terra, fontFamily: F.body},
});
