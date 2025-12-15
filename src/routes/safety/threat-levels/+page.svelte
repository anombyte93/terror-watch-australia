<script lang="ts">
	type ThreatLevel = {
		name: string;
		description: string;
		publicGuidance: string;
	};

	const currentLevel = 'Possible';

	const levels: ThreatLevel[] = [
		{
			name: 'Certain',
			description: 'Terrorist action is expected to occur.',
			publicGuidance: 'Follow instructions from authorities. Expect visible security measures and delays.'
		},
		{
			name: 'Expected',
			description: 'Terrorist action is assessed as highly likely.',
			publicGuidance: 'Stay alert in crowded places, follow security directions, and report anything unusual.'
		},
		{
			name: 'Probable',
			description: 'Terrorist action is assessed as likely.',
			publicGuidance: 'Be aware of your surroundings and report suspicious behaviour to the National Security Hotline.'
		},
		{
			name: 'Possible',
			description: 'Terrorist action could occur.',
			publicGuidance: 'Stay informed, be aware of safety exits in busy locations, and keep emergency numbers handy.'
		},
		{
			name: 'Not expected',
			description: 'Terrorist action is not expected.',
			publicGuidance: 'Remain aware of your environment and continue to report anything that concerns you.'
		}
	];

	const history = [
		{
			year: 2022,
			month: 'November',
			level: 'Possible',
			detail: 'Threat level lowered from Probable after reassessment of capability and intent.'
		},
		{
			year: 2014,
			month: 'September',
			level: 'Probable',
			detail: 'Raised to Probable in response to global threat environment.'
		}
	];
</script>

<svelte:head>
	<title>Understanding Threat Levels | Terror Watch Australia</title>
	<meta
		name="description"
		content="Plain-language explainer of Australia’s five terrorism threat levels and what they mean for the public."
	/>
</svelte:head>

<main class="page">
	<section class="hero">
		<p class="eyebrow">National system</p>
		<h2>Understanding threat levels</h2>
		<p class="lede">
			Australia uses five terrorism threat levels. They describe the likelihood of a terrorist act, not a
			specific warning about a place or time.
		</p>
	</section>

	<section class="levels" aria-label="Threat levels list">
		{#each levels as level}
			<article class={`level ${level.name.toLowerCase().replace(/\\s+/g, '-')}`}>
				<div class="header">
					<p class="label">Threat level</p>
					<div class="name-row">
						<h3>{level.name}</h3>
						{#if level.name === currentLevel}
							<span class="pill" aria-label="Current threat level">Current</span>
						{/if}
					</div>
				</div>
				<p class="desc">{level.description}</p>
				<p class="guidance">
					<strong>For the public:</strong> {level.publicGuidance}
				</p>
			</article>
		{/each}
	</section>

	<section class="panel">
		<h3>Official information</h3>
		<p>
			For the latest updates, visit the
			<a
				href="https://www.nationalsecurity.gov.au/what-australias-national-terrorism-threat-level"
				target="_blank"
				rel="noreferrer"
			>
				Australian National Security website
			</a>.
		</p>
	</section>

	<section class="panel secondary" aria-label="Threat level history">
		<h3>Recent changes</h3>
		<ul>
			{#each history as entry}
				<li>
					<strong>{entry.month} {entry.year}:</strong> Level set to {entry.level}. {entry.detail}
				</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	.page {
		display: grid;
		gap: 16px;
	}

	.hero h2 {
		margin: 0 0 6px;
		font-size: clamp(1.7rem, 2.5vw, 2rem);
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #9bc7ff;
		margin: 0;
		font-size: 0.82rem;
	}

	.lede {
		color: #cfd9e9;
		line-height: 1.6;
		max-width: 800px;
		margin: 0;
	}

	.levels {
		display: grid;
		gap: 10px;
	}

	.level {
		border-radius: 14px;
		padding: 14px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.03);
		display: grid;
		gap: 8px;
	}

	.level.certain {
		border-color: rgba(255, 120, 120, 0.4);
	}

	.level.expected {
		border-color: rgba(255, 179, 102, 0.35);
	}

	.level.probable {
		border-color: rgba(255, 221, 102, 0.35);
	}

	.level.possible {
		border-color: rgba(80, 209, 255, 0.35);
	}

	.level.not-expected {
		border-color: rgba(140, 220, 170, 0.35);
	}

	.header {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		align-items: center;
	}

	.label {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #9bc7ff;
		font-weight: 700;
		font-size: 0.85rem;
	}

	.name-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.level h3 {
		margin: 0;
		font-size: 1.3rem;
	}

	.desc {
		margin: 0;
		color: #d5e2f2;
	}

	.guidance {
		margin: 0;
		color: #e6f7ff;
		line-height: 1.5;
	}

	.pill {
		padding: 4px 10px;
		border-radius: 999px;
		background: linear-gradient(120deg, #1f7ae0, #11c9e4);
		color: #041321;
		font-weight: 700;
		font-size: 0.85rem;
	}

	.panel {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 14px;
		padding: 12px;
		display: grid;
		gap: 6px;
	}

	.panel.secondary {
		border-style: dashed;
	}

	.panel a {
		color: #9bc7ff;
		font-weight: 600;
		text-decoration: none;
	}

	.panel a:hover {
		color: #cfe3ff;
		text-decoration: underline;
	}

	.panel ul {
		margin: 0;
		padding-left: 18px;
		display: grid;
		gap: 6px;
		color: #d5e2f2;
	}

	@media (max-width: 560px) {
		.header {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
