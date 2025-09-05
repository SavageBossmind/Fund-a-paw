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
        image: "https://placehold.co/600x400/f6ad55/ffffff?text=Buddy",
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
        image: "https://placehold.co/600x400/a0aec0/ffffff?text=Squeakers",
        type: "small mammal",
        urgent: true,
        bio: "Playful guinea pig needing support for food and care while awaiting a new home.",
        updates: []
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
        image: "https://placehold.co/600x400/63b3ed/ffffff?text=Daisy",
        type: "cat",
        bio: "Sweet 1-year-old recovering from respiratory infection; needs medication and care.",
        updates: []
      },
      {
        id: "penny",
        name: "Penny",
        image: "https://placehold.co/600x400/a0aec0/ffffff?text=Penny",
        type: "bird",
        urgent: true,
        bio: "Parrot who needs a new home and immediate care.",
        updates: []
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
        updates: []
      },
      {
        id: "lexy",
        name: "Lexy",
        image: "https://placehold.co/600x400/a0aec0/ffffff?text=Lexy",
        type: "cat",
        bio: "Curious cat rescued from neglect; needs special diet and quiet space.",
        updates: []
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
    id: "reddeerhumane",
    name: "Red Deer Humane Society",
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
    image: "https://placehold.co/600x400/ffe4e6/a0aec0?text=Blankets",
    description: "Urgent need to keep animals warm, especially post-surgery."
  },
  {
    id: "scars-food",
    shelterId: "scars",
    title: "High-Quality Cat Food",
    image: "https://placehold.co/600x400/90cdf4/4a5568?text=Cat+Food",
    description: "Pantry running low; help purchase nutritious food."
  }
];

/** Derive partners list from shelters (name, image, bio) */
FAP.partners = FAP.shelters.map(s => ({ id: s.id, name: s.name, image: s.image, bio: s.bio }));
