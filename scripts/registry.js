/**
 * Central registry of all animations in the playground.
 * Each entry describes one animation and where to find its files.
 */
export const animations = [
  {
    id: '001-bounce-button',
    name: 'Bounce Button',
    description: 'A button that bounces with a spring effect on hover.',
    type: 'gsap',
    tags: ['button', 'hover', 'micro-interaction'],
    folder: '/animations/001-bounce-button',
  },
  {
    id: '002-pulse-loader',
    name: 'Pulse Loader',
    description: 'A minimal loading animation with three pulsing dots, built with pure CSS.',
    type: 'css',
    tags: ['loader', 'dots', 'pulse'],
    folder: '/animations/002-pulse-loader',
  },
  {
    id: '003-lottie-check',
    name: 'Success Checkmark',
    description: 'An animated checkmark for success states, using Lottie for cross-platform reuse.',
    type: 'lottie',
    tags: ['checkmark', 'success', 'icon'],
    folder: '/animations/003-lottie-check',
  },
];
