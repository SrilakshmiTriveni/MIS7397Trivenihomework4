// ================== CLOCK ==================
function updateClock(){
    document.getElementById("datetime").textContent = new Date().toLocaleString();
}
setInterval(updateClock,1000); updateClock();

// ================== COOKIE REMEMBER USER ==================
let user = getCookie("fname");

if(user){
    document.getElementById("welcomeUser").innerHTML = "Welcome back, " + user;
}else{
    document.getElementById("welcomeUser").innerHTML = "Welcome new user!";
}

function setCookie(name,val,days){
    let d=new Date();
    d.setTime(d.getTime()+ (days*24*60*60*1000));
    document.cookie = name+"="+val+";expires="+d.toUTCString()+";path=/";
}
function getCookie(name){
    let key=name+"=";
    return document.cookie.split("; ").find(row => row.startsWith(key))?.split("=")[1];
}

// ================== LOCAL STORAGE SAVE ON TYPING ==================
document.querySelectorAll("input,select").forEach(el=>{
    el.addEventListener("change",()=> localStorage.setItem(el.id,el.value));
});

// Load saved data if cookie exists
if(user){
    document.querySelectorAll("input,select").forEach(el=>{
        if(localStorage.getItem(el.id)) el.value = localStorage.getItem(el.id);
    });
}

// ================== SUBMIT ==================
document.getElementById("patientForm").addEventListener("submit",e=>{
    e.preventDefault();

    let fname=document.getElementById("fname").value;
    setCookie("fname", fname,2); // expires in 48 hrs

    if(!document.getElementById("rememberMe").checked){
        localStorage.clear(); document.cookie="fname=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }

    window.location.href="thankyou-1.html";
});

// ================== UPDATE HEALTH SLIDER ==================
document.getElementById("health").addEventListener("input",function(){
    document.getElementById("healthValue").textContent=this.value;
});

// ================== FETCH STATE LIST ==================
fetch("states.json")
.then(res=>res.json())
.then(data=>{
    let st=document.getElementById("state");
    data.forEach(s=>{
        let opt=document.createElement("option");
        opt.textContent=s;
        st.appendChild(opt);
    });
});

// ================== FETCH HEALTH TIPS ==================
fetch("health-tips.txt")
.then(r=>r.text())
.then(t=>{
    t.split("\n").forEach(tip=>{
        let li=document.createElement("li");
        li.textContent=tip;
        document.getElementById("tipsList").appendChild(li);
    });
});
