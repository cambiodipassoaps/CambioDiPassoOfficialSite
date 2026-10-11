(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  const renderContent = async () => {
    try {
      const response = await fetch('data/content.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      $('#project-grid').innerHTML = data.projects
        .map((item, index) => {
          return `<article class="content-card">
            <div class="project-icon" aria-hidden="true">${escapeHtml(item.icon)}</div>
            <span>0${index + 1}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
            <a class ="content-footer arrow-link" href="#contatti">Approfondisci</a>
        </article>`
        })
        .join('');
      $('#news-grid').innerHTML = data.news
        .map((item, index) => {
          return `<article class="content-card">
            <div class="news-art" aria-hidden="true">
              <span>${escapeHtml(item.category)}</span></div>
            <div class="news-meta">
              <span>${new Intl.DateTimeFormat('it-IT',{day:'2-digit',month:'long',year:'numeric'}).format(new Date(`${item.date}T12:00:00`))}</span>
              <span>${escapeHtml(item.category)}</span>
            </div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.summary)}</p>
            <a class ="content-footer arrow-link" href="#contatti">Leggi la notizia</a>
          </article>`
         })
        .join('');
      $('#document-list').innerHTML = data.documents
        .map((item, index) => {
          return `<a href="${escapeHtml(item.url)}">
            <span><b>0${index + 1}</b> ${escapeHtml(item.title)}</span>
            <em>${escapeHtml(item.type)} ↓</em>
          </a>`
        })
        .join('');
    } catch (error) {
      ['#project-grid','#news-grid','#document-list'].forEach(selector => { const node = $(selector); if (node) node.innerHTML = '<p class="loading-error">Contenuti non disponibili. Avvia il sito tramite un server HTTP locale.</p>'; });
      console.error('Impossibile caricare content.json', error);
    }
  };

  const readStore = key => JSON.parse(localStorage.getItem(`cambio-di-passo:${key}`) || '[]');
  const writeStore = (key, value) => localStorage.setItem(`cambio-di-passo:${key}`, JSON.stringify(value));
  const saveForm = (form, key) => {
    const record = Object.fromEntries(new FormData(form));
    record.id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    record.createdAt = new Date().toISOString();
    const records = readStore(key); records.push(record); writeStore(key, records);
    $('.form-status', form).textContent = 'Dati salvati sul dispositivo. Puoi esportarli in formato JSON.';
    form.reset();
  };

  $('#contact-form')?.addEventListener('submit', event => { event.preventDefault(); if (event.currentTarget.reportValidity()) saveForm(event.currentTarget, 'contacts'); });
  $('#donation-form')?.addEventListener('submit', event => { event.preventDefault(); if (event.currentTarget.reportValidity()) saveForm(event.currentTarget, 'donations'); });
  $$('[data-export]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.export; const blob = new Blob([JSON.stringify(readStore(key), null, 2)], {type:'application/json'}); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${key}.json`; link.click(); URL.revokeObjectURL(link.href);
  }));

  const menu = $('#main-nav'), menuButton = $('.menu-toggle');
  menuButton?.addEventListener('click', () => { const open = menu.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); });
  $$('a', menu).forEach(link => link.addEventListener('click', () => { menu.classList.remove('open'); menuButton?.setAttribute('aria-expanded','false'); }));

  const accessDialog = $('[data-access-dialog]'), accessKeys = ['font','contrast','links','motion'];
  const applyAccess = () => accessKeys.forEach(key => document.documentElement.classList.toggle(`access-${key}`, localStorage.getItem(`access-${key}`) === '1'));
  applyAccess();
  $('[data-access-open]')?.addEventListener('click', () => accessDialog.showModal());
  $('[data-access-close]')?.addEventListener('click', () => accessDialog.close());
  $$('[data-access]').forEach(button => button.addEventListener('click', () => { const key = button.dataset.access; if (key === 'reset') accessKeys.forEach(item => localStorage.removeItem(`access-${item}`)); else localStorage.setItem(`access-${key}`, localStorage.getItem(`access-${key}`) === '1' ? '0' : '1'); applyAccess(); }));

  const donationDialog = $('[data-donation-dialog]');
  $('[data-donation-open]')?.addEventListener('click', () => donationDialog.showModal());
  $('[data-donation-close]')?.addEventListener('click', () => donationDialog.close());
  renderContent();
})();
