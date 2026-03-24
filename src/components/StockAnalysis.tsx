import React, { useState, useMemo } from 'react';
import { 
  TrendingDown, Package, AlertTriangle, DollarSign, Brain, BarChart3, ArrowRight,
  TrendingUp, Activity, PieChart, Info, CheckCircle, Clock
} from 'lucide-react';
import type { Medicine, SaleRecord } from '../hooks/useInventory';

interface Props {
  inventory: Medicine[];
  salesHistory: SaleRecord[];
}

const StockAnalysis: React.FC<Props> = ({ inventory, salesHistory }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Constants
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Derived Data & Calculations
  const analysisData = useMemo(() => {
    let totalInvValue = 0;
    
    // Process inventory
    const processItems = inventory.map(med => {
      // Calculate Cost Price (assume 30% margin for mock purposes)
      const costPrice = med.price * 0.7;
      totalInvValue += (med.quantity * costPrice);

      // Expiry calculation
      const expiryDate = new Date(med.expiryDate);
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
      
      let expiryStatus: 'Valid' | 'Near Expiry' | 'Expired' = 'Valid';
      let expiryColor = '#10b981'; // Green
      if (diffDays <= 0) {
        expiryStatus = 'Expired';
        expiryColor = '#ef4444'; // Red
      } else if (diffDays <= 30) {
        expiryStatus = 'Near Expiry';
        expiryColor = '#eab308'; // Yellow
      }

      // Sales extraction
      const soldQuantity = salesHistory
        .filter(sale => sale.medicineId === med.id)
        .reduce((sum, sale) => sum + sale.quantity, 0);

      const totalRevenue = soldQuantity * med.price;
      const totalCost = soldQuantity * costPrice;
      
      // Calculate profit/loss. Expired items still in inventory represent a loss directly
      let profitLoss = totalRevenue - totalCost;
      if (diffDays <= 0) {
        // Assume expired stuff in inventory is a total write-off loss corresponding to its cost
        profitLoss -= (med.quantity * costPrice);
      }

      return {
        ...med,
        costPrice,
        soldQuantity,
        totalRevenue,
        profitLoss,
        diffDays,
        expiryStatus,
        expiryColor,
        isLowStock: med.quantity <= med.minStock
      };
    });

    const categories = processItems.reduce((acc, med) => {
      acc[med.category] = (acc[med.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      items: processItems,
      totalInvValue,
      categories,
      highProfitCount: processItems.filter(m => m.profitLoss > 50).length,
      nearExpiryCount: processItems.filter(m => m.expiryStatus === 'Near Expiry').length,
      lowStockCount: processItems.filter(m => m.isLowStock).length,
      profitItems: processItems.filter(m => m.profitLoss >= 0).sort((a,b) => b.profitLoss - a.profitLoss),
      lossItems: processItems.filter(m => m.profitLoss < 0).sort((a,b) => a.profitLoss - b.profitLoss), // more loss first
    };
  }, [inventory, salesHistory, today]);

  // Handle clickable cards
  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const getConicGradient = (cats: Record<string, number>) => {
    const total = Object.values(cats).reduce((a, b) => a + b, 0);
    if (total === 0) return 'conic-gradient(var(--border-color) 0% 100%)';
    
    // Colors matching theme
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    let currentPercentage = 0;
    const gradientStops = Object.entries(cats).map(([name, count], index) => {
      const percentage = (count / total) * 100;
      const start = currentPercentage;
      const end = currentPercentage + percentage;
      currentPercentage = end;
      return `${colors[index % colors.length]} ${start}% ${end}%`;
    });

    return `conic-gradient(${gradientStops.join(', ')})`;
  };

  const donutColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="animate-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div 
          onClick={() => scrollTo('pl-table')}
          className="glass" 
          style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', cursor: 'pointer', borderTop: '4px solid #6366f1', transition: 'transform 0.2s', ...activeSection === 'pl-table' && { transform: 'scale(1.02)' } }}
        >
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={16} color="#6366f1" /> Inv. Value
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: '#6366f1' }}>
            ${analysisData.totalInvValue.toFixed(2)}
          </div>
        </div>

        <div 
          onClick={() => scrollTo('pl-table')}
          className="glass" 
          style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', cursor: 'pointer', borderTop: '4px solid #10b981', transition: 'transform 0.2s' }}
        >
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={16} color="#10b981" /> High Profit
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: '#10b981' }}>
            {analysisData.highProfitCount} items
          </div>
        </div>

        <div 
          onClick={() => scrollTo('expiry-heatmap')}
          className="glass" 
          style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', cursor: 'pointer', borderTop: '4px solid #f59e0b', transition: 'transform 0.2s', ...activeSection === 'expiry-heatmap' && { transform: 'scale(1.02)' } }}
        >
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} color="#f59e0b" /> Near Expiry
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: '#f59e0b' }}>
            {analysisData.nearExpiryCount} items
          </div>
        </div>

        <div 
          onClick={() => scrollTo('low-stock')}
          className="glass" 
          style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', cursor: 'pointer', borderTop: '4px solid #ef4444', transition: 'transform 0.2s', ...activeSection === 'low-stock' && { transform: 'scale(1.02)' } }}
        >
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingDown size={16} color="#ef4444" /> Low Stock
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: '#ef4444' }}>
            {analysisData.lowStockCount} items
          </div>
        </div>
        
        <div 
          onClick={() => scrollTo('ai-insights')}
          className="glass" 
          style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', cursor: 'pointer', borderTop: '4px solid #8b5cf6', transition: 'transform 0.2s', ...activeSection === 'ai-insights' && { transform: 'scale(1.02)' } }}
        >
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={16} color="#8b5cf6" /> Stockout Risk
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: '#8b5cf6' }}>
            {Math.max(0, analysisData.lowStockCount - 1)} items
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 5.5fr) minmax(0, 4.5fr)', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* 2. Expiry Timeline / Heatmap */}
          <section id="expiry-heatmap" className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock color="var(--accent-secondary)" /> Expiry Timeline (Days Remaining)
            </h3>
            
            <div style={{ position: 'relative', height: '300px', display: 'flex', alignItems: 'flex-end', gap: '0.5rem', paddingBottom: '2rem', marginTop: '1rem', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
              {/* Y Axis Guides */}
              <div style={{ position: 'absolute', bottom: '2rem', left: 0, width: '100%', height: 'calc(100% - 2rem)', display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between', zIndex: 0, opacity: 0.1, pointerEvents: 'none' }}>
                <div style={{ borderTop: '1px dashed white' }}></div>
                <div style={{ borderTop: '1px dashed white' }}></div>
                <div style={{ borderTop: '1px dashed white' }}></div>
                <div style={{ borderTop: '1px dashed white' }}></div>
              </div>
              
              <div style={{ position: 'absolute', left: '-30px', bottom: '2rem', height: 'calc(100% - 2rem)', display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                <span>0</span>
                <span>30</span>
                <span>60</span>
                <span>90+</span>
              </div>

              {analysisData.items.slice(0, 15).map(item => {
                const heightPercentage = Math.min(Math.max((item.diffDays / 90) * 100, 5), 100);
                return (
                  <div key={item.id} style={{ flex: 1, position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }} title={`${item.name} (${item.diffDays} days)`}>
                    <div style={{ 
                      width: '100%', 
                      maxWidth: '30px', 
                      height: `${heightPercentage}%`, 
                      background: item.expiryColor,
                      borderRadius: '4px 4px 0 0',
                      opacity: 0.8,
                      transition: 'opacity 0.2s',
                      cursor: 'help'
                    }} 
                    onMouseOver={e => e.currentTarget.style.opacity = '1'}
                    onMouseOut={e => e.currentTarget.style.opacity = '0.8'}
                    />
                    <div style={{ position: 'absolute', bottom: '-2rem', fontSize: '0.7rem', color: 'var(--text-secondary)', transform: 'rotate(-45deg)', whiteSpace: 'nowrap', width: '30px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name.substring(0,8)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem', fontSize: '0.875rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }}/> &gt;30 Days</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#eab308' }}/> 10-30 Days</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }}/> ≤10 Days</span>
            </div>
          </section>

          {/* 5. Low Stock & Substitutes */}
          <section id="low-stock" className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingDown color="var(--accent-alert)" /> Low Stock Alerts
              </h3>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Medicine</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Current / Min</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Suggested Sub.</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisData.items.filter(m => m.isLowStock).slice(0, 5).map(item => {
                    const substitute = analysisData.items.find(m => m.category === item.category && m.id !== item.id && !m.isLowStock);
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{item.name}</td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <span style={{ color: 'var(--accent-alert)', fontWeight: 700 }}>{item.quantity}</span> / {item.minStock}
                        </td>
                        <td style={{ padding: '1rem 0.5rem', color: substitute ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {substitute ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
                              <Package size={14} color="var(--accent-success)" />
                              {substitute.name} ({substitute.quantity})
                            </div>
                          ) : 'No direct substitute'}
                        </td>
                      </tr>
                    );
                  })}
                  {analysisData.lowStockCount === 0 && (
                    <tr><td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No low stock items.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* 4. Category Analysis */}
          <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChart color="var(--accent-primary)" /> Inventory by Category
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ 
                width: '150px', 
                height: '150px', 
                borderRadius: '50%', 
                background: getConicGradient(analysisData.categories),
                boxShadow: '0 0 20px rgba(0,0,0,0.5) inset',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: '25px',
                  background: 'var(--bg-card)', // inner circle to make it a donut
                  backdropFilter: 'blur(20px)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{inventory.length}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Items</span>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Object.entries(analysisData.categories).map(([name, count], index) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <div style={{ width: 12, height: 12, borderRadius: '4px', background: donutColors[index % donutColors.length] }} />
                      {name}
                    </div>
                    <div style={{ fontWeight: 600 }}>{Math.round((count / inventory.length) * 100)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Profit & Loss Table */}
          <section id="pl-table" className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', flex: 1 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 color="#10b981" /> Profit & Loss Analysis
            </h3>
            
            <div style={{ overflowX: 'auto', maxHeight: '400px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead style={{ position: 'sticky', top: 0, background: 'rgba(20, 25, 40, 0.95)', zIndex: 1 }}>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Medicine</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Sold</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Cost</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Price</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Profit/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {[...analysisData.lossItems, ...analysisData.profitItems].map(item => {
                    const isLoss = item.profitLoss < 0;
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>
                          {item.name}
                          {item.expiryStatus === 'Expired' && <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--accent-alert)' }}>(Written off)</span>}
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>{item.soldQuantity}</td>
                        <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>${item.costPrice.toFixed(2)}</td>
                        <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>${item.price.toFixed(2)}</td>
                        <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                          <span style={{ 
                            background: isLoss ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: isLoss ? '#ef4444' : '#10b981',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontWeight: 700,
                            display: 'inline-block'
                          }}>
                            {isLoss ? '-' : '+'}${Math.abs(item.profitLoss).toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {analysisData.items.length === 0 && (
                    <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No data available.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>

      {/* Bottom Section: AI Insights */}
      <section id="ai-insights" className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginTop: '1rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6' }}>
          <Brain color="#8b5cf6" /> Stock Action Recommendations
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {analysisData.lossItems.filter(m => m.expiryStatus === 'Expired').slice(0, 1).map(item => (
            <div key={`rec-1-${item.id}`} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '1rem' }}>
              <Info size={24} color="#ef4444" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Dispose {item.name}</strong>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>You have {item.quantity} units expired costing ${Math.abs(item.profitLoss).toFixed(2)}. Remove immediately to free shelf space.</span>
              </div>
            </div>
          ))}
          
          {analysisData.items.filter(m => m.isLowStock && m.soldQuantity > 0).slice(0, 1).map(item => (
            <div key={`rec-2-${item.id}`} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '1rem' }}>
              <ArrowRight size={24} color="#10b981" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Restock High-Selling {item.name}</strong>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Current stock is {item.quantity}. Has generated ${item.profitLoss.toFixed(2)} in profit. Reorder immediately to avoid stockout.</span>
              </div>
            </div>
          ))}

          {analysisData.items.filter(m => m.expiryStatus === 'Near Expiry').slice(0, 1).map(item => (
            <div key={`rec-3-${item.id}`} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '1rem' }}>
              <Clock size={24} color="#f59e0b" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Discount {item.name}</strong>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Expires in {item.diffDays} days. Consider offering a modest discount to offload {item.quantity} units before expiration.</span>
              </div>
            </div>
          ))}
          
          {analysisData.items.length > 0 && analysisData.lossItems.length === 0 && analysisData.lowStockCount === 0 && analysisData.nearExpiryCount === 0 && (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '1rem' }}>
              <CheckCircle size={24} color="#10b981" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>All Systems Optimal</strong>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Your inventory is perfectly balanced. No immediate actions required.</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StockAnalysis;
