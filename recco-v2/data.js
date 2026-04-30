// Recco — sample data + scoring logic
// Four real Toronto restaurants (Ossington / Trinity-Bellwoods strip):
//   • Lunch Lady    — Vietnamese, 93 Ossington Ave
//   • Bonito's      — Korean-Ecuadorian fusion, 180 Ossington Ave
//   • TONO          — modern izakaya / Japanese (placeholder block)
//   • General Public — gastropub, Geary Ave (Jen Agg)
// Menus are paraphrased from public sources; treat as a fidelity demo.

const DIETS = [
  { id: 'balanced',     label: 'Balanced',     hint: 'A bit of everything' },
  { id: 'vegetarian',   label: 'Vegetarian',   hint: 'No meat or fish' },
  { id: 'vegan',        label: 'Vegan',        hint: 'No animal products' },
  { id: 'pescatarian',  label: 'Pescatarian',  hint: 'Fish, no meat' },
  { id: 'keto',         label: 'Keto',         hint: 'Low carb, high fat' },
  { id: 'high-protein', label: 'High Protein', hint: 'Strength + recovery' },
];

const ALLERGENS = [
  { id: 'nuts',      label: 'Tree nuts' },
  { id: 'peanut',    label: 'Peanut' },
  { id: 'dairy',     label: 'Dairy' },
  { id: 'gluten',    label: 'Gluten' },
  { id: 'shellfish', label: 'Shellfish' },
  { id: 'fish',      label: 'Fish' },
  { id: 'eggs',      label: 'Eggs' },
  { id: 'soy',       label: 'Soy' },
  { id: 'sesame',    label: 'Sesame' },
];

// ──────────────────────────────────────────────────────────────
//   Restaurant 1 · LUNCH LADY (Vietnamese, 93 Ossington)
//   Menu paraphrased from thelunchlady.com/dinner-toronto + reviews
// ──────────────────────────────────────────────────────────────
const LUNCHLADY_DISHES = [
  {
    id: 'll1', name: 'Phở Bò',
    section: 'Soups', price: '$22',
    blurb: 'Brisket, short plate, rare beef shoulder, rice noodles, 24-hour beef broth.',
    ingredients: ['Beef brisket', 'Rare beef shoulder', 'Short plate', 'Rice noodles', '24-hour beef broth', 'Thai basil', 'Lime', 'Bean sprouts'],
    tags: ['gluten-free', 'high-protein', 'dairy-free'],
    diet: ['balanced', 'pescatarian', 'high-protein'],
    allergens: [],
    macros: { cal: 540, p: 42, c: 58, f: 12 },
    color: '#7A3826',
  },
  {
    id: 'll2', name: 'Wagyu Beef Phở',
    section: 'Soups', price: '$36',
    blurb: 'Rare wagyu zabuton, beef cheek, oxtail, bone marrow, slow-poached egg, rice noodles.',
    ingredients: ['Wagyu zabuton', 'Beef cheek', 'Oxtail', 'Bone marrow', 'Slow-poached egg', 'Rice noodles', '24-hour beef broth', 'Thai basil', 'Lime'],
    tags: ['gluten-free', 'high-protein', 'signature'],
    diet: ['balanced', 'high-protein', 'keto'],
    allergens: ['eggs'],
    macros: { cal: 820, p: 58, c: 48, f: 42 },
    color: '#5A1F18',
  },
  {
    id: 'll3', name: 'Vegan Phở',
    section: 'Soups', price: '$20',
    blurb: 'Mushroom-kombu broth, tofu, rice noodles, herbs.',
    ingredients: ['Shiitake', 'Kombu', 'Tofu (soy)', 'Rice noodles', 'Thai basil', 'Lime', 'Bean sprouts'],
    tags: ['vegan', 'vegetarian', 'gluten-free', 'dairy-free'],
    diet: ['balanced', 'vegetarian', 'vegan', 'pescatarian'],
    allergens: ['soy'],
    macros: { cal: 380, p: 18, c: 56, f: 8 },
    color: '#5A7A4A',
  },
  {
    id: 'll4', name: 'Bò Tái Chanh — Beef Carpaccio',
    section: 'Starters', price: '$24',
    blurb: 'Filet of beef, peanuts, crispy shallots, Thai basil, mint, perilla, lime vinaigrette.',
    ingredients: ['Filet of beef', 'Peanuts', 'Crispy shallots', 'Thai basil', 'Mint', 'Perilla', 'Lime vinaigrette', 'Fish sauce'],
    tags: ['gluten-free', 'high-protein'],
    diet: ['balanced', 'keto', 'high-protein'],
    allergens: ['peanut', 'fish'],
    macros: { cal: 320, p: 28, c: 8, f: 20 },
    color: '#A0392E',
  },
  {
    id: 'll5', name: 'Bạch Tuộc Nướng — Octopus Skewers',
    section: 'Starters', price: '$18',
    blurb: 'Char-grilled octopus, lemongrass-chili sate, Vietnamese coriander, green chili sauce.',
    ingredients: ['Octopus', 'Lemongrass', 'Chili sate', 'Vietnamese coriander', 'Green chili sauce'],
    tags: ['gluten-free', 'pescatarian', 'high-protein'],
    diet: ['balanced', 'pescatarian', 'keto', 'high-protein'],
    allergens: ['shellfish'],
    macros: { cal: 240, p: 28, c: 6, f: 11 },
    color: '#6A4A2A',
  },
  {
    id: 'll6', name: 'Đậu Hũ Chiên — Fried Tofu',
    section: 'Starters', price: '$16',
    blurb: 'Crispy tofu, lemongrass garlic glaze.',
    ingredients: ['Tofu (soy)', 'Lemongrass', 'Garlic', 'Soy glaze'],
    tags: ['vegetarian', 'vegan'],
    diet: ['balanced', 'vegetarian', 'vegan', 'pescatarian'],
    allergens: ['soy', 'gluten'],
    macros: { cal: 280, p: 14, c: 22, f: 16 },
    color: '#C49858',
  },
  {
    id: 'll7', name: 'Mì Xào Tỏi — Garlic Noodles',
    section: 'Mains', price: '$24',
    blurb: 'Egg noodles, XO garlic butter, parmigiano, slow-poached egg.',
    ingredients: ['Egg noodles (wheat, egg)', 'XO sauce (shellfish)', 'Garlic butter (dairy)', 'Parmigiano (dairy)', 'Slow-poached egg'],
    tags: ['signature', 'vegetarian'],
    diet: ['balanced', 'vegetarian'],
    allergens: ['gluten', 'dairy', 'eggs', 'shellfish'],
    macros: { cal: 720, p: 24, c: 78, f: 32 },
    color: '#D9B864',
  },
  {
    id: 'll8', name: 'Bò Lúc Lắc — Steak Lúc Lắc',
    section: 'Mains', price: '$52',
    blurb: '8oz ribeye, peppercorn sauce, crispy cassava, burnt scallion butter.',
    ingredients: ['Ribeye (beef)', 'Peppercorn sauce', 'Cassava', 'Scallion butter (dairy)', 'Watercress'],
    tags: ['gluten-free', 'high-protein', 'signature'],
    diet: ['balanced', 'keto', 'high-protein'],
    allergens: ['dairy'],
    macros: { cal: 740, p: 56, c: 24, f: 44 },
    color: '#7A3826',
  },
  {
    id: 'll9', name: 'Tôm Chiên Giòn — Crispy Prawns',
    section: 'Starters', price: '$24',
    blurb: 'Whole-shell fried prawns, tangy chili-lime dipping sauce.',
    ingredients: ['Prawns', 'Rice flour', 'Chili-lime sauce', 'Fish sauce'],
    tags: ['pescatarian', 'gluten-free'],
    diet: ['balanced', 'pescatarian', 'keto', 'high-protein'],
    allergens: ['shellfish', 'fish'],
    macros: { cal: 380, p: 32, c: 14, f: 22 },
    color: '#E07550',
  },
  {
    id: 'll10', name: 'Chè Ba Màu — Three-Layer Dessert',
    section: 'Desserts', price: '$14',
    blurb: 'Pandan mochi cake, coconut condensed milk gelato, red bean & strawberry purée, mung bean streusel.',
    ingredients: ['Pandan mochi (rice, dairy)', 'Coconut gelato (dairy)', 'Red bean', 'Strawberry purée', 'Mung bean streusel (gluten)'],
    tags: ['vegetarian', 'signature'],
    diet: ['balanced', 'vegetarian'],
    allergens: ['dairy', 'gluten'],
    macros: { cal: 380, p: 5, c: 58, f: 14 },
    color: '#7A8A4A',
  },
  {
    id: 'll11', name: 'Cà Phê Negroni',
    section: 'Cocktails', price: '$17',
    blurb: 'Vietnamese coffee Negroni — espresso, gin, Campari, sweet vermouth.',
    ingredients: ['Vietnamese espresso', 'Gin', 'Campari', 'Sweet vermouth'],
    tags: ['gluten-free'],
    diet: ['balanced', 'vegetarian', 'vegan', 'pescatarian'],
    allergens: [],
    macros: { cal: 220, p: 0, c: 12, f: 0 },
    color: '#3A1A1A',
  },
];

