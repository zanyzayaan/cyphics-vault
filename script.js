//  CORE ALGORITHMS 

function caesar(text, shift, decrypt = false) {
    if (isNaN(shift)) return "Error: Shift must be a number";
    if (decrypt) shift = (26 - (shift % 26)) % 26;
    
    return text.replace(/[a-z]/gi, (char) => {
        const code = char.charCodeAt(0);
        const base = code <= 90 ? 65 : 97;
        return String.fromCharCode(((code - base + shift) % 26) + base);
    });
}

function atbash(text) {
    return text.replace(/[a-z]/gi, (char) => {
        const code = char.charCodeAt(0);
        const base = code <= 90 ? 65 : 97;
        return String.fromCharCode(base + (25 - (code - base)));
    });
}

function vigenere(text, key, decrypt = false) {
    if (!key) return "Error: Key required";
    key = key.toLowerCase().replace(/[^a-z]/g, "");
    let j = 0;
    return text.replace(/[a-z]/gi, (char) => {
        let shift = key[j % key.length].charCodeAt(0) - 97;
        if (decrypt) shift = (26 - shift) % 26;
        const code = char.charCodeAt(0);
        const base = code <= 90 ? 65 : 97;
        const result = String.fromCharCode(((code - base + shift) % 26) + base);
        j++;
        return result;
    });
}

function base64Handler(text, decrypt = false) {
    try {
        return decrypt ? atob(text) : btoa(text);
    } catch (e) {
        return "Error: Invalid Base64 format";
    }
}

// Auto-Detect

function autoDetectAndDecrypt() {
    const input = document.getElementById("inputText").value.trim();
    if (!input) return;

    let detectedType = "caesar";
    let autoKey = "";

    // A. identify Base64 (High confidence regex)
    const b64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
    if (b64Regex.test(input) && input.length > 5) {
        detectedType = "base64";
    } 
    // B. identify baconian (only A/B or 0/1)
    else if (/^[AB\s]+$/i.test(input)) {
        detectedType = "baconian";
    }
    // C. identify caesar via frequency analysis
    else {
        // we try all 26 shifts and see which one looks most like English
        let bestShift = 0;
        let maxScore = -1;
        const englishFreq = "etaoinshrdlcumwfgypbvkjxqz";

        for (let s = 0; s < 26; s++) {
            let testDecryption = caesar(input, s, true).toLowerCase();
            let score = 0;
            // count how many of the top 6 english letters appear
            for (let char of "etaoin") {
                score += (testDecryption.split(char).length - 1);
            }
            if (score > maxScore) {
                maxScore = score;
                bestShift = s;
            }
        }
        detectedType = "caesar";
        autoKey = bestShift;
    }

    // update ui and perform decryption
    const badge = document.getElementById("detection-badge");
    badge.classList.remove("hidden");
    document.getElementById("detected-type").innerText = detectedType.toUpperCase();
    
    document.getElementById("cipherType").value = detectedType;
    if (autoKey !== "") document.getElementById("key").value = autoKey;
    
    decrypt();
}

//  UI HANDLERS

function encrypt() {
    const text = document.getElementById("inputText").value;
    const type = document.getElementById("cipherType").value;
    const key = document.getElementById("key").value;
    let result = "";

    switch(type) {
        case "caesar": result = caesar(text, parseInt(key) || 0); break;
        case "atbash": result = atbash(text); break;
        case "vigenere": result = vigenere(text, key); break;
        case "base64": result = base64Handler(text, false); break;
        default: result = "Cipher not implemented yet";
    }
    document.getElementById("outputText").value = result;
}

function decrypt() {
    const text = document.getElementById("inputText").value;
    const type = document.getElementById("cipherType").value;
    const key = document.getElementById("key").value;
    let result = "";

    switch(type) {
        case "caesar": result = caesar(text, parseInt(key) || 0, true); break;
        case "atbash": result = atbash(text); break;
        case "vigenere": result = vigenere(text, key, true); break;
        case "base64": result = base64Handler(text, true); break;
        default: result = "Cipher not implemented yet";
    }
    document.getElementById("outputText").value = result;
}

function copyToClipboard() {
    const outputText = document.getElementById("outputText");
    const copyBtn = document.querySelector(".copy-btn");

    if (!outputText.value || outputText.value === "Result will appear here...") {
        alert("Nothing to copy yet!");
        return;
    }

    // modern clipboard api
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(outputText.value).then(() => {
            showCopySuccess(copyBtn);
        }).catch(err => {
            console.error("Clipboard API failed, trying fallback...", err);
            fallbackCopy(outputText, copyBtn);
        });
    } else {
        // fallback for older browsers
        fallbackCopy(outputText, copyBtn);
    }
}

function fallbackCopy(textElement, btn) {
    textElement.select();
    try {
        document.execCommand('copy');
        showCopySuccess(btn);
    } catch (err) {
        alert("Manual copy required: Press Ctrl+C");
    }
}

function showCopySuccess(btn) {
    const originalText = btn.innerText;
    btn.innerText = "COPIED!";
    btn.style.borderColor = "#00ff41";
    btn.style.color = "#00ff41";
    
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.borderColor = ""; // goes back to css default
        btn.style.color = "";
    }, 2000);
}

const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // direct movement for the dot
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // mmooth trail for the outline
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// fancy hover effect: outline glowing
document.querySelectorAll('button, select, a').forEach(item => {
    item.addEventListener('mouseover', () => {
        cursorOutline.style.width = "60px";
        cursorOutline.style.height = "60px";
        cursorOutline.style.backgroundColor = "rgba(0, 255, 65, 0.1)";
    });
    item.addEventListener('mouseleave', () => {
        cursorOutline.style.width = "40px";
        cursorOutline.style.height = "40px";
        cursorOutline.style.backgroundColor = "transparent";
    });
});