const firebaseConfig = {
  apiKey: "AIzaSyAKJzdVBBSED8JEcS9dUJMh1dekfk5be4s", authDomain: "bangla-code-lab.firebaseapp.com",
  projectId: "bangla-code-lab", storageBucket: "bangla-code-lab.firebasestorage.app",
  messagingSenderId: "542355859550", appId: "1:542355859550:web:d304e461393948dcd16ccf", measurementId: "G-1FDQGT628S"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
let currentUser = null, chatUnsubscribe = null;

const translations = {
  en: { authSub: "Learn to code, share, and become a Cyber Scout", loginBtn: "Login with Google", webTab: "🌐 Web", pyTab: "🐍 Python", commTab: "🌍 Community", chatTab: "💬 Chat", projTab: "📁 Projects", toolsTab: "🧰 Tools", learnTab: "📚 Learn", accTab: "👤 Profile", previewTab: "👁 Preview", runBtn: "▶ Run", runPyBtn: "▶ Run Python", saveBtn: "💾 Save", clearBtn: "🗑 Clear", pyHint: "First time ~10s", refreshBtn: "🔄 Refresh", newSaveBtn: "💾 New Save", sendBtn: "Send", loading: "Loading...", profileTitle: "👤 My Profile", nameLabel: "Name", emailLabel: "Email", homeTitle: "🏠 Home Page", returnHome: "Return to Main", logoutTitle: "🚪 Logout", logoutBtn: "Logout", saveModalTitle: "💾 Save Project", cancelBtn: "Cancel", noMsg: "No messages yet.", noProj: "📭 No projects found.", noComm: "📭 No projects shared yet.", open: "Open", share: "🌍 Share", viewLoad: "👁 View & Load", chatPh: "Type message..." },
  bn: { authSub: "কোডিং শিখুন, শেয়ার করুন ও সাইবার স্কাউট হোন", loginBtn: "Google দিয়ে লগইন করুন", webTab: "🌐 ওয়েব", pyTab: "🐍 পাইথন", commTab: "🌍 কমিউনিটি", chatTab: "💬 চ্যাট", projTab: "📁 প্রজেক্ট", toolsTab: "🧰 টুলস", learnTab: "📚 শেখা", accTab: "👤 আমি", previewTab: "👁 প্রিভিউ", runBtn: "▶ রান", runPyBtn: "▶ পাইথন রান", saveBtn: "💾 সেভ", clearBtn: "🗑 মুছুন", pyHint: "প্রথমবার ~১০ সেকেন্ড", refreshBtn: "🔄 রিফ্রেশ", newSaveBtn: "💾 নতুন সেভ", sendBtn: "পাঠান", loading: "লোড হচ্ছে...", profileTitle: "👤 আমার প্রোফাইল", nameLabel: "নাম", emailLabel: "ইমেইল", homeTitle: "🏠 হোম পেজ", returnHome: "প্রধান ড্যাশবোর্ডে ফিরে যান", logoutTitle: "🚪 লগআউট", logoutBtn: "লগআউট করুন", saveModalTitle: "💾 প্রজেক্ট সেভ", cancelBtn: "বাতিল", noMsg: "এখনো কোনো মেসেজ নেই।", noProj: "📭 কোনো প্রজেক্ট নেই।", noComm: "📭 এখনো কেউ শেয়ার করেনি।", open: "খুলুন", share: "🌍 শেয়ার", viewLoad: "👁 দেখুন ও লোড", chatPh: "মেসেজ লিখুন..." },
  hi: { authSub: "कोड सीखें, साझा करें और साइबर स्काउट बनें", loginBtn: "Google के साथ लॉगिन", webTab: "🌐 वेब", pyTab: "🐍 पायथन", commTab: "🌍 समुदाय", chatTab: "💬 चैट", projTab: "📁 प्रोजेक्ट", toolsTab: "🧰 उपकरण", learnTab: "📚 सीखें", accTab: "👤 प्रोफ़ाइल", previewTab: "👁 पूर्वावलोकन", runBtn: "▶ चलाएं", runPyBtn: "▶ पायथन चलाएं", saveBtn: "💾 सहेजें", clearBtn: "🗑 साफ़ करें", pyHint: "पहली बार ~10s", refreshBtn: "🔄 रीफ़्रेश", newSaveBtn: "💾 नया सहेजें", sendBtn: "भेजें", loading: "लोड हो रहा है...", profileTitle: "👤 मेरी प्रोफ़ाइल", nameLabel: "नाम", emailLabel: "ईमेल", homeTitle: "🏠 होम पेज", returnHome: "मुख्य पर लौटें", logoutTitle: "🚪 लॉगआउट", logoutBtn: "लॉगआउट", saveModalTitle: "💾 प्रोजेक्ट सहेजें", cancelBtn: "रद्द करें", noMsg: "अभी कोई संदेश नहीं।", noProj: "📭 कोई प्रोजेक्ट नहीं मिला।", noComm: "📭 अभी तक कोई साझा नहीं किया।", open: "खोलें", share: "🌍 साझा करें", viewLoad: "👁 देखें और लोड करें", chatPh: "संदेश लिखें..." },
  ar: { authSub: "تعلم البرمجة وشارك وأصبح كشاف سيبراني", loginBtn: "تسجيل الدخول باستخدام Google", webTab: "🌐 ويب", pyTab: "🐍 بايثون", commTab: "🌍 مجتمع", chatTab: "💬 دردشة", projTab: "📁 مشاريع", toolsTab: "🧰 أدوات", learnTab: "📚 تعلم", accTab: "👤 الملف الشخصي", previewTab: "👁 معاينة", runBtn: "▶ تشغيل", runPyBtn: "▶ تشغيل بايثون", saveBtn: "💾 حفظ", clearBtn: "🗑 مسح", pyHint: "المرة الأولى ~10s", refreshBtn: "🔄 تحديث", newSaveBtn: "💾 حفظ جديد", sendBtn: "إرسال", loading: "جار التحميل...", profileTitle: "👤 ملفي الشخصي", nameLabel: "الاسم", emailLabel: "البريد الإلكتروني", homeTitle: "🏠 الصفحة الرئيسية", returnHome: "العودة إلى الرئيسية", logoutTitle: "🚪 تسجيل الخروج", logoutBtn: "تسجيل الخروج", saveModalTitle: "💾 حفظ المشروع", cancelBtn: "إلغاء", noMsg: "لا توجد رسائل بعد.", noProj: "📭 لم يتم العثور على مشاريع.", noComm: "📭 لم يشارك أحد بعد.", open: "فتح", share: "🌍 مشاركة", viewLoad: "👁 عرض وتحميل", chatPh: "اكتب رسالة..." },
  ur: { authSub: "کوڈ سیکھیں، شیئر کریں اور سائبر اسکاؤٹ بنیں", loginBtn: "Google کے ساتھ لاگ ان", webTab: "🌐 ویب", pyTab: "🐍 پائتھون", commTab: "🌍 کمیونٹی", chatTab: "💬 چیٹ", projTab: "📁 پروجیکٹس", toolsTab: "🧰 ٹولز", learnTab: "📚 سیکھیں", accTab: "👤 پروفائل", previewTab: "👁 پیش نظارہ", runBtn: "▶ چلائیں", runPyBtn: "▶ پائتھون چلائیں", saveBtn: "💾 محفوظ کریں", clearBtn: "🗑 صاف کریں", pyHint: "پہلی بار ~10s", refreshBtn: "🔄 ریفریش", newSaveBtn: "💾 نیا محفوظ کریں", sendBtn: "بھیجیں", loading: "لوڈ ہو رہا ہے...", profileTitle: "👤 میری پروفائل", nameLabel: "نام", emailLabel: "ای میل", homeTitle: "🏠 ہوم پیج", returnHome: "مرکزی صفحہ پر واپس جائیں", logoutTitle: "🚪 لاگ آؤٹ", logoutBtn: "لاگ آؤٹ", saveModalTitle: "💾 پروجیکٹ محفوظ کریں", cancelBtn: "منسوخ کریں", noMsg: "ابھی کوئی پیغام نہیں۔", noProj: "📭 کوئی پروجیکٹ نہیں ملا۔", noComm: "📭 ابھی تک کسی نے شیئر نہیں کیا۔", open: "کھولیں", share: "🌍 شیئر کریں", viewLoad: "👁 دیکھیں اور لوڈ کریں", chatPh: "پیغام لکھیں..." },
  es: { authSub: "Aprende a programar, comparte y conviértete en Cyber Scout", loginBtn: "Iniciar sesión con Google", webTab: "🌐 Web", pyTab: "🐍 Python", commTab: "🌍 Comunidad", chatTab: "💬 Chat", projTab: "📁 Proyectos", toolsTab: "🧰 Herramientas", learnTab: "📚 Aprender", accTab: "👤 Perfil", previewTab: "👁 Vista previa", runBtn: "▶ Ejecutar", runPyBtn: "▶ Ejecutar Python", saveBtn: "💾 Guardar", clearBtn: "🗑 Limpiar", pyHint: "Primera vez ~10s", refreshBtn: "🔄 Actualizar", newSaveBtn: "💾 Nuevo", sendBtn: "Enviar", loading: "Cargando...", profileTitle: "👤 Mi Perfil", nameLabel: "Nombre", emailLabel: "Correo", homeTitle: "🏠 Inicio", returnHome: "Volver al inicio", logoutTitle: "🚪 Salir", logoutBtn: "Salir", saveModalTitle: "💾 Guardar Proyecto", cancelBtn: "Cancelar", noMsg: "No hay mensajes aún.", noProj: "📭 No hay proyectos.", noComm: "📭 Nadie ha compartido aún.", open: "Abrir", share: "🌍 Compartir", viewLoad: "👁 Ver y Cargar", chatPh: "Escribe un mensaje..." }
};

let currentLang = localStorage.getItem('zakirhub_lang') || 'en';
function t(key) { return translations[currentLang][key] || key; }

function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.innerText = t(key);
  });
  document.getElementById('langSelectAuth').value = currentLang;
  document.getElementById('langSelectApp').value = currentLang;
  document.getElementById('chatInput').placeholder = t('chatPh');
  document.getElementById('projName').placeholder = currentLang === 'en' ? 'Enter project name' : (currentLang === 'bn' ? 'প্রজেক্টের নাম দিন' : 'Enter name');
}

