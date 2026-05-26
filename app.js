let screen=document.getElementById("screen");
let buttons=document.getElementById("buttons");

let vault=document.getElementById("vault");
let pin=document.getElementById("pin");
let status=document.getElementById("status");
let mediaBox=document.getElementById("mediaBox");
let mediaInput=document.getElementById("mediaInput");

let mode="basic";

/* KEYS */
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
  if(v==="=") return calc();

  screen.innerText =
    screen.innerText==="0"
    ? v
    : screen.innerText+v;
}

/* CALC SAFE */
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

    screen.innerText=res;

    checkVaultTrigger(expr);

  }catch{
    screen.innerText="ERROR";
  }
}

/* MODE */
function setMode(m){
  mode=m;
  render();
}

/* THEME FIX */
function setTheme(t){
  document.body.classList.remove("light","neon");
  if(t==="light") document.body.classList.add("light");
  if(t==="neon") document.body.classList.add("neon");
}

/* VAULT */
function toggleVault(){
  vault.style.display=vault.style.display==="block"?"none":"block";
}

/* PIN */
function setPIN(){
  if(pin.value.length<4){
    alert("Min 4 digits");
    return;
  }

  localStorage.setItem("vp_pin",pin.value);
  status.innerText="PIN saved ✔";
  pin.value="";
}

function unlock(){
  let saved=localStorage.getItem("vp_pin");

  if(!saved){
    status.innerText="Set PIN first";
    return;
  }

  if(pin.value===saved){
    status.innerText="Unlocked 🔓";
    renderItems();
  }else{
    status.innerText="Wrong PIN ❌";
  }

  pin.value="";
}

/* SECRET TRIGGER */
function checkVaultTrigger(expr){
  let pin=localStorage.getItem("vp_pin");

  if(pin && expr===pin){
    vault.style.display="block";
    screen.innerText="VAULT";
  }
}

/* MEDIA SYSTEM */
function addItem(){
  if(!mediaInput.value) return;

  let data=JSON.parse(localStorage.getItem("vp_data")||"[]");
  data.push(mediaInput.value);

  localStorage.setItem("vp_data",JSON.stringify(data));

  mediaInput.value="";
  renderItems();
}

function renderItems(){
  let data=JSON.parse(localStorage.getItem("vp_data")||"[]");

  mediaBox.innerHTML="";

  data.forEach((x,i)=>{
    let div=document.createElement("div");
    div.className="item";

    div.innerHTML=`
      <span>${x}</span>
      <button onclick="del(${i})">X</button>
    `;

    mediaBox.appendChild(div);
  });
}

function del(i){
  let data=JSON.parse(localStorage.getItem("vp_data")||"[]");
  data.splice(i,1);

  localStorage.setItem("vp_data",JSON.stringify(data));
  renderItems();
}

render();