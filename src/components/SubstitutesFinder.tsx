import React, { useState } from 'react';
import { Search, Link, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Medicine } from '../hooks/useInventory';

interface Props {
  inventory: Medicine[];
}

const SubstitutesFinder: React.FC<Props> = ({ inventory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const filteredSearch = inventory.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5); // Just show top 5 in dropdown

  const handleSelect = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setSearchTerm('');
  };

  const substitutes = selectedMedicine 
    ? inventory.filter(m => m.category === selectedMedicine.category && m.id !== selectedMedicine.id)
    : [];

  return (
    <div className="animate-up" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <Link size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Medicine Substitutes Finder</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>Find alternative brands with the same composition/category when a prescribed medicine is unavailable.</p>
          </div>
        </div>

        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderRadius: 'var(--radius-lg)', gap: '0.75rem', border: '1px solid var(--accent-primary)' }}>
            <Search size={20} color="var(--accent-primary)" />
            <input
              type="text"
              placeholder="Search for prescribed medicine..."
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '1.1rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {searchTerm && (
            <div className="glass" style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem', borderRadius: 'var(--radius-lg)', zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}>
              {filteredSearch.length > 0 ? (
                filteredSearch.map(m => (
                  <div 
                    key={m.id} 
                    onClick={() => handleSelect(m)}
                    style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                    className="hover-bg"
                  >
                    <span style={{ fontWeight: 600 }}>{m.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{m.category}</span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>No medicines found.</div>
              )}
            </div>
          )}
        </div>

        {selectedMedicine && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Selected Medicine</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--accent-primary)' }}>{selectedMedicine.name}</h3>
                <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Category: {selectedMedicine.category}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold' }}>Stock: {selectedMedicine.quantity} {selectedMedicine.unit}</div>
                <div style={{ color: selectedMedicine.quantity > 0 ? '#34d399' : '#f87171' }}>
                  {selectedMedicine.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedMedicine && (
        <div className="animate-up" style={{ animationDelay: '0.1s' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="var(--accent-secondary)" /> 
            Available Substitutes ({substitutes.length})
          </h3>
          
          {substitutes.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {substitutes.map(sub => (
                <div key={sub.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: sub.quantity > 0 ? '#34d399' : '#f87171' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.25rem' }}>{sub.name}</h4>
                    {sub.quantity > 0 ? <CheckCircle2 size={20} color="#34d399" /> : <AlertCircle size={20} color="#f87171" />}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>In Stock:</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{sub.quantity} {sub.unit}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Price:</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${sub.price.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Price Diff:</span>
                      <span style={{ fontWeight: 600, color: sub.price > selectedMedicine.price ? '#f87171' : '#34d399' }}>
                        {sub.price > selectedMedicine.price ? '+' : ''}${(sub.price - selectedMedicine.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass" style={{ textAlign: 'center', padding: '3rem', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1.1rem' }}>No direct substitutes found in the same category.</p>
              <p style={{ fontSize: '0.9rem' }}>Try searching for a different medicine.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubstitutesFinder;