// ──────────────────────────────────────────────────────────────
//   Restaurant 2 · BONITO'S (Korean-Ecuadorian, 180 Ossington)
//   Menu paraphrased from Toronto Life & ViewTheVibe coverage
// ──────────────────────────────────────────────────────────────
const BONITOS_DISHES = [
  {
    id: 'bn1', name: 'Llapingacho Taiyaki',
    section: 'Snacks', price: '$9',
    blurb: 'Fish-shaped taiyaki cakes stuffed with achiote-spiced potato & mozzarella.',
    ingredients: ['Achiote potato', 'Mozzarella (dairy)', 'Wheat flour', 'Egg'],
    tags: ['vegetarian', 'signature'],
    diet: ['balanced', 'vegetarian'],
    allergens: ['gluten', 'dairy', 'eggs'],
    macros: { cal: 320, p: 12, c: 38, f: 14 },
    color: '#D9A050',
  },
  {
    id: 'bn2', name: 'Stuffed Wings',
    section: 'Snacks', price: '$18',
    blurb: 'Chicken wings stuffed with shiitake, carrot & mirin-braised chicken, gochujang-garlic glaze, yuzu ranch.',
    ingredients: ['Chicken wings', 'Shiitake', 'Carrot', 'Mirin', 'Gochujang (soy)', 'Garlic', 'Yuzu ranch (dairy, eggs)'],
    tags: ['signature', 'high-protein'],
    diet: ['balanced', 'keto', 'high-protein'],
    allergens: ['soy', 'dairy', 'eggs', 'gluten'],
    macros: { cal: 540, p: 38, c: 22, f: 32 },
    color: '#B83A2C',
  },
  {
    id: 'bn3', name: 'Scallop Aguachile w/ Jellyfish',
    section: 'Snacks', price: '$19',
    blurb: 'Citrusy aguachile of raw scallop with vinegar-marinated jellyfish, plantain chips.',
    ingredients: ['Bay scallops', 'Lime', 'Serrano chili', 'Cilantro', 'Vinegar-marinated jellyfish', 'Plantain chips'],
    tags: ['gluten-free', 'pescatarian', 'signature'],
    diet: ['balanced', 'pescatarian', 'keto', 'high-protein'],
    allergens: ['shellfish'],
    macros: { cal: 220, p: 22, c: 18, f: 8 },
    color: '#5A7A6F',
  },
  {
    id: 'bn4', name: 'Tteokbokki de Choclo',
    section: 'Mains', price: '$22',
    blurb: 'Korean rice cakes folded with Ecuadorian sweet corn, gochujang cream.',
    ingredients: ['Tteok rice cakes', 'Sweet corn (choclo)', 'Gochujang (soy, gluten)', 'Cream (dairy)', 'Sesame'],
    tags: ['vegetarian', 'signature'],
    diet: ['balanced', 'vegetarian'],
    allergens: ['soy', 'gluten', 'dairy', 'sesame'],
    macros: { cal: 480, p: 12, c: 72, f: 16 },
    color: '#C84A2A',
  },
  {
    id: 'bn5', name: 'Korean Fried Chicken Sando',
    section: 'Mains', price: '$18',
    blurb: 'Thicc fried chicken thigh, gochujang honey-butter glaze, citrusy slaw, milk bun.',
    ingredients: ['Chicken thigh', 'Milk bun (gluten, dairy, egg)', 'Gochujang honey-butter (soy, dairy)', 'Slaw (eggs)', 'Sesame'],
    tags: ['signature', 'high-protein'],
    diet: ['balanced', 'high-protein'],
    allergens: ['gluten', 'dairy', 'eggs', 'soy', 'sesame'],
    macros: { cal: 720, p: 38, c: 58, f: 36 },
    color: '#7A3826',
  },
  {
    id: 'bn6', name: 'Fried Sea Bass',
    section: 'Mains', price: '$32',
    blurb: 'Whole crispy sea bass dusted in a doritos-esque spice blend, lime.',
    ingredients: ['Sea bass', 'Achiote spice blend', 'Cornstarch', 'Lime', 'Cilantro'],
    tags: ['gluten-free', 'pescatarian', 'high-protein'],
    diet: ['balanced', 'pescatarian', 'keto', 'high-protein'],
    allergens: ['fish'],
    macros: { cal: 480, p: 48, c: 14, f: 24 },
    color: '#7A8A6F',
  },
  {
    id: 'bn7', name: 'Charred Maitake',
    section: 'Mains', price: '$24',
    blurb: 'Maitake mushroom, soy-butter, scallion, sesame, ssamjang.',
    ingredients: ['Maitake', 'Soy butter (soy, dairy)', 'Scallion', 'Sesame', 'Ssamjang (soy)'],
    tags: ['vegetarian'],
    diet: ['balanced', 'vegetarian'],
    allergens: ['soy', 'dairy', 'sesame'],
    macros: { cal: 280, p: 10, c: 18, f: 18 },
    color: '#5A4A3A',
  },
  {
    id: 'bn8', name: 'Yuca Fries w/ Ají Verde',
    section: 'Sides', price: '$8',
    blurb: 'Crispy yuca, bright Ecuadorian ají verde dipping sauce.',
    ingredients: ['Yuca', 'Ají verde (cilantro, jalapeño, dairy)', 'Salt'],
    tags: ['vegetarian', 'gluten-free'],
    diet: ['balanced', 'vegetarian'],
    allergens: ['dairy'],
    macros: { cal: 320, p: 4, c: 48, f: 12 },
    color: '#C49858',
  },
  {
    id: 'bn9', name: 'Pupusa de Queso',
    section: 'Snacks', price: '$10',
    blurb: 'Stuffed cheese pupusa, curtido slaw, tomato salsa.',
    ingredients: ['Masa (corn)', 'Mozzarella (dairy)', 'Curtido (cabbage)', 'Tomato salsa'],
    tags: ['vegetarian', 'gluten-free'],
    diet: ['balanced', 'vegetarian'],
    allergens: ['dairy'],
    macros: { cal: 360, p: 14, c: 42, f: 14 },
    color: '#E8C070',
  },
  {
    id: 'bn10', name: 'Flan Chino',
    section: 'Desserts', price: '$11',
    blurb: 'Five-spice caramel flan — childhood throwback, served cold.',
    ingredients: ['Eggs', 'Cream (dairy)', 'Condensed milk (dairy)', 'Caramel', 'Five-spice'],
    tags: ['vegetarian', 'gluten-free', 'signature'],
    diet: ['balanced', 'vegetarian'],
    allergens: ['eggs', 'dairy'],
    macros: { cal: 320, p: 8, c: 42, f: 14 },
    color: '#A07840',
  },
  {
    id: 'bn11', name: 'Uncle Mikey\u2019s Highball',
    section: 'Cocktails', price: '$14',
    blurb: 'Apple-mango soju, shiso tea syrup, Topo Chico, perilla leaf.',
    ingredients: ['Soju', 'Apple-mango', 'Shiso tea syrup', 'Topo Chico', 'Perilla'],
    tags: ['gluten-free'],
    diet: ['balanced', 'vegetarian', 'vegan', 'pescatarian'],
    allergens: [],
    macros: { cal: 160, p: 0, c: 14, f: 0 },
    color: '#3A6A8A',
  },
];

