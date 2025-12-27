
import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Receipt, 
  Undo2, 
  RotateCcw, 
  Package, 
  Users, 
  Wallet, 
  FileText, 
  Settings,
  ArrowRightLeft
} from 'lucide-react';
import { Permission, UserRole, User, CompanyInfo } from './types';

export const INITIAL_USER: User = {
  id: '1',
  username: 'admin',
  password: '320521',
  role: UserRole.ADMIN,
  permissions: Object.values(Permission)
};

export const INITIAL_COMPANY: CompanyInfo = {
  name: 'شركة سمارت سيستم',
  phone: '0123456789',
  whatsapp: '0123456789',
  address: 'القاهرة، مصر',
  commercialReg: '1234567',
  taxId: '987-654-321'
};

export const NAVIGATION_ITEMS = [
  { id: Permission.DASHBOARD, label: 'الرئيسية', icon: <LayoutDashboard size={20} /> },
  { id: Permission.SALES, label: 'المبيعات', icon: <ShoppingCart size={20} /> },
  { id: Permission.PURCHASES, label: 'المشتريات', icon: <Receipt size={20} /> },
  { id: Permission.RETURNS, label: 'المرتجعات', icon: <Undo2 size={20} /> },
  { id: Permission.INVENTORY, label: 'المخزن', icon: <Package size={20} /> },
  { id: Permission.STATEMENTS, label: 'كشوف الحسابات', icon: <Users size={20} /> },
  { id: Permission.TREASURY, label: 'الخزينة', icon: <Wallet size={20} /> },
  { id: Permission.REPORTS, label: 'التقارير', icon: <FileText size={20} /> },
  { id: Permission.SETTINGS, label: 'الإعدادات', icon: <Settings size={20} /> },
];

export const CATEGORIES = ['VIP', 'جملة', 'قطاعي', 'مورد رئيسي', 'مورد ثانوي'];
