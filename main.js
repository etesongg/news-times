// const API_KEY = `30202e1a80e04c63b90325f9ec26c81a`; // newsapi에서 제공하는 기본키임 개인키 아님
// netlify 배포를 위한 제공 api
let newsList = []
const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) => 
    menu.addEventListener("click", (event) => getNewsCategory(event))
);
let url = new URL(`https://news-timesbysong.netlify.app/top-headlines`);

const getNews = async() => {
    const response = await fetch(url); // await 없으면 pending(미뤄짐, 대기상태) 뜸
    const data = await response.json();
    newsList = data.articles
    render()
}

const getLatestNews = async() => {
    url = new URL(`https://news-timesbysong.netlify.app/top-headlines`);
    getNews()
};

const getNewsCategory = async(evnet) => {
    const gatcgory = evnet.target.textContent.toLowerCase()
    url = new URL(`https://news-timesbysong.netlify.app/top-headlines?category=${gatcgory}`);
    
    getNews()
}

const getNewsByKeyword = async() => {
    const keyword = document.getElementById("search-input").value;
    url = new URL(`https://news-timesbysong.netlify.app/top-headlines?q=${keyword}`);

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

    document.getElementById('news-board').innerHTML = newsHTML
}

getLatestNews();

// 버튼들에 크릭이벤트 주기
// 카테고리별 뉴스 가져오기
// 그 뉴스 보여주기