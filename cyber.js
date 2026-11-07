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
  en: { authText: "Authorized Personnel Only", loginBtn: "LOGIN WITH GOOGLE", homeBtn: "⬅ Home Page", sendBtn: "SEND", chatPh: "Type command...", sysMsg: "[SYSTEM]: No logs found. Be the first to transmit." },
  bn: { authText: "শুধুমাত্র অনুমোদিত ব্যক্তিদের জন্য", loginBtn: "Google দিয়ে লগইন করুন", homeBtn: "⬅ হোম পেজ", sendBtn: "পাঠান", chatPh: "কমান্ড লিখুন...", sysMsg: "[সিস্টেম]: কোনো লগ পাওয়া যায়নি। আপনিই প্রথম মেসেজ দিন।" },
  hi: { authText: "केवल अधिकृत कर्मियों के लिए", loginBtn: "Google के साथ लॉगिन", homeBtn: "⬅ होम पेज", sendBtn: "भेजें", chatPh: "कमांड लिखें...", sysMsg: "[सिस्टम]: कोई लॉग नहीं मिला।" },
  ar: { authText: "للأفراد المصرح لهم فقط", loginBtn: "تسجيل الدخول باستخدام Google", homeBtn: "⬅ الصفحة الرئيسية", sendBtn: "إرسال", chatPh: "اكتب الأمر...", sysMsg: "[النظام]: لم يتم العثور على سجلات." },
  ur: { authText: "صرف مجاز افراد کے لیے", loginBtn: "Google کے ساتھ لاگ ان", homeBtn: "⬅ ہوم پیج", sendBtn: "بھیجیں", chatPh: "کمانڈ لکھیں...", sysMsg: "[سسٹم]: کوئی لاگ نہیں ملا۔" },
  es: { authText: "Solo personal autorizado", loginBtn: "Iniciar sesión con Google", homeBtn: "⬅ Inicio", sendBtn: "Enviar", chatPh: "Escribe comando...", sysMsg: "[SISTEMA]: No se encontraron registros." }
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

function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('zakirhub_lang', lang);
  applyLanguage();
  if(currentUser) { startChatListener(); }
}
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
  chatUnsubscribe = db.collection('cyber_chat').orderBy('timestamp', 'asc').limitToLast(100).onSnapshot(snap => {
    if (snap.empty) { chatBox.innerHTML = `<div class="log" style="color:#888;">${t('sysMsg')}</div>`; return; }
    chatBox.innerHTML = snap.docs.map(doc => {
      const d = doc.data(); const isMine = d.senderId === currentUser.uid;
      const time = d.timestamp ? d.timestamp.toDate().toLocaleTimeString('en-US', {hour12: false}) : '00:00:00';
      return `<div class="log ${isMine ? 'mine' : ''}"><span class="time">[${time}]</span><span class="user">${isMine ? 'You' : escapeHtml(d.senderName)}:</span><span class="text">${escapeHtml(d.text)}</span></div>`;
    }).join('');
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}

async function sendMessage() {
  const input = document.getElementById('chatInput'); const text = input.value.trim();
  if (!text || !currentUser) return; input.value = ''; 
  try { await db.collection('cyber_chat').add({ text: text, senderName: currentUser.displayName || 'Unknown', senderId: currentUser.uid, timestamp: firebase.firestore.FieldValue.serverTimestamp() }); } catch (e) { alert(e.message); }
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }