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
  document.getElementById('authMsg').textContent = 'লগইন হচ্ছে...';
  auth.signInWithPopup(provider)
    .then(() => { document.getElementById('authMsg').textContent = ''; })
    .catch((error) => { 
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/operation-not-supported-in-this-environment') {
        auth.signInWithRedirect(provider);
      } else {
        document.getElementById('authMsg').textContent = 'লগইন ব্যর্থ: ' + error.message; 
      }
    });
}
auth.getRedirectResult().catch((error) => { if (error.code) document.getElementById('authMsg').textContent = 'লগইন ব্যর্থ: ' + error.message; });
async function doLogout() { if (confirm('লগআউট করবেন?')) await auth.signOut(); }

auth.onAuthStateChanged(user => {
  currentUser = user;
  if (user) {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('app').classList.add('show');
    document.getElementById('accName').textContent = user.displayName || 'ইউজার';
    document.getElementById('accEmail').textContent = user.email;
    setTimeout(() => Object.values(editors).forEach(e => e && e.refresh()), 100);
    loadProjects();
    loadCommunity();
    startChatListener();
  } else {
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('app').classList.remove('show');
    if (chatUnsubscribe) { chatUnsubscribe(); chatUnsubscribe = null; }
  }
});

const defaults = {
  html: '<!DOCTYPE html>\n<html>\n<body style="font-family:system-ui;padding:16px;background:#fafafa">\n  <h1 style="color:#0e639c">Hello, JS Zakirhub! 👋</h1>\n  <p>HTML/CSS/JS লিখে Run চাপো।</p>\n</body>\n</html>',
  css: 'body { font-family: system-ui; padding: 16px; }\nh1 { color: #0e639c; }',
  js: "console.log('JS ready ✅');",
  py: '# Python 3 (Pyodide)\nfor i in range(5):\n    print("Hello", i)'
};
const editors = {};
function makeEditor(id, mode, key) {
  const ed = CodeMirror(document.getElementById(id), {
    value: defaults[key], mode: mode, theme: 'dracula', lineNumbers: true, lineWrapping: true, autoCloseBrackets: true, indentUnit: 2, tabSize: 2
  });
  editors[key] = ed;
}
makeEditor('htmlEditor', 'htmlmixed', 'html');
makeEditor('cssEditor', 'css', 'css');
makeEditor('jsEditor', 'javascript', 'js');
makeEditor('pyEditor', 'python', 'py');

document.querySelectorAll('#mainTabs .tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('#mainTabs .tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + t.dataset.panel).classList.add('active');
    setTimeout(() => Object.values(editors).forEach(e => e && e.refresh()), 60);
    if (t.dataset.panel === 'community') loadCommunity();
    if (t.dataset.panel === 'chat') scrollToBottom();
  });
});

const paneIds = { html: 'htmlEditor', css: 'cssEditor', js: 'jsEditor', preview: 'previewPane' };
document.querySelectorAll('#webSubtabs .subtab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('#webSubtabs .subtab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    Object.values(paneIds).forEach(id => document.getElementById(id).classList.remove('active'));
    document.getElementById(paneIds[t.dataset.ed]).classList.add('active');
    setTimeout(() => { editors.html.refresh(); editors.css.refresh(); editors.js.refresh(); }, 60);
  });
});
function showPane(name) { const t = document.querySelector('#webSubtabs .subtab[data-ed="' + name + '"]'); if (t) t.click(); }

