import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  Plus,
  Search,
  TrendingDown,
  Settings,
  Printer,
  BarChart3,
  DollarSign,
  Brain,
  Link,
  ShieldAlert,
  Activity,
  Globe
} from 'lucide-react';
import type { Medicine } from './hooks/useInventory';
import { useInventory } from './hooks/useInventory';
import InventoryTable from './components/InventoryTable';
import MedicineForm from './components/MedicineForm';
import ReportsView from './components/ReportsView';
import PredictionsDashboard from './components/PredictionsDashboard';
import SubstitutesFinder from './components/SubstitutesFinder';
import InteractionChecker from './components/InteractionChecker';
import SplashWelcome from './components/SplashWelcome';
import MultiPharmacySearch from './components/MultiPharmacySearch';
import ExpiryManagement from './components/ExpiryManagement';
import StockAnalysis from './components/StockAnalysis';

import './index.css';

const NavItem = ({ icon, label, active = false, count = 0, onClick, className }: { icon: React.ReactNode, label: string, active?: boolean, count?: number, onClick?: () => void, className?: string }) => (
  <div
    onClick={onClick}
    className={className}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      borderRadius: 'var(--radius-md)',
      color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
      background: active ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}>
    {icon}
    <span style={{ fontWeight: active ? 600 : 400 }}>{label}</span>
    {count > 0 && (
      <span style={{
        marginLeft: 'auto',
        background: 'var(--accent-alert)',
        color: 'white',
        fontSize: '0.75rem',
        padding: '0.125rem 0.5rem',
        borderRadius: '1rem',
        fontWeight: 700
      }}>
        {count}
      </span>
    )}
  </div>
);

const StatsCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) => (
  <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>{title}</div>
      <div style={{ fontSize: '2rem', fontWeight: 800 }}>{value}</div>
    </div>
    <div style={{
      position: 'absolute',
      right: '-10px',
      bottom: '-10px',
      color: color,
      opacity: 0.1,
      transform: 'scale(1.5)'
    }}>
      {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { size: 64 })}
    </div>
  </div>
);

