/*
  imagery.js — single source of truth for all photographic imagery used on the site.
  Sources: Unsplash (CC0), Wikimedia Commons (public domain), NASA archive.

  Per-disaster entries override the discipline fallback. Where an iconic archival
  photo is available it is used directly; otherwise a thematic Unsplash photo
  evoking the disaster type is used. CSS adds a tonal overlay so the page stays
  cohesive even when fallbacks are used.

  All URLs are remote; no local hosting required.
*/

// Generic fallbacks per discipline / type — using Wikipedia for general, relevant imagery
const THEME = {
    civilBridge:   'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Golden_gate_bridge_by_diego_delgado.jpg/1280px-Golden_gate_bridge_by_diego_delgado.jpg',
    civilDam:      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Hoover_dam.jpg/1280px-Hoover_dam.jpg',
    civilBuilding: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Southwest_corner_of_Central_Park%2C_NYC.jpg/1280px-Southwest_corner_of_Central_Park%2C_NYC.jpg',
    civilTunnel:   'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Gotthard_Base_Tunnel_-_Erstdurchstich_2.jpg/1280px-Gotthard_Base_Tunnel_-_Erstdurchstich_2.jpg',
    civilLevee:    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/New_Orleans_Flood_LC.jpg/1280px-New_Orleans_Flood_LC.jpg',
    mechanical:    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/1280px-Camponotus_flavomarginatus_ant.jpg',
    mechanicalShip:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/QM2_Bow.jpg/1280px-QM2_Bow.jpg',
    mechanicalSpace:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/STS120LaunchHiRes.jpg/1280px-STS120LaunchHiRes.jpg',
    mechanicalRig: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Offshore_drilling.jpg/1280px-Offshore_drilling.jpg',
    mechanicalSub: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Alvin_DSV-4500_2013.JPG/1280px-Alvin_DSV-4500_2013.JPG',
    electrical:    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Power_lines.jpg/1280px-Power_lines.jpg',
    electricalNuclear: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Cattenom_power_plant.jpg/1280px-Cattenom_power_plant.jpg',
    chemical:      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Petrochemistry.jpg/1280px-Petrochemistry.jpg',
    chemicalRig:   'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Offshore_drilling.jpg/1280px-Offshore_drilling.jpg',
    abstractSmoke: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Explosion.jpg/1280px-Explosion.jpg',
    abstractSteel: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Girder_bridge.svg/1280px-Girder_bridge.svg.png',
};

