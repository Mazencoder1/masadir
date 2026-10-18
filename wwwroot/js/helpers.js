// Shared small helpers used across pages
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
}

function showToast(message, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.className = 'toast show ' + type;
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    el.classList.remove('show');
  }, 3000);
}

const LANGUAGES = ['C#', 'JavaScript', 'Python', 'PHP', 'Java', 'Go', 'Rust', 'TypeScript', 'HTML/CSS', 'C++'];
const LICENSES = ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'ISC', 'MPL-2.0'];

function requireAuth() {
  if (!Auth.isLoggedIn()) {
    showToast('لازم تسجل دخول أول', 'error');
    Router.navigate('/login');
    return false;
  }
  return true;
}
