import React, {useEffect, useRef} from 'react';
import {Animated, Easing, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {C, F} from '../utils/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Props {
  progress: number;   // 0..1 remaining fraction
  timeLeft: number;   // seconds
  accentColor?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  size?: number;
}

export default function TimerRing({
  progress, timeLeft, accentColor = C.gold, onPress, children, size = 200,
}: Props) {
  const animVal = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: progress,
      duration: 900,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [progress, animVal]);

  const strokeDashoffset = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${mins}:${String(secs).padStart(2, '0')}`;
  const scale = size / 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = RADIUS * scale;
  const circ = 2 * Math.PI * r;

  const dashOffset = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: [circ, 0],
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{width: size, height: size}}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {/* Background track */}
        <Circle
          cx={cx} cy={cy} r={r}
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={3}
        />
        {/* Progress arc */}
        <AnimatedCircle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={accentColor}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          rotation="-90"
          origin={`${cx}, ${cy}`}
        />
      </Svg>

      {/* Center content */}
      <View style={[styles.center, {width: size, height: size}]}>
        {children ?? (
          <Text style={[styles.time, {fontSize: 44 * scale}]}>{timeStr}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontFamily: F.display,
    color: C.white,
    letterSpacing: -2,
  },
});
