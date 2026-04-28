/*
  disaster.js
  Reads ?id=FAIL-001 from the URL, fetches raw_failures.json,
  finds the matching disaster and populates the page.

  DIAGRAM FILES:
  Put SVGs in the diagrams/ folder named by number (no leading zero):
    diagrams/1.svg   → FAIL-001 Challenger
    diagrams/5.svg   → FAIL-005 Titanic
    diagrams/46.svg  → FAIL-046 Apollo 13
  Also supports .png .jpg .jpeg .webp as fallbacks.
  All SVGs should use viewBox="0 0 1080 742" for a perfect 16:11 fit.

  VIDEOS:
  Add entries to VIDEOS below — JSON is never touched.
*/

/* ── Video lookup ── */
const VIDEOS = {
  'FAIL-001': {
    url:   'PASTE_YOUTUBE_URL_HERE',
    label: 'Space Shuttle Challenger documentary.'
  },
  'FAIL-003': {
    url:   'PASTE_YOUTUBE_URL_HERE',
    label: 'Tacoma Narrows Bridge collapse footage.'
  },
  'FAIL-005': {
    url:   'PASTE_YOUTUBE_URL_HERE',
    label: 'RMS Titanic documentary.'
  },
  'FAIL-010': {
    url:   'PASTE_YOUTUBE_URL_HERE',
    label: 'Chernobyl nuclear disaster documentary.'
  },
  'FAIL-046': {
    url:   'https://www.youtube.com/watch?v=sJ3Q3kL7jcA',
    label: 'Apollo 13: Houston, We\'ve Got a Problem — Official NASA archival documentary featuring real mission footage, Mission Control audio, and astronaut commentary.'
  },
  'FAIL-033': {
    url:   'https://www.youtube.com/watch?v=Z-LlVyNpjpE',
    label: 'Champlain Towers South collapse documentary.'
  },
  'FAIL-048': {
    url:   'https://youtu.be/6LcGrLnzYuU',
    label: 'Titan submersible implosion documentary.'
  },
  'FAIL-007': {
    url:   'https://www.youtube.com/watch?v=-lyyIvxy2Z4',
    label: 'Deepwater Horizon oil spill documentary.'
  },
  'FAIL-008': {
    url:   'https://youtu.be/NDeWmvJ2AOs',
    label: 'Fukushima nuclear accident documentary.'
  },
  'FAIL-013': {
    url:   'https://youtu.be/3DV7cVJHUh4',
    label: 'Apollo 1 cabin fire documentary.'
  },
  'FAIL-017': {
    url:   'https://youtu.be/xEPswDYbcnk',
    label: 'I-35W bridge collapse documentary.'
  },
  'FAIL-036': {
    url:   'https://youtu.be/-ibvUxv1-lM',
    label: 'St. Francis Dam failure documentary.'
  },
  'FAIL-037': {
    url:   'https://youtu.be/rhk8BJIMkLM',
    label: 'Teton Dam failure documentary.'
  }
};

/* ────────────────────────────────────────────────────── */

