let screen = document.getElementById("screen");
let buttons = document.getElementById("buttons");
let historyList = document.getElementById("historyList");
let graph = document.getElementById("graph");

let mode = "basic";

let history = JSON.parse(localStorage.getItem("dc")) || [];

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
  buttons.innerHTML="";
  let arr = mode==="scientific"?scientific:basic;

  arr.forEach(v=>{
    let b=document.createElement("button");
    b.innerText=v;

    if(["/","*","-","+","="].includes(v))
      b.classList.add("op");

    b.onclick=()=>handle(v);
    buttons.appendChild(b);
  });
}

function setMode(m){
  mode=m;
  render();
}

function handle(v){
  if(v==="=") return calc();
  if(v==="π") v=Math.PI;
  if(v==="^") v="**";

  screen.innerText =
    screen.innerText==="0"
    ? v
    : screen.innerText + v;
}

function calc(){
  try{
    let expr = screen.innerText
      .replace(/√\(/g,"Math.sqrt(")
      .replace(/sin\(/g,"Math.sin(")
      .replace(/cos\(/g,"Math.cos(")
      .replace(/tan\(/g,"Math.tan(")
      .replace(/%/g,"/100");

    let result = eval(expr);

    screen.innerText = result;

    history.unshift(expr+" = "+result);
    history = history.slice(0,20);

    localStorage.setItem("dc",JSON.stringify(history));

    renderHistory();
    drawGraph(expr);

  }catch{
    screen.innerText="ERROR";
  }
}

function renderHistory(){
  historyList.innerHTML="";
  history.forEach(h=>{
    let d=document.createElement("div");
    d.className="historyItem";
    d.innerText=h;
    d.onclick=()=>screen.innerText=h.split("=")[0];
    historyList.appendChild(d);
  });
}

function toggleGraph(){
  graph.style.display =
    graph.style.display==="block"?"none":"block";
}

function drawGraph(expr){
  let ctx = graph.getContext("2d");
  ctx.clearRect(0,0,400,200);

  ctx.beginPath();
  ctx.strokeStyle="white";

  for(let x=0;x<100;x++){
    let y=0;
    try{
      y=eval(expr.replace(/x/g,x/10));
    }catch{}

    let px=x*3;
    let py=80-y*10;

    if(x===0) ctx.moveTo(px,py);
    else ctx.lineTo(px,py);
  }

  ctx.stroke();
}

render();
renderHistory();