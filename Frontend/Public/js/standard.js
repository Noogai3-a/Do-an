document.addEventListener("DOMContentLoaded", () => {
  const latestContainer = document.querySelector(".section:nth-of-type(1) .document-grid");
  const popularContainer = document.querySelector(".section:nth-of-type(2) .document-grid");

  const BACKEND_URL = 'https://backend-yl09.onrender.com'; // 🛠️ Sửa tên đúng backend

  function createDocumentHTML(doc) {
    const fileUrl = `${BACKEND_URL}/${doc.fileUrl.replace(/\\/g, '/')}`;
    const subtitle = `${doc.subjectNameLabel || ''} • ${doc.subjectTypeLabel || ''}`;

    return `
      <div class="document-item">
        <a href="${fileUrl}" target="_blank">
          <img src="/assets/doc-default.png" alt="${doc.title}">
          <p class="doc-title">${doc.title}</p>
          <p class="doc-subtitle">${subtitle}</p>
        </a>
      </div>
    `;
  }

  fetch(`${BACKEND_URL}/documents/latest`)
    .then(res => res.json())
    .then(data => {
      latestContainer.innerHTML = data.map(createDocumentHTML).join('');
    })
    .catch(err => console.error("❌ Lỗi tải tài liệu mới nhất:", err));

  fetch(`${BACKEND_URL}/documents/popular`)
    .then(res => res.json())
    .then(data => {
      popularContainer.innerHTML = data.map(createDocumentHTML).join('');
    })
    .catch(err => console.error("❌ Lỗi tải tài liệu phổ biến:", err));
});
