const RegisterPage = {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="page" style="padding-top:60px;">
        <div class="form-card">
          <h1 class="page-title" style="text-align:center;">تسجيل حساب جديد</h1>
          <p class="page-sub" style="text-align:center;">انضم لمجتمع مصادر وشارك مشاريعك</p>
          <div class="form-group">
            <label>الاسم الكامل</label>
            <input id="f-name" class="input" placeholder="اسمك" />
          </div>
          <div class="form-group">
            <label>البريد الإلكتروني</label>
            <input id="f-email" type="email" class="input" placeholder="you@example.com" />
          </div>
          <div class="form-group">
            <label>كلمة المرور</label>
            <input id="f-password" type="password" class="input" placeholder="6 أحرف على الأقل" />
          </div>
          <div class="form-error" id="f-error"></div>
          <button id="f-submit" class="btn btn-primary btn-block">إنشاء الحساب</button>
          <div class="form-foot-link">عندك حساب؟ <a href="#/login">سجل دخولك</a></div>
        </div>
      </div>
    `;

    document.getElementById('f-submit').addEventListener('click', async () => {
      const fullName = document.getElementById('f-name').value.trim();
      const email = document.getElementById('f-email').value.trim();
      const password = document.getElementById('f-password').value;
      const errEl = document.getElementById('f-error');
      errEl.textContent = '';
      if (!fullName || !email || !password) { errEl.textContent = 'عبّي جميع الحقول'; return; }
      if (password.length < 6) { errEl.textContent = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'; return; }
      try {
        const res = await Api.register({ fullName, email, password });
        Auth.setSession(res);
        App.refreshAuthUI();
        showToast('تم إنشاء حسابك بنجاح', 'success');
        Router.navigate('/');
      } catch (err) {
        errEl.textContent = err.message;
      }
    });
  },
};
