export const colors = {
  default: '',
  primary: 'var(--color-primary)',
  danger: '#ff496e',

  inactive: 'var(--color-inactive)',
  // layout
  hoverSurface: 'var(--color-bg)',
  hoverSecondary: 'var(--color-hover-raised-surface)',
};

export type Color = keyof typeof colors;
