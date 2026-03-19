import {Stretch} from './types';

export const ALL_STRETCHES: Stretch[] = [
  // ── NECK ──────────────────────────────────────────────
  {
    id: 1, zone: 'neck', emoji: '🤸', name: 'Neck Side Stretch',
    duration: 40, glowColor: '#4A9FBF',
    steps: [
      'Drop right ear to right shoulder',
      'Feel the left side of neck open',
      'Hold and breathe deeply',
      'Slowly switch to the other side',
    ],
    cues: [
      "Let's begin at the top. Gently drop your right ear toward your right shoulder.",
      "Feel that stretch along the left side of your neck. Let gravity do the work.",
      "Good. Slowly bring your head to center and drop the left ear to the left shoulder.",
      "Your neck holds so much daily tension. Let it fully release.",
    ],
    tip: 'Keep your chin level. Avoid rotating the head forward.',
  },
  {
    id: 2, zone: 'neck', emoji: '🔄', name: 'Neck Rolls',
    duration: 45, glowColor: '#3A7A8B',
    steps: [
      'Drop chin to chest',
      'Roll slowly to left ear',
      'Continue right in a smooth arc',
      'Reverse direction',
    ],
    cues: [
      "Drop your chin gently to your chest and begin rolling your head slowly to the left.",
      "Let the weight of your head guide the movement. Smooth and unhurried.",
      "Now reverse direction. Roll to the right side.",
      "These slow circles release tension accumulated overnight. Keep breathing.",
    ],
    tip: 'Only half-circles. Never roll head fully backward.',
  },
  {
    id: 3, zone: 'neck', emoji: '↩️', name: 'Chin Tucks',
    duration: 35, glowColor: '#5A9FAB',
    steps: [
      'Sit or stand tall',
      'Draw chin straight back — not down',
      'Hold 3 seconds',
      'Repeat 8 gentle times',
    ],
    cues: [
      "Sit tall. Draw your chin straight back, as if you're making a gentle double chin.",
      "Hold for three seconds. This aligns your cervical spine beautifully.",
      "Release forward and repeat. Eight gentle repetitions.",
      "This counters the forward head position most of us develop from screens and pillows.",
    ],
    tip: 'Think of lengthening the back of your neck, not tucking down.',
  },

  // ── SHOULDERS ─────────────────────────────────────────
  {
    id: 4, zone: 'shoulders', emoji: '🙆', name: 'Chest Opener',
    duration: 40, glowColor: '#7A5FAB',
    steps: [
      'Clasp hands behind your back',
      'Straighten arms and lift gently',
      'Open chest wide toward ceiling',
      'Lift gaze slightly upward',
    ],
    cues: [
      "Clasp both hands behind your back and straighten your arms fully.",
      "Gently lift your arms and open that chest wide toward the ceiling.",
      "This counters all the rounding from sleep and screen time.",
      "Breathe deeply into the front of your chest. Feel your heart open.",
    ],
    tip: 'Engage core lightly to protect lower back.',
  },
  {
    id: 5, zone: 'shoulders', emoji: '💪', name: 'Cross-Body Shoulder',
    duration: 40, glowColor: '#6A4F9B',
    steps: [
      'Bring right arm straight across chest',
      'Left hand draws it closer',
      'Hold 20 seconds',
      'Switch arms',
    ],
    cues: [
      "Bring your right arm straight across your chest and use your left forearm to draw it closer.",
      "Feel this in the back of your right shoulder.",
      "Hold, breathe, then switch. Left arm across, right hand assists.",
      "The posterior shoulder carries so much daily tension.",
    ],
    tip: 'Keep your arm at shoulder height for best effect.',
  },
  {
    id: 6, zone: 'shoulders', emoji: '🙋', name: 'Overhead Tricep Stretch',
    duration: 40, glowColor: '#8A6FAB',
    steps: [
      'Raise right arm overhead',
      'Bend elbow, hand behind head',
      'Left hand guides elbow back',
      'Switch sides',
    ],
    cues: [
      "Raise your right arm, bend at the elbow, let your hand fall behind your head.",
      "Use your left hand to gently guide that right elbow further back.",
      "Feel the deep stretch along the back of your upper arm.",
      "Switch sides. These often-neglected muscles will thank you.",
    ],
    tip: 'Keep head upright throughout.',
  },
  {
    id: 7, zone: 'shoulders', emoji: '🌊', name: 'Shoulder Circles',
    duration: 35, glowColor: '#5A7FAB',
    steps: [
      'Roll both shoulders slowly forward',
      'Up, back, down — full circles',
      '5 rotations forward',
      '5 rotations backward',
    ],
    cues: [
      "Roll both shoulders slowly forward, up, back, and down in big deliberate circles.",
      "Draw large circles in the air with your shoulder tips.",
      "Now reverse. This lubricates your shoulder joints with synovial fluid.",
      "Slow and intentional. These joints carry more load than we realize.",
    ],
    tip: 'Exhale as shoulders roll back and down.',
  },

  // ── BACK ──────────────────────────────────────────────
  {
    id: 8, zone: 'back', emoji: '🐱', name: 'Cat-Cow Flow',
    duration: 60, glowColor: '#4A9A6A',
    steps: [
      'Hands and knees, wrists under shoulders',
      'Exhale: arch back toward ceiling',
      'Inhale: drop belly, lift head',
      '10 connected breaths',
    ],
    cues: [
      "Come onto hands and knees. Wrists under shoulders, knees under hips.",
      "As you exhale, arch your entire back toward the ceiling like a stretching cat.",
      "As you inhale, let your belly drop and lift your head and tailbone.",
      "Let your breath lead this. Ten slow connected breaths. Your spine loves this flow.",
    ],
    tip: 'One full breath per movement. Slower is better.',
  },
  {
    id: 9, zone: 'back', emoji: '🌀', name: 'Supine Spinal Twist',
    duration: 55, glowColor: '#3A8A5A',
    steps: [
      'Lie on your back',
      'Hug right knee to chest',
      'Let knee fall left across body',
      'Extend arm out, gaze right. Switch.',
    ],
    cues: [
      "Lie on your back and hug your right knee into your chest.",
      "Now let that knee fall gently across your body to the left side.",
      "Extend your right arm out and gaze toward your right fingertips.",
      "This twist massages your spine and calms your nervous system. Switch sides.",
    ],
    tip: 'Both shoulders ideally stay on the floor.',
  },
  {
    id: 10, zone: 'back', emoji: '🧘', name: "Child's Pose",
    duration: 60, glowColor: '#5AAA7A',
    steps: [
      'Kneel and sit back onto heels',
      'Walk hands forward on floor',
      'Rest forehead down completely',
      'Breathe into back of ribs',
    ],
    cues: [
      "From kneeling, sit back toward your heels and walk your hands forward.",
      "Let your forehead rest on the floor or a pillow. Complete surrender.",
      "Breathe deeply into the back of your ribs. Feel your back rise with each inhale.",
      "Child's pose is one of the most healing positions for the lumbar spine.",
    ],
    tip: 'Widen knees for deeper hip stretch.',
  },
  {
    id: 11, zone: 'back', emoji: '⬆️', name: 'Spine Roll-Down',
    duration: 55, glowColor: '#4A9A6A',
    steps: [
      'Stand feet hip-width apart',
      'Tuck chin, round slowly forward',
      'Roll down vertebra by vertebra',
      'Hang heavy, roll slowly back up',
    ],
    cues: [
      "Stand tall with feet hip-width apart. Tuck your chin gently to your chest.",
      "Now roll forward slowly, one vertebra at a time.",
      "Let your head and arms hang completely heavy. Decompress each segment.",
      "Roll back up just as slowly. Your head rises last. This is spinal therapy.",
    ],
    tip: 'Generously bend your knees if hamstrings are tight.',
  },

  // ── CORE ──────────────────────────────────────────────
  {
    id: 12, zone: 'core', emoji: '🌙', name: 'Seated Side Bend',
    duration: 40, glowColor: '#A07030',
    steps: [
      'Sit cross-legged or in a chair',
      'Raise right arm overhead',
      'Lean slowly to the left',
      'Hold, then switch sides',
    ],
    cues: [
      "Sit comfortably and raise your right arm straight overhead.",
      "Now lean slowly to the left, creating a long arc from hip to fingertips.",
      "Feel the entire right side — ribs, waist, shoulder — opening up.",
      "Switch sides. Breathe into the stretch with every exhale.",
    ],
    tip: "Keep both hips grounded. Don't let one side lift.",
  },
  {
    id: 13, zone: 'core', emoji: '🦋', name: 'Butterfly Hip Opener',
    duration: 50, glowColor: '#B08040',
    steps: [
      'Soles of feet together',
      'Knees fall out wide',
      'Sit tall, hold your feet',
      'Gently press knees toward floor',
    ],
    cues: [
      "Bring the soles of your feet together and let your knees fall wide, like butterfly wings.",
      "Sit as tall as you can, holding your feet or ankles.",
      "You might gently flutter your knees or softly press them toward the floor.",
      "Your inner thighs and hip joints open beautifully here.",
    ],
    tip: 'Feet closer to body intensifies the stretch.',
  },
  {
    id: 14, zone: 'core', emoji: '🦵', name: 'Hip Flexor Lunge',
    duration: 50, glowColor: '#C09050',
    steps: [
      'Right foot forward, knee over ankle',
      'Lower left knee to floor',
      'Press hips forward and down',
      'Arms overhead for depth, then switch',
    ],
    cues: [
      "Step your right foot forward into a low lunge. Your left knee rests on the floor.",
      "Gently press your hips forward and down. Feel the front of the left hip opening.",
      "This is the most important stretch for those who sit. Hip flexors shorten over decades.",
      "Raise your arms overhead to deepen. Then switch legs.",
    ],
    tip: 'Fold a towel under the back knee for comfort.',
  },
  {
    id: 15, zone: 'core', emoji: '🌿', name: 'Modified Pigeon',
    duration: 55, glowColor: '#A08030',
    steps: [
      'From hands and knees, slide right knee forward',
      'Knee near right wrist',
      'Extend left leg straight behind',
      'Fold forward or prop on hands',
    ],
    cues: [
      "From hands and knees, slide your right knee forward toward your right wrist.",
      "Extend your left leg straight back and try to square your hips.",
      "You may stay propped on hands or fold forward onto forearms.",
      "This is the queen of hip openers. Breathe here. Switch sides.",
    ],
    tip: 'Place folded blanket under front hip if needed.',
  },

  // ── LEGS ──────────────────────────────────────────────
  {
    id: 16, zone: 'legs', emoji: '🧎', name: 'Standing Quad Stretch',
    duration: 40, glowColor: '#3A5A8A',
    steps: [
      'Stand near wall for balance',
      'Bend right knee, foot to hand',
      'Keep knees together',
      'Hold 20s, switch legs',
    ],
    cues: [
      "Stand tall and bend your right knee, bringing your foot up toward your right hand.",
      "Keep both knees together and gently tuck your hips forward.",
      "Feel the front of your right thigh stretch open. Use a wall for balance.",
      "Switch legs. Your quadriceps carry you all day.",
    ],
    tip: 'Slight tuck of tailbone protects lower back.',
  },
  {
    id: 17, zone: 'legs', emoji: '🌿', name: 'Seated Hamstring Stretch',
    duration: 50, glowColor: '#4A6A9A',
    steps: [
      'Sit, both legs extended',
      'Hinge forward from hips',
      'Reach toward feet or shins',
      'Keep spine long throughout',
    ],
    cues: [
      "Sit up tall with both legs stretched in front of you.",
      "Hinge forward from your hips — belly button reaching toward your toes.",
      "Hold wherever you naturally reach. Feet, shins, or ankles are all perfect.",
      "A long spine matters more than how far you reach.",
    ],
    tip: 'Gently bent knees is fine and safer for most.',
  },
  {
    id: 18, zone: 'legs', emoji: '🔄', name: 'Standing Knee Circles',
    duration: 35, glowColor: '#3A5A7A',
    steps: [
      'Stand with knees slightly bent',
      'Hands gently on knees',
      'Draw slow circles with both knees',
      '5 circles each direction',
    ],
    cues: [
      "Stand with a slight bend in both knees and rest your hands gently on top of them.",
      "Draw slow, smooth circles with your knees moving together.",
      "This gently warms the knee joint and surrounding cartilage.",
      "Reverse direction. Slow and smooth. Treat these joints with great care.",
    ],
    tip: 'Keep feet flat on the floor throughout.',
  },

  // ── FEET ──────────────────────────────────────────────
  {
    id: 19, zone: 'feet', emoji: '🦶', name: 'Ankle Circles',
    duration: 40, glowColor: '#4A7A4A',
    steps: [
      'Lift right foot slightly',
      'Draw large slow circles with ankle',
      '8 circles each direction',
      'Switch feet',
    ],
    cues: [
      "Lift your right foot and begin drawing large, slow circles with your ankle.",
      "Eight circles clockwise, eight counter-clockwise.",
      "Your ankles are the foundation of your entire body. Keep them mobile.",
      "Switch feet. Notice if one side feels tighter than the other.",
    ],
    tip: 'Make circles as large as possible for full range of motion.',
  },
  {
    id: 20, zone: 'feet', emoji: '🌱', name: 'Toe Stretches & Foot Roll',
    duration: 45, glowColor: '#5A8A5A',
    steps: [
      'Cross right foot over left knee',
      'Gently spread toes wide apart',
      'Circle each toe both directions',
      'Roll foot over firm surface',
    ],
    cues: [
      "Cross your right foot over your left knee and gently spread your toes apart.",
      "Most of us have spent decades compressing our toes into shoes. Give them space.",
      "Now gently rotate each toe in small circles in both directions.",
      "Place foot down and roll it slowly forward and back. Switch feet. Wonderful work today.",
    ],
    tip: 'Barefoot on yoga mat is ideal.',
  },
];

export const QUICK_ROUTINES: Record<string, {name: string; ids: number[]}> = {
  quick5:   {name: '5-Min Wake Up',    ids: [1, 4, 8, 16]},
  mobility: {name: 'Joint Mobility',   ids: [2, 5, 7, 18, 19, 20]},
  evening:  {name: 'Evening Wind Down',ids: [9, 10, 11, 13, 15]},
};
