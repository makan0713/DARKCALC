let screen=document.getElementById("screen");
let buttons=document.getElementById("buttons");

let overlay=document.getElementById("vaultOverlay");
let status=document.getElementById("status");
let pinInput=document.getElementById("pinInput");
let fileInput=document.getElementById("fileInput");
let vaultBox=document.getElementById("vaultBox");
let search=document.getElementById("search");

let input="";

const keys=["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"];

/* CALC UI */
keys.forEach(k=>{
  let b=document.createElement("button");
  b.innerText=k;

  b.onclick=()=>press(k);
  buttons.appendChild(b);
});

function press(v){
  if(v==="=") return calc();

  input += v;
  screen.innerText=input || "0";
}

/* SAFE CALC FIX (NO BUG) */
function calc(){
  try{
    let expr=input;

    expr=expr
      .replace(/√/g,"Math.sqrt")
      .replace(/π/g,"Math.PI")
      .replace(/\^/g,"**");

    let result = Function(`"use strict"; return (${expr})`)();

    if(!isFinite(result)) throw 0;

    screen.innerText=result;
    input="";

  }catch{
    screen.innerText="ERROR";
    input="";
  }
}

/* ================= VAULT GOD MODE ================= */

function setPIN(){
  if(pinInput.value.length<4){
    status.innerText="Min 4 digits";
    return;
  }

  localStorage.setItem("god_pin",pinInput.value);
  status.innerText="PIN SET ✔";
  pinInput.value="";
}

function unlock(){
  let pin=localStorage.getItem("god_pin");

  if(!pin){
    status.innerText="Set PIN first";
    return;
  }

  if(pinInput.value===pin){
    overlay.style.display="flex";
    status.innerText="UNLOCKED 🔓";
  }else{
    status.innerText="WRONG ❌";
  }

  pinInput.value="";
}

/* AUTO TRIGGER (STEALTH ENTRY) */
function checkSecret(){
  let pin=localStorage.getItem("god_pin");

  if(pin && input===pin){
    overlay.style.display="flex";
    screen.innerText="VAULT";
    input="";
  }
}

/* FILE SYSTEM (REAL) */
let files=JSON.parse(localStorage.getItem("god_files")||"[]");

function uploadFile(){
  let file=fileInput.files[0];
  if(!file) return;

  let reader=new FileReader();

  reader.onload=function(){
    files.push({
      name:file.name,
      data:reader.result
    });

    localStorage.setItem("god_files",JSON.stringify(files));
    renderFiles();
  };

  reader.readAsDataURL(file);
}

/* AI SEARCH (LOCAL MOCK ENGINE) */
function searchVault(){
  let q=search.value.toLowerCase();

  let res=files.filter(f=>f.name.toLowerCase().includes(q));

  vaultBox.innerHTML="<h4>Results:</h4>";

  res.forEach(f=>{
    vaultBox.innerHTML += `
      <div class="file">
        📄 ${f.name}
      </div>
    `;
  });
}

function renderFiles(){
  vaultBox.innerHTML="<h4>Files:</h4>";

  files.forEach(f=>{
    vaultBox.innerHTML += `
      <div class="file">
        📄 ${f.name}
      </div>
    `;
  });
}

/* LOOP CHECK (STEALTH PIN DETECTION) */
setInterval(checkSecret,300);

renderFiles();