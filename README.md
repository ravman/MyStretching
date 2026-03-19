# My Stretching — React Native App

A fully local, no-backend mobile app for guided daily morning stretches.
20 stretches from neck to toes, voice-activated, AI trainer cues, ambient music,
animated SVG illustrations, multiple reminders, and body-area selection.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| npm | ≥ 10 |
| Watchman | latest |
| **Android:** Android Studio + SDK 34/35 | — |
| **iOS:** Xcode 15+ | macOS only |
| **iOS:** CocoaPods | `sudo gem install cocoapods` |

Set environment variables:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk      # macOS
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

---

## Quick Start

```bash
# 1. Install JS dependencies
cd MyStretching
npm install

# 2. iOS — install native pods (macOS only)
cd ios && pod install && cd ..

# 3. Start Metro bundler
npx react-native start

# 4a. Run on Android
npx react-native run-android

# 4b. Run on iOS
npx react-native run-ios
```

---

## Adding Missing Native Dependencies

The package.json lists all required packages. After `npm install`, most are
auto-linked by React Native's autolinking. A few need manual steps:

### `react-native-linear-gradient`
Used for session background gradients.
```bash
npm install react-native-linear-gradient
cd ios && pod install
```
Android: autolinking handles it.

### `@react-native-community/slider`
Used in Settings for volume/rate sliders.
```bash
npm install @react-native-community/slider
cd ios && pod install
```

### Ambient Music Tracks
`react-native-sound` plays files bundled with the app.

**Android** — copy MP3 files to:
```
android/app/src/main/res/raw/
  forest.mp3
  rain.mp3
  bowls.mp3
  ocean.mp3
  piano.mp3
  birds.mp3
```

**iOS** — copy same MP3 files to:
```
ios/MyStretching/Sounds/
```
Then add them to the Xcode target (drag into Xcode → "Copy items if needed" ✓).

Free ambient sources: freesound.org, pixabay.com/music (search: forest ambience,
rain sounds, tibetan singing bowls, ocean waves, gentle piano, morning birds).
Pick ~3-5 min loops, export as 128kbps MP3.

---

## Features

### ▶ 20 Stretches — Neck to Toes
- **Neck (3):** Side Stretch, Neck Rolls, Chin Tucks
- **Shoulders (4):** Chest Opener, Cross-Body, Tricep Stretch, Shoulder Circles
- **Back (4):** Cat-Cow, Spinal Twist, Child's Pose, Spine Roll-Down
- **Core (4):** Side Bend, Butterfly Hip, Hip Flexor Lunge, Modified Pigeon
- **Legs (3):** Quad Stretch, Hamstring Stretch, Knee Circles
- **Feet (2):** Ankle Circles, Toe Stretches

### 🎙 Voice Activation
- Continuous speech recognition (device-local, no network)
- Customizable wake word, stop word, skip word
- Works hands-free during session
- iOS: uses `SFSpeechRecognizer` via `@react-native-community/voice`
- Android: uses `SpeechRecognizer` API

### 🗣 AI Trainer Voice
- Text-to-speech via `react-native-tts`
- 4 timed cues per stretch, spoken at the right moment
- Adjustable rate and volume in Settings

### 🎵 Ambient Music
- 6 tracks: Forest, Rain, Tibetan Bowls, Ocean, Piano, Birds
- Loops seamlessly via `react-native-sound`
- Volume adjustable independently of trainer voice

### ⏰ Multiple Reminders
- Unlimited alarms, each with its own time, label, and body zone
- Persistent local push notifications via `react-native-push-notification`
- In-app polling fallback when foregrounded

### 🎨 Animated Stretch Visuals
- Each of the 20 stretches has a unique animated SVG stick-figure scene
- Background gradient changes per body zone (6 distinct environments)
- Floating ambient particles
- Active step highlights in real-time

### 📱 Fully Offline
- All data in AsyncStorage (device-only)
- No server, no account, no internet required
- AI Find feature uses the Anthropic API (optional, requires network)

---

## Project Structure

```
src/
├── App.tsx                    # Root: navigation, global state, session orchestration
├── data/
│   ├── types.ts               # TypeScript types, zone colors, defaults
│   └── stretches.ts           # All 20 stretches with cues, steps, tips
├── hooks/
│   ├── useSession.ts          # Session engine (timer, TTS cues, advance, skip)
│   ├── useVoiceControl.ts     # Continuous wake-word detection
│   ├── useMusic.ts            # Ambient audio loop
│   ├── useAlarms.ts           # Push notifications + in-app polling
│   └── useStorage.ts          # AsyncStorage wrapper hook
├── screens/
│   ├── HomeScreen.tsx         # Zone selector, alarms, music, voice toggle
│   ├── SessionScreen.tsx      # Full-screen session with illustrations
│   ├── LibraryScreen.tsx      # Browse 20 stretches + AI Find
│   └── SettingsScreen.tsx     # Voice words, volumes, pace, timing
├── components/
│   ├── UI.tsx                 # Button, Card, Toggle, Chip, etc.
│   ├── TimerRing.tsx          # Animated SVG countdown ring
│   ├── StretchIllustration.tsx # Per-stretch animated SVG figures
│   └── CompleteModal.tsx      # Session complete celebration
└── utils/
    └── theme.ts               # Colors, fonts, radii, shadows
```

---

## Troubleshooting

**Metro bundler port conflict:**
```bash
npx react-native start --reset-cache
```

**Android build fails — SDK not found:**
Check `ANDROID_HOME` is set and Android Studio has SDK 34+ installed.

**iOS pods fail:**
```bash
cd ios && pod deintegrate && pod install
```

**Voice recognition not working on iOS:**
Ensure `NSMicrophoneUsageDescription` and `NSSpeechRecognitionUsageDescription`
are in `Info.plist` (already added). You must run on a real device — simulators
don't support speech recognition.

**TTS has no voice on Android emulator:**
Install a TTS engine in emulator Settings → Language & Input → Text-to-speech.

**`react-native-linear-gradient` red screen:**
```bash
npm install react-native-linear-gradient
cd android && ./gradlew clean
```
