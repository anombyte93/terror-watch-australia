// Export client-safe utilities and components from this module.
// Server-only utilities should stay under src/lib/server.

// Design System Components (Task 08)
export { default as Layout } from './components/Layout.svelte';
export { default as Header } from './components/Header.svelte';
export { default as Footer } from './components/Footer.svelte';
export { default as Container } from './components/Container.svelte';
export { default as Card } from './components/Card.svelte';
export { default as Button } from './components/Button.svelte';

// Threat Level Components (Task 05)
export { default as ThreatLevel } from './components/ThreatLevel.svelte';
export { default as ThreatLevelCard } from './components/ThreatLevelCard.svelte';
export { default as ThreatLevelMeter } from './components/ThreatLevelMeter.svelte';
export { THREAT_LEVEL_VISUALS, getVisualForLevel } from './components/threat-level-palette';

// News Components (Task 06)
export { default as CategoryBadge } from './components/CategoryBadge.svelte';
export { default as NewsCard } from './components/NewsCard.svelte';
export { default as NewsFeed } from './components/NewsFeed.svelte';
export { default as NewsFilters } from './components/NewsFilters.svelte';

// Safety Components (Task 07)
export { default as EmergencyBanner } from './components/EmergencyBanner.svelte';
