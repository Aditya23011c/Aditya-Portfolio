import React from 'react';

export const S = 14;            // distance between stations (world units)
export const N = 10;            // number of stations
// which wall the camera turns toward at each station (1 right, -1 left, 0 straight)
export const SD = [1, 1, 1, -1, 1, -1, 1, 0, 1, 0];
export const NAMES = ['The entrance', 'About me', 'Mail Rakshak', 'Farm Rakshak', 'AI NLP Playground', 'NASA weather model', 'CognitoLab', 'Hackathons', 'Skills', 'Contact'];

// Framed exhibits on the walls. `side`: 1 = right wall, -1 = left wall.
export const FRAMES = [
  { st: 1, slug: 'photo', side: 1, w: 2.1, h: 2.8, title: 'ADITYA PRAKASH GUPTA' },
  { st: 2, slug: 'mail-rakshak', side: 1, w: 3.2, h: 2, title: 'MAIL RAKSHAK' },
  { st: 3, slug: 'farm-rakshak', side: -1, w: 3.2, h: 2, title: 'FARM RAKSHAK' },
  { st: 4, slug: 'nlp-playground', side: 1, w: 3.2, h: 2, title: 'AI NLP PLAYGROUND' },
  { st: 5, slug: 'nasa-weather', side: -1, w: 3.2, h: 2, title: 'NASA WEATHER MODEL' },
  { st: 6, slug: 'cognitolab', side: 1, w: 3.2, h: 2, title: 'COGNITOLAB' },
];

export const HACKATHONS = ['ELECTROTHON 8.0', 'NASA SPACE APPS', 'KODEKALESH', 'SMART INDIA HACKATHON'];
export const SKILL_WORDS = ['Python', 'Scikit-learn', 'NLTK', 'HuggingFace', 'DistilBERT', 'Pandas', 'NumPy', 'Streamlit', 'FastAPI', 'Gemini API', 'Java', 'Git', 'REST APIs', 'NLP'];

const Link = ({ href, children, solid }) => (
  <a className={solid ? 'btn solid' : 'btn'} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
);
const Tags = ({ items }) => <ul className="tags">{items.map((t) => <li key={t}>{t}</li>)}</ul>;

