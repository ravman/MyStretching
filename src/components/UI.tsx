import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {C, F, radius, shadow} from '../utils/theme';

// ── Button ────────────────────────────────────────
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  label, onPress, variant = 'primary', size = 'md',
  loading, disabled, icon, style, textStyle,
}: ButtonProps) {
  const bg: Record<string, string> = {
    primary: C.deep, secondary: C.soft, ghost: 'transparent', danger: '#B84040',
  };
  const fg: Record<string, string> = {
    primary: C.white, secondary: C.terra, ghost: C.clay, danger: C.white,
  };
  const border: Record<string, string> = {
    primary: C.deep, secondary: C.warm1, ghost: C.warm2, danger: '#B84040',
  };
  const pad: Record<string, {paddingVertical: number; paddingHorizontal: number; fontSize: number}> = {
    sm: {paddingVertical: 8, paddingHorizontal: 16, fontSize: 12},
    md: {paddingVertical: 13, paddingHorizontal: 24, fontSize: 14},
    lg: {paddingVertical: 16, paddingHorizontal: 32, fontSize: 16},
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.btn,
        {
          backgroundColor: bg[variant],
          borderColor: border[variant],
          borderWidth: 1.5,
          borderRadius: radius.pill,
          ...pad[size],
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={fg[variant]} size="small" />
      ) : (
        <Text style={[styles.btnText, {color: fg[variant], fontSize: pad[size].fontSize}, textStyle]}>
          {icon ? `${icon}  ` : ''}{label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// ── Card ─────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export function Card({children, style, onPress}: CardProps) {
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.82}
        style={[styles.card, shadow.card, style]}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[styles.card, shadow.card, style]}>{children}</View>;
}

// ── Toggle Switch ─────────────────────────────────
interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
}

export function Toggle({value, onChange}: ToggleProps) {
  return (
    <TouchableOpacity
      onPress={() => onChange(!value)}
      activeOpacity={0.8}
      style={[styles.toggleTrack, {backgroundColor: value ? C.sage : C.warm2}]}>
      <View style={[styles.toggleThumb, {transform: [{translateX: value ? 20 : 2}]}]} />
    </TouchableOpacity>
  );
}

// ── Section Label ─────────────────────────────────
export function SectionLabel({text, style}: {text: string; style?: TextStyle}) {
  return (
    <Text style={[styles.sectionLabel, style]}>{text.toUpperCase()}</Text>
  );
}

// ── Divider ───────────────────────────────────────
export function Divider({style}: {style?: ViewStyle}) {
  return <View style={[styles.divider, style]} />;
}

// ── Chip ─────────────────────────────────────────
interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export function Chip({label, selected, onPress, style}: ChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.chip,
        selected && styles.chipSelected,
        style,
      ]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ── Row ───────────────────────────────────────────
export function Row({
  children, style,
}: {children: React.ReactNode; style?: ViewStyle}) {
  return <View style={[styles.row, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: F.body,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  card: {
    backgroundColor: C.panel,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: C.warm1,
    padding: 16,
  },
  toggleTrack: {
    width: 46,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: C.mist,
    fontFamily: F.body,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: C.warm1,
  },
  chip: {
    backgroundColor: C.soft,
    borderWidth: 1.5,
    borderColor: C.warm1,
    borderRadius: radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: C.deep,
    borderColor: C.deep,
  },
  chipText: {
    fontSize: 11,
    color: C.ink,
    fontFamily: F.body,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: C.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
