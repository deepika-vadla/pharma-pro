import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import type { Medicine } from '../hooks/useInventory';

interface Props {
    onClose: () => void;
    onSave: (medicine: Omit<Medicine, 'id' | 'lastUpdated'>) => void;
    initialData?: Medicine;
}

const MedicineForm: React.FC<Props> = ({ onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        category: initialData?.category || 'General',
        quantity: initialData?.quantity || 0,
        unit: initialData?.unit || 'Tabs',
        expiryDate: initialData?.expiryDate || '',
        minStock: initialData?.minStock || 10,
        batchNumber: initialData?.batchNumber || '',
        price: initialData?.price || 0
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        }}>
            <div className="glass" style={{
                width: '100%',
                maxWidth: '500px',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                position: 'relative',
                animation: 'slideUp 0.3s ease-out'
            }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', color: 'var(--text-secondary)' }}
                >
                    <X size={24} />
                </button>

                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{initialData ? 'Edit Medicine' : 'Add New Medicine'}</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Medicine Name</label>
                        <input
                            required
                            type="text"
                            className="glass"
                            style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Batch Number</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. B-12345"
                            className="glass"
                            style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
                            value={formData.batchNumber}
                            onChange={e => setFormData({ ...formData, batchNumber: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Category</label>
                            <select
                                className="glass"
                                style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="General">General</option>
                                <option value="Antibiotics">Antibiotics</option>
                                <option value="Pain Relief">Pain Relief</option>
                                <option value="Vitamins">Vitamins</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Expiry Date</label>
                            <input
                                required
                                type="date"
                                className="glass"
                                style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
                                value={formData.expiryDate}
                                onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Quantity</label>
                            <input
                                required
                                type="number"
                                className="glass"
                                style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Unit</label>
                            <input
                                required
                                type="text"
                                placeholder="Tabs/Vials"
                                className="glass"
                                style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
                                value={formData.unit}
                                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Price ($)</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                className="glass"
                                style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={{
                            marginTop: '1rem',
                            background: 'linear-gradient(135deg, var(--accent-primary), #4f46e5)',
                            color: 'white',
                            padding: '0.875rem',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                        }}
                    >
                        <Save size={20} />
                        {initialData ? 'Update Medicine' : 'Save Medicine'}
                    </button>
                </form>
            </div>
            <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default MedicineForm;