// Per-disaster overrides — iconic archival photos where available
const PER_DISASTER = {
    'FAIL-001': { // Challenger
        hero: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Challenger_explosion.jpg',
        credit: 'NASA / Public Domain',
        alt: 'Space Shuttle Challenger explosion plume, January 28 1986',
    },
    'FAIL-002': { // Hindenburg
        hero: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Hindenburg_disaster.jpg',
        credit: 'Sam Shere / Public Domain',
        alt: 'Hindenburg airship engulfed in flame, Lakehurst NJ 1937',
    },
    'FAIL-003': { // Tacoma Narrows
        hero: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Tacoma_Narrows_Bridge_collapse_in_color.jpg',
        credit: 'Stillman Fires Collection / Public Domain',
        alt: 'Tacoma Narrows Bridge twisting in resonance moments before collapse',
    },
    'FAIL-005': { // Titanic
        hero: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/RMS_Titanic_3.jpg',
        credit: 'F.G.O. Stuart / Public Domain',
        alt: 'RMS Titanic departing Southampton, April 1912',
    },
    'FAIL-007': { // Deepwater Horizon
        hero: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Deepwater_Horizon_offshore_drilling_unit_on_fire_2010.jpg',
        credit: 'US Coast Guard / Public Domain',
        alt: 'Deepwater Horizon platform burning in the Gulf of Mexico, 2010',
    },
    'FAIL-008': { // Fukushima
        hero: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Fukushima_I_by_Digital_Globe.jpg',
        credit: 'DigitalGlobe / CC BY-SA',
        alt: 'Fukushima Daiichi nuclear plant after the 2011 tsunami',
    },
    'FAIL-010': { // Chernobyl
        hero: 'https://upload.wikimedia.org/wikipedia/commons/d/db/IAEA_02790015_%285613115146%29.jpg',
        credit: 'IAEA Imagebank / CC BY-SA',
        alt: 'Chernobyl reactor 4 after the 1986 explosion',
    },
    'FAIL-012': { // Columbia
        hero: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Columbia_launches_on_STS-107.jpg',
        credit: 'NASA / Public Domain',
        alt: 'Space Shuttle Columbia launching on STS-107',
    },
    'FAIL-014': { // Apollo 13
        hero: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Apollo_13_Service_Module_Damage.jpg',
        credit: 'NASA / Public Domain',
        alt: 'Apollo 13 service module after oxygen tank rupture',
    },
    'FAIL-017': { // I-35W
        hero: 'https://upload.wikimedia.org/wikipedia/commons/3/30/I-35W_Mississippi_River_bridge_after_collapse.jpg',
        credit: 'Kevin Rofidal / Public Domain',
        alt: 'Collapsed I-35W bridge over the Mississippi River',
    },
    'FAIL-040': { // New Orleans Levees
        hero: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/FEMA_-_15021_-_Photograph_by_Jocelyn_Augustino_taken_on_08-30-2005_in_Louisiana.jpg',
        credit: 'FEMA / Public Domain',
        alt: 'Flooded New Orleans neighborhood after Katrina, 2005',
    },
    'FAIL-046': { // Apollo 13 Mission
        hero: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Apollo_13_Service_Module_Damage.jpg',
        credit: 'NASA / Public Domain',
        alt: 'Apollo 13 service module damage',
    },
};

// Resolve discipline+type → fallback theme
function disciplineFallback(disaster) {
    const { discipline, type } = disaster;
    if (discipline === 'Civil') {
        if (/Bridge/i.test(type)) return THEME.civilBridge;
        if (/Dam/i.test(type)) return THEME.civilDam;
        if (/Tunnel|Viaduct|Overpass/i.test(type)) return THEME.civilTunnel;
        if (/Levee/i.test(type)) return THEME.civilLevee;
        return THEME.civilBuilding;
    }
    if (discipline === 'Mechanical') {
        if (/Spacecraft|Rocket/i.test(type)) return THEME.mechanicalSpace;
        if (/Maritime|Ship/i.test(type)) return THEME.mechanicalShip;
        if (/Submersible/i.test(type)) return THEME.mechanicalSub;
        if (/Oil Rig|Offshore/i.test(type)) return THEME.mechanicalRig;
        if (/Airship/i.test(type)) return THEME.abstractSmoke;
        return THEME.mechanical;
    }
    if (discipline === 'Electrical') {
        if (/Nuclear/i.test(type)) return THEME.electricalNuclear;
        return THEME.electrical;
    }
    if (discipline === 'Chemical') {
        if (/Offshore|Oil/i.test(type)) return THEME.chemicalRig;
        return THEME.chemical;
    }
    return THEME.abstractSteel;
}

// Public API: get image data for a disaster
window.getImagery = function (disaster) {
    if (!disaster) return null;
    const override = PER_DISASTER[disaster.id];
    const fallbackUrl = disciplineFallback(disaster);
    return {
        hero: override?.hero || fallbackUrl,
        thumb: override?.hero || fallbackUrl,
        credit: override?.credit || 'Unsplash',
        alt: override?.alt || `${disaster.name} — ${disaster.year}`,
    };
};

// Discipline accent colors (used for tonal overlays)
window.DISCIPLINE_COLOR = {
    Civil:      '#e74c3c',
    Mechanical: '#4da6ff',
    Electrical: '#f39c12',
    Chemical:   '#2ecc71',
};
