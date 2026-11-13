import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { InvoiceData } from '@/types/invoice';

export interface UserAccount {
  id: string;
  email: string;
  passwordHash: string;
  businessName: string;
  pan: string;
  phone: string;
  address: string;
  logoUrl?: string;
  role: 'user' | 'admin';
  isPro?: boolean;
  proExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  adsenseClientId: string;
  adsenseSlotId: string;
  adsEnabled: boolean;
  proPriceMonthlyNpr: number;
  proPriceYearlyNpr: number;
  adminFonepayQr?: string;
  adminEsewaId?: string;
  fiscalYear: string;
}

export interface CatalogItem {
  id: string;
  userId: string;
  name: string;
  rate: number;
  unit?: string;
  category?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'tax' | 'alert' | 'update' | 'info';
  active: boolean;
  createdAt: string;
}

export interface UserSession {
  token: string;
  userId: string;
  expiresAt: string;
}

export interface DatabaseSchema {
  users: UserAccount[];
  invoices: {
    id: string;
    userId: string;
    invoiceNumber: string;
    invoice: InvoiceData;
    createdAt: string;
    updatedAt: string;
  }[];
  catalog: CatalogItem[];
  notifications: NotificationItem[];
  sessions: UserSession[];
  settings: AppSettings;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'quickbill_db.json');

// Initial sample data including standard Nepal tax notification
const INITIAL_DB: DatabaseSchema = {
  users: [
    {
      id: 'admin_1',
      email: 'admin@quickbillnepal.com',
      passwordHash: hashPassword('admin777'),
      businessName: 'QuickBill Nepal Admin Desk',
      pan: '100000001',
      phone: '+977 9801234567',
      address: 'Putalisadak, Kathmandu',
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],
  invoices: [],
  catalog: [
    {
      id: 'cat_1',
      userId: 'admin_1',
      name: 'Professional Consulting / Advisory Service',
      rate: 5000,
      unit: 'hr',
      category: 'Services',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cat_2',
      userId: 'admin_1',
      name: 'Website Design & Development Package',
      rate: 35000,
      unit: 'project',
      category: 'Software',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cat_3',
      userId: 'admin_1',
      name: 'Commercial Photography & Editing Session',
      rate: 15000,
      unit: 'session',
      category: 'Creative',
      createdAt: new Date().toISOString(),
    }
  ],
  notifications: [
    {
      id: 'notif_1',
      title: '🇳🇵 IRD Notice: Monthly VAT Return Filing',
      message: 'Reminder for VAT-registered firms: VAT returns and tax payments must be filed by the 25th of every Nepali month.',
      type: 'tax',
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif_2',
      title: '✨ New Feature: Embedded Fonepay & eSewa QR Stands',
      message: 'You can now upload your counter QR stand photo or auto-generate scan-to-pay QRs with exact NPR payable amounts.',
      type: 'update',
      active: true,
      createdAt: new Date().toISOString(),
    }
  ],
  sessions: [],
  settings: {
    adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '',
    adsenseSlotId: '1234567890',
    adsEnabled: true,
    proPriceMonthlyNpr: 199,
    proPriceYearlyNpr: 1999,
    adminEsewaId: '9801234567',
    fiscalYear: '2081/82',
  }
};

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_quickbill_nepal_salt_2081').digest('hex');
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function ensureDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
      return INITIAL_DB;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return {
      users: parsed.users || [],
      invoices: parsed.invoices || [],
      catalog: parsed.catalog || [],
      notifications: parsed.notifications || [],
      sessions: parsed.sessions || [],
      settings: parsed.settings || INITIAL_DB.settings,
    };
  } catch (err) {
    console.error('Database load error, resetting to initial', err);
    return INITIAL_DB;
  }
}

export function saveDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save database', err);
  }
}

// User Helpers
export function getUserByEmail(email: string): UserAccount | null {
  const db = ensureDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
}

export function getUserById(id: string): UserAccount | null {
  const db = ensureDb();
  return db.users.find((u) => u.id === id) || null;
}

