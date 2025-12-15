<svelte:head>
	<title>Support Resources | Terror Watch Australia</title>
	<meta
		name="description"
		content="Mental health contacts, community services, and media literacy tips to stay informed after an incident."
	/>
</svelte:head>

<main class="page">
	<section class="hero">
		<p class="eyebrow">After an incident</p>
		<h2>Support and wellbeing</h2>
		<p class="lede">
			Recovering from a stressful event takes time. Reach out early, talk with people you trust, and use
			the support options available to you.
		</p>
	</section>

	<section class="grid">
		<article class="panel">
			<p class="label">Mental health</p>
			<ul>
				<li><strong>Beyond Blue:</strong> 1300 22 4636 (24/7 support)</li>
				<li><strong>Lifeline:</strong> 13 11 14 (24/7 crisis support)</li>
				<li>Speak with your GP for referrals to counselling or psychology services.</li>
				<li>Check in on children and older people—ask how they are feeling and offer to listen.</li>
			</ul>
		</article>

		<article class="panel">
			<p class="label">Community support</p>
			<ul>
				<li>Local community centres and councils can advise on nearby services.</li>
				<li>Schools and universities often provide counselling or wellbeing teams.</li>
				<li>Workplaces may have employee assistance programs for free, confidential support.</li>
				<li>Faith and cultural organisations can offer connection and practical help.</li>
			</ul>
		</article>
	</section>

	<section class="panel secondary">
		<h3>Media literacy tips</h3>
		<ul>
			<li>Use official sources and trusted news outlets; avoid unverified social media posts.</li>
			<li>Limit exposure to graphic footage and take breaks from continuous coverage.</li>
			<li>Check the date and origin of information before sharing.</li>
			<li>Report harmful or sensational content on platforms where you see it.</li>
		</ul>
	</section>

	<section class="panel note">
		<h3>Looking after yourself</h3>
		<p>
			Trouble sleeping, feeling on edge, or replaying events are common reactions. If these feelings
			continue or worsen, reach out to a health professional or call Beyond Blue or Lifeline for support.
		</p>
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
		max-width: 780px;
		margin: 0;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 12px;
	}

	.panel {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 14px;
		padding: 12px;
		display: grid;
		gap: 8px;
	}

	.panel.secondary {
		border-style: dashed;
	}

	.panel.note {
		border: 1px solid rgba(17, 201, 228, 0.3);
		background: rgba(17, 201, 228, 0.08);
	}

	.label {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #9bc7ff;
		font-weight: 700;
		font-size: 0.85rem;
	}

	.panel h3 {
		margin: 0;
	}

	.panel ul {
		margin: 0;
		padding-left: 18px;
		color: #d5e2f2;
		display: grid;
		gap: 6px;
		line-height: 1.5;
	}

	.panel p {
		margin: 0;
		color: #e6f7ff;
		line-height: 1.5;
	}
</style>