// ──────────────────────────────────────────────────────────────
//   Restaurant 3 · TONO (Modern izakaya, Toronto)
//   Menu is a credible composite — TONO-style wood-fired izakaya
// ──────────────────────────────────────────────────────────────
const TONO_DISHES = [
  {
    id: 'to1', name: 'Hamachi Crudo',
    section: 'Cold', price: '$24',
    blurb: 'Yellowtail sashimi, ponzu jelly, yuzu kosho, micro shiso.',
    ingredients: ['Yellowtail (fish)', 'Ponzu (soy)', 'Yuzu', 'Shiso'],
    tags: ['gluten-free', 'pescatarian', 'high-protein', 'signature'],
    diet: ['balanced', 'pescatarian', 'keto', 'high-protein'],
    allergens: ['fish', 'soy'],
    macros: { cal: 220, p: 28, c: 4, f: 11 },
    color: '#E8A89A',
  },
  {
    id: 'to2', name: 'Otoro Sashimi (3pc)',
    section: 'Cold', price: '$32',
    blurb: 'Hand-cut bluefin belly, sea salt, fresh wasabi.',
    ingredients: ['Bluefin tuna belly (fish)', 'Sea salt', 'Wasabi'],
    tags: ['gluten-free', 'pescatarian', 'high-protein', 'signature'],
    diet: ['balanced', 'pescatarian', 'keto', 'high-protein'],
    allergens: ['fish'],
    macros: { cal: 260, p: 22, c: 0, f: 20 },
    color: '#C8554A',
  },
  {
    id: 'to3', name: 'Wagyu Beef Tataki',
    section: 'Cold', price: '$28',
    blurb: 'Lightly seared A5 wagyu, ginger-soy ponzu, crispy garlic chip.',
    ingredients: ['A5 wagyu', 'Ginger', 'Ponzu (soy, fish)', 'Garlic chip', 'Scallion'],
    tags: ['gluten-free', 'high-protein'],
    diet: ['balanced', 'keto', 'high-protein'],
    allergens: ['soy', 'fish'],
    macros: { cal: 320, p: 24, c: 6, f: 22 },
    color: '#7A3826',
  },
  {
    id: 'to4', name: 'Robata Maitake',
    section: 'Robata', price: '$18',
    blurb: 'Wood-fired maitake mushroom, white miso butter, sansho pepper.',
    ingredients: ['Maitake', 'White miso (soy)', 'Butter (dairy)', 'Sansho pepper'],
    tags: ['vegetarian'],
    diet: ['balanced', 'vegetarian'],
    allergens: ['soy', 'dairy'],
    macros: { cal: 240, p: 8, c: 18, f: 16 },
    color: '#5A4A3A',
  },
  {
    id: 'to5', name: 'Robata Tsukune',
    section: 'Robata', price: '$14',
    blurb: 'Chicken-thigh meatball skewer, tare glaze, runny egg yolk.',
    ingredients: ['Chicken thigh', 'Tare (soy, gluten)', 'Egg yolk', 'Scallion'],
    tags: ['signature', 'high-protein'],
    diet: ['balanced', 'keto', 'high-protein'],
    allergens: ['soy', 'gluten', 'eggs'],
    macros: { cal: 320, p: 28, c: 12, f: 18 },
    color: '#A0392E',
  },
  {
    id: 'to6', name: 'Kingfish Karaage',
    section: 'Hot', price: '$22',
    blurb: 'Crispy fried kingfish collar, lemon, kewpie aioli.',
    ingredients: ['Kingfish (fish)', 'Potato starch', 'Kewpie (eggs)', 'Lemon'],
    tags: ['pescatarian', 'high-protein'],
    diet: ['balanced', 'pescatarian', 'high-protein'],
    allergens: ['fish', 'eggs'],
    macros: { cal: 460, p: 36, c: 18, f: 26 },
    color: '#D9B864',
  },
  {
    id: 'to7', name: 'Uni Carbonara Udon',
    section: 'Hot', price: '$32',
    blurb: 'Hand-cut udon, sea urchin cream, cured egg yolk, nori.',
    ingredients: ['Udon (gluten)', 'Uni (shellfish)', 'Cream (dairy)', 'Cured egg yolk', 'Nori'],
    tags: ['signature', 'pescatarian'],
    diet: ['balanced', 'pescatarian'],
    allergens: ['gluten', 'shellfish', 'dairy', 'eggs'],
    macros: { cal: 720, p: 28, c: 78, f: 32 },
    color: '#E0A050',
  },
  {
    id: 'to8', name: 'A5 Wagyu Don',
    section: 'Hot', price: '$58',
    blurb: 'Seared A5 wagyu over koshihikari rice, onsen egg, fresh wasabi.',
    ingredients: ['A5 wagyu', 'Koshihikari rice', 'Onsen egg', 'Wasabi', 'Tare (soy, gluten)'],
    tags: ['signature', 'high-protein'],
    diet: ['balanced', 'high-protein'],
    allergens: ['soy', 'gluten', 'eggs'],
    macros: { cal: 820, p: 48, c: 62, f: 42 },
    color: '#6A1F18',
  },
  {
    id: 'to9', name: 'Agedashi Tofu',
    section: 'Hot', price: '$14',
    blurb: 'Lightly fried silken tofu, dashi-soy broth, bonito, scallion.',
    ingredients: ['Silken tofu (soy)', 'Dashi (fish)', 'Soy', 'Bonito (fish)', 'Scallion'],
    tags: ['vegetarian', 'pescatarian'],
    diet: ['balanced', 'vegetarian', 'pescatarian'],
    allergens: ['soy', 'fish'],
    macros: { cal: 220, p: 12, c: 16, f: 12 },
    color: '#C49858',
  },
  {
    id: 'to10', name: 'Black Sesame Soft Serve',
    section: 'Desserts', price: '$12',
    blurb: 'House-churned black sesame soft serve, kinako, brown sugar shoyu.',
    ingredients: ['Black sesame (sesame)', 'Cream (dairy)', 'Kinako (soy)', 'Brown sugar', 'Shoyu (soy, gluten)'],
    tags: ['vegetarian', 'signature'],
    diet: ['balanced', 'vegetarian'],
    allergens: ['sesame', 'dairy', 'soy', 'gluten'],
    macros: { cal: 320, p: 6, c: 38, f: 16 },
    color: '#2A1810',
  },
];

