// import { KEY } from "./secrets.js";
import { KEY } from "./times-api.js"

const API_KEY = KEY.API_KEY; 
const API_URL = KEY.API_URL;

let newsList = [];
let url = new URL(`${API_URL}?country=us&apiKey=${API_KEY}`);
const menus = document.querySelectorAll(".menus button")
menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)))

const getNews = async() => {
  try{
    const response = await fetch(url);
    const data = await response.json();
    if(response.status === 200){
      if(data.articles.length != 0){
        newsList = data.articles;
        render();
      }else{
        throw new Error("No result for this search")
      }
    }else{
      throw new Error(data.message);
    }
  }catch(error){
    errorRender(error.message);
  }
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
  console.log(newsList)
  const newsHTML = newsList.map(news => {
    const newsTitle = (news.title === "[Removed]")? "삭제된 기사 입니다.": news.title;
    const newsDescription = (news.description === null || news.description === "[Removed]")? "내용없음" : (news.description.length > 200)
      ? `${news.description.slice(0, 200)}...`
      : news.description;
    const newsImage = (news.urlToImage != null)? `${news.urlToImage}`: "src/image-not-available.png";
    const newsSource = (news.source.name === null || news.source.name === "[Removed]")? "no source": news.source.name;
    const newsPublishedAt = moment(news.publishedAt).startOf('day').fromNow();

    return `
    <div class="row news">
      <div class="col-lg-4">
        <img class="news-img-size" src="${newsImage}" alt="${newsTitle}">
      </div>
      <div class="col-lg-8">
        <h2>${newsTitle}</h2>
        <p>${newsDescription}</p>
        <div>${newsSource} * ${newsPublishedAt}</div>
      </div>
    </div>`}).join(''); // 배열에 있는 , 지우기 위해 .join 사용

  document.getElementById("news-board").innerHTML = newsHTML
}

const errorRender = (errorMessage) => {
  const errorHTML = `
  <div class="alert alert-secondary" role="alert">
    ${errorMessage}
  </div>`

  document.getElementById("news-board").innerHTML = errorHTML
}

const enterkey = () => {
  if(window.event.keyCode == 13){
      getNewsByKeyword();
  }
}

document.querySelector("#search-input").addEventListener("keyup", enterkey);

const openSearchBox = () => {
  let searchArea = document.getElementById("search-box");
  if(searchArea.style.display === "none"){
    searchArea.style.display = "inline";
  }else{
    searchArea.style.display = "none";
  }
}
document.querySelector(".search-icon").addEventListener("click", openSearchBox);

// 사이드 메뉴
const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};
document.querySelector(".hamburger-icon").addEventListener("click", openNav);

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};
document.querySelector(".closebtn").addEventListener("click", closeNav);