function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('zakirhub_lang', lang);
  applyLanguage();
  if(currentUser) { loadProjects(); loadCommunity(); startChatListener(); }
}
document.addEventListener('DOMContentLoaded', applyLanguage);

function doGoogleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch((error) => { 
    if (error.code === 'auth/popup-blocked') { auth.signInWithRedirect(provider); } 
  });
}
async function doLogout() { if (confirm('Logout?')) await auth.signOut(); }

auth.onAuthStateChanged(user => {
  currentUser = user;
  if (user) {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('app').classList.add('show');
    document.getElementById('accName').textContent = user.displayName || 'User';
    document.getElementById('accEmail').textContent = user.email;
    setTimeout(() => Object.values(editors).forEach(e => e && e.refresh()), 100);
    loadProjects(); loadCommunity(); startChatListener();
  } else {
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('app').classList.remove('show');
    if (chatUnsubscribe) { chatUnsubscribe(); chatUnsubscribe = null; }
  }
});

const defaults = { html: '<h1>Hello World</h1>', css: 'body { font-family: sans-serif; }', js: "console.log('JS ready');", py: 'print("Hello Python")' };
const editors = {};
function makeEditor(id, mode, key) { editors[key] = CodeMirror(document.getElementById(id), { value: defaults[key], mode: mode, theme: 'dracula', lineNumbers: true, lineWrapping: true, autoCloseBrackets: true, indentUnit: 2, tabSize: 2 }); }
makeEditor('htmlEditor', 'htmlmixed', 'html'); makeEditor('cssEditor', 'css', 'css'); makeEditor('jsEditor', 'javascript', 'js'); makeEditor('pyEditor', 'python', 'py');

