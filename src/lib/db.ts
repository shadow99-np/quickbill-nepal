import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { InvoiceData, ClientProfile, PaymentDetails } from '@/types/invoice';

export interface UserAccount {
  id: string;
  email: string;
  username?: string;
  passwordHash: string;
  businessName: string;
  pan: string;
  phone: string;
  address: string;
  logoUrl?: string;
  payment?: PaymentDetails;
  clients?: ClientProfile[];
  defaultNotes?: string;
  defaultTerms?: string;
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
  adminEsewaName?: string;
  adminEsewaQr?: string;
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

const IS_SERVERLESS = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.NETLIFY ||
  process.env.LAMBDA_TASK_ROOT
);

const DATA_DIR = path.join(process.cwd(), 'data');
const BUNDLED_DB_FILE = path.join(DATA_DIR, 'quickbill_db.json');
const WRITABLE_DB_FILE = IS_SERVERLESS ? path.join('/tmp', 'quickbill_db.json') : BUNDLED_DB_FILE;

let memoryDb: DatabaseSchema | null = null;

// Initial sample data including standard Nepal tax notification
const INITIAL_DB: DatabaseSchema = {
  users: [
    {
      id: 'admin_1',
      email: 'admin@quickbillnepal.com',
      passwordHash: hashPassword('shadow@admin1239'),
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
    adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-4195575830261385',
    adsenseSlotId: '1234567890',
    adsEnabled: true,
    proPriceMonthlyNpr: 199,
    proPriceYearlyNpr: 1999,
    adminEsewaId: '9761033755',
    adminEsewaName: 'Pushkar Nepal',
    adminEsewaQr: '/images/esewa_pro_qr.jpg',
    fiscalYear: '2081/82',
  }
};

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_quickbill_nepal_salt_2081').digest('hex');
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function sanitizeDb(parsed: any): DatabaseSchema {
  const users: UserAccount[] = parsed.users || [];
  const adminIdx = users.findIndex((u: any) => u.role === 'admin' || u.id === 'admin_1');
  if (adminIdx === -1) {
    users.unshift(INITIAL_DB.users[0]);
  } else if (!users[adminIdx].passwordHash) {
    users[adminIdx].passwordHash = hashPassword('shadow@admin1239');
  }

  return {
    users,
    invoices: parsed.invoices || [],
    catalog: parsed.catalog || [],
    notifications: parsed.notifications || INITIAL_DB.notifications,
    sessions: parsed.sessions || [],
    settings: {
      ...INITIAL_DB.settings,
      ...(parsed.settings || {}),
    },
  };
}

function ensureDb(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }

  try {
    // 1. In serverless, check if /tmp/quickbill_db.json exists
    if (IS_SERVERLESS && fs.existsSync(WRITABLE_DB_FILE)) {
      const content = fs.readFileSync(WRITABLE_DB_FILE, 'utf-8');
      memoryDb = sanitizeDb(JSON.parse(content));
      return memoryDb;
    }

    // 2. Try reading bundled DB file
    if (fs.existsSync(BUNDLED_DB_FILE)) {
      const content = fs.readFileSync(BUNDLED_DB_FILE, 'utf-8');
      memoryDb = sanitizeDb(JSON.parse(content));

      if (IS_SERVERLESS) {
        try {
          fs.writeFileSync(WRITABLE_DB_FILE, JSON.stringify(memoryDb, null, 2), 'utf-8');
        } catch (e) {
          // ignore
        }
      }
      return memoryDb;
    }

    // 3. Fallback to INITIAL_DB
    memoryDb = sanitizeDb(INITIAL_DB);
    return memoryDb;
  } catch (err) {
    console.error('Database load error, resetting to initial', err);
    memoryDb = sanitizeDb(INITIAL_DB);
    return memoryDb;
  }
}

