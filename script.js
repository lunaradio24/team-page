// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase 구성 정보 설정
const firebaseConfig = {
  apiKey: "AIzaSyAv-qdHJTtM3PZleVXA8ZuVlGnHLYjcUJs",
  authDomain: "teampage-3217c.firebaseapp.com",
  projectId: "teampage-3217c",
  storageBucket: "teampage-3217c.appspot.com",
  messagingSenderId: "853950108531",
  appId: "1:853950108531:web:0b70afd3d3d71addc2eb06",
  measurementId: "G-B4741RFE19",
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/************************   Icons  ************************/
$(document).on("click", "#naver-icon", () => {
  window.location.href = "https://naver.com";
});
$(document).on("click", "#github-icon", () => {
  window.location.href = "https://github.com";
});
$(document).on("click", "#notion-icon", () => {
  window.location.href = "https://notion.so";
});
$(document).on("click", "#google-icon", () => {
  window.location.href = "https://google.com";
});

$(document).on("click", "#member-github-icon", (element) => {
  window.location.href = element.target.className;
});
$(document).on("click", "#member-blog-icon", (element) => {
  window.location.href = element.target.className;
});

/************************   Nav Bars  ************************/
// 메뉴 클릭했을 때 보여지는 컨텐츠 화면 전환하는 함수
function tabContent(element) {
  //클릭한 메뉴가 'News' 면
  if (element.id == "news") {
    // fetchNews 함수를 실행하고, 다른 메뉴를 클릭했다면 실행하지 않음
    fetchNews();
  }
  //모든 컨텐츠 숨기기
  $(".content").hide();
  //클릭된 링크의 메뉴 id 가져오기
  let menuID = element.id;
  //보여줄 컨텐츠 id 구하기
  let targetID = menuID + "-content";
  //해당하는 컨텐츠 보이기
  $("#" + targetID).show();
}
// 모든 메뉴 링크에 클릭 이벤트 추가
$(document).on("click", ".nav-link", function (event) {
  //클릭한 메뉴가 'Join Us'가 아니라면
  if (this.id != "join") {
    //기본 동작 방지
    event.preventDefault();
    //로컬스토리지의 "menukey"라는 이름의 저장소에 현재 메뉴의 id를 저장
    localStorage.setItem("menukey", this.id);
    //tabConent 함수에 클릭한 메뉴 넣어서 실행
    tabContent(this);
  } else {
    //do nothing
  }
});
$(document).on("click", ".mytitle", function () {
  //로컬스토리지에 저장된 menukey 값을 "home"으로 초기화합니다.
  localStorage.setItem("menukey", "home");
  //페이지를 새로고침 합니다.
  window.location.reload();
});

/************************   Create   ************************/
// 메뉴에서 'Join Us' 클릭시
$(document).on("click", "#join", async function () {
  window.open(
    "register.html",
    "register",
    "width=520,height=670,left=200,top=100"
  );
});

let fileDOM = document.querySelector("#upload-button");
let preview = document.querySelector("#image-box");

// 이미지 파일 업로드 함수
function getImage() {
  const reader = new FileReader();
  //FileReader가 파일 읽기를 완료(onload)하면,
  reader.onload = ({ target }) => {
    //읽어들인 파일의 데이터 url을 preview의 src 속성에 넣어줍니다.
    preview.src = target.result;
  };
  //업로드한 이미지 파일의 url을 읽습니다.
  reader.readAsDataURL(fileDOM.files[0]);
}

// 팝업창 'Upload image' 버튼 클릭하여 새 파일을 선택하면
fileDOM?.addEventListener("change", function () {
  //getImage 함수를 실행하여 선택한 이미지 파일의 데이터 url을 이미지 preview 요소의 src에 넣어줍니다.
  getImage();
});

// 팝업창 '등록' 버튼 클릭시
$(document).on("click", "#add-button", async function () {
  //비밀번호 입력란에 입력한 글자가 4자리 숫자인 경우
  if (/^\d{4}$/.test($("#password").val())) {
    //Firestore에 저장할 doc을 생성합니다.
    let doc = {
      image: $("#image-box").prop("src"),
      name: $("#name").val(),
      mbti: $("#mbti").val(),
      strength: $("#strength").val(),
      cowork: $("#cowork").val(),
      favorites: $("#favorites").val(),
      blog: $("#blog").val(),
      github: $("#github").val(),
      time: Timestamp.now(),
      pw: $("#password").val(),
    };
    //입력한 멤버의 데이터를 Firestore에 저장합니다.
    await addDoc(collection(db, "members"), doc);
    alert("저장 완료!");
    //로컬스토리지에 menukey라는 저장소를 만들고 "members"이라는 값을 저장합니다.
    localStorage.setItem("menukey", "members");
    //팝업창을 닫습니다.
    self.close();
    //메인창을 새로고침 합니다.
    window.opener.location.reload();
  } else {
    //비밀번호 입력란에 입력한 글자가 4자리 숫자가 아닌 경우
    alert("4자리 숫자로 입력해주세요.");
  }
});

// 팝업창 '닫기' 버튼 클릭시
$(document).on("click", "#close-button", async function () {
  //팝업창을 닫습니다.
  self.close();
});

/************************   Read   ************************/
let docs = await getDocs(
  //시간순 정렬해서 query로 불러오기
  query(collection(db, "members"), orderBy("time"))
);

async function readDB() {
  docs.forEach((doc) => {
    let row = doc.data();
    let image = row["image"];
    let name = row["name"];
    let mbti = row["mbti"];
    let strength = row["strength"];
    let cowork = row["cowork"];
    let favorites = row["favorites"];
    let blog = row["blog"];
    let github = row["github"];

    //불러올 멤버카드 템플릿
    let card_template = `
          <div class="col-card">
            <div class="card h-100" >
              <img
                src="${image}"
                class="card-img-top"
                id="${doc.id}"
              />
              <div class="card-footer">
                <small>${name}</small>
              </div>
            </div>
          </div>`;
    //멤버카드 목록에 추가
    $("#member-cards").append(card_template);

    //textarea에서 입력받은 텍스트의 줄바꿈이 "\n" 으로 되어있는데, "<br>" 로 바꾸어야 html에서 적용이 된다.
    let strengthStr = strength.replace(/\n/g, "<br>");
    let coworkStr = cowork.replace(/\n/g, "<br>");
    let favoritesStr = favorites.replace(/\n/g, "<br>");

    //불러올 멤버 프로필 템플릿
    let profile_template = `
    <div class="modal" id="${doc.id}-modal">
      <div class="modal-container">
        <div class="col-left">
          <div class="image-container">
            <img src="${image}" />
            <div class="image-footer">
              <button class="${github}" id="member-github-icon"></button>
              <button class="${blog}" id="member-blog-icon"></button>
            </div>
          </div>
        </div>
        <div class="col-right">
          <div class="button-group" id="${doc.id}">
            <button class="btn btn-primary" id="edit-button">✎</button>
            <button class="btn btn-danger" id="delete-button">—</button>
            <button class="btn btn-secondary" id="close-modal">✕</button>
          </div>
          <div class="row-data">
            <div class="row-left">이름</div>
            <div class="row-right">${name}</div>
          </div>
          <div class="row-data">
            <div class="row-left">MBTI</div>
            <div class="row-right">${mbti}</div>
          </div>
          <div class="row-data">
            <div class="row-left">장점</div>
            <div class="row-right">${strengthStr}</div>
          </div>
          <div class="row-data">
            <div class="row-left">협업 스타일</div>
            <div class="row-right">${coworkStr}</div>
          </div>
          <div class="row-data">
            <div class="row-left">좋아하는 것들</div>
            <div class="row-right">${favoritesStr}</div>
          </div>
        </div>
      </div>
    </div>
    `;
    //modal-group 목록에 추가
    $("#modal-group").append(profile_template);
  });
}

// 개인 이미지 클릭시
$(document).on("click", ".card-img-top", async function () {
  //modal-group에 속한 개인 프로필 modal 창으로 열기
  $("#" + this.id + "-modal").css("display", "block");
  //세션스토리지의 modalID 라는 저장소를 생성하고 거기에 "#개인프로필id-modal" 이라는 값을 저장
  sessionStorage.setItem("modalID", "#" + this.id + "-modal");
});

// modal 창의 닫기 버튼 클릭시
$(document).on("click", "#close-modal", function () {
  //modal-group에 속한 개인 프로필 modal 창 닫기
  $("#" + this.parentElement.id + "-modal").css("display", "none");
  //세션스토리지에서 modalID 저장소를 삭제
  sessionStorage.removeItem("modalID");
});

// modal 창의 외부 클릭 시
$(window).click(function (event) {
  //클릭한 곳의 element가 현재 세션스토리지의 modalID 라는 저장소에서 가져온 id에 해당되는 element와 같다면
  if (event.target == $(sessionStorage.getItem("modalID"))[0]) {
    //세션스토리지의 modalID 라는 저장소에서 가져온 id에 해당되는 프로필 modal 창을 닫음
    $(sessionStorage.getItem("modalID")).css("display", "none");
    //세션스토리지에서 modalID 저장소를 삭제
    sessionStorage.removeItem("modalID");
  }
});

/************************   Update   ************************/
// '수정' 버튼 클릭시
$(document).on("click", "#edit-button", async function () {
  //편집할 것인지 확인하는 confirm 창을 띄운다.
  const isEdit = window.confirm("편집하시겠습니까?");
  //'Okay'를 클릭하면 아래를 실행, 'Cancel'을 클릭하면 취소
  if (isEdit) {
    //클릭된 버튼의 부모 요소에서 멤버의 doc ID를 가져옵니다.
    let docID = this.parentElement.id;
    //Firestore에서 해당 멤버의 데이터를 가져옵니다.
    let memberDoc = await getDoc(doc(db, "members", docID));
    let memberData = memberDoc.data();
    //비밀번호 확인 프롬프트 창을 엽니다.
    let inputPw = window.prompt("비밀번호를 입력해주세요.", "숫자 4자리");
    //프롬프트에 입력한 글자가 4자리 숫자인 경우
    if (/^\d{4}$/.test(inputPw)) {
      //프롬프트에 입력한 4자리 숫자가 비밀번호와 일치하는 경우
      if (inputPw == memberData["pw"]) {
        let openWin = window.open(
          "register.html",
          "_blank",
          "width=520,height=670,left=200,top=100"
        );
        //새 창을 열고 수정 전 데이터를 입력창에 표시합니다.
        openWin.onload = function () {
          openWin.document.getElementById("image-box").src =
            memberData["image"];
          openWin.document.getElementById("name").value = memberData["name"];
          openWin.document.getElementById("mbti").value = memberData["mbti"];
          openWin.document.getElementById("blog").value = memberData["blog"];
          openWin.document.getElementById("github").value =
            memberData["github"];
          openWin.document.getElementById("strength").value =
            memberData["strength"];
          openWin.document.getElementById("cowork").value =
            memberData["cowork"];
          openWin.document.getElementById("favorites").value =
            memberData["favorites"];
          openWin.document.getElementById("password").value = memberData["pw"];
          openWin.document.getElementById("add-button").textContent = "확인";
          openWin.document.getElementById("add-button").value = docID;
          openWin.document.getElementById("add-button").id = "confirm-button";
        };
      } else {
        //프롬프트에 입력한 4자리 숫자가 비밀번호와 일치하는지 않는 경우
        alert("비밀번호가 일치하지 않습니다.");
      }
    } else if (inputPw == null) {
      //프롬프트 취소했을 경우
    } else {
      //프롬프트에 입력한 글자가 4자리 숫자가 아닌 경우
      alert("4자리 숫자로 입력해주세요.");
    }
  }
});

// '확인' 버튼 클릭시
$(document).on("click", "#confirm-button", async function () {
  // 클릭된 버튼의 value 값에서 멤버카드 데이터의 ID를 가져옵니다.
  let docID = this.value;
  //프롬프트에 입력한 글자가 4자리 숫자인 경우
  if (/^\d{4}$/.test($("#password").val())) {
    // Firestore에서 해당 멤버의 데이터를 입력창에 적힌 값으로 업데이트 합니다.
    await updateDoc(doc(db, "members", docID), {
      image: $("#image-box").prop("src"),
      name: $("#name").val(),
      mbti: $("#mbti").val(),
      strength: $("#strength").val(),
      cowork: $("#cowork").val(),
      favorites: $("#favorites").val(),
      blog: $("#blog").val(),
      github: $("#github").val(),
      pw: $("#password").val(),
    });
    alert("수정 완료!");
    //팝업 창을 닫습니다.
    self.close();
    //메인 창을 새로고침 합니다.
    window.opener.location.reload();
  } else {
    //프롬프트에 입력한 글자가 4자리 숫자가 아닌 경우
    alert("4자리 숫자로 입력해주세요.");
  }
});

/************************   Delete   ************************/
// '삭제' 버튼 클릭시
$(document).on("click", "#delete-button", async function () {
  //삭제할 것인지 확인하는 confirm 창을 띄운다.
  const isDelete = window.confirm("삭제하시겠습니까?");
  if (isDelete) {
    //클릭된 버튼의 부모 요소에서 멤버의 doc ID를 가져옵니다.
    let docID = this.parentElement.id;
    //Firestore에서 해당 멤버의 데이터를 가져옵니다.
    let memberDoc = await getDoc(doc(db, "members", docID));
    let memberData = memberDoc.data();
    //비밀번호 확인 프롬프트 창을 엽니다.
    let inputPw = window.prompt("비밀번호를 입력해주세요.", "숫자 4자리");
    //프롬프트에 입력한 글자가 4자리 숫자인 경우
    if (/^\d{4}$/.test(inputPw)) {
      //프롬프트에 입력한 4자리 숫자가 비밀번호와 일치하는 경우
      if (inputPw == memberData["pw"]) {
        // Firestore에서 해당 멤버의 데이터를 삭제합니다.
        await deleteDoc(doc(db, "members", docID));
        alert("삭제되었습니다.");
        //메인 창을 새로고침 합니다.
        window.location.reload();
      } else {
        //프롬프트에 입력한 4자리 숫자가 비밀번호와 일치하는지 않는 경우
        alert("비밀번호가 일치하지 않습니다.");
      }
    } else if (inputPw == null) {
      //프롬프트 취소했을 경우
    } else {
      //프롬프트에 입력한 글자가 4자리 숫자가 아닌 경우
      alert("4자리 숫자로 입력해주세요.");
    }
  }
});

/************************   News Read   ************************/

// 헤드라인 뉴스 가져오는 함수
function fetchNews() {
  $.ajax({
    url: "https://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/news.json",
    headers: {
      "X-Naver-Client-Id": "jow8LlwZTVBX1mpePONJ",
      "X-Naver-Client-Secret": "uQU9cWqrBl",
    },
    data: {
      query: "스파르타 코딩 클럽", // 검색어를 '속보'로 지정하여 최신 속보를 가져옴
      display: 3, // 가져올 뉴스 개수를 지정
      start: 1, // 검색 시작 위치 지정
    },
    method: "GET",
    success: function (response) {
      const newsList = response.items;

      // HTML에 추가
      const newsListElement = $("#news-list");
      newsListElement.empty(); // 기존 내용을 비움
      // let first_fullstop = news.description.find(".");
      $.each(newsList, function (index, news) {
        let new_temp = `
        <li class="news-item" id="${news.originallink}">
          <h3 class="news-title">${news.title}</h3>
          <br>
          <p class="news-text">${news.description.substring(0, 70)} ...</p>
        </li>
        `;
        newsListElement.append(new_temp);
      });
    },
    error: function (xhr, status, error) {
      console.error("Error fetching news:", error);
    },
  });
}

//뉴스 기사를 클릭하면
$(document).on("click", ".news-item", (element) => {
  //해당 기사 링크로 이동
  window.location.href = $(element.currentTarget).attr("id");
});

/************************   Initiate   ************************/
function initPage() {
  //문서의 현재 상태가 로딩 중이 아니라면
  if (document.readyState !== "loading") {
    //바로 readDB 함수를 사용해 저장된 데이터를 불러와 웹페이지에 표시합니다.
    readDB();
  } else {
    //로딩 중이라면 DOM 컨텐츠 로딩을 모두 완료한 후, readDB 함수를 실행합니다.
    document.addEventListener("DOMContentLoaded", readDB);
  }
  //로컬스토리지에서 "menukey" 값을 가져옵니다.
  let menukey = localStorage.getItem("menukey");
  //menukey 값이 null이 아니라면
  if (menukey != null) {
    //로컬스토리지에서 가져온 menukey 값에 따라 어떤 메뉴탭을 열지 결정합니다.
    let membersElement = document.getElementById(menukey);
    tabContent(membersElement);
  } else {
    //do nothing
  }
}
// initPage 함수를 사용해 웹페이지가 새로고침 되었을 때
initPage();
