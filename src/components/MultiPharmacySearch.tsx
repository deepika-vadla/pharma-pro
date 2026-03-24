import React, { useState } from 'react';
import { Search, MapPin, Store, CheckCircle, XCircle, Phone } from 'lucide-react';
import type { Medicine } from '../hooks/useInventory';

interface Props {
  inventory: Medicine[];
}

// Simulated data for nearby pharmacies and their medicines
const NEARBY_PHARMACIES = [
  {
    id: 1,
    name: 'Apollo Pharmacy',
    distance: '1.2 km',
    contact: '+1 234 567 8900',
    medicines: ['Paracetamol', 'Azithromycin', 'Vitamin D', 'Cough Syrup', 'Antibiotics']
  },
  {
    id: 2,
    name: 'City Care Meds',
    distance: '2.5 km',
    contact: '+1 234 567 8901',
    medicines: ['Ibuprofen', 'Cetirizine', 'Cough Syrup', 'Insulin', 'Metformin']
  },
  {
    id: 3,
    name: 'Wellness Hub',
    distance: '3.0 km',
    contact: '+1 234 567 8902',
    medicines: ['Amoxicillin', 'Lisinopril', 'Aspirin', 'Vitamin D']
  },
  {
    id: 4,
    name: 'QuickHealth Pharmacy',
    distance: '0.8 km',
    contact: '+1 234 567 8903',
    medicines: ['Omeprazole', 'Cough Syrup', 'Painkillers', 'First Aid Kit']
  }
];

const MultiPharmacySearch: React.FC<Props> = ({ inventory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Array to store current store medicines
  const currentStoreMedicines = inventory.map(m => m.name.toLowerCase());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchTerm.trim());
  };

  // Logic to simulate checking availability
  const isAvailableLocally = searchQuery 
    ? currentStoreMedicines.some(m => m.includes(searchQuery.toLowerCase()))
    : false;

  const nearbyResults = searchQuery
    ? NEARBY_PHARMACIES.filter(p => 
        p.medicines.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <div className="animate-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <section className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Network Search</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Nearby Pharmacy Availability</p>
          </div>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ padding: '0 1rem' }}>
              <Search size={24} color="var(--text-muted)" />
            </div>
            <input 
              type="text"
              placeholder="Search for a medicine..."
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
            <button 
              type="submit"
              className="glass"
              style={{
                background: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.75rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {searchQuery && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Results displaying below search bar */}

          {isAvailableLocally ? (
            <section className="glass animate-up" style={{ padding: '1.5rem 2rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #10b981' }}>
              <CheckCircle size={32} color="#10b981" />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>
                  Available in your store
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.925rem' }}>
                  The medicine "{searchQuery}" is currently in stock locally.
                </p>
              </div>
            </section>
          ) : (
            <section className="glass animate-up" style={{ padding: '1.5rem 2rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #ef4444' }}>
              <XCircle size={32} color="#ef4444" />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ef4444' }}>
                  Not available in this store
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.925rem' }}>
                  "{searchQuery}" is out of stock here. Showing availability at nearby pharmacies below.
                </p>
              </div>
            </section>
          )}

          {!isAvailableLocally && (
            <section className="animate-up">
              {nearbyResults.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {nearbyResults.map((pharmacy) => (
                    <div key={pharmacy.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#10b981' }}></div>
                      
                      <div style={{ paddingLeft: '0.5rem' }}>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{pharmacy.name}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                          <MapPin size={16} color="var(--accent-primary)" />
                          {pharmacy.distance} away
                        </div>
                        
                        <div style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.375rem', 
                          background: 'rgba(16, 185, 129, 0.1)', 
                          color: '#10b981', 
                          padding: '0.375rem 0.75rem', 
                          borderRadius: '2rem', 
                          fontSize: '0.875rem', 
                          fontWeight: 600 
                        }}>
                          <CheckCircle size={16} />
                          Available
                        </div>
                      </div>

                      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                          <Phone size={16} />
                          {pharmacy.contact}
                        </div>
                        <button style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          padding: '0.5rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}>
                          Contact
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', borderRadius: 'var(--radius-lg)' }}>
                  No nearby pharmacies have this medicine in stock either.
                </div>
              )}
            </section>
          )}

        </div>
      )}
    </div>
  );
};

export default MultiPharmacySearch;
