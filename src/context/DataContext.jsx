import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(null);

const DEFAULT_SETTINGS = {
  companyName: "ZacTEK Corp W.L.L",
  companyArabic: "شركة زاك تك كورب ذ.م.م",
  managerName: "Kumar",
  managerRole: "Marketing Manager",
  phone: "+965 60607922",
  email: "zactekaccouts@gmail.com",
  address: "Abdulla Mutlaq Al Musalim Street, Mubarak Commercial Complex 2, Jleeb Al-Shuyoukh, Kuwait",
  adminUsername: "admin",
  adminPassword: "admin123"
};

const DEFAULT_CATEGORIES = [
  { id: "cat-1", name: "Apparel & Garments", description: "Premium quality clothing, shirts, innerwear, and uniforms." },
  { id: "cat-2", name: "Corporate Services", description: "Connecting solutions and business consulting services." },
  { id: "cat-3", name: "Environmental Services", description: "Professional sanitization and environmental solutions." }
];

const DEFAULT_SUBCATEGORIES = [
  { id: "subcat-1", categoryId: "cat-1", name: "Polo T-Shirts", description: "Premium polo shirts and casual wear." },
  { id: "subcat-2", categoryId: "cat-1", name: "Innerwear & Vests", description: "Combed cotton innerwear, briefs, and vests." },
  { id: "subcat-3", categoryId: "cat-2", name: "General Trading", description: "General wholesale items and trading logistics." },
  { id: "subcat-4", categoryId: "cat-3", name: "Sea Shark Services", description: "Specialized waste management and eco-consultancy." }
];

const DEFAULT_ITEMS = [
  {
    id: "item-1",
    name: "ONN Premium Polo T-Shirt",
    brand: "ONN Premiums",
    categoryId: "cat-1",
    subcategoryId: "subcat-1",
    sizes: ["M", "L", "XL", "XXL"],
    description: "High-quality premium polo neck t-shirt. Soft, breathable knit fabric ideal for casual wear, client meetings, and daily comfort. Expertly manufactured for high durability.",
    imageUrl: "/images/polo_tshirt.jpg",
    price: "Wholesale (Contact for Quote)",
    details: {
      origin: "Made in India",
      fabric: "Polo Knit Blend",
      packaging: "Single premium retail seal"
    }
  },
  {
    id: "item-2",
    name: "ONN Premium Men's Vest (3 PC Pack)",
    brand: "ONN Premiums",
    categoryId: "cat-1",
    subcategoryId: "subcat-2",
    sizes: ["S", "M", "L"],
    description: "100% Combed Cotton premium men's vest. Standard rib knit structure ensures perfect fit, high stretchability, and long-lasting durability. Pack of 3 pieces with free pen inside.",
    imageUrl: "/images/mens_vest.jpg",
    price: "Wholesale (Contact for Quote)",
    details: {
      origin: "Made in India",
      fabric: "100% Combed Cotton",
      packaging: "3-Pack Polybag with promotional pen"
    }
  }
];

export const DataProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('zactek_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('zactek_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [subcategories, setSubcategories] = useState(() => {
    const saved = localStorage.getItem('zactek_subcategories');
    return saved ? JSON.parse(saved) : DEFAULT_SUBCATEGORIES;
  });

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('zactek_items');
    return saved ? JSON.parse(saved) : DEFAULT_ITEMS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('zactek_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('zactek_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('zactek_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('zactek_subcategories', JSON.stringify(subcategories));
  }, [subcategories]);

  useEffect(() => {
    localStorage.setItem('zactek_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('zactek_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('zactek_session');
    }
  }, [currentUser]);

  // Auth Operations
  const login = (username, password) => {
    if (username === settings.adminUsername && password === settings.adminPassword) {
      setCurrentUser({ username });
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Helper selectors
  const getSubcategoriesByCategoryId = (catId) => {
    return subcategories.filter(sc => sc.categoryId === catId);
  };

  const getItemsBySubcategoryId = (subcatId) => {
    return items.filter(item => item.subcategoryId === subcatId);
  };

  const getItemsByCategoryId = (catId) => {
    return items.filter(item => item.categoryId === catId);
  };

  return (
    <DataContext.Provider value={{
      settings, setSettings,
      categories, setCategories,
      subcategories, setSubcategories,
      items, setItems,
      currentUser, login, logout,
      getSubcategoriesByCategoryId,
      getItemsBySubcategoryId,
      getItemsByCategoryId
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
