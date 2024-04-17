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

/************************   NavBars  ************************/
// 메뉴 클릭했을 때 보여지는 컨텐츠 화면 전환하는 함수
function tabContent(element) {
  //클릭한 메뉴가 'Join' 이면
  if (element.textContent == "Join") {
    //모든 컨텐츠 숨기기
    $(".content").hide();
    //members 컴텐츠 보이기
    $("#membersContent").show();
  } else {
    //클릭한 메뉴가 'Join'이 아니라면
    //모든 컨텐츠 숨기기
    $(".content").hide();
    //클릭된 링크의 메뉴 id 가져오기
    let menuID = element.id;
    //보여줄 컨텐츠 id 구하기
    let targetId = menuID + "Content";
    //해당하는 컨텐츠 보이기
    $("#" + targetId).show();
  }
}
// 모든 메뉴 링크에 클릭 이벤트 추가
$(document).on("click", ".nav-link", function (event) {
  //클릭한 메뉴가 'Join'이 아니라면
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
  //로컬스토리지에 저장된 menukey 값을 "team"으로 초기화합니다.
  localStorage.setItem("menukey", "team");
  //페이지를 새로고침 합니다.
  window.location.reload();
});

/************************   Create  ************************/
// 메뉴에서 'Join' 클릭시
$(document).on("click", "#join", async function () {
  window.open(
    "newcard.html",
    "newCard",
    "width=520,height=670,left=200,top=100"
  );
});

let fileDOM = document.querySelector("#file");
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
// 'Upload image' 버튼 클릭하여 새 파일을 선택하면
fileDOM?.addEventListener("change", function () {
  //getImage 함수를 실행하여 선택한 이미지 파일의 데이터 url을 이미지 preview 요소의 src에 넣어줍니다.
  getImage();
});

// 팝업창 '추가' 버튼 클릭시
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

/************************   Read  ************************/
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
    let card_html = `
          <div class="col-card">
            <div class="card h-100">
              <img
                src="${image}"
                class="card-img-top"
                id="${doc.id}"
              />
              <div class="card-body">
                <h5 class="card-title">${name}</h5>
              </div>
              <div class="card-footer">
                <small class="text-body-secondary">${mbti}</small>
              </div>
            </div>
          </div>`;
    //카드 목록에 추가
    $("#card").append(card_html);

    //불러올 멤버 정보 템플릿
    let member_html = `
    <div class="modal" id="${doc.id}Modal">
      <section class="memberBody" id="about">
        <div class="container">
          <div class="row align-items-center flex-row-reverse">
            <div class="col-lg-6">
              <div class="about-text go-to">
                <div class="row about-list">
                  <div class="col-md-6">
                    <div class="media">
                      <label>이름</label>
                      <p>${name}</p>
                    </div>
                    <div class="media">
                      <label>Mbti</label>
                      <p>${mbti}</p>
                    </div>
                    <div class="media">
                      <label>장점</label>
                      <p>${strength}</p>
                    </div>
                    <div class="media">
                      <label>협업 스타일</label>
                      <p>${cowork}</p>
                    </div>
                    <div class="media">
                      <label>좋아하는 것</label>
                      <p>${favorites}</p>
                    </div>
                  </div>
                  <div class="memberEditButtons" id="${doc.id}">
                    <button id="edit-button" class="btn btn-dark">수정</button>
                    <button id="delete-button" class="btn btn-danger">삭제</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-6" id="memberImgGroup">
              <div class="about-avatar">
                <img class="memberImg" src="${image}">
                <div class="member-sns-icon-group">
                  <button class="${github}" id="member-github-icon"></button>
                  <button class="${blog}" id="member-blog-icon"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    `
    //modalGroup 목록에 추가
    $("#modalGroup").append(member_html);
  });
}

// 이미지 클릭시 새창으로 개인 페이지 열기
$(document).on("click", ".card-img-top", async function () {
  $("#" + this.id + "Modal").css("display", "block");
  sessionStorage.setItem("modalID", "#" + this.id + "Modal");
});

// 모달 닫기 버튼 및 모달 외부 클릭 시 이벤트 처리
$(".close").click(function () {
  $(sessionStorage.getItem("modalID")).css("display", "none");
  sessionStorage.removeItem("modalID");
});

$(window).click(function (event) {
  if (event.target == $(sessionStorage.getItem("modalID"))[0]) {
    $(sessionStorage.getItem("modalID")).css("display", "none");
    sessionStorage.removeItem("modalID");
  }
});

/************************   Update  ************************/
// '수정' 버튼 클릭시
$(document).on("click", "#edit-button", async function () {
  //클릭된 버튼의 부모 요소, 즉 div class="memberEditButtons"에서 멤버의 ID를 가져옵니다.
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
        "newcard.html",
        "_blank",
        "width=520,height=670,left=200,top=100"
      );
      //새 창을 열고 수정 전 데이터를 입력창에 표시합니다.
      openWin.onload = function () {
        openWin.document.getElementById("image-box").src = memberData["image"];
        openWin.document.getElementById("name").value = memberData["name"];
        openWin.document.getElementById("mbti").value = memberData["mbti"];
        openWin.document.getElementById("blog").value = memberData["blog"];
        openWin.document.getElementById("github").value = memberData["github"];
        openWin.document.getElementById("strength").value = memberData["strength"];
        openWin.document.getElementById("cowork").value = memberData["cowork"];
        openWin.document.getElementById("favorites").value = memberData["favorites"];
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
      time: Timestamp.now(),
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

/************************   Delete  ************************/
// '삭제' 버튼 클릭시
$(document).on("click", "#delete-button", async function () {
  //클릭된 버튼의 부모 요소, 즉 div class="memberEditButtons"에서 멤버의 ID를 가져옵니다.
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
});

/************************   Initiate  ************************/
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
