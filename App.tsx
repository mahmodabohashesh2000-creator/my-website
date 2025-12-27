
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  User, 
  UserRole, 
  Permission, 
  CompanyInfo, 
  Invoice, 
  Party, 
  Product, 
  TreasuryTransaction, 
  AccountTransfer,
  InvoiceType
} from './types';
import { INITIAL_USER, INITIAL_COMPANY, NAVIGATION_ITEMS } from './constants';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import InvoiceManager from './components/InvoiceManager';
import InventoryManager from './components/InventoryManager';
import StatementManager from './components/StatementManager';
import TreasuryManager from './components/TreasuryManager';
import ReportsManager from './components/ReportsManager';
import SettingsManager from './components/SettingsManager';

const App: React.FC = () => {
  // Persistence Logic
  const load = (key: string, def: any) => {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : def;
  };

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Permission>(Permission.DASHBOARD);
  const [lastSaved, setLastSaved] = useState<string>(new Date().toLocaleTimeString());
  
  // App State
  const [users, setUsers] = useState<User[]>(() => load('users', [INITIAL_USER]));
  const [company, setCompany] = useState<CompanyInfo>(() => load('company', INITIAL_COMPANY));
  const [invoices, setInvoices] = useState<Invoice[]>(() => load('invoices', []));
  const [parties, setParties] = useState<Party[]>(() => load('parties', []));
  const [products, setProducts] = useState<Product[]>(() => load('products', []));
  const [treasury, setTreasury] = useState<TreasuryTransaction[]>(() => load('treasury', []));
  const [transfers, setTransfers] = useState<AccountTransfer[]>(() => load('transfers', []));

  // Sync with LocalStorage and update status
  useEffect(() => { 
    localStorage.setItem('users', JSON.stringify(users)); 
    localStorage.setItem('company', JSON.stringify(company));
    localStorage.setItem('invoices', JSON.stringify(invoices));
    localStorage.setItem('parties', JSON.stringify(parties));
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('treasury', JSON.stringify(treasury));
    localStorage.setItem('transfers', JSON.stringify(transfers));
    setLastSaved(new Date().toLocaleTimeString());
  }, [users, company, invoices, parties, products, treasury, transfers]);

  const handleLogin = (user: User) => setCurrentUser(user);
  const handleLogout = () => setCurrentUser(null);

  // Computed data for Dashboard
  const totals = useMemo(() => {
    let customerDebt = 0;
    let supplierDebt = 0;
    
    parties.forEach(p => {
      const pInvoices = invoices.filter(i => i.partyCode === p.code);
      let balance = p.initialBalance;

      pInvoices.forEach(inv => {
        const remaining = inv.totalAmount - inv.paidAmount;
        if (inv.type === InvoiceType.SALE) balance += remaining;
        if (inv.type === InvoiceType.PURCHASE) balance -= remaining;
        if (inv.type === InvoiceType.SALE_RETURN) balance -= remaining;
        if (inv.type === InvoiceType.PURCHASE_RETURN) balance += remaining;
      });

      transfers.forEach(t => {
        if (t.fromPartyCode === p.code) balance -= t.amount;
        if (t.toPartyCode === p.code) balance += t.amount;
      });

      if (balance > 0) customerDebt += balance;
      else supplierDebt += Math.abs(balance);
    });

    const inventoryValue = products.reduce((acc, prod) => {
      const bought = invoices.filter(i => i.type === InvoiceType.PURCHASE).flatMap(i => i.items).filter(it => it.productCode === prod.code).reduce((a,b) => a + b.qty, 0);
      const sold = invoices.filter(i => i.type === InvoiceType.SALE).flatMap(i => i.items).filter(it => it.productCode === prod.code).reduce((a,b) => a + b.qty, 0);
      const currentQty = prod.initialQty + bought - sold;
      return acc + (currentQty * prod.price);
    }, 0);

    return { customerDebt, supplierDebt, inventoryValue };
  }, [parties, invoices, products, transfers]);

  if (!currentUser) {
    return <Login users={users} onLogin={handleLogin} company={company} />;
  }

  const renderContent = () => {
    const wrapInWin = (title: string, component: React.ReactNode) => (
      <div className="win-card flex-1 flex flex-col h-full">
        <div className="win-title-bar">
          <span>{title}</span>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          {component}
        </div>
      </div>
    );

    switch (activeTab) {
      case Permission.DASHBOARD: 
        return wrapInWin('لوحة المعلومات (Dashboard)', <Dashboard totals={totals} invoices={invoices} products={products} />);
      case Permission.SALES:
        return wrapInWin('فاتورة مبيعات', <InvoiceManager type={activeTab} invoices={invoices} setInvoices={setInvoices} parties={parties} products={products} company={company} />);
      case Permission.PURCHASES:
        return wrapInWin('فاتورة مشتريات', <InvoiceManager type={activeTab} invoices={invoices} setInvoices={setInvoices} parties={parties} products={products} company={company} />);
      case Permission.RETURNS:
        return wrapInWin('المرتجعات', <InvoiceManager type={activeTab} invoices={invoices} setInvoices={setInvoices} parties={parties} products={products} company={company} />);
      case Permission.INVENTORY:
        return wrapInWin('المخزن (Inventory)', <InventoryManager products={products} setProducts={setProducts} invoices={invoices} />);
      case Permission.STATEMENTS:
        return wrapInWin('كشوف الحسابات', <StatementManager parties={parties} setParties={setParties} invoices={invoices} transfers={transfers} setTransfers={setTransfers} />);
      case Permission.TREASURY:
        return wrapInWin('الخزينة (Cash)', <TreasuryManager treasury={treasury} setTreasury={setTreasury} />);
      case Permission.REPORTS:
        return wrapInWin('التقارير (Reports)', <ReportsManager invoices={invoices} products={products} treasury={treasury} parties={parties} />);
      case Permission.SETTINGS:
        return wrapInWin('إعدادات النظام', <SettingsManager users={users} setUsers={setUsers} company={company} setCompany={setCompany} currentUser={currentUser} />);
      default:
        return wrapInWin('الرئيسية', <Dashboard totals={totals} invoices={invoices} products={products} />);
    }
  };

  const handleQuickBackup = () => {
    const data = { users, company, invoices, parties, products, treasury, transfers };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart_erp_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="flex h-screen bg-[#3A6EA5] overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={currentUser} 
        company={company}
        onQuickBackup={handleQuickBackup}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar user={currentUser} onLogout={handleLogout} lastSaved={lastSaved} />
        <main className="flex-1 overflow-hidden p-1 no-print">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
