// ---------- 1. IMPORT FIREBASE MODULES ----------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getAnalytics
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
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
  where,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// ---------- 2. FIREBASE CONFIG ----------
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

// ---------- 3. DOM ELEMENTS ----------
const loginPage = document.getElementById("loginPage");
const appPage = document.getElementById("appPage");

const loginRole = document.getElementById("loginRole");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

const currentUserInfo = document.getElementById("currentUserInfo");
const logoutBtn = document.getElementById("logoutBtn");

const statPositions = document.getElementById("statPositions");
const statCandidates = document.getElementById("statCandidates");
const statClients = document.getElementById("statClients");

const createPositionForm = document.getElementById("createPositionForm");
const positionTitle = document.getElementById("positionTitle");
const positionClientSelect = document.getElementById("positionClientSelect");
const positionsList = document.getElementById("positionsList");

const createCandidateForm = document.getElementById("createCandidateForm");
const candidateName = document.getElementById("candidateName");
const candidateEmail = document.getElementById("candidateEmail");
const candidatePositionSelect = document.getElementById("candidatePositionSelect");
const candidatesList = document.getElementById("candidatesList");

const createClientForm = document.getElementById("createClientForm");
const clientName = document.getElementById("clientName");
const clientCode = document.getElementById("clientCode");
const clientsList = document.getElementById("clientsList");

const tabButtons = document.querySelectorAll(".tab-btn");
const tabs = document.querySelectorAll(".tab");

let currentUser = null;       // Firebase user object
let currentUserRole = null;   // "superAdmin" | "userAdmin" | "client"
let currentClientId = null;   // for client role

// ---------- 4. TABS ----------
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    tabs.forEach((t) => t.classList.remove("active"));

    btn.classList.add("active");
    const targetId = btn.dataset.tab;
    document.getElementById(targetId).classList.add("active");
  });
});

// ---------- 5. AUTH STATE ----------
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    currentUser = null;
    currentUserRole = null;
    currentClientId = null;
    appPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
    return;
  }

  currentUser = user;

  // Fetch role info from Firestore
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    loginError.textContent = "User record not found in database.";
    await signOut(auth);
    return;
  }

  const data = snap.data();
  currentUserRole = data.role;
  currentClientId = data.clientId || null;

  currentUserInfo.textContent =
    `${currentUserRole.toUpperCase()} – ${data.email || user.email}`;

  loginPage.classList.add("hidden");
  appPage.classList.remove("hidden");

  applyRoleVisibility();
  startRealtimeSubscriptions();
});