document.querySelectorAll('#mainTabs .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('#mainTabs .tab').forEach(x => x.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + tab.dataset.panel).classList.add('active');
    setTimeout(() => Object.values(editors).forEach(e => e && e.refresh()), 60);
    if (tab.dataset.panel === 'community') loadCommunity();
    if (tab.dataset.panel === 'chat') scrollToBottom();
  });
});

const paneIds = { html: 'htmlEditor', css: 'cssEditor', js: 'jsEditor', preview: 'previewPane' };
document.querySelectorAll('#webSubtabs .subtab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('#webSubtabs .subtab').forEach(x => x.classList.remove('active'));
    tab.classList.add('active');
    Object.values(paneIds).forEach(id => document.getElementById(id).classList.remove('active'));
    document.getElementById(paneIds[tab.dataset.ed]).classList.add('active');
    setTimeout(() => { editors.html.refresh(); editors.css.refresh(); editors.js.refresh(); }, 60);
  });
});
function showPane(name) { const tab = document.querySelector('#webSubtabs .subtab[data-ed="' + name + '"]'); if (tab) tab.click(); }

function startChatListener() {
  const chatBox = document.getElementById('chatMessages');
  if (chatUnsubscribe) chatUnsubscribe();
  chatUnsubscribe = db.collection('public_chat').orderBy('timestamp', 'asc').limitToLast(50).onSnapshot(snap => {
    if (snap.empty) { chatBox.innerHTML = `<div class="empty">${t('noMsg')}</div>`; return; }
    chatBox.innerHTML = snap.docs.map(doc => {
      const d = doc.data(); const isMine = d.senderId === currentUser.uid;
      const time = d.timestamp ? d.timestamp.toDate().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}) : '';
      return `<div class="message ${isMine ? 'mine' : 'others'}">${!isMine ? `<div class="sender">${escapeHtml(d.senderName)} • ${time}</div>` : ''}${escapeHtml(d.text)}${isMine ? `<div class="sender" style="text-align:right; font-size:10px; color:#ccc">${time}</div>` : ''}</div>`;
    }).join('');
    scrollToBottom();
  });
}
function scrollToBottom() { const chatBox = document.getElementById('chatMessages'); chatBox.scrollTop = chatBox.scrollHeight; }
async function sendMessage() {
  const input = document.getElementById('chatInput'); const text = input.value.trim();
  if (!text) return; input.value = ''; 
  try { await db.collection('public_chat').add({ text: text, senderName: currentUser.displayName || 'Anon', senderId: currentUser.uid, timestamp: firebase.firestore.FieldValue.serverTimestamp() }); } catch (e) { alert(e.message); }
}

