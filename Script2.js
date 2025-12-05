/* CLOCK */
function updateClock(){
    document.getElementById("datetime").textContent = new Date().toLocaleString();
}
setInterval(updateClock,1000);updateClock();

/* COOKIE FUNCTIONS */
function setCookie(name,val,days){
    let d=new Date();
    d.setTime(d.getTime()+days*24*60*60*1000);
    document.cookie=name+"="+val+";expires="+d.toUTCString()+";path=/";
}
function getCookie(name){
    let key=name+"=";
    return document.cookie.split("; ").find(r=>r.startsWith(key))?.split("=")[1];
}

let user=getCookie("fname");

/* SHOW WELCOME */
if(user){
    welcomeUser.innerHTML="Welcome back, "+user;
    resetUser.style.display="inline";
}else{
    welcomeUser.innerHTML="Welcome New User!";
}

/* ===== RESET USER FEATURE ===== */
resetUser.onclick=function(){
    localStorage.clear();
    document.cookie="fname=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    alert("User cleared — starting fresh");
    location.reload();
};

/* LOCAL STORAGE SAVE */
document.querySelectorAll("input,select").forEach(el=>{
    el.addEventListener("change",()=> localStorage.setItem(el.id,el.value));
});

/* LOAD PREVIOUS SESSION */
if(user){
    document.querySelectorAll("input,select").forEach(el=>{
        if(localStorage.getItem(el.id)) el.value=localStorage.getItem(el.id);
    });
}

/* SUBMIT */
patientForm.onsubmit=function(e){
    e.preventDefault();
    let fname=document.getElementById("fname").value;
    setCookie("fname",fname,2);

    if(!rememberMe.checked){
        localStorage.clear();
        document.cookie="fname=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
    window.location.href="thankyou-1.html";
};

/* SLIDER DISPLAY */
health.oninput=()=>healthValue.textContent=health.value;

/* FETCH STATES */
fetch("states.json").then(r=>r.json()).then(data=>{
    data.forEach(s=>{
        let o=document.createElement("option");
        o.textContent=s;state.appendChild(o);
    });
});

/* FETCH TIPS */
fetch("health-tips.txt").then(r=>r.text()).then(t=>{
    t.split("\n").forEach(tip=>{
        let li=document.createElement("li");
        li.textContent=tip;
        tipsList.appendChild(li);
    });
});
