import React, { useState } from 'react';
import {
    AlertCircle,
    Download,
    Package,
    ArrowDown,
    Calendar,
    Activity,
    PieChart,
    BarChart3,
    TrendingUp
} from 'lucide-react';
import type { Medicine, SaleRecord } from '../hooks/useInventory';

interface Props {
    inventory: Medicine[];
    salesHistory: SaleRecord[];
}

const ReportsView: React.FC<Props> = ({ inventory, salesHistory }) => {
    const [activeReport, setActiveReport] = useState<'daily' | 'inventory' | 'alerts' | 'sales'>('daily');

    // Daily Report Data
    const today = new Date().toDateString();
    const dailyMedicines = inventory.filter(m => new Date(m.lastUpdated).toDateString() === today);
    const dailyAddedStockCount = dailyMedicines.reduce((sum, m) => sum + m.quantity, 0);
    const dailyAddedStockValue = dailyMedicines.reduce((sum, m) => sum + (m.quantity * m.price), 0);

    // Inventory Data
    const totalStockCount = inventory.reduce((sum, m) => sum + m.quantity, 0);
    const totalStockValue = inventory.reduce((sum, m) => sum + (m.quantity * m.price), 0);
    const categories = [...new Set(inventory.map(m => m.category))];

    // Alerts Data
    const expiredItems = inventory.filter(m => new Date(m.expiryDate) < new Date());
    const lowStockItems = inventory.filter(m => m.quantity <= m.minStock);

    const handlePrint = () => {
        window.print();
    };

    const renderDailyStats = () => (
        <div className="animate-up">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Medicines Touched Today</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{dailyMedicines.length}</div>
                </div>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Daily Stock Added/Updated</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{dailyAddedStockCount} items</div>
                </div>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Daily Stock Value</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>${dailyAddedStockValue.toFixed(2)}</div>
                </div>
            </div>

            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={20} /> Today's Medicine Updates
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Time</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Medicine</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>New Stock Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dailyMedicines.map(med => (
                            <tr key={med.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem' }}>{new Date(med.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{med.name}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{med.category}</td>
                                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>{med.quantity} {med.unit}</td>
                            </tr>
                        ))}
                        {dailyMedicines.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No medicines added or updated today.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderInventoryStats = () => (
        <div className="animate-up">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Inventory Value</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-primary)' }}>${totalStockValue.toFixed(2)}</div>
                </div>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Automatic Physical Stock Count</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{totalStockCount} units</div>
                </div>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Unique Medicines</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{inventory.length}</div>
                </div>
            </div>

            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PieChart size={20} /> Category Breakdown
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {categories.map(cat => {
                        const catItems = inventory.filter(m => m.category === cat);
                        const catValue = catItems.reduce((sum, m) => sum + (m.quantity * m.price), 0);
                        const percentage = (catValue / totalStockValue) * 100;
                        return (
                            <div key={cat}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                    <span>{cat}</span>
                                    <span style={{ fontWeight: 600 }}>${catValue.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                                </div>
                                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${percentage}%`, background: 'var(--accent-primary)', borderRadius: '4px' }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const renderAlertsStats = () => (
        <div className="animate-up">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                    <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-alert)' }}>
                        <AlertCircle size={20} /> Expired Items ({expiredItems.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                        {expiredItems.map(m => (
                            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(248, 113, 113, 0.05)', borderRadius: 'var(--radius-md)' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{m.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Expired on: {new Date(m.expiryDate).toLocaleDateString()}</div>
                                </div>
                                <div style={{ fontWeight: 700, color: 'var(--accent-alert)' }}>{m.quantity} {m.unit}</div>
                            </div>
                        ))}
                        {expiredItems.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No expired items.</p>}
                    </div>
                </div>

                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                    <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-warning)' }}>
                        <ArrowDown size={20} /> Low Stock Items ({lowStockItems.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                        {lowStockItems.map(m => (
                            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(251, 191, 36, 0.05)', borderRadius: 'var(--radius-md)' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{m.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Min Stock: {m.minStock}</div>
                                </div>
                                <div style={{ fontWeight: 700, color: 'var(--accent-warning)' }}>{m.quantity} {m.unit}</div>
                            </div>
                        ))}
                        {lowStockItems.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>All stock levels healthy.</p>}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSalesStats = () => {
        const totalRevenue = salesHistory.reduce((sum, s) => sum + s.totalPrice, 0);
        const totalItemsSold = salesHistory.reduce((sum, s) => sum + s.quantity, 0);
        
        // Group by medicine
        const categorySales: Record<string, number> = {};
        const medicineSales: Record<string, { name: string, qty: number, revenue: number }> = {};
        
        salesHistory.forEach(s => {
            if (!medicineSales[s.medicineId]) {
                medicineSales[s.medicineId] = { name: s.medicineName, qty: 0, revenue: 0 };
            }
            medicineSales[s.medicineId].qty += s.quantity;
            medicineSales[s.medicineId].revenue += s.totalPrice;
            
            // Try to find category from inventory
            const invMedicine = inventory.find(m => m.id === s.medicineId);
            if (invMedicine) {
                categorySales[invMedicine.category] = (categorySales[invMedicine.category] || 0) + s.totalPrice;
            }
        });

        const topSellingMedicines = Object.values(medicineSales).sort((a, b) => b.qty - a.qty).slice(0, 5);
        const topRevenueCategories = Object.entries(categorySales).sort((a, b) => b[1] - a[1]).slice(0, 4);

        return (
            <div className="animate-up">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Sales Revenue</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>${totalRevenue.toFixed(2)}</div>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Items Sold</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{totalItemsSold} units</div>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Sales Records</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{salesHistory.length}</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                        <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp size={20} /> Top Selling Medicines
                        </h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Medicine</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Units Sold</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topSellingMedicines.map(med => (
                                    <tr key={med.name} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>{med.name}</td>
                                        <td style={{ padding: '1rem' }}>{med.qty}</td>
                                        <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>${med.revenue.toFixed(2)}</td>
                                    </tr>
                                ))}
                                {topSellingMedicines.length === 0 && (
                                    <tr>
                                        <td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No sales history available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                         <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <PieChart size={20} /> Revenue by Category
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {topRevenueCategories.map(([category, value]) => {
                                const percentage = (value / totalRevenue) * 100;
                                return (
                                    <div key={category}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                            <span>{category}</span>
                                            <span style={{ fontWeight: 600 }}>${value.toFixed(2)}</span>
                                        </div>
                                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${percentage}%`, background: 'var(--accent-secondary)', borderRadius: '4px' }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="glass" style={{ display: 'flex', padding: '0.25rem', borderRadius: 'var(--radius-lg)', gap: '0.25rem' }}>
                    <button
                        onClick={() => setActiveReport('daily')}
                        style={{
                            padding: '0.625rem 1.25rem',
                            borderRadius: 'var(--radius-md)',
                            background: activeReport === 'daily' ? 'rgba(255,255,255,0.08)' : 'transparent',
                            color: activeReport === 'daily' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 600
                        }}
                    >
                        <Calendar size={18} /> Daily Report
                    </button>
                    <button
                        onClick={() => setActiveReport('inventory')}
                        style={{
                            padding: '0.625rem 1.25rem',
                            borderRadius: 'var(--radius-md)',
                            background: activeReport === 'inventory' ? 'rgba(255,255,255,0.08)' : 'transparent',
                            color: activeReport === 'inventory' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 600
                        }}
                    >
                        <Package size={18} /> Inventory
                    </button>
                    <button
                        onClick={() => setActiveReport('alerts')}
                        style={{
                            padding: '0.625rem 1.25rem',
                            borderRadius: 'var(--radius-md)',
                            background: activeReport === 'alerts' ? 'rgba(255,255,255,0.08)' : 'transparent',
                            color: activeReport === 'alerts' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 600
                        }}
                    >
                        <AlertCircle size={18} /> Alerts
                    </button>
                    <button
                        onClick={() => setActiveReport('sales')}
                        style={{
                            padding: '0.625rem 1.25rem',
                            borderRadius: 'var(--radius-md)',
                            background: activeReport === 'sales' ? 'rgba(255,255,255,0.08)' : 'transparent',
                            color: activeReport === 'sales' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 600
                        }}
                    >
                        <BarChart3 size={18} /> Sales
                    </button>
                </div>

                <button
                    onClick={handlePrint}
                    className="no-print"
                    style={{
                        background: 'var(--accent-primary)',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 700,
                        boxShadow: '0 4px 15px rgba(129, 140, 248, 0.3)'
                    }}
                >
                    <Download size={20} /> Download Report
                </button>
            </div>

            <div style={{ marginTop: '1rem' }}>
                {activeReport === 'daily' && renderDailyStats()}
                {activeReport === 'inventory' && renderInventoryStats()}
                {activeReport === 'alerts' && renderAlertsStats()}
                {activeReport === 'sales' && renderSalesStats()}
            </div>
        </div>
    );
};

export default ReportsView;