const App: React.FC = () => {
  const {
    inventory,
    salesHistory,
    aiInsights,
    getMedicinePredictions,
    generateMockHistory,
    addMedicine,
    updateMedicine,
    deleteMedicine
  } = useInventory();

  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'expiry' | 'stock' | 'settings' | 'reports' | 'predictions' | 'substitutes' | 'interactions' | 'network'>('dashboard');
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [pharmacyName, setPharmacyName] = useState('PharmaPro');

  // Derived metrics
  const totalItems = inventory.length;
  const expiringSoonItems = inventory.filter(m => {
    const expiry = new Date(m.expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    return diffDays > 0 && diffDays <= 30;
  });

  const expiredItems = inventory.filter(m => new Date(m.expiryDate) < new Date());
  const lowStockItems = inventory.filter(m => m.quantity <= m.minStock);

  const expiringSoonCount = expiringSoonItems.length;
  const lowStockCount = lowStockItems.length;
  const expiredCount = expiredItems.length;
  const totalInventoryValue = inventory.reduce((sum, m) => sum + (m.quantity * m.price), 0);
  
  const today = new Date().toDateString();
  const dailyMedicinesCount = inventory.filter(m => new Date(m.lastUpdated).toDateString() === today).length;

  const filteredInventory = inventory.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClick = () => {
    setEditingMedicine(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setIsFormOpen(true);
  };

  const handleSave = (data: any) => {
    if (editingMedicine) {
      updateMedicine(editingMedicine.id, data);
    } else {
      addMedicine(data);
    }
    setIsFormOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="animate-up">
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              <StatsCard title="Total Medicines" value={totalItems} icon={<Package />} color="var(--accent-primary)" />
              <StatsCard title="Inv. Value" value={`$${Math.round(totalInventoryValue)}`} icon={<DollarSign />} color="var(--accent-secondary)" />
              <StatsCard title="Low Stock" value={lowStockCount} icon={<TrendingDown />} color="var(--accent-alert)" />
              <StatsCard title="Daily Updates" value={dailyMedicinesCount} icon={<Activity />} color="var(--accent-extra)" />
            </section>

            <section className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Recent Inventory</h3>
                <button onClick={() => setActiveTab('inventory')} style={{ background: 'transparent', color: 'var(--accent-primary)', fontWeight: 600 }}>View All</button>
              </div>
              <InventoryTable
                inventory={filteredInventory.slice(0, 5)}
                onEdit={handleEditClick}
                onDelete={deleteMedicine}
              />
            </section>
          </div>
        );
      case 'inventory':
        return (
          <section className="glass animate-up" style={{ borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>Full Inventory</h3>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Showing {filteredInventory.length} items</span>
              </div>
              <button
                onClick={handlePrint}
                className="no-print"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Printer size={18} />
                Print Report
              </button>
            </div>
            {filteredInventory.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '4rem' }}>
                <Package size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                <p>{searchTerm ? 'No results found for your search.' : 'No medicines in inventory.'}</p>
              </div>
            ) : (
              <InventoryTable
                inventory={filteredInventory}
                onEdit={handleEditClick}
                onDelete={deleteMedicine}
              />
            )}
          </section>
        );
      case 'expiry':
        return <ExpiryManagement inventory={inventory} onDelete={deleteMedicine} />;
      case 'stock':
        return <StockAnalysis inventory={inventory} salesHistory={salesHistory} />;
      case 'settings':
        return (
          <section className="glass animate-up" style={{ borderRadius: 'var(--radius-xl)', padding: '2.5rem', maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '2rem' }}>System Settings</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pharmacy Profile</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '1rem', fontWeight: 500 }}>Pharmacy Name</label>
                  <input
                    type="text"
                    className="glass"
                    value={pharmacyName}
                    onChange={e => setPharmacyName(e.target.value)}
                    style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', maxWidth: '400px' }}
                  />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>This name will appear in the sidebar and reports.</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Preferences</h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Low Stock Warning</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Get alerts when items are below minimum stock</div>
                  </div>
                  <div style={{ width: '40px', height: '20px', background: 'var(--accent-secondary)', borderRadius: '10px', position: 'relative' }}>
                    <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      case 'reports':
        return <ReportsView inventory={inventory} salesHistory={salesHistory} />;
      case 'substitutes':
        return <SubstitutesFinder inventory={inventory} />;
      case 'interactions':
        return <InteractionChecker inventory={inventory} />;
      case 'predictions':
        return (
          <PredictionsDashboard
            inventory={inventory}
            salesHistory={salesHistory}
            aiInsights={aiInsights}
            getMedicinePredictions={getMedicinePredictions}
            generateMockHistory={generateMockHistory}
          />
        );
      case 'network':
        return <MultiPharmacySearch inventory={inventory} />;
    }
  };

  if (!hasSeenWelcome) {
    return <SplashWelcome onEnter={() => setHasSeenWelcome(true)} />;
  }

  return (
    <div className="app-container animate-fade" style={{ display: 'flex', minHeight: '100vh', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <aside className="glass" style={{ width: '280px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', borderRight: '1px solid var(--border-color)', position: 'sticky', top: 0, height: '100vh', background: 'rgba(2, 6, 23, 0.4)' }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-primary)', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-extra))',
            padding: '0.625rem',
            borderRadius: '0.75rem',
            color: 'white',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
          }}>
            <Package size={24} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em' }}>{pharmacyName}</h2>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Brain size={20} />} className={activeTab === 'predictions' ? "text-gradient" : ""} label="AI Insights" active={activeTab === 'predictions'} onClick={() => setActiveTab('predictions')} count={aiInsights.filter(i => i.severity === 'critical').length} />
          <NavItem icon={<Package size={20} />} label="Inventory" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
          <NavItem icon={<Globe size={20} />} label="Network Search" active={activeTab === 'network'} onClick={() => setActiveTab('network')} />
          <NavItem icon={<AlertTriangle size={20} />} label="Expiry Alerts" active={activeTab === 'expiry'} onClick={() => setActiveTab('expiry')} count={expiredCount + expiringSoonCount} />
          <NavItem icon={<TrendingDown size={20} />} label="Stock Reports" active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} count={lowStockCount} />
          <NavItem icon={<Link size={20} />} label="Substitute Finder" active={activeTab === 'substitutes'} onClick={() => setActiveTab('substitutes')} />
          <NavItem icon={<ShieldAlert size={20} />} label="Drug Interactions" active={activeTab === 'interactions'} onClick={() => setActiveTab('interactions')} />
          <NavItem icon={<BarChart3 size={20} />} label="Analytics & Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
              {activeTab === 'dashboard' && "Welcome back"}
              {activeTab === 'inventory' && "Medicine Inventory"}
              {activeTab === 'expiry' && "Expiry Management"}
              {activeTab === 'stock' && "Stock Analysis"}
              {activeTab === 'reports' && "Analytics & Reports"}
              {activeTab === 'settings' && "System Settings"}
              {activeTab === 'predictions' && "AI Predictions"}
              {activeTab === 'substitutes' && "Substitute Finder"}
              {activeTab === 'interactions' && "Drug Interactions"}
              {activeTab === 'network' && "Global Pharmacy Network"}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
              {activeTab === 'dashboard' && "Here's what's happening with your inventory today."}
              {activeTab !== 'dashboard' && `Management and overview of your ${activeTab} section.`}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-lg)', gap: '0.75rem', width: '320px' }}>
              <Search size={20} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search medicines..."
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '0.925rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleAddClick}
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-extra))',
                color: 'white',
                padding: '0.75rem 1.75rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                fontWeight: 700,
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
              }}>
              <Plus size={20} />
              Add Medicine
            </button>
          </div>
        </header>

        {renderContent()}

        {isFormOpen && (
          <MedicineForm
            onClose={() => setIsFormOpen(false)}
            onSave={handleSave}
            initialData={editingMedicine}
          />
        )}
      </main>
    </div>
  );
};

export default App;

