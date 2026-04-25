// Load disasters data and populate landing page
async function loadData() {
    try {
        const response = await fetch('raw_failures.json');
        const data = await response.json();

        // Update category counts
        const counts = {
            Civil: 0,
            Mechanical: 0,
            Electrical: 0,
            Chemical: 0
        };

        data.disasters.forEach(d => {
            if (counts.hasOwnProperty(d.discipline)) {
                counts[d.discipline]++;
            }
        });

        document.getElementById('civilCount').textContent = `${counts.Civil} Disasters`;
        document.getElementById('mechanicalCount').textContent = `${counts.Mechanical} Disasters`;
        document.getElementById('electricalCount').textContent = `${counts.Electrical} Disasters`;
        document.getElementById('chemicalCount').textContent = `${counts.Chemical} Disasters`;

        // Featured disasters
        const featured = [
            data.disasters.find(d => d.id === 'FAIL-001'),
            data.disasters.find(d => d.id === 'FAIL-003'),
            data.disasters.find(d => d.id === 'FAIL-005'),
            data.disasters.find(d => d.id === 'FAIL-010'),
            data.disasters.find(d => d.id === 'FAIL-017'),
            data.disasters.find(d => d.id === 'FAIL-048')
        ].filter(Boolean);

        const featuredGrid = document.getElementById('featuredGrid');
        featuredGrid.innerHTML = featured.map((disaster, i) => `
            <a href="disaster.html?id=${disaster.id}" class="card reveal" style="transition-delay: ${i * 80}ms">
                <div class="card-header">
                    <span class="card-id">${disaster.id}</span>
                    <span class="card-year">${disaster.year}</span>
                </div>
                <h3 class="card-title">${disaster.name}</h3>
                <div class="card-location">📍 ${disaster.location}</div>
                <div class="card-badges">
                    <span class="badge badge-discipline">${disaster.discipline}</span>
                    <span class="badge badge-type">${disaster.type}</span>
                </div>
            </a>
        `).join('');

        // Timeline — 10 disasters spread across the full 1847–2023 span
        buildTimeline(data);

        // Dot matrix — all 50 disasters
        buildDotMatrix(data.disasters);

        // Trigger observer for newly injected elements
        observeReveal();

        // Magnetic tilt on featured cards
        initMagneticCards();

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Build the timeline section with disasters spread across the archive's full date range
function buildTimeline(data) {
    // Handpicked IDs for historical spread — earliest to most recent, across disciplines
    const timelineIds = [
        'FAIL-002', // Ashtabula Rail Bridge (1876) — earliest Civil
        'FAIL-005', // Titanic (1912) — Mechanical
        'FAIL-003', // Tacoma Narrows (1940) — Civil
        'FAIL-007', // Texas City Refinery (1947) — Chemical
        'FAIL-015', // Vajont Dam (1963) — Civil
        'FAIL-004', // Three Mile Island (1979) — Electrical
        'FAIL-009', // Bhopal (1984) — Chemical
        'FAIL-001', // Challenger (1986) — Mechanical
        'FAIL-010', // Chernobyl (1986) — Electrical
        'FAIL-020', // Deepwater Horizon (2010) — Mechanical
        'FAIL-048', // Titan Submersible (2023) — Mechanical
    ];

    // Fall back gracefully if some IDs don't exist in the data
    const nodes = timelineIds
        .map(id => data.disasters.find(d => d.id === id))
        .filter(Boolean)
        .sort((a, b) => a.year - b.year);

    // If we couldn't find enough handpicked ones, fill from all disasters sorted by year
    if (nodes.length < 6) {
        const sorted = [...data.disasters].sort((a, b) => a.year - b.year);
        const step = Math.floor(sorted.length / 10);
        for (let i = 0; i < sorted.length && nodes.length < 10; i += step) {
            if (!nodes.find(n => n.id === sorted[i].id)) nodes.push(sorted[i]);
        }
        nodes.sort((a, b) => a.year - b.year);
    }

    buildScrollyTimeline(nodes);
}

// Scroll-reveal via Intersection Observer
function observeReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .timeline-node').forEach(el => observer.observe(el));
}

// ===== FEATURE 1: SCROLLYTELLING TIMELINE =====
function buildScrollyTimeline(nodes) {
    const stepsEl = document.getElementById('scrollySteps');
    const yearEl = document.getElementById('scrollyYear');
    const nameEl = document.getElementById('scrollyName');
    const badgeEl = document.getElementById('scrollyBadge');
    const fuseEl = document.getElementById('scrollyFuse');
    const counterEl = document.getElementById('scrollyCounter');
    if (!stepsEl || !yearEl) return;

    stepsEl.innerHTML = nodes.map((d, i) => {
        const causeText = (d.cause || '').replace(/[#*_`]/g, '').substring(0, 130);
        const ellipsis = (d.cause || '').length > 130 ? '...' : '';
        return `
        <div class="scrolly-step" data-idx="${i}">
            <div class="scrolly-step-inner">
                <div class="scrolly-step-eyebrow">${d.discipline} &nbsp;·&nbsp; ${d.location}</div>
                <h3 class="scrolly-step-title">${d.name}</h3>
                <div class="scrolly-step-meta">${d.type}<br><br>${causeText}${ellipsis}</div>
                <a href="disaster.html?id=${d.id}" class="scrolly-step-link">Read full case →</a>
            </div>
        </div>`;
    }).join('');

    function updatePanel(d, idx) {
        const pct = Math.round((idx + 1) / nodes.length * 100);
        yearEl.classList.add('changing');
        setTimeout(() => {
            yearEl.textContent = d.year;
            nameEl.textContent = d.name;
            badgeEl.textContent = d.discipline;
            fuseEl.style.width = pct + '%';
            counterEl.textContent =
                String(idx + 1).padStart(2, '0') + ' / ' + String(nodes.length).padStart(2, '0');
            yearEl.classList.remove('changing');
        }, 180);
    }

    if (nodes.length > 0) {
        yearEl.textContent = nodes[0].year;
        nameEl.textContent = nodes[0].name;
        badgeEl.textContent = nodes[0].discipline;
        fuseEl.style.width = Math.round(1 / nodes.length * 100) + '%';
        counterEl.textContent = '01 / ' + String(nodes.length).padStart(2, '0');
    }

    const steps = stepsEl.querySelectorAll('.scrolly-step');
    steps[0]?.classList.add('active');

    const stepObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const idx = parseInt(entry.target.dataset.idx);
            steps.forEach((s, i) => s.classList.toggle('active', i === idx));
            updatePanel(nodes[idx], idx);
        });
    }, { threshold: 0.5 });

    steps.forEach(s => stepObs.observe(s));
}

