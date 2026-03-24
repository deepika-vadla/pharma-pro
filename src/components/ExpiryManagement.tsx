import React, { useState } from 'react';
import { AlertTriangle, Search, Trash2, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import type { Medicine } from '../hooks/useInventory';

interface Props {
  inventory: Medicine[];
  onDelete: (id: string) => void;
}

const ExpiryManagement: React.FC<Props> = ({ inventory, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiryData = inventory.map(med => {
    const expiry = new Date(med.expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    
    let status: 'Valid' | 'Near Expiry' | 'Expired' = 'Valid';
    if (diffDays <= 0) status = 'Expired';
    else if (diffDays <= 30) status = 'Near Expiry';

    return { ...med, diffDays, status };
  });

  const filteredData = expiryData.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const expiredCount = expiryData.filter(m => m.status === 'Expired').length;
  const nearExpiryCount = expiryData.filter(m => m.status === 'Near Expiry').length;

  return (
      <div className="animate-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Alerts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--accent-alert)' }}>
                  <AlertTriangle size={36} color="var(--accent-alert)" />
                  <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-alert)' }}>{expiredCount} Expired Medicines</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>Items that need to be removed immediately.</p>
                  </div>
              </div>
              <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #eab308' }}>
                  <Clock size={36} color="#eab308" />
                  <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#eab308' }}>{nearExpiryCount} Expiring Soon</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>Items expiring within the next 30 days.</p>
                  </div>
              </div>
          </div>

          <section className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Expiry Tracker</h3>
                  
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-lg)' }}>
                      <Search size={20} color="var(--text-muted)" />
                      <input 
                          type="text"
                          placeholder="Search by name or batch..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{
                              background: 'transparent',
                              border: 'none',
                              outline: 'none',
                              color: 'var(--text-primary)',
                              fontSize: '0.925rem',
                              width: '240px'
                          }}
                      />
                  </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                              <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Medicine Name</th>
                              <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Batch Number</th>
                              <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Expiry Date</th>
                              <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Days Remaining</th>
                              <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Status</th>
                              <th style={{ padding: '1rem 0.5rem', fontWeight: 500, textAlign: 'right' }}>Action</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredData.length > 0 ? filteredData.map(med => (
                              <tr key={med.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>
                                    {med.name}
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>{med.category}</div>
                                  </td>
                                  <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{med.batchNumber || 'N/A'}</td>
                                  <td style={{ padding: '1rem 0.5rem' }}>{new Date(med.expiryDate).toLocaleDateString()}</td>
                                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600, color: med.diffDays <= 0 ? 'var(--accent-alert)' : med.diffDays <= 30 ? '#eab308' : 'var(--accent-success)' }}>
                                    {med.diffDays <= 0 ? 'Expired' : `${med.diffDays} days`}
                                  </td>
                                  <td style={{ padding: '1rem 0.5rem' }}>
                                      <span style={{
                                          padding: '0.25rem 0.75rem',
                                          borderRadius: '2rem',
                                          fontSize: '0.75rem',
                                          fontWeight: 700,
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.25rem',
                                          background: med.status === 'Expired' ? 'rgba(239, 68, 68, 0.15)' : med.status === 'Near Expiry' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                          color: med.status === 'Expired' ? 'var(--accent-alert)' : med.status === 'Near Expiry' ? '#eab308' : 'var(--accent-success)'
                                      }}>
                                          {med.status === 'Expired' && <ShieldAlert size={14} />}
                                          {med.status === 'Near Expiry' && <Clock size={14} />}
                                          {med.status === 'Valid' && <CheckCircle size={14} />}
                                          {med.status}
                                      </span>
                                  </td>
                                  <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                                      {med.status === 'Expired' ? (
                                        <button 
                                            onClick={() => onDelete(med.id)}
                                            className="action-btn"
                                            style={{
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                color: 'var(--accent-alert)',
                                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                                padding: '0.5rem 1rem',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: '0.875rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.375rem',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <Trash2 size={16} /> Remove
                                        </button>
                                      ) : (
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>-</span>
                                      )}
                                  </td>
                              </tr>
                          )) : (
                              <tr>
                                  <td colSpan={6} style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                      No medicines found matching your search.
                                  </td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </section>
      </div>
  );
};

export default ExpiryManagement;
