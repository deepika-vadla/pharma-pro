import React, { useEffect, useState } from 'react';
import { Package, ArrowRight, Activity, ShieldCheck, Zap } from 'lucide-react';

interface SplashWelcomeProps {
    onEnter: () => void;
}

const SplashWelcome: React.FC<SplashWelcomeProps> = ({ onEnter }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Ambient Orbs */}
            <div style={{ position: 'absolute', top: '10%', left: '15%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(45, 212, 191, 0.1) 0%, transparent 60%)', filter: 'blur(80px)' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(129, 140, 248, 0.1) 0%, transparent 60%)', filter: 'blur(80px)' }} />

            <div style={{
                maxWidth: '600px',
                width: '100%',
                padding: '3rem',
                textAlign: 'center',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 2rem auto',
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px -10px var(--accent-primary)',
                    color: 'white'
                }}>
                    <Package size={40} />
                </div>

                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: 'white',
                    marginBottom: '1rem',
                    lineHeight: 1.1
                }}>
                    Welcome to <span style={{ color: 'var(--accent-primary)' }}>PharmaPro</span>
                </h1>

                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '3rem',
                    maxWidth: '80%',
                    margin: '0 auto 3rem auto',
                    lineHeight: 1.6
                }}>
                    The next-generation pharmacy management system powered by predictive intelligence.
                </p>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    marginBottom: '4rem'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                        <div className="glass" style={{ padding: '1rem', borderRadius: '50%', color: 'var(--accent-secondary)' }}><Activity size={24} /></div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Real-time Env</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                        <div className="glass" style={{ padding: '1rem', borderRadius: '50%', color: 'var(--accent-primary)' }}><Zap size={24} /></div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>AI Insights</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                        <div className="glass" style={{ padding: '1rem', borderRadius: '50%', color: 'var(--accent-extra)' }}><ShieldCheck size={24} /></div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Secure Data</span>
                    </div>
                </div>

                <button
                    onClick={onEnter}
                    style={{
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        color: 'white',
                        padding: '1rem 2.5rem',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-xl)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        boxShadow: '0 10px 25px -5px rgba(45, 212, 191, 0.4)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(45, 212, 191, 0.5)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(45, 212, 191, 0.4)';
                    }}
                >
                    Enter Workspace <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default SplashWelcome;