async function init() {
    const params = new URLSearchParams(window.location.search);
    const id     = params.get('id');

    if (!id) { showError(); return; }

    let data;
    try {
        const res = await fetch('raw_failures.json');
        data = await res.json();
    } catch (e) {
        console.error('Could not load raw_failures.json:', e);
        showError();
        return;
    }

    const disasters = data.disasters;
    const index     = disasters.findIndex(d => d.id === id);

    if (index === -1) { showError(); return; }

    const d = disasters[index];

    /* ── Page title ── */
    document.title = `${d.name} (${d.year}) — Engineering Failures`;

    /* ── Cinematic hero ── */
    const img = window.getImagery ? window.getImagery(d) : null;
    const cinemaBg = document.getElementById('dsCinemaHeroBg');
    if (cinemaBg && img) cinemaBg.style.backgroundImage = `url('${img.hero}')`;
    setText('dsCinemaTitle',      d.name);
    setText('dsCinemaYear',       d.year);
    setText('dsCinemaLocation',   d.location);
    setText('dsCinemaDiscipline', `${d.discipline} · ${d.type}`);
    setText('dsCinemaEyebrow',    `Case ${d.id}`);
    if (img) setText('dsCinemaCredit', `Image: ${img.credit}`);

    /* ── Hero strip (below cinematic hero) ── */
    setText('bcName',       d.name);
    setText('dsId',         d.id);
    setText('dsDiscipline', d.discipline);
    setText('dsType',       d.type);
    setText('dsTitle',      d.name);
    setText('dsLocation',   d.location);
    setText('dsYear',       d.year);

    /* ── Stats strip ── */
    setText('statDiscipline', d.discipline);
    setText('statType',       d.type);
    setText('statYear',       d.year);
    setText('statLocation',   d.location);

    /* ── Details grid ── */
    setText('detId',         d.id);
    setText('detYear',       d.year);
    setText('detDiscipline', d.discipline);
    setText('detType',       d.type);
    setText('detLocation',   d.location);

    /* ── Root cause ── */
    const causeEl  = document.getElementById('causeContent');
    const hasCause = d.cause && d.cause.trim() !== '' && d.cause.trim() !== '# FILL OUT HERE';
    if (hasCause) {
        causeEl.textContent = d.cause;
        causeEl.classList.remove('cause-empty');
        causeEl.classList.add('has-cause');
    } else {
        causeEl.textContent = 'Root cause analysis not yet available for this case study.';
        causeEl.classList.add('cause-empty');
    }

    /* ── Diagram ── */
    // Strip FAIL- prefix and leading zeros: FAIL-046 → 46, FAIL-005 → 5
    const num         = String(parseInt(id.replace('FAIL-', ''), 10));
    const diagramArea = document.getElementById('diagramArea');

    // 1. Check for multi-panel SVGs: 46-1.svg, 46-2.svg, 46-3.svg, 46-4.svg
    const panel1 = `diagrams/${num}-1.svg`;
    if (await fileExists(panel1)) {
        const panels = [panel1];
        for (let i = 2; i <= 4; i++) {
            const p = `diagrams/${num}-${i}.svg`;
            if (await fileExists(p)) panels.push(p);
            else break;
        }
        buildTabs(panels, diagramArea);
    } else {
        // 2. Fall back to single file: 46.svg / 46.png / etc.
        const extensions = ['svg', 'png', 'jpg', 'jpeg', 'webp'];
        let diagramFound = false;
        for (const ext of extensions) {
            const path = `diagrams/${num}.${ext}`;
            if (await fileExists(path)) {
                loadPanel(path, diagramArea);
                diagramFound = true;
                break;
            }
        }
        if (!diagramFound) {
            const descEl = document.getElementById('diagramDesc');
            if (descEl) descEl.textContent = 'Diagram coming soon';
        }
    }

    /* ── Video ── */
    const videoEntry = VIDEOS[d.id];
    if (videoEntry) {
        const videoId = extractYouTubeId(videoEntry.url);
        if (videoId) {
            document.getElementById('videoIframe').src =
                `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
            document.getElementById('videoCaption').textContent = videoEntry.label;
            document.getElementById('videoBlock').style.display = 'block';
        }
    }

    /* ── Prev / Next navigation ── */
    const prevBtn    = document.getElementById('navPrev');
    const prevSpacer = document.getElementById('navPrevSpacer');
    const nextBtn    = document.getElementById('navNext');
    const nextSpacer = document.getElementById('navNextSpacer');

    if (index > 0) {
        const prev = disasters[index - 1];
        prevBtn.href             = `disaster.html?id=${prev.id}`;
        prevBtn.textContent      = `← ${prev.name}`;
        prevBtn.style.display    = 'flex';
        prevSpacer.style.display = 'none';
    } else {
        prevBtn.style.display    = 'none';
        prevSpacer.style.display = 'block';
    }

    if (index < disasters.length - 1) {
        const next = disasters[index + 1];
        nextBtn.href             = `disaster.html?id=${next.id}`;
        nextBtn.textContent      = `${next.name} →`;
        nextBtn.style.display    = 'flex';
        nextSpacer.style.display = 'none';
    } else {
        nextBtn.style.display    = 'none';
        nextSpacer.style.display = 'block';
    }

    /* ── Related disasters: same discipline, closest in year ── */
    buildRelated(d, disasters);

    /* ── Diagram entrance + cinematic hero parallax ── */
    initDiagramReveal();
    initCinemaParallax();

    /* ── Show content ── */
    showContent();
}

function buildRelated(current, all) {
    const section = document.getElementById('relatedDisasters');
    const grid    = document.getElementById('relatedGrid');
    if (!section || !grid) return;
    const candidates = all
        .filter(x => x.id !== current.id && x.discipline === current.discipline)
        .sort((a, b) => Math.abs(a.year - current.year) - Math.abs(b.year - current.year))
        .slice(0, 3);
    if (!candidates.length) return;
    grid.innerHTML = candidates.map(d => {
        const img = window.getImagery ? window.getImagery(d) : null;
        const bg  = img ? `style="background-image:url('${img.hero}')"` : '';
        return `
        <a href="disaster.html?id=${d.id}" class="related-card" ${bg}>
            <div class="related-year">${d.year} · ${d.type}</div>
            <div class="related-name">${d.name}</div>
        </a>`;
    }).join('');
    section.style.display = 'block';
}

function initDiagramReveal() {
    const card = document.querySelector('.diagram-card');
    if (!card) return;
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in-view');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.25 });
    obs.observe(card);
}

function initCinemaParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;
    const bg = document.getElementById('dsCinemaHeroBg');
    if (!bg) return;
    let ticking = false;
    function update() {
        const y = window.scrollY;
        bg.style.transform = `translate3d(0, ${y * 0.4}px, 0)`;
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
}

/* ── Helpers ── */

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? '—';
}

function showContent() {
    document.getElementById('stateLoading').style.display = 'none';
    document.getElementById('stateError').style.display   = 'none';
    document.getElementById('stateContent').style.display = 'block';
}

function showError() {
    document.getElementById('stateLoading').style.display = 'none';
    document.getElementById('stateError').style.display   = 'block';
    document.getElementById('stateContent').style.display = 'none';
    document.title = 'Not Found — Engineering Failures';
}

// Check if a file exists by trying to load it as an image
// Works for SVG too since browsers treat SVG as an image source
function fileExists(url) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload  = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

function extractYouTubeId(url) {
    try {
        const u = new URL(url);
        if (u.hostname === 'youtu.be') return u.pathname.slice(1);
        if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
    } catch (_) {}
    return null;
}

/* ── Load a single panel into the diagram area ── */
function loadPanel(path, diagramArea) {
    const isSVG = path.endsWith('.svg');
    if (isSVG) {
        diagramArea.innerHTML = `<iframe src="${path}" style="width:100%;height:100%;border:none;display:block;"></iframe>`;
    } else {
        diagramArea.innerHTML = `<img src="${path}" style="width:100%;height:100%;object-fit:contain;display:block;">`;
    }
    diagramArea.classList.remove('no-diagram');
    window._lbSrc  = path;
    window._lbType = isSVG ? 'svg' : 'img';
}

/* ── Build tab bar for multi-panel SVGs ── */
function buildTabs(panels, diagramArea) {
    const labelBar = document.querySelector('.diagram-label');
    if (labelBar) {
        labelBar.innerHTML = '';
        labelBar.style.padding = '0';

        const tabStrip = document.createElement('div');
        tabStrip.style.cssText = 'display:flex;flex:1;height:100%;';

        panels.forEach((path, i) => {
            const btn = document.createElement('button');
            btn.textContent = 'Panel ' + (i + 1);
            btn.style.cssText = [
                'flex:1',
                'height:100%',
                'background:transparent',
                'border:none',
                'border-right:1px solid var(--border)',
                'font-family:Space Mono,monospace',
                'font-size:0.6rem',
                'font-weight:700',
                'letter-spacing:0.1em',
                'text-transform:uppercase',
                'cursor:pointer',
                'color:var(--text-muted)',
                'transition:background 0.15s,color 0.15s'
            ].join(';');

            btn.addEventListener('click', () => {
                loadPanel(path, diagramArea);
                // Update active tab highlight
                tabStrip.querySelectorAll('button').forEach((b, j) => {
                    b.style.background = j === i ? 'var(--bg-elevated)' : 'transparent';
                    b.style.color      = j === i ? 'var(--text-primary)' : 'var(--text-muted)';
                });
            });

            if (i === 0) {
                btn.style.background = 'var(--bg-elevated)';
                btn.style.color      = 'var(--text-primary)';
            }

            tabStrip.appendChild(btn);
        });

        const hint = document.createElement('span');
        hint.className   = 'diagram-zoom-hint';
        hint.textContent = '⊕ ZOOM';
        hint.style.cssText = 'padding:0 12px;white-space:nowrap;';
        labelBar.appendChild(tabStrip);
        labelBar.appendChild(hint);
    }

    // Load first panel
    loadPanel(panels[0], diagramArea);
}

/* ── Run ── */
init();