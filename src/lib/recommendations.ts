// ---------------------------------------------------------------------------
// Rules-based recommendation engine.
//
// Recommendations come ONLY from these predefined, evidence-referenced rules
// evaluated against the farm's inputs and prediction. The ML model does not
// generate advice — it only decides *which* rules are relevant by describing
// the soil's current state. Each rule states the expected direction of benefit
// and never claims a guaranteed causal effect from the model's attributions.
// ---------------------------------------------------------------------------

import type { FarmInput, PredictionResult, Recommendation } from './types'

interface Rule {
  base: Omit<Recommendation, 'triggeredBy'>
  applies: (input: FarmInput, prediction: PredictionResult) => string | null
}

const RULES: Rule[] = [
  {
    base: {
      id: 'organic-matter',
      category: 'Soil',
      icon: 'sprout',
      title: 'Improve Organic Matter',
      whyItMatters:
        'Organic matter is the main store of carbon in soil and holds water and nutrients for the crop.',
      whatToDo:
        'Add well-rotted compost or farmyard manure, grow a green-manure crop before the main season, and keep the soil covered.',
      expectedDirection: 'Higher organic matter is generally associated with higher soil carbon over several seasons.',
      evidenceNote:
        'Long-term trials consistently link organic-matter additions with rising topsoil organic carbon.',
      learnMoreSlug: 'why-organic-matter-matters',
    },
    applies: (input) =>
      input.organicMatter < 2.5
        ? `Organic matter is ${input.organicMatter}% — below the ~2.5% comfortable range for this soil.`
        : null,
  },
  {
    base: {
      id: 'crop-residue',
      category: 'Crop Management',
      icon: 'wheat',
      title: 'Manage Crop Residue',
      whyItMatters:
        'Crop residue left on the field returns carbon to the soil and protects it from sun and heavy rain.',
      whatToDo:
        'Retain at least part of the residue as surface mulch instead of removing or burning it. Spread it evenly after harvest.',
      expectedDirection: 'Retaining residue is generally associated with better soil carbon and moisture than burning or removal.',
      evidenceNote:
        'Residue retention is a well-documented conservation-agriculture practice for maintaining soil organic matter.',
      learnMoreSlug: 'crop-residue',
    },
    applies: (input) =>
      input.residue === 'Removed / Burned'
        ? 'Residue is currently removed or burned, which sends carbon away from the field.'
        : input.residue === 'Partially Retained'
          ? 'Only part of the residue is retained — there is room to keep more.'
          : null,
  },
  {
    base: {
      id: 'soil-moisture',
      category: 'Soil',
      icon: 'droplets',
      title: 'Improve Soil Moisture Management',
      whyItMatters:
        'Soil life that builds carbon needs steady moisture — neither waterlogged nor bone dry.',
      whatToDo:
        'Use mulch to reduce evaporation, add organic matter to hold water, and schedule irrigation to avoid long dry spells and standing water.',
      expectedDirection: 'More stable soil moisture supports the biological activity associated with carbon build-up.',
      evidenceNote:
        'Soil moisture regulates microbial activity and decomposition; extremes in either direction slow organic-matter formation.',
      learnMoreSlug: 'soil-moisture',
    },
    applies: (input) =>
      input.soilMoisture < 15
        ? `Soil moisture is low (${input.soilMoisture}%) — the soil may be drying out between irrigations.`
        : input.soilMoisture > 40
          ? `Soil moisture is high (${input.soilMoisture}%) — check drainage to avoid waterlogging.`
          : null,
  },
  {
    base: {
      id: 'crop-rotation',
      category: 'Crop Management',
      icon: 'refresh-cw',
      title: 'Practice Suitable Crop Rotation',
      whyItMatters:
        'Rotating crops — especially including a legume — spreads root types through the soil and adds nitrogen naturally.',
      whatToDo:
        'Plan a 2–3 year rotation that includes a pulse or legume and avoids growing the same crop every season.',
      expectedDirection: 'Diverse rotations with legumes are generally associated with more stable or rising soil carbon.',
      evidenceNote:
        'Rotation diversity, particularly legume inclusion, is a standard recommendation for soil-health maintenance.',
      learnMoreSlug: 'crop-rotation',
    },
    applies: (input) =>
      input.landUse === 'Continuous Cropland' && ['Wheat', 'Rice', 'Cotton', 'Maize'].includes(input.cropType)
        ? `Continuous ${input.cropType} leaves little variety in the rotation.`
        : null,
  },
  {
    base: {
      id: 'cover-crops',
      category: 'Crop Management',
      icon: 'leaf',
      title: 'Use Cover Crops in the Off-Season',
      whyItMatters:
        'A living cover between main crops keeps roots in the ground, feeds soil life and prevents erosion.',
      whatToDo:
        'Sow a quick cover crop (e.g. a legume mix) on fields that would otherwise sit bare between seasons.',
      expectedDirection: 'Keeping soil covered and rooted for more of the year is generally associated with higher soil carbon.',
      evidenceNote:
        'Cover cropping is a widely recommended practice for reducing bare-fallow periods and adding biomass.',
      learnMoreSlug: 'conservation-practices',
    },
    applies: (input) =>
      input.landUse === 'Cropland with Fallow'
        ? 'Fields sit fallow between seasons — a cover crop could keep the soil working.'
        : null,
  },
  {
    base: {
      id: 'reduce-tillage',
      category: 'Farm Practices',
      icon: 'tractor',
      title: 'Reduce Tillage Intensity',
      whyItMatters:
        'Frequent deep ploughing breaks up soil structure and exposes stored carbon to the air.',
      whatToDo:
        'Move towards reduced or zero tillage where practical, and avoid ploughing wet soil.',
      expectedDirection: 'Less soil disturbance is generally associated with better retention of near-surface carbon.',
      evidenceNote:
        'Reduced and no-till systems are core conservation-agriculture practices for protecting topsoil organic matter.',
      learnMoreSlug: 'conservation-practices',
    },
    applies: (input) =>
      input.tillage === 'Conventional'
        ? 'Tillage is conventional — reducing passes could protect soil structure.'
        : null,
  },
  {
    base: {
      id: 'ph-management',
      category: 'Farm Practices',
      icon: 'flask-conical',
      title: 'Adjust Soil pH Towards the Optimal Range',
      whyItMatters:
        'Very acidic or very alkaline soil limits the crop and the soil life that builds organic matter.',
      whatToDo:
        'Get a soil test, then apply lime (for acidic soil) or gypsum / organic matter (for alkaline soil) as advised locally.',
      expectedDirection: 'Bringing pH towards roughly 6.0–7.5 supports nutrient availability and biological activity.',
      evidenceNote:
        'Most crops and soil microbial communities function best in a near-neutral pH range.',
      learnMoreSlug: 'soil-structure',
    },
    applies: (input) =>
      input.soilPh < 5.8
        ? `Soil pH is ${input.soilPh} — on the acidic side for most crops.`
        : input.soilPh > 8.2
          ? `Soil pH is ${input.soilPh} — on the alkaline side for most crops.`
          : null,
  },
  {
    base: {
      id: 'organic-amendments',
      category: 'Farm Practices',
      icon: 'recycle',
      title: 'Add Organic Amendments',
      whyItMatters:
        'Compost, manure and biochar bring carbon and nutrients directly into the soil.',
      whatToDo:
        'Apply locally available compost or farmyard manure before sowing, based on a soil test and recommended rates.',
      expectedDirection: 'Regular organic amendments are generally associated with gradual increases in soil carbon.',
      evidenceNote:
        'Organic amendment application is a direct, well-supported route to increasing soil organic-matter inputs.',
      learnMoreSlug: 'organic-amendments',
    },
    applies: (_input, prediction) =>
      prediction.status === 'Low' || prediction.status === 'Moderate'
        ? `Predicted soil carbon is ${prediction.status.toLowerCase()} — extra organic inputs could help close the gap.`
        : null,
  },
]

export function buildRecommendations(
  input: FarmInput,
  prediction: PredictionResult,
): Recommendation[] {
  return RULES.map((rule) => {
    const triggeredBy = rule.applies(input, prediction)
    if (!triggeredBy) return null
    return { ...rule.base, triggeredBy }
  }).filter((r): r is Recommendation => r !== null)
}

/** The four "headline" recommendations always shown on the dashboard. */
export const HEADLINE_RECOMMENDATION_IDS = [
  'organic-matter',
  'crop-residue',
  'soil-moisture',
  'crop-rotation',
]
