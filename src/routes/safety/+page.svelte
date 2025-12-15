<svelte:head>
	<title>Safety Guidance Hub | Terror Watch Australia</title>
	<meta
		name="description"
		content="Find emergency actions, report pathways, threat level explanations, and support resources for Australians."
	/>
	<meta property="og:title" content="Safety Guidance Hub | Terror Watch Australia" />
	<meta property="og:description" content="Find emergency actions, report pathways, threat level explanations, and support resources for Australians." />
	<meta property="og:url" content="https://terrorwatch.au/safety" />
</svelte:head>

<main class="page">
	<section class="intro">
		<h2>Your quick safety reference</h2>
		<p class="lede">
			Use this hub to access clear steps for an emergency, report concerns, understand threat levels, and
			find support after an incident.
		</p>
		<div class="pillars" aria-label="Key safety pillars">
			<div class="pillar">
				<span class="dot run"></span>
				<h3>Act fast</h3>
				<p>Know the Run, Hide, Tell sequence so you can move quickly without panic.</p>
			</div>
			<div class="pillar">
				<span class="dot report"></span>
				<h3>Report early</h3>
				<p>If you see something, say something. Small details help police respond sooner.</p>
			</div>
			<div class="pillar">
				<span class="dot support"></span>
				<h3>Look after people</h3>
				<p>Check on yourself and others. Support lines are available 24/7.</p>
			</div>
		</div>
	</section>

	<section class="cards" aria-label="Safety topics">
		<article class="card">
			<div class="badge">1</div>
			<h3>What to do in an attack</h3>
			<p>Follow the Run, Hide, Tell guidance step by step.</p>
			<a href="/safety/during-attack" class="link">Open steps</a>
		</article>
		<article class="card">
			<div class="badge">2</div>
			<h3>Report suspicious activity</h3>
			<p>Know what to look for and how to contact the National Security Hotline.</p>
			<a href="/safety/report" class="link">Report guidance</a>
		</article>
		<article class="card">
			<div class="badge">3</div>
			<h3>Understanding threat levels</h3>
			<p>Plain-language explainer of all five levels and what they mean for you.</p>
			<a href="/safety/threat-levels" class="link">See threat levels</a>
		</article>
		<article class="card">
			<div class="badge">4</div>
			<h3>Support resources</h3>
			<p>Contacts and practical tips for mental health and community support.</p>
			<a href="/safety/support" class="link">Find support</a>
		</article>
	</section>

	<section class="note">
		<h3>If unsure, call 000</h3>
		<p>
			For non-urgent national security information, contact the National Security Hotline on
			<strong>1800 123 400</strong>. For immediate danger, always call <strong>000</strong>.
		</p>
	</section>
</main>

<style>
	.page {
		display: grid;
		gap: 20px;
	}

	.intro h2 {
		margin: 0 0 6px;
		font-size: clamp(1.6rem, 2.4vw, 1.9rem);
	}

	.lede {
		color: #cfd9e9;
		line-height: 1.6;
		max-width: 760px;
		margin: 0;
	}

	.pillars {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 12px;
		margin-top: 16px;
	}

	.pillar {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-radius: 12px;
		padding: 12px;
		display: grid;
		gap: 6px;
	}

	.pillar h3 {
		margin: 0;
	}

	.pillar p {
		margin: 0;
		color: #d2deed;
		line-height: 1.4;
	}

	.dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		display: inline-block;
	}

	.run {
		background: linear-gradient(120deg, #4dd4ff, #1ca7ff);
	}

	.report {
		background: linear-gradient(120deg, #ffd166, #ff8c42);
	}

	.support {
		background: linear-gradient(120deg, #9cffac, #54d270);
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 12px;
	}

	.card {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 14px;
		padding: 14px;
		display: grid;
		gap: 8px;
	}

	.badge {
		width: 34px;
		height: 34px;
		border-radius: 10px;
		background: linear-gradient(140deg, #1f7ae0, #11c9e4);
		display: grid;
		place-items: center;
		font-weight: 700;
		color: #061019;
	}

	.card h3 {
		margin: 0;
	}

	.card p {
		margin: 0;
		color: #d5e2f2;
		line-height: 1.5;
	}

	.link {
		color: #9bc7ff;
		text-decoration: none;
		font-weight: 600;
	}

	.link:hover {
		color: #cfe3ff;
	}

	.note {
		background: rgba(17, 201, 228, 0.08);
		border: 1px solid rgba(17, 201, 228, 0.3);
		border-radius: 14px;
		padding: 12px;
		color: #e6f7ff;
		line-height: 1.5;
	}

	.note h3 {
		margin: 0 0 4px;
	}

	@media (max-width: 560px) {
		.cards {
			grid-template-columns: 1fr;
		}
	}
</style>
