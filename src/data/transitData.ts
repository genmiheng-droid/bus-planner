import { BusStop, BusServiceDetail, TransitAlert, GuideArticle, FaqItem } from '../types';

export const INITIAL_BUS_STOPS: BusStop[] = [
  {
    id: 'bayfront-03511',
    code: '03511',
    name: 'Bayfront Stn Exit B',
    road: 'Marina Bay Sands',
    badgeText: 'Stop 03511 (Downtown)',
    coordinates: { x: 550, y: 465 },
    services: [
      {
        service: '36',
        badgeBg: 'bg-brand-600',
        destination: 'To Changi Airport',
        deckType: 'Double Decker',
        wheelchair: true,
        estMinutes: 1,
        nextTimes: ['11m', '24m'],
        crowding: 'Seats Available',
        status: 'Predicted (LTA)',
      },
      {
        service: '65',
        badgeBg: 'bg-sgTransit-dt',
        destination: 'To Tampines Int',
        deckType: 'Single Deck',
        wheelchair: false,
        estMinutes: 4,
        nextTimes: ['15m', '22m'],
        crowding: 'Standing Available',
        status: 'Recalculated',
      },
      {
        service: '175',
        badgeBg: 'bg-purple-700',
        destination: 'To Clementi Int',
        deckType: 'Double Decker',
        wheelchair: true,
        estMinutes: 12,
        nextTimes: ['28m'],
        crowding: 'Seats Available',
        status: 'On Schedule',
      },
    ],
  },
  {
    id: 'orchard-09022',
    code: '09022',
    name: 'Orchard Blvd Stn Exit 1',
    road: 'Orchard Boulevard',
    badgeText: 'Stop 09022',
    coordinates: { x: 470, y: 390 },
    services: [
      {
        service: '7',
        badgeBg: 'bg-sgTransit-ew',
        destination: 'To Bedok Int',
        deckType: 'Double Decker',
        wheelchair: true,
        estMinutes: 2,
        nextTimes: ['9m', '18m'],
        crowding: 'Standing Available',
        status: 'Predicted (LTA)',
      },
      {
        service: '14',
        badgeBg: 'bg-brand-600',
        destination: 'To Clementi Int',
        deckType: 'Double Decker',
        wheelchair: true,
        estMinutes: 6,
        nextTimes: ['16m', '25m'],
        crowding: 'Seats Available',
        status: 'Recalculated',
      },
      {
        service: '36',
        badgeBg: 'bg-brand-600',
        destination: 'To Tomlinson Rd (Loop)',
        deckType: 'Double Decker',
        wheelchair: true,
        estMinutes: 9,
        nextTimes: ['21m'],
        crowding: 'Seats Available',
        status: 'On Schedule',
      },
    ],
  },
  {
    id: 'bishan-53009',
    code: '53009',
    name: 'Bishan Stn / Junction 8',
    road: 'Bishan Road',
    badgeText: 'Stop 53009',
    coordinates: { x: 560, y: 320 },
    services: [
      {
        service: '502',
        badgeBg: 'bg-amber-600',
        destination: 'To Soon Lee Depot',
        deckType: 'Double Decker',
        wheelchair: true,
        estMinutes: 3,
        nextTimes: ['14m', '29m'],
        crowding: 'Seats Available',
        status: 'Predicted (LTA)',
      },
      {
        service: '88',
        badgeBg: 'bg-sgTransit-dt',
        destination: 'To Pasir Ris Int',
        deckType: 'Double Decker',
        wheelchair: true,
        estMinutes: 7,
        nextTimes: ['18m', '31m'],
        crowding: 'Standing Available',
        status: 'Recalculated',
      },
      {
        service: '156',
        badgeBg: 'bg-emerald-700',
        destination: 'To Sengkang Int',
        deckType: 'Single Deck',
        wheelchair: true,
        estMinutes: 11,
        nextTimes: ['23m'],
        crowding: 'Seats Available',
        status: 'On Schedule',
      },
    ],
  },
  {
    id: 'jewel-changi',
    code: '95029',
    name: 'Jewel Changi Airport PTB',
    road: 'Airport Boulevard',
    badgeText: 'Jewel Changi Hub',
    coordinates: { x: 815, y: 345 },
    services: [
      {
        service: '36',
        badgeBg: 'bg-brand-600',
        destination: 'To Regent S’pore / Orchard',
        deckType: 'Double Decker',
        wheelchair: true,
        estMinutes: 2,
        nextTimes: ['10m', '20m'],
        crowding: 'Seats Available',
        status: 'Predicted (LTA)',
      },
      {
        service: '858',
        badgeBg: 'bg-rose-700',
        destination: 'To Woodlands Temp Int',
        deckType: 'Single Deck',
        wheelchair: true,
        estMinutes: 5,
        nextTimes: ['17m', '28m'],
        crowding: 'Standing Available',
        status: 'Recalculated',
      },
      {
        service: '27',
        badgeBg: 'bg-purple-700',
        destination: 'To Hougang Central Int',
        deckType: 'Single Deck',
        wheelchair: true,
        estMinutes: 8,
        nextTimes: ['19m'],
        crowding: 'Seats Available',
        status: 'On Schedule',
      },
    ],
  },
  {
    id: 'bedok-84009',
    code: '84009',
    name: 'Bedok Bus Interchange',
    road: 'Bedok North Drive',
    badgeText: 'Stop 84009',
    coordinates: { x: 758, y: 480 },
    services: [
      {
        service: '7',
        badgeBg: 'bg-sgTransit-ew',
        destination: 'To Clementi Int',
        deckType: 'Double Decker',
        wheelchair: true,
        estMinutes: 4,
        nextTimes: ['12m', '23m'],
        crowding: 'Seats Available',
        status: 'Predicted (LTA)',
      },
      {
        service: '14',
        badgeBg: 'bg-brand-600',
        destination: 'To Clementi Int (via Orchard)',
        deckType: 'Double Decker',
        wheelchair: true,
        estMinutes: 6,
        nextTimes: ['17m', '30m'],
        crowding: 'Seats Available',
        status: 'On Schedule',
      },
      {
        service: '65',
        badgeBg: 'bg-sgTransit-dt',
        destination: 'To HarbourFront Int',
        deckType: 'Double Decker',
        wheelchair: true,
        estMinutes: 9,
        nextTimes: ['22m'],
        crowding: 'Standing Available',
        status: 'Recalculated',
      },
    ],
  },
  {
    id: 'jurong-28009',
    code: '28009',
    name: 'Jurong East Interchange',
    road: 'Jurong Gateway Road',
    badgeText: 'Stop 28009',
    coordinates: { x: 320, y: 435 },
    services: [
      {
        service: '502',
        badgeBg: 'bg-amber-600',
        destination: 'To Marina Centre (Express)',
        deckType: 'Double Decker',
        wheelchair: true,
        estMinutes: 3,
        nextTimes: ['15m', '28m'],
        crowding: 'Seats Available',
        status: 'Predicted (LTA)',
      },
      {
        service: '61',
        badgeBg: 'bg-indigo-600',
        destination: 'To Eunos Interchange',
        deckType: 'Double Decker',
        wheelchair: true,
        estMinutes: 7,
        nextTimes: ['18m', '32m'],
        crowding: 'Standing Available',
        status: 'On Schedule',
      },
      {
        service: '197',
        badgeBg: 'bg-emerald-600',
        destination: 'To Bedok Interchange',
        deckType: 'Double Decker',
        wheelchair: true,
        estMinutes: 10,
        nextTimes: ['24m'],
        crowding: 'Seats Available',
        status: 'Recalculated',
      },
    ],
  },
];

