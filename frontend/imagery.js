/*
  imagery.js — single source of truth for all photographic imagery used on the site.
  Sources: Wikimedia Commons (via Wikipedia REST API), NASA archive, FEMA.

  Per-disaster entries override the discipline fallback. Lead images sourced from
  Wikipedia article thumbnails, converted to 1280px resolution. CSS adds a tonal
  overlay so the page stays cohesive.

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

// Per-disaster overrides — Wikipedia lead images via REST API
const PER_DISASTER = {
    'FAIL-001': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Challenger_explosion.jpg/1280px-Challenger_explosion.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Space Shuttle Challenger disaster — 1986' },
    'FAIL-002': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Hindenburg_disaster.jpg/1280px-Hindenburg_disaster.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Hindenburg disaster — 1937' },
    'FAIL-003': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Opening_day_of_the_Tacoma_Narrows_Bridge%2C_Tacoma%2C_Washington.jpg/1280px-Opening_day_of_the_Tacoma_Narrows_Bridge%2C_Tacoma%2C_Washington.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Tacoma Narrows Bridge — 1940' },
    'FAIL-004': { hero: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/27/Piper_Alpha_oil_rig_fire.jpg/1280px-Piper_Alpha_oil_rig_fire.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Piper Alpha — 1988' },
    'FAIL-005': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/St%C3%B6wer_Titanic.jpg/1280px-St%C3%B6wer_Titanic.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'RMS Titanic — 1912' },
    'FAIL-006': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Union_Carbide_pesticide_factory%2C_Bhopal%2C_India%2C_1985.jpg/1280px-Union_Carbide_pesticide_factory%2C_Bhopal%2C_India%2C_1985.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Bhopal disaster — 1984' },
    'FAIL-007': { hero: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Deepwater_Horizon.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Deepwater Horizon — 2010' },
    'FAIL-008': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Fukushima_I_by_Digital_Globe.jpg/1280px-Fukushima_I_by_Digital_Globe.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Fukushima nuclear accident — 2011' },
    'FAIL-009': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Three_Mile_Island_%28color%29-2.jpg/1280px-Three_Mile_Island_%28color%29-2.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Three Mile Island — 1979' },
    'FAIL-010': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/IAEA_02790015_%285613115146%29.jpg/1280px-IAEA_02790015_%285613115146%29.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Chernobyl disaster — 1986' },
    'FAIL-011': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Map_of_the_East_Urals_Radioactive_Trace.png/1280px-Map_of_the_East_Urals_Radioactive_Trace.png', credit: 'Wikipedia / CC BY-SA', alt: 'Kyshtym disaster — 1957' },
    'FAIL-012': { hero: 'https://upload.wikimedia.org/wikipedia/commons/4/48/ColumbiaFLIR2003.gif', credit: 'Wikipedia / CC BY-SA', alt: 'Space Shuttle Columbia — 2003' },
    'FAIL-013': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Apollo1-Crew_01.jpg/1280px-Apollo1-Crew_01.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Apollo 1 — 1967' },
    'FAIL-014': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Apollo_13-insignia.png/1280px-Apollo_13-insignia.png', credit: 'Wikipedia / CC BY-SA', alt: 'Apollo 13 — 1970' },
    'FAIL-015': { hero: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f7/Soyuz_1_crash.jpg/1280px-Soyuz_1_crash.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Soyuz 1 — 1967' },
    'FAIL-016': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/The_Soviet_Union_1971_CPA_4060_stamp_%28Cosmonauts_Georgy_Dobrovolsky%2C_Vladislav_Volkov_and_Viktor_Patsayev%29.png/1280px-The_Soviet_Union_1971_CPA_4060_stamp_%28Cosmonauts_Georgy_Dobrovolsky%2C_Vladislav_Volkov_and_Viktor_Patsayev%29.png', credit: 'Wikipedia / CC BY-SA', alt: 'Soyuz 11 — 1971' },
    'FAIL-017': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/I35W_Bridge.jpg/1280px-I35W_Bridge.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'I-35W Bridge — 2007' },
    'FAIL-018': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Catastrophe_du_pont_sur_le_Tay_-_1879_-_Illustration.jpg/1280px-Catastrophe_du_pont_sur_le_Tay_-_1879_-_Illustration.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Tay Bridge — 1879' },
    'FAIL-019': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Pont_de_Qu%C3%A9bec_2026.jpg/1280px-Pont_de_Qu%C3%A9bec_2026.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Quebec Bridge — 1907' },
    'FAIL-020': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Genova-panorama_dal_santuario_di_ns_incoronata3.jpg/1280px-Genova-panorama_dal_santuario_di_ns_incoronata3.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Morandi Bridge — 2018' },
    'FAIL-021': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Ashtabula_Bridge_disaster.jpg/1280px-Ashtabula_Bridge_disaster.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Ashtabula Bridge — 1876' },
    'FAIL-022': { hero: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Silver_Bridge%2C_1928.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Silver Bridge — 1967' },
    'FAIL-023': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Dee_bridge_disaster.jpg/1280px-Dee_bridge_disaster.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Dee Bridge — 1847' },
    'FAIL-024': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/SunshineSkywayBridge-4SC_6643-15.jpg/1280px-SunshineSkywayBridge-4SC_6643-15.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Sunshine Skyway — 1980' },
    'FAIL-026': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Interstate_90_Schoharie_Creek_Bridge_collapsed.jpg/1280px-Interstate_90_Schoharie_Creek_Bridge_collapsed.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Schoharie Creek — 1987' },
    'FAIL-027': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/FIU_Bridge_NTSB_inspection.jpg/1280px-FIU_Bridge_NTSB_inspection.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'FIU Bridge — 2018' },
    'FAIL-028': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Hyatt_Regency_collapse_end_view.PNG/1280px-Hyatt_Regency_collapse_end_view.PNG', credit: 'Wikipedia / CC BY-SA', alt: 'Hyatt Regency — 1981' },
    'FAIL-029': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Knickerbocker_Theater.jpg/1280px-Knickerbocker_Theater.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Knickerbocker Theater — 1922' },
    'FAIL-030': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/PembertonMill.jpg/1280px-PembertonMill.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Pemberton Mill — 1860' },
    'FAIL-031': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/2000%EB%85%84%EB%8C%80_%EC%B4%88%EB%B0%98_%EC%84%9C%EC%9A%B8%EC%86%8C%EB%B0%A9_%EC%86%8C%EB%B0%A9%EA%B3%B5%EB%AC%B4%EC%9B%90%28%EC%86%8C%EB%B0%A9%EA%B4%80%29_%ED%99%9C%EB%8F%99_%EC%82%AC%EC%A7%84_%EC%82%BC%ED%92%8D003_%28cropped_and_color_corrected%29.jpg/1280px-2000%EB%85%84%EB%8C%80_%EC%B4%88%EB%B0%9A_%EC%84%9C%EC%9A%B8%EC%86%8C%EB%B0%A9_%EC%86%8C%EB%B0%A9%EA%B3%B5%EB%AC%B4%EC%9B%90%28%EC%86%8C%EB%B0%A9%EA%B4%80%29_%ED%99%9C%EB%8F%99_%EC%82%AC%EC%A7%84_%EC%82%BC%ED%92%8D003_%28cropped_and_color_corrected%29.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Sampoong — 1995' },
    'FAIL-032': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/2013_savar_building_collapse02.jpg/1280px-2013_savar_building_collapse02.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Rana Plaza — 2013' },
    'FAIL-033': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Surfside_condominium_collapse_photo_from_Miami-Dade_Fire_Rescue_1.jpg/1280px-Surfside_condominium_collapse_photo_from_Miami-Dade_Fire_Rescue_1.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Champlain Towers — 2021' },
    'FAIL-034': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Ronan_Point_collapse_closeup.jpg/1280px-Ronan_Point_collapse_closeup.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Ronan Point — 1968' },
    'FAIL-035': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Johnstown_flood_debris.jpg/1280px-Johnstown_flood_debris.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Johnstown Flood — 1889' },
    'FAIL-036': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/The_St._Francis_Dam.jpg/1280px-The_St._Francis_Dam.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'St. Francis Dam — 1928' },
    'FAIL-037': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/%28IDAHO-L-0010%29_Teton_Dam_Flood_-_Newdale.jpg/1280px-%28IDAHO-L-0010%29_Teton_Dam_Flood_-_Newdale.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Teton Dam — 1976' },
    'FAIL-039': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/VajontDiga.jpg/1280px-VajontDiga.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Vajont Dam — 1963' },
    'FAIL-040': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Katrina_2005-08-29_1445Z.jpg/1280px-Katrina_2005-08-29_1445Z.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Hurricane Katrina — 2005' },
    'FAIL-041': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/California_17.svg/1280px-California_17.svg.png', credit: 'Wikipedia / CC BY-SA', alt: 'Cypress Viaduct — 1989' },
    'FAIL-042': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/California_17.svg/1280px-California_17.svg.png', credit: 'Wikipedia / CC BY-SA', alt: 'Cypress Viaduct — 1989' },
    'FAIL-043': { hero: 'https://upload.wikimedia.org/wikipedia/en/a/ae/Metropolitan_Highway_System_%28logo%29.png', credit: 'Wikipedia / CC BY-SA', alt: 'Big Dig — 2006' },
    'FAIL-044': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/SasagoTNnobori-int.JPG/1280px-SasagoTNnobori-int.JPG', credit: 'Wikipedia / CC BY-SA', alt: 'Sasago Tunnel — 2012' },
    'FAIL-045': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Apollo1-Crew_01.jpg/1280px-Apollo1-Crew_01.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Apollo 1 — 1967' },
    'FAIL-046': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Apollo_13-insignia.png/1280px-Apollo_13-insignia.png', credit: 'Wikipedia / CC BY-SA', alt: 'Apollo 13 — 1970' },
    'FAIL-047': { hero: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f7/Soyuz_1_crash.jpg/1280px-Soyuz_1_crash.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Soyuz 1 — 1967' },
    'FAIL-048': { hero: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/13/Titan_submersible.jpg/1280px-Titan_submersible.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Titan Submersible — 2023' },
    'FAIL-049': { hero: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/46/Ariane_flight_V88.jpg/1280px-Ariane_flight_V88.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Ariane 5 — 1996' },
    'FAIL-050': { hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Mars_Climate_Orbiter_2.jpg/1280px-Mars_Climate_Orbiter_2.jpg', credit: 'Wikipedia / CC BY-SA', alt: 'Mars Climate Orbiter — 1999' },
};

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

window.getImagery = function (disaster) {
    if (!disaster) return null;
    const override = PER_DISASTER[disaster.id];
    const fallbackUrl = disciplineFallback(disaster);
    return {
        hero: override?.hero || fallbackUrl,
        thumb: override?.hero || fallbackUrl,
        credit: override?.credit || 'Wikipedia',
        alt: override?.alt || `${disaster.name} — ${disaster.year}`,
    };
};

window.DISCIPLINE_COLOR = {
    Civil:      '#e74c3c',
    Mechanical: '#4da6ff',
    Electrical: '#f39c12',
    Chemical:   '#2ecc71',
};
