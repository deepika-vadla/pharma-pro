import React, { useState, useEffect } from 'react';
import { Search, MapPin, Package, ArrowUpDown, Store, RefreshCw, Brain } from 'lucide-react';
import type { Medicine } from '../hooks/useInventory';
import { NetworkStockService, type NetworkSearchResult } from '../services/NetworkStockService';

interface Props {
  inventory: Medicine[];
}

const MultiPharmacySearch: React.FC<Props> = ({ inventory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [networkResults, setNetworkResults] = useState<NetworkSearchResult[]>([]);
  const [sortBy, setSortBy] = useState<'distance' | 'stock' | 'ai'>('ai');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!debouncedSearch) {
      setNetworkResults([]);
      return;
    }
    
    let isMounted = true;
    setIsSearching(true);
    
    NetworkStockService.searchNetworkStock(debouncedSearch).then(results => {
      if (isMounted) {
        setNetworkResults(results);
        setIsSearching(false);
      }
    });
    
    return () => { isMounted = false; };
  }, [debouncedSearch]);

  const localMeds = debouncedSearch ? inventory.filter(m => 
    m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
    m.category.toLowerCase().includes(debouncedSearch.toLowerCase())
  ) : [];

  const sortedNetworkResults = [...networkResults].sort((a, b) => {
    if (sortBy === 'ai') {
      return (b.medicine.recommendationScore ?? 0) - (a.medicine.recommendationScore ?? 0);
    }
    if (sortBy === 'distance') {
      return a.pharmacy.distance - b.pharmacy.distance;
    }
    return b.medicine.stockQuantity - a.medicine.stockQuantity;
  });

  return (
    <div className="animate-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <section className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Global Pharmacy Network</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Search for medicine availability across our partner pharmacy network.</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ padding: '0 1rem' }}>
              <Search size={24} color="var(--text-muted)" />
            </div>
            <input 
              type="text"
              placeholder="Enter medicine name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '1.125rem',
                flex: 1,
                padding: '0.75rem 0'
              }}
            />
            {isSearching && (
              <RefreshCw className="spin" size={24} color="var(--accent-primary)" style={{ marginRight: '1rem' }} />
            )}
          </div>
        </div>
      </section>

      {debouncedSearch && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2rem' }}>
          
          {/* Local Stock Section */}
          <section>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Store color="var(--accent-primary)" />
              My Pharmacy Stock
            </h3>
            {localMeds.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {localMeds.map(med => (
                  <div key={med.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--accent-primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>{med.name}</span>
                      <span style={{ 
                        background: med.quantity <= med.minStock ? 'var(--accent-alert)' : 'var(--accent-success)', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '1rem', 
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        color: 'white'
                      }}>
                        {med.quantity} {med.unit}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      Category: {med.category}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', borderRadius: 'var(--radius-lg)' }}>
                No local stock found for "{debouncedSearch}"
              </div>
            )}
          </section>

          {/* Network Stock Section */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package color="var(--accent-secondary)" />
                Nearby Pharmacies
              </h3>
              
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem' }}>
                <button 
                  onClick={() => setSortBy('ai')}
                  style={{ 
                    background: sortBy === 'ai' ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-extra))' : 'transparent',
                    color: sortBy === 'ai' ? 'white' : 'var(--text-secondary)',
                    padding: '0.5rem 1rem', 
                    borderRadius: 'var(--radius-md)',
                    border: sortBy === 'ai' ? 'none' : '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontWeight: sortBy === 'ai' ? 600 : 400
                  }}
                >
                  <Brain size={16} /> AI Recommended
                </button>
                <button 
                  onClick={() => setSortBy('distance')}
                  style={{ 
                    background: sortBy === 'distance' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: sortBy === 'distance' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    padding: '0.5rem 1rem', 
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <MapPin size={16} /> Distance
                </button>
                <button 
                  onClick={() => setSortBy('stock')}
                  style={{ 
                    background: sortBy === 'stock' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: sortBy === 'stock' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    padding: '0.5rem 1rem', 
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <ArrowUpDown size={16} /> Stock Level
                </button>
              </div>
            </div>

            {isSearching && networkResults.length === 0 ? (
              <div className="glass" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', borderRadius: 'var(--radius-lg)' }}>
                Searching global network...
              </div>
            ) : sortedNetworkResults.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
                {sortedNetworkResults.map((result, idx) => (
                  <div key={idx} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>{result.pharmacy.name}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                          <MapPin size={14} />
                          {result.pharmacy.distance} km away • {result.pharmacy.location}
                        </div>
                      </div>
                      {result.medicine.recommendationScore !== undefined && (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.25rem', 
                          background: 'rgba(99, 102, 241, 0.15)', 
                          color: 'var(--accent-primary)', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '1rem', 
                          fontSize: '0.75rem', 
                          fontWeight: 700 
                        }}>
                          <Brain size={14} />
                          Match: {Math.round(result.medicine.recommendationScore * 100)}%
                        </div>
                      )}
                    </div>
                    
                    <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 500 }}>{result.medicine.medicineName}</span>
                        <span style={{ fontWeight: 700, color: 'white' }}>{result.medicine.stockQuantity} in stock</span>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        {result.medicine.composition} • Expires: {new Date(result.medicine.expiryDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Contact: {result.pharmacy.contact}
                    </div>
                  </div>
                ))}
              </div>
            ) : !isSearching ? (
              <div className="glass" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', borderRadius: 'var(--radius-lg)' }}>
                No partner pharmacies have this item in stock.
              </div>
            ) : null}
          </section>
        </div>
      )}
    </div>
  );
};

export default MultiPharmacySearch;