// side: where the text panel sits on screen
export const PANELS = [
  { side: 'bare', body: (<>
    <h1>ADITYA<br />PRAKASH GUPTA</h1>
    <p className="lead">AI/ML developer in the making. I build NLP and machine learning projects in Python and ship them as working apps.</p>
    <p className="cue">SCROLL TO WALK THROUGH</p>
  </>) },
  { side: 'L', body: (<>
    <h2>About</h2>
    <p>Final-year B.Tech Computer Science student at MPEC Kanpur (CGPA 7.37). I work mostly in Python with Scikit-learn, NLTK and HuggingFace, and use Streamlit or JavaScript to get projects in front of users.</p>
    <p>I'm looking for an AI/ML or software development internship.</p>
  </>) },
  { side: 'L', body: (<>
    <h2>Mail Rakshak</h2>
    <p className="meta">Smart India Hackathon 2026 · team Brute Force · I'm the ML/NLP engineer</p>
    <ul>
      <li>Flags phishing and other email threats with a fine-tuned DistilBERT model (99% F1 on a 199,909-row dataset), hosted on HuggingFace Hub.</li>
      <li>Served through a FastAPI service. A TF-IDF and Gradient Boosting baseline reached 96% accuracy.</li>
      <li>Anchors the hash of each finalized case on the Ethereum Sepolia testnet as tamper-evident evidence, with a MongoDB analytics layer.</li>
    </ul>
    <Tags items={['DistilBERT', 'FastAPI', 'Scikit-learn', 'Solidity', 'MongoDB']} />
    <div className="row"><Link href="https://github.com/Aditya23011c/SIH26106-ml-engine">GitHub</Link></div>
  </>) },
  { side: 'R', body: (<>
    <h2>Farm Rakshak</h2>
    <p className="meta">Electrothon 8.0, NIT Hamirpur · final-round evaluation</p>
    <ul>
      <li>Livestock dashboard with herd records, a diagnosis log and a Hindi/English switch.</li>
      <li>Three vision AIs (disease, thermal and medicine) plus a voice-enabled assistant, built on Gemini 2.5 Flash with a multi-agent design.</li>
      <li>Runs on free-tier hosting, so it costs nothing to run.</li>
    </ul>
    <Tags items={['JavaScript', 'Gemini API', 'Multi-agent']} />
    <div className="row"><Link solid href="https://farmrakshak0.netlify.app/">Live demo</Link><Link href="https://github.com/Aditya23011c">GitHub</Link></div>
  </>) },
  { side: 'L', body: (<>
    <h2>AI NLP Playground</h2>
    <p className="meta">Personal project</p>
    <ul>
      <li>Six tools in one app: summarization, translation, entity recognition, keywords, sentiment and a chatbot.</li>
      <li>Modular design: new tools plug in without changing existing code.</li>
    </ul>
    <Tags items={['Python', 'NLTK', 'HuggingFace', 'Streamlit']} />
    <div className="row"><Link href="https://github.com/Aditya23011c/AI-NLP-PlayGround">GitHub</Link></div>
  </>) },
  { side: 'R', body: (<>
    <h2>NASA Weather Model</h2>
    <p className="meta">NASA International Space Apps Challenge</p>
    <ul>
      <li>Forecasts temperature and precipitation from three NASA datasets: MERRA-2, POWER and GPM.</li>
      <li>Random Forest Regressor reached a mean absolute error of 2.3°C.</li>
    </ul>
    <Tags items={['Python', 'Scikit-learn', 'Pandas']} />
    <div className="row"><Link href="https://github.com/Aditya23011c/NASA_Dataset">GitHub</Link></div>
  </>) },
  { side: 'L', body: (<>
    <h2>CognitoLab</h2>
    <p className="meta">KodeKalesh Hackathon</p>
    <p>A web-based psychology lab where people run standardised psychological experiments in the browser, built to make research easier to access.</p>
    <div className="row"><Link href="https://github.com/Aditya23011c/cognitolab-platform">GitHub</Link></div>
  </>) },
  { side: 'R', body: (<>
    <h2>Hackathons</h2>
    <ul>
      <li><b>Electrothon 8.0, NIT Hamirpur:</b> led a team through a 36-hour build.</li>
      <li><b>NASA Space Apps:</b> weather prediction model.</li>
      <li><b>KodeKalesh:</b> CognitoLab.</li>
      <li><b>Smart India Hackathon:</b> KrishiMitra (cleared the college-level round) and, in 2026, Mail Rakshak.</li>
    </ul>
  </>) },
  { side: 'L', body: (<>
    <h2>Skills</h2>
    <p><b>Languages:</b> Python, Java, HTML, CSS<br /><b>ML:</b> NLP, supervised learning, regression, classification<br /><b>Libraries:</b> Scikit-learn, NLTK, Pandas, NumPy, Streamlit, HuggingFace<br /><b>Tools:</b> Git, Gemini API, FastAPI, REST APIs, Netlify</p>
    <p className="meta">Certified: Oracle AI Foundations, NPTEL Java and Cyber Security, IBM Data Visualization with Python.</p>
  </>) },
  { side: 'C', body: (<>
    <h2>Get in touch</h2>
    <p>Open to AI/ML and software internships. Email is the fastest way to reach me.</p>
    <div className="row center">
      <a className="btn solid" href="mailto:adityaprakashgupta76@gmail.com">Email me</a>
      <Link href="https://www.linkedin.com/in/adityaprakashgupta07">LinkedIn</Link>
      <Link href="https://github.com/Aditya23011c">GitHub</Link>
    </div>
  </>) },
];
