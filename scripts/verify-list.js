import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userList = [
  "Power Bank", "Portable Charger", "Laptop", "iPad", "Tablet", "Phone Charger", 
  "Laptop Charger", "Camera", "Camera Battery", "Drone", "AirTag", "Bluetooth Speaker", 
  "Kindle", "Gaming Console", "Extension Cord", "Toothpaste", "Shampoo", "Conditioner", 
  "Deodorant", "Perfume", "Cologne", "Sunscreen", "Lotion", "Face Wash", "Mouthwash", 
  "Hair Gel", "Hair Spray", "Dry Shampoo", "Makeup", "Nail Polish", "Sandwich", "Pizza", 
  "Chips", "Cookies", "Chocolate", "Candy", "Fruit", "Apples", "Bananas", "Peanut Butter", 
  "Protein Powder", "Protein Bars", "Baby Formula", "Baby Food", "Coffee Beans", "Tea Bags", 
  "Spices", "Honey", "Hot Sauce", "Prescription Medicine", "Vitamins", "Insulin", 
  "Syringes", "EpiPen", "Inhaler", "Contact Lens Solution", "Eye Drops", "Ibuprofen", 
  "Acetaminophen", "Liquid Medicine", "Thermometer", "Razor", "Disposable Razor", 
  "Safety Razor", "Straight Razor", "Scissors", "Pocket Knife", "Swiss Army Knife", 
  "Tweezers", "Nail Clippers", "Corkscrew", "AA Batteries", "AAA Batteries", "Lithium Batteries", 
  "Rechargeable Batteries", "Camera Batteries", "Coin Cell Batteries", "Battery Pack", 
  "Vape", "E-Cigarette", "Lighter", "Matches", "Cigars", "Cigarettes", "Nicotine Pouches", 
  "Hookah", "Water Bottle", "Hand Sanitizer", "Olive Oil", "Wine", "Whiskey", "Beer", 
  "Juice", "Soda", "Ice", "Baby Milk", "Tent Stakes", "Camping Stove", "Propane Canister", 
  "Trekking Poles", "Fishing Rod", "Multi Tool", "Baseball Bat", "Tennis Racket", 
  "Golf Clubs", "Bowling Ball", "Skateboard", "Bicycle Helmet", "Dumbbells", "Candles", 
  "Snow Globe", "Glass Bottle", "Mug", "Picture Frame", "Wine Bottle", "Christmas Gifts", 
  "Stroller", "Car Seat", "Diapers", "Baby Wipes", "Formula", "Baby Food", "Breast Milk", 
  "Breast Pump", "Dog Food", "Cat Food", "Pet Carrier", "Leash", "Pet Medication", "Fish", 
  "Curling Iron", "Hair Dryer", "Hair Straightener", "Electric Toothbrush", "Beard Trimmer", 
  "Electric Razor", "Makeup Brushes", "Lipstick", "Shoes", "Boots", "High Heels", "Belt", 
  "Jewelry", "Watch", "Wedding Dress", "Suit"
];

const summaryPath = path.join(__dirname, '../src/data/metadata-summary.json');
if (!fs.existsSync(summaryPath)) {
  console.error("metadata-summary.json does not exist");
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const slugs = summary.map(x => x.slug);
const namesLower = summary.map(x => x.name.toLowerCase());

const missing = [];
for (const item of userList) {
  const itemLower = item.toLowerCase();
  let found = false;
  
  // try matching slug
  const slugified = itemLower.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (slugs.includes(slugified)) {
    found = true;
  }
  
  // try matching name
  if (!found) {
    for (const name of namesLower) {
      if (name === itemLower || name.includes(itemLower) || itemLower.includes(name)) {
        found = true;
        break;
      }
    }
  }

  // try matching aliases
  if (!found) {
    for (const entry of summary) {
      if (entry.aliases && entry.aliases.map(a => a.toLowerCase()).includes(itemLower)) {
        found = true;
        break;
      }
    }
  }

  if (!found) {
    missing.push({ item, slugified });
  }
}

console.log("Missing count:", missing.length);
console.log("Missing items:", JSON.stringify(missing, null, 2));
