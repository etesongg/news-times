import { KEY } from "./secrets.js";

const API_KEY = KEY.API_KEY; 

let newsList = [];

const getLatestNews = async () => {
    const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render();
    console.log(newsList);
}
getLatestNews();

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



// 사이드 메뉴
const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
  };
  
  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
  };

  const openSearchBox = () => {
    let inputArea = document.getElementById("input-area");
    if (inputArea.style.display === "inline") {
      inputArea.style.display = "none";
    } else {
      inputArea.style.display = "inline";
    }
  };
