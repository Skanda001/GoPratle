export interface PreviousWorkItem {
  id: string;
  title: string;
  category: "planner" | "performer" | "crew";
  categoryLabel: string;
  client: string;
  location: string;
  venue: string;
  date: string;
  scale: string;
  coverImage: string;
  galleryImages: string[];
  summary: string;
  workDone: string[];
  testimonial: {
    quote: string;
    author: string;
    title: string;
  };
  metrics: { label: string; value: string }[];
}

export const PREVIOUS_WORK: PreviousWorkItem[] = [
  {
    id: "work-1",
    title: "Royal Udaivilas Destination Wedding",
    category: "planner",
    categoryLabel: "Full Wedding Planning",
    client: "Singhania Family",
    location: "Udaipur, Rajasthan",
    venue: "The Oberoi Udaivilas & Jagmandir Island Palace",
    date: "February 2026",
    scale: "450 Guests • 3 Days",
    coverImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
    ],
    summary:
      "Complete 3-day royal palace wedding orchestrating Mehendi, lakeside Sangeet, and Royal Varmala ceremony with over 450 global delegates.",
    workDone: [
      "End-to-end design concept: Heritage Rajasthani royalty with custom marigold & lotus mandap",
      "Coordination of 18 specialist vendors including top-tier gourmet royal catering & mixology",
      "Private fleet logistics: 45 luxury cars, vintage carriage entry, and speedboat transfers to Jagmandir",
      "Bespoke soundscapes and synchronized architectural palace projection mapping",
      "Dedicated 24/7 guest concierge desk managing flight arrivals and royal hospitality suites",
    ],
    testimonial: {
      quote:
        "GoPratle made our dream palace wedding effortless. Every single moment, from the lakeside fireworks to the banquet service, was executed with royal precision.",
      author: "Vikram & Radhika Singhania",
      title: "Wedding Hosts",
    },
    metrics: [
      { label: "Guests Hosted", value: "450+" },
      { label: "Vendors Coordinated", value: "18" },
      { label: "Guest Satisfaction", value: "100%" },
    ],
  },
  {
    id: "work-2",
    title: "NexGen AI Global Tech Summit 2026",
    category: "crew",
    categoryLabel: "Technical Crew & Production",
    client: "Vertex Cloud Global",
    location: "Bengaluru, Karnataka",
    venue: "BIEC — Bangalore International Exhibition Centre",
    date: "January 2026",
    scale: "4,200 Delegates • 4 Auditoriums",
    coverImage:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
    ],
    summary:
      "Deployed 48 certified stagehands, AV technicians, and camera crews for an international enterprise conference with 4K multi-stream broadcast.",
    workDone: [
      "Provided 48 stagehands and audio-visual engineers across 4 parallel keynote tracks",
      "Zero-latency multi-angle camera switching and live YouTube/LinkedIn broadcast console management",
      "Fast 45-minute stage changeovers between tech demos and fireside chat setups",
      "High-output truss lighting, digital podiums, and confidence monitor engineering for global CEOs",
      "Strict compliance with venue occupational safety and redundancy power switching protocols",
    ],
    testimonial: {
      quote:
        "Flawless technical execution under intense pressure. GoPratle's crew members were punctual, uniform-ready, and knew enterprise audio-visual protocols inside out.",
      author: "Aditi Mathur",
      title: "VP Events, Vertex Cloud",
    },
    metrics: [
      { label: "Crew Deployed", value: "48 Technicians" },
      { label: "Keynote Tracks", value: "4 Parallel" },
      { label: "Uptime & Sync", value: "99.98%" },
    ],
  },
  {
    id: "work-3",
    title: "Sunburn Arena Campus Fest — Headline DJ & Band",
    category: "performer",
    categoryLabel: "Artist & Performer Lineup",
    client: "IIT Delhi Students Gymkhana",
    location: "New Delhi",
    venue: "OAT — Open Air Theatre, IIT Delhi",
    date: "November 2025",
    scale: "9,000+ Students • 5 Hours Live",
    coverImage:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    ],
    summary:
      "Exclusive curation of top-billed electronic music producer, opening indie live band, stage pyrotechnics, and complete artist hospitality handling.",
    workDone: [
      "Headline artist negotiation, performance rider fulfillment, and backline instrumentation",
      "Line array audio acoustic calibration tuned for 9,000-capacity open air amphitheatres",
      "Synchronized CO2 jets, laser sweeps, and low-smoke fog integration with DJ drops",
      "VIP green-room hospitality, luxury convoy transit, and stage security perimeter control",
      "Opening 6-piece fusion rock band curation with complete multitrack sound mixing",
    ],
    testimonial: {
      quote:
        "The crowd went absolutely berserk! GoPratle handled the artist riders and audio technicalities seamlessly. Best cultural night in our college history.",
      author: "Karan Johar (Student Convener)",
      title: "Cultural Secretary, IIT Delhi",
    },
    metrics: [
      { label: "Live Attendees", value: "9,000+" },
      { label: "Performance Duration", value: "5 Hours" },
      { label: "Audio Output", value: "118 dB Clean" },
    ],
  },
  {
    id: "work-4",
    title: "Vintage Chic 40th Birthday & Sundowner",
    category: "planner",
    categoryLabel: "Private Milestone Celebration",
    client: "Kapoor Family",
    location: "Alibaug Beachfront, Maharashtra",
    venue: "Casa Bella Private Villa",
    date: "December 2025",
    scale: "120 VIP Guests",
    coverImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
    ],
    summary:
      "Boho-chic sunset party with live saxophone performance, custom artisan gin bars, and fairy-lit canopy dinner under the palm trees.",
    workDone: [
      "Complete beachfront venue transformation with bespoke bamboo cabanas & Edison warm bulbs",
      "Handpicked 3-piece acoustic jazz ensemble & international mixologists",
      "Private speedboat chartering across Gateway of India for all 120 guests",
      "Curated 6-course live woodfire dining experience with organic local produce",
    ],
    testimonial: {
      quote:
        "Intimate, breathtaking, and effortlessly chic. Our friends are still raving about the sunset lighting and the live saxophonist.",
      author: "Sameer & Ananya Kapoor",
      title: "Event Hosts",
    },
    metrics: [
      { label: "VIP Guests", value: "120" },
      { label: "Speedboat Charters", value: "4" },
      { label: "Guest Rating", value: "5.0 ★" },
    ],
  },
  {
    id: "work-5",
    title: "AutoCorp Global Annual Dealer Awards",
    category: "crew",
    categoryLabel: "Corporate Stage & Logistics Crew",
    client: "AutoCorp Automotive Ltd.",
    location: "Mumbai, Maharashtra",
    venue: "Grand Hyatt Ballroom",
    date: "October 2025",
    scale: "600 Franchise Owners & Execs",
    coverImage:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80",
    ],
    summary:
      "Turnkey stagehand and logistics crew execution for 600 automotive franchise dealers, featuring computerized trophy presentations and choreographed reveal moments.",
    workDone: [
      "16 uniformed stagehands executing 45 rapid trophy handovers with zero stage pauses",
      "Automated robotic spotlight following each award winner from table to stage",
      "Full red carpet photo-op wall lighting and instantaneous media file dispatch",
      "Rigid security perimeter and backstage VIP guest management",
    ],
    testimonial: {
      quote:
        "The professionalism of GoPratle's crew made our annual gala feel like the Oscars. Smooth transitions, sharp uniforms, and zero friction.",
      author: "Rajeshwar Rao",
      title: "Head of Dealer Relations, AutoCorp",
    },
    metrics: [
      { label: "Awards Handed", value: "45 Trophies" },
      { label: "Stage Accuracy", value: "100%" },
      { label: "Event Run-time", value: "On Schedule" },
    ],
  },
];
