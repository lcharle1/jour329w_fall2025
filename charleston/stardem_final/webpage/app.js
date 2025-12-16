// app.js — Health & Public Safety Beat Training Guide (Talbot County)
// Fully narrative, per prompt.txt requirements
const DATA_PATH = '../filtered_stories3.json';

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const $ = s => document.querySelector(s);
const $all = s => Array.from(document.querySelectorAll(s));

const stopWords = new Set(['The','A','An','By','Staff','Writer','Page','Section','Author','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']);
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const talbotLocations = ['Easton','Oxford','Queen Anne','St. Michaels','Trappe','Tilghman Island','Broad Creek','Miles River','Choptank River','Eastern Bay','Chesapeake Bay','Mistletoe Drive','Bay Street','Dover Street','Route 50','Idlewild Avenue','Aurora Park'];

/* ─────────────────────────────────────────────
   ENTITY EXTRACTION
───────────────────────────────────────────── */
function extractNames(text) {
  const map = new Map();
  if (!text) return map;
  // Match 2-3 word capitalized names
  const re = /\b([A-Z][a-z]+(?:\s+[A-Z]\.?\s*)?(?:\s+[A-Z][a-z]+){1,2})\b/g;
  let m;
  while ((m = re.exec(text))) {
    const name = m[1].trim();
    const parts = name.split(/\s+/);
    // Filter out months, short tokens, stop words, institutions
    if (parts.some(p => months.includes(p))) continue;
    if (parts.some(p => p.length <= 2 && !p.endsWith('.'))) continue;
    if (stopWords.has(parts[0])) continue;
    if (/Department|School|Hospital|Company|Foundation|County|Office|Center|Clinic|Police|Fire|University|Church|Street|Road|Avenue|Drive/.test(name)) continue;
    map.set(name, (map.get(name) || 0) + 1);
  }
  return map;
}

function extractEmails(text) {
  return text ? Array.from(new Set((text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || []))) : [];
}

function extractPhones(text) {
  return text ? Array.from(new Set((text.match(/(?:\+1[-.\s]?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}/g) || []))) : [];
}

function extractInstitutions(text) {
  const inst = new Map();
  if (!text) return inst;
  const patterns = [
    'Volunteer Fire Department', 'Volunteer Fire Company', 'Fire Department', 'Fire Company',
    'Sheriff', 'Police Department', 'State Police', 'Natural Resources Police',
    'Health Department', 'Department of Health', 'Hospital', 'Medical Center',
    'Hospice', 'Foundation', 'Clinic', 'Health System',
    'Board of Education', 'State Fire Marshal', 'Emergency Services',
    'Training Campus', 'Detention Center', 'State\'s Attorney'
  ];
  patterns.forEach(pat => {
    const escaped = pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    const re = new RegExp("([A-Z][A-Za-z0-9 &'.-]{2,60}?" + escaped + ")", 'g');
    let m;
    while ((m = re.exec(text))) {
      const n = m[1].trim();
      inst.set(n, (inst.get(n) || 0) + 1);
    }
  });
  return inst;
}

