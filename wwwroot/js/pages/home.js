const HomePage = {
  state: { q: '', language: '', sort: '', page: 1, pageSize: 9 },

  async render(params, query) {
    this.state.q = query.q || '';
    this.state.language = query.language || '';
    this.state.sort = query.sort || '';
    this.state.page = parseInt(query.page || '1', 10);

    const app = document.getElementById('app');
    app.innerHTML = `
      <section class="hero">
        <h1>اكتشف مشاريع مفتوحة المصدر 🚀</h1>
        <p>مصادر منصة سعودية ترفع فيها مشروعك، تتابع مشاريع غيرك، وتدعم أفضلها بالنجوم والتعليقات.</p>
      </section>
      <div class="toolbar">
        <input id="search-input" class="input search-input" placeholder="ابحث باسم المشروع أو وصفه..." value="${escapeHtml(this.state.q)}" />
        <select id="language-filter" class="input">
          <option value="">كل اللغات</option>
          ${LANGUAGES.map(l => `<option value="${l}" ${this.state.language === l ? 'selected' : ''}>${l}</option>`).join('')}
        </select>
        <select id="sort-filter" class="input">
          <option value="" ${this.state.sort === '' ? 'selected' : ''}>الأحدث</option>
          <option value="stars" ${this.state.sort === 'stars' ? 'selected' : ''}>الأكثر تميزاً ⭐</option>
        </select>
      </div>
      <div id="results"></div>
    `;

    document.getElementById('search-input').addEventListener('input', debounce(() => {
      this.state.q = document.getElementById('search-input').value;
      this.state.page = 1;
      this.updateUrl();
    }, 350));
    document.getElementById('language-filter').addEventListener('change', (e) => {
      this.state.language = e.target.value;
      this.state.page = 1;
      this.updateUrl();
    });
    document.getElementById('sort-filter').addEventListener('change', (e) => {
      this.state.sort = e.target.value;
      this.state.page = 1;
      this.updateUrl();
    });

    await this.loadResults();
  },

  updateUrl() {
    const qs = new URLSearchParams();
    if (this.state.q) qs.set('q', this.state.q);
    if (this.state.language) qs.set('language', this.state.language);
    if (this.state.sort) qs.set('sort', this.state.sort);
    if (this.state.page > 1) qs.set('page', this.state.page);
    window.location.hash = '/?' + qs.toString();
  },

  async loadResults() {
    const results = document.getElementById('results');
    results.innerHTML = '<div class="loading">جاري التحميل...</div>';
    try {
      const data = await Api.getProjects({
        q: this.state.q,
        language: this.state.language,
        sort: this.state.sort,
        page: this.state.page,
        pageSize: this.state.pageSize,
      });
      this.renderResults(data);
    } catch (err) {
      results.innerHTML = `<div class="alert alert-danger">تعذر تحميل المشاريع: ${escapeHtml(err.message)}</div>`;
    }
  },

  renderResults(data) {
    const results = document.getElementById('results');
    if (!data.items.length) {
      results.innerHTML = '<div class="empty-state"><div class="icon">🔍</div><p>ما لقينا أي مشاريع تطابق البحث</p></div>';
      return;
    }

    results.innerHTML = `
      <div class="project-grid">${data.items.map(p => this.cardHtml(p)).join('')}</div>
      ${this.paginationHtml(data)}
    `;

    results.querySelectorAll('.card[data-id]').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.star-btn')) return;
        Router.navigate('/projects/' + card.dataset.id);
      });
    });

    results.querySelectorAll('.star-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!requireAuth()) return;
        const id = btn.dataset.id;
        try {
          const res = await Api.toggleStar(id);
          btn.classList.toggle('starred', res.starred);
          btn.querySelector('.count').textContent = res.starCount;
        } catch (err) {
          showToast(err.message, 'error');
        }
      });
    });

    results.querySelectorAll('.page-btn[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.page = parseInt(btn.dataset.page, 10);
        this.updateUrl();
      });
    });
  },

  cardHtml(p) {
    return `
      <div class="card" data-id="${p.id}">
        <div class="card-top">
          <h3 class="card-title">${escapeHtml(p.title)}</h3>
        </div>
        <p class="card-desc">${escapeHtml(p.description)}</p>
        <div class="card-meta">
          <span class="badge lang">${escapeHtml(p.language)}</span>
          <span class="badge license">${escapeHtml(p.license)}</span>
        </div>
        <div class="card-footer">
          <span>بواسطة ${escapeHtml(p.ownerName)}</span>
          <button class="star-btn ${p.isStarredByMe ? 'starred' : ''}" data-id="${p.id}">
            ⭐ <span class="count">${p.starCount}</span>
          </button>
        </div>
      </div>
    `;
  },

  paginationHtml(data) {
    if (data.totalPages <= 1) return '';
    let buttons = '';
    for (let i = 1; i <= data.totalPages; i++) {
      buttons += `<button class="page-btn ${i === data.page ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    return `<div class="pagination">${buttons}</div>`;
  },
};

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
