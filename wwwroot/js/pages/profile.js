const ProfilePage = {
  async render() {
    if (!requireAuth()) return;
    const user = Auth.getUser();
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="page">
        <h1 class="page-title">أهلاً، ${escapeHtml(user.fullName)} 👋</h1>
        <p class="page-sub">${escapeHtml(user.email)} · ${user.role === 'Admin' ? 'مشرف المنصة' : 'مطوّر'}</p>
        <div id="stats"></div>
        <h2 class="section-title">مشاريعي</h2>
        <div id="my-projects"><div class="loading">جاري التحميل...</div></div>
      </div>
    `;

    try {
      const projects = await Api.getMyProjects();
      const totalStars = projects.reduce((sum, p) => sum + p.starCount, 0);
      document.getElementById('stats').innerHTML = `
        <div class="stat-row">
          <div class="stat-box"><div class="num">${projects.length}</div><div class="label">مشروع منشور</div></div>
          <div class="stat-box"><div class="num">${totalStars}</div><div class="label">إجمالي النجوم ⭐</div></div>
        </div>
      `;

      const list = document.getElementById('my-projects');
      if (!projects.length) {
        list.innerHTML = `<div class="empty-state"><div class="icon">📦</div><p>لم تضف أي مشروع بعد</p><a href="#/submit" class="btn btn-primary" style="margin-top:12px;">أضف أول مشروع</a></div>`;
        return;
      }
      list.innerHTML = `<div class="project-grid">${projects.map(p => HomePage.cardHtml(p)).join('')}</div>`;
      list.querySelectorAll('.card[data-id]').forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('.star-btn')) return;
          Router.navigate('/projects/' + card.dataset.id);
        });
      });
    } catch (err) {
      document.getElementById('my-projects').innerHTML = `<div class="alert alert-danger">${escapeHtml(err.message)}</div>`;
    }
  },
};