function extractLocations(text) {
  const locs = new Map();
  if (!text) return locs;
  talbotLocations.forEach(loc => {
    const re = new RegExp('\\b' + loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
    const matches = text.match(re);
    if (matches) locs.set(loc, (locs.get(loc) || 0) + matches.length);
  });
  return locs;
}

/* ─────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────── */
$all('.deck-nav button').forEach(b => b.addEventListener('click', () => {
  $all('.deck-nav button').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  $all('.slide').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(b.dataset.slide);
  if (el) el.classList.add('active');
}));

/* ─────────────────────────────────────────────
   MAIN: LOAD DATA & BUILD SECTIONS
───────────────────────────────────────────── */
fetch(DATA_PATH)
  .then(r => r.json())
  .then(stories => {
    window.__STORIES = stories;

    // 1. Build Overview
    buildOverview(stories);

    // 2. Build Recurring Themes
    buildThemes(stories);

    // 3. Build Key Institutions
    buildInstitutions(stories);

    // 4. Build Key People
    buildPeople(stories);

    // 5. Build Geography
    buildGeography(stories);

    // 6. Build Story Browser
    buildStoryList(stories);

    // 7. Build Story Ideas
    buildIdeas();

    // 8. Build Caveats
    buildCaveats();
  })
  .catch(err => console.error('Failed to load stories:', err));

/* ─────────────────────────────────────────────
   SECTION BUILDERS
───────────────────────────────────────────── */
function buildOverview(stories) {
  const node = $('#overviewContent');
  const publicSafetyCount = stories.filter(s => s.llm_classification?.topic === 'Public Safety').length;
  const healthCount = stories.filter(s => s.llm_classification?.topic === 'Health').length;
  const dateRange = stories.map(s => new Date(s.date)).sort((a, b) => a - b);
  const earliest = dateRange[0];
  const latest = dateRange[dateRange.length - 1];

  node.innerHTML = `
    <p>This training guide introduces an early-career reporter to the <strong>Health and Public Safety</strong> beat in Talbot County, Maryland. 
    The dataset contains <strong>${stories.length} published stories</strong> from the <em>Star Democrat</em> spanning 
    ${earliest.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} through 
    ${latest.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.</p>

    <p>Of these, <strong>${publicSafetyCount} stories</strong> are classified as Public Safety and <strong>${healthCount} stories</strong> as Health. 
    Public Safety coverage includes violent crime, traffic fatalities, fire-rescue operations, arson investigations, and law-enforcement leadership changes. 
    Health coverage spans public health advisories, hospice services, rare disease awareness, hospital infrastructure, and mental health programs.</p>

    <h3>Geographic Scope</h3>
    <p>The geographic focus is <strong>Talbot County</strong> and its five municipalities: <strong>Easton, Oxford, Queen Anne, St. Michaels, and Trappe</strong>. 
    Relevant bodies of water include the <strong>Chesapeake Bay, Miles River, Choptank River, Eastern Bay,</strong> and <strong>Broad Creek</strong>. 
    Natural landmarks such as <strong>Tilghman Island</strong> and infrastructure like the <strong>A. James Clark Emergency Services Training Campus</strong> on Mistletoe Drive 
    are central to beat coverage.</p>

    <h3>What You'll Learn</h3>
    <ul>
      <li><strong>Recurring Themes:</strong> Major patterns in crime, fire services, public health, and hospice care</li>
      <li><strong>Key Institutions:</strong> Government agencies, nonprofits, and medical facilities central to this beat</li>
      <li><strong>Key People:</strong> Officials, sources, and stakeholders you should know and contact</li>
      <li><strong>Story Ideas:</strong> Underreported angles and follow-up opportunities</li>
      <li><strong>Caveats:</strong> Unresolved storylines requiring verification</li>
    </ul>
  `;
}

function buildThemes(stories) {
  const node = $('#themesList');
  
  // Aggregate topic counts
  const counts = {};
  stories.forEach(s => {
    const t = s.llm_classification?.topic || 'Other';
    counts[t] = (counts[t] || 0) + 1;
  });
  const themes = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  // Detailed narrative for main themes
  const narratives = {
    'Public Safety': `
      <p><strong>Public Safety</strong> dominates coverage with ${counts['Public Safety'] || 0} stories. This theme encompasses a broad range of incidents and ongoing issues that affect the safety and security of Talbot County residents.</p>
      
      <h4>Violent Crime</h4>
      <p>The dataset includes several high-profile violent crime cases. In October 2023, two suspects were arrested in connection with the shooting death of 23-year-old Antonio L. Smith at the Sidetracked Saloon in Easton. Kevron Chase, 34, of Cambridge was charged with first- and second-degree murder, while Chadnee Harris, 32, of Hurlock was charged as an accessory. Security camera footage captured the incident, which stemmed from an alleged robbery dispute months earlier.</p>
      
      <p>In June 2025, Antonio Bolden, 37, pleaded guilty to attempted first-degree murder for shooting a coworker at the Freedom Fuel gas station in Trappe. The victim, a 29-year-old Salisbury man, was shot in the face and arm. Bolden's sentencing is scheduled for September 15, 2025—a date reporters should track.</p>
      
      <h4>Fire Services & Infrastructure</h4>
      <p>Volunteer fire departments are central to public safety in Talbot County. The <strong>Easton Volunteer Fire Department</strong>, the county's largest, elected J.R. Dobson as chief in December 2024. Dobson, who also serves as a patrol commander at the Talbot County Sheriff's Office, has prioritized recruitment, retention, and equipment upgrades.</p>
      
      <p>The <strong>A. James Clark Emergency Services Training Campus</strong> on Mistletoe Drive is under construction and aims to open by late 2025. The 7,200-square-foot facility will include a burn building for search-and-rescue simulations, extrication pads, and classrooms. The A. James & Alice B. Clark Foundation has contributed $1.9 million of the $5 million fundraising goal. Governor Wes Moore toured the site in April 2025.</p>
      
      <p>The <strong>Trappe Volunteer Fire Company</strong>, the oldest firehouse in Talbot County (dating to 1951), launched a "Raise a New Firehouse" campaign in July 2024 with a $1.5 million goal. Chief Nick Newnam described the current structure as "questionable at best" and noted that engine bay doors provide only inches of clearance.</p>
      
      <h4>School Safety</h4>
      <p>In September 2024, Sheriff Joe Gamble addressed multiple social media threats targeting Talbot County Public Schools. A modified lockdown was implemented after a threat—later traced outside the United States—circulated online. Gamble noted that such threats have become increasingly common nationwide.</p>
      
      <h4>Traffic Fatalities</h4>
      <p>Fatal crashes appear regularly in the dataset. In August 2025, Lisa Marie Arisman, 56, of Pittsburgh was killed in a fiery two-vehicle collision in Sudlersville (Queen Anne's County). Firefighters spent approximately five hours on scene extinguishing the blaze. Charges are pending investigation.</p>
    `,

    'Health': `
      <p><strong>Health</strong> coverage spans ${counts['Health'] || 0} stories, addressing public health advisories, chronic disease awareness, hospice and mental health services, and hospital infrastructure.</p>
      
      <h4>Public Health Advisories</h4>
      <p>In June 2025, the Dorchester County Health Department issued heat-wave warnings as Mid-Shore temperatures were projected to reach the upper 90s. Officials urged residents—especially babies, elderly adults, pregnant women, and outdoor workers—to stay hydrated and limit sun exposure. The Maryland Department of Health reported 26 heat-related deaths statewide in 2024.</p>
      
      <p>The Queen Anne's County Department of Health regularly offers free flu vaccination clinics at its Centreville location (206 N Commerce Street). Clinics are walk-in only, with no appointments necessary. COVID-19 vaccines for uninsured or underinsured children ages 5–18 are available through the Maryland Vaccines for Children program.</p>
      
      <h4>Hospice & Supportive Care</h4>
      <p><strong>Compass Regional Hospice</strong> provides hospice, supportive care, and grief support services across Queen Anne's, Kent, and Caroline counties. Executive Director Heather Guerieri oversees operations. In January 2024, the organization's annual gala at Chesapeake Bay Beach Club raised $130,500. Camp New Dawn, a program for bereaved children, was featured in a video debuted at the event.</p>
      
      <h4>Caregiver Respite</h4>
      <p><strong>A Mother's Rest Charitable Respite Foundation</strong>, founded in 2017, operates weekend retreats for caregivers of children with special needs. In January 2024, the Hummingbird Inn in Easton hosted its first respite retreat through the Porch Partners program. Six mothers from Delaware, Pennsylvania, and Virginia attended. Local businesses—including Out of the Fire, Chatterbox Hair Salon, and Avalon Theatre—donated meals, services, and entertainment.</p>
      
      <h4>Rare Disease Awareness</h4>
      <p>The <strong>Chesapeake Bay Sight Foundation</strong>, founded by Colleen Sheehan of Easton, raises funds for eye disease research at the Johns Hopkins Wilmer Eye Institute. Sheehan, who has retinitis pigmentosa, closed her accounting firm in July 2024 to focus on the nonprofit. The foundation held a ribbon-cutting for its new Beach Avenue office in June 2024 and launched a "Dine for Blind" discount card at eight local restaurants.</p>
      
      <p>In May 2024, the <em>Star Democrat</em> profiled Ethan Krisman of Centreville, a 4-year-old diagnosed with <strong>Fibrodysplasia Ossificans Progressiva (FOP)</strong>—a condition affecting one in a million people that turns muscle tissue into bone. The FDA approved the first FOP treatment in summer 2023, but children must be at least 8 (girls) or 10 (boys) years old to receive it.</p>
      
      <h4>Breast Cancer Treatment</h4>
      <p>The <strong>Clark Comprehensive Breast Center</strong> at Shore Regional Health (near Route 50 and Idlewild Avenue) provides imaging, diagnosis, and treatment for Mid-Shore women. In 2025, the center made 137 new breast cancer diagnoses and completed over 12,000 imaging studies. The Working Artists Forum's "Pretty in Pink" fundraiser raised $14,000 for the center in October 2025.</p>
    `
  };

  let html = '';
  themes.forEach(([topic, count]) => {
    html += `<h3>${topic} — ${count} stories</h3>`;
    if (narratives[topic]) {
      html += narratives[topic];
    } else {
      html += `<p>This theme surfaces in ${count} stories. Review individual entries to identify key stakeholders and reporting patterns.</p>`;
    }
    
    // Add example stories
    const examples = stories.filter(s => (s.llm_classification?.topic || 'Other') === topic).slice(0, 5);
    if (examples.length) {
      html += '<p><strong>Example stories:</strong></p><ul>';
      examples.forEach(ex => {
        html += `<li>"${ex.title}" (${months[ex.month - 1]} ${ex.year})</li>`;
      });
      html += '</ul>';
    }
  });

  node.innerHTML = html;
}

function buildInstitutions(stories) {
  const node = $('#institutionsList');
  
  // Aggregate from stories
  const instMap = new Map();
  stories.forEach(s => {
    const txt = (s.title || '') + ' ' + (s.content || '') + ' ' + (s.llm_classification?.explanation || '');
    extractInstitutions(txt).forEach((c, n) => instMap.set(n, (instMap.get(n) || 0) + c));
  });

  // Detailed descriptions for key institutions
  const descriptions = {
    'Easton Volunteer Fire Department': {
      desc: `The Easton Volunteer Fire Department is the largest volunteer fire company in Talbot County, serving Easton and surrounding areas. The department responds to structure fires, vehicle accidents, field fires, and provides mutual aid to neighboring companies. All members are unpaid volunteers who balance firefighting duties with full-time jobs and family life.`,
      leadership: `J.R. Dobson was elected chief in December 2024, succeeding Sonny Jones, who completed three two-year terms. Dobson also serves as a patrol and operations commander at the Talbot County Sheriff's Office. Assistant Chief Daryl Caldwell oversees training operations and the A. James Clark Training Campus project.`,
      contact: `Address: Easton, MD. For general inquiries, contact the department directly or through the Town of Easton.`,
      relevance: `Central to coverage of fire incidents, recruitment challenges, equipment needs, and the Training Campus construction.`
    },
    'Talbot County Sheriff': {
      desc: `The Talbot County Sheriff's Office provides county-level law enforcement, criminal investigations, and school resource officers for Talbot County Public Schools. The office handles major crimes, serves warrants, and coordinates with state and federal agencies.`,
      leadership: `Sheriff Joe Gamble leads the department. He has addressed school threats, violent crime, and community safety concerns in public statements and interviews.`,
      contact: `Emergency: 911. Non-emergency: Contact the Sheriff's Office administrative line.`,
      relevance: `Primary source for crime reports, arrests, school safety incidents, and law enforcement policy.`
    },
    'Shore Regional Health': {
      desc: `Shore Regional Health operates the University of Maryland Shore Medical Center at Easton, the primary hospital for Talbot County. Services include emergency care, surgery, imaging, and specialty clinics. The hospital is part of the University of Maryland Medical System. Trauma patients requiring advanced care are flown to the R Adams Cowley Shock Trauma Center in Baltimore.`,
      leadership: `Part of the larger UM system. The Clark Comprehensive Breast Center, directed by Dr. Kathryn Kelley (with former director Dr. Roberta Lilly honored for 13 years of service), operates nearby on Idlewild Avenue.`,
      contact: `Located in Easton. Emergency services available 24/7.`,
      relevance: `Key source for health stories, hospital operations, and regional medical access issues.`
    },
    'Compass Regional Hospice': {
      desc: `Compass Regional Hospice is a nonprofit providing hospice care, supportive care, and grief support services across Queen Anne's, Kent, and Caroline counties. The organization operates Camp New Dawn for bereaved children and hosts an annual gala fundraiser. No one is turned away for inability to pay.`,
      leadership: `Executive Director Heather Guerieri oversees operations. Board member Kirk Helfenbein and grief counselor Sherrie Young are also involved.`,
      contact: `For services or to make a donation, contact Compass Regional Hospice directly.`,
      relevance: `Central to health coverage on end-of-life care, grief support, and nonprofit fundraising in the region.`
    },
    'A. James Clark Emergency Services Training Campus': {
      desc: `A state-of-the-art first responder training facility under construction on Mistletoe Drive in Easton. The 7,200-square-foot campus will include a 4,200-square-foot classroom building, a burn building for search-and-rescue and active shooter simulations, and two pads for car fire and extrication training. The burn building uses metal construction with concrete floors to allow repeated use without damage.`,
      leadership: `Brett Whitehead, president of Friends of the Easton Volunteer Fire Department, leads fundraising. The A. James & Alice B. Clark Foundation has contributed $1.9 million. Ground was broken in December 2024, with a goal to open by late 2025.`,
      contact: `For information or donations, contact the Easton Volunteer Fire Department or Friends of EVFD.`,
      relevance: `Major ongoing story for construction milestones, fundraising progress, and regional first responder training.`
    },
    'Trappe Volunteer Fire Company': {
      desc: `The oldest firehouse in Talbot County, dating to 1951. The Trappe VFC provides fire and emergency services to Trappe and surrounding rural communities. The current structure has structural limitations—engine bay doors provide only inches of clearance for modern equipment.`,
      leadership: `Chief Nick Newnam and President John Foster lead the company. Cheryl Lewis handles fundraising coordination.`,
      contact: `Nick Newnam: 443-786-2035. John Foster: 410-829-9073. Email: cheryllewis.trappe@gmail.com.`,
      relevance: `Ongoing "Raise a New Firehouse" campaign with a $1.5 million goal ($6 million total project cost).`
    },
    'Maryland State Police': {
      desc: `The Maryland State Police provide statewide law enforcement, highway patrol, and criminal investigation services. The agency operates barracks across the state and deploys the Crash Reconstruction Unit for fatal accident investigations.`,
      leadership: `Contact local barracks for press inquiries. The Salisbury Barrack handles cases in the Mid-Shore region.`,
      contact: `Salisbury Barrack: 410-749-3101.`,
      relevance: `Key source for traffic fatalities, major crime investigations, and multi-jurisdictional cases.`
    },
    'Office of the State Fire Marshal': {
      desc: `The Maryland Office of the State Fire Marshal investigates fire origins and causes, determines whether fires are accidental or incendiary (intentionally set), and provides fire prevention education. The Upper Eastern Regional Office covers the Mid-Shore.`,
      leadership: `Contact the regional office for fire investigation updates.`,
      contact: `Upper Eastern Regional Office: 410-822-7609.`,
      relevance: `Primary source for arson investigations and fire origin determinations.`
    },
    'Chesapeake Bay Sight Foundation': {
      desc: `A nonprofit founded by Colleen Sheehan in 2011 to fund eye disease research and raise awareness about blindness. The foundation supports the Johns Hopkins Wilmer Eye Institute's Singh Lab, which researches treatments for retinitis pigmentosa and macular degeneration. The foundation's signature event is "Dining in the Dark," where attendees eat blindfolded to experience vision loss.`,
      leadership: `Founder Colleen Sheehan. Marketing Director Breanne Tsang.`,
      contact: `Website: chesapeakebaysightfoundation.org. Office: Beach Avenue, Easton.`,
      relevance: `Human interest health stories on rare eye diseases, fundraising, and clinical trial access.`
    },
    'Choptank Community Health System': {
      desc: `A federally qualified health center providing primary care, dental, behavioral health, and specialty services across the Mid-Shore. Choptank operates multiple clinic locations and serves patients regardless of ability to pay.`,
      leadership: `Contact Choptank Health for media inquiries.`,
      contact: `Multiple locations in Talbot, Dorchester, and Caroline counties.`,
      relevance: `Key institution for healthcare access stories, especially for underserved populations.`
    }
  };

  // Build HTML
  let html = `
    <p>The following institutions are central to the Health and Public Safety beat in Talbot County. Each description includes the organization's role, leadership, and relevance to ongoing coverage.</p>
  `;

  // First, render known institutions with full descriptions
  Object.entries(descriptions).forEach(([name, info]) => {
    html += `
      <div class="institution">
        <h3>${name}</h3>
        <p>${info.desc}</p>
        <p><strong>Leadership:</strong> ${info.leadership}</p>
        <p><strong>Contact:</strong> ${info.contact}</p>
        <p><strong>Beat Relevance:</strong> ${info.relevance}</p>
      </div>
    `;
  });

  // Then add other extracted institutions
  const otherInst = Array.from(instMap.entries())
    .filter(([n]) => !Object.keys(descriptions).some(k => n.includes(k) || k.includes(n)))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  if (otherInst.length) {
    html += `<h3>Other Institutions Mentioned</h3><ul>`;
    otherInst.forEach(([name, count]) => {
      html += `<li><strong>${name}</strong> — mentioned ${count} time${count > 1 ? 's' : ''}</li>`;
    });
    html += '</ul>';
  }

  node.innerHTML = html;
}

function buildPeople(stories) {
  const node = $('#peopleList');
  
  // Aggregate names and contacts
  const peopleMap = new Map();
  const contactsMap = new Map();
  
  stories.forEach(s => {
    const txt = (s.title || '') + ' ' + (s.content || '') + ' ' + (s.author || '');
    extractNames(txt).forEach((c, n) => {
      peopleMap.set(n, (peopleMap.get(n) || 0) + c);
      const ct = contactsMap.get(n) || { emails: new Set(), phones: new Set() };
      extractEmails(txt).forEach(e => ct.emails.add(e));
      extractPhones(txt).forEach(p => ct.phones.add(p));
      contactsMap.set(n, ct);
    });
  });

  // Detailed roles for key people
  const keyPeople = {
    'J.R. Dobson': {
      role: "Fire Chief, Easton Volunteer Fire Department; Patrol and Operations Commander, Talbot County Sheriff's Office",
      context: `Elected chief in December 2024. Began with Easton VFD in 2003 after starting as a junior cadet at Trappe VFC. Manages approximately 35 deputies in his sheriff's office role. Priorities include volunteer recruitment, equipment upgrades, and the Training Campus project.`,
      contact: "Contact through Easton VFD or Talbot County Sheriff's Office."
    },
    'Joe Gamble': {
      role: 'Sheriff, Talbot County',
      context: `Leads the Talbot County Sheriff's Office, which handles county-level law enforcement and school resource officers. Has addressed school threats and violent crime in public statements.`,
      contact: "Talbot County Sheriff's Office administrative line."
    },
    'Brett Whitehead': {
      role: 'President, Friends of the Easton Volunteer Fire Department',
      context: `Spearheading fundraising for the A. James Clark Emergency Services Training Campus. Reports that more than $4 million of the $5 million goal has been raised as of May 2025.`,
      contact: 'Contact through Easton VFD or Friends of EVFD.'
    },
    'Daryl Caldwell': {
      role: 'Assistant Chief, Easton Volunteer Fire Department',
      context: `Oversees training operations. Provided Governor Wes Moore with a tour of the Training Campus in April 2025.`,
      contact: 'Contact through Easton VFD.'
    },
    'Heather Guerieri': {
      role: 'Executive Director, Compass Regional Hospice',
      context: `Leads hospice and supportive care services across Queen Anne's, Kent, and Caroline counties. Hosts the annual gala fundraiser.`,
      contact: 'Compass Regional Hospice.'
    },
    'Sonny Jones': {
      role: 'Former Fire Chief, Easton Volunteer Fire Department',
      context: `Completed three two-year terms as chief before J.R. Dobson succeeded him in December 2024. Remains involved with the department.`,
      contact: 'Contact through Easton VFD.'
    },
    'Nick Newnam': {
      role: 'Chief, Trappe Volunteer Fire Company',
      context: `Leads the oldest firehouse in Talbot County. Spearheading the "Raise a New Firehouse" campaign for a $6 million reconstruction project.`,
      contact: '443-786-2035.'
    },
    'John Foster': {
      role: 'President, Trappe Volunteer Fire Company',
      context: `Works with Chief Newnam on fundraising and community outreach for the firehouse reconstruction.`,
      contact: '410-829-9073.'
    },
    'Eric Kellner': {
      role: 'Former Police Chief, Oxford Police Department (stepped down January 2024)',
      context: `Served briefly as Oxford's police chief starting April 2023. Stepped down for personal and professional reasons but remained with the department as a patrol officer.`,
      contact: 'Oxford Police Department.'
    },
    'Chris Phillips': {
      role: 'Lieutenant / Interim Chief, Oxford Police Department',
      context: `Assumed interim chief role when Eric Kellner stepped down in January 2024. Has been with the department for about five years.`,
      contact: 'Oxford Police Department.'
    },
    'Colleen Sheehan': {
      role: 'Founder, Chesapeake Bay Sight Foundation',
      context: `Diagnosed with retinitis pigmentosa at age 18. Founded the nonprofit in 2011 to fund eye disease research at Johns Hopkins Wilmer Eye Institute. Closed her 35-year accounting firm in 2024 to focus on the foundation. Plans to participate in an FDA-approved clinical trial for RP.`,
      contact: 'chesapeakebaysightfoundation.org. Office on Beach Avenue, Easton.'
    },
    'Dr. Kathryn Kelley': {
      role: 'Director, Clark Comprehensive Breast Center, Shore Regional Health',
      context: `Oversees breast cancer diagnosis and treatment for the five-county Mid-Shore area. In 2025, the center made 137 new diagnoses and completed over 12,000 imaging studies.`,
      contact: 'Shore Regional Health / Clark Comprehensive Breast Center.'
    },
    'Dr. Roberta Lilly': {
      role: 'Former Director, Clark Comprehensive Breast Center',
      context: `Founded and led the center for 13 years before retiring in 2020. Served as interim director again before final retirement in June 2025. Honored at the Working Artists Forum's "Pretty in Pink" event.`,
      contact: 'N/A (retired).'
    },
    'Konner Metz': {
      role: 'Reporter, Star Democrat',
      context: `Bylines appear on many Public Safety and Health stories in the dataset, including coverage of the Training Campus, Easton VFD, criminal cases, and heat-wave advisories.`,
      contact: 'kmetz@chespub.com.'
    }
  };

  // Build contact list HTML
  let html = `
    <p>The following individuals are key sources and stakeholders for the Health and Public Safety beat. This list is organized as a contact roster with roles, context, and contact information where available.</p>
    <div class="contact-list">
  `;

  Object.entries(keyPeople).forEach(([name, info]) => {
    html += `
      <div class="contact-card">
        <h4>${name}</h4>
        <p class="role">${info.role}</p>
        <p>${info.context}</p>
        <p class="contact"><strong>Contact:</strong> ${info.contact}</p>
      </div>
    `;
  });

  html += '</div>';

  // Add other frequently mentioned names
  const otherPeople = Array.from(peopleMap.entries())
    .filter(([n]) => !Object.keys(keyPeople).includes(n))
    .filter(([n]) => n.split(' ').length >= 2) // Must have at least first and last name
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  if (otherPeople.length) {
    html += `<h3>Other Individuals Mentioned</h3><ul>`;
    otherPeople.forEach(([name, count]) => {
      const contacts = contactsMap.get(name);
      let contactInfo = '';
      if (contacts) {
        if (contacts.emails.size) contactInfo += ` Email: ${Array.from(contacts.emails).join(', ')}`;
        if (contacts.phones.size) contactInfo += ` Phone: ${Array.from(contacts.phones).join(', ')}`;
      }
      html += `<li><strong>${name}</strong> (${count} mentions)${contactInfo}</li>`;
    });
    html += '</ul>';
  }

  node.innerHTML = html;
}

function buildGeography(stories) {
  const node = $('#geographyList');
  
  // Aggregate location mentions
  const locMap = new Map();
  stories.forEach(s => {
    const txt = (s.title || '') + ' ' + (s.content || '');
    extractLocations(txt).forEach((c, loc) => locMap.set(loc, (locMap.get(loc) || 0) + c));
  });

  const sortedLocs = Array.from(locMap.entries()).sort((a, b) => b[1] - a[1]);

  let html = `
    <p>The geographic focus of this guide is <strong>Talbot County</strong> and its five municipalities: <strong>Easton, Oxford, Queen Anne, St. Michaels, and Trappe</strong>. The county's location on Maryland's Eastern Shore shapes its public safety challenges—including long distances to major trauma centers—and its health infrastructure.</p>

    <h3>Key Municipalities</h3>
    
    <h4>Easton</h4>
    <p>The county seat and largest town, Easton is home to the Easton Volunteer Fire Department, Shore Regional Health's medical center, and the under-construction A. James Clark Training Campus on Mistletoe Drive. Downtown Easton features the Sidetracked Saloon (site of a 2023 shooting death) and various commercial areas. The Hummingbird Inn, a Queen Anne Victorian bed-and-breakfast, hosted a caregiver respite retreat in January 2024.</p>

    <h4>Trappe</h4>
    <p>A small town with the oldest firehouse in Talbot County, the Trappe Volunteer Fire Company. The company is raising $6 million for a new facility. The Freedom Fuel gas station on Route 50 was the site of a September 2024 shooting where a coworker was shot in the face.</p>

    <h4>St. Michaels</h4>
    <p>A waterfront community known for tourism and maritime heritage. St. Michaels Middle High School was the site of a 2024 assault on a school manager by a 15-year-old student. The St. Michaels Fire Department is raffling a Moke vehicle to fund breathing air equipment.</p>

    <h4>Oxford</h4>
    <p>A historic town on the Tred Avon River. The Oxford Police Department experienced leadership turnover in 2023–2024: Chief Patrick Maxwell retired abruptly in February 2023 after 34 years; Eric Kellner served briefly as chief before stepping down in January 2024; Chris Phillips assumed the interim chief role.</p>

    <h4>Queen Anne</h4>
    <p>One of Talbot County's smaller municipalities. References appear in coverage of countywide public safety matters.</p>

    <h3>Bodies of Water & Natural Landmarks</h3>
    <p>Water access shapes both recreation and emergency response in Talbot County:</p>
    <ul>
      <li><strong>Chesapeake Bay:</strong> The largest estuary in the United States. Maryland Natural Resources Police use thermal imaging to locate lost boaters on the Bay and its tributaries.</li>
      <li><strong>Broad Creek:</strong> On the county's west side south of St. Michaels. In July 2025, NRP used thermal imaging to rescue a lost juvenile kayaker who had drifted three miles from home.</li>
      <li><strong>Miles River:</strong> Flows past St. Michaels and into Eastern Bay.</li>
      <li><strong>Choptank River:</strong> The longest river on the Eastern Shore, forming Talbot County's southern boundary.</li>
      <li><strong>Eastern Bay:</strong> Connects the Chesapeake Bay to the Miles and Wye rivers.</li>
      <li><strong>Tilghman Island:</strong> A watermen's community at the end of a narrow peninsula. The Tilghman Island Volunteer Fire Company assisted in the 2025 kayaker rescue.</li>
    </ul>

    <h3>Location Mentions in Dataset</h3>
    <ul>
  `;

  sortedLocs.forEach(([loc, count]) => {
    html += `<li><strong>${loc}</strong> — ${count} mention${count > 1 ? 's' : ''}</li>`;
  });

  html += `</ul>
    <h3>Geographic Considerations for Reporters</h3>
    <p>Talbot County's rural character means volunteer fire departments may take longer to respond to incidents than urban departments. The county lacks a Veterans Affairs hospital; the nearest full-service VA is in Baltimore. Shock Trauma is the region's Level I trauma center—patients with severe injuries are flown there by helicopter. The county's narrow, crowned roads with no shoulders and ditches contribute to traffic fatalities.</p>
  `;

  node.innerHTML = html;
}

function buildStoryList(stories) {
  const container = $('#storyList');
  container.innerHTML = '';
  
  stories.forEach((s, idx) => {
    const div = document.createElement('div');
    div.className = 'story';
    div.innerHTML = `
      <strong>${s.title}</strong> <span class="pill">${s.llm_classification?.topic || 'News'}</span>
      <div style="color:#556;">${s.author || 'Staff'} — ${s.date}</div>
      <p>${(s.content || '').slice(0, 300).replace(/\n/g, ' ')}...</p>
      <button class="btn-small view" data-idx="${idx}">Open Full Story</button>
    `;
    container.appendChild(div);
  });

  container.querySelectorAll('.view').forEach(btn => btn.addEventListener('click', () => {
    const idx = parseInt(btn.dataset.idx);
    const s = window.__STORIES[idx];
    const win = window.open('about:blank', 'story');
    win.document.title = s.title;
    win.document.body.style.fontFamily = 'system-ui, Arial, sans-serif';
    win.document.body.style.maxWidth = '800px';
    win.document.body.style.margin = '20px auto';
    win.document.body.style.padding = '20px';
    win.document.body.style.lineHeight = '1.6';
    win.document.body.innerHTML = `
      <h1>${s.title}</h1>
      <p style="color:#666;">${s.author || 'Staff'} — ${s.date}</p>
      <p style="background:#eef6ff;padding:8px;border-radius:4px;"><strong>Topic:</strong> ${s.llm_classification?.topic || 'News'} — ${s.llm_classification?.explanation || ''}</p>
      <div>${s.content.replace(/\n/g, '<br>')}</div>
    `;
  }));
}

function buildIdeas() {
  const node = $('#ideasList');
  
  const ideas = [
    {
      headline: 'A. James Clark Training Campus: Is It on Track?',
      pitch: `The Training Campus on Mistletoe Drive was slated to open by the end of 2025. Track construction milestones, permit approvals, and weather delays. Has fundraising reached the $5 million goal? What training programs will be offered first?`,
      sources: 'Brett Whitehead (Friends of EVFD), Daryl Caldwell (Assistant Chief), Town of Easton officials, A. James & Alice B. Clark Foundation.',
      location: 'Mistletoe Drive, Easton.'
    },
    {
      headline: 'Volunteer Fire Department Recruitment Crisis',
      pitch: `Volunteer fire departments across Talbot County are struggling to recruit and retain members. How are Easton, Trappe, St. Michaels, and Tilghman Island adapting? What incentives—tax breaks, pension plans, training stipends—could help? How does volunteer staffing compare to 10 or 20 years ago?`,
      sources: 'J.R. Dobson (Easton), Nick Newnam (Trappe), Jessica Kastel (St. Michaels), Talbot County Commissioners.',
      location: 'Easton, Trappe, St. Michaels firehouses.'
    },
    {
      headline: 'Heat-Wave Preparedness in Rural Talbot County',
      pitch: `The June 2025 heat wave raised concerns about cooling centers and rural outreach. Are cooling centers adequate? How are elderly and isolated residents notified? What's the county's plan for future extreme heat events?`,
      sources: 'Dorchester County Health Department, Talbot County Health Department, local EMS, Talbot County Emergency Services.',
      location: 'Rural Talbot County, Easton, Trappe.'
    },
    {
      headline: 'Chesapeake Bay Sight Foundation: Clinical Trial Progress',
      pitch: `Founder Colleen Sheehan planned to participate in an FDA-approved clinical trial for retinitis pigmentosa in early 2025. Did the trial proceed? What are the results so far? How is the foundation's fundraising for the Wilmer Eye Institute progressing?`,
      sources: 'Colleen Sheehan, Johns Hopkins Wilmer Eye Institute / Singh Lab, Breanne Tsang (marketing director).',
      location: 'Beach Avenue office, Easton.'
    },
    {
      headline: 'Pending Criminal Cases: Antonio Bolden Sentencing',
      pitch: `Antonio Bolden pleaded guilty to attempted first-degree murder for the September 2024 Trappe gas station shooting. Sentencing was scheduled for September 15, 2025. What was the outcome? Was restitution ordered? What's the victim's current condition?`,
      sources: "Talbot County State's Attorney, Talbot County Circuit Court, court records.",
      location: 'Talbot County Circuit Court, Easton.'
    },
    {
      headline: 'Choptank Health Arson: Investigation Status',
      pitch: `A May 2024 fire at the under-construction Choptank Health facility in Federalsburg was ruled incendiary by the State Fire Marshal. Has anyone been charged? What's the status of the investigation? Did construction resume?`,
      sources: 'Office of the State Fire Marshal (Upper Eastern Regional Office: 410-822-7609), Maryland State Police, Choptank Community Health System.',
      location: 'Federalsburg, Caroline County.'
    },
    {
      headline: 'Regional Detention Facility: Will It Move Forward?',
      pitch: `Caroline County commissioners expressed concerns in January 2025 about a proposed regional detention center in Queen Anne's County. They objected to Queen Anne's control over the warden and operations. Has the agreement been revised? Will Caroline County sign on?`,
      sources: "Caroline County Commissioners (Travis Breeding), County Administrator Katheleen Freeman, Queen Anne's County Commissioners.",
      location: "Former Eastern Pre-Release Unit site, Church Hill, Queen Anne's County."
    }
  ];

  let html = `
    <p>The following story ideas highlight underreported angles, emerging issues, and practical reporting opportunities based on the dataset. Each includes recommended sources and locations.</p>
  `;

  ideas.forEach(idea => {
    html += `
      <div class="idea">
        <h4>${idea.headline}</h4>
        <p>${idea.pitch}</p>
        <p><strong>Sources:</strong> ${idea.sources}</p>
        <p><strong>Location:</strong> ${idea.location}</p>
      </div>
    `;
  });

  node.innerHTML = html;
}

function buildCaveats() {
  const node = $('#caveatsList');
  
  const caveats = [
    {
      title: 'Antonio Bolden Sentencing (September 15, 2025)',
      note: `Bolden pleaded guilty to attempted first-degree murder for the Trappe gas station shooting. Sentencing was scheduled for September 15, 2025. Verify the sentence imposed and any conditions of release.`
    },
    {
      title: 'Choptank Health Arson Investigation',
      note: `The May 2024 fire at Choptank Health's construction site in Federalsburg was ruled incendiary. As of the last available reporting, no arrests had been announced. Contact the State Fire Marshal for updates.`
    },
    {
      title: 'Regional Detention Facility Agreement',
      note: `Caroline County commissioners raised concerns about the proposed regional detention center in January 2025. Negotiations were ongoing. Verify whether an agreement has been signed and construction timeline.`
    },
    {
      title: 'A. James Clark Training Campus Opening',
      note: `The goal was to open by the end of 2025, contingent on permits and weather. Confirm whether the campus opened on schedule and what programs are operational.`
    },
    {
      title: 'Oxford Police Chief Position',
      note: `As of January 2024, Chris Phillips was serving as interim chief. Verify whether a permanent chief has been appointed.`
    },
    {
      title: 'Chesapeake Bay Sight Foundation Clinical Trial',
      note: `Founder Colleen Sheehan planned to participate in an FDA-approved clinical trial in early 2025. Verify participation status and any results.`
    },
    {
      title: 'Trappe Firehouse Reconstruction',
      note: `The "Raise a New Firehouse" campaign launched in July 2024 with a $1.5 million annual goal. Verify current fundraising totals and construction timeline.`
    }
  ];

  let html = `
    <p><strong>Important:</strong> Several storylines in the dataset were unresolved at the time of publication. Status may have changed since these stories were written. Always verify current information before reporting.</p>
  `;

  caveats.forEach(c => {
    html += `
      <div class="caveat">
        <h4>⚠️ ${c.title}</h4>
        <p>${c.note}</p>
      </div>
    `;
  });

  html += `
    <h3>General Caveats</h3>
    <ul>
      <li>All information is derived from published <em>Star Democrat</em> stories. Some details may have been updated or corrected since publication.</li>
      <li>Contact information extracted from stories may be outdated. Verify before using.</li>
      <li>Criminal case outcomes, sentencing, and appeals may have changed. Check court records for current status.</li>
      <li>Fundraising totals and construction timelines are subject to change. Contact organizations directly for current figures.</li>
    </ul>
  `;

  node.innerHTML = html;
}
