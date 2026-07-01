export interface WellnessTip {
  id: string
  icon: string
  text: string
  category: 'stretch' | 'hydration' | 'breathing' | 'movement' | 'eyes' | 'posture' | 'mindfulness'
}

export const WELLNESS_TIPS: WellnessTip[] = [
  { id: '1', icon: 'Droplets', text: 'Drink a glass of water to stay hydrated and maintain focus.', category: 'hydration' },
  { id: '2', icon: 'Wind', text: 'Take 5 deep breaths. Inhale for 4 counts, hold for 4, exhale for 6.', category: 'breathing' },
  { id: '3', icon: 'Eye', text: 'Look at something 20 feet away for 20 seconds to rest your eyes.', category: 'eyes' },
  { id: '4', icon: 'PersonStanding', text: 'Stand up and do 10 shoulder rolls to release tension.', category: 'stretch' },
  { id: '5', icon: 'Footprints', text: 'Take a short walk around the room to boost circulation.', category: 'movement' },
  { id: '6', icon: 'Smile', text: 'Close your eyes for a moment and relax your facial muscles.', category: 'mindfulness' },
  { id: '7', icon: 'ArrowUpDown', text: 'Sit up straight and adjust your posture before the next session.', category: 'posture' },
  { id: '8', icon: 'Droplets', text: 'Refill your water bottle — staying hydrated improves cognitive performance.', category: 'hydration' },
  { id: '9', icon: 'Dumbbell', text: 'Do 10 quick desk push-ups to energize your body.', category: 'movement' },
  { id: '10', icon: 'Wind', text: 'Try box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s.', category: 'breathing' },
  { id: '11', icon: 'Eye', text: 'Blink 20 times slowly to lubricate your eyes.', category: 'eyes' },
  { id: '12', icon: 'PersonStanding', text: 'Stretch your neck gently — tilt left, right, forward, and back.', category: 'stretch' },
  { id: '13', icon: 'Footprints', text: 'Walk to get a snack or step outside for fresh air.', category: 'movement' },
  { id: '14', icon: 'Brain', text: 'Take a moment to celebrate completing that focus session!', category: 'mindfulness' },
  { id: '15', icon: 'ArrowUpDown', text: 'Adjust your monitor height — your eyes should align with the top third of the screen.', category: 'posture' },
  { id: '16', icon: 'Droplets', text: 'Herbal tea is a great hydration option and can reduce stress.', category: 'hydration' },
  { id: '17', icon: 'Dumbbell', text: 'Do 10 calf raises while standing at your desk.', category: 'movement' },
  { id: '18', icon: 'Wind', text: 'Practice the 4-7-8 breathing technique to calm your nervous system.', category: 'breathing' },
  { id: '19', icon: 'Eye', text: 'Reduce blue light exposure by dimming your screen slightly.', category: 'eyes' },
  { id: '20', icon: 'PersonStanding', text: 'Stretch your wrists — extend your arm and gently pull back your fingers.', category: 'stretch' },
  { id: '21', icon: 'Footprints', text: 'A 2-minute walk can improve creativity and problem-solving.', category: 'movement' },
  { id: '22', icon: 'Smile', text: 'Think of one thing you are grateful for right now.', category: 'mindfulness' },
  { id: '23', icon: 'ArrowUpDown', text: 'Check your keyboard height — your elbows should be at 90 degrees.', category: 'posture' },
  { id: '24', icon: 'Droplets', text: 'Coconut water is excellent for replenishing electrolytes.', category: 'hydration' },
  { id: '25', icon: 'Dumbbell', text: 'Do 15 jumping jacks to get your blood flowing.', category: 'movement' },
  { id: '26', icon: 'Wind', text: 'Breathe slowly and deeply — stress reduces cognitive performance.', category: 'breathing' },
  { id: '27', icon: 'Eye', text: 'Splash cool water on your face to refresh and reduce eye strain.', category: 'eyes' },
  { id: '28', icon: 'PersonStanding', text: 'Roll your shoulders backward 10 times to release upper back tension.', category: 'stretch' },
  { id: '29', icon: 'Footprints', text: 'March in place for 60 seconds to boost energy without leaving your space.', category: 'movement' },
  { id: '30', icon: 'Brain', text: 'Visualize successfully completing your next focus session.', category: 'mindfulness' },
  { id: '31', icon: 'ArrowUpDown', text: 'Stand up and do a full-body stretch — reach your arms overhead.', category: 'stretch' },
  { id: '32', icon: 'Droplets', text: 'Avoid sugary drinks — they cause energy crashes that hurt focus.', category: 'hydration' },
  { id: '33', icon: 'Dumbbell', text: 'Squeeze your glutes for 10 seconds — a simple seated exercise.', category: 'movement' },
  { id: '34', icon: 'Smile', text: 'Smile! Research shows smiling can improve mood and reduce stress.', category: 'mindfulness' },
  { id: '35', icon: 'Eye', text: 'Adjust your screen brightness to match your environment.', category: 'eyes' },
  { id: '36', icon: 'PersonStanding', text: 'Do a seated twist stretch — rotate your torso to each side.', category: 'stretch' },
  { id: '37', icon: 'Wind', text: 'Take one slow, conscious breath before starting your next task.', category: 'breathing' },
]
