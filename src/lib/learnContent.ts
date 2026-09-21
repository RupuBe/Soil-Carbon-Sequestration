export interface LearnArticle {
  slug: string
  category: 'Basics' | 'Soil Health' | 'Farming Practices' | 'Climate'
  icon: string
  title: string
  summary: string
  body: string[]
}

export const LEARN_ARTICLES: LearnArticle[] = [
  {
    slug: 'what-is-soil-carbon',
    category: 'Basics',
    icon: 'layers',
    title: 'What is Soil Carbon?',
    summary: 'The carbon held in the ground, mostly inside decomposed plant and animal material.',
    body: [
      'Soil carbon is carbon that is stored in the soil, mainly as part of organic matter — the dark, crumbly material left behind when roots, leaves and manure break down.',
      'When soil holds more carbon it usually holds more water, feeds the crop better, and resists erosion. Carbon also moves the other way: ploughing, bare soil and burning residue release it back to the air.',
      'The goal of good soil management is to add more carbon than the soil loses each year.',
    ],
  },
  {
    slug: 'what-is-soc',
    category: 'Basics',
    icon: 'percent',
    title: 'What is SOC?',
    summary: 'SOC means Soil Organic Carbon — a number that describes how much carbon your topsoil holds.',
    body: [
      'SOC stands for Soil Organic Carbon. It is usually written as a percentage of soil weight (for example 1.8%) or in grams per kilogram (18 g/kg). The two are the same thing: multiply the percentage by 10 to get g/kg.',
      'As a rough guide for farmed topsoil: below 1% is low, 1–2% is moderate, 2–3.5% is good, and above that is high. The right target depends on your soil type and climate.',
      'A single SOC number is a snapshot. What matters over time is the direction it is moving.',
    ],
  },
  {
    slug: 'what-is-carbon-sequestration',
    category: 'Basics',
    icon: 'download',
    title: 'What is Carbon Sequestration?',
    summary: 'Pulling carbon out of the air and locking it into the soil for the long term.',
    body: [
      'Carbon sequestration in farming means capturing carbon dioxide from the air through plants and storing it in the soil as stable organic matter.',
      'Practices that add lots of plant material and disturb the soil less — cover crops, residue retention, compost, reduced tillage, agroforestry — tend to store more carbon.',
      'Sequestration is gradual and has a ceiling: each soil can only hold so much. Early years usually show the fastest gains.',
    ],
  },
  {
    slug: 'why-organic-matter-matters',
    category: 'Soil Health',
    icon: 'sprout',
    title: 'Why Soil Organic Matter Matters',
    summary: 'Organic matter is the engine of a healthy, carbon-rich soil.',
    body: [
      'Soil organic matter feeds soil life, stores plant nutrients, holds water like a sponge, and gives the soil a crumbly structure that roots and rain can move through.',
      'Most soil carbon lives inside organic matter, so building one builds the other.',
      'You raise organic matter by adding compost and manure, keeping living roots in the ground for more of the year, and returning crop residue instead of removing or burning it.',
    ],
  },
  {
    slug: 'soil-moisture',
    category: 'Soil Health',
    icon: 'droplets',
    title: 'Soil Moisture',
    summary: 'Steady moisture keeps the soil life that builds carbon active.',
    body: [
      'The tiny organisms that turn plant material into stable soil carbon need moisture to work. Very dry soil puts them to sleep; waterlogged soil starves them of air.',
      'Mulch, organic matter and well-planned irrigation all help keep moisture in a comfortable middle range.',
      'Watching how quickly your soil dries after irrigation or rain tells you a lot about its structure and organic-matter content.',
    ],
  },
  {
    slug: 'soil-structure',
    category: 'Soil Health',
    icon: 'grid-3x3',
    title: 'Soil Structure',
    summary: 'How soil particles clump together decides how water, air and roots move.',
    body: [
      'Good structure means the soil forms small crumbs with spaces between them. Water soaks in, air reaches the roots, and carbon stored inside the crumbs is protected from breaking down.',
      'Heavy tillage, working wet soil, and low organic matter all damage structure.',
      'Organic matter, roots, and reduced disturbance rebuild it over time.',
    ],
  },
  {
    slug: 'crop-residue',
    category: 'Farming Practices',
    icon: 'wheat',
    title: 'Crop Residue',
    summary: 'The stalks and leaves left after harvest are free carbon for your soil.',
    body: [
      'Crop residue returned to the field breaks down into organic matter and shields the soil surface from sun and heavy rain.',
      'Burning residue releases its carbon to the air and harms soil life at the surface.',
      'Even retaining part of the residue as a surface mulch makes a measurable difference over several seasons.',
    ],
  },
  {
    slug: 'crop-rotation',
    category: 'Farming Practices',
    icon: 'refresh-cw',
    title: 'Crop Rotation',
    summary: 'Changing crops between seasons spreads root types and adds nitrogen naturally.',
    body: [
      'Growing the same crop every season narrows the range of roots and residues going into the soil and can build up pests and diseases.',
      'A rotation that includes a pulse or legume adds nitrogen and varied organic matter.',
      'A simple 2–3 year plan that alternates cereal, legume and another crop suits many farms.',
    ],
  },
  {
    slug: 'organic-amendments',
    category: 'Farming Practices',
    icon: 'recycle',
    title: 'Organic Amendments',
    summary: 'Compost, farmyard manure and biochar add carbon and nutrients directly.',
    body: [
      'Organic amendments are materials you add to the soil to increase organic matter and nutrient supply.',
      'Well-rotted compost and farmyard manure are the most common. Apply based on a soil test and locally recommended rates.',
      'Consistency matters more than a single large application — steady yearly additions build carbon reliably.',
    ],
  },
  {
    slug: 'conservation-practices',
    category: 'Farming Practices',
    icon: 'shield',
    title: 'Conservation Practices',
    summary: 'Less disturbance, more cover, more diversity — the three ideas behind conservation agriculture.',
    body: [
      'Conservation agriculture rests on three practices: minimal soil disturbance (reduced or zero tillage), keeping the soil covered (residue and cover crops), and diverse rotations.',
      'Together they slow carbon loss and speed carbon gain.',
      'They usually work best introduced gradually and adapted to local conditions.',
    ],
  },
  {
    slug: 'rainfall',
    category: 'Climate',
    icon: 'cloud-rain',
    title: 'Rainfall',
    summary: 'More rain generally means more plant growth — and more carbon returned to the soil.',
    body: [
      'Rainfall drives how much biomass a crop or cover produces, and biomass is the raw material for soil carbon.',
      'Very high rainfall can also wash nutrients away and waterlog soil, so drainage and cover matter more in wet areas.',
      'The benefit of extra rain flattens out once water is no longer the limiting factor.',
    ],
  },
  {
    slug: 'temperature',
    category: 'Climate',
    icon: 'thermometer',
    title: 'Temperature',
    summary: 'Warmer soil breaks organic matter down faster.',
    body: [
      'Higher temperatures speed up the decomposition of organic matter, which tends to lower soil carbon if inputs stay the same.',
      'This is why hot regions often need more organic-matter inputs to hold the same carbon level as cooler regions.',
      'Keeping the soil shaded and covered moderates its temperature.',
    ],
  },
  {
    slug: 'climate-and-soil-carbon',
    category: 'Climate',
    icon: 'globe',
    title: 'Climate and Soil Carbon',
    summary: 'Soil carbon is a balance between what plants add and what warmth and disturbance remove.',
    body: [
      'Every soil sits at a balance point set by its climate, its texture, and how it is managed.',
      'Cooler, wetter, clay-rich soils under permanent cover hold the most carbon. Hot, dry, sandy soils under continuous tillage hold the least.',
      'Management is the part you control: it can move a soil several tenths of a percent over a decade in either direction.',
    ],
  },
]

export const LEARN_CATEGORIES: LearnArticle['category'][] = [
  'Basics',
  'Soil Health',
  'Farming Practices',
  'Climate',
]
