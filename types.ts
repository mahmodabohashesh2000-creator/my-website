
export enum UserRole {
  ADMIN = 'ADMIN',
  ACCOUNTANT = 'ACCOUNTANT'
}

export enum Permission {
  DASHBOARD = 'DASHBOARD',
  SALES = 'SALES',
  PURCHASES = 'PURCHASES',
  RETURNS = 'RETURNS',
  INVENTORY = 'INVENTORY',
  STATEMENTS = 'STATEMENTS',
  TREASURY = 'TREASURY',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS'
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  permissions: Permission[];
}

export interface CompanyInfo {
  name: string;
  phone: string;
  whatsapp: string;
  address: string;
  commercialReg: string;
  taxId: string;
  logo?: string;
}

export enum PartyType {
  CUSTOMER = 'CUSTOMER',
  SUPPLIER = 'SUPPLIER'
}

export interface Party {
  id: string;
  code: string;
  name: string;
  type: PartyType;
  category: string;
  initialBalance: number; // Positive = Debit, Negative = Credit
  phone?: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  initialQty: number;
  initialValue: number;
  price: number;
}

export enum InvoiceType {
  SALE = 'SALE',
  PURCHASE = 'PURCHASE',
  SALE_RETURN = 'SALE_RETURN',
  PURCHASE_RETURN = 'PURCHASE_RETURN'
}

export interface InvoiceItem {
  id: string;
  productCode: string;
  productName: string;
  qty: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  type: InvoiceType;
  date: string;
  partyCode: string;
  items: InvoiceItem[];
  totalAmount: number;
  paidAmount: number;
  notes: string;
  template: 'classic' | 'minimal' | 'modern';
}

export interface TreasuryTransaction {
  id: string;
  date: string;
  description: string;
  amount: number; // Positive = In, Negative = Out
  type: 'INCOME' | 'EXPENSE' | 'PAYMENT';
  partyCode?: string;
}

export interface AccountTransfer {
  id: string;
  date: string;
  fromPartyCode: string;
  toPartyCode: string;
  amount: number;
  reason: string;
}
