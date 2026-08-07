import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Persistent JSON Database path
const DATA_FILE = path.join(__dirname, 'db.json');

// Initial default data
const DEFAULT_DATA = {
  settings: {
    companyName: "ZacTEK Corp W.L.L",
    companyArabic: "شركة زاك تك كورب ذ.م.م",
    managerName: "Kumar",
    managerRole: "Marketing Manager",
    phone: "+965 60607922",
    email: "zactekaccouts@gmail.com",
    address: "Abdulla Mutlaq Al Musalim Street, Mubarak Commercial Complex 2, Jleeb Al-Shuyoukh, Kuwait",
    adminUsername: "admin",
    adminPassword: "admin123"
  },
  categories: [
    { id: "cat-1", name: "Apparel & Garments", description: "Premium quality clothing, shirts, innerwear, and uniforms.", status: 'Active', productCount: 2, views: 1240 },
    { id: "cat-2", name: "Corporate Services", description: "Connecting solutions and business consulting services.", status: 'Active', productCount: 1, views: 520 },
    { id: "cat-3", name: "Environmental Services", description: "Professional sanitization and environmental solutions.", status: 'Active', productCount: 1, views: 340 }
  ],
  subcategories: [
    { id: "subcat-1", categoryId: "cat-1", name: "Polo T-Shirts", description: "Premium polo shirts and casual wear.", status: 'Active', productCount: 1 },
    { id: "subcat-2", categoryId: "cat-1", name: "Innerwear & Vests", description: "Combed cotton innerwear, briefs, and vests.", status: 'Active', productCount: 1 },
    { id: "subcat-3", categoryId: "cat-2", name: "General Trading", description: "General wholesale items and trading logistics.", status: 'Active', productCount: 0 },
    { id: "subcat-4", categoryId: "cat-3", name: "Sea Shark Services", description: "Specialized waste management and eco-consultancy.", status: 'Active', productCount: 0 }
  ],
  items: [
    {
      id: "item-1",
      name: "ONN Premium Polo T-Shirt",
      brand: "ONN Premiums",
      categoryId: "cat-1",
      subcategoryId: "subcat-1",
      price: "Wholesale (Contact for Quote)",
      sku: "ONN-TS-001",
      stock: 450,
      sizes: ["M", "L", "XL", "XXL"],
      status: 'Active',
      description: "High-quality premium polo neck t-shirt. Soft, breathable knit fabric ideal for casual wear, client meetings, and daily comfort. Expertly manufactured for high durability.",
      imageUrl: "/images/polo_tshirt.jpg"
    },
    {
      id: "item-2",
      name: "ONN Premium Men's Vest (3 PC Pack)",
      brand: "ONN Premiums",
      categoryId: "cat-1",
      subcategoryId: "subcat-2",
      price: "Wholesale (Contact for Quote)",
      sku: "ONN-VT-002",
      stock: 800,
      sizes: ["S", "M", "L"],
      status: 'Active',
      description: "100% Combed Cotton premium men's vest. Standard rib knit structure ensures perfect fit, high stretchability, and long-lasting durability. Pack of 3 pieces with free pen inside.",
      imageUrl: "/images/mens_vest.jpg"
    }
  ],
  users: [
    {
      id: 'user-1',
      name: 'Kumar (You)',
      username: 'admin',
      designation: 'Marketing Manager',
      role: 'Administrator',
      status: 'Active',
      avatarColor: '#d31e25'
    },
    {
      id: 'user-2',
      name: 'Sales Representative',
      username: 'sales_rep1',
      designation: 'Wholesale Agent',
      role: 'Editor',
      status: 'Active',
      avatarColor: '#3b82f6'
    }
  ]
};

// Database helper functions
const getDB = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading db file:', e);
  }
  saveDB(DEFAULT_DATA);
  return DEFAULT_DATA;
};

const saveDB = (data: any) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving db file:', e);
  }
};

// --- API ENDPOINTS ---

// Healthcheck
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', server: 'ZacTEK Express Backend', time: new Date().toISOString() });
});

// Categories Endpoints
app.get('/api/categories', (req: Request, res: Response) => {
  const db = getDB();
  res.json(db.categories || []);
});

app.post('/api/categories', (req: Request, res: Response) => {
  const db = getDB();
  const newCat = { id: `cat-${Date.now()}`, ...req.body };
  db.categories.push(newCat);
  saveDB(db);
  res.status(201).json(newCat);
});

