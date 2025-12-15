export type ThreatLevelSource = 'scraped' | 'cache' | 'database' | 'fallback';

export interface ThreatLevel {
	level: number;
	name: string;
	description: string;
	link: string;
	fetchedAt: Date;
	source: ThreatLevelSource;
}

export interface ThreatLevelRaw {
	ThreatLevelNo: string;
	ThreatLevelName: string;
	ThreatLevelDesc: string;
	ThreatLevelLink: string;
}
