import React, {useEffect, useRef} from 'react';
import {Animated, Easing} from 'react-native';
import Svg, {
  Circle, Rect, Path, Ellipse, Line, G, Defs,
  RadialGradient, Stop,
} from 'react-native-svg';
import {Stretch, ZONE_COLORS} from '../data/types';

interface Props {
  stretch: Stretch;
  size?: number;
}

// We drive one continuous [0..2π] animation value and pass it as a prop
// to each illustration function. SVG elements use interpolated numeric values.

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath   = Animated.createAnimatedComponent(Path);
const AnimatedG      = Animated.createAnimatedComponent(G);

export default function StretchIllustration({stretch, size = 300}: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [stretch.id, anim]);

  const zc = ZONE_COLORS[stretch.zone] ?? ZONE_COLORS.default;
  const W = size;
  const H = Math.round(size * 0.65);

  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        <RadialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={zc.glow} stopOpacity="0.25" />
          <Stop offset="100%" stopColor={zc.glow} stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Background glow */}
      <Ellipse
        cx={W / 2} cy={H / 2}
        rx={W * 0.38} ry={H * 0.48}
        fill="url(#glowGrad)"
      />

      {/* Illustration switcher */}
      <IllustrationSwitch stretch={stretch} anim={anim} W={W} H={H} zc={zc} />
    </Svg>
  );
}

function IllustrationSwitch({stretch, anim, W, H, zc}: any) {
  const cx = W / 2;
  const cy = H / 2;
  const bc = zc.body;
  const ac = zc.accent;

  // Shared interpolation helpers
  const sin = (phase = 0, amp = 1) =>
    anim.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [
        0,
        amp * Math.sin(Math.PI / 2 + phase),
        amp * Math.sin(Math.PI + phase),
        amp * Math.sin(3 * Math.PI / 2 + phase),
        0,
      ],
    });

  switch (stretch.zone) {
    case 'neck':
      return <NeckIllustration cx={cx} cy={cy} bc={bc} ac={ac} sin={sin} stretch={stretch} anim={anim} />;
    case 'shoulders':
      return <ShouldersIllustration cx={cx} cy={cy} bc={bc} ac={ac} sin={sin} stretch={stretch} anim={anim} />;
    case 'back':
      return <BackIllustration cx={cx} cy={cy} bc={bc} ac={ac} sin={sin} stretch={stretch} anim={anim} />;
    case 'core':
      return <CoreIllustration cx={cx} cy={cy} bc={bc} ac={ac} sin={sin} stretch={stretch} anim={anim} />;
    case 'legs':
      return <LegsIllustration cx={cx} cy={cy} bc={bc} ac={ac} sin={sin} stretch={stretch} anim={anim} />;
    case 'feet':
      return <FeetIllustration cx={cx} cy={cy} bc={bc} ac={ac} sin={sin} stretch={stretch} anim={anim} />;
    default:
      return null;
  }
}

// ── NECK ─────────────────────────────────────────
function NeckIllustration({cx, cy, bc, ac, sin, stretch, anim}: any) {
  const headTilt = sin(0, 18); // -18 to +18 degrees oscillation

  return (
    <>
      {/* Torso */}
      <Rect x={cx - 18} y={cy + 5} width={36} height={48} rx={12} fill={bc} />
      {/* Shoulders */}
      <Line x1={cx - 28} y1={cy + 14} x2={cx - 50} y2={cy + 22} stroke={bc} strokeWidth={8} strokeLinecap="round" />
      <Line x1={cx + 28} y1={cy + 14} x2={cx + 50} y2={cy + 22} stroke={bc} strokeWidth={8} strokeLinecap="round" />
      {/* Animated head */}
      <AnimatedG
        style={{
          transform: [{
            rotate: headTilt.interpolate({inputRange: [-18, 18], outputRange: ['-18deg', '18deg']}),
          }],
          originX: cx,
          originY: cy - 2,
        } as any}>
        <Circle cx={cx} cy={cy - 16} r={20} fill={bc} />
        {/* Neck line */}
        <Line x1={cx} y1={cy + 5} x2={cx} y2={cy - 2} stroke={bc} strokeWidth={8} strokeLinecap="round" />
      </AnimatedG>
      {/* Stretch arc indicator */}
      <Path d={`M ${cx - 30} ${cy - 28} Q ${cx - 50} ${cy - 20} ${cx - 52} ${cy - 8}`}
        stroke={ac} strokeWidth={2} fill="none" opacity={0.5} strokeDasharray="5,4" />
      {/* Breath dot */}
      <AnimatedCircle cx={cx + 38} cy={cy - 22} r={sin(0, 3)} fill={ac} opacity={0.4} />
    </>
  );
}

