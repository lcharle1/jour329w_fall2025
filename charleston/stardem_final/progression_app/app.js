// Simple progression app for Talbot County Health & Public Safety
const START_BTN = document.getElementById('startBtn');
const LEVEL = document.getElementById('levelSelect');
const REPORTER = document.getElementById('reporterName');
const SESSION = document.getElementById('session');
const LESSON_TITLE = document.getElementById('lessonTitle');
const LESSON_TEXT = document.getElementById('lessonText');
const EXTRA = document.getElementById('extra');
const POINTS = document.getElementById('points');
const STREAK = document.getElementById('streak');
const QUIZ = document.getElementById('quiz');
const QUESTION = document.getElementById('question');
const CHOICES = document.getElementById('choices');
const NEXT = document.getElementById('nextBtn');
const SAVE = document.getElementById('saveBtn');

let stories = [];
let state = { points:0, streak:0, seen: {}, schedule: {} };
let current = null;

function loadProgress(){
  try{const s = localStorage.getItem('talbot_progress'); if(s) state = JSON.parse(s);}catch(e){}
  updateStatus();
}

function saveProgress(){
  localStorage.setItem('talbot_progress', JSON.stringify(state));
  alert('Progress saved locally');
}

function updateStatus(){
  POINTS.textContent = `Points: ${state.points}`;
  STREAK.textContent = `Streak: ${state.streak}`;
}

function sampleStory(){
  if(!stories || !stories.length) return null;
  // Prefer stories with Health/Public Safety tags if present
  const hits = stories.filter(s => {
    const tags = (s.tags||[]).map(t=>String(t).toLowerCase());
    const text = (s.text||'').toLowerCase();
    return tags.some(t=>t.includes('health')||t.includes('public')) || text.includes('health') || text.includes('police') || text.includes('safety');
  });
  const pool = hits.length?hits:stories;
  return pool[Math.floor(Math.random()*pool.length)];
}

function renderLesson(level){
  current = sampleStory();
  if(!current){ LESSON_TITLE.textContent='No stories loaded'; LESSON_TEXT.textContent='Please check that filtered_stories.json is available.'; return; }
  const title = current.title || current.headline || (current.summary && current.summary.slice(0,80)) || 'Story excerpt';
  LESSON_TITLE.textContent = title;

  if(level==1){
    const excerpt = current.excerpt || current.summary || current.text || '';
    LESSON_TEXT.textContent = excerpt.slice(0,1000) + (excerpt.length>1000? '...':'');
    EXTRA.innerHTML = `<p><strong>Date:</strong> ${current.date||current.pub_date||''}</p>`;
    QUIZ.classList.add('hidden');
  } else if(level==2){
    // create a simple fact-based question if possible
    const people = extractPeople(current);
    const locations = extractLocations(current);
    const stats = extractNumbers(current);
    LESSON_TEXT.textContent = (current.summary||current.excerpt||current.text||'').slice(0,500);
    EXTRA.innerHTML = `<p><strong>From:</strong> ${locations.join(', ') || 'Talbot County'}</p>`;
    if(people.length){
      makeQuestion(`Who is mentioned in this story?`, people[0], shuffle([people[0], ...randomOtherNames(3)]));
    } else if(stats.length){
      makeQuestion(`Which number was referenced in this story?`, stats[0], shuffle([stats[0], ...randomOtherStats(3)]));
    } else {
      QUIZ.classList.add('hidden');
    }
  } else if(level==3){
    LESSON_TEXT.textContent = `Suggested reporting angles:\n\n` + makeAngles(current).join('\n\n');
    EXTRA.innerHTML = `<p><strong>Potential sources:</strong> ${extractPeople(current).slice(0,5).join(', ')}</p>`;
    QUIZ.classList.add('hidden');
  }
}

function makeQuestion(questionText, correct, choicesArr){
  QUIZ.classList.remove('hidden');
  QUESTION.textContent = questionText;
  CHOICES.innerHTML = '';
  choicesArr.forEach(c=>{
    const btn = document.createElement('button'); btn.textContent = c; btn.onclick = ()=>answerClick(c, correct);
    CHOICES.appendChild(btn);
  });
}