function startChatListener() {
  const chatBox = document.getElementById('chatMessages');
  if (chatUnsubscribe) chatUnsubscribe();
  chatUnsubscribe = db.collection('public_chat').orderBy('timestamp', 'asc').limitToLast(50)
    .onSnapshot(snap => {
      if (snap.empty) { chatBox.innerHTML = '<div class="empty">এখনো কোনো মেসেজ নেই। আপনিই প্রথম কথা বলুন!</div>'; return; }
      chatBox.innerHTML = snap.docs.map(doc => {
        const d = doc.data();
        const isMine = d.senderId === currentUser.uid;
        const time = d.timestamp ? d.timestamp.toDate().toLocaleTimeString('bn-BD', {hour: '2-digit', minute:'2-digit'}) : '';
        return `<div class="message ${isMine ? 'mine' : 'others'}">
          ${!isMine ? `<div class="sender">${escapeHtml(d.senderName)} • ${time}</div>` : ''}
          ${escapeHtml(d.text)}
          ${isMine ? `<div class="sender" style="text-align:right; font-size:10px; color:#ccc">${time}</div>` : ''}
        </div>`;
      }).join('');
      scrollToBottom();
    });
}
function scrollToBottom() { const chatBox = document.getElementById('chatMessages'); chatBox.scrollTop = chatBox.scrollHeight; }
async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = ''; 
  try {
    await db.collection('public_chat').add({
      text: text, senderName: currentUser.displayName || 'Anonymous',
      senderId: currentUser.uid, timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) { alert('মেসেজ পাঠানো যায়নি: ' + e.message); }
}

function updatePreview() {
  const doc = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>' + editors.css.getValue() + '</style></head><body>' + editors.html.getValue() + '<scr' + 'ipt>' + editors.js.getValue() + '</scr' + 'ipt></body></html>';
  document.getElementById('preview').srcdoc = doc;
}
function runWeb() { updatePreview(); showPane('preview'); }
function clearWeb() {
  const active = document.querySelector('#webSubtabs .subtab.active');
  if (!active || active.dataset.ed === 'preview') return;
  if (confirm('এই ট্যাবটা খালি করবো?')) editors[active.dataset.ed].setValue('');
}

let pyodideInstance = null, pyodideLoading = false;
async function runPython() {
  const out = document.getElementById('pyOutput'); const hint = document.getElementById('pyHint'); out.textContent = '';
  try {
    if (!pyodideInstance) {
      if (!pyodideLoading) { pyodideLoading = true; hint.textContent = 'Pyodide লোড হচ্ছে (~১০MB)...'; }
      pyodideInstance = await loadPyodide(); hint.textContent = '✅ Python প্রস্তুত';
    }
    pyodideInstance.setStdout({ batched: s => { out.textContent += s + '\n'; } });
    pyodideInstance.setStderr({ batched: s => { out.textContent += s + '\n'; } });
    const result = await pyodideInstance.runPythonAsync(editors.py.getValue());
    if (result !== undefined && result !== null) out.textContent += String(result) + '\n';
  } catch (e) { out.textContent += '\n❌ ' + (e.message || e); }
}
function clearPy() { if (confirm('Python কোড খালি করবো?')) { editors.py.setValue(''); document.getElementById('pyOutput').textContent = ''; } }

function openSaveModal() { if (!currentUser) return; document.getElementById('saveModal').classList.add('show'); document.getElementById('projName').value = ''; setTimeout(() => document.getElementById('projName').focus(), 100); }
function closeSaveModal() { document.getElementById('saveModal').classList.remove('show'); }

async function saveProject() {
  const name = document.getElementById('projName').value.trim();
  if (!name) return alert('নাম দিন');
  if (!currentUser) return;
  closeSaveModal();
  const status = document.getElementById('saveStatus'); status.textContent = 'সেভ হচ্ছে...';
  try {
    await db.collection('users').doc(currentUser.uid).collection('projects').add({
      name: name, html: editors.html.getValue(), css: editors.css.getValue(), js: editors.js.getValue(), py: editors.py.getValue(), updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    status.textContent = '✅ সেভ হয়েছে'; setTimeout(() => status.textContent = '', 2000); loadProjects();
  } catch (e) { status.textContent = '❌ ' + e.message; }
}

async function loadProjects() {
  if (!currentUser) return;
  const list = document.getElementById('projectsList'); list.innerHTML = '<div class="empty">লোড হচ্ছে...</div>';
  try {
    const snap = await db.collection('users').doc(currentUser.uid).collection('projects').orderBy('updatedAt', 'desc').get();
    if (snap.empty) { list.innerHTML = '<div class="empty">📭 কোনো প্রজেক্ট নেই।<br>💾 সেভ বাটনে চাপো।</div>'; return; }
    list.innerHTML = snap.docs.map(d => {
      const data = d.data();
      const ts = data.updatedAt ? data.updatedAt.toDate().toLocaleString('bn-BD') : '—';
      return `<div class="project-card">
        <div class="info"><div class="name">${escapeHtml(data.name)}</div><div class="time">${ts}</div></div>
        <div class="actions">
          <button class="open" onclick="openProject('${d.id}')">খুলুন</button>
          <button class="share" onclick="shareProject('${d.id}')">🌍 শেয়ার</button>
          <button class="del" onclick="deleteProject('${d.id}')">🗑</button>
        </div>
      </div>`;
    }).join('');
  } catch (e) { list.innerHTML = '<div class="empty">❌ ' + e.message + '</div>'; }
}

async function openProject(id) {
  if (!currentUser) return;
  try {
    const doc = await db.collection('users').doc(currentUser.uid).collection('projects').doc(id).get();
    if (!doc.exists) return;
    const d = doc.data();
    editors.html.setValue(d.html || ''); editors.css.setValue(d.css || ''); editors.js.setValue(d.js || ''); editors.py.setValue(d.py || '');
    updatePreview(); document.querySelector('#mainTabs .tab[data-panel="web"]').click();
    document.getElementById('saveStatus').textContent = '✅ "' + d.name + '" লোড হয়েছে'; setTimeout(() => document.getElementById('saveStatus').textContent = '', 2500);
  } catch (e) { alert('লোড ব্যর্থ: ' + e.message); }
}

async function deleteProject(id) {
  if (!confirm('এই প্রজেক্টটা মুছে ফেলবেন?')) return;
  if (!currentUser) return;
  try { await db.collection('users').doc(currentUser.uid).collection('projects').doc(id).delete(); loadProjects(); } catch (e) { alert('মুছতে পারিনি: ' + e.message); }
}

async function shareProject(id) {
  if (!confirm('আপনি কি এই প্রজেক্টটি কমিউনিটিতে শেয়ার করতে চান? অন্যরা এটি দেখতে ও শিখতে পারবে।')) return;
  try {
    const doc = await db.collection('users').doc(currentUser.uid).collection('projects').doc(id).get();
    const d = doc.data();
    await db.collection('public_projects').add({
      name: d.name, html: d.html || '', css: d.css || '', js: d.js || '', py: d.py || '',
      authorName: currentUser.displayName || 'Anonymous', authorId: currentUser.uid, sharedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert('✅ সফলভাবে কমিউনিটিতে শেয়ার হয়েছে!'); loadCommunity();
  } catch (e) { alert('শেয়ার ব্যর্থ: ' + e.message); }
}

async function loadCommunity() {
  const list = document.getElementById('communityList'); list.innerHTML = '<div class="empty">কমিউনিটি লোড হচ্ছে...</div>';
  try {
    const snap = await db.collection('public_projects').orderBy('sharedAt', 'desc').limit(50).get();
    if (snap.empty) { list.innerHTML = '<div class="empty">📭 এখনো কেউ কোনো প্রজেক্ট শেয়ার করেনি।<br>আপনি প্রথম শেয়ার করুন!</div>'; return; }
    list.innerHTML = snap.docs.map(d => {
      const data = d.data();
      const ts = data.sharedAt ? data.sharedAt.toDate().toLocaleString('bn-BD') : '—';
      return `<div class="project-card">
        <div class="info"><div class="name">${escapeHtml(data.name)}</div><div class="author">👤 ${escapeHtml(data.authorName)}</div><div class="time">${ts}</div></div>
        <div class="actions"><button class="open" onclick="openCommunityProject('${d.id}')">👁 দেখুন ও লোড</button></div>
      </div>`;
    }).join('');
  } catch (e) { list.innerHTML = '<div class="empty">❌ ' + e.message + '</div>'; }
}

async function openCommunityProject(id) {
  try {
    const doc = await db.collection('public_projects').doc(id).get();
    if (!doc.exists) return;
    const d = doc.data();
    editors.html.setValue(d.html || ''); editors.css.setValue(d.css || ''); editors.js.setValue(d.js || ''); editors.py.setValue(d.py || '');
    updatePreview(); document.querySelector('#mainTabs .tab[data-panel="web"]').click();
    document.getElementById('saveStatus').textContent = '✅ "' + d.name + '" লোড হয়েছে (কমিউনিটি)'; setTimeout(() => document.getElementById('saveStatus').textContent = '', 3000);
  } catch (e) { alert('লোড ব্যর্থ: ' + e.message); }
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function jsonFormat() { try { document.getElementById('jsonOut').value = JSON.stringify(JSON.parse(document.getElementById('jsonIn').value), null, 2); } catch (e) { document.getElementById('jsonOut').value = '❌ ' + e.message; } }
function jsonMinify() { try { document.getElementById('jsonOut').value = JSON.stringify(JSON.parse(document.getElementById('jsonIn').value)); } catch (e) { document.getElementById('jsonOut').value = '❌ ' + e.message; } }
function b64Enc() { try { document.getElementById('b64Out').value = btoa(unescape(encodeURIComponent(document.getElementById('b64In').value))); } catch (e) { document.getElementById('b64Out').value = '❌ ' + e.message; } }
function b64Dec() { try { document.getElementById('b64Out').value = decodeURIComponent(escape(atob(document.getElementById('b64In').value))); } catch (e) { document.getElementById('b64Out').value = '❌ ' + e.message; } }

const lessons = [
  { title: '🌱 ১. HTML কী? প্রথম পেজ', body: `<p>HTML হলো ওয়েবসাইটের কাঠামো।</p><button class="try-btn" onclick="loadLesson('html', this)">▶ এডিটরে চালাও</button>`, code: '<!DOCTYPE html>\n<html>\n<body style="font-family:system-ui;padding:20px">\n<h1>আমার প্রথম পেজ</h1>\n</body>\n</html>', lang: 'html' },
  { title: '🐍 ২. Python — প্রথম প্রোগ্রাম', body: `<p>Python সহজ ভাষা।</p><button class="try-btn" onclick="loadLesson('py', this)">▶ এডিটরে চালাও</button>`, code: 'for i in range(5):\n    print("নম্বর", i)', lang: 'py' }
];

function renderLearn() {
  const c = document.getElementById('learnContent');
  c.innerHTML = lessons.map((l, i) => `<div class="lesson" id="lesson-${i}"><div class="lesson-head" onclick="toggleLesson(${i})"><h3>${l.title}</h3><span class="arrow">▶</span></div><div class="lesson-body">${l.body}</div></div>`).join('');
}
function toggleLesson(i) { document.getElementById('lesson-' + i).classList.toggle('open'); }
function loadLesson(lang, btn) {
  const lessonIdx = btn.closest('.lesson').id.replace('lesson-', '');
  const l = lessons[lessonIdx];
  if (!l.code) return;
  if (l.lang === 'html') { editors.html.setValue(l.code); runWeb(); }
  else if (l.lang === 'py') { document.querySelector('#mainTabs .tab[data-panel="python"]').click(); editors.py.setValue(l.code); }
}

renderLearn();
updatePreview();
document.getElementById('projName').addEventListener('keydown', e => { if (e.key === 'Enter') saveProject(); });