// ── SHOULDERS ─────────────────────────────────────
function ShouldersIllustration({cx, cy, bc, ac, sin, stretch}: any) {
  const armSwing = sin(0, 22);

  return (
    <>
      <Rect x={cx - 18} y={cy} width={36} height={50} rx={12} fill={bc} />
      <Circle cx={cx} cy={cy - 15} r={20} fill={bc} />
      {/* Left arm swinging */}
      <AnimatedPath
        d={armSwing.interpolate({
          inputRange: [-22, 22],
          outputRange: [
            `M ${cx - 18} ${cy + 12} Q ${cx - 45} ${cy - 5} ${cx - 55} ${cy - 20}`,
            `M ${cx - 18} ${cy + 12} Q ${cx - 42} ${cy + 5} ${cx - 58} ${cy + 5}`,
          ],
        })}
        stroke={bc} strokeWidth={9} fill="none" strokeLinecap="round"
      />
      {/* Right arm swinging opposite */}
      <AnimatedPath
        d={armSwing.interpolate({
          inputRange: [-22, 22],
          outputRange: [
            `M ${cx + 18} ${cy + 12} Q ${cx + 42} ${cy + 5} ${cx + 58} ${cy + 5}`,
            `M ${cx + 18} ${cy + 12} Q ${cx + 45} ${cy - 5} ${cx + 55} ${cy - 20}`,
          ],
        })}
        stroke={bc} strokeWidth={9} fill="none" strokeLinecap="round"
      />
      {/* Glow on shoulders */}
      <AnimatedCircle cx={cx - 20} cy={cy + 10} r={sin(0, 4)} fill={ac} opacity={0.25} />
      <AnimatedCircle cx={cx + 20} cy={cy + 10} r={sin(Math.PI, 4)} fill={ac} opacity={0.25} />
      {/* Legs */}
      <Rect x={cx - 14} y={cy + 48} width={11} height={28} rx={5} fill={bc} />
      <Rect x={cx + 3}  y={cy + 48} width={11} height={28} rx={5} fill={bc} />
    </>
  );
}

// ── BACK ──────────────────────────────────────────
function BackIllustration({cx, cy, bc, ac, sin, stretch}: any) {
  const spineWave = sin(0, 12);

  // Cat-cow: spine arches up and down
  if (stretch.id === 8) {
    return (
      <>
        {/* 4-point position */}
        <AnimatedPath
          d={spineWave.interpolate({
            inputRange: [-12, 12],
            outputRange: [
              `M ${cx - 60} ${cy + 10} Q ${cx} ${cy - 12} ${cx + 60} ${cy + 10}`,
              `M ${cx - 60} ${cy + 10} Q ${cx} ${cy + 22} ${cx + 60} ${cy + 10}`,
            ],
          })}
          stroke={bc} strokeWidth={16} fill="none" strokeLinecap="round"
        />
        {/* Head */}
        <AnimatedCircle cx={cx - 62} cy={spineWave.interpolate({inputRange: [-12, 12], outputRange: [cy - 2, cy + 12]})} r={14} fill={bc} />
        {/* 4 limbs */}
        <Line x1={cx - 38} y1={cy + 14} x2={cx - 40} y2={cy + 42} stroke={bc} strokeWidth={9} strokeLinecap="round" />
        <Line x1={cx - 12} y1={cy + 16} x2={cx - 14} y2={cy + 44} stroke={bc} strokeWidth={9} strokeLinecap="round" />
        <Line x1={cx + 14} y1={cy + 16} x2={cx + 14} y2={cy + 44} stroke={bc} strokeWidth={9} strokeLinecap="round" />
        <Line x1={cx + 40} y1={cy + 14} x2={cx + 40} y2={cy + 42} stroke={bc} strokeWidth={9} strokeLinecap="round" />
        {/* Spine dots */}
        <AnimatedCircle cx={cx - 20} cy={spineWave.interpolate({inputRange: [-12, 12], outputRange: [cy - 8, cy + 16]})} r={3} fill={ac} opacity={0.5} />
        <AnimatedCircle cx={cx}      cy={spineWave.interpolate({inputRange: [-12, 12], outputRange: [cy - 12, cy + 22]})} r={3} fill={ac} opacity={0.5} />
        <AnimatedCircle cx={cx + 20} cy={spineWave.interpolate({inputRange: [-12, 12], outputRange: [cy - 8, cy + 16]})} r={3} fill={ac} opacity={0.5} />
      </>
    );
  }

  // Child's pose
  if (stretch.id === 10) {
    return (
      <>
        <Path d={`M ${cx + 40} ${cy + 20} Q ${cx + 60} ${cy + 22} ${cx + 75} ${cy + 18}`}
          stroke={bc} strokeWidth={14} fill="none" strokeLinecap="round" />
        <Ellipse cx={cx + 28} cy={cy + 24} rx={32} ry={18} fill={bc} />
        <Path d={`M ${cx - 8} ${cy + 14} Q ${cx - 35} ${cy + 6} ${cx - 55} ${cy + 8}`}
          stroke={bc} strokeWidth={16} fill="none" strokeLinecap="round" />
        <Path d={`M ${cx - 55} ${cy + 8} Q ${cx - 72} ${cy + 7} ${cx - 80} ${cy + 6}`}
          stroke={bc} strokeWidth={9} fill="none" strokeLinecap="round" />
        <AnimatedCircle cx={cx - 72} cy={spineWave.interpolate({inputRange:[-12,12], outputRange:[cy+4, cy+8]})} r={15} fill={bc} />
        <AnimatedEllipse cx={cx - 20} cy={cy + 10} rx={sin(0, 28)} ry={sin(0, 7)} fill={ac} opacity={0.1} />
      </>
    );
  }

  // Generic back: spine roll
  return (
    <>
      <Rect x={cx - 8} y={cy + 15} width={16} height={35} rx={6} fill={bc} />
      <Rect x={cx - 7} y={cy + 40} width={11} height={28} rx={5} fill={bc} />
      <Rect x={cx + 2} y={cy + 40} width={11} height={28} rx={5} fill={bc} />
      <AnimatedPath
        d={spineWave.interpolate({
          inputRange: [-12, 12],
          outputRange: [
            `M ${cx} ${cy + 15} Q ${cx - 18} ${cy - 5} ${cx - 22} ${cy - 22} Q ${cx - 18} ${cy - 35} ${cx - 8} ${cy - 46}`,
            `M ${cx} ${cy + 15} Q ${cx - 8} ${cy - 5} ${cx - 10} ${cy - 20} Q ${cx - 8} ${cy - 35} ${cx - 4} ${cy - 46}`,
          ],
        })}
        stroke={bc} strokeWidth={14} fill="none" strokeLinecap="round"
      />
      <AnimatedCircle cx={spineWave.interpolate({inputRange:[-12,12],outputRange:[cx-8,cx-4]})}
        cy={cy - 48} r={17} fill={bc} />
    </>
  );
}

