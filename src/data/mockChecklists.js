export const defaultChecklistCategories = [
  {
    id: 'cat-before',
    name: 'Before Travel',
    description: 'Essential bookings, insurance, and pre-departure verifications',
    icon: 'CalendarCheck',
    items: [
      { id: 'chk-1', text: 'Valid Passport (at least 6 months validity)', completed: true, essential: true },
      { id: 'chk-2', text: 'Visa approval / e-Visa printout', completed: true, essential: true },
      { id: 'chk-3', text: 'Flight / Train confirmed tickets downloaded', completed: true, essential: true },
      { id: 'chk-4', text: 'Hotel / Resort check-in vouchers saved offline', completed: true, essential: true },
      { id: 'chk-5', text: 'Travel health & luggage insurance policy', completed: false, essential: false },
      { id: 'chk-6', text: 'Home safety: turn off gas valves & lock windows', completed: false, essential: false },
    ]
  },
  {
    id: 'cat-docs',
    name: 'Documents & IDs',
    description: 'Hard copies, digital backups, and emergency contacts',
    icon: 'FileText',
    items: [
      { id: 'chk-7', text: 'Government Photo ID / Driver License', completed: true, essential: true },
      { id: 'chk-8', text: 'Photocopies of passport & emergency contacts in separate bag', completed: false, essential: true },
      { id: 'chk-9', text: 'International Driving Permit (IDP) if self-driving', completed: false, essential: false },
      { id: 'chk-10', text: 'Credit card travel notifications activated with bank', completed: true, essential: true },
    ]
  },
  {
    id: 'cat-prep',
    name: 'Preparation & Tech',
    description: 'Connectivity, currency, medicines, and adapters',
    icon: 'Zap',
    items: [
      { id: 'chk-11', text: 'Foreign currency cash / Forex card loaded', completed: true, essential: true },
      { id: 'chk-12', text: 'eSIM QR code downloaded or local SIM planned', completed: false, essential: true },
      { id: 'chk-13', text: 'Personal prescription medicines & first-aid kit', completed: true, essential: true },
      { id: 'chk-14', text: 'Universal travel power adapter & power bank (20000mAh)', completed: false, essential: true },
      { id: 'chk-15', text: 'Offline Google Maps / City guides downloaded on phone', completed: true, essential: false },
    ]
  }
];

export const defaultPackingCategories = [
  {
    id: 'pack-clothing',
    name: 'Clothing & Wear',
    items: [
      { id: 'p-1', name: 'Lightweight cotton shirts / t-shirts (5)', packed: true, category: 'Clothing' },
      { id: 'p-2', name: 'Comfortable travel pants / jeans (2)', packed: true, category: 'Clothing' },
      { id: 'p-3', name: 'Light jacket / Windbreaker layer', packed: false, category: 'Clothing' },
      { id: 'p-4', name: 'Comfortable walking sneakers / shoes', packed: true, category: 'Clothing' },
      { id: 'p-5', name: 'Undergarments & quick-dry socks (6)', packed: true, category: 'Clothing' },
      { id: 'p-6', name: 'Nightwear / Pajamas', packed: false, category: 'Clothing' },
    ]
  },
  {
    id: 'pack-electronics',
    name: 'Electronics & Gadgets',
    items: [
      { id: 'p-7', name: 'Smartphone & fast charging cable', packed: true, category: 'Electronics' },
      { id: 'p-8', name: 'High capacity power bank (flight allowed)', packed: true, category: 'Electronics' },
      { id: 'p-9', name: 'Universal plug adapter', packed: false, category: 'Electronics' },
      { id: 'p-10', name: 'Noise-canceling headphones / Earbuds', packed: true, category: 'Electronics' },
      { id: 'p-11', name: 'Camera, memory cards & battery charger', packed: false, category: 'Electronics' },
    ]
  },
  {
    id: 'pack-toiletries',
    name: 'Toiletries & Care',
    items: [
      { id: 'p-12', name: 'Toothbrush & travel toothpaste', packed: true, category: 'Toiletries' },
      { id: 'p-13', name: 'High-SPF Sunscreen (SPF 50+)', packed: true, category: 'Toiletries' },
      { id: 'p-14', name: 'Moisturizer & lip balm', packed: false, category: 'Toiletries' },
      { id: 'p-15', name: 'Hand sanitizer & disinfectant wet wipes', packed: true, category: 'Toiletries' },
      { id: 'p-16', name: 'Deodorant / Fragrance travel spray', packed: false, category: 'Toiletries' },
    ]
  },
  {
    id: 'pack-docs',
    name: 'Documents & Valuables',
    items: [
      { id: 'p-17', name: 'Passport & boarding passes in pouch', packed: true, category: 'Documents' },
      { id: 'p-18', name: 'Wallet with credit cards & local cash', packed: true, category: 'Documents' },
      { id: 'p-19', name: 'Luggage name tags with contact info', packed: true, category: 'Documents' },
    ]
  }
];
