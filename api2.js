const loadCategories = () => {
    fetch('https://news-api-fs.vercel.app/api/categories')
    .then((res) => res.json())
    .then((data) => {
        displayCategories(data.categories);
    })
    .catch((err) => {
        console.log(err);
    })
};

const displayCategories = (categories) => {
    const categoriesContainer = document.getElementById('news-category');
    categoriesContainer.innerHTML = '';

    for (let cat of categories) {
        const showCategory = document.createElement('li');
        showCategory.className = "px-3 py-1 hover:border-b-4 hover:border-red-600 cursor-pointer";

        // ADD category id in dataset
        showCategory.dataset.id = cat.id;

        showCategory.innerHTML = `<a>${cat.title}</a>`;
        categoriesContainer.append(showCategory);
    }

    categoriesContainer.addEventListener("click", (e) => {
        const li = e.target.closest("li");
        if (!li) return;

        const id = li.dataset.id;  // GET category id
        console.log(id);

        // Remove old active class
        categoriesContainer.querySelectorAll("li").forEach((item) => {
            item.classList.remove("border-b-4", "border-red-600");
        });

        // Add active border
        li.classList.add("border-b-4", "border-red-600");

        // Load news
        loadNewsByCategory(id);
    });
};

const loadNewsByCategory = (id) => {
    fetch(`https://news-api-fs.vercel.app/api/categories/${id}`)
    .then((res) => res.json())
    .then((data) => {
        displayNewsByCategories(data.articles);
    })
    .catch((err) => {
        console.log(err);
    });
};

const displayNewsByCategories = (newsItem) => {
    const newscontainer = document.getElementById('news-container');
    newscontainer.innerHTML = '';

    for (let news of newsItem) {
        console.log(news);

        const newsDiv = document.createElement('div');

        newsDiv.innerHTML = `
        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer">

            <!-- News Image -->
            <div class="h-40 overflow-hidden">
                <img src="${news.image?.srcset?.[5]?.url || news.image?.src || ''}" 
                     alt="${news.title}" 
                     class="w-full h-full object-cover">
            </div>

            <!-- Card Content -->
            <div class="p-4 flex flex-col gap-2">

                <h1 class="text-lg font-semibold text-gray-800 leading-snug line-clamp-2">
                    ${news.title}
                </h1>

                <p class="text-sm text-gray-500 flex items-center gap-1">
                    <i class="fa-regular fa-clock"></i>
                    ${news.time || "Unknown time"}
                </p>

                <div class="flex justify-between mt-3">

            <!-- Read More Button -->
            <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:border-red-600 hover:text-red-600 transition">
            Read More
            <i class="fa-solid fa-arrow-right-long"></i>
            </button>

            <!-- Bookmark Button -->
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

    const loadBookmarks=(news)=>{
        const bookmarkContainer = document.getElementById("bookmarkcontainer");

    const item = document.createElement("div");
    item.className = "p-3 border-b border-gray-300 hover:bg-gray-100 transition";

    item.innerHTML = `
        <h2 class="text-md font-semibold text-gray-800">${news.title}</h2>
        <button onclick="deleteBookMarks('${news.id}')" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition">delete</button>
        
    `;

    bookmarkContainer.append(item);

    };
    const deleteBookMarks=(BookMarkId)=>{
        const filterbookMarks=news.filter(bookMark=>bookMark.id!==BookMarkId);
        console.log(filterbookMarks);
    }
    

loadCategories();
loadNewsByCategory('main');