// ── CORE ──────────────────────────────────────────
function CoreIllustration({cx, cy, bc, ac, sin, stretch}: any) {
  const swing = sin(0, 14);

  // Butterfly
  if (stretch.id === 13) {
    return (
      <>
        <Ellipse cx={cx} cy={cy + 22} rx={28} ry={12} fill={bc} />
        <Path d={`M ${cx} ${cy + 18} L ${cx} ${cy - 12}`} stroke={bc} strokeWidth={16} strokeLinecap="round" />
        <Circle cx={cx} cy={cy - 26} r={18} fill={bc} />
        {/* Butterfly knees */}
        <AnimatedPath
          d={swing.interpolate({
            inputRange: [-14, 14],
            outputRange: [
              `M ${cx - 28} ${cy + 20} Q ${cx - 52} ${cy + 2} ${cx - 48} ${cy + 22}`,
              `M ${cx - 28} ${cy + 20} Q ${cx - 52} ${cy + 14} ${cx - 48} ${cy + 22}`,
            ],
          })}
          stroke={bc} strokeWidth={9} fill="none" strokeLinecap="round"
        />
        <AnimatedPath
          d={swing.interpolate({
            inputRange: [-14, 14],
            outputRange: [
              `M ${cx + 28} ${cy + 20} Q ${cx + 52} ${cy + 2} ${cx + 48} ${cy + 22}`,
              `M ${cx + 28} ${cy + 20} Q ${cx + 52} ${cy + 14} ${cx + 48} ${cy + 22}`,
            ],
          })}
          stroke={bc} strokeWidth={9} fill="none" strokeLinecap="round"
        />
        <AnimatedEllipse cx={cx} cy={cy + 22} rx={swing.interpolate({inputRange:[-14,14],outputRange:[36,22]})} ry={7} fill={ac} opacity={0.15} />
      </>
    );
  }

  // Hip flexor lunge
  if (stretch.id === 14) {
    return (
      <>
        <AnimatedPath
          d={swing.interpolate({
            inputRange: [-14, 14],
            outputRange: [
              `M ${cx + 10} ${cy + 38} Q ${cx + 18} ${cy + 18} ${cx + 20} ${cy}`,
              `M ${cx + 10} ${cy + 38} Q ${cx + 15} ${cy + 20} ${cx + 18} ${cy + 2}`,
            ],
          })}
          stroke={bc} strokeWidth={12} fill="none" strokeLinecap="round"
        />
        <Path d={`M ${cx - 10} ${cy + 20} Q ${cx - 22} ${cy + 34} ${cx - 30} ${cy + 46}`}
          stroke={bc} strokeWidth={12} fill="none" strokeLinecap="round" />
        <Path d={`M ${cx + 5} ${cy} Q ${cx + 6} ${cy - 20} ${cx + 5} ${cy - 38}`}
          stroke={bc} strokeWidth={16} fill="none" strokeLinecap="round" />
        <Circle cx={cx + 5} cy={cy - 50} r={18} fill={bc} />
        {/* Hip glow */}
        <AnimatedCircle cx={cx - 8} cy={cy + 20} r={swing.interpolate({inputRange:[-14,14],outputRange:[10,16]})} fill={ac} opacity={0.2} />
        {/* Arms up */}
        <Path d={`M ${cx - 2} ${cy - 30} Q ${cx - 18} ${cy - 48} ${cx - 22} ${cy - 62}`}
          stroke={bc} strokeWidth={8} fill="none" strokeLinecap="round" />
        <Path d={`M ${cx + 8} ${cy - 30} Q ${cx + 22} ${cy - 48} ${cx + 26} ${cy - 62}`}
          stroke={bc} strokeWidth={8} fill="none" strokeLinecap="round" />
      </>
    );
  }

  // Side bend default
  return (
    <>
      <Ellipse cx={cx} cy={cy + 28} rx={28} ry={16} fill={bc} />
      <AnimatedPath
        d={swing.interpolate({
          inputRange: [-14, 14],
          outputRange: [
            `M ${cx} ${cy + 18} Q ${cx - 10} ${cy - 5} ${cx - 16} ${cy - 24}`,
            `M ${cx} ${cy + 18} Q ${cx - 4} ${cy - 5} ${cx - 6} ${cy - 24}`,
          ],
        })}
        stroke={bc} strokeWidth={16} fill="none" strokeLinecap="round"
      />
      <AnimatedCircle cx={swing.interpolate({inputRange:[-14,14],outputRange:[cx-18,cx-8]})}
        cy={cy - 36} r={18} fill={bc} />
      {/* Arm overhead */}
      <AnimatedPath
        d={swing.interpolate({
          inputRange: [-14, 14],
          outputRange: [
            `M ${cx + 12} ${cy + 5} Q ${cx + 28} ${cy - 18} ${cx + 38} ${cy - 46}`,
            `M ${cx + 12} ${cy + 5} Q ${cx + 22} ${cy - 18} ${cx + 28} ${cy - 46}`,
          ],
        })}
        stroke={bc} strokeWidth={9} fill="none" strokeLinecap="round"
      />
    </>
  );
}

