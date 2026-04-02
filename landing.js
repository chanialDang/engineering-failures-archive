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
        
        // Show 6 featured disasters (most impactful ones)
        const featured = [
            data.disasters.find(d => d.id === 'FAIL-001'), // Challenger
            data.disasters.find(d => d.id === 'FAIL-003'), // Tacoma Narrows
            data.disasters.find(d => d.id === 'FAIL-005'), // Titanic
            data.disasters.find(d => d.id === 'FAIL-010'), // Chernobyl
            data.disasters.find(d => d.id === 'FAIL-046'), // I-35W Bridge
            data.disasters.find(d => d.id === 'FAIL-048')  // Titan Submersible
        ].filter(Boolean);
        
        const featuredGrid = document.getElementById('featuredGrid');
        featuredGrid.innerHTML = featured.map(disaster => `
            <a href="disaster.html?id=${disaster.id}" class="card">
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
        
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Initialize
loadData();