// ──────────────────────────────────────────────────────────────
//   Restaurant 4 · GENERAL PUBLIC (Gastropub, Geary Ave, Jen Agg)
//   Menu is a credible composite of an elegant pub
// ──────────────────────────────────────────────────────────────
const GENERAL_PUBLIC_DISHES = [
  {
    id: 'gp1', name: 'Steak Frites',
    section: 'Mains', price: '$36',
    blurb: '8oz hanger steak, beef-fat fries, peppercorn jus, watercress.',
    ingredients: ['Hanger steak', 'Beef-fat fries (potato)', 'Peppercorn jus (dairy)', 'Watercress'],
    tags: ['signature', 'high-protein'],
    diet: ['balanced', 'keto', 'high-protein'],
    allergens: ['dairy'],
    macros: { cal: 720, p: 52, c: 48, f: 38 },
    color: '#7A3826',
  },
  {
    id: 'gp2', name: 'Smashburger',
    section: 'Mains', price: '$22',
    blurb: 'Two beef patties, american, pickles, comeback sauce, sesame brioche.',
    ingredients: ['Beef patties', 'American cheese (dairy)', 'Pickles', 'Comeback sauce (eggs)', 'Sesame brioche (gluten, eggs, sesame)'],
    tags: ['signature'],
    diet: ['balanced', 'high-protein'],
    allergens: ['dairy', 'eggs', 'gluten', 'sesame'],
    macros: { cal: 820, p: 42, c: 48, f: 48 },
    color: '#A0392E',
  },
  {
    id: 'gp3', name: 'Roast Chicken (½)',
    section: 'Mains', price: '$32',
    blurb: 'Half roast chicken, bread sauce, gravy, watercress, fries.',
    ingredients: ['Chicken', 'Bread sauce (dairy, gluten)', 'Gravy (dairy)', 'Watercress', 'Fries'],
    tags: ['high-protein'],
    diet: ['balanced', 'high-protein'],
    allergens: ['dairy', 'gluten'],
    macros: { cal: 680, p: 58, c: 38, f: 30 },
    color: '#C49858',
  },
  {
    id: 'gp4', name: 'Beet & Goat Cheese Salad',
    section: 'Salads', price: '$18',
    blurb: 'Roast beets, whipped goat cheese, walnut, sherry vinaigrette, dill.',
    ingredients: ['Roast beets', 'Goat cheese (dairy)', 'Walnut (nuts)', 'Sherry vinaigrette', 'Dill'],
    tags: ['vegetarian', 'gluten-free'],
    diet: ['balanced', 'vegetarian'],
    allergens: ['dairy', 'nuts'],
    macros: { cal: 380, p: 12, c: 24, f: 26 },
    color: '#7A2A4A',
  },
  {
    id: 'gp5', name: 'Little Gem Caesar',
    section: 'Salads', price: '$16',
    blurb: 'Little gem, white anchovy, parmigiano, sourdough crouton.',
    ingredients: ['Little gem lettuce', 'White anchovy (fish)', 'Parmigiano (dairy)', 'Sourdough crouton (gluten)', 'Caesar dressing (eggs, dairy)'],
    tags: [],
    diet: ['balanced'],
    allergens: ['fish', 'dairy', 'gluten', 'eggs'],
    macros: { cal: 380, p: 14, c: 22, f: 26 },
    color: '#5A7A4A',
  },
  {
    id: 'gp6', name: 'Scotch Egg',
    section: 'Snacks', price: '$12',
    blurb: 'Sausage-wrapped soft egg, breadcrumb, mustard.',
    ingredients: ['Pork sausage', 'Soft egg', 'Breadcrumb (gluten)', 'Mustard'],
    tags: ['signature', 'high-protein'],
    diet: ['balanced', 'high-protein'],
    allergens: ['eggs', 'gluten'],
    macros: { cal: 380, p: 22, c: 18, f: 24 },
    color: '#D9B864',
  },
  {
    id: 'gp7', name: 'Pickled Mussels',
    section: 'Snacks', price: '$14',
    blurb: 'House-pickled mussels, sourdough toast, cultured butter.',
    ingredients: ['Mussels (shellfish)', 'White wine pickle', 'Sourdough (gluten)', 'Cultured butter (dairy)'],
    tags: ['pescatarian'],
    diet: ['balanced', 'pescatarian'],
    allergens: ['shellfish', 'gluten', 'dairy'],
    macros: { cal: 320, p: 22, c: 22, f: 16 },
    color: '#3A4A6A',
  },
  {
    id: 'gp8', name: 'Mushroom Tart',
    section: 'Mains', price: '$24',
    blurb: 'All-butter puff, wild mushrooms, taleggio, thyme, runny egg.',
    ingredients: ['Puff pastry (gluten, dairy)', 'Wild mushrooms', 'Taleggio (dairy)', 'Thyme', 'Egg'],
    tags: ['vegetarian', 'signature'],
    diet: ['balanced', 'vegetarian'],
    allergens: ['gluten', 'dairy', 'eggs'],
    macros: { cal: 580, p: 18, c: 42, f: 36 },
    color: '#7A6A4A',
  },
  {
    id: 'gp9', name: 'Fish & Chips',
    section: 'Mains', price: '$26',
    blurb: 'Beer-battered haddock, mushy peas, malt vinegar, beef-fat fries.',
    ingredients: ['Haddock (fish)', 'Beer batter (gluten)', 'Mushy peas', 'Malt vinegar (gluten)', 'Beef-fat fries'],
    tags: ['pescatarian'],
    diet: ['balanced', 'pescatarian'],
    allergens: ['fish', 'gluten'],
    macros: { cal: 820, p: 38, c: 78, f: 38 },
    color: '#E0A050',
  },
  {
    id: 'gp10', name: 'Sticky Toffee Pudding',
    section: 'Desserts', price: '$13',
    blurb: 'Date sponge, toffee sauce, double cream, sea salt.',
    ingredients: ['Date sponge (gluten, eggs, dairy)', 'Toffee sauce (dairy)', 'Double cream (dairy)', 'Sea salt'],
    tags: ['vegetarian', 'signature'],
    diet: ['balanced', 'vegetarian'],
    allergens: ['gluten', 'eggs', 'dairy'],
    macros: { cal: 540, p: 8, c: 72, f: 28 },
    color: '#5A2818',
  },
  {
    id: 'gp11', name: 'Negroni Sbagliato',
    section: 'Cocktails', price: '$15',
    blurb: 'Campari, sweet vermouth, prosecco, orange peel.',
    ingredients: ['Campari', 'Sweet vermouth', 'Prosecco', 'Orange peel'],
    tags: [],
    diet: ['balanced', 'vegetarian', 'vegan', 'pescatarian'],
    allergens: [],
    macros: { cal: 160, p: 0, c: 12, f: 0 },
    color: '#C8554A',
  },
];

