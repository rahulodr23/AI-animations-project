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
  {
    id: '004-folder-books',
    name: 'Folder Books',
    description: 'A yellow frosted folder with overlapping book covers that pop out on hover.',
    type: 'gsap',
    tags: ['folder', 'hover', 'books', 'glassmorphism', '3d'],
    folder: '/animations/004-folder-books',
  },
  {
    id: '005-details-edit',
    name: 'Details Edit Split',
    description: 'A details card that splits into jelly-bouncy editable fields on edit, then merges back on save or cancel.',
    type: 'gsap',
    tags: ['form', 'edit', 'jelly', 'micro-interaction', 'card'],
    folder: '/animations/005-details-edit',
  },
];
