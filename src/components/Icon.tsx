import {
  Sprout,
  Wheat,
  Droplets,
  RefreshCw,
  Leaf,
  Tractor,
  FlaskConical,
  Recycle,
  Shield,
  Layers,
  Percent,
  Download,
  Grid3x3,
  CloudRain,
  Thermometer,
  Globe,
  HelpCircle,
  type LucideProps,
} from 'lucide-react'

const MAP: Record<string, React.ComponentType<LucideProps>> = {
  sprout: Sprout,
  wheat: Wheat,
  droplets: Droplets,
  'refresh-cw': RefreshCw,
  leaf: Leaf,
  tractor: Tractor,
  'flask-conical': FlaskConical,
  recycle: Recycle,
  shield: Shield,
  layers: Layers,
  percent: Percent,
  download: Download,
  'grid-3x3': Grid3x3,
  'cloud-rain': CloudRain,
  thermometer: Thermometer,
  globe: Globe,
}

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = MAP[name] ?? HelpCircle
  return <Cmp {...props} />
}
