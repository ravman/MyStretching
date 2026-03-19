import React, {useEffect, useRef} from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity,
  Animated, Easing,
} from 'react-native';
import {C, F, radius, shadow} from '../utils/theme';
import {Button} from './UI';

interface Props {
  visible: boolean;
  minutes: number;
  stretchCount: number;
  onClose: () => void;
}

const QUOTES = [
  '"The body benefits from movement, and the mind benefits from stillness."',
  '"Flexibility is not just physical — it\'s a way of approaching life."',
  '"Every morning is a chance to move with intention and grace."',
  '"Consistency is more important than intensity. You showed up."',
  '"Caring for your body today is a gift to your future self."',
];

export default function CompleteModal({visible, minutes, stretchCount, onClose}: Props) {
  const popAnim  = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  useEffect(() => {
    if (visible) {
      popAnim.setValue(0);
      fadeAnim.setValue(0);
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1, duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(popAnim, {
          toValue: 1, friction: 5, tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, popAnim, fadeAnim]);

  const crownScale = popAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, {opacity: fadeAnim}]}>
        <View style={[styles.sheet, shadow.strong]}>
          <View style={styles.handle} />

          {/* Crown */}
          <Animated.Text style={[styles.crown, {transform: [{scale: crownScale}]}]}>
            🌿
          </Animated.Text>

          {/* Heading */}
          <Text style={styles.heading}>
            Well{'\n'}<Text style={styles.headingItalic}>Done</Text>
          </Text>
          <Text style={styles.subText}>
            Your session is complete. Consistency is the secret to lasting mobility.
          </Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{minutes}</Text>
              <Text style={styles.statLbl}>MINUTES</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{stretchCount}</Text>
              <Text style={styles.statLbl}>STRETCHES</Text>
            </View>
          </View>

          {/* Quote */}
          <Text style={styles.quote}>{quote}</Text>

          <Button
            label="Back to Home"
            onPress={onClose}
            style={styles.closeBtn}
          />
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: C.panel,
    borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
    padding: 28, paddingBottom: 48, alignItems: 'center',
  },
  handle: {
    width: 36, height: 3, backgroundColor: C.warm2,
    borderRadius: 2, marginBottom: 20,
  },
  crown: {fontSize: 60, marginBottom: 14},
  heading: {
    fontFamily: F.display, fontSize: 42, fontWeight: '400',
    color: C.deep, textAlign: 'center', lineHeight: 44, marginBottom: 8,
  },
  headingItalic: {fontStyle: 'italic', color: '#6B8C6B'},
  subText: {
    fontSize: 13, color: C.mist, fontFamily: F.body,
    textAlign: 'center', lineHeight: 20, maxWidth: 270, marginBottom: 24,
  },
  statsRow: {flexDirection: 'row', gap: 14, marginBottom: 22},
  statBox: {
    backgroundColor: C.soft, borderRadius: radius.md,
    paddingVertical: 14, paddingHorizontal: 24,
    alignItems: 'center',
  },
  statVal: {
    fontFamily: F.display, fontSize: 32, fontWeight: '400', color: C.deep,
  },
  statLbl: {
    fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
    color: C.mist, fontFamily: F.body, marginTop: 2,
  },
  quote: {
    fontFamily: F.display, fontSize: 15, fontStyle: 'italic',
    color: C.clay, textAlign: 'center', lineHeight: 22,
    maxWidth: 280, marginBottom: 28,
  },
  closeBtn: {width: '100%'},
});
