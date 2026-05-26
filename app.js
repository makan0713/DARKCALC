let screen=document.getElementById("screen");
let buttons=document.getElementById("buttons");

let vault=document.getElementById("vault");
let pin=document.getElementById("pin");
let status=document.getElementById("status");
let mediaBox=document.getElementById("mediaBox");
let mediaInput=document.getElementById("mediaInput");

let mode="basic";

/* ---------------- KEYS ---------------- */
const basic=["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"];

const science=["sin(","cos(","tan(","√(","π","^","/","7","8","9","*","4","5","6","-","1","2","3","+","0",".","="];

function render(){
  buttons.innerHTML="";
  let arr=mode==="basic"?basic:science;

  arr.forEach(v=>{
    let b=document.createElement("button");
    b.innerText=v;
    if(["/","*","-","+"].includes(v)) b.classList.add("op");
    b.onclick=()=>press(v);
    buttons.appendChild(b);
  });
}

function press(v){
  vib();

  if(v==="=") return calc();

  screen.innerText=
    screen.innerText==="0"
    ? v
    : screen.innerText+v;
}

/* ---------------- SAFE CALC ---------------- */
function calc(){
  try{
    let expr=screen.innerText;

    expr=expr
      .replace(/√/g,"Math.sqrt")
      .replace(/π/g,Math.PI)
      .replace(/sin/g,"Math.sin")
      .replace(/cos/g,"Math.cos")
      .replace(/tan/g,"Math.tan")
      .replace(/\^/g,"**");

    let res=Function("return "+expr)();

    if(!isFinite(res)) throw 0;

    screen.innerText=res;

    checkSecret(expr);

  }catch{
    screen.innerText="ERROR";
  }
}

/* ---------------- VAULT ---------------- */
function toggleVault(){
  vault.style.display=vault.style.display==="block"?"none":"block";
}

/* PIN SYSTEM */
function setPIN(){
  let p=pin.value;
  if(p.length<4) return alert("Min 4 digits");

  localStorage.setItem("vault_pin",p);
  status.innerText="PIN saved ✔";
  pin.value="";
}

function unlock(){
  let saved=localStorage.getItem("vault_pin");
  if(!saved) return status.innerText="Set PIN first";

  if(pin.value===saved){
    status.innerText="Unlocked 🔓";
    renderMedia();
  }else{
    status.innerText="Wrong PIN ❌";
  }

  pin.value="";
}

/* ---------------- SECRET MODE ---------------- */
function checkSecret(expr){
  let pin=localStorage.getItem("vault_pin");

  if(pin && expr===pin){
    vault.style.display="block";
    screen.innerText="VAULT";
  }
}

/* ---------------- MEDIA VAULT ---------------- */
function addMedia(){
  let data=mediaInput.value;
  if(!data) return;

  let list=JSON.parse(localStorage.getItem("vault_data")||"[]");
  list.push(data);
  localStorage.setItem("vault_data",JSON.stringify(list));

  mediaInput.value="";
  renderMedia();
}

function renderMedia(){
  let list=JSON.parse(localStorage.getItem("vault_data")||"[]");

  mediaBox.innerHTML="";

  list.forEach((item,i)=>{
    let div=document.createElement("div");
    div.className="item";

    div.innerHTML=`
      <span>${item}</span>
      <button onclick="delItem(${i})">X</button>
    `;

    mediaBox.appendChild(div);
  });
}

function delItem(i){
  let list=JSON.parse(localStorage.getItem("vault_data")||"[]");
  list.splice(i,1);
  localStorage.setItem("vault_data",JSON.stringify(list));
  renderMedia();
}

/* ---------------- THEME ---------------- */
function setTheme(t){
  document.body.classList.remove("light","neon");

  if(t==="light") document.body.classList.add("light");
  if(t==="neon") document.body.classList.add("neon");
}

/* ---------------- VIBRATION ---------------- */
function vib(){
  if(navigator.vibrate) navigator.vibrate(10);
}

render();