function updatePreview() { document.getElementById('preview').srcdoc = '<!DOCTYPE html><html><head><style>' + editors.css.getValue() + '</style></head><body>' + editors.html.getValue() + '<script>' + editors.js.getValue() + '<\/script></body></html>'; }
function runWeb() { updatePreview(); showPane('preview'); }
function clearWeb() { const active = document.querySelector('#webSubtabs .subtab.active'); if (active && active.dataset.ed !== 'preview' && confirm('Clear?')) editors[active.dataset.ed].setValue(''); }

let pyodideInstance = null, pyodideLoading = false;
async function runPython() {
  const out = document.getElementById('pyOutput'); const hint = document.getElementById('pyHint'); out.textContent = '';
  try {
    if (!pyodideInstance) { if (!pyodideLoading) { pyodideLoading = true; hint.textContent = 'Loading...'; } pyodideInstance = await loadPyodide(); hint.textContent = '✅ Ready'; }
    pyodideInstance.setStdout({ batched: s => { out.textContent += s + '\n'; } }); pyodideInstance.setStderr({ batched: s => { out.textContent += s + '\n'; } });
    const result = await pyodideInstance.runPythonAsync(editors.py.getValue());
    if (result !== undefined && result !== null) out.textContent += String(result) + '\n';
  } catch (e) { out.textContent += '\n❌ ' + (e.message || e); }
}
function clearPy() { if (confirm('Clear?')) { editors.py.setValue(''); document.getElementById('pyOutput').textContent = ''; } }