export const POPULAR_BUS_SERVICES: BusServiceDetail[] = [
  {
    service: 'Bus 36',
    origin: 'Changi Airport PTB2',
    destination: 'Tomlinson Rd (Loop via Marina Bay & Orchard)',
    operatingHours: {
      weekdays: '06:00 - 23:58',
      saturdays: '06:00 - 23:58',
      sundays: '06:00 - 23:58',
    },
    frequency: '7 - 12 mins',
    stopsCount: 78,
    popularStops: [
      'Changi Airport PTB 1/2/3',
      'Marine Parade Rd',
      'Bayfront Stn Exit B (MBS)',
      'Suntec City',
      'Orchard Blvd',
      'Dhoby Ghaut Stn',
    ],
  },
  {
    service: 'Bus 65',
    origin: 'Tampines Interchange',
    destination: 'HarbourFront Interchange',
    operatingHours: {
      weekdays: '05:30 - 23:45',
      saturdays: '05:30 - 23:45',
      sundays: '05:45 - 23:45',
    },
    frequency: '8 - 14 mins',
    stopsCount: 62,
    popularStops: [
      'Tampines Int',
      'Bedok Reservoir Rd',
      'MacPherson Stn',
      'Little India Stn',
      'Orchard Stn',
      'HarbourFront Int',
    ],
  },
  {
    service: 'Bus 175',
    origin: 'Clementi Interchange',
    destination: 'Lorong 1 Geylang Terminal',
    operatingHours: {
      weekdays: '05:45 - 23:30',
      saturdays: '05:45 - 23:30',
      sundays: '06:00 - 23:30',
    },
    frequency: '10 - 15 mins',
    stopsCount: 54,
    popularStops: [
      'Clementi Int',
      'West Coast Highway',
      'Great World City',
      'City Hall Stn',
      'Bugis Junction',
      'Kallang Stn',
    ],
  },
  {
    service: 'Bus 858',
    origin: 'Woodlands Temp Interchange',
    destination: 'Changi Airport PTB (Loop via TPE)',
    operatingHours: {
      weekdays: '05:20 - 23:30',
      saturdays: '05:20 - 23:30',
      sundays: '05:30 - 23:30',
    },
    frequency: '8 - 13 mins',
    stopsCount: 66,
    popularStops: [
      'Woodlands Int',
      'Sembawang Stn',
      'Yishun MRT Ave 2',
      'Jalan Kayu Flyover',
      'Changi Airport PTB 1/2/3',
    ],
  },
  {
    service: 'Bus 7',
    origin: 'Bedok Interchange',
    destination: 'Clementi Interchange',
    operatingHours: {
      weekdays: '05:30 - 23:50',
      saturdays: '05:30 - 23:50',
      sundays: '05:45 - 23:50',
    },
    frequency: '6 - 11 mins',
    stopsCount: 58,
    popularStops: [
      'Bedok Int',
      'Geylang Rd',
      'Bugis Stn',
      'Orchard Rd / Somerset',
      'Holland Village',
      'Clementi Int',
    ],
  },
  {
    service: 'Bus 12',
    origin: 'Pasir Ris Interchange',
    destination: 'Kampong Bahru Terminal',
    operatingHours: {
      weekdays: '05:30 - 23:30',
      saturdays: '05:30 - 23:30',
      sundays: '05:45 - 23:30',
    },
    frequency: '9 - 14 mins',
    stopsCount: 60,
    popularStops: [
      'Pasir Ris Int',
      'Tampines Ave 7',
      'Kallang Stn',
      'Bugis Stn',
      'Chinatown Point',
      'Outram Park Stn',
    ],
  },
  {
    service: 'Bus 14',
    origin: 'Bedok Interchange',
    destination: 'Clementi Interchange',
    operatingHours: {
      weekdays: '05:30 - 23:45',
      saturdays: '05:30 - 23:45',
      sundays: '05:45 - 23:45',
    },
    frequency: '7 - 12 mins',
    stopsCount: 64,
    popularStops: [
      'Bedok Int',
      'Marine Parade',
      'Sun Plaza',
      'Orchard Boulevard',
      'Dover MRT',
      'Clementi Int',
    ],
  },
  {
    service: 'Bus 502',
    origin: 'Soon Lee Depot (Jurong West)',
    destination: 'Bayfront Ave / Marina Centre (Express)',
    operatingHours: {
      weekdays: '06:00 - 23:15',
      saturdays: '06:15 - 23:15',
      sundays: '06:30 - 23:15',
    },
    frequency: '12 - 18 mins',
    stopsCount: 46,
    popularStops: [
      'Pioneer MRT',
      'Jurong East Stn',
      'AYE Expressway',
      'Orchard Rd',
      'Suntec City',
      'Marina Bay Sands',
    ],
  },
  {
    service: 'Bus 167',
    origin: 'Sembawang Interchange',
    destination: 'Bukit Merah Interchange',
    operatingHours: {
      weekdays: '05:45 - 23:30',
      saturdays: '05:45 - 23:30',
      sundays: '06:00 - 23:30',
    },
    frequency: '12 - 20 mins',
    stopsCount: 52,
    popularStops: [
      'Sembawang Int',
      'Upper Thomson Rd',
      'Novena Stn',
      'Orchard Rd',
      'Tanjong Pagar Stn',
      'Bukit Merah Int',
    ],
  },
  {
    service: 'Bus 61',
    origin: 'Bukit Batok Interchange',
    destination: 'Eunos Interchange',
    operatingHours: {
      weekdays: '05:30 - 23:30',
      saturdays: '05:30 - 23:30',
      sundays: '05:45 - 23:30',
    },
    frequency: '10 - 16 mins',
    stopsCount: 76,
    popularStops: [
      'Bukit Batok Int',
      'Beauty World Stn',
      'Holland Rd',
      'HarbourFront Stn',
      'Clarke Quay',
      'Eunos Int',
    ],
  },
];

