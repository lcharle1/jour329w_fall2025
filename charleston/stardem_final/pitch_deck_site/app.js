const DATA_PATH = '../filtered_stories3.json';
const state = {points:0,streak:0};

function $(s){return document.querySelector(s)}
function $all(s){return Array.from(document.querySelectorAll(s))}

// Navigation
$all('.deck-nav button').forEach(b=>b.addEventListener('click',e=>{
  $all('.deck-nav button').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  showSlide(b.dataset.slide);
}))

function showSlide(id){
  $all('.slide').forEach(s=>s.classList.remove('active'));
  const el = document.getElementById(id);
  if(el) el.classList.add('active');
}

function loadPoints(){
  const p = localStorage.getItem('pd_points');
  const s = localStorage.getItem('pd_streak');
  state.points = p?parseInt(p):0; state.streak = s?parseInt(s):0;
  $('#points').textContent = state.points; $('#streak').textContent = state.streak;
}
function savePoints(){
  localStorage.setItem('pd_points',state.points); localStorage.setItem('pd_streak',state.streak);
  $('#points').textContent = state.points; $('#streak').textContent = state.streak;
}

function award(n){ state.points += n; state.streak += 1; savePoints(); }
function penalize(){ state.streak = 0; savePoints(); }

// Helpers to extract items from dataset
function summarizeThemes(stories){
  const counts = {};
  stories.forEach(s=>{
    const t = s.llm_classification && s.llm_classification.topic ? s.llm_classification.topic : 'Other';
    counts[t] = (counts[t]||0)+1;
  });
  const entries = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  return entries.map(e=>({topic:e[0],count:e[1]}));
}

function extractInstitutions(stories){
  const keywords=['Health Department','Health','Fire Department','Volunteer Fire','Sheriff','Police','Hospital','Foundation','Center','Clinic','Department of Health','State Fire Marshal','Emergency Services','MedStar','Shore Regional Health'];
  const found = {};
  stories.forEach(s=>{
    const txt = (s.title+' '+s.content).toLowerCase();
    keywords.forEach(k=>{
      if(txt.includes(k.toLowerCase())) found[k] = (found[k]||0)+1;
    })
  });
  return Object.entries(found).sort((a,b)=>b[1]-a[1]).map(e=>({name:e[0],count:e[1]}));
}

