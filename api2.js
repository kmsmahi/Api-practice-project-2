const catagoryContainer = document.getElementById('catagory-container');
const newsContainer = document.getElementById('news-container');
const bookmarkContainer = document.getElementById('bookmark-container');

let bookmarkList = []; // store bookmarks here

// CATEGORY CLICK
catagoryContainer.addEventListener('click', (e) => {
    if (e.target && e.target.nodeName === "LI") {

        const allLI = catagoryContainer.querySelectorAll("li");
        allLI.forEach(li => li.classList.remove("border-b-4", "border-red-500"));

        e.target.classList.add("border-b-4", "border-red-500");

        loadNewsByCatagory(e.target.id);
    }
});


// FETCH NEWS BY CATEGORY
const loadNewsByCatagory = (Catid) => {
    fetch(`https://news-api-fs.vercel.app/api/categories/${Catid}`)
        .then((res) => res.json())
        .then((data) => showNews(data.articles))
        .catch((err) => console.log(err));
};


// DISPLAY NEWS
const showNews = (news) => {
    newsContainer.innerHTML = "";

    news.forEach(n => {
        const imageUrl = n.image?.srcset?.[5]?.url || "";

        newsContainer.innerHTML += `
<div class="card bg-base-100 shadow-xl mb-6 border rounded-xl overflow-hidden">

    <figure class="w-full h-56">
        <img class="w-full h-full object-cover" src="${imageUrl}" alt="">
    </figure>

    <div class="card-body">
        <h1 class="text-xl font-semibold">${n.title}</h1>
        <p class="text-gray-500">${n.time}</p>

        <div class="card-actions justify-end mt-4">
            <button class="btn btn-outline btn-primary bookmark-btn"
                data-title="${n.title}"
                data-time="${n.time}"
                data-img="${imageUrl}">
                Bookmark
            </button>
        </div>
    </div>
</div>
`;

    });
};


// CLICK EVENT FOR BOOKMARK BUTTON
newsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("bookmark-btn")) {

        const title = e.target.dataset.title;
        const time = e.target.dataset.time;
        const img = e.target.dataset.img;

        const item = { title, time, img };

        // prevent duplicates
        const exists = bookmarkList.some(b => b.title === title);
        if (!exists) {
            bookmarkList.push(item);
            displayBookmarks();
        } else {
            alert("Already bookmarked!");
        }
    }
});


// SHOW BOOKMARK LIST
const displayBookmarks = () => {
    bookmarkContainer.innerHTML = "";

    bookmarkList.forEach(b => {
        bookmarkContainer.innerHTML += `
        <div class="card bg-base-100 border shadow p-4 mb-3 flex items-center gap-4 rounded-xl">

            <img src="${b.img}" class="w-24 h-20 object-cover rounded-lg">

            <div>
                <h2 class="text-lg font-semibold">${b.title}</h2>
                <p class="text-sm text-gray-500">${b.time}</p>
            </div>
        </div>
        `;
    });
};


// LOAD CATEGORY LIST
const loadCatagory = () => {
    fetch("https://news-api-fs.vercel.app/api/categories")
        .then((res) => res.json())
        .then((data) => {
            data.categories.forEach(cat => {
                catagoryContainer.innerHTML += `
                <li id="${cat.id}" class="hover:border-b-4 cursor-pointer">
                    ${cat.title}
                </li>`;
            });
        })
        .catch(err => console.log(err));
};


// INITIAL LOAD
loadCatagory();
loadNewsByCatagory("main");
