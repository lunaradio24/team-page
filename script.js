// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
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

// 기록하기 버튼 클릭시
$("#postingbtn").click(async function () {
  let doc = {
    image: $("#image").val(),
    title: $("#title").val(),
    content: $("#content").val(),
    date: $("#date").val(),
  };
  await addDoc(collection(db, "albums"), doc);
  alert("저장 완료!");
  window.location.reload();
});

// '멤버 추가' 버튼 클릭시
let popup_window;
$("#savebtn").click(async function () {
  popup_window = window.open(
    "a.html",
    "name_a",
    "width=500,height=500,left=200,top=200"
  );
});

// 팝업창 '닫기' 버튼 클릭시
$("#closebtn").click(async function () {
  self.close();
});

$("#member-image").click(async function () {
  //   window.open("member.html", "_blank", "width=500,height=500,left=200,top=200");
  console.log("hi");
  $(location).attr("href", "member.html");
});

// Read (데이터 불러오기)
let docs = await getDocs(collection(db, "albums"));
docs.forEach((doc) => {
  let row = doc.data();

  let image = row["image"];
  let title = row["title"];
  let content = row["content"];
  let date = row["date"];

  let temp_html = `
    <div class="col">
      <div class="card h-100">
        <img
          src="${image}"
          class="card-img-top"
          alt="..."
          id="member-image"
        />
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">${content}</p>
        </div>
        <div class="card-footer">
          <small class="text-body-secondary">${date}</small>
        </div>
      </div>
    </div>`;
  $("#card").append(temp_html);
});
