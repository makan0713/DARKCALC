let screen = document.getElementById("screen");
let buttons = document.getElementById("buttons");
let graph = document.getElementById("graph");
let aiInput = document.getElementById("aiInput");
let aiResult = document.getElementById("aiResult");

let mode = "basic";

/* ---------------- SOUND ---------------- */
let ctx;
function sound(){
  try{
    if(!ctx) ctx = new (window.AudioContext||window.webkitAudioContext)();

    let o = ctx.createOscillator();
    let g = ctx.createGain();

    o.frequency.value = 650;
    g.gain.value = 0.05;

    o.connect(g);
    g.connect(ctx.destination);

    o.start();
    o.stop(ctx.currentTime + 0.05);
  }catch{}
}

/* ---------------- VIBRATION ---------------- */
function vib(){
  if(navigator.vibrate) navigator.vibrate(10);
}

/* ---------------- BUTTONS ---------------- */
const basic = [
"7","8","9","/",
"4","5","6","*",
"1","2","3","-",
"0",".","=","+"
];

const science = [
"sin(","cos(","tan(","√(",
"π","^","/",
"7","8","9","*",
"4","5","6","-",
"1","2","3","+",
"0",".","="
];

function render(){
  buttons.innerHTML="";
  let arr = mode==="basic"?basic:science;

  arr.forEach(v=>{
    let b=document.createElement("button");
    b.innerText=v;

    if(["/","*","-","+"].includes(v)) b.classList.add("op");

    b.onclick=()=>press(v);
    buttons.appendChild(b);
  });
}

/* ---------------- INPUT ---------------- */
function press(v){
  sound();
  vib();

  if(v==="=") return calc();

  screen.innerText =
    screen.innerText==="0"
    ? v
    : screen.innerText + v;
}

/* ---------------- CALC ---------------- */
function calc(){
  try{
    let expr = screen.innerText;

    expr = expr
      .replace(/√/g,"Math.sqrt")
      .replace(/π/g,Math.PI)
      .replace(/sin/g,"Math.sin")
      .replace(/cos/g,"Math.cos")
      .replace(/tan/g,"Math.tan")
      .replace(/\^/g,"**");

    let res = Function("return "+expr)();

    if(!isFinite(res)) throw 0;

    screen.innerText = res;

    drawGraph();

  }catch{
    screen.innerText="ERROR";
  }
}

/* ---------------- CLEAR FUNCTIONS ---------------- */
function clearAll(){
  screen.innerText = "0";
}

function backspace(){
  if(screen.innerText.length <= 1){
    screen.innerText = "0";
  } else {
    screen.innerText = screen.innerText.slice(0,-1);
  }
}

/* ---------------- MODE ---------------- */
function setMode(m){
  mode=m;
  render();
}

/* ---------------- GRAPH ---------------- */
function toggleGraph(){
  graph.style.display =
    graph.style.display==="block"?"none":"block";
}

function drawGraph(){
  let c = graph.getContext("2d");
  c.clearRect(0,0,400,200);

  c.beginPath();
  c.strokeStyle="white";

  for(let x=-20;x<20;x++){
    let y = x*x/50;

    let px = 170 + x*5;
    let py = 80 - y*10;

    if(x===-20) c.moveTo(px,py);
    else c.lineTo(px,py);
  }

  c.stroke();
}

/* ---------------- THEME ---------------- */
function setTheme(t){
  document.body.classList.remove("light","neon");

  if(t==="light") document.body.classList.add("light");
  if(t==="neon") document.body.classList.add("neon");
}

/* ---------------- AI MOCK ---------------- */
function askAI(){
  let q = aiInput.value;
  if(!q) return;

  aiResult.innerText="Thinking...";

  setTimeout(()=>{
    aiResult.innerText =
      "AI: I can help with math → try sin(30), √16, 2+2";
  },600);
}

/* INIT */
render();
drawGraph();