export function createUser(userData: Omit<UserAccount, 'id' | 'createdAt' | 'updatedAt'>): UserAccount {
  const db = ensureDb();
  const newUser: UserAccount = {
    ...userData,
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  saveDb(db);
  return newUser;
}

export function updateUser(id: string, updates: Partial<UserAccount>): UserAccount | null {
  const db = ensureDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  db.users[index] = {
    ...db.users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDb(db);
  return db.users[index];
}

// Session Helpers
export function createSession(userId: string): string {
  const db = ensureDb();
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
  db.sessions.push({ token, userId, expiresAt });
  saveDb(db);
  return token;
}

export function getUserByToken(token: string): UserAccount | null {
  const db = ensureDb();
  const session = db.sessions.find((s) => s.token === token && new Date(s.expiresAt) > new Date());
  if (!session) return null;
  return getUserById(session.userId);
}

export function removeSession(token: string): void {
  const db = ensureDb();
  db.sessions = db.sessions.filter((s) => s.token !== token);
  saveDb(db);
}

// Invoices Helpers
export function getUserInvoices(userId: string): DatabaseSchema['invoices'] {
  const db = ensureDb();
  return db.invoices.filter((inv) => inv.userId === userId);
}

export function saveUserInvoice(userId: string, invoice: InvoiceData): void {
  const db = ensureDb();
  const existingIdx = db.invoices.findIndex((inv) => inv.userId === userId && inv.invoice.id === invoice.id);
  const record = {
    id: invoice.id,
    userId,
    invoiceNumber: invoice.invoiceNumber,
    invoice,
    createdAt: invoice.invoiceDateAD || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    db.invoices[existingIdx] = record;
  } else {
    db.invoices.unshift(record);
  }
  saveDb(db);
}

export function deleteUserInvoice(userId: string, invoiceId: string): void {
  const db = ensureDb();
  db.invoices = db.invoices.filter((inv) => !(inv.userId === userId && inv.id === invoiceId));
  saveDb(db);
}

// Catalog Helpers
export function getUserCatalog(userId: string): CatalogItem[] {
  const db = ensureDb();
  return db.catalog.filter((c) => c.userId === userId || c.userId === 'admin_1');
}

export function addCatalogItem(userId: string, item: Omit<CatalogItem, 'id' | 'userId' | 'createdAt'>): CatalogItem {
  const db = ensureDb();
  const newItem: CatalogItem = {
    ...item,
    id: `item_${Date.now()}`,
    userId,
    createdAt: new Date().toISOString(),
  };
  db.catalog.unshift(newItem);
  saveDb(db);
  return newItem;
}

export function deleteCatalogItem(userId: string, itemId: string): void {
  const db = ensureDb();
  db.catalog = db.catalog.filter((c) => !(c.id === itemId && c.userId === userId));
  saveDb(db);
}

// Notifications Helpers
export function getActiveNotifications(): NotificationItem[] {
  const db = ensureDb();
  return db.notifications.filter((n) => n.active);
}

export function getAllNotifications(): NotificationItem[] {
  const db = ensureDb();
  return db.notifications;
}

export function addNotification(notice: Omit<NotificationItem, 'id' | 'createdAt'>): NotificationItem {
  const db = ensureDb();
  const newNotice: NotificationItem = {
    ...notice,
    id: `notif_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.notifications.unshift(newNotice);
  saveDb(db);
  return newNotice;
}

export function toggleNotification(id: string, active: boolean): void {
  const db = ensureDb();
  const notice = db.notifications.find((n) => n.id === id);
  if (notice) {
    notice.active = active;
    saveDb(db);
  }
}

export function deleteNotification(id: string): void {
  const db = ensureDb();
  db.notifications = db.notifications.filter((n) => n.id !== id);
  saveDb(db);
}

// Settings Helpers
export function getSettings(): AppSettings {
  const db = ensureDb();
  return db.settings || INITIAL_DB.settings;
}

export function updateSettings(updates: Partial<AppSettings>): AppSettings {
  const db = ensureDb();
  db.settings = {
    ...db.settings,
    ...updates,
  };
  saveDb(db);
  return db.settings;
}

export function toggleUserPro(userId: string, isPro: boolean): UserAccount | null {
  const db = ensureDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return null;
  user.isPro = isPro;
  if (isPro) {
    user.proExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  } else {
    user.proExpiresAt = undefined;
  }
  user.updatedAt = new Date().toISOString();
  saveDb(db);
  return user;
}

// Admin Stats
export function getAdminStats() {
  const db = ensureDb();
  const totalBilled = db.invoices.reduce((sum, inv) => sum + (inv.invoice?.grandTotal || 0), 0);
  const totalPaid = db.invoices
    .filter((inv) => inv.invoice?.status === 'paid')
    .reduce((sum, inv) => sum + (inv.invoice?.grandTotal || 0), 0);
  const totalPro = db.users.filter((u) => u.isPro).length;

  return {
    totalUsers: db.users.filter((u) => u.role !== 'admin').length,
    totalPro,
    totalInvoices: db.invoices.length,
    totalBilled,
    totalPaid,
    totalCatalogItems: db.catalog.length,
    activeNotifications: db.notifications.filter((n) => n.active).length,
    settings: db.settings,
    users: db.users.map((u) => ({
      id: u.id,
      email: u.email,
      businessName: u.businessName,
      pan: u.pan,
      phone: u.phone,
      isPro: !!u.isPro,
      createdAt: u.createdAt,
    })),
    notifications: db.notifications,
  };
}
