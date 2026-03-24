import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, CheckCircle } from 'lucide-react';
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
        quantity: initialData?.quantity || '',
        unit: initialData?.unit || 'Tabs',
        expiryDate: initialData?.expiryDate || '',
        minStock: initialData?.minStock || 10,
        batchNumber: initialData?.batchNumber || '',
        price: initialData?.price || '',
        supplierName: initialData?.supplierName || '',
        storageLocation: initialData?.storageLocation || ''
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    // Get today's date in YYYY-MM-DD format for the min attribute of expiry date
    const today = new Date().toISOString().split('T')[0];

    // Simple validation
    const validate = () => {
        if (!formData.name.trim() || !formData.batchNumber.trim() || !formData.expiryDate) {
            return "Please fill in all mandatory basic fields.";
        }
        
        const qty = Number(formData.quantity);
        const price = Number(formData.price);
        
        if (isNaN(qty) || qty <= 0) {
            return "Quantity must be a positive number greater than 0.";
        }
        if (isNaN(price) || price <= 0) {
            return "Unit Price must be a positive number greater than 0.";
        }
        
        if (formData.expiryDate < today) {
            return "Expiry Date cannot be in the past.";
        }
        
        return null;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            setSuccess(false);
            return;
        }

        setError(null);
        setSuccess(true);
        
        // Pass sanitized data back
        const finalData = {
            ...formData,
            quantity: Number(formData.quantity),
            price: Number(formData.price)
        };
        
        // Small delay to show success state before closing
        setTimeout(() => {
            onSave(finalData);
            onClose();
        }, 800);
    };

    const SectionHeader = ({ title }: { title: string }) => (
        <h3 style={{
            fontSize: '1rem', 
            fontWeight: 600, 
            color: 'var(--accent-primary)',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '0.5rem',
            marginBottom: '1rem',
            marginTop: '1.5rem'
        }}>
            {title}
        </h3>
    );

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
            padding: '1rem',
            overflowY: 'auto'
        }}>
            <div className="glass" style={{
                width: '100%',
                maxWidth: '650px',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem',
                position: 'relative',
                animation: 'slideUp 0.3s ease-out',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', color: 'var(--text-secondary)' }}
                >
                    <X size={24} />
                </button>

                <h2 style={{ marginBottom: '0.5rem', fontSize: '1.75rem', fontWeight: 800 }}>
                    {initialData ? 'Edit Medicine' : 'Add New Medicine'}
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Enter the details below to add or update your inventory.
                </p>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: 'var(--accent-alert)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 500
                    }}>
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}
                
                {success && (
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        color: 'var(--accent-success)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 500
                    }}>
                        <CheckCircle size={20} />
                        Medicine saved successfully!
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {/* Basic Information */}
                    <div style={{ marginTop: '0' }}>
                        <SectionHeader title="Basic Information" />
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Medicine Name *</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Paracetamol"
                                    className="glass"
                                    style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Category *</label>
                                <select
                                    required
                                    className="glass"
                                    style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="General">General</option>
                                    <option value="Antibiotic">Antibiotic</option>
                                    <option value="Painkiller">Painkiller</option>
                                    <option value="Vitamin">Vitamin</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Batch Number *</label>
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

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Expiry Date *</label>
                                <input
                                    required
                                    type="date"
                                    min={today}
                                    className="glass"
                                    style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
                                    value={formData.expiryDate}
                                    onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stock Information */}
                    <div>
                        <SectionHeader title="Stock Information" />
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Quantity *</label>
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    placeholder="0"
                                    className="glass"
                                    style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
                                    value={formData.quantity}
                                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Unit Price ($) *</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    className="glass"
                                    style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Storage Location (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Shelf A2"
                                    className="glass"
                                    style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
                                    value={formData.storageLocation}
                                    onChange={e => setFormData({ ...formData, storageLocation: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Supplier Information */}
                    <div>
                        <SectionHeader title="Supplier Information" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Supplier Name (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. Global Meds Inc."
                                className="glass"
                                style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
                                value={formData.supplierName}
                                onChange={e => setFormData({ ...formData, supplierName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                         <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.05)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-color)',
                                padding: '0.875rem',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                flex: 2,
                                background: 'linear-gradient(135deg, var(--accent-primary), #4f46e5)',
                                color: 'white',
                                padding: '0.875rem',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                            }}
                        >
                            <Save size={20} />
                            {initialData ? 'Update Medicine' : 'Save Medicine'}
                        </button>
                    </div>
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
