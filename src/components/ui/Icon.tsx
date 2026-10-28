import {
  Flame, Pill, Leaf, CalendarClock, Droplets, Moon, Bone, HeartPulse, Heart, AlertCircle, Sparkles,
  BookOpen, type LucideIcon
} from 'lucide-react';

const map: Record<string, LucideIcon> = {
  Flame, Pill, Leaf, CalendarClock, Droplets, Moon, Bone, HeartPulse, Heart, AlertCircle, Sparkles, BookOpen
};

export function TopicIcon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  const I = map[name] ?? BookOpen;
  return <I size={size} className={className} aria-hidden="true" />;
}
