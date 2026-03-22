import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Package } from 'lucide-react';

interface Props {
    onLogin: () => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            onLogin();
        }, 1500);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative Blur Blobs */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '400px',
                height: '400px',
                background: 'var(--accent-primary)',
                filter: 'blur(100px)',
                opacity: 0.15,
                borderRadius: '50%',
                zIndex: -1
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: '400px',
                height: '400px',
                background: 'var(--accent-extra)',
                filter: 'blur(100px)',
                opacity: 0.15,
                borderRadius: '50%',
                zIndex: -1
            }} />

            <div className="glass animate-up" style={{
                width: '100%',
                maxWidth: '440px',
                borderRadius: 'var(--radius-xl)',
                padding: '3rem',
                textAlign: 'center',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    display: 'inline-flex',
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-extra))',
                    padding: '1rem',
                    borderRadius: '1.25rem',
                    color: 'white',
                    marginBottom: '1.5rem',
                    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
                }}>
                    <Package size={32} />
                </div>

                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>Welcome to PharmaPro</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Inventory management, elevated.</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>Email Address</label>
                        <div className="glass" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.875rem 1rem',
                            borderRadius: 'var(--radius-lg)',
                            background: 'rgba(255,255,255,0.03)'
                        }}>
                            <Mail size={18} color="var(--text-muted)" />
                            <input
                                required
                                type="email"
                                placeholder="admin@pharmapro.com"
                                style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>Password</label>
                        <div className="glass" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.875rem 1rem',
                            borderRadius: 'var(--radius-lg)',
                            background: 'rgba(255,255,255,0.03)'
                        }}>
                            <Lock size={18} color="var(--text-muted)" />
                            <input
                                required
                                type="password"
                                placeholder="••••••••"
                                style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '1rem',
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-extra))',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: 'var(--radius-lg)',
                            fontWeight: 700,
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? (
                            <span className="animate-pulse">Signing entry...</span>
                        ) : (
                            <>
                                Sign In
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Simulation Mode: Use any email and password
                </div>
            </div>
        </div>
    );
};

export default Login;
