export interface ThreatLevelVisual {
	value: number;
	name: string;
	color: string;
	accent: string;
	pattern: string;
	tagline: string;
}

export const THREAT_LEVEL_VISUALS: ThreatLevelVisual[] = [
	{
		value: 1,
		name: 'NOT EXPECTED',
		color: '#0f6e9e',
		accent: '#5bd8ff',
		pattern: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.18) 0 10px, transparent 10px 20px)',
		tagline: 'No specific threat identified. Routine awareness is sufficient.'
	},
	{
		value: 2,
		name: 'POSSIBLE',
		color: '#13764f',
		accent: '#6be6b2',
		pattern: 'radial-gradient(circle at 12px 12px, rgba(255,255,255,0.18) 2px, transparent 0)',
		tagline: 'A potential threat exists. Maintain everyday vigilance.'
	},
	{
		value: 3,
		name: 'PROBABLE',
		color: '#c28b1b',
		accent: '#ffe58f',
		pattern: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.2) 0 12px, transparent 12px 24px)',
		tagline: 'Credible intelligence indicates a plausible threat. Stay alert in public spaces.'
	},
	{
		value: 4,
		name: 'EXPECTED',
		color: '#d65f1d',
		accent: '#ffc086',
		pattern: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.2) 0 8px, transparent 8px 16px)',
		tagline: 'A threat is anticipated. Follow official advice and expect heightened security.'
	},
	{
		value: 5,
		name: 'CERTAIN',
		color: '#c23330',
		accent: '#ff9b9b',
		pattern: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.22) 0 6px, transparent 6px 12px)',
		tagline: 'A terrorist act is assessed as imminent or has occurred. Avoid risks and follow directions.'
	}
];

export const getVisualForLevel = (level: number): ThreatLevelVisual =>
	THREAT_LEVEL_VISUALS.find((item) => item.value === level) ?? {
		value: level,
		name: 'UNKNOWN',
		color: '#4a6072',
		accent: '#9bb3c5',
		pattern: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.12) 0 10px, transparent 10px 20px)',
		tagline: 'Threat level unavailable. Check the official source for updates.'
	};
