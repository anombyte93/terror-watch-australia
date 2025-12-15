<script lang="ts">
	const contacts = [
		{
			label: 'Emergency',
			number: '000',
			details: 'Police, fire, ambulance'
		},
		{
			label: 'National Security Hotline',
			number: '1800 123 400',
			details: 'Report suspicious behaviour'
		}
	];
</script>

<div class="banner" role="note" aria-label="Emergency contacts">
	<div class="signal">
		<span class="pulse" aria-hidden="true"></span>
		<p class="eyebrow">If life is in danger</p>
	</div>
	<div class="contacts" aria-label="Important phone numbers">
		{#each contacts as contact}
			<a class="contact" href={`tel:${contact.number.replace(/\s+/g, '')}`}>
				<span class="label">{contact.label}</span>
				<span class="number">{contact.number}</span>
				<span class="details">{contact.details}</span>
			</a>
		{/each}
	</div>
</div>

<style>
	.banner {
		background: linear-gradient(120deg, #102b42, #0a2032);
		border: 1px solid rgba(149, 214, 255, 0.35);
		border-radius: 14px;
		padding: 14px 16px;
		display: flex;
		gap: 12px;
		align-items: center;
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
	}

	.signal {
		display: grid;
		gap: 4px;
		align-items: center;
	}

	.pulse {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #ff6257;
		box-shadow:
			0 0 0 0 rgba(255, 98, 87, 0.6),
			0 0 0 6px rgba(255, 98, 87, 0.12);
		animation: pulse 1.8s infinite;
	}

	.eyebrow {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #e9f3ff;
		font-size: 0.75rem;
		opacity: 0.85;
	}

	.contacts {
		display: grid;
		gap: 6px;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		width: 100%;
	}

	.contact {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2px;
		text-decoration: none;
		color: #f7fbff;
		padding: 8px 10px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	.contact:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.1);
	}

	.label {
		font-size: 0.8rem;
		color: #c8deff;
	}

	.number {
		font-size: 1.1rem;
		font-weight: 700;
		letter-spacing: 0.02em;
	}

	.details {
		font-size: 0.85rem;
		color: #c7d4e1;
	}

	@keyframes pulse {
		0% {
			box-shadow:
				0 0 0 0 rgba(255, 98, 87, 0.65),
				0 0 0 6px rgba(255, 98, 87, 0.12);
		}
		70% {
			box-shadow:
				0 0 0 8px rgba(255, 98, 87, 0),
				0 0 0 12px rgba(255, 98, 87, 0.1);
		}
		100% {
			box-shadow:
				0 0 0 0 rgba(255, 98, 87, 0),
				0 0 0 8px rgba(255, 98, 87, 0);
		}
	}

	@media (max-width: 640px) {
		.banner {
			flex-direction: column;
			align-items: stretch;
		}

		.signal {
			justify-items: start;
		}
	}
</style>
