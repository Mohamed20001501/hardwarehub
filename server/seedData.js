require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const VENDORS = [
  { name: 'Lanka Hardware Store', email: 'lankahardware@test.com' },
  { name: 'Colombo Tools & Fasteners', email: 'colombotools@test.com' },
  { name: 'Kandy Hardware Supply', email: 'kandyhardware@test.com' },
];

const CUSTOMERS = [
  { name: 'Nimal Perera', email: 'nimal.perera@test.com' },
  { name: 'Fathima Rizvi', email: 'fathima.rizvi@test.com' },
];

const TEST_PASSWORD = 'Test@12345';

const PRODUCTS_BY_VENDOR = [
 
  [
    { name: 'Claw Hammer 16oz', description: 'Fibreglass-handled claw hammer for general carpentry and demolition work.', price: 1200,  image: 'hammer.webp',stock: 25, category: 'Tools' },
    { name: 'Steel Measuring Tape 5m', description: 'Retractable 5-metre steel measuring tape with locking mechanism.', price: 850,image: 'steel m tape.jpg', stock: 40, category: 'Tools' },
    { name: 'Adjustable Wrench 10"', description: 'Chrome-plated adjustable wrench, 10 inch, for nuts and bolts of varying sizes.', price: 1500,image: 'adust wrench.webp', stock: 15, category: 'Tools' },
    { name: 'Cordless Drill Machine', description: '12V cordless drill with two speed settings and a bit set.', price: 12500,image: 'cordl dril.jpg', stock: 8, category: 'Power Tools' },
    { name: 'Safety Helmet', description: 'ANSI-rated hard hat for construction and industrial safety.', price: 950,image: 'helmet.jpg', stock: 30, category: 'Safety Equipment' },
    { name: 'Screwdriver Set 6-Piece', description: 'Includes flathead and Phillips head screwdrivers with magnetic tips.', price: 1800,image: 'screwdriver.webp', stock: 50, category: 'Tools' },
    { name: 'Combination Pliers 8"', description: 'Heavy-duty steel combination pliers with insulated handles.', price: 1100,image: 'com pliers8.jpg ', stock: 35, category: 'Tools' },
    { name: 'Hacksaw Frame with Blade', description: 'Adjustable 12-inch steel frame hacksaw for metal cutting.', price: 1400,image: 'frame.webp ', stock: 20, category: 'Tools' },
    { name: 'Angle Grinder 850W', description: 'High-power professional angle grinder with guard and auxiliary handle.', price: 9800,image: 'angle grin 850.jpg ', stock: 12, category: 'Power Tools' },
    { name: 'Jigsaw Machine 600W', description: 'Variable speed jigsaw with adjustable bevel and dust extraction port.', price: 11500,image: 'jig 600w.webp ', stock: 6, category: 'Power Tools' },
    { name: 'Rotary Hammer Drill', description: 'Three-mode heavy-duty rotary hammer drill for concrete and masonry.', price: 18500,image: 'rotary.jpg ', stock: 5, category: 'Power Tools' },
    { name: 'Safety Goggles Clear', description: 'Anti-scratch, high-impact polycarbonate safety glasses.', price: 450,image: 'goggles clear.jpg ', stock: 80, category: 'Safety Equipment' },
    { name: 'Heavy Duty Work Gloves', description: 'Split leather palm work gloves for construction and general handling.', price: 650,image: 'work gloves.jpg ',  stock: 100, category: 'Safety Equipment' },
    { name: 'Safety Harness Full Body', description: 'Industrial fall protection safety harness with double lanyard.', price: 7800,image: 'safty h.jpg', stock: 15, category: 'Safety Equipment' },
    { name: 'Ear Defenders / Muffs', description: 'High noise reduction earmuffs for ear protection in construction sites.', price: 1350,image: 'ear defenders.jpg', stock: 25, category: 'Safety Equipment' },
    { name: 'Level Tool 24" Aluminium', description: 'Heavy-duty spirit level with 3 high-visibility vials.', price: 1950,image: 'level tool.jpg', stock: 18, category: 'Tools' },
    { name: 'Utility Knife Heavy Duty', description: 'Retractable heavy-duty utility knife with 3 spare blades.', price: 550,image: 'u knife .webp', stock: 60, category: 'Tools' },
  ],
  
  [
    { name: 'Galvanized Nails 1kg',image: 'nails.webp', description: 'Rust-resistant galvanized nails, assorted sizes, 1kg pack.', price: 450, stock: 100, category: 'Fasteners' },
    { name: 'LED Bulb 9W',image: 'led bulb9.webp', description: 'Energy-efficient 9W LED bulb, cool white, screw-fit.', price: 350, stock: 120, category: 'Electrical' },
    { name: 'Extension Cord 5m',image: 'ext cord.webp', description: '5-metre heavy-duty extension cord with 3 sockets.', price: 1100, stock: 35, category: 'Electrical' },
    { name: 'Paint Brush Set',image: 'paint brush set.webp', description: 'Set of 5 paint brushes in assorted sizes for home painting.', price: 750, stock: 50, category: 'Painting' },
    { name: 'Drywall Screws M4 1kg',image: 'drywall scr.webp', description: 'Black phosphate coated drywall screws, 1.5 inch, 1kg box.', price: 650, stock: 90, category: 'Fasteners' },
    { name: 'Plastic Wall Plugs 100pcs',image: 'wall plugs.webp', description: 'Expanding nylon wall anchors/plugs for masonry screws.', price: 250, stock: 200, category: 'Fasteners' },
    { name: 'Metal Washer M8 (50pcs)',image: 'metal washer.jpg', description: 'Zinc-plated round flat washers for bolts and fasteners.', price: 300, stock: 150, category: 'Fasteners' },
    { name: 'Digital Multimeter',image: 'multimeter.jpg', description: 'Compact AC/DC voltage, current, and resistance tester.', price: 2950, stock: 20, category: 'Electrical' },
    { name: 'Electrical Tape Black 5pcs',image: 'electric tape.webp', description: 'Insulating PVC adhesive tape for electrical wiring.', price: 400, stock: 110, category: 'Electrical' },
    { name: 'Wire Stripper and Cutter',image: 'wcutter.jpg', description: 'Self-adjusting automatic wire stripper with crimping function.', price: 1650, stock: 40, category: 'Electrical' },
    { name: 'Paint Roller 9" with Tray',image: 'roller.webp', description: 'Complete set with professional 9-inch roller, frame, and plastic tray.', price: 1250, stock: 45, category: 'Painting' },
    { name: 'Wall Putty Filler 5kg',image: 'putty.jpg', description: 'Ready-to-use acrylic wall filler for patching cracks and holes.', price: 1450, stock: 35, category: 'Painting' },
    { name: 'Painter\'s Masking Tape',image: 'masking tape.webp', description: 'Medium adhesion clean-release masking tape, 2 inch width.', price: 350, stock: 85, category: 'Painting' },
    { name: 'Stainless Steel Wood Screws',image: 'steel w scr.webp', description: 'Pack of 100 self-tapping wood screws, rustproof stainless steel.', price: 550, stock: 120, category: 'Fasteners' },
    { name: 'Anchor Bolt M12 (10pcs)',image: 'anchor b.jpg', description: 'Heavy-duty steel sleeve anchors for concrete fixing.', price: 950, stock: 70, category: 'Fasteners' },
    { name: 'Electrical Switch Board',image: 'electrical switch.webp', description: '4-way socket switch board with safety surge protection.', price: 1850, stock: 30, category: 'Electrical' },
    { name: 'LED Floodlight 50W',image: 'ledflood.webp', description: 'IP65 waterproof outdoor LED floodlight for security lighting.', price: 4500, stock: 15, category: 'Electrical' },
  ],
  
  [
    { name: 'Portland Cement 50kg',image: 'portland.jpg', description: 'Premium grade Portland cement for durable concrete construction and bricklaying.', price: 2450, stock: 45, category: 'Building Materials' },
    { name: 'Wall Paint White 10L',image: 'wall paint.webp', description: 'High-opacity, washability, premium emulsion wall paint for interior and exterior walls.', price: 8900, stock: 30, category: 'Painting' },
    { name: 'PVC Solfit Glue 250ml',image: 'pvc glue.webp', description: 'Heavy duty PVC solvent cement adhesive for secure leak-proof plumbing joints.', price: 680, stock: 90, category: 'Plumbing' },
    { name: 'Heavy Duty Garden Rake',image: 'heavy duty.webp', description: 'Strong steel head with fiberglass handle for landscaping and garden cleaning.', price: 2200, stock: 25, category: 'Tools' },
    { name: 'Hex Bolts & Nuts M10 (100pcs)',image: 'hex Bolts.webp', description: 'Zinc-plated high tensile grade 8.8 carbon steel bolts and nuts set.', price: 1480, stock: 65, category: 'Fasteners' },
    { name: 'PVC Pipe 1 inch (3m)',image: 'pvc pipe.jpg', description: 'Standard 1-inch PVC pipe, 3 metre length, for plumbing.', price: 650, stock: 60, category: 'Plumbing' },
    { name: 'PVC Elbow Joint 1" (10pcs)',image: 'pvc L.webp', description: '90-degree elbow pipe connectors for plumbing installations.', price: 450, stock: 120, category: 'Plumbing' },
    { name: 'Ball Valve Brass 1"',image: 'ball valve.jpg', description: 'Heavy duty full port brass ball valve with lever handle.', price: 1850, stock: 40, category: 'Plumbing' },
    { name: 'Teflon Thread Tape 10pcs',image: 'Teflon thread.webp', description: 'PTFE pipe thread sealant tape for leak-proof fittings.', price: 250, stock: 200, category: 'Plumbing' },
    { name: 'Concrete Blocks 8" (50pcs)',image: 'Concrete blocks.webp', description: 'High strength hollow concrete blocks for masonry construction.', price: 9500, stock: 10, category: 'Building Materials' },
    { name: 'Steel Rebar 12mm (per m)',image: 'Steel rebar.webp', description: 'Reinforcing steel deformed bar for structural concrete.', price: 750, stock: 500, category: 'Building Materials' },
    { name: 'Bricks Red Clay (100pcs)',image: 'bricks red.jpg', description: 'Traditional kiln-baked solid clay building bricks.', price: 3500, stock: 15, category: 'Building Materials' },
    { name: 'Wheelbarrow Heavy Duty',image: 'Wheelbarrow.jpg', description: 'Single wheel steel tray wheelbarrow with pneumatic tire.', price: 8500, stock: 8, category: 'Tools' },
    { name: 'Plumber\'s Pipe Wrench 14"',image: 'plumbers.webp', description: 'Heavy-duty adjustable pipe wrench with forged steel jaws.', price: 2800, stock: 20, category: 'Tools' },
    { name: 'Tile Adhesive 20kg Bag',image: 'Tile Adh.jpg', description: 'Waterproof high-performance polymer modified cementitious tile adhesive.', price: 2250, stock: 40, category: 'Building Materials' },
    { name: 'Grout Mix Grey 5kg',image: 'grouts.webp', description: 'Stain resistant fine grout powder for tile joints.', price: 850, stock: 50, category: 'Building Materials' },
  ],
];

