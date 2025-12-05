let bookmarks = [];

// Categories
const loadCategories = () => {
  fetch('https://news-api-fs.vercel.app/api/categories')
    .then(res => res.json())
    .then(data => displayCategories(data.categories))
    .catch(err => console.log(err));
};

const displayCategories = (categories) => {
  const categoriesContainer = document.getElementById('news-category');
  categoriesContainer.innerHTML = '';

  for (let cat of categories) {
    const showCategory = document.createElement('li');
    showCategory.className = "px-3 py-1 hover:border-b-4 hover:border-red-600 cursor-pointer";
    showCategory.dataset.id = cat.id;
    showCategory.innerHTML = `<a>${cat.title}</a>`;
    categoriesContainer.append(showCategory);
  }

  categoriesContainer.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    const id = li.dataset.id;

    categoriesContainer.querySelectorAll("li").forEach(item => {
      item.classList.remove("border-b-4", "border-red-600");
    });
    li.classList.add("border-b-4", "border-red-600");

    loadNewsByCategory(id);
  });
};

// Load News
const loadNewsByCategory = (id) => {
  fetch(`https://news-api-fs.vercel.app/api/categories/${id}`)
    .then(res => res.json())
    .then(data => displayNewsByCategories(data.articles))
    .catch(err => console.log(err));
};

// Display News Cards
const displayNewsByCategories = (newsItem) => {
  const newscontainer = document.getElementById('news-container');
  newscontainer.innerHTML = '';

  for (let news of newsItem) {
    const newsDiv = document.createElement('div');
    newsDiv.innerHTML = `
      <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer">

        <div class="h-40 overflow-hidden">
          <img src="${news.image?.srcset?.[5]?.url || news.image?.src || ''}" 
               alt="${news.title}" 
               class="w-full h-full object-cover">
        </div>

        <div class="p-4 flex flex-col gap-2">
          <h1 class="text-lg font-semibold text-gray-800 leading-snug line-clamp-2">
            ${news.title}
          </h1>

          <p class="text-sm text-gray-500 flex items-center gap-1">
            <i class="fa-regular fa-clock"></i>
            ${news.time || "Unknown time"}
          </p>

          <div class="flex flex-col sm:flex-row justify-between mt-3 gap-2">

            <button onclick="showModal('${news.id}')" class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:border-red-600 hover:text-red-600 transition">
              Read More
            </button>

            <button class="bookmark_btn flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition">
              <i class="fa-regular fa-bookmark"></i> Save
            </button>

          </div>
        </div>
      </div>
    `;

    newsDiv.querySelector(".bookmark_btn").addEventListener("click", () => {
      loadBookmarks(news);
    });

    newscontainer.append(newsDiv);
  }
};

// Load Bookmarks
const loadBookmarks = (news) => {
  const bookmarkContainer = document.getElementById("bookmarkcontainer");
  const bookmarkContainerMobile = document.getElementById("bookmarkcontainerMobile");

  bookmarks.push(news);

  const itemHTML = `
    <div id="bookmark-${news.id}" class="p-3 border-b border-gray-300">
      <h2 class="text-md font-semibold text-gray-800">${news.title}</h2>
      <button onclick="deleteBookMarks('${news.id}')" class="mt-2 px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700">
        Delete
      </button>
    </div>
  `;

  bookmarkContainer.insertAdjacentHTML("beforeend", itemHTML);
  bookmarkContainerMobile.insertAdjacentHTML("beforeend", itemHTML);
};

// Delete Bookmarks
const deleteBookMarks = (Id) => {
  bookmarks = bookmarks.filter(item => item.id !== Id);
  const element = document.getElementById(`bookmark-${Id}`);
  if (element) element.remove();
};

// Show Modal
const showModal = (id) => {
  const modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = "";

  fetch(`https://news-api-fs.vercel.app/api/news/${id}`)
    .then(res => res.json())
    .then(data => {
      const content = data.article;

      const modalDiv = document.createElement("div");

      const fullContent = content.content
        .map(p => `<p class="mb-4 text-gray-700 leading-relaxed">${p}</p>`)
        .join("");

      const firstImage = content.images?.length
        ? `<img src="${content.images[0].url}" class="w-full rounded-xl shadow mb-5">`
        : "";

      modalDiv.innerHTML = `
        <input type="checkbox" id="modal-news" class="modal-toggle" checked />
        <div class="modal" role="dialog">
          <div class="modal-box max-w-2xl p-6 rounded-2xl shadow-lg bg-white animate-fadein">

            <h3 class="text-2xl font-bold text-gray-900 mb-3">
              ${content.title}
            </h3>

            <div class="flex items-center gap-3 text-sm text-gray-500 mb-4 border-b pb-3">
              <span class="font-medium">News Details</span>
            </div>

            ${firstImage}

            <div class="max-h-[350px] overflow-y-auto pr-1">
              ${fullContent || "<p>No details available</p>"}
            </div>

            <div class="modal-action">
              <label for="modal-news" class="btn rounded-lg px-5">Close</label>
            </div>

          </div>
        </div>

        <style>
          .animate-fadein {
            animation: fadein 0.35s ease-out;
          }
          @keyframes fadein {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        </style>
      `;

      modalContainer.appendChild(modalDiv);
    })
    .catch(err => console.log(err));
};

// Mobile bookmark modal
const mobileModal = document.getElementById("mobileBookmarkModal");
document.getElementById("openBookmarkM").addEventListener("click", () => {
  mobileModal.showModal();
});

// Initialize
loadCategories();
loadNewsByCategory('main');
