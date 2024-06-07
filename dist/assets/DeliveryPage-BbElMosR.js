import{E as ce,b as ie,m as oe,_ as K,r as Q,o as R,c as W,a as t,d as k,w as E,F as le,f as se,e as D,p as X,g as Z,N as de}from"./index-D5IhssbA.js";const re={methods:{open1(){ce({title:"Интервал выбран",message:'Нажмите "сохранить"',type:"success"})},open2(){ie({message:"Вынос отменен!",type:"success"})}},data(){return{infoData:null,userID:null}},computed:{...oe(["getUserId"])},created(){this.userID=this.getUserId},mounted(){const v=document.querySelector(".calendar h3"),C=document.querySelector(".dates"),I=document.querySelectorAll("#prev, #next"),h=document.querySelector(".development__info"),u=document.querySelector(".description__date"),c=document.querySelector(".description__btn"),i=document.querySelector(".description__cancel"),_=document.querySelector(".cancel__btn"),w=document.querySelector(".description__status"),T=this.getUserId,ee=["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];let j=new Date,l=j.getMonth(),m=j.getFullYear();async function M(){let L=await(await fetch(`https://musorok.online:8000/client_info/schedule_delivery/${T}`)).json();console.log(L);let q=new Date(m,l,1).getDay()||7,B=new Date(m,l+1,0).getDate(),A=new Date(m,l,B).getDay(),te=new Date(m,l,0).getDate(),$="",J="",P="",V="",F="",U="",Y="";for(let e=q-1;e>0;e--)$+=`<li class="inactive">${te-e+1}</li>`;for(let e=1;e<=B;e++){let n="";L.forEach(s=>{let H=s.date.slice(-2),y=s.status.toLowerCase(),d=s.date.slice(5,7);if(parseInt(H)===e&&parseInt(d)===l+1)switch(y){case"done":n="done";break;case"canceling":n="canceling";break;case"waiting":n="waiting";break;default:n=""}}),e===new Date().getDate()&&l===new Date().getMonth()&&m===new Date().getFullYear()&&(n+=" today activeDay");let r=n!==""?` class="${n}"`:"";$+=`<li${r}>${e}</li>`}for(let e=A+1;e<7;e++)$+=`<li class="inactive">${e-A}</li>`;C.innerHTML=$,v.textContent=`${ee[l]} ${m}`;let f={id:null};document.querySelector(".dates").addEventListener("click",function(e){if(e.target.tagName==="LI"){let n=e.target.textContent,r=l+1,s=m;document.querySelectorAll(".activeDay").forEach(g=>{g.classList.remove("activeDay")}),e.target.classList.add("activeDay"),n<10&&(n="0"+n),r<10&&(r="0"+r);let y=`${s}-${r}-${n}`,d=L.find(g=>g.date===y);d?(console.log("Clicked Date Info:",d),f.id=d.id,h.innerHTML="",d.interval&&(J=`<p>Интервал: ${d.interval}</p>`,h.innerHTML=J,Y=`<p class="${d.status}">${d.status_ru}</p>`,w.innerHTML=Y)):console.log("No information available for the clicked date."),n>new Date().getDate()?(P="<p>Вы можете изменить временной интервал выноса мусора для выбранного дня или для всех дней до конца окончания подписки.</p>",u.innerHTML=P,V=`<button class='one__day'>Изменить выбранный день</button><button class="all__day">Изменить для всех дней</button>`,c.innerHTML=V,F="<p>Если в какой-то день вы будете отсутствовать дома или не захотите, чтобы пришёл курьер, можете отменить вынос мусора. Выберите дату и нажмите «Отменить».</p>",i.innerHTML=F,U="<button class='cancel__delivery'>Отменить вынос мусора</button>",_.innerHTML=U,L.length>0?d?d.status==="Canceling"&&(u.innerHTML="",c.innerHTML="",i.innerHTML="",_.innerHTML=""):(u.innerHTML="",c.innerHTML="",i.innerHTML="",_.innerHTML=""):L.length===0&&(u.innerHTML="",c.innerHTML="",i.innerHTML="",_.innerHTML=""),ne()):(u.innerHTML="",c.innerHTML="",i.innerHTML="",_.innerHTML="")}});function ne(){const e=document.querySelector(".one__day"),n=document.querySelector(".all__day"),r=document.querySelector(".cancel__delivery"),s=document.querySelector(".modal"),H=document.querySelectorAll(".modal__variants");e==null||e.removeEventListener("click",g),n==null||n.removeEventListener("click",G),r==null||r.removeEventListener("click",z),e==null||e.addEventListener("click",g),n==null||n.addEventListener("click",G),r==null||r.addEventListener("click",z);const y=document.querySelector(".btn__cancel"),d=document.querySelector(".btn__save");async function g(){s.style.display="flex",y.addEventListener("click",function(){s.style.display="none"});for(let o of H)o.addEventListener("click",function S(){let b=o.firstElementChild.textContent.trim();document.querySelectorAll(".activeColor").forEach(a=>{a.classList.remove("activeColor")}),event.target.classList.add("activeColor"),o.firstElementChild.classList.add("activeColor"),o.classList.add("activeColor"),console.log(f.id),console.log(b),d.addEventListener("click",async function(){await fetch(`https://musorok.online:8000/update_delivery_intervals/${T}`,{method:"POST",headers:{"Content-Type":"application/json",accept:"application/json"},body:JSON.stringify({all_day:!1,id:f.id,interval:JSON.parse(b)})}).then(a=>{if(!a.ok)throw new Error("Ошибка при выполнении запроса");return a.json()}).then(a=>{console.log("Обновил:",a),h.innerHTML="<p>Нажмите еще раз</p>",w.innerHTML="",u.innerHTML="",c.innerHTML="",i.innerHTML="",_.innerHTML="",s.style.display="none",M()}).catch(a=>{console.error("Ошибка при обновлении значений переключения:",a)})}),y.addEventListener("click",function(){s.style.display="none"}),o.removeEventListener("click",S)})}async function G(){s.style.display="flex",y.addEventListener("click",function(){s.style.display="none"});for(let o of H)o.addEventListener("click",async function S(){let b=o.firstElementChild.textContent.trim();document.querySelectorAll(".activeColor").forEach(a=>{a.classList.remove("activeColor")}),event.target.classList.add("activeColor"),o.firstElementChild.classList.add("activeColor"),o.classList.add("activeColor"),console.log(f.id),console.log(b),d.addEventListener("click",async function(){await fetch(`https://musorok.online:8000/update_delivery_intervals/${T}`,{method:"POST",headers:{"Content-Type":"application/json",accept:"application/json"},body:JSON.stringify({all_day:!0,id:f.id,interval:JSON.parse(b)})}).then(a=>{if(!a.ok)throw new Error("Ошибка при выполнении запроса");return a.json()}).then(a=>{console.log("Обновил:",a),h.innerHTML="<p>Нажмите еще раз</p>",w.innerHTML="",u.innerHTML="",c.innerHTML="",i.innerHTML="",_.innerHTML="",s.style.display="none",M()}).catch(a=>{console.error("Ошибка при обновлении значений переключения:",a)})}),y.addEventListener("click",function(){s.style.display="none"}),o.removeEventListener("click",S)})}async function z(){const o=document.querySelector(".modal__cancel"),S=document.querySelector(".description__p"),b=document.querySelector(".button__cancel"),N=document.querySelector(".button__save"),a=document.querySelector(".cancel__description");o.style.display="block";let ae=await(await fetch(`https://musorok.online:8000/client_info/schedule_delivery/${T}`)).json();for(let p of ae)p.id===f.id&&(console.log("нашел",p.interval),S.innerHTML=`<p>Данное действие нельзя будет отменить, вы точно хотите отменить вынос на ${p.date}?</p>`);console.log({id:f.id,status:"Canceling"}),b.addEventListener("click",function(){o.style.display="none"}),N.addEventListener("click",async function(){await fetch(`https://musorok.online:8000/cancel_delivery/${T}`,{method:"POST",headers:{"Content-Type":"application/json",accept:"application/json"},body:JSON.stringify({id:f.id,status:"Canceling"})}).then(p=>{if(!p.ok)throw new Error("Ошибка при выполнении запроса");return p.json()}).then(p=>{console.log("Обновил:",p),h.innerHTML="<p>Нажмите еще раз</p>",w.innerHTML="",u.innerHTML="",c.innerHTML="",i.innerHTML="",_.innerHTML="",o.style.display="none",setTimeout(()=>{a.style.display="none"},1500),M()}).catch(p=>{console.error("Ошибка при обновлении значений переключения:",p),o.style.display="none",setTimeout(()=>{a.style.display="none"},1500)})})}}}I.forEach(O=>{O.addEventListener("click",L=>{const q=L.target.id;q==="prev"?l===0?(m--,l=11):l--:q==="next"&&(l===11?(m++,l=0):l++),M()})}),M()}},x=v=>(X("data-v-526b311c"),v=v(),Z(),v),ve=se('<div class="delivery" data-v-526b311c><div class="calendar" data-v-526b311c><header data-v-526b311c><h3 data-v-526b311c></h3><nav data-v-526b311c><button id="prev" data-v-526b311c></button><button id="next" data-v-526b311c></button></nav></header><section data-v-526b311c><ul class="days" data-v-526b311c><li data-v-526b311c>Пн</li><li data-v-526b311c>Вт</li><li data-v-526b311c>Ср</li><li data-v-526b311c>Чт</li><li data-v-526b311c>Пт</li><li data-v-526b311c>Сб</li><li data-v-526b311c>Вс</li></ul><ul class="dates" data-v-526b311c></ul></section></div><div class="calendar__description" data-v-526b311c><div class="development__info" data-v-526b311c></div><div class="description__status" data-v-526b311c></div><div class="description" data-v-526b311c><div class="description__date" data-v-526b311c></div><div class="description__btn" data-v-526b311c></div></div><div class="description__cancel" data-v-526b311c></div><div class="cancel__btn" data-v-526b311c></div></div></div>',1),ue={class:"modal"},_e={class:"calendar__modal"},pe={class:"modal__variants"},me={class:"modal__variants"},fe={class:"modal__variants"},ye={class:"modal__variants"},he={class:"modal__variants"},Le=x(()=>t("div",{class:"modal__btn"},[t("div",{class:"btn__cancel"},[t("button",null,"Отменить")]),t("div",{class:"btn__save"},[t("button",null,"Сохранить")])],-1)),be={class:"modal__cancel"},ge={class:"cancel__description"},ke=x(()=>t("div",{class:"description__p"},null,-1)),Ce={class:"cancel__button"},Te=x(()=>t("div",{class:"button__cancel"},[t("button",null,"Отменить")],-1)),Me={class:"button__save"};function He(v,C,I,h,u,c){const i=Q("el-button");return R(),W(le,null,[ve,t("div",ue,[t("div",_e,[t("div",pe,[k(i,{class:"variant",plain:"",onClick:c.open1},{default:E(()=>[D('"09:00-12:00" ')]),_:1},8,["onClick"])]),t("div",me,[k(i,{class:"variant",plain:"",onClick:c.open1},{default:E(()=>[D('"12:00-15:00"')]),_:1},8,["onClick"])]),t("div",fe,[k(i,{class:"variant",plain:"",onClick:c.open1},{default:E(()=>[D('"15:00-18:00"')]),_:1},8,["onClick"])]),t("div",ye,[k(i,{class:"variant",plain:"",onClick:c.open1},{default:E(()=>[D('"18:00-21:00"')]),_:1},8,["onClick"])]),t("div",he,[k(i,{class:"variant",plain:"",onClick:c.open1},{default:E(()=>[D('"09:00-21:00"')]),_:1},8,["onClick"])]),Le])]),t("div",be,[t("div",ge,[ke,t("div",Ce,[Te,t("div",Me,[t("button",{plain:!1,onClick:C[0]||(C[0]=(..._)=>c.open2&&c.open2(..._))},"Сохранить")])])])])],64)}const Se=K(re,[["render",He],["__scopeId","data-v-526b311c"]]),Ee={components:{Calendar:Se,NavigationMenu:de}},De=v=>(X("data-v-cd6d71fa"),v=v(),Z(),v),we={class:"delivery"},qe=De(()=>t("div",{class:"delivery__title"},[t("h1",null,"График выноса мусора")],-1));function $e(v,C,I,h,u,c){const i=Q("Calendar");return R(),W("div",we,[qe,k(i)])}const je=K(Ee,[["render",$e],["__scopeId","data-v-cd6d71fa"]]);export{je as default};