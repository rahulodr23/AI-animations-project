/**
 * Central registry of all animations in the playground.
 * Each entry describes one animation and where to find its files.
 */
export const animations = [
  {
    id: '001-folder-books',
    name: 'Folder Books',
    description: 'A yellow frosted folder with overlapping book covers that pop out on hover.',
    type: 'gsap',
    tags: ['folder', 'hover', 'books', 'glassmorphism', '3d'],
    folder: '/animations/001-folder-books',
  },
  {
    id: '002-details-edit',
    name: 'Details Edit Split',
    description: 'A details card that splits into jelly-bouncy editable fields on edit, then merges back on save or cancel.',
    type: 'gsap',
    tags: ['form', 'edit', 'jelly', 'micro-interaction', 'card'],
    folder: '/animations/002-details-edit',
  },
  {
    id: '003-login-user',
    name: 'Fluid Login',
    description: 'A matte-black user icon with a prismatic fluid ring. Tap to spin the glow, fill the icon, then reveal a success check.',
    type: 'gsap',
    tags: ['login', 'fluid', 'glow', 'micro-interaction', 'success'],
    folder: '/animations/003-login-user',
  },
  {
    id: '004-country-swipe',
    name: 'Country Swipe',
    description: 'Swipe a 9:16 country card out of a soft-shadow frame — it rotates 90° on its vertical axis as the next European destination spins in.',
    type: 'gsap',
    tags: ['swipe', 'card', '3d', 'rotate', 'countries', 'drag'],
    folder: '/animations/004-country-swipe',
  },
];