// ── LEGS ──────────────────────────────────────────
function LegsIllustration({cx, cy, bc, ac, sin, stretch}: any) {
  const sw = sin(0, 16);

  // Hamstring seated
  if (stretch.id === 17) {
    return (
      <>
        <Path d={`M ${cx - 60} ${cy + 20} Q ${cx} ${cy + 20} ${cx + 60} ${cy + 20}`}
          stroke={bc} strokeWidth={13} fill="none" strokeLinecap="round" />
        <Ellipse cx={cx - 62} cy={cy + 20} rx={10} ry={6} fill={bc} />
        <Ellipse cx={cx + 62} cy={cy + 20} rx={10} ry={6} fill={bc} />
        <AnimatedPath
          d={sw.interpolate({
            inputRange: [-16, 16],
            outputRange: [
              `M ${cx} ${cy + 18} Q ${cx - 5} ${cy - 2} ${cx - 8} ${cy - 20}`,
              `M ${cx} ${cy + 18} Q ${cx - 2} ${cy - 2} ${cx - 4} ${cy - 20}`,
            ],
          })}
          stroke={bc} strokeWidth={16} fill="none" strokeLinecap="round"
        />
        <AnimatedCircle cx={sw.interpolate({inputRange:[-16,16],outputRange:[cx-10,cx-5]})}
          cy={cy - 32} r={18} fill={bc} />
        <AnimatedEllipse cx={cx} cy={cy + 20} rx={sw.interpolate({inputRange:[-16,16],outputRange:[52,60]})} ry={7} fill={ac} opacity={0.12} />
      </>
    );
  }

  // Knee circles
  if (stretch.id === 18) {
    return (
      <>
        <Rect x={cx - 16} y={cy - 5} width={32} height={28} rx={12} fill={bc} />
        <Circle cx={cx} cy={cy - 18} r={18} fill={bc} />
        {/* Knees rotating */}
        <AnimatedPath
          d={sw.interpolate({
            inputRange: [-16, 16],
            outputRange: [
              `M ${cx - 14} ${cy + 22} Q ${cx - 30} ${cy + 28} ${cx - 22} ${cy + 40} Q ${cx - 16} ${cy + 48} ${cx - 14} ${cy + 56}`,
              `M ${cx - 14} ${cy + 22} Q ${cx - 20} ${cy + 32} ${cx - 18} ${cy + 44} Q ${cx - 16} ${cy + 50} ${cx - 14} ${cy + 56}`,
            ],
          })}
          stroke={bc} strokeWidth={10} fill="none" strokeLinecap="round"
        />
        <AnimatedPath
          d={sw.interpolate({
            inputRange: [-16, 16],
            outputRange: [
              `M ${cx + 14} ${cy + 22} Q ${cx + 20} ${cy + 32} ${cx + 18} ${cy + 44} Q ${cx + 16} ${cy + 50} ${cx + 14} ${cy + 56}`,
              `M ${cx + 14} ${cy + 22} Q ${cx + 30} ${cy + 28} ${cx + 22} ${cy + 40} Q ${cx + 16} ${cy + 48} ${cx + 14} ${cy + 56}`,
            ],
          })}
          stroke={bc} strokeWidth={10} fill="none" strokeLinecap="round"
        />
      </>
    );
  }

  // Standing quad default
  return (
    <>
      <Rect x={cx - 14} y={cy - 10} width={28} height={30} rx={12} fill={bc} />
      <Circle cx={cx} cy={cy - 24} r={18} fill={bc} />
      {/* Standing left leg */}
      <Rect x={cx - 14} y={cy + 18} width={11} height={44} rx={5} fill={bc} />
      {/* Right leg bent */}
      <AnimatedPath
        d={sw.interpolate({
          inputRange: [-16, 16],
          outputRange: [
            `M ${cx + 4} ${cy + 18} Q ${cx + 14} ${cy + 32} ${cx + 22} ${cy + 50}`,
            `M ${cx + 4} ${cy + 18} Q ${cx + 18} ${cy + 32} ${cx + 24} ${cy + 44}`,
          ],
        })}
        stroke={bc} strokeWidth={11} fill="none" strokeLinecap="round"
      />
      {/* Quad glow */}
      <AnimatedEllipse cx={cx + 12} cy={cy + 34} rx={8} ry={sw.interpolate({inputRange:[-16,16],outputRange:[16,20]})} fill={ac} opacity={0.2} />
    </>
  );
}