function extractPeople(stories){
  const people = {};
  stories.forEach(s=>{
    if(s.author){ people[s.author] = (people[s.author]||0)+1 }
    // simple name regex
    const matches = (s.content||'').match(/([A-Z][a-z]+\s[A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/g);
    if(matches){ matches.forEach(m=>{ if(m.length<40) people[m]=(people[m]||0)+1 }) }
  })
  return Object.entries(people).sort((a,b)=>b[1]-a[1]).slice(0,60).map(e=>({name:e[0],count:e[1]}));
}

function makeStoryList(stories){
  const container = $('#storyList'); container.innerHTML='';
  stories.forEach(s=>{
    const div = document.createElement('div'); div.className='story';
    const date = new Date(s.date);
    div.innerHTML = `<strong>${s.title}</strong> <span class="pill">${s.llm_classification?.topic||'News'}</span>
      <div style="color:#556;">${s.author||''} — ${s.date}</div>
      <p>${(s.content||'').slice(0,280).replace(/\n/g,' ')}...</p>
      <a href="#" data-idx="${s.article_id}" class="btn-small view">Open</a>`;
    container.appendChild(div);
  })
  // Attach basic open handler: just show full content in a modal-like alert for now
  container.querySelectorAll('.view').forEach(btn=>btn.addEventListener('click',e=>{
    e.preventDefault(); const id = btn.dataset.idx; const found = stories.find(x=>x.article_id===id);
    if(found) alert(found.title + '\n\n' + found.content.slice(0,2000));
  }))
}

function makeThemesSection(themes,stories){
  const node = $('#themesList'); node.innerHTML='';
  themes.forEach(t=>{
    const el = document.createElement('div');
    el.innerHTML = `<h3>${t.topic} — ${t.count} stories</h3>`;
    // use examples
    const examples = stories.filter(s=> (s.llm_classification?.topic||'')===t.topic).slice(0,3);
    const p = document.createElement('p');
    p.textContent = `Why it matters: ${t.topic} stories shape public understanding and policy responses on health, emergency services, and safety. Typical stakeholders: local health departments, volunteer fire departments, sheriff's offices, hospitals, and community nonprofits.`;
    el.appendChild(p);
    if(examples.length){
      const ul = document.createElement('ul');
      examples.forEach(ex=>{ const li = document.createElement('li'); li.textContent = `${ex.title} (${ex.month}/${ex.year})`; ul.appendChild(li)});
      el.appendChild(ul);
    }
    node.appendChild(el);
  })
}

function makeInstitutionsSection(list){
  const node = $('#institutionsList'); node.innerHTML='';
  list.forEach(i=>{
    const el = document.createElement('div'); el.innerHTML = `<h3>${i.name}</h3><p>Mentions in dataset: ${i.count}. Relevance: frequently appears in reporting on community health, emergency response, funding and training.</p>`;
    node.appendChild(el);
  })
}

function makePeopleSection(list){
  const node = $('#peopleList'); node.innerHTML='';
  list.forEach(p=>{
    const el = document.createElement('div'); el.innerHTML = `<strong>${p.name}</strong> — mentions: ${p.count}`;
    node.appendChild(el);
  })
}

function makeIdeasSection(){
  const node = $('#ideasList'); node.innerHTML='';
  const bullets = [
    'Follow funding for first-responder training campus (construction, fundraising) — check A. James Clark Emergency Services Training Campus updates.',
    'Investigate volunteer fire department recruitment & retention, infrastructure needs, and fundraising campaigns (e.g., Trappe Volunteer Fire Company).',
    'Heat wave and climate-related health impacts: preparedness, vulnerable populations, county health department responses.',
    'Hospital capacity and access: MedStar / Shore Regional Health roles in specialty care and rural access.',
    'Underserved mental health services and respite programs — coverage and funding (Compass Regional Hospice, respite nonprofits).',
    'Unfinished legal cases and ongoing investigations (shootings, arson, criminal cases) — verify current status with local SAO and MSP.'
  ];
  bullets.forEach(b=>{ const li = document.createElement('p'); li.textContent = b; node.appendChild(li) });
}

function makeMicroLearning(stories){
  const card = $('#microCard'); card.innerHTML='';
  const qbtn = document.createElement('button'); qbtn.className='btn-small'; qbtn.textContent='Take a quick quiz';
  qbtn.addEventListener('click',()=>buildQuiz(stories));
  card.appendChild(qbtn);
  const tip = document.createElement('p'); tip.textContent='Micro-lesson: Read one story then answer 2 short questions (author and month/year).'; card.appendChild(tip);
}

function buildQuiz(stories){
  const area = $('#quizArea'); area.innerHTML='';
  const s = stories[Math.floor(Math.random()*stories.length)];
  const q1 = document.createElement('div'); q1.innerHTML = `<h4>Question 1: Who wrote this story?</h4><p><em>${s.title}</em></p>`;
  const choices = [s.author || 'Unknown', 'Another Reporter', 'County Official', 'Staff Writer'].sort(()=>Math.random()<0.5?1:-1);
  choices.forEach(c=>{ const btn = document.createElement('button'); btn.className='btn-small'; btn.style.margin='6px'; btn.textContent=c; btn.addEventListener('click',()=>{
    if(c===s.author){ alert('Correct — +10 points'); award(10); } else { alert('Incorrect'); penalize(); }
    // next question
    q2();
  }); q1.appendChild(btn)});
  area.appendChild(q1);

  function q2(){
    area.innerHTML='';
    const q = document.createElement('div'); q.innerHTML = `<h4>Question 2: When was it published? (month/year)</h4><p><em>${s.title}</em></p>`;
    const actual = `${s.month}/${s.year}`;
    const opts = [actual, `${(s.month%12)+1}/${s.year}`, `${Math.max(1,s.month-1)}/${s.year}`, `${s.month}/${s.year-1}`].sort(()=>Math.random()<0.5?1:-1);
    opts.forEach(o=>{ const b=document.createElement('button'); b.className='btn-small'; b.style.margin='6px'; b.textContent=o; b.addEventListener('click',()=>{ if(o===actual){ alert('Correct — +15 points'); award(15);} else { alert('Incorrect'); penalize(); } area.innerHTML=''; }) ; q.appendChild(b) });
    area.appendChild(q);
  }
}

// Load data and initialize
fetch(DATA_PATH).then(r=>r.json()).then(stories=>{
  loadPoints();
  const themes = summarizeThemes(stories);
  const inst = extractInstitutions(stories);
  const people = extractPeople(stories);
  makeStoryList(stories);
  makeThemesSection(themes,stories);
  makeInstitutionsSection(inst);
  makePeopleSection(people.slice(0,40));
  makeMicroLearning(stories);
  makeIdeasSection();
}).catch(err=>{
  console.error('Failed to load dataset',err); document.getElementById('storyList').textContent='Failed to load stories. Check path to filtered_stories3.json';
});
async function $(sel){return document.querySelector(sel)}

const dataPath = '../filtered_stories3.json'
let stories = []
let index = {people: new Map(), institutions: new Map(), locations: new Map(), wordCounts: new Map(), topics: new Map()}
// helper: safe forEach that works if NodeList.forEach is missing
function safeForEach(list, cb){
  try{
    if(!list) return
    if(typeof list.forEach === 'function') { list.forEach(cb); return }
    Array.prototype.forEach.call(list, cb)
  }catch(err){
    // Last resort: tolerate and skip if non-iterable or accessor throws
    try{ Array.prototype.forEach.call([], cb) }catch(e){}
  }
}
// word positions/click handlers removed — wordcloud is now display-only
function installErrorLogger(){
  if(window.__errorLoggerInstalled) return
  window.__errorLoggerInstalled = true
  function makeBanner(){
    const b = document.createElement('div')
    b.id = 'jsErrorBanner'
    b.className = 'hidden'
    b.innerHTML = '<div id="jsErrorText"></div><button id="jsErrorClose" aria-label="close error">✕</button>'
    document.body.appendChild(b)
    document.getElementById('jsErrorClose').addEventListener('click',()=>{b.classList.add('hidden')})
  }
  if(document.body) makeBanner(); else document.addEventListener('DOMContentLoaded',makeBanner)

  function show(msg){
    const t = document.getElementById('jsErrorText')
    if(t) t.textContent = msg
    const b = document.getElementById('jsErrorBanner')
    if(b) b.classList.remove('hidden')
    console.error('JS Banner:', msg)
  }

  window.addEventListener('error', (e)=>{
    try{ show(`${e.message} — ${e.filename}:${e.lineno}:${e.colno}`) }catch(err){console.error(err)}
  })
  window.addEventListener('unhandledrejection', (e)=>{
    try{ const msg = e.reason && e.reason.message ? e.reason.message : String(e.reason); show('Unhandled promise rejection: '+msg) }catch(err){console.error(err)}
  })
}
installErrorLogger()

async function init(){
  try{
    await loadStories()
    setupUI()
    buildMicroLessons()
    buildPeopleInstitutionsLocations()
    buildDashboard()
  }catch(e){showError(e.message)}
}

async function loadStories(){
  const res = await fetch(dataPath)
  if(!res.ok) throw new Error('Could not load stories file')
  stories = await res.json()
  indexStories()
}

function indexStories(){
  const stop = new Set(['the','and','a','to','of','in','for','on','is','was','with','that','as','by','it','from','be','are','an','this','at','or','has','which'])
  stories.forEach(s=>{
    const t = (s.llm_classification && s.llm_classification.topic) || 'Unknown'
    index.topics.set(t,(index.topics.get(t)||0)+1)
    // people
    if(s.author) index.people.set(s.author,(index.people.get(s.author)||0)+1)
    // simple location detection: look for town names in title/content
    ['Easton','Oxford','Queen Anne','St. Michaels','Trappe','Tilghman','Talbot','Caroline'].forEach(loc=>{
      if((s.title && s.title.includes(loc)) || (s.content && s.content.includes(loc))) index.locations.set(loc,(index.locations.get(loc)||0)+1)
    })
    // words
    const text = (s.title||'') + ' ' + (s.content||'')
    text.replace(/[\n\r]/g,' ').split(/[^A-Za-z0-9']+/).forEach(w=>{
      const wl = w.toLowerCase()
      if(wl.length>3 && !stop.has(wl)) index.wordCounts.set(wl,(index.wordCounts.get(wl)||0)+1)
    })
  })
}

function setupUI(){
  document.getElementById('modeToggle').addEventListener('click',toggleMode)
  document.getElementById('lang').addEventListener('change',e=>applyLang(e.target.value))
  document.getElementById('searchBtn').addEventListener('click',doSearch)
  document.getElementById('errorClose').addEventListener('click',()=>$('#errorScreen').then(el=>el.classList.add('hidden')))
  safeForEach(document.querySelectorAll('#deckNav button'), b=>b.addEventListener('click',navClick))
}

function toggleMode(){
  const cur = document.documentElement.getAttribute('data-theme')
  if(cur==='dark'){document.documentElement.removeAttribute('data-theme'); this.textContent='Night'}else{document.documentElement.setAttribute('data-theme','dark'); this.textContent='Day'}
}

function applyLang(lang){
  // minimal: swap a few labels
  const strings = {en:{overview:'Overview & Micro-lessons',dashboard:'Dashboard'},es:{overview:'Resumen y Micro-lecciones',dashboard:'Tablero'}}
  const s = strings[lang] || strings.en
  document.querySelector('#overviewView h2').textContent = s.overview
  document.querySelector('#dashboardView h2').textContent = s.dashboard
}

function doSearch(){
  const q = document.getElementById('search').value.trim().toLowerCase()
  if(!q) return
  const matches = stories.filter(s=>((s.title||'')+ ' '+(s.content||'')).toLowerCase().includes(q))
  if(matches.length===0) showError('No matches found for "'+q+'"')
  else showSearchResults(matches,q)
}

function showSearchResults(matches,q){
  const view = document.getElementById('overviewView')
  view.innerHTML = `<h2>Search results for "${q}" (${matches.length})</h2>` + matches.map(s=>`<article class="result"><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml((s.content||'').slice(0,300))}... </p><p><a href="#" data-id="${s.article_id}">Open / attach link</a></p></article>`).join('\n')
  // attach link editor
  safeForEach(view.querySelectorAll('a[data-id]'), a=>a.addEventListener('click',e=>{e.preventDefault(); attachLink(e.target.dataset.id)}))
  switchTo('overview')
}

function attachLink(articleId){
  const url = prompt('Attach a URL to this story (external link / story URL / institution)')
  if(!url) return
  const key = 'links_'+articleId
  localStorage.setItem(key,url)
  alert('Saved link for '+articleId)
}

function buildMicroLessons(){
  const el = document.getElementById('microLessons')
  el.innerHTML = ''
  const lessons = [
    {title:'What to watch for',body:'Short: focus on local health alerts, first responder training, facility incidents and public health notices.'},
    {title:'Quick sources',body:'County health department, sheriff\'s office, local hospitals, volunteer fire departments, EMS training campus leaders.'},
    {title:'Daily routine',body:'Check press releases each morning, scan police logs, and monitor hospital statements and county health advisories.'}
  ]
  lessons.forEach(l=>{const d=document.createElement('div');d.className='lesson';d.innerHTML=`<h4>${l.title}</h4><p>${l.body}</p>`;el.appendChild(d)})
}

function buildPeopleInstitutionsLocations(){
  const peopleEl = document.getElementById('peopleList')
  index.people.forEach((count,name)=>{
    const li = document.createElement('li'); li.innerHTML = `<strong>${escapeHtml(name)}</strong> — stories: ${count}`
    peopleEl.appendChild(li)
  })
  const instEl = document.getElementById('institutionsList')
  // list some institutions from dataset heuristics
  const insts = ['Easton Volunteer Fire Department','Talbot County Sheriff\'s Office','Choptank Health','A. James Clark Emergency Services Training Campus','Queen Anne\'s County Department of Health']
  insts.forEach(i=>{const li=document.createElement('li');li.innerHTML=`<strong>${i}</strong><div class="desc">Click to search stories referencing this institution.</div><div><button data-inst="${i}">Search</button></div>`;instEl.appendChild(li)})
  safeForEach(instEl.querySelectorAll('button[data-inst]'), b=>b.addEventListener('click',()=>searchInstitution(b.dataset.inst)))

  const locEl = document.getElementById('locationsList')
  index.locations.forEach((count,name)=>{const li=document.createElement('li');li.innerHTML=`<strong>${escapeHtml(name)}</strong> — mentions: ${count} <button data-loc="${encodeURIComponent(name)}">Map</button>`;locEl.appendChild(li)})
  safeForEach(locEl.querySelectorAll('button[data-loc]'), b=>b.addEventListener('click',e=>openMap(decodeURIComponent(b.dataset.loc))))
}

function searchInstitution(name){
  const q = name.toLowerCase()
  const matches = stories.filter(s=>((s.title||'')+ ' '+(s.content||'')).toLowerCase().includes(q))
  if(matches.length===0) showError('No stories found for '+name)
  else showSearchResults(matches,name)
}

function openMap(place){
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`
  window.open(url,'_blank')
}

function buildDashboard(){
  const stats = document.getElementById('stats')
  stats.innerHTML = `<p><strong>Total stories:</strong> ${stories.length}</p><p><strong>By topic:</strong> ${Array.from(index.topics.entries()).map(([t,c])=>`${t}: ${c}`).join(' • ')}</p>`
  drawWordCloud()
}

function drawWordCloud(){
  const canvas = document.getElementById('wordcloud')
  if(!canvas) return
  const ctx = canvas.getContext && canvas.getContext('2d')
  if(!ctx) return
  // positions removed; wordcloud is display-only
  ctx.clearRect(0,0,canvas.width,canvas.height)
  const words = Array.from(index.wordCounts.entries()).sort((a,b)=>b[1]-a[1]).slice(0,50)
  let x=10,y=30
  // display-only word cloud showing recurring theme words
  words.forEach(([w,c],i)=>{
    ctx.font = `${12 + Math.min(36, c*2)}px Arial`
    const wth = ctx.measureText(w).width
    if(x + wth > canvas.width-20){ x=10; y += 40 }
    ctx.fillStyle = '#0b66b2'
    ctx.fillText(w,x,y)
    x += wth + 18
  })
}

// wordcloud is display-only; clicks are not handled here.

function showWordDetails(word){
  // simplistic: show stories with the word
  const matches = stories.filter(s=>((s.title||'')+ ' '+(s.content||'')).toLowerCase().includes(word))
  const themesEl = document.getElementById('themes')
  themesEl.innerHTML = `<h4>"${escapeHtml(word)}" — ${matches.length} references</h4>` + matches.slice(0,8).map(s=>`<div class="story"><strong>${escapeHtml(s.title)}</strong><div>${escapeHtml((s.content||'').slice(0,250))}...</div><div><button data-id="${s.article_id}" class="open">Open</button> <a href="#" data-map="${encodeURIComponent(s.title)}">Map</a></div></div>`).join('\n')
  safeForEach(themesEl.querySelectorAll('button.open'), b=>b.addEventListener('click',e=>attachLink(e.target.dataset.id)))
  safeForEach(themesEl.querySelectorAll('a[data-map]'), a=>a.addEventListener('click',e=>{e.preventDefault(); openMap(decodeURIComponent(a.dataset.map))}))
  switchTo('overview')
}

function switchTo(view){
  safeForEach(document.querySelectorAll('#deckNav button'), b=>b.classList.toggle('active',b.dataset.view===view))
  safeForEach(document.querySelectorAll('.view'), v=>v.classList.add('hidden'))
  document.getElementById(view+'View').classList.remove('hidden')
}

function navClick(e){
  const v = e.target.dataset.view
  switchTo(v)
}

function showError(msg){
  const el = document.getElementById('errorScreen')
  document.getElementById('errorMsg').textContent = msg
  el.classList.remove('hidden')
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

init()
