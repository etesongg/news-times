// const API_KEY = `30202e1a80e04c63b90325f9ec26c81a`; // newsapi에서 제공하는 기본키임 개인키 아님
// netlify 배포를 위한 제공 api
let newsList = []
const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) => 
    menu.addEventListener("click", (event) => getNewsCategory(event))
);
let url = new URL(`https://news-timesbysong.netlify.app/top-headlines`);
// let url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
let totalResult = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const getNews = async() => {
    try{
        url.searchParams.set("page", page); // url 뒤에 붙여주는 함수(js에서 제공하는 URL을 사용하면 사용할 수 있음) &page=page 형태로 붙음
        url.searchParams.set("pageSize", pageSize); // 파라미터를 붙인 후에 fetch로 url 호출

        const response = await fetch(url); // await 없으면 pending(미뤄짐, 대기상태) 뜸
        const data = await response.json();
        if(response.status === 200){
            if(data.articles.length === 0){
                throw new Error("No result for this search")
            }
            totalResult = data.totalResults;
            newsList = data.articles;
            render();
            paginationRender();
        }else{
            throw new Error(data.message)
        } 
    }catch(error){
        errorRender(error.message)
    }
}

const getLatestNews = async() => {
    url = new URL(`https://news-timesbysong.netlify.app/top-headlines`);
    // url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
    getNews()
};

const getNewsCategory = async(evnet) => {
    const category = evnet.target.textContent.toLowerCase()
    url = new URL(`https://news-timesbysong.netlify.app/top-headlines?category=${category}`);
    // url = new URL(`https://newsapi.org/v2/top-headlines?category=${category}&country=us&apiKey=${API_KEY}`);
    
    getNews()
}

// const toggleMenu = () => {
//     const menu = document.querySelector(".menus");
//     menu.classList.toggle("show-menu")
// }

// const toggleSearch = () => {
//     const searchGroup = document.querySelector()
// }

const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
  };
  
  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
  };

const openSearchBox = () => {
    let inputArea = document.getElementById("input-area");

    if (inputArea.style.display === "none") {
      inputArea.style.display = "flex";
    } else {
      inputArea.style.display = "none";
    }
  };
  
const getNewsByKeyword = async() => {
    const keyword = document.getElementById("search-input").value;
    url = new URL(`https://news-timesbysong.netlify.app/top-headlines?q=${keyword}`);
    // url = new URL(`https://newsapi.org/v2/top-headlines?q=${keyword}country=us&apiKey=${API_KEY}`);

    getNews()
}

const render = ()=>{
    newsList = newsList.filter(articles => articles.title !== "[Removed]");
    const newsHTML = newsList.map(news=>`
    <div class="row news">
                <div class="col-lg-4">
                    <img class="news-img-size" src=${news.urlToImage} alt="">
                </div>
                <div class="col-lg-8">
                    <h2>${news.title}</h2>
                    <p>
                        ${news.description}
                    </p>
                    <div>
                        ${news.source.name} ${news.publishedAt} ${news.content}
                    </div>
                </div>
            </div>
    `).join('')

    document.getElementById('news-board').innerHTML = newsHTML;
}

const errorRender = (errorMessage) => {
    const errorHtml = `<div class="alert alert-danger" role="alert">
        ${errorMessage}
    </div>`
    document.getElementById("news-board").innerHTML = errorHtml;
}

// totalResult, page, pageSize, groupSize, pageGroup, lastPage, firstPage, totalPages
const paginationRender = () => {
    const totalPages = Math.ceil(totalResult/pageSize);
    const pageGroup = Math.ceil(page/groupSize);
    let lastPage = pageGroup * groupSize;
    // 마지막 페이지 그룹이 그룹사이즈보다 작으면 lastPage = totalPages
    if(lastPage > totalPages){
        lastPage = totalPages;
    }
    const firstPage = lastPage - (groupSize - 1) <= 0? 1:lastPage - (groupSize - 1);

    let paginationHTML = ""
    if (firstPage > 1){
    paginationHTML = `
    <li class="page-item"><a class="page-link" onclick="moveToPage(${1})" href="#">&lt&lt</a></li>
    <li class="page-item"><a class="page-link" onclick="moveToPage(${page - 1})" href="#">&lt</a></li>`;
    }

    for(let i = firstPage; i<=lastPage; i++){
        paginationHTML += `
        <li class="page-item ${i === page? "active":""}" onclick="moveToPage(${i})" href="#"><a class="page-link">${i}</a></li>`
    }

    if(lastPage < totalPages){
        paginationHTML += `
        <li class="page-item"><a class="page-link" onclick="moveToPage(${page + 1})" href="#">&gt</a></li>
        <li class="page-item"><a class="page-link" onclick="moveToPage(${totalPages})" href="#">&gt&gt</a></li>`
    }

    document.querySelector(".pagination").innerHTML = paginationHTML;
}

const moveToPage = (pageNum) => {
    page = pageNum;
    getNews(page);
}

getLatestNews();

// 버튼들에 크릭이벤트 주기
// 카테고리별 뉴스 가져오기
// 그 뉴스 보여주기