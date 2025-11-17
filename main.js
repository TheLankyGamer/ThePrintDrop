document.addEventListener('DOMContentLoaded', () => {
	// Set current year in footer
	const yearEl = document.getElementById('year');
	if (yearEl) yearEl.textContent = new Date().getFullYear();

	const tabs = Array.from(document.querySelectorAll('.tab'));
	const panels = Array.from(document.querySelectorAll('.panel'));

	function activateTab(tab) {
		tabs.forEach(t => {
			const selected = t === tab;
			t.setAttribute('aria-selected', selected ? 'true' : 'false');
			t.tabIndex = selected ? 0 : -1;
		});

		panels.forEach(p => {
			const match = p.id === tab.getAttribute('aria-controls');
			p.hidden = !match;
			if (match) p.classList.add('active'); else p.classList.remove('active');
		});
		tab.focus();
	}

	tabs.forEach((tab, idx) => {
		tab.addEventListener('click', () => activateTab(tab));
		tab.addEventListener('keydown', (e) => {
			const key = e.key;
			let newIdx = null;
			if (key === 'ArrowRight') newIdx = (idx + 1) % tabs.length;
			if (key === 'ArrowLeft') newIdx = (idx - 1 + tabs.length) % tabs.length;
			if (key === 'Home') newIdx = 0;
			if (key === 'End') newIdx = tabs.length - 1;
			if (newIdx !== null) {
				e.preventDefault();
				activateTab(tabs[newIdx]);
			}
		});
	});

	// Ensure the initially selected tab is active
	const initial = document.querySelector('.tab[aria-selected="true"]') || tabs[0];
	if (initial) activateTab(initial);
});