// ── FEET ──────────────────────────────────────────
function FeetIllustration({cx, cy, bc, ac, sin, stretch}: any) {
  const sw = sin(0, 1);
  // Full rotation for ankle circles
  const angle = sw.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <>
      {/* Seated torso */}
      <Rect x={cx - 18} y={cy - 30} width={36} height={42} rx={14} fill={bc} />
      <Circle cx={cx} cy={cy - 44} r={18} fill={bc} />
      {/* Left leg down */}
      <Path d={`M ${cx - 8} ${cy + 10} Q ${cx - 10} ${cy + 30} ${cx - 12} ${cy + 50}`}
        stroke={bc} strokeWidth={12} fill="none" strokeLinecap="round" />
      {/* Right leg raised */}
      <Path d={`M ${cx + 8} ${cy + 10} Q ${cx + 22} ${cy + 2} ${cx + 34} ${cy - 5}`}
        stroke={bc} strokeWidth={12} fill="none" strokeLinecap="round" />
      {/* Ankle circle path */}
      <Circle cx={cx + 50} cy={cy - 5} r={18} stroke={ac} strokeWidth={1.5}
        strokeDasharray="5,4" fill="none" opacity={0.35} />
      {/* Animated foot */}
      <AnimatedG
        style={{
          transform: [{rotate: angle}],
          originX: cx + 50,
          originY: cy - 5,
        } as any}>
        <Ellipse cx={cx + 68} cy={cy - 5} rx={11} ry={6} fill={bc} />
      </AnimatedG>
      {/* Toe spread dots for id 20 */}
      {stretch.id === 20 && ([-2,-1,0,1,2].map((i, idx) => (
        <AnimatedCircle
          key={idx}
          cx={cx + 50 + 20 * Math.cos((i * 20 * Math.PI) / 180 - Math.PI / 2)}
          cy={cy - 5 + 12 * Math.sin((i * 20 * Math.PI) / 180 - Math.PI / 2)}
          r={sw.interpolate({inputRange: [0, 1], outputRange: [3, 5]})}
          fill={ac}
          opacity={0.6}
        />
      )))}
    </>
  );
}

// Helper: animated ellipse (react-native-svg doesn't export AnimatedEllipse by default)
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