// ---------- 6. LOGIN ----------
loginBtn.addEventListener("click", async () => {
  loginError.textContent = "";

  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();
  const selectedRole = loginRole.value;

  if (!email || !password) {
    loginError.textContent = "Enter email and password.";
    return;
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, "users", cred.user.uid));
    if (!userDoc.exists()) throw new Error("User record missing in Firestore.");
    const data = userDoc.data();

    if (data.role !== selectedRole) {
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

// ---------- 7. ROLE-BASED VISIBILITY ----------
function applyRoleVisibility() {
  document.querySelectorAll(".role-guard").forEach((el) => {
    const allowed = (el.dataset.roles || "").split(",");
    if (!allowed.includes(currentUserRole)) {
      el.closest(".tab")?.classList.add("hidden-section");
    } else {
      el.closest(".tab")?.classList.remove("hidden-section");
    }
  });

  // Hide Clients tab for non superAdmin
  if (currentUserRole !== "superAdmin") {
    document.querySelector('[data-tab="clientsTab"]').style.display = "none";
  } else {
    document.querySelector('[data-tab="clientsTab"]').style.display = "";
  }
}

// ---------- 8. REALTIME SUBSCRIPTIONS ----------
let unsubPositions = null;
let unsubCandidates = null;
let unsubClients = null;

function startRealtimeSubscriptions() {
  // Clients (for dropdowns + stats)
  const clientsQ = query(collection(db, "clients"), orderBy("createdAt", "desc"));
  unsubClients = onSnapshot(clientsQ, (snap) => {
    clientsList.innerHTML = "";
    positionClientSelect.innerHTML = '<option value="">Assign to client (optional)</option>';

    let count = 0;
    snap.forEach((docSnap) => {
      const c = docSnap.data();
      count++;

      // list
      const li = document.createElement("li");
      li.innerHTML = `<span>${c.name} <span class="badge">${c.code}</span></span>`;
      clientsList.appendChild(li);

      // dropdown option
      const opt = document.createElement("option");
      opt.value = docSnap.id;
      opt.textContent = `${c.name} (${c.code})`;
      positionClientSelect.appendChild(opt);
    });
    statClients.textContent = count;
  });

  // Positions
  let positionsQuery;
  if (currentUserRole === "client" && currentClientId) {
    positionsQuery = query(
      collection(db, "positions"),
      where("clientId", "==", currentClientId),
      orderBy("createdAt", "desc")
    );
  } else {
    positionsQuery = query(
      collection(db, "positions"),
      orderBy("createdAt", "desc")
    );
  }

  unsubPositions = onSnapshot(positionsQuery, (snap) => {
    positionsList.innerHTML = "";
    candidatePositionSelect.innerHTML = '<option value="">Select position</option>';

    let count = 0;
    snap.forEach((docSnap) => {
      const p = docSnap.data();
      count++;

      const li = document.createElement("li");
      li.innerHTML = `
        <span>${p.title} ${p.clientName ? `<span class="badge">${p.clientName}</span>` : ""}</span>
        <span class="badge">${p.status || "open"}</span>
      `;
      positionsList.appendChild(li);

      const opt = document.createElement("option");
      opt.value = docSnap.id;
      opt.textContent = p.title;
      candidatePositionSelect.appendChild(opt);
    });
    statPositions.textContent = count;
  });

  // Candidates
  let candidatesQuery;
  if (currentUserRole === "client" && currentClientId) {
    candidatesQuery = query(
      collection(db, "candidates"),
      where("clientId", "==", currentClientId),
      orderBy("createdAt", "desc")
    );
  } else {
    candidatesQuery = query(
      collection(db, "candidates"),
      orderBy("createdAt", "desc")
    );
  }

  unsubCandidates = onSnapshot(candidatesQuery, (snap) => {
    candidatesList.innerHTML = "";
    let count = 0;

    snap.forEach((docSnap) => {
      const c = docSnap.data();
      count++;
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${c.name} – ${c.email} ${c.positionTitle ? `<span class="badge">${c.positionTitle}</span>` : ""}</span>
        <span class="badge">${c.status || "new"}</span>
      `;
      candidatesList.appendChild(li);
    });

    statCandidates.textContent = count;
  });
}

// ---------- 9. CREATE DOCS ----------
createClientForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (currentUserRole !== "superAdmin") return;

  const name = clientName.value.trim();
  const code = clientCode.value.trim();
  if (!name || !code) return;

  await addDoc(collection(db, "clients"), {
    name,
    code,
    createdAt: serverTimestamp(),
  });

  clientName.value = "";
  clientCode.value = "";
});

createPositionForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (currentUserRole === "client") return; // client cannot create positions

  const title = positionTitle.value.trim();
  const clientId = positionClientSelect.value || null;

  if (!title) return;

  let clientName = null;
  if (clientId) {
    const snap = await getDoc(doc(db, "clients", clientId));
    if (snap.exists()) clientName = snap.data().name || null;
  }

  await addDoc(collection(db, "positions"), {
    title,
    status: "open",
    clientId,
    clientName,
    createdAt: serverTimestamp(),
  });

  positionTitle.value = "";
  positionClientSelect.value = "";
});

createCandidateForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = candidateName.value.trim();
  const email = candidateEmail.value.trim();
  const positionId = candidatePositionSelect.value || null;
  if (!name || !email) return;

  let positionTitle = null;
  let clientId = null;
  let clientName = null;

  if (positionId) {
    const snap = await getDoc(doc(db, "positions", positionId));
    if (snap.exists()) {
      const p = snap.data();
      positionTitle = p.title || null;
      clientId = p.clientId || null;
      clientName = p.clientName || null;
    }
  }

  await addDoc(collection(db, "candidates"), {
    name,
    email,
    positionId,
    positionTitle,
    clientId,
    clientName,
    status: "new",
    createdAt: serverTimestamp(),
  });

  candidateName.value = "";
  candidateEmail.value = "";
  candidatePositionSelect.value = "";
});
