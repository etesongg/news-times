// import { KEY } from "./secrets.js";
import { KEY } from "./times-api.js"

const API_KEY = KEY.API_KEY; 
const API_URL = KEY.API_URL;

let newsList = [];
let url = new URL(`${API_URL}?country=us&apiKey=${API_KEY}`);
const menus = document.querySelectorAll(".menus button")
menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)))

const getNews = async() => {
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
}

const getLatestNews = async () => {
    url = new URL(`${API_URL}?country=us&apiKey=${API_KEY}`);
    getNews();
}
getLatestNews();

// 버튼에 클릭이벤트 주기
// 카테고리별 뉴스 가져오기
const getNewsByCategory = async (event) =>{
    const category = event.target.textContent.toLowerCase();
    url = new URL(`${API_URL}?country=us&category=${category}&apiKey=${API_KEY}`);
    getNews();
}

const getNewsByKeyword = async() => {
  const keyword = document.getElementById("search-input").value;
  url = new URL(`${API_URL}?country=us&q=${keyword}&apiKey=${API_KEY}`);
  getNews();
}

document.querySelector(".search-button").addEventListener("click", getNewsByKeyword);

const render = () => {
    const newsHTML = newsList.map(news => `
        <div class="row news">
          <div class="col-4">
            <img class="news-img-size" src="${news.urlToImage}" alt="">
          </div>
          <div class="col-8">
            <h2>${news.title}</h2>
            <p>${news.description}</p>
            <div>${news.source.name} * ${news.publishedAt}</div>
          </div>
        </div>`).join(''); // 배열에 있는 , 지우기 위해 .join 사용

    document.getElementById("news-board").innerHTML = newsHTML
}

// const enterkey = () => {
//   if(window.event.keyCode == 13){
//       getNewsByKeyword();
//   }
// }
