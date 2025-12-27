<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyD-WcE_anEIZ3lllvcZKR7DLeijeR7ervE",
    authDomain: "humahive-ats-b7770.firebaseapp.com",
    projectId: "humahive-ats-b7770",
    storageBucket: "humahive-ats-b7770.firebasestorage.app",
    messagingSenderId: "730732275686",
    appId: "1:730732275686:web:61326dbd81d9aeb3d71827",
    measurementId: "G-0GXZJX9BXR"
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>// 1) Firebase init
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// 2) DOM elements
const loginPage = document.getElementById("loginPage");
const appPage = document.getElementById("appPage");

const loginRole = document.getElementById("loginRole");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

const currentUserInfo = document.getElementById("currentUserInfo");
const logoutBtn = document.getElementById("logoutBtn");

const createPositionForm = document.getElementById("createPositionForm");
const positionTitle = document.getElementById("positionTitle");
const positionsList = document.getElementById("positionsList");

const createCandidateForm = document.getElementById("createCandidateForm");
const candidateName = document.getElementById("candidateName");
const candidateEmail = document.getElementById("candidateEmail");
const candidatePositionSelect = document.getElementById("candidatePositionSelect");
const candidatesList = document.getElementById("candidatesList");

let currentUserRole = null;

// 3) Auth: email + password
loginBtn.addEventListener("click", async () => {
  loginError.textContent = "";
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();
  const role = loginRole.value;

  if (!email || !password) {
    loginError.textContent = "Enter email and password.";
    return;
  }

  try {
    const cred = await auth.signInWithEmailAndPassword(email, password);

    // Check user role from Firestore
    const userDoc = await db.collection("users").doc(cred.user.uid).get();
    if (!userDoc.exists) throw new Error("User not found in database");

    const data = userDoc.data();
    if (data.role !== role) {
      throw new Error("You are not authorized for this role.");
    }

    currentUserRole = data.role;
    currentUserInfo.textContent = `${data.role.toUpperCase()} – ${data.email}`;

    loginPage.style.display = "none";
    appPage.style.display = "block";

    subscribePositions();
    subscribeCandidates();
  } catch (err) {
    console.error(err);
    loginError.textContent = err.message;
  }
});

logoutBtn.addEventListener("click", async () => {
  await auth.signOut();
  appPage.style.display = "none";
  loginPage.style.display = "block";
  loginEmail.value = "";
  loginPassword.value = "";
});

// 4) Real‑time positions
function subscribePositions() {
  db.collection("positions")
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      positionsList.innerHTML = "";
      candidatePositionSelect.innerHTML = "";

      snapshot.forEach((doc) => {
        const pos = doc.data();
        const li = document.createElement("li");
        li.textContent = pos.title;
        positionsList.appendChild(li);

        const opt = document.createElement("option");
        opt.value = doc.id;
        opt.textContent = pos.title;
        candidatePositionSelect.appendChild(opt);
      });
    });
}

createPositionForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!positionTitle.value.trim()) return;

  await db.collection("positions").add({
    title: positionTitle.value.trim(),
    status: "open",
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  positionTitle.value = "";
});

// 5) Real‑time candidates
function subscribeCandidates() {
  db.collection("candidates")
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      candidatesList.innerHTML = "";
      snapshot.forEach((doc) => {
        const c = doc.data();
        const li = document.createElement("li");
        li.textContent = `${c.name} – ${c.email} (${c.positionTitle || "No position"})`;
        candidatesList.appendChild(li);
      });
    });
}

createCandidateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!candidateName.value.trim() || !candidateEmail.value.trim()) return;

  const positionId = candidatePositionSelect.value || null;
  let positionTitle = null;
  if (positionId) {
    const pos = await db.collection("positions").doc(positionId).get();
    positionTitle = pos.exists ? pos.data().title : null;
  }

  await db.collection("candidates").add({
    name: candidateName.value.trim(),
    email: candidateEmail.value.trim(),
    positionId,
    positionTitle,
    status: "new",
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });

  candidateName.value = "";
  candidateEmail.value = "";
});

