const $=s=>document.querySelector(s),LS='lmp.wishes.v1';
const Q=[["where","Where are you in this picture? Name the place, and how it looks from where you stand."],["who","Who is with you? Or are you alone?"],["day","What does a normal day look like here, start to finish?"],["see","What do you see around you? Colours, light, objects."],["hear","What do you hear? And what do you feel inside?"]];
const mine=()=>JSON.parse(localStorage.getItem(LS)||'[]');
let seed=[];
// background particles
(function(){const c=$('#bg'),x=c.getContext('2d');let P=[];function r(){c.width=innerWidth;c.height=innerHeight;P=Array.from({length:Math.min(80,innerWidth/10)},()=>({x:Math.random()*c.width,y:Math.random()*c.height,v:Math.random()*.4+.1}))}r();addEventListener('resize',r);
(function f(){x.clearRect(0,0,c.width,c.height);x.fillStyle='rgba(39,232,255,.5)';P.forEach(p=>{p.y-=p.v;if(p.y<0)p.y=c.height;x.fillRect(p.x,p.y,1.5,1.5)});requestAnimationFrame(f)})()})();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function type(el,t,sp=18){for(const ch of t){el.textContent+=ch;await sleep(sp)}}
async function boot(){const L=["J.A.R.V.I.S. CORE v7.2","> initialising neural lattice ........ OK","> loading visual cortex .............. OK","> calibrating imagination engine ..... OK","> operator: ANKIT SINGH · BANGALORE","","ALL SYSTEMS ONLINE. WELCOME BACK, SIR."];const p=$('#bootlog');
$('#boot').onclick=()=>{skip=true};let skip=false;for(const l of L){if(skip){p.textContent+=l+"\n";continue}await type(p,l+"\n",10)}
await sleep(skip?0:500);$('#boot').style.opacity=0;$('#app').hidden=false;setTimeout(()=>$('#boot').remove(),800)}
async function load(){try{seed=await (await fetch('wishes.json?'+Date.now())).json()}catch(e){seed=[]}}
const all=()=>{const m=mine(),ids=new Set(m.map(w=>w.id));return [...m,...seed.filter(w=>!ids.has(w.id))]};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function imgs(w,mat){const im=w.images&&w.images.length?w.images:null;return [0,1,2].map(i=>im&&im[i]?`<div class="img ${mat?'mat':''}">${w.placeholder?'<span class="lab">PLACEHOLDER ART</span>':''}<img loading="lazy" src="${esc(im[i])}" alt="${esc(w.title)} ${i+1}"></div>`:`<div class="img"><div class="pend">▲ IMAGE PENDING<br>awaiting render</div></div>`).join('')}
function gallery(){const g=$('#gallery'),a=all();g.className='grid';g.innerHTML=a.length?a.map(w=>{const i=w.images&&w.images[0];return `<div class="card" data-id="${w.id}"><div class="img mat">${i?`${w.placeholder?'<span class="lab">PLACEHOLDER ART</span>':''}<img loading="lazy" src="${esc(i)}">`:'<div class="pend">▲ IMAGE PENDING</div>'}</div><div class="t"><span class="tag">${esc(w.type||'wish')}</span><h3>${esc(w.title)}</h3></div></div>`}).join(''):'<p>No wishes yet. Initiate a new one.</p>';
g.querySelectorAll('.card').forEach(c=>c.onclick=()=>detail(c.dataset.id))}
function detail(id){const w=all().find(x=>x.id==id);show('detail');const d=$('#detail');d.innerHTML=`<button id="back">◂ Back</button><h2 style="color:#fff">${esc(w.title)}</h2><span class="tag">${esc(w.type)}</span><div class="three">${imgs(w,true)}</div>${w.images?.length?'':'<p class="ai">Images pending — the scene prompt is saved; export JSON and hand it over for rendering.</p>'}<h4>SCENE PROMPT</h4><pre class="pr">${esc(w.prompt)}</pre>`;$('#back').onclick=()=>show('gallery')}
function show(v){['gallery','new','detail'].forEach(s=>$('#'+s).hidden=s!=v);document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.v==v));if(v=='gallery')gallery()}
function compose(t,ty,a){return `Cinematic, photorealistic scene of a 23-year-old Indian man from Bangalore living this ${ty}: "${t}". Location: ${a.where}. With him: ${a.who}. A typical day: ${a.day}. He sees: ${a.see}. Sounds and feeling: ${a.hear}. Natural light, shallow depth of field, 35mm, emotionally vivid, no text.`}
let flow=null;
async function ai(t){const p=document.createElement('p');p.className='m ai';$('#chat').append(p);await type(p,t,14);$('#chat').scrollTop=1e9}
function me(t){const p=document.createElement('p');p.className='m me';p.textContent=t;$('#chat').append(p)}
async function start(){$('#chat').innerHTML='';flow={step:-2,a:{}};await ai("Ready to capture a new mental picture. What do you wish for? (e.g. 'Month at Network School', 'Run a marathon', 'First ₹1Cr')")}
$('#f').onsubmit=async e=>{e.preventDefault();const v=$('#in').value.trim();if(!v||!flow||flow.busy)return;$('#in').value='';me(v);flow.busy=1;
if(flow.step==-2){flow.title=v;flow.step=-1;await ai("Category? trip / goal / milestone / lifestyle")}
else if(flow.step==-1){flow.type=v.toLowerCase();flow.step=0;await ai(`Understood. Five quick scans. ${Q[0][1]}`)}
else{flow.a[Q[flow.step][0]]=v;flow.step++;if(flow.step<Q.length)await ai(Q[flow.step][1]);else{const w={id:'w'+Date.now(),title:flow.title,type:flow.type,createdAt:new Date().toISOString().slice(0,10),answers:flow.a,prompt:compose(flow.title,flow.type,flow.a),images:[]};const m=mine();m.unshift(w);localStorage.setItem(LS,JSON.stringify(m));flow=null;await ai("Scene composed and saved. Rendering needs the image engine — status: IMAGES PENDING. Opening your wish…");await sleep(900);detail(w.id);return}}
flow.busy=0};
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{const v=b.dataset.v;if(v=='export'){const u=URL.createObjectURL(new Blob([JSON.stringify(all(),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='wishes.json';a.click();return}show(v);if(v=='new')start()});
(async()=>{await load();gallery();boot()})();
