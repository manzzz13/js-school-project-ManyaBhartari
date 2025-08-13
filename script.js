(() => {
  const timeline = document.getElementById('timeline');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalYear = document.getElementById('modal-year');
  const modalCategory = document.getElementById('modal-category');
  const modalImg = document.getElementById('modal-image');
  const closeBtn = modal.querySelector('.close');
  const chips = Array.from(document.querySelectorAll('.chip'));

  let allEvents = [];
  let currentFilter = 'all';

  const fetchEvents = async () => {
    const res = await fetch('data/events.json');
    const data = await res.json();
    // Sort by year ascending (edit if you want newest first)
    return data.sort((a, b) => a.year - b.year);
  };

  const renderEvents = (events) => {
    timeline.innerHTML = '';
    events.forEach((ev, idx) => {
      const card = document.createElement('article');
      card.className = 'event';
      card.dataset.category = ev.category;
      card.tabIndex = 0;
      card.innerHTML = `
        <span class="dot" aria-hidden="true"></span>
        <div class="eyebrow">${ev.year} · ${ev.category}</div>
        <div class="h3">${ev.title}</div>
        <p class="desc">${ev.description}</p>
        <img class="thumb" src="${ev.imageURL}" alt="${ev.title}">
      `;
      // Click/Enter → open modal
      const open = () => openModal(ev);
      card.addEventListener('click', open);
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(); });
      timeline.appendChild(card);
      // Scroll reveal
      requestAnimationFrame(() => card.style.transform = 'translateY(0)');
    });
  };

  const openModal = (ev) => {
    modalTitle.textContent = ev.title;
    modalDesc.textContent = ev.description;
    modalYear.textContent = ev.year;
    modalCategory.textContent = ev.category;
    modalImg.src = ev.imageURL;
    modalImg.alt = ev.title;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Close handlers
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  // Filter chips
  chips.forEach(ch => ch.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    ch.classList.add('active');
    currentFilter = ch.dataset.filter;
    const list = currentFilter === 'all' ? allEvents : allEvents.filter(e => e.category === currentFilter);
    renderEvents(list);
  }));

  // Init
  fetchEvents().then(events => {
    allEvents = events;
    renderEvents(allEvents);
  }).catch(err => {
    timeline.innerHTML = `<p style="color:#b00020">Failed to load events.json: ${err}</p>`;
  });
})();
