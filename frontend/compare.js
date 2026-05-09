/*
  compare.js — pick up to 3 disasters, render side-by-side cards + a delta table.
  URL state: ?ids=FAIL-001,FAIL-005,FAIL-010
*/

const MAX_PICKS = 3;
let DATA = [];
let picked = [];

(async function init() {
    try {
        const res = await fetch('raw_failures.json');
        DATA = (await res.json()).disasters || [];
    } catch (e) {
        console.error('compare.js: cannot load raw_failures.json', e);
        return;
    }

    const params = new URLSearchParams(location.search);
    const idsParam = (params.get('ids') || '').trim();
    if (idsParam) {
        picked = idsParam.split(',')
            .map(s => s.trim())
            .filter(id => DATA.some(d => d.id === id))
            .slice(0, MAX_PICKS);
    }

    populatePicker();
    render();

    document.getElementById('pickerSelect').addEventListener('change', e => {
        const id = e.target.value;
        if (!id) return;
        if (picked.length >= MAX_PICKS) {
            alert(`Pick at most ${MAX_PICKS} disasters.`);
        } else if (!picked.includes(id)) {
            picked.push(id);
            syncURL();
            render();
        }
        e.target.value = '';
    });

    document.getElementById('clearBtn').addEventListener('click', () => {
        picked = [];
        syncURL();
        render();
    });
})();

function populatePicker() {
    const sel = document.getElementById('pickerSelect');
    const sorted = [...DATA].sort((a, b) => a.year - b.year);
    sorted.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = `${d.year} · ${d.name} (${d.discipline})`;
        sel.appendChild(opt);
    });
}

function syncURL() {
    const url = new URL(location.href);
    if (picked.length) url.searchParams.set('ids', picked.join(','));
    else url.searchParams.delete('ids');
    history.replaceState(null, '', url);
}

function render() {
    const grid = document.getElementById('cmpGrid');
    const empty = document.getElementById('emptyState');
    const deltas = document.getElementById('cmpDeltas');

    if (!picked.length) {
        grid.style.display = 'none';
        deltas.style.display = 'none';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';
    grid.style.display = 'grid';
    deltas.style.display = 'block';

    const items = picked.map(id => DATA.find(d => d.id === id)).filter(Boolean);

    grid.innerHTML = items.map(d => {
        const img = window.getImagery ? window.getImagery(d) : null;
        const bg = img ? `style="background-image:url('${img.hero}')"` : '';
        const causeRaw = (d.cause || '').replace(/[#*_`]/g, '').trim();
        const cause = causeRaw || 'Root cause analysis not yet available.';
        return `
        <article class="cmp-card">
            <div class="cmp-thumb" ${bg}>
                <span class="cmp-thumb-label">${d.year}</span>
            </div>
            <div class="cmp-body">
                <div class="cmp-row">
                    <span class="cmp-id">${d.id}</span>
                    <span class="cmp-meta">${d.discipline} · ${d.type}</span>
                </div>
                <div class="cmp-name">${escapeHtml(d.name)}</div>
                <div class="cmp-meta">📍 ${escapeHtml(d.location || '—')}</div>
                <p class="cmp-cause">${escapeHtml(cause)}</p>
                <div class="cmp-actions">
                    <a class="cmp-link" href="disaster.html?id=${d.id}">Read full case →</a>
                    <button class="cmp-remove" data-id="${d.id}">Remove</button>
                </div>
            </div>
        </article>`;
    }).join('');

    grid.querySelectorAll('.cmp-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            picked = picked.filter(id => id !== btn.dataset.id);
            syncURL();
            render();
        });
    });

    renderDeltas(items);
}

function renderDeltas(items) {
    const headers = items.map(d => `<th>${escapeHtml(d.name)}</th>`).join('');
    const row = (label, fn) =>
        `<tr><td>${label}</td>${items.map(d => `<td>${escapeHtml(fn(d))}</td>`).join('')}</tr>`;
    document.getElementById('deltaTable').innerHTML = `
        <thead><tr><th></th>${headers}</tr></thead>
        <tbody>
            ${row('Year',       d => String(d.year))}
            ${row('Discipline', d => d.discipline)}
            ${row('Type',       d => d.type)}
            ${row('Location',   d => d.location || '—')}
            ${row('Era Gap',    d => yearGap(d, items))}
        </tbody>`;
}

function yearGap(d, items) {
    if (items.length < 2) return '—';
    const others = items.filter(x => x.id !== d.id).map(x => Math.abs(x.year - d.year));
    return `${Math.min(...others)} yrs from nearest`;
}

function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
}
