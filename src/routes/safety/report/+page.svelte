<svelte:head>
	<title>Report Suspicious Activity | Terror Watch Australia</title>
	<meta
		name="description"
		content="How to report suspicious behaviour to the National Security Hotline: what to look for and what to share."
	/>
</svelte:head>

<main class="page">
	<section class="hero">
		<p class="eyebrow">If you see something, say something</p>
		<h2>Report suspicious activity</h2>
		<p class="lede">
			Contact the National Security Hotline on <strong>1800 123 400</strong>. If life is in danger, call
			<strong>000</strong> immediately.
		</p>
	</section>

	<section class="panel highlight">
		<div>
			<p class="label">Call now</p>
			<h3>National Security Hotline</h3>
			<p class="number">1800 123 400</p>
			<p class="small">Anonymous reports are accepted.</p>
		</div>
		<div class="actions">
			<a class="btn" href="tel:1800123400">Call hotline</a>
			<a class="link" href="mailto:nationalsecurity@homeaffairs.gov.au">Email a report</a>
		</div>
	</section>

	<section class="grid">
		<article class="panel">
			<p class="label">What is suspicious?</p>
			<ul>
				<li>Attempts to obtain details about critical sites, crowded places, or security layouts.</li>
				<li>Unattended bags in crowded or sensitive locations.</li>
				<li>Surveillance-like behaviour such as repeated photographing of access points.</li>
				<li>Statements supporting violence or threats against people or places.</li>
				<li>Unusual purchases of chemicals, weapons, or protective gear without a clear reason.</li>
			</ul>
		</article>

		<article class="panel">
			<p class="label">What to provide</p>
			<ul>
				<li>Exact location (address, landmark, nearby streets).</li>
				<li>Time and date of what you observed.</li>
				<li>Descriptions of people involved: clothing, height, distinguishing features.</li>
				<li>Vehicle details: make, model, colour, number plate, direction of travel.</li>
				<li>Photos or videos only if safely obtained—do not put yourself at risk.</li>
			</ul>
		</article>
	</section>

	<section class="panel secondary">
		<h3>Reporting anonymously</h3>
		<ul>
			<li>You can provide information without giving your name or contact details.</li>
			<li>Share as much detail as you can; every piece helps police assess threats.</li>
			<li>If you later learn more, you can call again and reference the time you first reported.</li>
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
		color: #ffd166;
		margin: 0;
		font-size: 0.82rem;
	}

	.lede {
		color: #cfd9e9;
		line-height: 1.6;
		max-width: 780px;
		margin: 0;
	}

	.panel {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 14px;
		padding: 14px;
		display: grid;
		gap: 8px;
	}

	.panel.secondary {
		border-style: dashed;
	}

	.highlight {
		border: 1px solid rgba(255, 209, 102, 0.4);
		background: linear-gradient(135deg, rgba(255, 209, 102, 0.08), rgba(255, 156, 77, 0.08));
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 12px;
	}

	.label {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #9bc7ff;
		font-weight: 700;
		font-size: 0.85rem;
	}

	.number {
		font-size: 1.6rem;
		margin: 0;
		color: #fff4d4;
		font-weight: 700;
	}

	.small {
		margin: 0;
		color: #eddcc1;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 12px;
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

	.actions {
		display: grid;
		gap: 8px;
		justify-items: end;
	}

	.btn {
		background: linear-gradient(120deg, #1f7ae0, #11c9e4);
		border-radius: 12px;
		color: #061019;
		padding: 12px 16px;
		font-weight: 700;
		text-decoration: none;
		box-shadow: 0 10px 30px rgba(17, 201, 228, 0.3);
	}

	.link {
		color: #ffd166;
		text-decoration: none;
		font-weight: 600;
	}

	.link:hover {
		color: #ffe4a3;
	}

	@media (max-width: 640px) {
		.highlight {
			grid-template-columns: 1fr;
		}

		.actions {
			justify-items: start;
		}
	}
</style>