function openSaveModal() { if (!currentUser) return; document.getElementById('saveModal').classList.add('show'); document.getElementById('projName').value = ''; setTimeout(() => document.getElementById('projName').focus(), 100); }
function closeSaveModal() { document.getElementById('saveModal').classList.remove('show'); }
async function saveProject() {
  const name = document.getElementById('projName').value.trim(); if (!name) return alert('Name required');
  closeSaveModal(); const status = document.getElementById('saveStatus'); status.textContent = t('loading');
  try {
    await db.collection('users').doc(currentUser.uid).collection('projects').add({ name: name, html: editors.html.getValue(), css: editors.css.getValue(), js: editors.js.getValue(), py: editors.py.getValue(), updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
    status.textContent = '✅ ' + t('saveBtn'); setTimeout(() => status.textContent = '', 2000); loadProjects();
  } catch (e) { status.textContent = '❌ ' + e.message; }
}

async function loadProjects() {
  if (!currentUser) return; const list = document.getElementById('projectsList'); list.innerHTML = `<div class="empty">${t('loading')}</div>`;
  try {
    const snap = await db.collection('users').doc(currentUser.uid).collection('projects').orderBy('updatedAt', 'desc').get();
    if (snap.empty) { list.innerHTML = `<div class="empty">${t('noProj')}</div>`; return; }
    list.innerHTML = snap.docs.map(d => {
      const data = d.data(); const ts = data.updatedAt ? data.updatedAt.toDate().toLocaleString('en-US') : '—';
      return `<div class="project-card"><div class="info"><div class="name">${escapeHtml(data.name)}</div><div class="time">${ts}</div></div><div class="actions"><button class="open" onclick="openProject('${d.id}')">${t('open')}</button><button class="share" onclick="shareProject('${d.id}')">${t('share')}</button><button class="del" onclick="deleteProject('${d.id}')">🗑</button></div></div>`;
    }).join('');
  } catch (e) { list.innerHTML = '<div class="empty">❌ ' + e.message + '</div>'; }
}

async function openProject(id) {
  try {
    const doc = await db.collection('users').doc(currentUser.uid).collection('projects').doc(id).get(); if (!doc.exists) return;
    const d = doc.data(); editors.html.setValue(d.html || ''); editors.css.setValue(d.css || ''); editors.js.setValue(d.js || ''); editors.py.setValue(d.py || '');
    updatePreview(); document.querySelector('#mainTabs .tab[data-panel="web"]').click(); document.getElementById('saveStatus').textContent = '✅ Loaded'; setTimeout(() => document.getElementById('saveStatus').textContent = '', 2000);
  } catch (e) { alert(e.message); }
}
async function deleteProject(id) { if (confirm('Delete?')) { try { await db.collection('users').doc(currentUser.uid).collection('projects').doc(id).delete(); loadProjects(); } catch (e) { alert(e.message); } } }
async function shareProject(id) {
  if (!confirm('Share?')) return;
  try {
    const doc = await db.collection('users').doc(currentUser.uid).collection('projects').doc(id).get(); const d = doc.data();
    await db.collection('public_projects').add({ name: d.name, html: d.html || '', css: d.css || '', js: d.js || '', py: d.py || '', authorName: currentUser.displayName || 'Anon', authorId: currentUser.uid, sharedAt: firebase.firestore.FieldValue.serverTimestamp() });
    alert('✅ Shared!'); loadCommunity();
  } catch (e) { alert(e.message); }
}

async function loadCommunity() {
  const list = document.getElementById('communityList'); list.innerHTML = `<div class="empty">${t('loading')}</div>`;
  try {
    const snap = await db.collection('public_projects').orderBy('sharedAt', 'desc').limit(50).get();
    if (snap.empty) { list.innerHTML = `<div class="empty">${t('noComm')}</div>`; return; }
    list.innerHTML = snap.docs.map(d => {
      const data = d.data(); const ts = data.sharedAt ? data.sharedAt.toDate().toLocaleString('en-US') : '—';
      return `<div class="project-card"><div class="info"><div class="name">${escapeHtml(data.name)}</div><div class="author">👤 ${escapeHtml(data.authorName)}</div><div class="time">${ts}</div></div><div class="actions"><button class="open" onclick="openCommunityProject('${d.id}')">${t('viewLoad')}</button></div></div>`;
    }).join('');
  } catch (e) { list.innerHTML = '<div class="empty">❌ ' + e.message + '</div>'; }
}
async function openCommunityProject(id) {
  try {
    const doc = await db.collection('public_projects').doc(id).get(); if (!doc.exists) return; const d = doc.data();
    editors.html.setValue(d.html || ''); editors.css.setValue(d.css || ''); editors.js.setValue(d.js || ''); editors.py.setValue(d.py || '');
    updatePreview(); document.querySelector('#mainTabs .tab[data-panel="web"]').click();
  } catch (e) { alert(e.message); }
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function jsonFormat() { try { document.getElementById('jsonOut').value = JSON.stringify(JSON.parse(document.getElementById('jsonIn').value), null, 2); } catch (e) { document.getElementById('jsonOut').value = '❌ ' + e.message; } }
function jsonMinify() { try { document.getElementById('jsonOut').value = JSON.stringify(JSON.parse(document.getElementById('jsonIn').value)); } catch (e) { document.getElementById('jsonOut').value = '❌ ' + e.message; } }

const lessons = [
  { title: '🌱 1. What is HTML?', body: `<p>HTML is the structure of a website.</p><button class="try-btn" onclick="loadLesson('html', this)">▶ Load</button>`, code: '<h1>My First Page</h1>', lang: 'html' },
  { title: '🐍 2. Python', body: `<p>Python is easy.</p><button class="try-btn" onclick="loadLesson('py', this)">▶ Load</button>`, code: 'for i in range(5):\n    print(i)', lang: 'py' }
];
function renderLearn() { const c = document.getElementById('learnContent'); c.innerHTML = lessons.map((l, i) => `<div class="lesson" id="lesson-${i}"><div class="lesson-head" onclick="toggleLesson(${i})"><h3>${l.title}</h3><span class="arrow">▶</span></div><div class="lesson-body">${l.body}</div></div>`).join(''); }
function toggleLesson(i) { document.getElementById('lesson-' + i).classList.toggle('open'); }
function loadLesson(lang, btn) { const l = lessons[btn.closest('.lesson').id.replace('lesson-', '')]; if (!l.code) return; if (l.lang === 'html') { editors.html.setValue(l.code); runWeb(); } else if (l.lang === 'py') { document.querySelector('#mainTabs .tab[data-panel="python"]').click(); editors.py.setValue(l.code); } }

renderLearn(); updatePreview();