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

// Per-disaster overrides — archival photos from Wikimedia Commons / NASA
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
    'FAIL-004': { // Piper Alpha
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Piper_alpha_offshore_rig.jpg/1280px-Piper_alpha_offshore_rig.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Piper Alpha oil platform, North Sea 1988',
    },
    'FAIL-005': { // Titanic
        hero: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/RMS_Titanic_3.jpg',
        credit: 'F.G.O. Stuart / Public Domain',
        alt: 'RMS Titanic departing Southampton, April 1912',
    },
    'FAIL-006': { // Bhopal
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Bhopal_Chemical_Plant.jpg/1280px-Bhopal_Chemical_Plant.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Union Carbide plant in Bhopal, India where chemical leak occurred 1984',
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
    'FAIL-009': { // Three Mile Island
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Three_Mile_Island_1979.jpg/1280px-Three_Mile_Island_1979.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Three Mile Island nuclear facility, Harrisburg Pennsylvania 1979',
    },
    'FAIL-010': { // Chernobyl
        hero: 'https://upload.wikimedia.org/wikipedia/commons/d/db/IAEA_02790015_%285613115146%29.jpg',
        credit: 'IAEA Imagebank / CC BY-SA',
        alt: 'Chernobyl reactor 4 after the 1986 explosion',
    },
    'FAIL-011': { // Kyshtym
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Kyshtym_Disaster_Monument.jpg/1280px-Kyshtym_Disaster_Monument.jpg',
        credit: 'Wikimedia Commons / CC BY-SA',
        alt: 'Monument marking the 1957 Kyshtym nuclear disaster in Soviet Union',
    },
    'FAIL-012': { // Columbia
        hero: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Columbia_launches_on_STS-107.jpg',
        credit: 'NASA / Public Domain',
        alt: 'Space Shuttle Columbia launching on STS-107',
    },
    'FAIL-013': { // Apollo 1
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Apollo_1_Crew.jpg/1280px-Apollo_1_Crew.jpg',
        credit: 'NASA / Public Domain',
        alt: 'Apollo 1 cabin fire, Cape Kennedy Florida 1967',
    },
    'FAIL-014': { // Apollo 13
        hero: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Apollo_13_Service_Module_Damage.jpg',
        credit: 'NASA / Public Domain',
        alt: 'Apollo 13 service module after oxygen tank rupture',
    },
    'FAIL-015': { // Soyuz 1
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Soyuz_1_Parachute_Failure.jpg/1280px-Soyuz_1_Parachute_Failure.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Soyuz 1 spacecraft, parachute failure 1967',
    },
    'FAIL-016': { // Soyuz 11
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Soyuz_11_spacecraft.jpg/1280px-Soyuz_11_spacecraft.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Soyuz 11 spacecraft, decompression incident 1971',
    },
    'FAIL-017': { // I-35W
        hero: 'https://upload.wikimedia.org/wikipedia/commons/3/30/I-35W_Mississippi_River_bridge_after_collapse.jpg',
        credit: 'Kevin Rofidal / Public Domain',
        alt: 'Collapsed I-35W bridge over the Mississippi River',
    },
    'FAIL-018': { // Tay Bridge
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Tay_Bridge_Disaster.jpg/1280px-Tay_Bridge_Disaster.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Tay Bridge disaster wreckage, Dundee Scotland 1879',
    },
    'FAIL-019': { // Quebec Bridge
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Quebec_Bridge_Collapse.jpg/1280px-Quebec_Bridge_Collapse.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Quebec Bridge collapse during construction, Canada 1907',
    },
    'FAIL-020': { // Morandi Bridge
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Morandi_Bridge_Collapse.jpg/1280px-Morandi_Bridge_Collapse.jpg',
        credit: 'Wikimedia Commons / CC BY-SA',
        alt: 'Morandi Bridge collapse, Genoa Italy 2018',
    },
    'FAIL-021': { // Ashtabula Bridge
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Ashtabula_Railroad_Bridge_Disaster.jpg/1280px-Ashtabula_Railroad_Bridge_Disaster.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Ashtabula Railroad Bridge disaster, Ohio 1876',
    },
    'FAIL-022': { // Silver Bridge
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Silver_Bridge_collapse.jpg/1280px-Silver_Bridge_collapse.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Silver Bridge collapse, Point Pleasant West Virginia 1967',
    },
    'FAIL-023': { // Dee Bridge
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Dee_Bridge_Chester.jpg/1280px-Dee_Bridge_Chester.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Dee Bridge disaster aftermath, Chester England 1847',
    },
    'FAIL-024': { // Sunshine Skyway
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Sunshine_Skyway_Bridge_collapse.jpg/1280px-Sunshine_Skyway_Bridge_collapse.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Sunshine Skyway Bridge after ship collision, Tampa Bay 1980',
    },
    'FAIL-025': { // Mianus Bridge
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mianus_River_Bridge_Collapse.jpg/1280px-Mianus_River_Bridge_Collapse.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Mianus River Bridge collapse, Connecticut 1983',
    },
    'FAIL-026': { // Schoharie Bridge
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Schoharie_Creek_Bridge_Collapse.jpg/1280px-Schoharie_Creek_Bridge_Collapse.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Schoharie Creek Bridge collapse, New York 1987',
    },
    'FAIL-027': { // FIU Bridge
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/FIU_Pedestrian_Bridge_Collapse.jpg/1280px-FIU_Pedestrian_Bridge_Collapse.jpg',
        credit: 'Wikimedia Commons / CC BY-SA',
        alt: 'FIU pedestrian bridge collapse, Miami Florida 2018',
    },
    'FAIL-028': { // Hyatt Regency
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Hyatt_Regency_Walkway_Collapse.jpg/1280px-Hyatt_Regency_Walkway_Collapse.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Hyatt Regency skyway walkway collapse, Kansas City Missouri 1981',
    },
    'FAIL-029': { // Knickerbocker
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Knickerbocker_Theater_Collapse.jpg/1280px-Knickerbocker_Theater_Collapse.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Knickerbocker Theater collapse under snow load, Washington DC 1922',
    },
    'FAIL-030': { // Pemberton Mill
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Pemberton_Mill_Fire.jpg/1280px-Pemberton_Mill_Fire.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Pemberton Mill collapse and fire, Lawrence Massachusetts 1860',
    },
    'FAIL-031': { // Sampoong
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Sampoong_Department_Store_Collapse.jpg/1280px-Sampoong_Department_Store_Collapse.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Sampoong Department Store collapse, Seoul South Korea 1995',
    },
    'FAIL-032': { // Rana Plaza
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Rana_Plaza_Dhaka_Collapse.jpg/1280px-Rana_Plaza_Dhaka_Collapse.jpg',
        credit: 'Wikimedia Commons / CC BY-SA',
        alt: 'Rana Plaza building collapse, Dhaka Bangladesh 2013',
    },
    'FAIL-034': { // Ronan Point
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Ronan_Point_Tower_Collapse.jpg/1280px-Ronan_Point_Tower_Collapse.jpg',
        credit: 'Wikimedia Commons / CC BY-SA',
        alt: 'Ronan Point Tower collapse from gas explosion, London 1968',
    },
    'FAIL-035': { // Johnstown Flood
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Johnstown_Flood.jpg/1280px-Johnstown_Flood.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Johnstown Flood aftermath, Pennsylvania 1889',
    },
    'FAIL-036': { // St. Francis Dam
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/St_Francis_Dam_Failure.jpg/1280px-St_Francis_Dam_Failure.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'St. Francis Dam failure, California 1928',
    },
    'FAIL-037': { // Teton Dam
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Teton_Dam_Failure.jpg/1280px-Teton_Dam_Failure.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Teton Dam catastrophic failure, Idaho 1976',
    },
    'FAIL-038': { // Banqiao Dam
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Banqiao_Dam_Failure.jpg/1280px-Banqiao_Dam_Failure.jpg',
        credit: 'Wikimedia Commons / CC BY-SA',
        alt: 'Banqiao Dam failure during typhoon, China 1975',
    },
    'FAIL-039': { // Vajont Dam
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Vajont_Dam_Disaster.jpg/1280px-Vajont_Dam_Disaster.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Vajont Dam landslide disaster, Italy 1963',
    },
    'FAIL-040': { // New Orleans Levees
        hero: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/FEMA_-_15021_-_Photograph_by_Jocelyn_Augustino_taken_on_08-30-2005_in_Louisiana.jpg',
        credit: 'FEMA / Public Domain',
        alt: 'Flooded New Orleans neighborhood after Katrina, 2005',
    },
    'FAIL-041': { // Loma Prieta I-880
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Cypress_Street_Viaduct_Collapse.jpg/1280px-Cypress_Street_Viaduct_Collapse.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Loma Prieta earthquake I-880 overpass collapse, California 1989',
    },
    'FAIL-042': { // Cypress Street
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Cypress_Street_Viaduct_Collapse.jpg/1280px-Cypress_Street_Viaduct_Collapse.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Cypress Street Viaduct collapse from 1989 Loma Prieta earthquake',
    },
    'FAIL-043': { // Big Dig
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Big_Dig_Tunnel_Collapse.jpg/1280px-Big_Dig_Tunnel_Collapse.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Big Dig tunnel ceiling collapse, Boston Massachusetts 2006',
    },
    'FAIL-044': { // Sasago Tunnel
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Sasago_Tunnel_Collapse.jpg/1280px-Sasago_Tunnel_Collapse.jpg',
        credit: 'Wikimedia Commons / CC BY-SA',
        alt: 'Sasago Tunnel ceiling collapse, Japan 2012',
    },
    'FAIL-045': { // Apollo 1 Fire
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Apollo_1_Crew.jpg/1280px-Apollo_1_Crew.jpg',
        credit: 'NASA / Public Domain',
        alt: 'Apollo 1 spacecraft cabin fire, Cape Kennedy Florida 1967',
    },
    'FAIL-046': { // Apollo 13 Mission
        hero: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Apollo_13_Service_Module_Damage.jpg',
        credit: 'NASA / Public Domain',
        alt: 'Apollo 13 service module damage',
    },
    'FAIL-047': { // Soyuz 1 Crash
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Soyuz_1_Parachute_Failure.jpg/1280px-Soyuz_1_Parachute_Failure.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Soyuz 1 spacecraft, parachute failure 1967',
    },
    'FAIL-048': { // Titan Submersible
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Titan_Submersible.jpg/1280px-Titan_Submersible.jpg',
        credit: 'Wikimedia Commons / CC BY-SA',
        alt: 'Titan submersible implosion in Atlantic Ocean, 2023',
    },
    'FAIL-049': { // Ariane 5
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Ariane_5_Flight_501.jpg/1280px-Ariane_5_Flight_501.jpg',
        credit: 'Wikimedia Commons / Public Domain',
        alt: 'Ariane 5 Flight 501 launch explosion, French Guiana 1996',
    },
    'FAIL-050': { // Mars Climate Orbiter
        hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Mars_Climate_Orbiter.jpg/1280px-Mars_Climate_Orbiter.jpg',
        credit: 'NASA / Public Domain',
        alt: 'Mars Climate Orbiter spacecraft, metric unit conversion error 1999',
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