export const TRANSIT_ALERTS: TransitAlert[] = [
  {
    id: 'alert-1',
    type: 'bus',
    lineOrService: 'Bus 36, 111, 133',
    headline: 'Bus Diversion along Raffles Ave & Marina Blvd',
    description: 'Due to road closure for weekend civic district events, buses will bypass Stop 02051 (The Esplanade) between 18:00 and 23:30.',
    time: 'Updated 20 mins ago',
    severity: 'warning',
  },
  {
    id: 'alert-2',
    type: 'mrt',
    lineOrService: 'Downtown Line (DTL)',
    headline: 'Normal Operations Island-Wide',
    description: 'All lines operating on regular 2-3 min peak headways. Train services running with normal dwell times at all interchange hubs.',
    time: 'Updated 5 mins ago',
    severity: 'normal',
  },
  {
    id: 'alert-3',
    type: 'advisory',
    lineOrService: 'SimplyGo Account-Based Ticketing',
    headline: 'Card Reader Dwell Time Advisory',
    description: 'When tapping your Mastercard or Visa credit/debit card, ensure a firm 1-second tap to avoid multi-card clash detection.',
    time: 'Commuter Tip',
    severity: 'normal',
  },
];

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    id: 'guide-concession-cards',
    category: 'Fares & Passes',
    categoryColor: 'text-cyan-400',
    title: 'Singapore Concession Cards: Who Qualifies and How to Apply',
    readTime: '6 min read',
    tag: 'Updated this month',
    excerpt:
      'Concessionary fares are tied to the card, not to you. Plenty of eligible people pay full adult fares for years simply because they never applied. Here is every concession category and what to do about it.',
    paragraphs: [
      'In Singapore, public transit fares are determined strictly by the type of card tapped at the fare gantry. If an eligible senior citizen, student, or national serviceman taps an adult bank card or generic SimplyGo EZ-Link, the fare engine deducts standard adult pricing with zero automatic discounts.',
      'Categories eligible for concession pricing include: Primary & Secondary Students, Tertiary/Polytechnic Students, Full-time National Servicemen (NSFs), Persons with Disabilities (PWD), Senior Citizens (aged 60 and above), and the Workfare Transport Concession scheme for lower-wage workers.',
      'Applying is straightforward through TransitLink / SimplyGo ticket offices or online via the SimplyGo portal with Singpass verification. Once activated, monthly travel passes provide unlimited bus and rail travel for a fixed cap, making it heavily cost-effective for daily cross-island commuters.',
    ],
  },
  {
    id: 'guide-arrival-predictions',
    category: 'Arrival Mechanics',
    categoryColor: 'text-brand-400',
    title: 'Why Your Bus Says 3 Minutes and Then 5: How Arrival Predictions Really Work',
    readTime: '4 min read',
    tag: 'Commuter Tech',
    excerpt:
      'Live bus arrival times are predictions, not promises. Here is where the numbers come from, why they jump backwards, what the bus load indicator means, and how to read them like an expert commuter.',
    paragraphs: [
      'Singapore bus arrival telemetry is generated in real-time by the Land Transport Authority (LTA) DataMall system using On-Board Units (OBU) fitted onto every active public bus across SBS Transit, SMRT, Tower Transit, and Go-Ahead.',
      'The central algorithm combines GPS coordinates with road speed profiles, red-light cycles, historical dwell times at preceding stops, and weather telemetry. When a bus halts behind a protracted traffic queue or takes longer than average to load passengers at an interchange, the prediction engine recalculates the estimated time of arrival (ETA) upward.',
      'Bus load indicators (Green: Seats Available, Amber: Standing Available, Red: Limited Standing) are calculated using automated axle-weight load sensors and onboard passenger counters. If you see a green indicator followed by an amber one in 3 minutes, taking the second bus often yields a much calmer seat.',
    ],
  },
  {
    id: 'guide-bus-numbers-letters',
    category: 'Route Decoders',
    categoryColor: 'text-purple-400',
    title: 'What the Letters on Singapore Bus Numbers Mean (10e, 74B, NR7, 291M)',
    readTime: '5 min read',
    tag: 'Transit Guide',
    excerpt:
      'Bus 74 and bus 74B are not the same service, and getting on the wrong one can leave you a long way from where you meant to be. A complete decoder for Singapore bus service number suffixes and prefixes.',
    paragraphs: [
      'Suffix "e" (e.g. 10e, 89e, 174e): Denotes Fast Forward / Express services. These buses ply expressways (ECP, PIE, AYE) and skip intermediate suburban stops during weekday peak morning and evening hours.',
      'Suffixes "A" and "B" (e.g. 74A, 143M): Represent short-working trips. "A" trips terminate halfway along a long trunk route (usually at a major MRT station or university campus during morning peak) to inject extra capacity where crowding is highest.',
      'Suffix "M" (e.g. 291M, 293M): Denotes modified or supplementary routes designed to improve neighborhood connectivity without duplicating the parent loop entirely.',
      'Night Prefixes "NR" & "N": Historical NightRider and Nite Owl late-night weekend services that operate after MRT operating hours from the city center to residential heartlands.',
    ],
  },
  {
    id: 'guide-changi-airport-transfers',
    category: 'Airport Transit',
    categoryColor: 'text-emerald-400',
    title: 'Changi Airport Transfers Compared: MRT, Bus, Taxi and Ride-Hail',
    readTime: '7 min read',
    tag: 'Cost Analysis',
    excerpt:
      'Four ways to reach Changi, separated by roughly a tenfold difference in price. A straight comparison of what each costs, how long it takes, and the specific situations where each one is the right answer.',
    paragraphs: [
      'Singapore Changi Airport has one of the world’s most accessible transit integrations. Commuters can choose between MRT (East-West Line via Tanah Merah or Downtown Line via Expo), Public Bus (Services 36, 24, 27, 34, 53, 110, 858), standard metered taxis, or ride-hail platforms (Grab, Gojek, Tada).',
      'The Public Bus 36 option is a commuter favorite for Marina Bay and Orchard Rd travelers: at roughly $2.10, it offers panoramic views of the East Coast Parkway and drops passengers directly in the basement terminals without needing to change trains with heavy luggage.',
      'MRT is the most predictable during peak rush hour (4:30 PM - 7:30 PM) as it completely avoids expressway jams. Taxis and ride-hails remain superior for midnight departures or family travel with multiple suitcases, with airport surcharges between $6 - $8 applying during peak hours.',
    ],
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How do I find the nearest bus stop in Singapore?',
    answer:
      'Tap Locate Nearest Stop at the top of this page and allow location access. SmartCommute lists the five closest bus stops with their walking distance and live arrival times. If you would rather not share your location, search by stop name, road name or five-digit stop code instead — everything works the same way.',
  },
  {
    id: 'faq-2',
    question: 'How do I check bus arrival time in Singapore?',
    answer:
      'Search for any bus stop above, or open its page directly. You will see every service calling at that stop with the next three arrivals for each. Times come from LTA DataMall and are estimates based on where the buses actually are, so they update continuously.',
  },
  {
    id: 'faq-3',
    question: 'Can I find all the stops for a specific bus number?',
    answer:
      'Yes. Use the bus route finder and enter any service number to see every stop along the route in both directions, with stop names, road names, codes and the first and last bus timings for weekdays, Saturdays and Sundays.',
  },
  {
    id: 'faq-4',
    question: 'Why does the arrival time sometimes go up instead of down?',
    answer:
      'Because it is a live prediction, not a timetable. If the bus catches a red light, spends longer at a stop, or hits traffic, the estimate is recalculated upward. We explain this in detail in our arrival predictions guide.',
  },
  {
    id: 'faq-5',
    question: 'Do I pay more if my journey needs two buses?',
    answer:
      'No. Singapore charges by total distance travelled, not per boarding, and transfers within about 45 minutes are free. A trip using a bus, a train and another bus costs the same as one direct bus over the same distance.',
  },
  {
    id: 'faq-6',
    question: 'Is SmartCommute free, and do I need to install anything?',
    answer:
      'It is free and it runs in your browser — no app store download and no account. You can add it to your phone\'s home screen from your browser\'s share menu if you want it to open like an app.',
  },
];

