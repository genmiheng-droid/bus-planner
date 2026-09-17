export interface BusArrival {
  service: string;
  badgeBg?: string;
  destination: string;
  deckType: 'Double Decker' | 'Single Deck' | 'Bendy' | string;
  wheelchair: boolean;
  estMinutes: number;
  nextTimes: string[];
  crowding: 'Seats Available' | 'Standing Available' | 'Limited Standing' | string;
  status: 'Predicted (LTA)' | 'Recalculated' | 'On Schedule' | string;
  minutes?: number[];
  operator?: string;
}

export interface BusStop {
  id: string;
  code: string;
  name: string;
  road: string;
  coordinates: { x: number; y: number };
  badgeText?: string;
  services: BusArrival[];
}

export interface BusServiceDetail {
  service: string;
  origin: string;
  destination: string;
  operatingHours: {
    weekdays: string;
    saturdays: string;
    sundays: string;
  };
  frequency: string;
  stopsCount: number;
  popularStops: string[];
}

export interface TransitAlert {
  id: string;
  type: 'mrt' | 'bus' | 'advisory';
  lineOrService: string;
  headline: string;
  description: string;
  time: string;
  severity: 'normal' | 'warning' | 'severe';
}

export interface GuideArticle {
  id: string;
  category: string;
  categoryColor: string;
  title: string;
  readTime: string;
  tag: string;
  excerpt: string;
  paragraphs: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface PlannedRoute {
  title: string;
  duration: string;
  steps: string[];
  originName: string;
  destName: string;
  originCoords: { x: number; y: number };
  destCoords: { x: number; y: number };
}