function answerClick(choice, correct){
  if(choice===correct){
    state.points += 10; state.streak += 1; updateStatus();
    alert('Correct — +10 points');
  } else { state.streak = 0; updateStatus(); alert('Not quite — review the excerpt again.'); }
  QUIZ.classList.add('hidden');
}

function next(){
  const level = Number(LEVEL.value);
  renderLesson(level);
}

function extractPeople(s){
  // best-effort: use byline or explicit people field, otherwise try to find capitalized Name patterns
  if(!s) return [];
  const list = new Set();
  if(s.byline) list.add(s.byline);
  if(s.people && Array.isArray(s.people)) s.people.forEach(p=>list.add(p));
  if(s.text){
    const re = /([A-Z][a-z]+\s[A-Z][a-z]+)/g; let m; while((m=re.exec(s.text))){ list.add(m[0]); if(list.size>10) break; }
  }
  return Array.from(list).slice(0,10);
}

function extractLocations(s){
  if(!s) return [];
  const out = new Set();
  if(s.locations && Array.isArray(s.locations)) s.locations.forEach(l=>out.add(l));
  if(s.text){ const towns = ['Easton','Oxford','Queen Anne','St. Michaels','Trappe','Tilghman']; towns.forEach(t=>{ if(s.text.includes(t)) out.add(t); }); }
  return Array.from(out);
}

function extractNumbers(s){
  if(!s||!s.text) return [];
  const re = /(\d{1,3}(?:,\d{3})*(?:\.\d+)?%?)/g; const out=[]; let m; while((m=re.exec(s.text))) out.push(m[0]); return out.slice(0,5);
}

function randomOtherNames(n){
  const pool = ['County Health Officer','Mayor','Chief of Police','School Superintendent','Nurse','Clinic Director','Council Member','EMS Director'];
  return pool.sort(()=>0.5-Math.random()).slice(0,n);
}

function randomOtherStats(n){
  const pool = ['10','25%','$50,000','3','200']; return pool.sort(()=>0.5-Math.random()).slice(0,n);
}

function shuffle(a){return a.sort(()=>0.5-Math.random())}

function makeAngles(s){
  const angles = [];
  if(!s) return ['No story content available.'];
  const people = extractPeople(s);
  const locs = extractLocations(s);
  angles.push(`Follow-up with ${people.slice(0,2).join(' and ')} to get updated perspectives.`);
  angles.push(`Data-driven angle: verify numbers mentioned (${extractNumbers(s).join(', ') || 'none listed'}) and seek official records.`);
  angles.push(`Community impact: interview residents in ${locs.join(', ') || 'affected localities'} about lived experience.`);
  angles.push(`Policy angle: check meeting minutes or local ordinances connected to the event or decision.`);
  return angles;
}

function init(){
  loadProgress();
  // load dataset: try several common paths depending on where the server is rooted
  const pathsToTry = [
    '/filtered_stories.json',
    '../../../filtered_stories.json',
    '../../filtered_stories.json',
    '../filtered_stories.json',
    'filtered_stories.json'
  ];

  (async function tryLoad(){
    for(const p of pathsToTry){
      try{
        const res = await fetch(p);
        if(!res.ok) { console.debug('fetch',p,'status',res.status); continue; }
        const json = await res.json();
        stories = Array.isArray(json)?json:(json.stories||[]);
        console.info('Loaded stories from',p,'count=',stories.length);
        return;
      }catch(err){ console.debug('fetch error for',p, err); }
    }
    console.error('Failed to load filtered_stories.json from tried paths. Serve the workspace root or place the file where the server can access it.');
  })();
  START_BTN.onclick = ()=>{ document.getElementById('setup').classList.add('hidden'); SESSION.classList.remove('hidden'); loadProgress(); next(); };
  NEXT.onclick = ()=>next(); SAVE.onclick = ()=>saveProgress();
}

init();
