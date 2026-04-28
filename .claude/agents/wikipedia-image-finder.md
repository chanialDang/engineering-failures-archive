---
name: wikipedia-image-finder
description: Search Wikipedia for lead images of each disaster and return a formatted PER_DISASTER block for imagery.js
model: haiku
---

# Wikipedia Image Finder

Your job: For each of the 50 disasters, fetch the Wikipedia article and extract the lead image URL. Return a formatted JavaScript object block ready to paste into `imagery.js`.

## Task

1. For each disaster ID (FAIL-001 through FAIL-050), use the Wikipedia REST API to get the lead image
2. Convert the thumbnail URL to 1280px resolution
3. Return a complete `PER_DISASTER` JavaScript object block formatted exactly like this:

```js
'FAIL-004': {
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/...',
    credit: 'Wikipedia / CC BY-SA',
    alt: 'Disaster name and context from the article',
},
```

## Wikipedia → Disaster Mapping

Use this exact mapping (FAIL-### → Wikipedia article title):

- FAIL-001 → Space_Shuttle_Challenger_disaster
- FAIL-002 → Hindenburg_disaster
- FAIL-003 → Tacoma_Narrows_Bridge_(1940)
- FAIL-004 → Piper_Alpha
- FAIL-005 → Sinking_of_the_RMS_Titanic
- FAIL-006 → Bhopal_disaster
- FAIL-007 → Deepwater_Horizon
- FAIL-008 → Fukushima_nuclear_disaster
- FAIL-009 → Three_Mile_Island_accident
- FAIL-010 → Chernobyl_disaster
- FAIL-011 → Kyshtym_disaster
- FAIL-012 → Space_Shuttle_Columbia_disaster
- FAIL-013 → Apollo_1
- FAIL-014 → Apollo_13
- FAIL-015 → Soyuz_1
- FAIL-016 → Soyuz_11
- FAIL-017 → I-35W_Mississippi_River_bridge_collapse
- FAIL-018 → Tay_Bridge_disaster
- FAIL-019 → Quebec_Bridge
- FAIL-020 → Morandi_Bridge
- FAIL-021 → Ashtabula_River_railroad_disaster
- FAIL-022 → Silver_Bridge
- FAIL-023 → Dee_Bridge_disaster
- FAIL-024 → Sunshine_Skyway_Bridge
- FAIL-025 → Mianus_River_Bridge_collapse
- FAIL-026 → Schoharie_Creek_Bridge
- FAIL-027 → FIU_–_Sweetwater_Metrorail_Station_pedestrian_bridge_collapse
- FAIL-028 → Hyatt_Regency_walkway_collapse
- FAIL-029 → Knickerbocker_Theatre_building_collapse
- FAIL-030 → Pemberton_Mill
- FAIL-031 → Sampoong_Department_Store_collapse
- FAIL-032 → 2013_Dhaka_garment_factory_collapse
- FAIL-033 → Champlain_Towers_South_collapse
- FAIL-034 → Ronan_Point
- FAIL-035 → Johnstown_Flood
- FAIL-036 → St._Francis_Dam
- FAIL-037 → Teton_Dam
- FAIL-038 → Banqiao_Dam
- FAIL-039 → Vajont_Dam
- FAIL-040 → Effect_of_Hurricane_Katrina_on_New_Orleans
- FAIL-041 → Cypress_Street_Viaduct
- FAIL-042 → Cypress_Street_Viaduct
- FAIL-043 → Big_Dig
- FAIL-044 → Sasago_Tunnel
- FAIL-045 → Apollo_1
- FAIL-046 → Apollo_13
- FAIL-047 → Soyuz_1
- FAIL-048 → Titan_submersible
- FAIL-049 → Ariane_5_Flight_501
- FAIL-050 → Mars_Climate_Orbiter

## API Call

For each Wikipedia article title, call:

```
https://en.wikipedia.org/api/rest_v1/page/summary/{ARTICLE_TITLE}
```

Parse the response JSON:
- `thumbnail.source` — the thumbnail URL (format: `https://upload.wikimedia.org/wikipedia/commons/thumb/.../320px-...`)
- `description` — use as the alt text
- `title` — use in the alt text

## URL conversion

The thumbnail URL from Wikipedia looks like:
```
https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Image_Name.jpg/320px-Image_Name.jpg
```

Strip the trailing size `320px-` and replace with `1280px-`:
```
https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Image_Name.jpg/1280px-Image_Name.jpg
```

## Output

Output ONLY the JavaScript code block. Format exactly as shown above. No narrative, no markdown formatting, just the raw JS object.

If an image cannot be found for a disaster, output an empty object or skip it — the discipline fallback in imagery.js will handle missing entries.
