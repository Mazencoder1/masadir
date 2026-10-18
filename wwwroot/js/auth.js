// Local auth state stored in localStorage
const Auth = {
  TOKEN_KEY: 'masadir_token',
  USER_KEY: 'masadir_user',

  getToken() { return localStorage.getItem(this.TOKEN_KEY); },

  getUser() {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  isLoggedIn() { return !!this.getToken(); },

  isAdmin() {
    const u = this.getUser();
    return !!u && u.role === 'Admin';
  },

  setSession(authResponse) {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify({
      id: authResponse.userId,
      fullName: authResponse.fullName,
      email: authResponse.email,
      role: authResponse.role,
    }));
  },

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  },
};