export function saveDb(data: DatabaseSchema): void {
  memoryDb = data;
  try {
    if (IS_SERVERLESS) {
      fs.writeFileSync(WRITABLE_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } else {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(BUNDLED_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Failed to save database', err);
  }
}

// User Helpers
export function getUserByEmail(email: string): UserAccount | null {
  const db = ensureDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
}

export function getUserByEmailOrUsername(identifier: string): UserAccount | null {
  const db = ensureDb();
  const cleaned = identifier.toLowerCase().trim().replace(/^@/, '');
  return (
    db.users.find(
      (u) =>
        u.email.toLowerCase() === cleaned ||
        (u.username && u.username.toLowerCase() === cleaned) ||
        u.email.split('@')[0].toLowerCase() === cleaned ||
        u.businessName.toLowerCase() === cleaned
    ) || null
  );
}

export function grantUserProByIdentifier(
  identifier: string,
  durationMonths: number = 12
): { success: boolean; user?: UserAccount; error?: string } {
  const db = ensureDb();
  const cleaned = identifier.toLowerCase().trim().replace(/^@/, '');
  const user = db.users.find(
    (u) =>
      u.email.toLowerCase() === cleaned ||
      (u.username && u.username.toLowerCase() === cleaned) ||
      u.email.split('@')[0].toLowerCase() === cleaned ||
      u.businessName.toLowerCase() === cleaned
  );
  if (!user) {
    return {
      success: false,
      error: `No business user found matching "${identifier}". Check email, username, or business name.`,
    };
  }

  user.isPro = true;
  if (durationMonths === 0) {
    // Lifetime Pro (100 years)
    user.proExpiresAt = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString();
  } else {
    const baseDate =
      user.proExpiresAt && new Date(user.proExpiresAt) > new Date()
        ? new Date(user.proExpiresAt).getTime()
        : Date.now();
    user.proExpiresAt = new Date(baseDate + durationMonths * 30 * 24 * 60 * 60 * 1000).toISOString();
  }
  user.updatedAt = new Date().toISOString();
  saveDb(db);
  return { success: true, user };
}

export function saveUserClient(userId: string, client: ClientProfile): ClientProfile[] {
  const db = ensureDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return [];
  if (!user.clients) user.clients = [];

  const existingIdx = user.clients.findIndex(
    (c) =>
      (client.pan && c.pan && client.pan.trim() === c.pan.trim()) ||
      (client.name && c.name.toLowerCase().trim() === client.name.toLowerCase().trim())
  );

  if (existingIdx >= 0) {
    user.clients[existingIdx] = { ...user.clients[existingIdx], ...client };
  } else if (client.name && client.name.trim()) {
    user.clients.unshift(client);
  }

  user.updatedAt = new Date().toISOString();
  saveDb(db);
  return user.clients;
}

export function getUserClients(userId: string): ClientProfile[] {
  const db = ensureDb();
  const user = db.users.find((u) => u.id === userId);
  return user?.clients || [];
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

// Session Helpers (Stateless Signed HMAC Tokens for Serverless + DB Session Fallback)
const SESSION_SECRET = process.env.ADMIN_SECRET || 'quickbill_nepal_secret_2081_key_auth';

export function createSession(userId: string): string {
  const expiresAtMs = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  const payloadObj = {
    userId,
    exp: expiresAtMs,
    created: Date.now(),
  };
  const payloadStr = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('hex');
  const token = `qb_${payloadStr}_${signature}`;

  try {
    const db = ensureDb();
    if (!db.sessions) db.sessions = [];
    db.sessions.push({
      token,
      userId,
      expiresAt: new Date(expiresAtMs).toISOString(),
    });
    saveDb(db);
  } catch (err) {
    // Continue even if disk write fails
  }

  return token;
}

export function getUserByToken(token: string): UserAccount | null {
  if (!token) return null;

  // 1. Verify stateless signed HMAC token (Works 100% on Vercel Serverless across all instances)
  if (token.startsWith('qb_')) {
    try {
      const parts = token.slice(3).split('_');
      if (parts.length === 2) {
        const [payloadStr, signature] = parts;
        const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('hex');
        if (signature === expectedSig) {
          const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
          if (payload.exp && Date.now() < payload.exp) {
            const user = getUserById(payload.userId);
            if (user) return user;
            if (payload.userId === 'admin_1') {
              const db = ensureDb();
              const admin = db.users.find((u) => u.role === 'admin' || u.id === 'admin_1');
              return admin || INITIAL_DB.users[0];
            }
          }
        }
      }
    } catch (err) {
      console.error('Error validating signed token:', err);
    }
  }

  // 2. Also check db.sessions table (for any legacy tokens)
  try {
    const db = ensureDb();
    const session = db.sessions?.find((s) => s.token === token && new Date(s.expiresAt) > new Date());
    if (session) {
      const user = getUserById(session.userId);
      if (user) return user;
      if (session.userId === 'admin_1') {
        return db.users.find((u) => u.role === 'admin' || u.id === 'admin_1') || INITIAL_DB.users[0];
      }
    }
  } catch (err) {
    // Ignore
  }

  return null;
}

export function removeSession(token: string): void {
  try {
    const db = ensureDb();
    db.sessions = (db.sessions || []).filter((s) => s.token !== token);
    saveDb(db);
  } catch (err) {
    // Ignore
  }
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
      username: u.username || u.email.split('@')[0],
      businessName: u.businessName,
      pan: u.pan,
      phone: u.phone,
      isPro: !!u.isPro,
      proExpiresAt: u.proExpiresAt,
      invoicesCount: db.invoices.filter((inv) => inv.userId === u.id).length,
      clientsCount: (u.clients || []).length,
      createdAt: u.createdAt,
    })),
    notifications: db.notifications,
  };
}

export function updateAdminPassword(newPassword: string): boolean {
  const db = ensureDb();
  const adminIndex = db.users.findIndex((u) => u.role === 'admin' || u.id === 'admin_1');
  if (adminIndex === -1) return false;
  db.users[adminIndex].passwordHash = hashPassword(newPassword);
  db.users[adminIndex].updatedAt = new Date().toISOString();
  saveDb(db);
  return true;
}

