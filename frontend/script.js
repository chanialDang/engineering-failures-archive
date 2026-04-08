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

        // Trigger observer for newly injected elements
        observeReveal();

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

    const track = document.getElementById('timelineTrack');
    if (!track) return;

    track.innerHTML = nodes.map((disaster, i) => `
        <div class="timeline-node" style="transition-delay: ${i * 60}ms">
            <div class="timeline-year-col">
                <span class="timeline-year">${disaster.year}</span>
                <span class="timeline-dot"></span>
            </div>
            <div class="timeline-content">
                <a href="disaster.html?id=${disaster.id}" class="timeline-name">${disaster.name}</a>
                <div class="timeline-meta">${disaster.location} &nbsp;·&nbsp; ${disaster.discipline}</div>
            </div>
        </div>
    `).join('');
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

// Initialize
loadData();
observeReveal();
