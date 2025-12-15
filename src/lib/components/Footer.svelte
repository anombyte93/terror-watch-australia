<script lang="ts">
	import Container from './Container.svelte';
</script>

<footer class="site-footer" id="contacts">
	<Container width="wide">
		<div class="footer-grid">
			<div class="footer-brand">
				<div class="mark" aria-hidden="true"></div>
				<div>
					<p class="title">Terror Watch Australia</p>
					<p class="muted">
						Public-facing status, signals, and guidance to keep communities informed and prepared.
					</p>
				</div>
			</div>

			<div>
				<p class="label">Essential contacts</p>
				<ul>
					<li><strong>000</strong> — Emergency</li>
					<li><strong>131 444</strong> — Police Assistance</li>
					<li><strong>1800 123 400</strong> — National Security Hotline</li>
				</ul>
			</div>

			<div>
				<p class="label">Quick links</p>
				<ul>
					<li><a href="#threat">Current threat level</a></li>
					<li><a href="#guidance">Safety guidance</a></li>
					<li><a href="#news">Recent signals</a></li>
				</ul>
			</div>

			<div>
				<p class="label">Sources</p>
				<ul>
					<li>
						<a href="https://www.nationalsecurity.gov.au" target="_blank" rel="noreferrer"
							>NationalSecurity.gov.au</a
						>
					</li>
					<li>
						<a href="https://www.homeaffairs.gov.au" target="_blank" rel="noreferrer"
							>Department of Home Affairs</a
						>
					</li>
					<li>
						<a href="https://www.asio.gov.au/" target="_blank" rel="noreferrer">ASIO guidance</a>
					</li>
				</ul>
			</div>
		</div>

		<div class="footnote">
			<span>Stay informed. Stay calm. Act on facts.</span>
			<span class="muted">This site does not replace official emergency messaging.</span>
		</div>
	</Container>
</footer>

<style>
	.site-footer {
		border-top: 1px solid var(--border-subtle);
		background: var(--surface-muted);
		padding: clamp(1.5rem, 3vw, 2.5rem) 0;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1.5rem;
	}

	.footer-brand {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.mark {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: linear-gradient(145deg, var(--color-primary), var(--color-primary-light));
		box-shadow: var(--shadow-soft);
	}

	.title {
		margin: 0 0 0.4rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.label {
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 0.35rem;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.35rem;
	}

	.footnote {
		margin-top: 1.5rem;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.5rem;
		font-size: 0.95rem;
		color: var(--text-secondary);
	}
</style>
