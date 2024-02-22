// const API_KEY = `30202e1a80e04c63b90325f9ec26c81a`; // newsapi에서 제공하는 기본키임 개인키 아님
// netlify 배포를 위한 제공 api
let newsList = []
const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) => 
    menu.addEventListener("click", (event) => getNewsCategory(event))
);
let url = new URL(`https://news-timesbysong.netlify.app/top-headlines`);
// let url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);

const getNews = async() => {
    try{
        const response = await fetch(url); // await 없으면 pending(미뤄짐, 대기상태) 뜸
        const data = await response.json();
        if(response.status === 200){
            if(data.articles.length === 0){
                console.log(data.articles)
                throw new Error("No result for this search")
            }
            newsList = data.articles
            render()
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

getLatestNews();

// 버튼들에 크릭이벤트 주기
// 카테고리별 뉴스 가져오기
// 그 뉴스 보여주기