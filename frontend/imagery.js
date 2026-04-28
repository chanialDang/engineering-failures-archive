/*
  imagery.js — single source of truth for all photographic imagery used on the site.
  Sources: Unsplash (CC0), Wikimedia Commons (public domain), NASA archive.

  Per-disaster entries override the discipline fallback. Where an iconic archival
  photo is available it is used directly; otherwise a thematic Unsplash photo
  evoking the disaster type is used. CSS adds a tonal overlay so the page stays
  cohesive even when fallbacks are used.

  All URLs are remote; no local hosting required.
*/

const UNSPLASH = (id, w = 1600) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

// Generic thematic fallbacks per discipline / type
const THEME = {
    civilBridge:   UNSPLASH('photo-1505761671935-60b3a7427bad'),       // suspension bridge silhouette
    civilDam:      UNSPLASH('photo-1545153996-5f30e58a01d4'),          // concrete dam
    civilBuilding: UNSPLASH('photo-1486325212027-8081e485255e'),       // skyscraper construction
    civilTunnel:   UNSPLASH('photo-1485827404703-89b55fcc595e'),       // tunnel arch
    civilLevee:    UNSPLASH('photo-1547683905-f686c993aae5'),          // flooded waterway
    mechanical:    UNSPLASH('photo-1518709268805-4e9042af2176'),       // welding sparks
    mechanicalShip:UNSPLASH('photo-1494412651409-8963ce7935a7'),       // ship at sea
    mechanicalSpace:UNSPLASH('photo-1446776811953-b23d57bd21aa'),      // rocket launch
    mechanicalRig: UNSPLASH('photo-1518709268805-4e9042af2176'),       // industrial steel
    mechanicalSub: UNSPLASH('photo-1505075106905-fb052892c116'),       // deep ocean
    electrical:    UNSPLASH('photo-1473341304170-971dccb5ac1e'),       // power lines
    electricalNuclear: UNSPLASH('photo-1542621334-a254cf47733d'),      // cooling towers
    chemical:      UNSPLASH('photo-1519999482648-25049ddd37b1'),       // oil refinery at dusk
    chemicalRig:   UNSPLASH('photo-1497435334941-8c899ee9e8e9'),       // offshore platform
    abstractSmoke: UNSPLASH('photo-1494522358652-f30e61a60313'),       // smoke plume
    abstractSteel: UNSPLASH('photo-1517649763962-0c623066013b'),       // steel beams
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
    'FAIL-033': { // Champlain Towers
        hero: UNSPLASH('photo-1486325212027-8081e485255e'),
        credit: 'Unsplash',
        alt: 'Residential tower silhouette',
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
    'FAIL-048': { // Titan Submersible
        hero: UNSPLASH('photo-1505075106905-fb052892c116'),
        credit: 'Unsplash',
        alt: 'Deep ocean abyss',
    },
    'FAIL-049': { // Ariane 5 Flight 501
        hero: UNSPLASH('photo-1446776811953-b23d57bd21aa'),
        credit: 'Unsplash',
        alt: 'Rocket launch silhouette',
    },
    'FAIL-050': { // Mars Climate Orbiter
        hero: UNSPLASH('photo-1614728894747-a83421e2b9c9'),
        credit: 'Unsplash',
        alt: 'Mars surface',
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
