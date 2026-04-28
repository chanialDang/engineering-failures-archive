// Global state
let allDisasters = [];
let filteredDisasters = [];
let currentDiscipline = 'all';
let currentSearchTerm = '';
let currentSort = 'year-desc';

// DOM elements
const disastersGrid = document.getElementById('disastersGrid');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const filterChips = document.querySelectorAll('.filter-chip');
const sortSelect = document.getElementById('sortSelect');
const resultsCount = document.getElementById('resultsCount');

// Load data
async function loadData() {
    try {
        const response = await fetch('raw_failures.json');
        const data = await response.json();
        allDisasters = data.disasters;
        filteredDisasters = [...allDisasters];
        
        updateDisciplineCounts();
        checkURLParams();
        sortDisasters();
        renderDisasters();
        
        loading.style.display = 'none';
    } catch (error) {
        console.error('Error loading data:', error);
        loading.innerHTML = `
            <div class="error-icon">⚠️</div>
            <div class="loading-text">ERROR: Could not load raw_failures.json</div>
        `;
    }
}

// Check URL parameters for pre-filtering
function checkURLParams() {
    const params = new URLSearchParams(window.location.search);
    const discipline = params.get('discipline');
    
    if (discipline && discipline !== 'all') {
        currentDiscipline = discipline;
        filterChips.forEach(chip => {
            chip.classList.remove('active');
            if (chip.dataset.discipline === discipline) {
                chip.classList.add('active');
            }
        });
    }
}

// Update discipline counts
function updateDisciplineCounts() {
    const counts = {
        all: allDisasters.length,
        Civil: 0,
        Mechanical: 0,
        Electrical: 0,
        Chemical: 0
    };
    
    allDisasters.forEach(disaster => {
        if (counts.hasOwnProperty(disaster.discipline)) {
            counts[disaster.discipline]++;
        }
    });
    
    document.getElementById('count-all').textContent = counts.all;
    document.getElementById('count-civil').textContent = counts.Civil;
    document.getElementById('count-mechanical').textContent = counts.Mechanical;
    document.getElementById('count-electrical').textContent = counts.Electrical;
    document.getElementById('count-chemical').textContent = counts.Chemical;
}

// Filter disasters with smooth fade-out / fade-in transition
function filterDisasters() {
    filteredDisasters = allDisasters.filter(disaster => {
        const disciplineMatch = currentDiscipline === 'all' ||
                               disaster.discipline === currentDiscipline;

        const searchMatch = currentSearchTerm === '' ||
            disaster.name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            disaster.location.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            disaster.type.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            disaster.year.toString().includes(currentSearchTerm);

        return disciplineMatch && searchMatch;
    });

    sortDisasters();

    // Brief fade-out before re-render
    const cards = disastersGrid.querySelectorAll('.card');
    cards.forEach(c => c.classList.add('fade-out'));
    setTimeout(() => {
        renderDisasters();
        updateResultsCount();
    }, 180);
}

// Sort disasters
function sortDisasters() {
    switch (currentSort) {
        case 'year-desc':
            filteredDisasters.sort((a, b) => b.year - a.year);
            break;
        case 'year-asc':
            filteredDisasters.sort((a, b) => a.year - b.year);
            break;
        case 'name-asc':
            filteredDisasters.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredDisasters.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }
}

// Render disasters
function renderDisasters() {
    if (filteredDisasters.length === 0) {
        disastersGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    disastersGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    disastersGrid.innerHTML = filteredDisasters.map(disaster => {
        const img = window.getImagery ? window.getImagery(disaster) : null;
        const thumb = img ? `<div class="card-thumb" style="background-image:url('${img.thumb}')"></div>` : '';
        return `
        <a href="disaster.html?id=${disaster.id}" class="card fade-in" data-disc="${disaster.discipline}">
            <span class="accent-bar"></span>
            ${thumb}
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
        </a>`;
    }).join('');
}

// Update results count
function updateResultsCount() {
    const count = filteredDisasters.length;
    resultsCount.textContent = `${count} disasters`;
}

// Event listeners
searchInput.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value;
    filterDisasters();
});

filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentDiscipline = chip.dataset.discipline;
        filterDisasters();
    });
});

sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    sortDisasters();
    renderDisasters();
});

// Initialize
loadData();