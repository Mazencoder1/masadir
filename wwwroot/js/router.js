// Tiny hash-based client-side router
const Router = {
  routes: [],
  appEl: null,

  init(appEl) {
    this.appEl = appEl;
    window.addEventListener('hashchange', () => this.resolve());
  },

  add(pattern, handler) {
    // pattern like '/projects/:id'
    const paramNames = [];
    const regexStr = pattern.replace(/:[^\/]+/g, (m) => {
      paramNames.push(m.slice(1));
      return '([^/]+)';
    });
    const regex = new RegExp('^' + regexStr + '$');
    this.routes.push({ regex, paramNames, handler });
  },

  navigate(hashPath) {
    window.location.hash = hashPath;
  },

  resolve() {
    let hash = window.location.hash || '#/';
    let path = hash.replace(/^#/, '');
    if (!path.startsWith('/')) path = '/' + path;
    const [pathname, queryString] = path.split('?');
    const query = {};
    if (queryString) {
      new URLSearchParams(queryString).forEach((v, k) => { query[k] = v; });
    }

    for (const route of this.routes) {
      const match = route.regex.exec(pathname);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, i) => { params[name] = match[i + 1]; });
        this.appEl.innerHTML = '';
        route.handler(params, query);
        this.updateActiveNav(pathname);
        return;
      }
    }

    this.appEl.innerHTML = '<div class="empty-state"><div class="icon">🧭</div><p>الصفحة غير موجودة</p></div>';
  },

  updateActiveNav(pathname) {
    document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
    const map = { '/': 'nav-home', '/profile': 'nav-profile', '/admin': 'nav-admin', '/submit': 'nav-submit' };
  },
};
