document.addEventListener("DOMContentLoaded", async () => {
  const docListContainers = document.querySelectorAll(".document-list");

  function getDriveDirectLink(url) {
    const regex = /\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    if (match) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  }

  function proxyImageURL(url) {
    return `https://backend-yl09.onrender.com/api/proxy-image?url=${encodeURIComponent(url)}`;
  }

  function createDocumentItem(doc) {
    let placeholder = "/assets/pdf-icon.png";
    let thumbnail = placeholder;

    if (doc.thumbnailImage) {
      const direct = getDriveDirectLink(doc.thumbnailImage);
      thumbnail = proxyImageURL(direct);
    }

    let date = "";
    if (doc.uploadDate) {
      const parsedDate = new Date(doc.uploadDate);
      if (!isNaN(parsedDate)) {
        date = parsedDate.toLocaleDateString("vi-VN");
      }
    }

    return `
      <div class="document-item" data-id="${doc._id}">
        <img 
          src="${placeholder}" 
          data-src="${thumbnail}" 
          alt="thumbnail" 
          class="doc-image lazy-img">
        <div class="doc-info">
          <h3>${doc.title || "Không có tiêu đề"}</h3>
          <p class="doc-meta">
            <span>${doc.subjectTypeLabel || "Chưa phân loại"}</span>
            <span>${doc.subjectNameLabel || "Chưa phân loại"}</span>
          </p>
          <p class="doc-date">${date}</p>
        </div>
      </div>
    `;
  }

  function lazyLoadImages(callback) {
    const lazyImages = document.querySelectorAll("img.lazy-img");
    let loadedCount = 0;
    const total = lazyImages.length;

    lazyImages.forEach(img => {
      const realSrc = img.getAttribute("data-src");
      if (!realSrc) {
        loadedCount++;
        if (loadedCount === total) callback();
        return;
      }

      const temp = new Image();
      temp.onload = () => {
        img.src = realSrc;
        img.classList.add("loaded");
        loadedCount++;
        if (loadedCount === total) callback();
      };
      temp.onerror = () => {
        loadedCount++;
        if (loadedCount === total) callback();
      };
      temp.src = realSrc;
    });
  }

  async function fetchDocuments() {
    try {
      const [newestRes, popularRes] = await Promise.all([
        fetch('https://backend-yl09.onrender.com/api/documents/newest?limit=3', {
          credentials: 'include'
        }),
        fetch('https://backend-yl09.onrender.com/api/documents/popular?limit=3', {
          credentials: 'include'
        })
      ]);

      if (!newestRes.ok || !popularRes.ok) {
        throw new Error("Không lấy được danh sách tài liệu");
      }

      const newest = await newestRes.json();
      const popular = await popularRes.json();

      return { newest, popular };
    } catch (error) {
      console.error("Lỗi khi fetch documents:", error);
      throw error;
    }
  }

  try {
    const { newest, popular } = await fetchDocuments();

    docListContainers.forEach((container, index) => {
      container.innerHTML = "";

      let documents = [];
      switch(index) {
        case 0: // Mới nhất
          documents = newest.documents || [];
          break;
        case 1: // Phổ biến
          documents = popular.documents || [];
          break;
        default:
          documents = [];
      }

      if (documents.length > 0) {
        container.innerHTML = documents.map(createDocumentItem).join('');
      } else {
        container.innerHTML = '<p class="no-docs">Chưa có tài liệu nào</p>';
      }
    });

    lazyLoadImages(() => {
      console.log("Tất cả ảnh đã được tải xong");
    });

    // Thêm sự kiện click cho các document item
    document.querySelectorAll(".document-item").forEach(item => {
      item.addEventListener("click", () => {
        const docId = item.getAttribute("data-id");
        window.location.href = `/document.html?id=${docId}`;
      });
    });

  } catch (err) {
    console.error("Lỗi khi load tài liệu:", err);
    docListContainers.forEach(container => {
      container.innerHTML = `<p class="error-msg">Không thể tải tài liệu. Vui lòng thử lại sau.</p>`;
    });
  }
});