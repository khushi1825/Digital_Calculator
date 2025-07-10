const display = document.getElementById("display");
const sciButtons = document.getElementById("sci-buttons");
let isScientific = false;
let memoryValue = 0;

// Mode switching
function toggleMode() {
  isScientific = !isScientific;
  sciButtons.style.display = isScientific ? 'grid' : 'none';
  document.getElementById("mode-label").innerText = isScientific ? "Scientific" : "Standard";
  document.querySelector(".calculator").classList.toggle("scientific-mode", isScientific);
}

// Theme switch
function toggleTheme() {
  const body = document.body;
  const button = event.target;
  body.classList.toggle("light-mode");
  button.textContent = body.classList.contains("light-mode") ? "☀️" : "🌙";
}

// Append values to display
function append(val) {
  if (display.innerText === "0" || display.innerText === "Error") {
    display.innerText = val;
  } else {
    display.innerText += val;
  }
}

   function clearDisplay() {
  display.innerText = "0";
}


// Backspace
function backspace() {
  display.innerText = display.innerText.slice(0, -1) || "0";
}

// Calculate result
function calculate() {
  try {
    const result = eval(display.innerText);
    addToHistory(display.innerText + " = " + result);
    display.innerText = result;
  } catch {
    display.innerText = "Error";
  }
}

// History
function addToHistory(entry) {
  const ul = document.getElementById("history-list");
  const li = document.createElement("li");
  li.textContent = entry;
  ul.appendChild(li);
  ul.scrollTop = ul.scrollHeight;
}

// Memory logic
function memoryStore() {
  memoryValue = parseFloat(display.innerText) || 0;
}
function memoryRecall() {
  display.innerText += memoryValue;
}
function memoryClear() {
  memoryValue = 0;
}
function memorySubtract() {
  memoryValue -= parseFloat(display.innerText) || 0;
}

// Scientific functions
function scientific(funcName) {
  try {
    const value = parseFloat(display.innerText);
    const result = eval(`${funcName}(${value})`);
    addToHistory(`${funcName}(${value}) = ${result}`);
    display.innerText = result;
  } catch {
    display.innerText = "Error";
  }
}
function power() {
  try {
    const value = parseFloat(display.innerText);
    const result = value * value;
    addToHistory(`${value}² = ${result}`);
    display.innerText = result;
  } catch {
    display.innerText = "Error";
  }
}

// 🎤 Voice Input Feature
const voiceBtn = document.getElementById("voiceBtn");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    voiceBtn.innerText = "🎙️ Listening...";
  };

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    const parsed = convertSpokenMath(transcript);
    display.innerText = parsed;
    calculate(); // auto-calculate after voice input
    voiceBtn.innerText = "🎤";
  };

  recognition.onerror = function (event) {
    voiceBtn.innerText = "🎤";
    alert("Voice recognition error: " + event.error);
  };

  recognition.onend = () => {
    voiceBtn.innerText ="🎙️";
  };

  voiceBtn.addEventListener("click", () => {
    recognition.start();
  });
} else {
  alert("Speech recognition not supported in this browser.");
}

// Convert spoken math to real expression
function convertSpokenMath(speech) {
  return speech
    .toLowerCase()
    .replace(/plus/gi, "+")
    .replace(/minus/gi, "-")
    .replace(/times|into|multiply by/gi, "*")
    .replace(/divide by|divided by/gi, "/")
    .replace(/equals|equal to/gi, "=")
    .replace(/point/gi, ".")
    .replace(/power of/gi, "^")
    .replace(/[^\d\+\-\*\/\=\.\(\)\^]/gi, ""); // clean unwanted text
}




