import {
    Brain,
    TrendingUp,
    AlertTriangle,
    ArrowRight,
    ShieldCheck,
    RefreshCw,
    Activity,
    Target,
    Zap,
    BarChart3
} from 'lucide-react';
import type { Medicine, SaleRecord } from '../hooks/useInventory';
import type { AIInsight } from '../services/PredictiveEngine';

interface Props {
    inventory: Medicine[];
    salesHistory: SaleRecord[];
    aiInsights: AIInsight[];
    getMedicinePredictions: (medicine: Medicine) => { demand: any, expiry: any };
    generateMockHistory: () => void;
}

const PredictionsDashboard: React.FC<Props> = ({
    inventory,
    aiInsights,
    getMedicinePredictions,
    generateMockHistory
}) => {
    // Calculate some aggregate "fake" metrics for the dashboard feel
    const highRiskCount = inventory.filter(m => getMedicinePredictions(m).expiry.riskLevel === 'high').length;
    const risingDemandCount = inventory.filter(m => getMedicinePredictions(m).demand.trend === 'rising').length;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
            padding: '2rem',
            borderRadius: 'var(--radius-2xl)',
            background: 'linear-gradient(145deg, rgba(30, 27, 75, 0.4) 0%, rgba(49, 46, 129, 0.2) 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden'
        }} className="animate-up">
            
            {/* Ambient Background Glows */}
            <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />

            {/* Header / Intro */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '20px', marginBottom: '1.5rem', color: '#c4b5fd', fontSize: '0.875rem', fontWeight: 600 }}>
                        <Zap size={16} className="pulse" />
                        Nexus AI Engine v2.4 Active
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', letterSpacing: '-0.02em' }}>
                        <Brain size={40} style={{ color: '#a78bfa', filter: 'drop-shadow(0 0 10px rgba(167, 139, 250, 0.5))' }} />
                        Predictive <span style={{ color: '#60a5fa' }}>Intelligence</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', fontSize: '1.1rem', lineHeight: 1.6 }}>
                        Transform raw pharmacy data into actionable foresight. Our neural network analyzes sales velocity, seasonality, and expiry patterns to optimize your inventory.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="glass"
                        style={{
                            padding: '0.75rem 1.25rem',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white'
                        }}
                    >
                        <BarChart3 size={18} /> Export Report
                    </button>
                    <button
                        onClick={generateMockHistory}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            color: 'white',
                            boxShadow: '0 4px 15px -3px rgba(99, 102, 241, 0.4)'
                        }}
                    >
                        <RefreshCw size={18} /> Run Simulation
                    </button>
                </div>
            </div>

            {/* AI Performance Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)', borderTop: '2px solid #3b82f6', background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.05), transparent)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#93c5fd', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 600 }}>
                        <Target size={18} /> Prediction Accuracy
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>94.8%</div>
                    <div style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                        <TrendingUp size={14} /> +1.2% this week
                    </div>
                </div>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)', borderTop: '2px solid #8b5cf6', background: 'linear-gradient(to bottom, rgba(139, 92, 246, 0.05), transparent)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#c4b5fd', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 600 }}>
                        <Activity size={18} /> Items Analyzed
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{inventory.length}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Across all categories
                    </div>
                </div>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)', borderTop: '2px solid #f43f5e', background: 'linear-gradient(to bottom, rgba(244, 63, 94, 0.05), transparent)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fda4af', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 600 }}>
                        <AlertTriangle size={18} /> High Risk Expiries
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{highRiskCount}</div>
                    <div style={{ fontSize: '0.75rem', color: highRiskCount > 0 ? '#f43f5e' : 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Requires immediate action
                    </div>
                </div>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)', borderTop: '2px solid #10b981', background: 'linear-gradient(to bottom, rgba(16, 185, 129, 0.05), transparent)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#6ee7b7', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 600 }}>
                        <TrendingUp size={18} /> Rising Demand
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{risingDemandCount}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Items needing restock review
                    </div>
                </div>
            </div>

            {/* Top Insights Grid */}
            <div style={{ position: 'relative', zIndex: 1, marginTop: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Priority Insights</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {aiInsights.slice(0, 3).map(insight => (
                        <div key={insight.id} className="glass" style={{
                            padding: '1.75rem',
                            borderRadius: 'var(--radius-xl)',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.05)',
                            background: insight.severity === 'critical' ? 'linear-gradient(145deg, rgba(239, 68, 68, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)' :
                                insight.severity === 'warning' ? 'linear-gradient(145deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)' :
                                    'linear-gradient(145deg, rgba(59, 130, 246, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            cursor: 'pointer',
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                            }}
                        >
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                                background: insight.severity === 'critical' ? '#ef4444' : insight.severity === 'warning' ? '#f59e0b' : '#3b82f6'
                            }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', alignItems: 'center' }}>
                                <span style={{
                                    padding: '0.35rem 0.85rem',
                                    borderRadius: '20px',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    background: insight.severity === 'critical' ? 'rgba(239, 68, 68, 0.2)' : insight.severity === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                    color: insight.severity === 'critical' ? '#fca5a5' : insight.severity === 'warning' ? '#fcd34d' : '#93c5fd',
                                    border: `1px solid ${insight.severity === 'critical' ? 'rgba(239, 68, 68, 0.3)' : insight.severity === 'warning' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
                                }}>
                                    {insight.type}
                                </span>
                                {insight.severity === 'critical' && <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '0.5rem', borderRadius: '50%' }}><AlertTriangle size={18} className="shake" style={{ color: '#ef4444' }} /></div>}
                                {insight.severity === 'warning' && <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '0.5rem', borderRadius: '50%' }}><ShieldCheck size={18} style={{ color: '#f59e0b' }} /></div>}
                                {insight.severity === 'info' && <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.5rem', borderRadius: '50%' }}><TrendingUp size={18} style={{ color: '#3b82f6' }} /></div>}
                            </div>
                            <p style={{ fontWeight: 500, lineHeight: 1.6, marginBottom: '1.5rem', color: '#e2e8f0', fontSize: '0.95rem' }}>{insight.message}</p>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: insight.severity === 'critical' ? '#fca5a5' : insight.severity === 'warning' ? '#fcd34d' : '#93c5fd',
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            >
                                {insight.actionLabel} <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detailed Predictions Analysis */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', position: 'relative', zIndex: 1, marginTop: '1rem' }}>
                {/* Demand Forecast Table */}
                <div className="glass" style={{ padding: '0', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
                            <Activity size={22} color="#a78bfa" /> 30-Day Demand Forecast
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                            Updated 2 mins ago
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto', padding: '1rem 2rem 2rem 2rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <th style={{ padding: '0 1rem 1rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Medicine</th>
                                    <th style={{ padding: '0 1rem 1rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Current Stock</th>
                                    <th style={{ padding: '0 1rem 1rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>AI Forecast</th>
                                    <th style={{ padding: '0 1rem 1rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Trend Graph</th>
                                    <th style={{ padding: '0 1rem 1rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Confidence</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map(m => {
                                    const { demand } = getMedicinePredictions(m);
                                    return (
                                        <tr key={m.id} style={{ background: 'rgba(255,255,255,0.02)', transition: 'background 0.2s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        >
                                            <td style={{ padding: '1.25rem 1rem', fontWeight: 600, borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: demand.trend === 'rising' ? '#10b981' : demand.trend === 'falling' ? '#f43f5e' : '#64748b' }} />
                                                    {m.name}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem', color: '#cbd5e1' }}>
                                                <span style={{ fontWeight: 700, color: 'white' }}>{m.quantity}</span> {m.unit}
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#a78bfa', fontSize: '1.1rem' }}>
                                                    {demand.predictedDemand} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>units</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem' }}>
                                                {/* Fake trend graph visual */}
                                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '24px' }}>
                                                    {[...Array(5)].map((_, i) => {
                                                        const height = demand.trend === 'rising' ? 40 + (i * 15) : demand.trend === 'falling' ? 100 - (i * 15) : 50 + (Math.random() * 20 - 10);
                                                        return <div key={i} style={{ width: '6px', height: `${Math.max(20, height)}%`, background: demand.trend === 'rising' ? '#10b981' : demand.trend === 'falling' ? '#f43f5e' : '#64748b', borderRadius: '2px', opacity: 0.5 + (i * 0.1) }} />
                                                    })}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem', borderRadius: '0 var(--radius-lg) var(--radius-lg) 0' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: demand.confidence > 0.8 ? '#34d399' : '#fbbf24' }}>
                                                        <span>{demand.confidence > 0.8 ? 'High' : 'Medium'}</span>
                                                        <span>{Math.round(demand.confidence * 100)}%</span>
                                                    </div>
                                                    <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '3px', overflow: 'hidden' }}>
                                                        <div style={{ width: `${demand.confidence * 100}%`, height: '100%', background: `linear-gradient(90deg, transparent, ${demand.confidence > 0.8 ? '#10b981' : '#f59e0b'})`, borderRadius: '3px' }} />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Expiry Risk Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass" style={{
                        padding: '2rem',
                        borderRadius: 'var(--radius-2xl)',
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(15, 23, 42, 0.9) 100%)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        boxShadow: '0 10px 30px -10px rgba(239, 68, 68, 0.15)'
                    }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fca5a5' }}>
                                <ShieldCheck size={24} /> Expiry Risk Assessment
                            </div>
                            <span style={{ fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '0.25rem 0.5rem', borderRadius: '12px', fontWeight: 700 }}>
                                {highRiskCount} HIGH RISK
                            </span>
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                            {inventory
                                .map(m => ({ medicine: m, risk: getMedicinePredictions(m).expiry }))
                                .filter(item => item.risk.riskLevel !== 'low')
                                .sort((a, b) => b.risk.daysUntilExpiry - a.risk.daysUntilExpiry)
                                .map(({ medicine, risk }) => (
                                    <div key={medicine.id} style={{
                                        padding: '1.25rem',
                                        borderRadius: 'var(--radius-xl)',
                                        background: risk.riskLevel === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        border: `1px solid ${risk.riskLevel === 'high' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: risk.riskLevel === 'high' ? '#ef4444' : '#f59e0b' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'white' }}>{medicine.name}</span>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                fontWeight: 800,
                                                color: 'white',
                                                background: risk.riskLevel === 'high' ? '#ef4444' : '#f59e0b',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '20px',
                                                textTransform: 'uppercase'
                                            }}>{risk.riskLevel}</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#cbd5e1' }}>
                                                <span>Time to Expiry</span>
                                                <span style={{ color: 'white', fontWeight: 600 }}>{risk.daysUntilExpiry} days</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#cbd5e1' }}>
                                                <span>Est. Waste at Expiry</span>
                                                <span style={{ color: risk.riskLevel === 'high' ? '#fca5a5' : '#fcd34d', fontWeight: 700 }}>
                                                    {risk.estimatedStockRemainingAtExpiry} {medicine.unit}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            {inventory.filter(m => getMedicinePredictions(m).expiry.riskLevel !== 'low').length === 0 && (
                                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-xl)' }}>
                                    <ShieldCheck size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
                                    No high-risk shelf life events detected in the near future.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictionsDashboard;