// ──────────────────────────────────────────────────────────────
//   Restaurant registry
// ──────────────────────────────────────────────────────────────
const RESTAURANTS = {
  lunchlady: {
    id: 'lunchlady',
    name: 'Lunch Lady',
    type: 'Vietnamese',
    neighborhood: '93 Ossington Ave',
    blurb: 'Bourdain-blessed Vietnamese, Trinity-Bellwoods.',
    accent: '#5A1F18',
    menuStyle: 'serif-vietnamese',
    dishes: LUNCHLADY_DISHES,
  },
  bonitos: {
    id: 'bonitos',
    name: "Bonito's",
    type: 'Korean-Ecuadorian',
    neighborhood: '180 Ossington Ave',
    blurb: 'Late-night Korean-Ecuadorian diner above Bar Bowie.',
    accent: '#B83A2C',
    menuStyle: 'retro-diner',
    dishes: BONITOS_DISHES,
  },
  tono: {
    id: 'tono',
    name: 'TONO',
    type: 'Modern Izakaya',
    neighborhood: 'Ossington',
    blurb: 'Wood-fired robata + sashimi from a tight, ingredient-forward menu.',
    accent: '#1A1A2A',
    menuStyle: 'minimalist-jp',
    dishes: TONO_DISHES,
  },
  general_public: {
    id: 'general_public',
    name: 'General Public',
    type: 'Gastropub',
    neighborhood: 'Geary Ave',
    blurb: 'Elegant pub from the Black Hoof team — beef-fat fries, brown ales.',
    accent: '#2A3A5A',
    menuStyle: 'pub-classic',
    dishes: GENERAL_PUBLIC_DISHES,
  },
};

// Default starting restaurant — Lunch Lady leads (most distinctive + signature picks)
const DEFAULT_RESTAURANT_ID = 'lunchlady';

// ──────────────────────────────────────────────────────────────
//   Per-restaurant moods & strengths
//   For each restaurant we define mood biases & "what's good here"
//   strengths so the demo re-ranks meaningfully no matter where you scan.
// ──────────────────────────────────────────────────────────────
const MOODS = [
  { id: 'light',       label: 'Light',       hint: 'Lower cal, fresh, easy' },
  { id: 'indulgent',   label: 'Indulgent',   hint: 'Treat night — go for it' },
  { id: 'adventurous', label: 'Adventurous', hint: 'Surprise me — something new' },
  { id: 'familiar',    label: 'Familiar',    hint: 'Comfort food, no surprises' },
];

