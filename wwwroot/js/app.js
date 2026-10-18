const App = {
  init() {
    Router.init(document.getElementById('app'));

    Router.add('/', HomePage.render.bind(HomePage));
    Router.add('/projects/:id', ProjectDetailPage.render.bind(ProjectDetailPage));
    Router.add('/submit', SubmitPage.render.bind(SubmitPage));
    Router.add('/login', LoginPage.render.bind(LoginPage));
    Router.add('/register', RegisterPage.render.bind(RegisterPage));
    Router.add('/profile', ProfilePage.render.bind(ProfilePage));
    Router.add('/admin', AdminPage.render.bind(AdminPage));

    this.refreshAuthUI();
    Router.resolve();

    document.getElementById('app').addEventListener('click', () => {}); // noop, placeholder for future delegation
  },

  refreshAuthUI() {
    const area = document.getElementById('auth-area');
    const adminLink = document.getElementById('nav-admin');
    const user = Auth.getUser();

    if (user) {
      area.innerHTML = `
        <div class="user-chip">
          <span class="avatar">${escapeHtml(user.fullName.charAt(0))}</span>
          <span>${escapeHtml(user.fullName)}</span>
        </div>
        <button id="logout-btn" class="btn btn-ghost btn-sm">خروج</button>
      `;
      document.getElementById('logout-btn').addEventListener('click', () => {
        Auth.logout();
        App.refreshAuthUI();
        showToast('تم تسجيل الخروج', 'success');
        Router.navigate('/');
      });
      adminLink.style.display = user.role === 'Admin' ? 'inline' : 'none';
    } else {
      area.innerHTML = `
        <a href="#/login" class="btn btn-ghost">دخول</a>
        <a href="#/register" class="btn btn-primary">تسجيل حساب</a>
      `;
      adminLink.style.display = 'none';
    }
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
