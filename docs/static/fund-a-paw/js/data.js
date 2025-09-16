// data.js — shared data for every page
window.FAP = window.FAP || {};

/**
 * Shelters (moved from index.html into a shared file)
 * NOTE: You can freely extend this; all pages will now see the same data.
 */
FAP.shelters = [
  {
    id: "aarfc",
    name: "Alberta Animal Rescue Foundation",
    image: "https://placehold.co/600x400/f6ad55/ffffff?text=AARF",
    bio: "The Alberta Animal Rescue Foundation (AARF) is a volunteer-led, registered non-profit dedicated to rescuing and rehoming dogs and cats across Alberta.",
    contactName: "Jane Doe",
    contactEmail: "info@aarf.ca",
    contactPhone: "(780) 123-4567",
    animals: [
      {
        id: "buddy",
        name: "Buddy",
        image: "./static/fund-a-paw/img/buddy.jpg",
        type: "dog",
        bio: "Gentle 2-year-old Labrador mix who needs surgery to fix a leg injury. Donations cover the operation and post-op care.",
        updates: [
          { date: "September 2, 2025", text: "Surgery successful. Resting comfortably and recovering well." },
          { date: "October 1, 2025", text: "Walking more each day. Starting physical therapy soon." }
        ]
      },
      {
        id: "squeakers",
        name: "Squeakers",
        image: "./static/fund-a-paw/img/squeakers.jpg",
        type: "small mammal",
        urgent: true,
        bio: "Playful guinea pig needing support for food and care while awaiting a new home.",
        // Example inside an animal object
        updates: [
          { date: '2025-09-01', title: 'Surgery scheduled', body: 'squeakers’ surgery is set for September 10.' },
          { date: '2025-09-12', title: 'Successful surgery', body: 'squeakers’ procedure went well and recovery has started.', image: './static/fund-a-paw/img/buddy-recovering.webp' }
        ]

      }
    ]
  },
  {
    id: "ehs",
    name: "Edmonton Humane Society",
    image: "https://placehold.co/600x400/63b3ed/ffffff?text=EHS",
    bio: "Leader in animal welfare, providing safe haven, medical care and adoptions.",
    contactName: "John Smith",
    contactEmail: "contact@edmontonhumanesociety.com",
    contactPhone: "(780) 987-6543",
    animals: [
      {
        id: "daisy",
        name: "Daisy",
        image: "./static/fund-a-paw/img/daisy.jpg",
        type: "cat",
        bio: "Sweet 1-year-old recovering from respiratory infection; needs medication and care.",
        updates: [
          { date: '2025-09-01', title: 'Surgery scheduled', body: 'Daisy’s surgery is set for November 13.' },
          { date: '2025-09-12', title: 'Awaiting surgery', body: 'Daisy’s surgery is set to take place soon, with a date yet to be decided.', image: './static/fund-a-paw/img/buddy-recovering.webp' }
        ]
      },
      {
        id: "penny",
        name: "Penny",
        image: "./static/fund-a-paw/img/penny.jpg",
        type: "bird",
        urgent: true,
        bio: "Parrot who needs a new home and immediate care.",
        updates: [
          { date: '2025-09-01', title: 'Surgery scheduled', body: 'Penny’s surgery is set for November 13.' },
          { date: '2025-09-12', title: 'Awaiting surgery', body: 'Penny’s surgery is set to take place soon, with a date yet to be decided.', image: './static/fund-a-paw/img/buddy-recovering.webp' }
        ]
      }
    ]
  },
  {
    id: "scars",
    name: "Second Chance Animal Rescue",
    image: "https://placehold.co/600x400/a0aec0/ffffff?text=SCARS",
    bio: "Non-profit charity saving lives with shelter, food, vet care and rehoming.",
    contactName: "Susan Parker",
    contactEmail: "susan@scars.ca",
    contactPhone: "(780) 555-1234",
    animals: [
      {
        id: "rocky",
        name: "Rocky",
        image: "https://placehold.co/600x400/a0aec0/ffffff?text=Rocky",
        type: "small mammal",
        bio: "Shy rabbit needing special diet and calm environment.",
        updates: [
          { date: '2025-09-01', title: 'Surgery scheduled', body: 'Rocky’s surgery is set for November 13.' },
          { date: '2025-09-12', title: 'Awaiting surgery', body: 'Rocky’s surgery is set to take place soon, with a date yet to be decided.', image: './static/fund-a-paw/img/buddy-recovering.webp' }
        ]
      },
      {
        id: "lexy",
        name: "Lexy",
        image: "https://placehold.co/600x400/a0aec0/ffffff?text=Lexy",
        type: "cat",
        bio: "Curious cat rescued from neglect; needs special diet and quiet space.",
        updates: [
          { date: '2025-09-01', title: 'Surgery scheduled', body: 'Lexy’s surgery is set for November 13.' },
          { date: '2025-09-12', title: 'Awaiting surgery', body: 'Lexy’s surgery is set to take place soon, with a date yet to be decided.', image: './static/fund-a-paw/img/buddy-recovering.webp' }
        ]
      }
    ]
  },
  // Added so you can see more items in partners/shelters grids
  {
    id: "calgaryspca",
    name: "Calgary SPCA",
    image: "https://placehold.co/600x400/8bc34a/ffffff?text=Calgary+SPCA",
    bio: "Serving Calgary-region animals with rescue, care, and adoption programs.",
    animals: []
  },
  {
    id: "cen-alberta",
    name: "Central Alberta Humane Society",
    image: "https://placehold.co/600x400/ff9800/ffffff?text=Red+Deer+HS",
    bio: "Supporting Red Deer area pets through sheltering and community services.",
    animals: []
  }
];

