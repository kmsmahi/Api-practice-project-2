const catagoryContainer=document.getElementById('catagory-container');





const loadCatagory=()=>{
    fetch("https://news-api-fs.vercel.app/api/categories")
    .then((res)=>res.json())
    .then((data)=>{
        console.log(data.categories);
        const Categories=data.categories;
        Categories.forEach(cat=>{
            catagoryContainer.innerHTML+=`
            <li class="hover:border-b-4 border-red-500 cursor-pointer"><a href="">${cat.title}</a></li>  
            `
        })
    })
    .catch(err=>{
        console.log(err);
    })
};
loadCatagory();