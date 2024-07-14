// import { KEY } from "./secrets.js";
import { KEY } from "./times-api.js";

const API_KEY = KEY.API_KEY;
const API_URL = KEY.API_URL;

let newsList = [];
let url = new URL(`${API_URL}?country=us&apiKey=${API_KEY}`);
// 페이지네이션 기본 값 설정
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const menus = document.querySelectorAll(".menus button, .side-menu-list");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

const getNews = async () => {
  try {
    url.searchParams.set("page", page); // 페이지네이션을 위한 파라미터 값을 추가한 후 url을 호출(fetch(url)) 해야함.
    url.searchParams.set("pageSize", pageSize);

    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length != 0) {
        newsList = data.articles;
        totalResults = data.totalResults;
        render();
        paginationRender();
      } else {
        throw new Error("No result for this search");
      }
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(`${API_URL}?country=us&apiKey=${API_KEY}`);
  await getNews();
};
getLatestNews();

// 버튼에 클릭이벤트 주기
// 카테고리별 뉴스 가져오기
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(`${API_URL}?country=us&category=${category}&apiKey=${API_KEY}`);
  page = 1;
  await getNews();
};

const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;
  url = new URL(`${API_URL}?country=us&q=${keyword}&apiKey=${API_KEY}`);
  page = 1; // 검색 후 페이지 1로 설정
  await getNews();
};

const render = () => {
  const newsHTML = newsList
    .map((news) => {
      const newsTitle =
        news.title === "[Removed]" ? "삭제된 기사 입니다." : news.title;
      const newsDescription =
        news.description === "" ||
        news.description === null ||
        news.description === "[Removed]"
          ? "내용없음"
          : news.description.length > 200
          ? `${news.description.slice(0, 200)}...`
          : news.description;
      const newsImage =
        news.urlToImage != null
          ? `${news.urlToImage}`
          : "static/src/image-not-available.png";
      const newsSource =
        news.source.name === null || news.source.name === "[Removed]"
          ? "no source"
          : news.source.name;
      const newsPublishedAt = moment(news.publishedAt).startOf("day").fromNow();
      const newsUrl =
        news.url === "https://removed.com"
          ? "https://www.nytimes.com/"
          : news.url;

      return `
    <a href="${newsUrl}" target="_blank" class="news-a-tag">
     <div class="row news">
      <div class="col-lg-4">
        <img class="news-img-size" src="${newsImage}" alt="${newsTitle}">
      </div>
      <div class="col-lg-8">
       <h2>${newsTitle}</h2>
       <p>${newsDescription}</p>
       <div>${newsSource} * ${newsPublishedAt}</div>
      </div>
     </div>
    </a>`;
    })
    .join(""); // 배열에 있는 , 지우기 위해 .join 사용

  document.getElementById("news-board").innerHTML = newsHTML;

  document.querySelectorAll(".news-img-size").forEach((item) => {
    item.addEventListener("error", function () {
      this.src = "static/src/image-not-available.png";
    });
  });
};

const errorRender = (errorMessage) => {
  const errorHTML = `
  <div class="alert alert-secondary" role="alert">
    ${errorMessage}
  </div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
};

const enterkey = () => {
  if (window.event.keyCode == 13) {
    getNewsByKeyword();
  }
};

const toggleSearchBox = () => {
  const searchArea = document.getElementById("search-box");
  searchArea.style.display = searchArea.style.display === "none"? "inline" : "none"
};

// 사이드 메뉴
const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};

// 페이지네이션
// totalResult(전체 결과 수), page(현재 페이지), pageSize(한번에 보여주는 페이지 사이즈), groupSize(한 페이지에 몇개 그룹으로 보여줄 수) => 내가 초기화 해줘야 할 값
// 위를 통해 totalPages(총 페이지 수), pageGroup(현재 페이지가 속한 그룹), lastPage(현재 페이지의 마지막 페이지), firstPage(현재 페이지의 첫번째 페이지)를 계산할 수 있음
const paginationRender = () => {
  const totalPages = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSize);
  let lastPage = pageGroup * groupSize;
  const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
  
  let paginationHTML = "";
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }

  if (page >= 2) {
    paginationHTML = `
      <li class="page-item ${page === 1 ? "disabled" : ""}">
        <a class="page-link" pageNum="${1}" href="#">&lt&lt</a>
      </li>
      <li class="page-item ${page === 1 ? "disabled" : ""}">
        <a class="page-link" pageNum="${page - 1}" href="#">&lt</a>
      </li>`;
  }

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `
      <li class="page-item ${i === page ? "active" : ""}" >
        <a class="page-link" pageNum="${i}" href="#">${i}</a>
      </li>`;
  }

  if (page < totalPages) {
    paginationHTML += `
      <li class="page-item ${page === totalPages ? "disabled" : ""}">
        <a class="page-link" pageNum="${page + 1}" href="#">&gt</a>
      </li>
      <li class="page-item ${page === totalPages ? "disabled" : ""}">
        <a class="page-link" pageNum="${totalPages}" href="#">&gt&gt</a>
      </li>`;
  }
  document.querySelector(".pagination").innerHTML = paginationHTML;

  document.querySelectorAll(".page-item").forEach((item) => {
    item.addEventListener("click", moveToPage);
  });
};

const moveToPage = async (event) => {
  const pageNum = parseInt(event.target.getAttribute("pageNum")); // parseInt 문자열을 정수로 변환하는 역할.
  // 현재페이지가 계산한 페이지 수 범위 안(1 ~ Math.ceil(totalResults / pageSize)) 일때 랜더 해야함.
  if (pageNum > 0 && pageNum <= Math.ceil(totalResults / pageSize)) {
    page = pageNum;
    paginationRender();
    await getNews();
  }
};

const makeEventListener = () => {
  document.querySelector(".search-button").addEventListener("click", getNewsByKeyword);
  document.querySelector("#search-input").addEventListener("keyup", enterkey);
  document.querySelector(".search-icon").addEventListener("click", toggleSearchBox);
  document.querySelector(".hamburger-icon").addEventListener("click", openNav);
  document.querySelector(".closebtn").addEventListener("click", closeNav);
}
makeEventListener();