const AdminPage = {
  tab: 'projects',

  async render() {
    if (!requireAuth()) return;
    if (!Auth.isAdmin()) {
      document.getElementById('app').innerHTML = `<div class="page"><div class="alert alert-danger">هذه الصفحة للمشرفين فقط</div></div>`;
      return;
    }

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="page">
        <h1 class="page-title">لوحة الإدارة 🛠️</h1>
        <p class="page-sub">راقب المشاريع والتعليقات وأزل أي محتوى غير مناسب</p>
        <div class="tabs">
          <button class="tab-btn ${this.tab === 'projects' ? 'active' : ''}" data-tab="projects">المشاريع</button>
          <button class="tab-btn ${this.tab === 'comments' ? 'active' : ''}" data-tab="comments">التعليقات</button>
        </div>
        <div id="admin-content"><div class="loading">جاري التحميل...</div></div>
      </div>
    `;

    app.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.tab = btn.dataset.tab;
        this.render();
      });
    });

    if (this.tab === 'projects') await this.loadProjects();
    else await this.loadComments();
  },

  async loadProjects() {
    const content = document.getElementById('admin-content');
    try {
      const projects = await Api.adminGetProjects();
      content.innerHTML = `
        <table class="admin-table">
          <thead><tr><th>العنوان</th><th>المالك</th><th>نجوم</th><th>تعليقات</th><th>الحالة</th><th></th></tr></thead>
          <tbody>
            ${projects.map(p => `
              <tr>
                <td>${escapeHtml(p.title)}</td>
                <td>${escapeHtml(p.ownerName)}</td>
                <td>${p.starCount}</td>
                <td>${p.commentCount}</td>
                <td>${p.isRemoved ? '<span class="removed-tag">محذوف</span>' : 'منشور'}</td>
                <td>
                  ${p.isRemoved
                    ? `<button class="btn btn-ghost btn-sm" data-restore="${p.id}">استرجاع</button>`
                    : `<button class="btn btn-danger btn-sm" data-remove="${p.id}">إزالة</button>`}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      content.querySelectorAll('[data-remove]').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('متأكد تبي تزيل هذا المشروع؟')) return;
          await Api.adminRemoveProject(btn.dataset.remove);
          showToast('تمت إزالة المشروع', 'success');
          this.loadProjects();
        });
      });
      content.querySelectorAll('[data-restore]').forEach(btn => {
        btn.addEventListener('click', async () => {
          await Api.adminRestoreProject(btn.dataset.restore);
          showToast('تم استرجاع المشروع', 'success');
          this.loadProjects();
        });
      });
    } catch (err) {
      content.innerHTML = `<div class="alert alert-danger">${escapeHtml(err.message)}</div>`;
    }
  },

  async loadComments() {
    const content = document.getElementById('admin-content');
    try {
      const comments = await Api.adminGetComments();
      content.innerHTML = `
        <table class="admin-table">
          <thead><tr><th>التعليق</th><th>الكاتب</th><th>المشروع</th><th>الحالة</th><th></th></tr></thead>
          <tbody>
            ${comments.map(c => `
              <tr>
                <td>${escapeHtml(c.body)}</td>
                <td>${escapeHtml(c.userName)}</td>
                <td>${escapeHtml(c.projectTitle)}</td>
                <td>${c.isRemoved ? '<span class="removed-tag">محذوف</span>' : 'منشور'}</td>
                <td>${!c.isRemoved ? `<button class="btn btn-danger btn-sm" data-remove="${c.id}">إزالة</button>` : ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      content.querySelectorAll('[data-remove]').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('متأكد تبي تزيل هذا التعليق؟')) return;
          await Api.adminRemoveComment(btn.dataset.remove);
          showToast('تمت إزالة التعليق', 'success');
          this.loadComments();
        });
      });
    } catch (err) {
      content.innerHTML = `<div class="alert alert-danger">${escapeHtml(err.message)}</div>`;
    }
  },
};
