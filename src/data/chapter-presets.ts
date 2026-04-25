export interface ChapterPreset {
  name: string;
  hex: string;
}

// Muted, cohesive palette — works on both light and dark backgrounds
// Based on a warm-to-cool spectrum with consistent saturation and lightness
export const chapterColors: ChapterPreset[] = [
  { name: 'Indigo',    hex: '#6366F1' },
  { name: 'Sky',       hex: '#38BDF8' },
  { name: 'Teal',      hex: '#2DD4BF' },
  { name: 'Sage',      hex: '#4ADE80' },
  { name: 'Honey',     hex: '#FBBF24' },
  { name: 'Peach',     hex: '#FB923C' },
  { name: 'Coral',     hex: '#F87171' },
  { name: 'Rose',      hex: '#F472B6' },
  { name: 'Lavender',  hex: '#C084FC' },
  { name: 'Steel',     hex: '#94A3B8' },
];

export const suggestedChapters = [
  'Childhood',
  'School',
  'University',
  'First Job',
  'Career',
  'Travel',
  'Relationship',
  'Marriage',
  'Parenthood',
  'Retirement',
];
