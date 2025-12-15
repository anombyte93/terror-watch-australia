<script lang="ts">
	type Step = {
		id: 'run' | 'hide' | 'tell';
		title: string;
		summary: string;
		points: string[];
	};

	const steps: Step[] = [
		{
			id: 'run',
			title: 'RUN',
			summary: 'Escape if you can. Leave belongings. Help others if it’s safe.',
			points: [
				'Move away from the danger quickly and calmly.',
				'Leave bags and personal items behind.',
				'Warn people nearby while you exit.',
				'Choose a safe route that avoids the threat.'
			]
		},
		{
			id: 'hide',
			title: 'HIDE',
			summary: 'If you cannot escape, shelter out of sight and make yourself hard to find.',
			points: [
				'Lock or barricade doors and turn off lights.',
				'Stay quiet, silence phones, and switch devices to flight mode.',
				'Keep low and away from windows or interior glass.',
				'Plan a secondary exit if the situation changes.'
			]
		},
		{
			id: 'tell',
			title: 'TELL',
			summary: 'When safe, call 000 and share clear details.',
			points: [
				'Call 000 when you are safe to speak.',
				'Describe your exact location and any safe entry points for responders.',
				'Share what you saw: people involved, clothing, weapons, direction of travel.',
				'Follow instructions from emergency services and remain on the line if asked.'
			]
		}
	];
</script>

<svelte:head>
	<title>What To Do In An Attack | Terror Watch Australia</title>
	<meta
		name="description"
		content="Clear Run, Hide, Tell guidance for Australians during an attack: how to escape, shelter, and contact 000."
	/>
</svelte:head>

<main class="page">
	<section class="hero">
		<p class="eyebrow">Immediate actions</p>
		<h2>Run. Hide. Tell.</h2>
		<p class="lede">
			In an attack, act quickly and stay calm. Prioritise your safety first, then help others if you can
			do so without putting yourself in danger.
		</p>
	</section>

	<section class="steps" aria-label="Run hide tell steps">
		{#each steps as step}
			<article class="step">
				<div class={`icon ${step.id}`} aria-hidden="true">
					{#if step.id === 'run'}
						<svg viewBox="0 0 64 64" role="presentation">
							<path
								d="M30 14a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z"
								fill="currentColor"
							/>
							<path
								d="M18 34c4-4 10-7 14-9l5-7 7 4-4 6c-1.4 2-3.7 3.2-6.2 3.3l-3.8.1-4 5.6 7.7 4.6-3.3 6.5-14.5-8.4c-1.6-.9-2-3-.8-4.4Z"
								fill="currentColor"
							/>
							<path d="M35 32 22 26l2.6-6.3L38 25l-3 7Z" fill="currentColor" />
						</svg>
					{:else if step.id === 'hide'}
						<svg viewBox="0 0 64 64" role="presentation">
							<path
								d="M8 30c5.6-7.3 14.2-12 24-12s18.4 4.7 24 12c-5.6 7.3-14.2 12-24 12S13.6 37.3 8 30Z"
								stroke="currentColor"
								stroke-width="4"
								fill="none"
							/>
							<circle cx="32" cy="30" r="8" stroke="currentColor" stroke-width="4" fill="none" />
							<path d="M14 45c4.5 3.2 10.7 5 18 5s13.5-1.8 18-5" stroke="currentColor" stroke-width="4" />
						</svg>
					{:else}
						<svg viewBox="0 0 64 64" role="presentation">
							<path
								d="M44 56H22a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6h12.6a2 2 0 0 1 1.4.6l10.4 10.4a2 2 0 0 1 .6 1.4V50a6 6 0 0 1-6 6Z"
								fill="none"
								stroke="currentColor"
								stroke-width="4"
							/>
							<path d="M32 10v12a4 4 0 0 0 4 4h12" stroke="currentColor" stroke-width="4" fill="none" />
							<circle cx="32" cy="44" r="4" fill="currentColor" />
						</svg>
					{/if}
				</div>
				<div class="body">
					<p class="label">{step.title}</p>
					<h3>{step.summary}</h3>
					<ul>
						{#each step.points as point}
							<li>{point}</li>
						{/each}
					</ul>
				</div>
			</article>
		{/each}
	</section>

	<section class="after">
		<h3>After the danger passes</h3>
		<div class="columns">
			<ul>
				<li>Check on people nearby and provide basic first aid if you are trained.</li>
				<li>Follow directions from police and emergency services.</li>
				<li>Share witness details only with authorities, not on social media.</li>
			</ul>
			<ul>
				<li>Keep exits clear for responders and allow emergency vehicles through.</li>
				<li>Contact family or friends once safe to do so.</li>
				<li>Seek support for yourself and others who may be distressed.</li>
			</ul>
		</div>
	</section>
</main>

<style>
	.page {
		display: grid;
		gap: 18px;
	}

	.hero h2 {
		margin: 0 0 6px;
		font-size: clamp(1.8rem, 2.6vw, 2.1rem);
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #8ed0ff;
		margin: 0;
		font-size: 0.82rem;
	}

	.lede {
		color: #cfd9e9;
		line-height: 1.6;
		max-width: 800px;
		margin: 0;
	}

	.steps {
		display: grid;
		gap: 10px;
	}

	.step {
		display: grid;
		grid-template-columns: 130px 1fr;
		gap: 14px;
		padding: 14px;
		border-radius: 14px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.03);
		align-items: center;
	}

	.icon {
		width: 110px;
		height: 110px;
		border-radius: 16px;
		display: grid;
		place-items: center;
		color: #0b1621;
	}

	.icon svg {
		width: 70%;
		height: 70%;
	}

	.icon.run {
		background: linear-gradient(140deg, #3ec5ff, #138dff);
	}

	.icon.hide {
		background: linear-gradient(140deg, #a1b5ff, #5d7cff);
	}

	.icon.tell {
		background: linear-gradient(140deg, #ffd37a, #ff9b4d);
	}

	.body .label {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #9bc7ff;
		font-weight: 700;
	}

	.body h3 {
		margin: 4px 0 8px;
		font-size: 1.2rem;
	}

	.body ul {
		margin: 0;
		padding-left: 18px;
		color: #d5e2f2;
		line-height: 1.5;
		display: grid;
		gap: 6px;
	}

	.after {
		background: rgba(17, 201, 228, 0.08);
		border: 1px solid rgba(17, 201, 228, 0.25);
		border-radius: 14px;
		padding: 12px;
	}

	.after h3 {
		margin: 0 0 8px;
	}

	.columns {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 12px;
	}

	.columns ul {
		margin: 0;
		padding-left: 18px;
		color: #e6f7ff;
		display: grid;
		gap: 6px;
		line-height: 1.5;
	}

	@media (max-width: 720px) {
		.step {
			grid-template-columns: 1fr;
		}

		.icon {
			justify-self: start;
		}
	}
</style>