// ===== FEATURE 2: DOT MATRIX =====
function buildDotMatrix(disasters) {
    const grid = document.getElementById('dotMatrixGrid');
    const tooltip = document.getElementById('dotTooltip');
    if (!grid || !tooltip) return;

    const colors = {
        Civil: '#e74c3c',
        Mechanical: '#4da6ff',
        Electrical: '#f39c12',
        Chemical: '#2ecc71'
    };

    const sorted = [...disasters].sort((a, b) => a.year - b.year);

    grid.innerHTML = sorted.map(d => `
        <div class="disaster-dot"
            data-disc="${d.discipline}"
            data-id="${d.id}"
            data-name="${d.name}"
            data-year="${d.year}"
            data-loc="${d.location}"
            style="background:${colors[d.discipline] || '#888'}">
        </div>
    `).join('');

    const dots = grid.querySelectorAll('.disaster-dot');

    dots.forEach(dot => {
        dot.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
            tooltip.innerHTML = `
                <div class="dot-tooltip-name">${dot.dataset.name}</div>
                <div class="dot-tooltip-meta">${dot.dataset.year} · ${dot.dataset.loc}<br>${dot.dataset.disc}</div>
            `;
        });
        dot.addEventListener('mousemove', e => {
            tooltip.style.left = (e.clientX + 14) + 'px';
            tooltip.style.top = (e.clientY - 10) + 'px';
        });
        dot.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });
        dot.addEventListener('click', () => {
            window.location.href = `disaster.html?id=${dot.dataset.id}`;
        });
    });

    document.querySelectorAll('.dot-legend-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.dot-legend-item').forEach(l => l.classList.remove('active-legend'));
            item.classList.add('active-legend');
            const filter = item.dataset.filter;
            dots.forEach(dot => {
                const match = filter === 'all' || dot.dataset.disc === filter;
                dot.classList.toggle('dot-dimmed', !match);
            });
        });
    });

    const section = document.querySelector('.dot-matrix-section');
    if (section) {
        let animated = false;
        const obs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animated) {
                animated = true;
                dots.forEach((dot, i) => {
                    setTimeout(() => dot.classList.add('dot-visible'), i * 28);
                });
                obs.unobserve(section);
            }
        }, { threshold: 0.1 });
        obs.observe(section);
    }
}

