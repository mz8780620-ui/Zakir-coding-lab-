const firebaseConfig = {
  apiKey: "AIzaSyAKJzdVBBSED8JEcS9dUJMh1dekfk5be4s",
  authDomain: "bangla-code-lab.firebaseapp.com",
  projectId: "bangla-code-lab",
  storageBucket: "bangla-code-lab.firebasestorage.app",
  messagingSenderId: "542355859550",
  appId: "1:542355859550:web:d304e461393948dcd16ccf",
  measurementId: "G-1FDQGT628S"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
let currentUser = null;
let chatUnsubscribe = null;

function doGoogleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  document.getElementById('authMsg').textContent = 'Authenticating...';
  auth.signInWithPopup(provider)
    .then(() => { document.getElementById('authMsg').textContent = ''; })
    .catch((error) => { 
      if (error.code === 'auth/popup-blocked') { auth.signInWithRedirect(provider); } 
      else { document.getElementById('authMsg').textContent = 'Access Denied: ' + error.message; }
    });
}

auth.onAuthStateChanged(user => {
  currentUser = user;
  if (user) {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    startChatListener();
  } else {
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
    if (chatUnsubscribe) { chatUnsubscribe(); chatUnsubscribe = null; }
  }
});

function startChatListener() {
  const chatBox = document.getElementById('chatMessages');
  if (chatUnsubscribe) chatUnsubscribe();
  chatUnsubscribe = db.collection('cyber_chat').orderBy('timestamp', 'asc').limitToLast(100)
    .onSnapshot(snap => {
      if (snap.empty) {
        chatBox.innerHTML = '<div class="log" style="color:#888;">[SYSTEM]: No logs found. Be the first to transmit.</div>';
        return;
      }
      chatBox.innerHTML = snap.docs.map(doc => {
        const d = doc.data();
        const isMine = d.senderId === currentUser.uid;
        const time = d.timestamp ? d.timestamp.toDate().toLocaleTimeString('en-US', {hour12: false}) : '00:00:00';
        return `<div class="log ${isMine ? 'mine' : ''}">
          <span class="time">[${time}]</span>
          <span class="user">${isMine ? 'You' : escapeHtml(d.senderName)}:</span>
          <span class="text">${escapeHtml(d.text)}</span>
        </div>`;
      }).join('');
      chatBox.scrollTop = chatBox.scrollHeight;
    });
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text || !currentUser) return;
  input.value = ''; 
  try {
    await db.collection('cyber_chat').add({
      text: text,
      senderName: currentUser.displayName || 'Unknown_Agent',
      senderId: currentUser.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) { alert('Transmission failed: ' + e.message); }
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }