export function prefersReducedMotion() {
  try {
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    return false;
  }
}

export function heavyAnimationsEnabled() {
  try {
    if (typeof window === 'undefined') return false;
    const flag = window.localStorage && window.localStorage.getItem && window.localStorage.getItem('enableHeavyAnimations');
    if (prefersReducedMotion()) return false;
    return flag === '1';
  } catch (e) {
    return false;
  }
}

export default heavyAnimationsEnabled;