export interface RegionLocation {
  x: number;
  y: number;
  name: string;
  stopCode: string;
}

export const SINGAPORE_REGION_COORDS: Record<string, RegionLocation> = {
  'jurong west': { x: 235, y: 425, name: 'Jurong West', stopCode: '27219' },
  'boon lay': { x: 235, y: 425, name: 'Boon Lay', stopCode: '22009' },
  'jurong east': { x: 320, y: 435, name: 'Jurong East', stopCode: '28009' },
  'jurong': { x: 320, y: 435, name: 'Jurong East', stopCode: '28009' },
  'clementi': { x: 380, y: 440, name: 'Clementi', stopCode: '17179' },
  'bukit batok': { x: 340, y: 302, name: 'Bukit Batok', stopCode: '43009' },
  'choa chu kang': { x: 340, y: 222, name: 'Choa Chu Kang', stopCode: '44009' },
  'cck': { x: 340, y: 222, name: 'Choa Chu Kang', stopCode: '44009' },
  'bukit panjang': { x: 382, y: 258, name: 'Bukit Panjang', stopCode: '44029' },
  'woodlands': { x: 450, y: 170, name: 'Woodlands', stopCode: '46009' },
  'yishun': { x: 510, y: 210, name: 'Yishun', stopCode: '59009' },
  'khatib': { x: 520, y: 235, name: 'Khatib', stopCode: '58221' },
  'seletar': { x: 635, y: 172, name: 'Seletar', stopCode: '68009' },
  'bukit timah': { x: 440, y: 460, name: 'Bukit Timah', stopCode: '42019' },
  'beauty world': { x: 430, y: 450, name: 'Beauty World', stopCode: '42099' },
  'ang mo kio': { x: 548, y: 272, name: 'Ang Mo Kio', stopCode: '54009' },
  'amk': { x: 548, y: 272, name: 'Ang Mo Kio', stopCode: '54009' },
  'bishan': { x: 570, y: 342, name: 'Bishan', stopCode: '53009' },
  'toa payoh': { x: 568, y: 390, name: 'Toa Payoh', stopCode: '52009' },
  'novena': { x: 540, y: 415, name: 'Novena', stopCode: '50038' },
  'orchard': { x: 490, y: 435, name: 'Orchard Blvd', stopCode: '09022' },
  'somerset': { x: 510, y: 440, name: 'Somerset', stopCode: '08138' },
  'dhoby ghaut': { x: 530, y: 445, name: 'Dhoby Ghaut', stopCode: '08031' },
  'city hall': { x: 540, y: 455, name: 'City Hall', stopCode: '04111' },
  'marina bay': { x: 550, y: 465, name: 'Marina Bay', stopCode: '03511' },
  'bayfront': { x: 550, y: 465, name: 'Bayfront MBS', stopCode: '03511' },
  'mbs': { x: 550, y: 465, name: 'Marina Bay Sands', stopCode: '03511' },
  'downtown': { x: 545, y: 465, name: 'Downtown', stopCode: '03511' },
  'harbourfront': { x: 490, y: 485, name: 'HarbourFront', stopCode: '14119' },
  'vivocity': { x: 490, y: 485, name: 'VivoCity', stopCode: '14119' },
  'serangoon': { x: 615, y: 365, name: 'Serangoon', stopCode: '66009' },
  'hougang': { x: 650, y: 325, name: 'Hougang', stopCode: '64009' },
  'sengkang': { x: 675, y: 272, name: 'Sengkang', stopCode: '67009' },
  'punggol': { x: 688, y: 200, name: 'Punggol', stopCode: '65009' },
  'paya lebar': { x: 710, y: 415, name: 'Paya Lebar', stopCode: '81111' },
  'bedok': { x: 758, y: 450, name: 'Bedok', stopCode: '84009' },
  'tampines': { x: 790, y: 390, name: 'Tampines', stopCode: '75009' },
  'pasir ris': { x: 785, y: 315, name: 'Pasir Ris', stopCode: '77009' },
  'changi': { x: 830, y: 370, name: 'Changi Airport', stopCode: '95029' },
  'jewel': { x: 830, y: 370, name: 'Jewel Changi Hub', stopCode: '95029' },
  'airport': { x: 830, y: 370, name: 'Changi Airport PTB', stopCode: '95029' },
  'current location': { x: 490, y: 435, name: 'Current Location', stopCode: '09022' },
};