app.put('/api/categories/:id', (req: Request, res: Response) => {
  const db = getDB();
  const { id } = req.params;
  const index = db.categories.findIndex((c: any) => c.id === id);
  if (index !== -1) {
    db.categories[index] = { ...db.categories[index], ...req.body };
    saveDB(db);
    res.json(db.categories[index]);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

app.delete('/api/categories/:id', (req: Request, res: Response) => {
  const db = getDB();
  const { id } = req.params;
  db.categories = db.categories.filter((c: any) => c.id !== id);
  saveDB(db);
  res.json({ success: true });
});

// Subcategories Endpoints
app.get('/api/subcategories', (req: Request, res: Response) => {
  const db = getDB();
  res.json(db.subcategories || []);
});

app.post('/api/subcategories', (req: Request, res: Response) => {
  const db = getDB();
  const newSubcat = { id: `subcat-${Date.now()}`, ...req.body };
  db.subcategories.push(newSubcat);
  saveDB(db);
  res.status(201).json(newSubcat);
});

app.put('/api/subcategories/:id', (req: Request, res: Response) => {
  const db = getDB();
  const { id } = req.params;
  const index = db.subcategories.findIndex((sc: any) => sc.id === id);
  if (index !== -1) {
    db.subcategories[index] = { ...db.subcategories[index], ...req.body };
    saveDB(db);
    res.json(db.subcategories[index]);
  } else {
    res.status(404).json({ error: 'Subcategory not found' });
  }
});

app.delete('/api/subcategories/:id', (req: Request, res: Response) => {
  const db = getDB();
  const { id } = req.params;
  db.subcategories = db.subcategories.filter((sc: any) => sc.id !== id);
  saveDB(db);
  res.json({ success: true });
});

// Products / Items Endpoints
app.get('/api/items', (req: Request, res: Response) => {
  const db = getDB();
  res.json(db.items || []);
});

app.post('/api/items', (req: Request, res: Response) => {
  const db = getDB();
  const newItem = { id: `item-${Date.now()}`, ...req.body };
  db.items.push(newItem);
  saveDB(db);
  res.status(201).json(newItem);
});

app.put('/api/items/:id', (req: Request, res: Response) => {
  const db = getDB();
  const { id } = req.params;
  const index = db.items.findIndex((item: any) => item.id === id);
  if (index !== -1) {
    db.items[index] = { ...db.items[index], ...req.body };
    saveDB(db);
    res.json(db.items[index]);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

app.delete('/api/items/:id', (req: Request, res: Response) => {
  const db = getDB();
  const { id } = req.params;
  db.items = db.items.filter((item: any) => item.id !== id);
  saveDB(db);
  res.json({ success: true });
});

// Settings Endpoints
app.get('/api/settings', (req: Request, res: Response) => {
  const db = getDB();
  res.json(db.settings || DEFAULT_DATA.settings);
});

app.put('/api/settings', (req: Request, res: Response) => {
  const db = getDB();
  db.settings = { ...db.settings, ...req.body };
  saveDB(db);
  res.json(db.settings);
});

// Users Endpoints
app.get('/api/users', (req: Request, res: Response) => {
  const db = getDB();
  res.json(db.users || []);
});

app.post('/api/users', (req: Request, res: Response) => {
  const db = getDB();
  const newUser = { id: `user-${Date.now()}`, ...req.body };
  db.users.push(newUser);
  saveDB(db);
  res.status(201).json(newUser);
});

app.put('/api/users/:id', (req: Request, res: Response) => {
  const db = getDB();
  const { id } = req.params;
  const index = db.users.findIndex((u: any) => u.id === id);
  if (index !== -1) {
    db.users[index] = { ...db.users[index], ...req.body };
    saveDB(db);
    res.json(db.users[index]);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.delete('/api/users/:id', (req: Request, res: Response) => {
  const db = getDB();
  const { id } = req.params;
  db.users = db.users.filter((u: any) => u.id !== id);
  saveDB(db);
  res.json({ success: true });
});

// Auth Endpoint
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const db = getDB();
  if (username === db.settings.adminUsername && password === db.settings.adminPassword) {
    res.json({ success: true, user: { username, role: 'Administrator' } });
  } else {
    res.status(401).json({ success: false, error: 'Invalid username or password' });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 ZacTEK Express Backend running at http://localhost:${PORT}`);
});