// Default mood bias derived from a dish's macros + tags. Auto-applies if
// no per-dish override is set. Keeps data lean — just override the
// interesting cases.
function defaultMoodBias(dish) {
  const out = { light: 0, indulgent: 0, adventurous: 0, familiar: 0 };
  if (dish.macros.cal <= 320) out.light += 8;
  if (dish.macros.cal >= 600) out.light -= 6;
  if (dish.macros.f >= 28) out.indulgent += 6;
  if (dish.macros.cal >= 700) out.indulgent += 4;
  if (dish.tags.includes('signature')) out.adventurous += 2;
  if (dish.section === 'Desserts') { out.indulgent += 6; out.light -= 6; }
  if (dish.section === 'Salads' || (dish.tags.includes('vegan'))) out.light += 4;
  return out;
}

// Hand-tuned overrides for dishes where the auto bias misses something
// interesting (e.g. carpaccio is light AND adventurous; karaoke-comfort
// dishes get a familiar bump).
const DISH_MOOD_OVERRIDES = {
  // Lunch Lady
  ll1:  { familiar: 8 },
  ll2:  { indulgent: 10, adventurous: 4 },
  ll3:  { light: 8, adventurous: 2 },
  ll4:  { adventurous: 8, light: 4 },
  ll5:  { adventurous: 6 },
  ll7:  { indulgent: 8, familiar: 6 },
  ll8:  { indulgent: 10 },
  ll10: { indulgent: 8, adventurous: 4 },

  // Bonito's
  bn1:  { adventurous: 6, familiar: 4 },
  bn2:  { indulgent: 8, familiar: 6 },
  bn3:  { adventurous: 10, light: 6 },
  bn4:  { adventurous: 6, indulgent: 4 },
  bn5:  { indulgent: 8, familiar: 8 },
  bn6:  { indulgent: 4, adventurous: 4 },
  bn10: { indulgent: 6, familiar: 8 },

  // TONO
  to1:  { light: 8, adventurous: 4 },
  to2:  { indulgent: 8, adventurous: 6 },
  to3:  { adventurous: 6, indulgent: 4 },
  to5:  { familiar: 8 },
  to7:  { indulgent: 12, adventurous: 4 },
  to8:  { indulgent: 14, familiar: 4 },
  to10: { indulgent: 6, adventurous: 4 },

  // General Public
  gp1:  { familiar: 10, indulgent: 6 },
  gp2:  { familiar: 10, indulgent: 8 },
  gp3:  { familiar: 10 },
  gp6:  { adventurous: 4, familiar: 6 },
  gp7:  { adventurous: 6 },
  gp9:  { familiar: 8, indulgent: 6 },
  gp10: { indulgent: 10, familiar: 8 },
};

function getMoodBias(dish) {
  const base = defaultMoodBias(dish);
  const override = DISH_MOOD_OVERRIDES[dish.id] || {};
  return { ...base, ...override };
}

// Restaurant-strength signal — what's actually good here. Marks dishes
// tagged 'signature' as 88, others 50-78 by macro/section heuristic.
// In production this is the crowdsourced moat.
function getDishStrength(dish) {
  if (dish.tags.includes('signature')) return 88;
  if (dish.section === 'Mains' && dish.macros.p >= 35) return 76;
  if (dish.section === 'Cocktails') return 64;
  if (dish.section === 'Desserts') return 70;
  return 60;
}

// ──────────────────────────────────────────────────────────────
//   Flavor swipe — builds a real taste vector
//   Onboarding step 3. User swipes through 8 dishes to give Recco a
//   starting taste vector before any scanning happens.
// ──────────────────────────────────────────────────────────────
const FLAVOR_DECK = [
  { id: 'f1',  name: 'Spicy Sichuan noodles',  cuisine: 'Sichuan',     tags: ['spicy', 'savory', 'noodle', 'adventurous'], color: '#B83A2C', emoji: '🌶️' },
  { id: 'f2',  name: 'Burrata with tomato',    cuisine: 'Italian',     tags: ['creamy', 'fresh', 'mild', 'familiar'],      color: '#E8A89A', emoji: '🍅' },
  { id: 'f3',  name: 'Charred steak',          cuisine: 'Steakhouse',  tags: ['rich', 'savory', 'protein', 'familiar'],    color: '#7A3826', emoji: '🥩' },
  { id: 'f4',  name: 'Bright kale salad',      cuisine: 'Modern',      tags: ['fresh', 'bitter', 'light', 'healthy'],      color: '#5A7A4A', emoji: '🥗' },
  { id: 'f5',  name: 'Pork bánh mì',           cuisine: 'Vietnamese',  tags: ['savory', 'pickled', 'herb', 'adventurous'], color: '#C49858', emoji: '🥖' },
  { id: 'f6',  name: 'Soft cheese ravioli',    cuisine: 'Italian',     tags: ['creamy', 'rich', 'pasta', 'comfort'],       color: '#D9B864', emoji: '🧀' },
  { id: 'f7',  name: 'Garlicky fried rice',    cuisine: 'Asian',       tags: ['savory', 'umami', 'rice', 'comfort'],       color: '#A07A4A', emoji: '🍚' },
  { id: 'f8',  name: 'Whole grilled fish',     cuisine: 'Mediterranean', tags: ['fresh', 'mild', 'protein', 'light'],      color: '#7A8A6F', emoji: '🐟' },
  { id: 'f9',  name: 'Pickled herring toast',  cuisine: 'Nordic',      tags: ['pickled', 'briny', 'adventurous'],          color: '#6A8AA0', emoji: '🐟' },
  { id: 'f10', name: 'Dark chocolate dessert', cuisine: 'European',    tags: ['rich', 'sweet', 'indulgent', 'dessert'],    color: '#3A2820', emoji: '🍫' },
];

function buildTasteVector(swipes) {
  const v = {};
  for (const s of swipes) {
    const card = FLAVOR_DECK.find(c => c.id === s.id);
    if (!card) continue;
    for (const t of card.tags) {
      v[t] = (v[t] || 0) + (s.liked ? 1 : -0.5);
    }
  }
  return v;
}

