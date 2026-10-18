const SubmitPage = {
  render() {
    if (!requireAuth()) return;
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="page">
        <h1 class="page-title">أضف مشروعك 🚀</h1>
        <p class="page-sub">شارك مشروعك المفتوح المصدر مع مجتمع المطورين في مصادر.</p>
        <div class="form-card">
          <div class="form-group">
            <label>اسم المشروع</label>
            <input id="f-title" class="input" placeholder="مثال: Zad - إدارة المهام" maxlength="150" />
          </div>
          <div class="form-group">
            <label>الوصف</label>
            <textarea id="f-desc" placeholder="وصّف المشروع، وش يسوي، وليه الناس تستخدمه؟" maxlength="2000"></textarea>
          </div>
          <div class="form-group">
            <label>رابط المستودع (GitHub مثلاً)</label>
            <input id="f-repo" class="input" placeholder="https://github.com/username/project" />
          </div>
          <div class="form-group">
            <label>اللغة الأساسية</label>
            <select id="f-lang" class="input">
              ${LANGUAGES.map(l => `<option value="${l}">${l}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>الترخيص (License)</label>
            <select id="f-license" class="input">
              ${LICENSES.map(l => `<option value="${l}">${l}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>الوسوم (Tags)</label>
            <input id="f-tags" class="input" placeholder="web, api, cli (مفصولة بفواصل)" />
            <div class="form-hint">اكتب وسوم مفصولة بفواصل عشان يسهل على الناس يلقون مشروعك بالبحث</div>
          </div>
          <div class="form-error" id="f-error"></div>
          <button id="f-submit" class="btn btn-primary btn-block">نشر المشروع</button>
        </div>
      </div>
    `;

    document.getElementById('f-submit').addEventListener('click', async () => {
      const dto = {
        title: document.getElementById('f-title').value.trim(),
        description: document.getElementById('f-desc').value.trim(),
        repoUrl: document.getElementById('f-repo').value.trim(),
        language: document.getElementById('f-lang').value,
        license: document.getElementById('f-license').value,
        tags: document.getElementById('f-tags').value.trim(),
      };
      const errEl = document.getElementById('f-error');
      errEl.textContent = '';

      if (!dto.title || !dto.description || !dto.repoUrl) {
        errEl.textContent = 'عبّي الحقول المطلوبة: الاسم، الوصف، رابط المستودع';
        return;
      }

      try {
        const project = await Api.createProject(dto);
        showToast('تم نشر مشروعك بنجاح', 'success');
        Router.navigate('/projects/' + project.id);
      } catch (err) {
        errEl.textContent = err.message;
      }
    });
  },
};
