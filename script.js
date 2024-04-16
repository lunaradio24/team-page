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

/************************   Create  ************************/
// '멤버 추가' 버튼 클릭시
$(document).on("click", "#create-button", async function () {
  window.open(
    "newcard.html",
    "newCard",
    "width=500,height=500,left=200,top=200"
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
      introduce: $("#introduce").val(),
      mbti: $("#mbti").val(),
      time: Timestamp.now(),
      pw: $("#password").val(),
    };
    //입력한 멤버의 데이터를 Firestore에 저장합니다.
    await addDoc(collection(db, "members"), doc);
    alert("저장 완료!");
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
    let introduce = row["introduce"];
    let mbti = row["mbti"];

    //불러올 멤버카드 템플릿
    let temp_html = `
          <div class="col">
            <div class="card h-100">
              <img
                src="${image}"
                class="card-img-top"
                id="member-image"
              />
              <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">${introduce}</p>
              </div>
              <div class="card-footer">
                <small class="text-body-secondary">${mbti}</small>
              </div>
              <div class="mybuttons" id="${doc.id}">
                <button id="edit-button" class="btn btn-dark">수정</button>
                <button id="delete-button" class="btn btn-danger">삭제</button>
              </div>
            </div>
          </div>`;
    //카드 목록에 추가
    $("#card").append(temp_html);
  });
}

// 이미지 클릭시 새창으로 개인 페이지 열기
$(document).on("click", "#member-image", function () {
  window.open(
    "member.html",
    "member-image",
    "width=500,height=500,left=200,top=200"
  );
});

/************************   Update  ************************/
// '수정' 버튼 클릭시
$(document).on("click", "#edit-button", async function () {
  //클릭된 버튼의 부모 요소, 즉 div class="mybuttons"에서 멤버의 ID를 가져옵니다.
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
        "updateCard",
        "width=500,height=500,left=200,top=200"
      );
      //새 창을 열고 수정 전 데이터를 입력창에 표시합니다.
      openWin.onload = function () {
        const reader = new FileReader();
        openWin.document.querySelector(".image-box").src = memberData["image"];
        openWin.document.getElementById("name").value = memberData["name"];
        openWin.document.getElementById("introduce").value =
          memberData["introduce"];
        openWin.document.getElementById("mbti").value = memberData["mbti"];
        openWin.document.getElementById("password").value = memberData["pw"];
        openWin.document.getElementById("add-button").textContent = "확인";
        openWin.document.getElementById("add-button").value = docID;
        openWin.document.getElementById("add-button").id = "confirm-button";
      };
    } else {
      //프롬프트에 입력한 4자리 숫자가 비밀번호와 일치하는지 않는 경우
      alert("비밀번호가 일치하지 않습니다.");
    }
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
      introduce: $("#introduce").val(),
      mbti: $("#mbti").val(),
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
  //클릭된 버튼의 부모 요소, 즉 div class="mybuttons"에서 멤버의 ID를 가져옵니다.
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
      window.location.reload();
    } else {
      //프롬프트에 입력한 4자리 숫자가 비밀번호와 일치하는지 않는 경우
      alert("비밀번호가 일치하지 않습니다.");
    }
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
}
// initPage 함수를 사용해 웹페이지가 새로고침 되었을 때
initPage();