/**
 * Resolves any freeform address, postal code, or place in Singapore to map coordinates
 */
export function resolveSingaporeCoords(query: string, fallbackCoords = { x: 490, y: 435 }): RegionLocation {
  const q = query.toLowerCase().trim();
  if (!q || q.includes('current location') || q.includes('gps')) {
    return {
      x: fallbackCoords.x,
      y: fallbackCoords.y,
      name: 'Current Location',
      stopCode: '09022',
    };
  }

  // Check known bus stops first
  for (const stop of INITIAL_BUS_STOPS) {
    if (
      q.includes(stop.code) ||
      q.includes(stop.name.toLowerCase()) ||
      q.includes(stop.road.toLowerCase())
    ) {
      return {
        x: stop.coordinates.x,
        y: stop.coordinates.y,
        name: stop.name,
        stopCode: stop.code,
      };
    }
  }

  // Match regional keywords
  for (const [key, val] of Object.entries(SINGAPORE_REGION_COORDS)) {
    if (q.includes(key)) {
      return val;
    }
  }

  // Deterministic pseudo-geographic hash within Singapore bounds for other addresses
  let hash = 0;
  for (let i = 0; i < q.length; i++) {
    hash = (hash << 5) - hash + q.charCodeAt(i);
    hash |= 0;
  }
  const normalizedX = 320 + (Math.abs(hash) % 460); // range 320 - 780
  const normalizedY = 220 + (Math.abs(hash >> 3) % 240); // range 220 - 460
  return {
    x: normalizedX,
    y: normalizedY,
    name: query.split(',')[0].trim(),
    stopCode: '03511',
  };
}
