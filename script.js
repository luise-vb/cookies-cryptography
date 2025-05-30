// --- ENCRYPTION/DECRYPTION CORE ---
function process(action) {
  const text = document.getElementById("inputText").value;
  const algorithm = document.getElementById("algorithm").value;

  let result;
  switch (algorithm) {
    case "caesar":
      result = action === "encrypt" ? caesarEncrypt(text) : caesarDecrypt(text);
      break;
    case "atbash":
      result = atbash(text);
      break;
    case "reverse":
      result = reverseText(text);
      break;
    case "vigenere":
      result = action === "encrypt" ? vigenereEncrypt(text, "KEY") : vigenereDecrypt(text, "KEY");
      break;
    case "base64":
      result = action === "encrypt" ? btoa(text) : atob(text);
      break;
    case "xor":
      result = xorCipher(text, "K");
      break;
    default:
      result = "Unknown algorithm";
  }
  document.getElementById("output").innerText = result;
}

function caesarEncrypt(text, shift = 3) {
  return text.replace(/[a-z]/gi, c =>
    String.fromCharCode((c.charCodeAt(0) - (c < 'a' ? 65 : 97) + shift) % 26 + (c < 'a' ? 65 : 97)));
}
function caesarDecrypt(text, shift = 3) { return caesarEncrypt(text, 26 - shift); }
function atbash(text) {
  return text.replace(/[a-z]/gi, c =>
    String.fromCharCode(25 - (c.toLowerCase().charCodeAt(0) - 97) + (c < 'a' ? 65 : 97)));
}
function reverseText(text) { return text.split("").reverse().join(""); }
function vigenereEncrypt(text, key) {
  key = key.toUpperCase();
  let result = "", j = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (/[a-zA-Z]/.test(c)) {
      const base = c === c.toUpperCase() ? 65 : 97;
      const k = key.charCodeAt(j % key.length) - 65;
      result += String.fromCharCode((c.charCodeAt(0) - base + k) % 26 + base);
      j++;
    } else result += c;
  }
  return result;
}
function vigenereDecrypt(text, key) {
  key = key.toUpperCase();
  let result = "", j = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (/[a-zA-Z]/.test(c)) {
      const base = c === c.toUpperCase() ? 65 : 97;
      const k = key.charCodeAt(j % key.length) - 65;
      result += String.fromCharCode((c.charCodeAt(0) - base - k + 26) % 26 + base);
      j++;
    } else result += c;
  }
  return result;
}
function xorCipher(text, key) {
  return [...text].map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(0))).join('');
}

// --- FILE HANDLING ---
document.getElementById("fileInput").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => document.getElementById("inputText").value = e.target.result;
    reader.readAsText(file);
  }
});
function downloadFile() {
  const blob = new Blob([document.getElementById("output").innerText], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "output.txt";
  a.click();
}

// --- INFO & TEST ---
function showInfo() {
  const info = `
<b>Caesar Cipher:</b> Shifts letters by 3. Easy to crack.<br>
<b>Atbash Cipher:</b> Reverses the alphabet. A becomes Z.<br>
<b>Reverse Text:</b> Simply reverses the characters.<br>
<b>Vigenère Cipher:</b> Uses a keyword to shift letters. Stronger than Caesar.<br>
<b>Base64:</b> Encodes binary data into readable text. Not real encryption.<br>
<b>XOR Cipher:</b> Uses a key to flip bits. Strong if used correctly.`;
  document.getElementById("infoBox").innerHTML = info;
  document.getElementById("infoBox").classList.remove("hidden");
  document.getElementById("testBox").classList.add("hidden");
}

function showTest() {
  const questions = [
    { q: "Caesar cipher shifts letters?", a: true },
    { q: "Atbash cipher is a substitution cipher?", a: true },
    { q: "Reverse text is unbreakable encryption?", a: false },
    { q: "Vigenère uses a keyword?", a: true },
    { q: "Base64 is secure encryption?", a: false },
    { q: "XOR cipher can use a key?", a: true }
  ];
  const html = questions.map((q, i) =>
    `<div><b>Q${i + 1}:</b> ${q.q}<br><button onclick="alert('${q.a ? 'Correct!' : 'Wrong!'}')">True</button> <button onclick="alert('${!q.a ? 'Correct!' : 'Wrong!'}')">False</button></div>`
  ).join("<br>");
  document.getElementById("testBox").innerHTML = html;
  document.getElementById("testBox").classList.remove("hidden");
  document.getElementById("infoBox").classList.add("hidden");
}