/** Urgent shelter needs (shared) */
FAP.shelterNeeds = [
  {
    id: "ehs-blankets",
    shelterId: "ehs",
    title: "Warm Blankets and Towels",
    image: "./static/fund-a-paw/img/blanket-dog.jpg",
    description: "Urgent need to keep animals warm, especially post-surgery."
  },
  {
    id: "scars-food",
    shelterId: "scars",
    title: "High-Quality Cat Food",
    image: "./static/fund-a-paw/img/cat-food.jpg",
    description: "Pantry running low; help purchase nutritious food."
  }
];

/** Derive partners list from shelters (name, image, bio) */
FAP.partners = FAP.shelters.map(s => ({ id: s.id, name: s.name, image: s.image, bio: s.bio }));

// data.js — extend existing shelters
window.FAP = window.FAP || {};
// Each shelter can have needs specific to the shelter (not a single animal):
// { id, title, summary, image, goal, raised, deadline, urgency(1-5), category }
FAP.shelters = (FAP.shelters || []).map(s => {
  if (s.id === 'aarf') {
    s.needs = s.needs || [
      {
        id: 'aarf-food-sept',
        title: 'High-protein food for intakes (Sept)',
        summary: '25 bags to cover two weeks of new intakes.',
        image: './static/fund-a-paw/img/needs/aarf-food.webp',
        goal: 1200, raised: 320,
        deadline: '2025-09-30',
        urgency: 4,
        category: 'Supplies'
      }
    ];
  }
  if (s.id === 'ehs') {
    s.needs = s.needs || [
      {
        id: 'ehs-med-fund',
        title: 'Emergency medical fund top-up',
        summary: 'Covers x-rays and antibiotics for urgent cases.',
        image: './static/fund-a-paw/img/needs/ehs-med.webp',
        goal: 3000, raised: 1750,
        deadline: '2025-09-25',
        urgency: 5,
        category: 'Medical'
      }
    ];
  }
  return s;
});

// (Optional) News items, so your News block isn’t empty:
FAP.news = [
  { title: 'Fund-a-Paw pilot live in Alberta', date: '2025-09-01', body: 'Direct, transparent donations to current needs.' },
  { title: 'First partners onboarded', date: '2025-09-05', body: 'AARF, EHS and more are posting needs this week.' },
  { title: 'Email updates & receipts', date: '2025-09-10', body: 'Donate in two clicks, receive progress updates automatically.' }
];

