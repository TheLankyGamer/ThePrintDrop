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

	// --- Lightbox / gallery support for Previous Events panel ---

	const gallery = document.querySelector('.events-gallery');
	if (gallery){
		const items = Array.from(gallery.querySelectorAll('.gallery-item'));
		const lightbox = document.getElementById('lightbox');
		const lbImg = lightbox && lightbox.querySelector('.lightbox-content img');
		const lbClose = lightbox && lightbox.querySelector('.lightbox-close');
		const lbNext = lightbox && lightbox.querySelector('.lightbox-next');
		const lbPrev = lightbox && lightbox.querySelector('.lightbox-prev');
		let currentGroup = null; // array of image URLs for the current event group
		let currentImageIndex = -1;

		function parseImagesFromButton(btn){
			const raw = btn.getAttribute('data-images') || '';
			if (!raw) return [];
			return raw.split(',').map(s => s.trim()).filter(Boolean);
		}

		function openLightbox(groupIndex){
			const btn = items[groupIndex];
			const imgThumb = btn && btn.querySelector('img');
			if (!btn || !imgThumb || !lightbox) return;
			currentGroup = parseImagesFromButton(btn);
			// if no data-images provided, fall back to thumb src
			if (!currentGroup.length) currentGroup = [imgThumb.src];
			currentImageIndex = 0;
			lbImg.src = currentGroup[currentImageIndex];
			lbImg.alt = imgThumb.alt || '';
			lightbox.setAttribute('aria-hidden', 'false');
			// focus for keyboard controls
			lbClose && lbClose.focus();
		}

		function closeLightbox(){
			if (!lightbox) return;
			lightbox.setAttribute('aria-hidden', 'true');
			lbImg.src = '';
			currentGroup = null;
			currentImageIndex = -1;
		}

		function showNext(){
			if (!currentGroup || currentGroup.length === 0) return;
			currentImageIndex = (currentImageIndex + 1) % currentGroup.length;
			lbImg.src = currentGroup[currentImageIndex];
		}
		function showPrev(){
			if (!currentGroup || currentGroup.length === 0) return;
			currentImageIndex = (currentImageIndex - 1 + currentGroup.length) % currentGroup.length;
			lbImg.src = currentGroup[currentImageIndex];
		}

		items.forEach((btn, i) => {
			btn.addEventListener('click', () => openLightbox(i));
		});

		if (lbClose) lbClose.addEventListener('click', closeLightbox);
		if (lbNext) lbNext.addEventListener('click', showNext);
		if (lbPrev) lbPrev.addEventListener('click', showPrev);

		document.addEventListener('keydown', (e) => {
			if (lightbox && lightbox.getAttribute('aria-hidden') === 'false'){
				if (e.key === 'Escape') closeLightbox();
				if (e.key === 'ArrowRight') showNext();
				if (e.key === 'ArrowLeft') showPrev();
			}
		});
	}
});
