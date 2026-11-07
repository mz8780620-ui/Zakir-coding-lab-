const firebaseConfig = {
  apiKey: "AIzaSyAKJzdVBBSED8JEcS9dUJMh1dekfk5be4s", authDomain: "bangla-code-lab.firebaseapp.com",
  projectId: "bangla-code-lab", storageBucket: "bangla-code-lab.firebasestorage.app",
  messagingSenderId: "542355859550", appId: "1:542355859550:web:d304e461393948dcd16ccf", measurementId: "G-1FDQGT628S"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
let currentUser = null;

const translations = {
  en: { authText: "Authorized Personnel Only", loginBtn: "LOGIN WITH GOOGLE", homeBtn: "⬅ Home Page", sendBtn: "SEND", chatPh: "Type command...", sysMsg: "[SYSTEM]: Secure connection established. Type 'help' for commands." },
  bn: { authText: "শুধুমাত্র অনুমোদিত ব্যক্তিদের জন্য", loginBtn: "Google দিয়ে লগইন করুন", homeBtn: "⬅ হোম পেজ", sendBtn: "পাঠান", chatPh: "কমান্ড লিখুন...", sysMsg: "[সিস্টেম]: নিরাপদ সংযোগ স্থাপিত হয়েছে। কমান্ডের জন্য 'help' লিখুন।" },
  hi: { authText: "केवल अधिकृत कर्मियों के लिए", loginBtn: "Google के साथ लॉगिन", homeBtn: "⬅ होम पेज", sendBtn: "भेजें", chatPh: "कमांड लिखें...", sysMsg: "[सिस्टम]: सुरक्षित कनेक्शन स्थापित।" },
  ar: { authText: "للأفراد المصرح لهم فقط", loginBtn: "تسجيل الدخول باستخدام Google", homeBtn: "⬅ الصفحة الرئيسية", sendBtn: "إرسال", chatPh: "اكتب الأمر...", sysMsg: "[النظام]: تم إنشاء اتصال آمن." },
  ur: { authText: "صرف مجاز افراد کے لیے", loginBtn: "Google کے ساتھ لاگ ان", homeBtn: "⬅ ہوم پیج", sendBtn: "بھیجیں", chatPh: "کمانڈ لکھیں...", sysMsg: "[سسٹم]: محفوظ کنکشن قائم ہو گیا۔" },
  es: { authText: "Solo personal autorizado", loginBtn: "Iniciar sesión con Google", homeBtn: "⬅ Inicio", sendBtn: "Enviar", chatPh: "Escribe comando...", sysMsg: "[SISTEMA]: Conexión segura establecida." }
};

let currentLang = localStorage.getItem('zakirhub_lang') || 'en';
function t(key) { return translations[currentLang][key] || key; }

function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.innerText = t(key);
  });
  document.getElementById('langSelect').value = currentLang;
  document.getElementById('chatInput').placeholder = t('chatPh');
}
function changeLanguage(lang) { currentLang = lang; localStorage.setItem('zakirhub_lang', lang); applyLanguage(); }
document.addEventListener('DOMContentLoaded', applyLanguage);

function doGoogleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch((error) => { 
    if (error.code === 'auth/popup-blocked') { auth.signInWithRedirect(provider); } 
  });
}

auth.onAuthStateChanged(user => {
  currentUser = user;
  if (user) {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    
    // টার্মিনালে প্রথম মেসেজ দেখানো
    const chatBox = document.getElementById('chatMessages');
    chatBox.innerHTML = `<div class="log" style="color:#00ff00;">${t('sysMsg')}</div>`;
  } else {
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
  }
});

function startMission(id) {
  if (id === 1) {
    addSystemMessage("🎯 <b>MISSION 1: Basic Recon</b><br>Objective: Identify yourself and scan the local network.<br><br><b>Commands to run:</b><br>1. Type <b>whoami</b> to check your agent ID.<br>2. Type <b>scan</b> to find connected devices.");
  } else if (id === 2) {
    addSystemMessage("🎯 <b>MISSION 2: Hash Cracking</b><br>Objective: A hacker left a password hash. Decrypt it.<br><br><b>Hash:</b> <code style='background:#222;padding:2px 4px;color:#00ff00;'>5d41402abc4b2a76b9719d911017c592</code><br><br><i>Hint: It is a 5-letter English word. Starts with 'h'.</i>");
  }
}

function addSystemMessage(htmlText) {
  const chatBox = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'log';
  div.style.color = '#00ff00';
  div.innerHTML = `<span class="user">[SYSTEM]:</span> <span class="text">${htmlText}</span>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById('chatInput'); 
  const text = input.value.trim();
  if (!text) return; 
  input.value = ''; 

  const cmd = text.toLowerCase();

  // কমান্ডের আউটপুট
  if (cmd === 'help') {
    addSystemMessage("Available Commands: <br>1. <b>whoami</b> - Show your agent ID<br>2. <b>scan</b> - Scan local network<br>3. <b>clear</b> - Clear terminal<br>4. <b>missions</b> - View missions");
    return;
  }
  if (cmd === 'whoami') {
    addSystemMessage(`Agent Name: <b>${currentUser.displayName}</b><br>Rank: Cyber Scout (Level 1)<br>Status: Active`);
    return;
  }
  if (cmd === 'scan') {
    addSystemMessage("Scanning network...<br>➔ Found: 192.168.1.1 (Router - SECURED)<br>➔ Found: 192.168.1.42 (Unknown Device - <span style='color:red;'>VULNERABLE</span>)<br>➔ Found: 192.168.1.99 (Cyber Scout Node - ONLINE)");
    return;
  }
  if (cmd === 'clear') {
    document.getElementById('chatMessages').innerHTML = '';
    return;
  }

  // যদি কোনো ম্যাচ না করে
  addSystemMessage(`Command not found: <b>${escapeHtml(text)}</b>. Type 'help' for commands.`);
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }