// js/router.js
import { renderBlogPage } from './indexblog.js';

const routes = {
  '/': async () => {
    const res = await fetch('/partials/home.html');
    const html = await res.text();
    document.getElementById('spa-content').innerHTML = html;
  },
  '/blog': () => {
    const container = document.getElementById('spa-content');
    renderBlogPage(container);
  }
};

function navigate(path) {
  history.pushState({}, '', path);
  handleRoute();
}

function handleRoute() {
  const path = window.location.pathname;
  const route = routes[path];
  if (route) {
    route();
  } else {
    document.getElementById('spa-content').innerHTML = '<h2>404 - Page Not Found</h2>';
  }
}

// Intercept link clicks
document.addEventListener('click', e => {
  const link = e.target.closest('a[data-link]');
  if (link) {
    e.preventDefault();
    navigate(link.getAttribute('href'));
  }
});

window.addEventListener('popstate', handleRoute);
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('main').style.display = 'block';
  handleRoute();
});