function tasteMatchDelta(dish, taste) {
  if (!taste || Object.keys(taste).length === 0) return { delta: 0, reason: null };
  const dishTags = inferDishTasteTags(dish);
  let total = 0, hits = [];
  for (const t of dishTags) {
    if (taste[t]) { total += taste[t]; hits.push(t); }
  }
  const delta = Math.max(-10, Math.min(10, Math.round(total * 1.5)));
  let reason = null;
  if (delta >= 6) reason = `Matches your taste \u2014 you liked ${hits.slice(0, 2).join(', ')}`;
  else if (delta >= 2) reason = `Some overlap with your taste`;
  else if (delta <= -6) reason = `Not your usual taste`;
  else if (delta <= -2) reason = `Slight mismatch with your taste`;
  return { delta, reason, hits };
}

function inferDishTasteTags(dish) {
  const tags = new Set();
  const ing = dish.ingredients.join(' ').toLowerCase();
  const name = dish.name.toLowerCase();

  if (/cheese|burrata|parmigiano|pecorino|cream|butter|gelato|milk|mozzarella|taleggio/.test(ing)) tags.add('creamy');
  if (/chili|pepper|spic|gochu|sate|jalape/.test(ing)) tags.add('spicy');
  if (/lemon|tomato|caper|parsley|basil|mint|herb|kale|arugula|cilantro|ponzu/.test(ing)) tags.add('fresh');
  if (/beef|veal|chicken|steak|pork|ribeye|wagyu|brisket|oxtail/.test(ing)) tags.add('rich');
  if (/pasta|tonnarelli|tagliatelle|rice|risotto|noodle|udon|tteok/.test(ing)) tags.add('comfort');
  if (/pickl|capers|brin|vinegar|jellyfish/.test(ing)) tags.add('pickled');
  if (dish.macros.cal <= 350) tags.add('light');
  if (dish.macros.cal >= 600) tags.add('rich');
  if (dish.macros.p >= 35) tags.add('protein');
  if (/fish|sea bass|branzino|tuna|hamachi|otoro|haddock|kingfish/.test(name + ' ' + ing)) tags.add('mild');
  if (dish.section === 'Desserts' || dish.section === 'Dolci') tags.add('dessert');
  if (dish.tags.includes('vegan') || dish.tags.includes('vegetarian')) tags.add('healthy');
  if (/cacio|tagliatelle|risotto|chicken|steak|burrata|burger|frites/.test(name)) tags.add('familiar');
  if (/vitello tonnato|caponata|herring|aguachile|jellyfish|tataki|otoro|flan chino/.test(name.toLowerCase())) tags.add('adventurous');
  return [...tags];
}

// ──────────────────────────────────────────────────────────────
//   Profile-strength tiers
// ──────────────────────────────────────────────────────────────
const PROFILE_TIERS = [
  { min: 0,  max: 1,   label: 'New profile',     pct: 10,  hint: 'Recco starts with your diet & allergens.' },
  { min: 1,  max: 5,   label: 'Getting started', pct: 30,  hint: 'A few meals in — preferences forming.' },
  { min: 5,  max: 12,  label: 'Tuning in',       pct: 55,  hint: 'Recco knows your spice + cuisine lean.' },
  { min: 12, max: 25,  label: 'Dialed in',       pct: 80,  hint: 'Recommendations match your taste vector.' },
  { min: 25, max: 999, label: 'Fully tuned',     pct: 100, hint: 'Recco is now a trusted second opinion.' },
];
function profileTier(mealCount) {
  return PROFILE_TIERS.find(t => mealCount >= t.min && mealCount < t.max) || PROFILE_TIERS[0];
}

// ──────────────────────────────────────────────────────────────
//   Scoring
// ──────────────────────────────────────────────────────────────
function scoreDish(dish, profile) {
  const { diet = 'balanced', allergens = [], mood = null, tastes = null } = profile || {};
  const flags = dish.allergens.filter(a => allergens.includes(a));
  const dietMatch = dish.diet.includes(diet);

  const base = 70;
  let score = base;
  const breakdown = [];

  // Diet fit
  let dietDelta = 0;
  let dietReason;
  if (dietMatch) {
    dietDelta = 20;
    dietReason = diet === 'balanced'
      ? 'Works for a balanced diet'
      : `Fits your ${diet} diet`;
  } else if (diet !== 'balanced') {
    dietDelta = -25;
    dietReason = `Doesn't fit ${diet}`;
  } else {
    dietReason = 'Diet neutral';
  }
  if (diet === 'high-protein' && dish.macros.p >= 40) { dietDelta += 8; dietReason += ' · ' + dish.macros.p + 'g protein'; }
  if (diet === 'keto' && dish.macros.c <= 10) { dietDelta += 8; dietReason += ' · only ' + dish.macros.c + 'g carbs'; }
  if (diet === 'vegan' && dish.tags.includes('vegan')) { dietDelta += 5; }
  score += dietDelta;
  breakdown.push({ key: 'diet', label: 'Diet fit', delta: dietDelta, reason: dietReason });

  // Allergen flags
  let allergenDelta = -flags.length * 30;
  let allergenReason;
  if (flags.length === 0) {
    allergenReason = allergens.length ? 'No flagged allergens' : 'No allergens set';
  } else {
    allergenReason = `Contains ${flags.join(', ')} — you flagged ${flags.length === 1 ? 'this' : 'these'}`;
  }
  score += allergenDelta;
  breakdown.push({ key: 'allergens', label: 'Allergens', delta: allergenDelta, reason: allergenReason });

  // Mood bias
  let moodDelta = 0;
  let moodReason = null;
  if (mood) {
    const bias = getMoodBias(dish);
    moodDelta = bias[mood] || 0;
    const moodLabel = (MOODS.find(m => m.id === mood) || {}).label || mood;
    const ml = moodLabel.toLowerCase();
    const article = /^[aeiou]/.test(ml) ? 'an' : 'a';
    if (moodDelta >= 6) moodReason = `Great pick for ${article} ${ml} mood`;
    else if (moodDelta >= 2) moodReason = `Decent fit for ${ml}`;
    else if (moodDelta <= -6) moodReason = `Heavy for ${ml} tonight`;
    else if (moodDelta <= -2) moodReason = `Not quite ${ml}`;
    else moodReason = `Neutral for ${ml}`;
    score += moodDelta;
    breakdown.push({ key: 'mood', label: 'Mood', delta: moodDelta, reason: moodReason });
  }

  // Restaurant strength
  const strength = getDishStrength(dish);
  let strengthDelta = 0;
  let strengthReason;
  if (strength >= 85) { strengthDelta = 8; strengthReason = "Chef's signature — diners rave about it"; }
  else if (strength >= 70) { strengthDelta = 4; strengthReason = 'A reliable pick at this restaurant'; }
  else if (strength >= 55) { strengthDelta = 0; strengthReason = 'Decent reviews here'; }
  else { strengthDelta = -4; strengthReason = 'Weaker reviews vs. their other dishes'; }
  score += strengthDelta;
  breakdown.push({ key: 'strength', label: "What's good here", delta: strengthDelta, reason: strengthReason, strength });

  // Taste vector
  if (tastes && Object.keys(tastes).length > 0) {
    const t = tasteMatchDelta(dish, tastes);
    if (t.delta !== 0 || t.reason) {
      score += t.delta;
      breakdown.push({ key: 'taste', label: 'Your taste', delta: t.delta, reason: t.reason || 'Neutral on your taste profile' });
    }
  }

  // Mild noise so scores feel non-uniform
  const idNum = parseInt(dish.id.replace(/\D/g,''), 10) || 1;
  const noise = (idNum * 7) % 9 - 4;
  score += noise;
  score = Math.max(8, Math.min(99, score));
  return { score, flags, dietMatch, isSafe: flags.length === 0, breakdown, strength };
}

