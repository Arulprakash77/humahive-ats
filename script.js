// ============= 1. IMPORT FIREBASE SDK (v12 modules) =============
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// ============= 2. FIREBASE CONFIG & INIT =============
const firebaseConfig = {
  apiKey: "AIzaSyD-WcE_anEIZ3lllvcZKR7DLeijeR7ervE",
  authDomain: "humahive-ats-b7770.firebaseapp.com",
  projectId: "humahive-ats-b7770",
  storageBucket: "humahive-ats-b7770.firebasestorage.app",
  messagingSenderId: "730732275686",
  appId: "1:730732275686:web:61326dbd81d9aeb3d71827",
  measurementId: "G-0GXZJX9BXR",
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// ============= 3. DOM ELEMENT REFERENCES =============
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

// ============= 4. AUTH STATE LISTENER =============
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Not logged in
    appPage.style.display = "none";
    loginPage.style.display = "block";
    return;
  }

  // Logged in → fetch role from Firestore
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    loginError.textContent = "User record not found in Firestore.";
    await signOut(auth);
    return;
  }

  const data = snap.data();
  currentUserRole = data.role;

  currentUserInfo.textContent = `${currentUserRole.toUpperCase()} – ${data.email}`;

  loginPage.style.display = "none";
  appPage.style.display = "block";

  // Start real-time listeners
  subscribePositions();
  subscribeCandidates();
});

// ============= 5. LOGIN & LOGOUT HANDLERS =============
loginBtn.addEventListener("click", async () => {
  loginError.textContent = "";

  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();
  const roleSelected = loginRole.value;

  if (!email || !password) {
    loginError.textContent = "Please enter email and password.";
    return;
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    // Check role from Firestore
    const userDoc = await getDoc(doc(db, "users", cred.user.uid));
    if (!userDoc.exists()) throw new Error("User record missing.");
    const data = userDoc.data();

    if (data.role !== roleSelected) {
      throw new Error("You are not allowed to log in with this role.");
    }

    // onAuthStateChanged will handle UI
  } catch (err) {
    console.error(err);
    loginError.textContent = err.message;
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  loginEmail.value = "";
  loginPassword.value = "";
});

// ============= 6. REAL-TIME POSITIONS =============
function subscribePositions() {
  const q = query(
    collection(db, "positions"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {
    positionsList.innerHTML = "";
    candidatePositionSelect.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const pos = docSnap.data();

      // List item for positions
      const li = document.createElement("li");
      li.textContent = pos.title || "(Untitled position)";
      positionsList.appendChild(li);

      // Option for candidate form
      const opt = document.createElement("option");
      opt.value = docSnap.id;
      opt.textContent = pos.title || "(Untitled)";
      candidatePositionSelect.appendChild(opt);
    });
  });
}

createPositionForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = positionTitle.value.trim();
  if (!title) return;

  try {
    await addDoc(collection(db, "positions"), {
      title,
      status: "open",
      createdAt: serverTimestamp(),
    });
    positionTitle.value = "";
  } catch (err) {
    console.error("Error adding position:", err);
  }
});

// ============= 7. REAL-TIME CANDIDATES =============
function subscribeCandidates() {
  const q = query(
    collection(db, "candidates"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {
    candidatesList.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const c = docSnap.data();
      const li = document.createElement("li");
      li.textContent = `${c.name} – ${c.email} (${c.positionTitle || "No position"})`;
      candidatesList.appendChild(li);
    });
  });
}

createCandidateForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = candidateName.value.trim();
  const email = candidateEmail.value.trim();
  const positionId = candidatePositionSelect.value || null;

  if (!name || !email) return;

  let positionTitle = null;
  try {
    if (positionId) {
      const posSnap = await getDoc(doc(db, "positions", positionId));
      if (posSnap.exists()) {
        positionTitle = posSnap.data().title || null;
      }
    }

    await addDoc(collection(db, "candidates"), {
      name,
      email,
      positionId,
      positionTitle,
      status: "new",
      createdAt: serverTimestamp(),
    });

    candidateName.value = "";
    candidateEmail.value = "";
  } catch (err) {
    console.error("Error adding candidate:", err);
  }
});
