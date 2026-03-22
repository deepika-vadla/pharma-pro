import type { Medicine } from '../hooks/useInventory';
import { Edit2, Trash2 } from 'lucide-react';

interface Props {
    inventory: Medicine[];
    onEdit: (medicine: Medicine) => void;
    onDelete: (id: string) => void;
}

const InventoryTable: React.FC<Props> = ({ inventory, onEdit, onDelete }) => {
    const getStatus = (medicine: Medicine) => {
        const expiry = new Date(medicine.expiryDate);
        const today = new Date();
        const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));

        if (diffDays < 0) return { label: 'Expired', color: 'var(--accent-alert)' };
        if (diffDays <= 30) return { label: 'Expiring Soon', color: 'var(--accent-warning)' };
        if (medicine.quantity <= medicine.minStock) return { label: 'Low Stock', color: 'var(--accent-warning)' };
        return { label: 'In Stock', color: 'var(--accent-secondary)' };
    };

    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        <th style={{ padding: '1rem', fontWeight: 500 }}>Medicine Name</th>
                        <th style={{ padding: '1rem', fontWeight: 500 }}>Category</th>
                        <th style={{ padding: '1rem', fontWeight: 500 }}>Batch No</th>
                        <th style={{ padding: '1rem', fontWeight: 500 }}>Stock Level</th>
                        <th style={{ padding: '1rem', fontWeight: 500 }}>Expiry Date</th>
                        <th style={{ padding: '1rem', fontWeight: 500 }}>Status</th>
                        <th style={{ padding: '1rem', fontWeight: 500 }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((m) => {
                        const status = getStatus(m);
                        return (
                            <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)', height: '4.5rem', transition: 'background 0.2s' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 600 }}>{m.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {m.id.slice(0, 8)}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span className="glass" style={{ padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem' }}>
                                        {m.category}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                                        {m.batchNumber}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{
                                            flex: 1,
                                            maxWidth: '100px',
                                            height: '6px',
                                            background: 'var(--bg-tertiary)',
                                            borderRadius: '3px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${Math.min((m.quantity / (m.minStock * 3)) * 100, 100)}%`,
                                                height: '100%',
                                                background: m.quantity <= m.minStock ? 'var(--accent-alert)' : 'var(--accent-secondary)'
                                            }} />
                                        </div>
                                        <span>{m.quantity} {m.unit}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ color: status.label === 'Expired' ? 'var(--accent-alert)' : 'inherit' }}>
                                        {new Date(m.expiryDate).toLocaleDateString()}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: status.color, fontSize: '0.875rem', fontWeight: 600 }}>
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: status.color }} />
                                        {status.label}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => onEdit(m)}
                                            style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '0.375rem' }}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(m.id)}
                                            style={{ background: 'transparent', color: 'var(--accent-alert)', padding: '0.375rem' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTable;
