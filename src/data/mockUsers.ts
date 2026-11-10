export interface UserProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  gallery: string[];
  distanceKm: number;
  angleDeg: number; // for radar rendering (0 - 360)
  mapCoords: { x: number; y: number }; // normalized 0-100 coordinates on simulated map
  neighborhood: string;
  activeStatus: 'Active now' | 'Active 5m ago' | 'Active 15m ago' | 'Active 1h ago';
  headline: string;
  bio: string;
  occupation: string;
  interests: string[];
  hangoutSpot: string;
  lookingFor: string;
  languages: string[];
  quickIcebreaker: string;
  defaultResponses: string[];
}

export interface ChatMessage {
  id: string;
  senderId: 'me' | string;
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export const CURRENT_USER = {
  id: 'me',
  name: 'Kabir',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  neighborhood: 'Indiranagar 100ft Rd',
  city: 'Bangalore',
};

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'priya-1',
    name: 'Priya Sharma',
    age: 24,
    avatar: '/src/assets/images/user_avatar_priya_1794325469461.jpg',
    gallery: [
      '/src/assets/images/user_avatar_priya_1794325469461.jpg',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    ],
    distanceKm: 0.8,
    angleDeg: 45,
    mapCoords: { x: 58, y: 42 },
    neighborhood: 'Indiranagar, 12th Main',
    activeStatus: 'Active now',
    headline: 'Building climate tech & hunting for the best cold brew',
    bio: 'Founder by day, botanical rooftop gardener by evening. Love discovering hidden bookshops, sourdough bakeries, and chatting about indie ventures over filter coffee.',
    occupation: 'Climate Tech Founder',
    interests: ['Coffee Cupping', 'Rooftop Gardening', 'Urban Sketching', 'Indie Tech', 'Podcasts'],
    hangoutSpot: 'Third Wave Roasters or Doff Pub Rooftop',
    lookingFor: 'Co-working buddy or someone up for weekend bouldering',
    languages: ['English', 'Hindi', 'Kannada'],
    quickIcebreaker: 'Hey Priya! Are you at 12th Main right now?',
    defaultResponses: [
      'Hey! Yes, I was just grabbing an iced pour-over around 12th Main. How is your day going?',
      'Always up for coffee or a quick brainstorming walk. Are you around here often?',
      'Haha that is awesome! Let me know if you know any quiet cafes with good Wi-Fi nearby.',
      'Nice meeting you! What are you working on these days?',
    ],
  },
  {
    id: 'arjun-2',
    name: 'Arjun Mehta',
    age: 26,
    avatar: '/src/assets/images/user_avatar_arjun_1794325469715.jpg',
    gallery: [
      '/src/assets/images/user_avatar_arjun_1794325469715.jpg',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    ],
    distanceKm: 1.4,
    angleDeg: 140,
    mapCoords: { x: 68, y: 72 },
    neighborhood: 'HAL 2nd Stage',
    activeStatus: 'Active now',
    headline: 'Product designer obsessed with typefaces and pour-overs',
    bio: 'Designing interfaces for mobile apps. When not pushing pixels, you will find me cycling around Cubbon Park or collecting vinyl records.',
    occupation: 'Lead Product Designer',
    interests: ['UI/UX', 'Cycling', 'Vinyl Records', 'Specialty Tea', 'Street Art'],
    hangoutSpot: 'Nerlu Cafe & The Bookworm',
    lookingFor: 'Cycling crew for Sunday 6 AM Cubbon laps',
    languages: ['English', 'Hindi', 'Gujarati'],
    quickIcebreaker: 'Hey Arjun! Do you do the Cubbon Park cycling loop on weekends?',
    defaultResponses: [
      'Hey there! Yes, every Sunday morning without fail! 6:30 AM before the city wakes up.',
      'That cafe has incredible lighting right now. Always sketching new interface ideas here.',
      'Glad you connected! Are you also in product design or tech?',
      'Let me know if you want to join our cycling group ride this weekend!',
    ],
  },
  {
    id: 'rohit-3',
    name: 'Rohit Verma',
    age: 28,
    avatar: '/src/assets/images/user_avatar_rohit_1794325470693.jpg',
    gallery: [
      '/src/assets/images/user_avatar_rohit_1794325470693.jpg',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    ],
    distanceKm: 2.3,
    angleDeg: 220,
    mapCoords: { x: 34, y: 65 },
    neighborhood: 'Domlur Layout',
    activeStatus: 'Active 5m ago',
    headline: 'Software architect, runner & board game enthusiast',
    bio: 'Distributed systems engineer. Training for the upcoming half marathon. Big Catan and Terraforming Mars fan—hosting casual board game nights every other Friday.',
    occupation: 'Staff Systems Engineer',
    interests: ['Long Distance Running', 'Catan', 'Distributed Systems', 'Sourdough', 'Sci-Fi'],
    hangoutSpot: 'Kaze or Glen’s Bakehouse',
    lookingFor: 'Board gamers for strategy games and weekend 10k runners',
    languages: ['English', 'Hindi'],
    quickIcebreaker: 'Hey Rohit! Saw you play Catan, what is your go-to strategy?',
    defaultResponses: [
      'Haha, ore and wheat monopoly always wins! Are you a board gamer too?',
      'Hey! Just got back from a 7km run along the golf course. The weather is crisp today.',
      'We actually have an open seat for game night this Friday in Domlur if you like strategy games!',
      'Awesome connecting with people nearby on Chalo Ji. How long have you lived in this area?',
    ],
  },
  {
    id: 'ananya-4',
    name: 'Ananya Sen',
    age: 25,
    avatar: '/src/assets/images/user_avatar_ananya_1794325470181.jpg',
    gallery: [
      '/src/assets/images/user_avatar_ananya_1794325470181.jpg',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    ],
    distanceKm: 3.1,
    angleDeg: 310,
    mapCoords: { x: 28, y: 26 },
    neighborhood: 'Koramangala 4th Block',
    activeStatus: 'Active now',
    headline: 'Architectural photographer capturing heritage colonial facades',
    bio: 'Roaming Bangalore alleys with my Leica M6. Fascinated by brutalist concrete, art deco balconies, and traditional South Indian filter coffee rituals.',
    occupation: 'Architectural Photographer & Archivist',
    interests: ['Street Photography', 'Analog Film', 'Architecture', 'Book Collecting', 'Jazz'],
    hangoutSpot: 'Atta Galatta or Indian Music Experience',
    lookingFor: 'Photo walk partners and fellow film photography geeks',
    languages: ['English', 'Bengali', 'Hindi'],
    quickIcebreaker: 'Love your photography focus! Any favorite photo walk spots nearby?',
    defaultResponses: [
      'Hello! Malleshwaram 8th Cross early morning is pure gold for light and shadows.',
      'Thanks for reaching out! Are you shooting film or digital?',
      'I am actually editing a photo essay on Bangalore modernist buildings right now.',
      'We should totally do a weekend photo walk around Russell Market if you are free!',
    ],
  },
  {
    id: 'zoya-5',
    name: 'Zoya Khan',
    age: 27,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    ],
    distanceKm: 4.5,
    angleDeg: 95,
    mapCoords: { x: 82, y: 52 },
    neighborhood: 'Old Airport Road',
    activeStatus: 'Active 15m ago',
    headline: 'Ceramic artist & sourdough enthusiast',
    bio: 'Running a boutique pottery studio. Throwing stoneware mugs and baking sourdough loaves. Big fan of slow living and acoustic open mics.',
    occupation: 'Ceramicist & Studio Host',
    interests: ['Pottery', 'Clay Sculpting', 'Baking', 'Acoustic Guitar', 'Farmers Markets'],
    hangoutSpot: 'Clay Station or Blue Tokai',
    lookingFor: 'Anyone wanting to try pottery throwing or exchange sourdough starter',
    languages: ['English', 'Urdu', 'Hindi'],
    quickIcebreaker: 'Hi Zoya! Do you do pottery workshops for beginners?',
    defaultResponses: [
      'Hi! Yes, I run beginner wheel-throwing sessions every Saturday morning!',
      'It is super therapeutic once you get the hang of centering clay.',
      'Feel free to drop by the studio sometime on Old Airport Rd.',
    ],
  },
  {
    id: 'vikram-6',
    name: 'Vikram Patel',
    age: 29,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    ],
    distanceKm: 6.2,
    angleDeg: 175,
    mapCoords: { x: 54, y: 88 },
    neighborhood: 'Koramangala 1st Block',
    activeStatus: 'Active now',
    headline: 'Fintech PM & amateur badminton tournament player',
    bio: 'Building payments infrastructure. When offline, I play competitive badminton and hunt down street food gems across old Bangalore.',
    occupation: 'Senior Product Manager',
    interests: ['Badminton', 'Street Food', 'Fintech', 'Squash', 'Trekking'],
    hangoutSpot: 'Play Arena & Shivaji Military Hotel',
    lookingFor: 'Badminton doubles partner (intermediate/advanced level)',
    languages: ['English', 'Hindi', 'Marathi'],
    quickIcebreaker: 'Hey Vikram! What court do you usually play badminton at?',
    defaultResponses: [
      'Hey! I usually book courts at Play Arena or Gurukul Sports in Koramangala.',
      'We play Tuesday & Thursday evenings at 7:30 PM. Always looking for solid rally partners!',
      'Let me know if you want to play a set sometime this week.',
    ],
  },
  {
    id: 'tanvi-7',
    name: 'Tanvi Deshmukh',
    age: 23,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    ],
    distanceKm: 8.7,
    angleDeg: 260,
    mapCoords: { x: 18, y: 78 },
    neighborhood: 'HSR Layout Sector 3',
    activeStatus: 'Active 1h ago',
    headline: 'Journalist & indie book club curator',
    bio: 'Covering urban culture and civic storytelling. Curating a non-fiction book club with 40+ members meeting every month in local parks.',
    occupation: 'Culture Journalist & Editor',
    interests: ['Non-Fiction', 'Civic Design', 'Podcasts', 'Museums', 'Filter Kaapi'],
    hangoutSpot: 'Goobe’s Book Republic',
    lookingFor: 'Book recommendations on urban anthropology & social design',
    languages: ['English', 'Marathi', 'Hindi'],
    quickIcebreaker: 'Hi Tanvi! What book is your club currently reading?',
    defaultResponses: [
      'Hi! We are currently reading "The Death and Life of Great American Cities" by Jane Jacobs!',
      'Our next meetup is under the rain trees in HSR park next Sunday.',
      'Would love to see you there if civic and urban design interests you!',
    ],
  },
  {
    id: 'neeraj-8',
    name: 'Neeraj Joshi',
    age: 31,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    ],
    distanceKm: 12.0,
    angleDeg: 355,
    mapCoords: { x: 74, y: 15 },
    neighborhood: 'Whitefield Main Rd',
    activeStatus: 'Active 5m ago',
    headline: 'Robotics engineer & weekend trail hiker',
    bio: 'Developing autonomous drone navigation. Weekend trail hiker, espresso tinkerer, and amateur astronomer with an 8-inch Dobsonian telescope.',
    occupation: 'Robotics Research Engineer',
    interests: ['Drones', 'Stargazing', 'Espresso Machines', 'Trail Hiking', '3D Printing'],
    hangoutSpot: 'Nandi Hills Trail or Windmills Craftworks',
    lookingFor: 'Anyone wanting to stargaze during dark sky weekend trips',
    languages: ['English', 'Hindi'],
    quickIcebreaker: 'Hey Neeraj! Do you take the telescope out to Nandi hills?',
    defaultResponses: [
      'Hey! Yes, usually drive towards the outskirts near Chikkaballapur to avoid city light pollution.',
      'Last month we caught Saturn’s rings crystal clear on a new moon night!',
      'Let me know if you ever want to join a star-party weekend drive.',
    ],
  },
];
