// Thin fetch wrapper for the Masadir REST API
const Api = {
  base: '/api',

  async request(path, { method = 'GET', body, auth = true } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    const token = Auth.getToken();
    if (auth && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(this.base + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (res.status === 204) return null;

    let data = null;
    try { data = await res.json(); } catch (e) { /* empty body */ }

    if (!res.ok) {
      const message = (data && data.message) || (data && data.title) || 'حدث خطأ غير متوقع';
      const err = new Error(message);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  },

  get(path) { return this.request(path, { method: 'GET' }); },
  post(path, body) { return this.request(path, { method: 'POST', body }); },
  put(path, body) { return this.request(path, { method: 'PUT', body }); },
  del(path) { return this.request(path, { method: 'DELETE' }); },

  // Auth
  register(dto) { return this.request('/auth/register', { method: 'POST', body: dto, auth: false }); },
  login(dto) { return this.request('/auth/login', { method: 'POST', body: dto, auth: false }); },

  // Projects
  getProjects(params) {
    const qs = new URLSearchParams();
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.set(k, v);
    });
    return this.get(`/projects?${qs.toString()}`);
  },
  getProject(id) { return this.get(`/projects/${id}`); },
  getMyProjects() { return this.get('/projects/mine'); },
  createProject(dto) { return this.post('/projects', dto); },
  updateProject(id, dto) { return this.put(`/projects/${id}`, dto); },
  deleteProject(id) { return this.del(`/projects/${id}`); },
  toggleStar(id) { return this.post(`/projects/${id}/star`); },
  getComments(id) { return this.get(`/projects/${id}/comments`); },
  postComment(id, dto) { return this.post(`/projects/${id}/comments`, dto); },

  // Admin
  adminGetProjects() { return this.get('/admin/projects'); },
  adminRemoveProject(id) { return this.del(`/admin/projects/${id}`); },
  adminRestoreProject(id) { return this.post(`/admin/projects/${id}/restore`); },
  adminGetComments() { return this.get('/admin/comments'); },
  adminRemoveComment(id) { return this.del(`/admin/comments/${id}`); },
};