async function upsertUser({ name, email, role }) {
  let user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    user = await User.create({ name, email, password: TEST_PASSWORD, role });
    console.log(`Created ${role}: ${email}`);
  } else {
    console.log(`${role} already exists: ${email}`);
  }
  return user;
}

async function upsertProduct(vendor, data) {
  let product = await Product.findOne({ name: data.name, vendor: vendor._id });
  if (!product) {
    product = await Product.create({ ...data, vendor: vendor._id });
    console.log(`  + ${data.name}`);
  } else {
    
    product.description = data.description;
    product.price = data.price;
    product.stock = data.stock;
    product.category = data.category;
    await product.save();
    console.log(`  * ${data.name} (updated)`);
  }
  return product;
}

async function ensureSampleOrders(customers, allProducts) {
  const existingOrders = await Order.countDocuments();
  if (existingOrders > 0) {
    console.log('Sample orders already exist, skipping.');
    return;
  }

  const [nimal, fathima] = customers;
  const hardwareItems = allProducts.slice(0, 5); 
  const kandyHardwareItems = allProducts.slice(34, 39); 

  const orderSpecs = [
    { customer: nimal, items: [hardwareItems[0], hardwareItems[3]], status: 'Delivered' },
    { customer: nimal, items: [hardwareItems[1], hardwareItems[4]], status: 'Processing' },
    { customer: fathima, items: [kandyHardwareItems[0], kandyHardwareItems[1], kandyHardwareItems[2]], status: 'Pending' },
  ];

  for (const spec of orderSpecs) {
    const items = spec.items.map((p) => ({
      product: p._id,
      vendor: p.vendor,
      name: p.name,
      price: p.price,
      qty: 1 + Math.floor(Math.random() * 2),
    }));
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    await Order.create({
      customer: spec.customer._id,
      items,
      totalPrice,
      status: spec.status,
    });
    console.log(`Created order for ${spec.customer.name} (${spec.status})`);
  }
}

async function seedData() {
  await connectDB();

  
  await Product.deleteMany({});
  await Order.deleteMany({});
  console.log('Cleared existing products and orders.');

  const vendors = [];
  for (const v of VENDORS) {
    vendors.push(await upsertUser({ ...v, role: 'vendor' }));
  }

  const customers = [];
  for (const c of CUSTOMERS) {
    customers.push(await upsertUser({ ...c, role: 'customer' }));
  }

  const allProducts = [];
  for (let i = 0; i < vendors.length; i += 1) {
    console.log(`Products for ${vendors[i].name}:`);
    for (const data of PRODUCTS_BY_VENDOR[i]) {
      allProducts.push(await upsertProduct(vendors[i], data));
    }
  }

  await ensureSampleOrders(customers, allProducts);

  console.log('\nTest login credentials (password for all: ' + TEST_PASSWORD + ')');
  vendors.forEach((v) => console.log(`  Vendor:   ${v.email}`));
  customers.forEach((c) => console.log(`  Customer: ${c.email}`));

  await mongoose.disconnect();
}

seedData().catch((err) => {
  console.error('Seed data failed:', err);
  process.exit(1);
});