// ===== FEATURE 3: CURSOR SPOTLIGHT =====
function initCursorSpotlight() {
    const hero = document.querySelector('.hero-landing');
    const spotlight = document.getElementById('heroSpotlight');
    if (!hero || !spotlight) return;

    hero.addEventListener('mousemove', e => {
        const rect = hero.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        const py = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
        spotlight.style.background =
            `radial-gradient(600px circle at ${px}% ${py}%, rgba(192,57,43,0.11), transparent 70%)`;
    });

    hero.addEventListener('mouseleave', () => {
        spotlight.style.background =
            `radial-gradient(600px circle at 50% 40%, rgba(192,57,43,0.06), transparent 70%)`;
    });
}

// ===== FEATURE 3: STAT COUNT-UP =====
function initStatCountUp() {
    const stats = document.querySelectorAll('.stat-number[data-count]');
    if (!stats.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            obs.unobserve(entry.target);
            const el = entry.target;
            const target = parseFloat(el.dataset.count);
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            const isFloat = target % 1 !== 0;
            const duration = 1400;
            const start = performance.now();

            function tick(now) {
                const t = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - t, 3);
                const val = eased * target;
                el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
                if (t < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
    }, { threshold: 0.4 });

    stats.forEach(el => obs.observe(el));
}

// ===== FEATURE 4: MAGNETIC CARD TILT =====
function initMagneticCards() {
    document.querySelectorAll('.featured-grid .card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
            const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
            card.style.transform =
                `perspective(900px) rotateX(${(-dy * 7).toFixed(2)}deg) rotateY(${(dx * 7).toFixed(2)}deg) translateY(-6px)`;
            card.style.boxShadow = `${-dx * 8}px ${-dy * 8}px 36px rgba(29,29,31,0.14)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });
}

// Initialize
loadData();
observeReveal();
initCursorSpotlight();
initStatCountUp();

// ===== CHAT WIDGET =====
(function () {
    const API_URL = 'https://engineering-failures-archive-production.up.railway.app';
    const toggle   = document.getElementById('chatToggle');
    const panel    = document.getElementById('chatPanel');
    const closeBtn = document.getElementById('chatClose');
    const messages = document.getElementById('chatMessages');
    const input    = document.getElementById('chatInput');
    const send     = document.getElementById('chatSend');
    let isOpen = false;
    let history = [];

    function openChat()  { isOpen = true;  panel.classList.remove('chat-hidden'); input.focus(); }
    function closeChat() { isOpen = false; panel.classList.add('chat-hidden'); }

    toggle.addEventListener('click', () => isOpen ? closeChat() : openChat());
    closeBtn.addEventListener('click', closeChat);

    function appendMsg(text, role) {
        const div = document.createElement('div');
        div.className = `chat-msg chat-msg-${role}`;
        div.innerHTML = marked.parse(text);
        renderMathInElement(div, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '\\(', right: '\\)', display: false },
                { left: '\\[', right: '\\]', display: true },
            ],
            throwOnError: false,
        });
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return div;
    }

    async function sendMessage() {
        const msg = input.value.trim();
        if (!msg) return;
        input.value = '';
        send.disabled = true;
        appendMsg(msg, 'user');
        const thinking = document.createElement('div');
        thinking.className = 'chat-msg chat-msg-ai chat-msg-thinking';
        thinking.innerHTML = '<span></span><span></span><span></span>';
        messages.appendChild(thinking);
        messages.scrollTop = messages.scrollHeight;
        try {
            const res  = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, history }),
            });
            const data = await res.json();
            thinking.remove();
            appendMsg(data.response, 'ai');
            history.push({ role: 'user', content: msg }, { role: 'assistant', content: data.response });
            if (history.length > 10) history = history.slice(-10);
        } catch {
            thinking.remove();
            appendMsg('Could not reach the backend.', 'ai');
        } finally {
            send.disabled = false;
            input.focus();
        }
    }

    send.addEventListener('click', sendMessage);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
}());
