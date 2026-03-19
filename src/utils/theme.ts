import {StyleSheet} from 'react-native';

export const C = {
  bg:     '#F5F0E8',
  panel:  '#FDFAF5',
  warm1:  '#E8DDD0',
  warm2:  '#D4C5B0',
  clay:   '#B5804A',
  terra:  '#8B5E3C',
  sage:   '#6B8C6B',
  mist:   '#9BA89B',
  deep:   '#2C2018',
  ink:    '#3D2E1E',
  gold:   '#C9963A',
  soft:   '#EDE8DF',
  white:  '#FFFFFF',
};

export const F = {
  display: 'Georgia' as const,   // serif — closest built-in to Playfair
  body:    'System' as const,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  pill: 50,
};

export const shadow = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
  },
});
