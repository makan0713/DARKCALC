let screen = document.getElementById("screen");
let buttons = document.getElementById("buttons");
let historyList = document.getElementById("historyList");
let graph = document.getElementById("graph");

let mode = "basic";
let history = JSON.parse(localStorage.getItem("darkcalc_safe")) || [];

/* =========================
   🔊 SAFE AUDIO (iOS friendly)
========================= */
let audioCtx = null;

function initAudio(){
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  } catch(e){}
}

function clickSound(){
  try {
    initAudio();
    if (!audioCtx) return;

    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();

    osc.frequency.value = 600;
    gain.gain.value = 0.05;

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } catch(e){
    // silent fail
  }
}

/* =========================
   📳 VIBRATION SAFE
========================= */
function vibrate(){
  try {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  } catch(e){}
}

/* =========================
   🎤 VOICE (SAFE)
========================= */
function voiceCalc(){
  try {
    let SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    let rec = new SpeechRec();
    rec.lang = "en-US";

    rec.onresult = (e)=>{
      try {
        screen.innerText = e.results[0][0].transcript;
        calc();
      } catch(e){}
    };

    rec.start();
  } catch(e){}
}

/* =========================
   BUTTONS
========================= */
const basic = [
"7","8","9","/",
"4","5","6","*",
"1","2","3","-",
"0",".","=","+"
];

const scientific = [
"sin(","cos(","tan(","√(",
"π","^","%","/",
"7","8","9","*",
"4","5","6","-",
"1","2","3","+",
"0",".","="
];

function render(){
  buttons.innerHTML = "";
  let arr = mode === "scientific" ? scientific : basic;

  arr.forEach(v=>{
    let b = document.createElement("button");
    b.innerText = v;

    if(["/","*","-","+","="].includes(v)){
      b.classList.add("op");
    }

    b.onclick = () => handle(v);
    buttons.appendChild(b);
  });
}

/* =========================
   INPUT
========================= */
function handle(v){
  clickSound();
  vibrate();

  if(v === "=") return calc();
  if(v === "π") v = Math.PI;
  if(v === "^") v = "**";

  screen.innerText =
    screen.innerText === "0"
      ? v
      : screen.innerText + v;
}

/* =========================
   CALC SAFE ENGINE
========================= */
function calc(){
  try {
    let expr = screen.innerText;

    expr = expr
      .replace(/√\(/g, "Math.sqrt(")
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/%/g, "/100");

    let result = Function("return " + expr)();

    if (result === undefined || result === null || !isFinite(result)) {
      screen.innerText = "ERROR";
      return;
    }

    screen.innerText = result;

    history.unshift(expr + " = " + result);
    history = history.slice(0, 20);

    localStorage.setItem("darkcalc_safe", JSON.stringify(history));

    renderHistory();
    drawGraphSafe(expr);

  } catch(e){
    screen.innerText = "ERROR";
  }
}

/* =========================
   HISTORY
========================= */
function renderHistory(){
  historyList.innerHTML = "";

  history.forEach(h=>{
    let div = document.createElement("div");
    div.className = "historyItem";
    div.innerText = h;
    historyList.appendChild(div);
  });
}

/* =========================
   THEME SAFE
========================= */
function setTheme(t){
  if(t === "dark"){
    document.body.style.background = "#050505";
    document.body.style.color = "white";
  }

  if(t === "light"){
    document.body.style.background = "#eaeaea";
    document.body.style.color = "black";
  }

  if(t === "neon"){
    document.body.style.background = "#001111";
    document.body.style.color = "white";
  }
}

/* =========================
   GRAPH (SAFE VERSION)
========================= */
function toggleGraph(){
  graph.style.display =
    graph.style.display === "block" ? "none" : "block";
}

function drawGraphSafe(expr){
  try {
    let ctx = graph.getContext("2d");
    ctx.clearRect(0,0,400,200);

    ctx.beginPath();
    ctx.strokeStyle = "white";

    for(let x=0; x<80; x++){
      let y = 0;

      try {
        let safeExpr = expr.replace(/x/g, x/10);
        y = Function("return " + safeExpr)();
      } catch(e){
        y = 0;
      }

      let px = x * 4;
      let py = 80 - y * 10;

      if(x === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    ctx.stroke();
  } catch(e){}
}

/* =========================
   INIT
========================= */
render();
renderHistory();