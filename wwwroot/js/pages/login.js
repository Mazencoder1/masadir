const LoginPage = {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="page" style="padding-top:60px;">
        <div class="form-card">
          <h1 class="page-title" style="text-align:center;">تسجيل الدخول</h1>
          <p class="page-sub" style="text-align:center;">رجّع لحسابك في مصادر</p>
          <div class="form-group">
            <label>البريد الإلكتروني</label>
            <input id="f-email" type="email" class="input" placeholder="you@example.com" />
          </div>
          <div class="form-group">
            <label>كلمة المرور</label>
            <input id="f-password" type="password" class="input" placeholder="••••••••" />
          </div>
          <div class="form-error" id="f-error"></div>
          <button id="f-submit" class="btn btn-primary btn-block">دخول</button>
          <div class="form-foot-link">ليس لديك حساب؟ <a href="#/register">سجل الآن</a></div>
          <div class="form-hint" style="text-align:center; margin-top:16px;">
            تجربة سريعة: admin@masadir.sa / Admin@12345
          </div>
        </div>
      </div>
    `;

    const submit = async () => {
      const email = document.getElementById('f-email').value.trim();
      const password = document.getElementById('f-password').value;
      const errEl = document.getElementById('f-error');
      errEl.textContent = '';
      if (!email || !password) { errEl.textContent = 'عبّي البريد وكلمة المرور'; return; }
      try {
        const res = await Api.login({ email, password });
        Auth.setSession(res);
        App.refreshAuthUI();
        showToast('تم تسجيل الدخول، أهلاً فيك', 'success');
        Router.navigate('/');
      } catch (err) {
        errEl.textContent = err.message;
      }
    };

    document.getElementById('f-submit').addEventListener('click', submit);
    document.getElementById('f-password').addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
  },
};
