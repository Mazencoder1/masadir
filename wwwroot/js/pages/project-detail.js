const ProjectDetailPage = {
  async render(params) {
    const id = params.id;
    const app = document.getElementById('app');
    app.innerHTML = '<div class="loading">جاري التحميل...</div>';

    let project, comments;
    try {
      [project, comments] = await Promise.all([Api.getProject(id), Api.getComments(id)]);
    } catch (err) {
      app.innerHTML = `<div class="page"><div class="alert alert-danger">${escapeHtml(err.message)}</div></div>`;
      return;
    }

    const me = Auth.getUser();
    const isOwner = me && me.id === project.ownerId;
    const isAdmin = Auth.isAdmin();

    app.innerHTML = `
      <div class="page">
        <div class="detail-head">
          <div>
            <h1 class="detail-title">${escapeHtml(project.title)}</h1>
            <div class="detail-meta-row">
              <span class="badge lang">${escapeHtml(project.language)}</span>
              <span class="badge license">${escapeHtml(project.license)}</span>
              ${(project.tags || '').split(',').filter(t => t.trim()).map(t => `<span class="badge">#${escapeHtml(t.trim())}</span>`).join('')}
            </div>
          </div>
          <div class="detail-actions">
            <a href="${escapeHtml(project.repoUrl)}" target="_blank" rel="noopener" class="btn btn-ghost">↗ زيارة المستودع</a>
            <button id="star-btn" class="star-btn ${project.isStarredByMe ? 'starred' : ''}">⭐ <span class="count">${project.starCount}</span></button>
            ${(isOwner || isAdmin) ? '<button id="delete-btn" class="btn btn-danger">حذف المشروع</button>' : ''}
          </div>
        </div>
        <p class="detail-desc">${escapeHtml(project.description)}</p>
        <div style="color:var(--text-faint); font-size:13px;">أضافه ${escapeHtml(project.ownerName)} بتاريخ ${formatDate(project.createdAt)}</div>

        <h2 class="section-title">التعليقات (${comments.length})</h2>
        <div id="comment-form-wrap"></div>
        <div id="comments-list">${comments.length ? comments.map(c => this.commentHtml(c)).join('') : '<div class="empty-state"><div class="icon">💬</div><p>لا توجد تعليقات بعد، كن أول من يعلّق</p></div>'}</div>
      </div>
    `;

    this.renderCommentForm(id);

    document.getElementById('star-btn').addEventListener('click', async () => {
      if (!requireAuth()) return;
      try {
        const res = await Api.toggleStar(id);
        const btn = document.getElementById('star-btn');
        btn.classList.toggle('starred', res.starred);
        btn.querySelector('.count').textContent = res.starCount;
      } catch (err) {
        showToast(err.message, 'error');
      }
    });

    const delBtn = document.getElementById('delete-btn');
    if (delBtn) {
      delBtn.addEventListener('click', async () => {
        if (!confirm('متأكد تبي تحذف هذا المشروع؟')) return;
        try {
          if (isAdmin && !isOwner) {
            await Api.adminRemoveProject(id);
          } else {
            await Api.deleteProject(id);
          }
          showToast('تم حذف المشروع', 'success');
          Router.navigate('/');
        } catch (err) {
          showToast(err.message, 'error');
        }
      });
    }
  },

  renderCommentForm(projectId) {
    const wrap = document.getElementById('comment-form-wrap');
    if (!Auth.isLoggedIn()) {
      wrap.innerHTML = `<div class="alert alert-info">سجل دخولك عشان تقدر تضيف تعليق على هذا المشروع.</div>`;
      return;
    }
    wrap.innerHTML = `
      <div class="form-group" style="margin-bottom: 24px;">
        <textarea id="comment-body" class="input" placeholder="شاركنا رأيك عن هذا المشروع..." rows="3"></textarea>
        <div class="form-error" id="comment-error"></div>
        <button id="comment-submit" class="btn btn-primary" style="margin-top:8px;">إرسال التعليق</button>
      </div>
    `;
    document.getElementById('comment-submit').addEventListener('click', async () => {
      const body = document.getElementById('comment-body').value.trim();
      const errEl = document.getElementById('comment-error');
      errEl.textContent = '';
      if (!body) { errEl.textContent = 'اكتب تعليق أول'; return; }
      try {
        const comment = await Api.postComment(projectId, { body });
        const list = document.getElementById('comments-list');
        if (list.querySelector('.empty-state')) list.innerHTML = '';
        list.insertAdjacentHTML('afterbegin', this.commentHtml(comment));
        document.getElementById('comment-body').value = '';
        showToast('تم إضافة تعليقك', 'success');
      } catch (err) {
        errEl.textContent = err.message;
      }
    });
  },

  commentHtml(c) {
    return `
      <div class="comment">
        <div class="comment-head">
          <span class="comment-author">${escapeHtml(c.userName)}</span>
          <span class="comment-date">${formatDate(c.createdAt)}</span>
        </div>
        <div class="comment-body">${escapeHtml(c.body)}</div>
      </div>
    `;
  },
};
