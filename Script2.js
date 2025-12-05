/* CLOCK */
function updateClock(){
    document.getElementById("datetime").textContent=new Date().toLocaleString();
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
    return document.cookie.split("; ")
    .find(r=>r.startsWith(key))?.split("=")[1];
}

let user=getCookie("fname");

/* WELCOME */
if(user){
    welcomeUser.innerHTML="Welcome back, "+user;
    resetUser.style.display="inline";
}else{
    welcomeUser.innerHTML="Welcome New User!";
}

/* RESET USER */
resetUser.onclick=function(){
    localStorage.clear();
    document.cookie="fname=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    alert("User cleared — starting new session.");
    location.reload();
};

/* SAVE INPUTS */
document.querySelectorAll("input,select,textarea")
.forEach(el=>el.addEventListener("change",()=>localStorage.setItem(el.id,el.value)));

/* LOAD SAVED SESSION */
if(user){
    document.querySelectorAll("input,select,textarea").forEach(el=>{
        if(localStorage.getItem(el.id)) el.value=localStorage.getItem(el.id);
    });
}

/* SUBMIT ACTION */
patientForm.onsubmit=function(e){
    e.preventDefault();
    setCookie("fname",fname.value,2); // 48 Hrs

    if(!rememberMe.checked){
        localStorage.clear();
        document.cookie="fname=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }

    window.location.href="thankyou-1.html";
};

/* SLIDERS */
health.oninput=()=>healthValue.textContent=health.value;

salary.oninput=()=>salaryValue.textContent="$"+Number(salary.value).toLocaleString();

function updatePrice(){
    priceRange.value="$"+Number(minPrice.value).toLocaleString()
    +" – $"+Number(maxPrice.value).toLocaleString();
}
minPrice.oninput=updatePrice;
maxPrice.oninput=updatePrice;
updatePrice();

/* FETCH STATES */
fetch("states.json").then(r=>r.json()).then(data=>{
    data.forEach(s=>{state.innerHTML+=`<option>${s}</option>`});
});

/* FETCH TIPS */
fetch("health-tips.txt")
.then(r=>r.text())
.then(t=>t.split("\n").forEach(
    tip=>tipsList.innerHTML+=`<li>${tip}</li>`
));