function rankDishes(dishes, profile) {
  return dishes
    .map(d => ({ ...d, ...scoreDish(d, profile) }))
    .sort((a, b) => b.score - a.score);
}

// ──────────────────────────────────────────────────────────────
//   Companions for Group ordering
// ──────────────────────────────────────────────────────────────
const COMPANIONS = [
  {
    id: 'maya',
    name: 'Maya',
    avatar: { initials: 'M', color: '#C49858' },
    profile: {
      diet: 'pescatarian',
      allergens: ['dairy'],
      tastes: { fresh: 3, light: 3, mild: 2, herb: 2, healthy: 2, creamy: -2 },
    },
    blurb: 'Pescatarian · dairy-free',
  },
  {
    id: 'theo',
    name: 'Theo',
    avatar: { initials: 'T', color: '#7A3826' },
    profile: {
      diet: 'high-protein',
      allergens: [],
      tastes: { rich: 3, savory: 3, protein: 3, familiar: 2, dessert: -1 },
    },
    blurb: 'High-protein · no allergens',
  },
  {
    id: 'sana',
    name: 'Sana',
    avatar: { initials: 'S', color: '#5A7A4A' },
    profile: {
      diet: 'vegetarian',
      allergens: ['nuts'],
      tastes: { creamy: 2, comfort: 3, pasta: 3, mild: 2, healthy: 1, spicy: -1 },
    },
    blurb: 'Vegetarian · nut-free',
  },
  {
    id: 'jordan',
    name: 'Jordan',
    avatar: { initials: 'J', color: '#6A8AA0' },
    profile: {
      diet: 'balanced',
      allergens: ['shellfish'],
      tastes: { adventurous: 3, spicy: 2, briny: 2, pickled: 2, comfort: -1 },
    },
    blurb: 'Adventurous · shellfish allergy',
  },
];

function rankGroup(dishes, diners) {
  return dishes
    .map(d => {
      const perDiner = diners.map(diner => {
        const result = scoreDish(d, diner.profile);
        return { id: diner.id, name: diner.name, score: result.score, isSafe: result.isSafe, dietMatch: result.dietMatch };
      });
      const min = Math.min(...perDiner.map(p => p.score));
      const avg = Math.round(perDiner.reduce((a, p) => a + p.score, 0) / perDiner.length);
      const groupScore = Math.round(min * 0.6 + avg * 0.4);
      const unsafeFor = perDiner.filter(p => !p.isSafe).map(p => p.name);
      const dietMissFor = perDiner.filter(p => !p.dietMatch).map(p => p.name);
      return {
        ...d,
        ...scoreDish(d, diners[0].profile),
        group: { perDiner, min, avg, groupScore, unsafeFor, dietMissFor },
      };
    })
    .sort((a, b) => b.group.groupScore - a.group.groupScore);
}

// ──────────────────────────────────────────────────────────────
//   Backwards-compat exports for any code still referring to OLMO/HISTORY_SCANS.
//   OLMO_DISHES → Lunch Lady (default).
//   HISTORY_SCANS → other 3 restaurants as past visits.
// ──────────────────────────────────────────────────────────────
const OLMO_DISHES = LUNCHLADY_DISHES;
const RESTAURANT_OLMO = RESTAURANTS[DEFAULT_RESTAURANT_ID];

const HISTORY_SCANS = [
  {
    id: 'h-bonitos',
    name: "Bonito's",
    type: 'Korean-Ecuadorian',
    neighborhood: '180 Ossington Ave',
    scannedAt: '3 days ago',
    topPick: 'Stuffed Wings',
    dishCount: BONITOS_DISHES.length,
    color: '#B83A2C',
    restaurantId: 'bonitos',
  },
  {
    id: 'h-tono',
    name: 'TONO',
    type: 'Modern Izakaya',
    neighborhood: 'Ossington',
    scannedAt: 'Last week',
    topPick: 'Hamachi Crudo',
    dishCount: TONO_DISHES.length,
    color: '#1A1A2A',
    restaurantId: 'tono',
  },
  {
    id: 'h-genpub',
    name: 'General Public',
    type: 'Gastropub',
    neighborhood: 'Geary Ave',
    scannedAt: 'Mar 28',
    topPick: 'Steak Frites',
    dishCount: GENERAL_PUBLIC_DISHES.length,
    color: '#2A3A5A',
    restaurantId: 'general_public',
  },
];

Object.assign(window, {
  DIETS, ALLERGENS, MOODS,
  RESTAURANTS, DEFAULT_RESTAURANT_ID,
  LUNCHLADY_DISHES, BONITOS_DISHES, TONO_DISHES, GENERAL_PUBLIC_DISHES,
  // legacy aliases
  OLMO_DISHES, RESTAURANT_OLMO,
  HISTORY_SCANS,
  PROFILE_TIERS, FLAVOR_DECK, COMPANIONS,
  scoreDish, rankDishes, profileTier, buildTasteVector, tasteMatchDelta, rankGroup,
  getMoodBias, getDishStrength,
});
