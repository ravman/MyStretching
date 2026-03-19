export type Zone = 'neck' | 'shoulders' | 'back' | 'core' | 'legs' | 'feet';

export interface Stretch {
  id: number;
  zone: Zone;
  emoji: string;
  name: string;
  duration: number; // seconds
  glowColor: string;
  steps: string[];
  cues: string[];   // trainer voice cues, timed throughout stretch
  tip: string;
}

export interface Alarm {
  id: string;
  time: string;   // "HH:MM" 24h
  label: string;
  zone: Zone | 'all';
  enabled: boolean;
}

export interface AppSettings {
  wakeWord: string;
  stopWord: string;
  skipWord: string;
  voiceEnabled: boolean;
  musicTrack: string;
  musicVolume: number;  // 0–1
  trainerVolume: number;
  speechRate: number;
  pace: number;         // multiplier on duration
  breakDuration: number; // seconds between stretches
}

export const DEFAULT_SETTINGS: AppSettings = {
  wakeWord: 'stretch',
  stopWord: 'stop',
  skipWord: 'next',
  voiceEnabled: false,
  musicTrack: 'forest',
  musicVolume: 0.4,
  trainerVolume: 0.9,
  speechRate: 0.85,
  pace: 1.0,
  breakDuration: 5,
};

export const ZONE_LABELS: Record<Zone | 'all', string> = {
  all: 'Full Body',
  neck: 'Neck & Head',
  shoulders: 'Shoulders & Arms',
  back: 'Back & Spine',
  core: 'Core & Hips',
  legs: 'Legs & Knees',
  feet: 'Ankles & Feet',
};

export const ZONE_COLORS: Record<Zone | 'default', {
  bgStart: string; bgEnd: string; glow: string; accent: string; body: string;
}> = {
  neck:      {bgStart:'#1A2E38', bgEnd:'#0D1A20', glow:'#4A9FBF', accent:'#7ABFD0', body:'#D4A882'},
  shoulders: {bgStart:'#1E1535', bgEnd:'#110A1C', glow:'#8A6ABF', accent:'#A890D0', body:'#D4A882'},
  back:      {bgStart:'#0D2A20', bgEnd:'#050E0A', glow:'#4AAA7A', accent:'#7ABFA0', body:'#D4A882'},
  core:      {bgStart:'#2A1A08', bgEnd:'#120C04', glow:'#C09050', accent:'#D0AA70', body:'#D4A882'},
  legs:      {bgStart:'#12203A', bgEnd:'#070D18', glow:'#5A80B0', accent:'#80A0C8', body:'#D4A882'},
  feet:      {bgStart:'#0E1E10', bgEnd:'#050E06', glow:'#60A060', accent:'#80C080', body:'#D4A882'},
  default:   {bgStart:'#2C2018', bgEnd:'#0E0A07', glow:'#B5804A', accent:'#D4A882', body:'#D4A882'},
};
