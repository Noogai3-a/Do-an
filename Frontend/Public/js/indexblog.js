// js/indexblog.js
export function renderBlogPage(container) {
  container.innerHTML = `
    <div class="blog">
      <h1>Blog</h1>
      <div class="latest-blog">
        <h2>Mới nhất</h2>
        <div class="blog-list"></div>
      </div>
      <div class="most-viewed-blog">
        <h2>Được xem nhiều</h2>
        <div class="blog-list"></div>
      </div>
      <div class="list-blog">
        <h2>Danh sách</h2>
        <div class="blog-list"></div>
      </div>
    </div>
  `;

  fetch('https://backend-yl09.onrender.com/api/blogs', {
    credentials: 'include',
  })
    .then(res => res.json())
    .then(blogs => {
      const lists = container.querySelectorAll('.blog-list');
      const strip = html => new DOMParser().parseFromString(html, 'text/html').body.textContent || '';

      const createItem = blog => `
        <a href="/blog-read?post=${blog._id}" class="blog-item">
          <img src="/assets/login_pic.jpg" data-src="/api/proxy-image?url=${encodeURIComponent(blog.thumbnailImage || '')}" class="blog-image lazy-img" />
          <h3>${blog.title}</h3>
          <h6>${new Date(blog.createdAt).toLocaleDateString("vi-VN")}</h6>
          <p>${strip(blog.content).slice(0, 50)}...</p>
        </a>
      `;

      const sortedByDate = [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
      const sortedByViews = [...blogs].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

      if (lists[0]) lists[0].innerHTML = sortedByDate.map(createItem).join('');
      if (lists[1]) lists[1].innerHTML = sortedByViews.map(createItem).join('');
      if (lists[2]) lists[2].innerHTML = blogs.map(createItem).join('');

      document.querySelectorAll("img.lazy-img").forEach(img => {
        img.src = img.dataset.src;
        img.classList.add("fade-in");
      });
    });
}
