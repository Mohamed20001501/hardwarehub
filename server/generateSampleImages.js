require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');

const uploadDir = path.join(__dirname, 'uploads');

// Specifying emojis, backgrounds, and foregrounds for all 50 unique hardware products
const IMAGE_SPECS = {
  // Lanka Hardware Store
  'Claw Hammer 16oz': { emoji: '🔨', bg: '#ffedd5', fg: '#c2410c' },
  'Steel Measuring Tape 5m': { emoji: '📏', bg: '#fef3c7', fg: '#b45309' },
  'Adjustable Wrench 10"': { emoji: '🔧', bg: '#f1f5f9', fg: '#475569' },
  'Cordless Drill Machine': { emoji: '🛠️', bg: '#ffedd5', fg: '#ea580c' },
  'Safety Helmet': { emoji: '⛑️', bg: '#fee2e2', fg: '#dc2626' },
  'Screwdriver Set 6-Piece': { emoji: '🪛', bg: '#ecfdf5', fg: '#059669' },
  'Combination Pliers 8"': { emoji: '✂️', bg: '#f1f5f9', fg: '#334155' },
  'Hacksaw Frame with Blade': { emoji: '🪚', bg: '#f8fafc', fg: '#1e293b' },
  'Angle Grinder 850W': { emoji: '⚙️', bg: '#fff7ed', fg: '#c2410c' },
  'Jigsaw Machine 600W': { emoji: '🔌', bg: '#f0f9ff', fg: '#0284c7' },
  'Rotary Hammer Drill': { emoji: '🧱', bg: '#fafaf9', fg: '#44403c' },
  'Safety Goggles Clear': { emoji: '🥽', bg: '#ecfeff', fg: '#0891b2' },
  'Heavy Duty Work Gloves': { emoji: '🧤', bg: '#fef3c7', fg: '#d97706' },
  'Safety Harness Full Body': { emoji: '🧗', bg: '#fff7ed', fg: '#ea580c' },
  'Ear Defenders / Muffs': { emoji: '🎧', bg: '#f3e8ff', fg: '#9333ea' },
  'Level Tool 24" Aluminium': { emoji: '📐', bg: '#f0fdfa', fg: '#0d9488' },
  'Utility Knife Heavy Duty': { emoji: '🔪', bg: '#fee2e2', fg: '#b91c1c' },

  // Colombo Tools & Fasteners
  'Galvanized Nails 1kg': { emoji: '🔩', bg: '#f8fafc', fg: '#64748b' },
  'LED Bulb 9W': { emoji: '💡', bg: '#fef9c3', fg: '#ca8a04' },
  'Extension Cord 5m': { emoji: '🔌', bg: '#ecfdf5', fg: '#059669' },
  'Paint Brush Set': { emoji: '🖌️', bg: '#fff1f2', fg: '#e11d48' },
  'Drywall Screws M4 1kg': { emoji: '🔩', bg: '#f1f5f9', fg: '#475569' },
  'Plastic Wall Plugs 100pcs': { emoji: '🔌', bg: '#f0f9ff', fg: '#0284c7' },
  'Metal Washer M8 (50pcs)': { emoji: '⭕', bg: '#e2e8f0', fg: '#475569' },
  'Digital Multimeter': { emoji: '📟', bg: '#fffbeb', fg: '#d97706' },
  'Electrical Tape Black 5pcs': { emoji: '🎗️', bg: '#f1f5f9', fg: '#0f172a' },
  'Wire Stripper and Cutter': { emoji: '✂️', bg: '#ecfdf5', fg: '#059669' },
  'Paint Roller 9" with Tray': { emoji: '🎨', bg: '#faf5ff', fg: '#7c3aed' },
  'Wall Putty Filler 5kg': { emoji: '🧱', bg: '#fafaf9', fg: '#57534e' },
  'Painter\'s Masking Tape': { emoji: '🎗️', bg: '#fffbeb', fg: '#b45309' },
  'Stainless Steel Wood Screws': { emoji: '🔩', bg: '#f8fafc', fg: '#334155' },
  'Anchor Bolt M12 (10pcs)': { emoji: '⚙️', bg: '#f1f5f9', fg: '#475569' },
  'Electrical Switch Board': { emoji: '🎛️', bg: '#f8fafc', fg: '#1e293b' },
  'LED Floodlight 50W': { emoji: '🔆', bg: '#fef9c3', fg: '#a16207' },

  // Kandy Hardware Supply
  'Portland Cement 50kg': { emoji: '🧱', bg: '#f5f5f4', fg: '#78716c' },
  'Wall Paint White 10L': { emoji: '🪣', bg: '#fdf2f8', fg: '#db2777' },
  'PVC Solfit Glue 250ml': { emoji: '🧪', bg: '#f0fdf4', fg: '#16a34a' },
  'Heavy Duty Garden Rake': { emoji: '🧹', bg: '#fef3c7', fg: '#d97706' },
  'Hex Bolts & Nuts M10 (100pcs)': { emoji: '🔩', bg: '#f1f5f9', fg: '#475569' },
  'PVC Pipe 1 inch (3m)': { emoji: '🚰', bg: '#eff6ff', fg: '#2563eb' },
  'PVC Elbow Joint 1" (10pcs)': { emoji: '📐', bg: '#f0f9ff', fg: '#0284c7' },
  'Ball Valve Brass 1"': { emoji: '🚰', bg: '#fffbeb', fg: '#ca8a04' },
  'Teflon Thread Tape 10pcs': { emoji: '🎗️', bg: '#ffffff', fg: '#2563eb' },
  'Concrete Blocks 8" (50pcs)': { emoji: '🧱', bg: '#e7e5e4', fg: '#44403c' },
  'Steel Rebar 12mm (per m)': { emoji: '💈', bg: '#f1f5f9', fg: '#475569' },
  'Bricks Red Clay (100pcs)': { emoji: '🧱', bg: '#fee2e2', fg: '#991b1b' },
  'Wheelbarrow Heavy Duty': { emoji: '🛒', bg: '#fff7ed', fg: '#c2410c' },
  'Plumber\'s Pipe Wrench 14"': { emoji: '🔧', bg: '#fee2e2', fg: '#dc2626' },
  'Tile Adhesive 20kg Bag': { emoji: '🧱', bg: '#fafaf9', fg: '#78716c' },
  'Grout Mix Grey 5kg': { emoji: '🧱', bg: '#f5f5f4', fg: '#57534e' },
};

function escapeXml(str) {
  return str.replace(/[<>&'"]/g, (c) => (
    { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]
  ));
}

function buildSvg(name, { emoji, bg, fg }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <rect width="600" height="600" fill="${bg}"/>
  <text x="300" y="260" font-size="200" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
  <text x="300" y="470" font-size="34" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle" fill="${fg}">${escapeXml(name)}</text>
</svg>
`;
}

async function generateImages() {
  await connectDB();
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const products = await Product.find({ name: { $in: Object.keys(IMAGE_SPECS) } });
  for (const product of products) {
    const spec = IMAGE_SPECS[product.name];
    const filename = `${product._id}.svg`;
    fs.writeFileSync(path.join(uploadDir, filename), buildSvg(product.name, spec));
    product.image = filename;
    await product.save();
    console.log(`Image set for ${product.name} -> ${filename}`);
  }

  await mongoose.disconnect();
}

generateImages().catch((err) => {
  console.error('Image generation failed:', err);
  process.exit(1);
});
