import React, { useState } from 'react';
import { AlertCircle, ShieldAlert, CheckCircle, Info, Stethoscope } from 'lucide-react';
import type { Medicine } from '../hooks/useInventory';

interface Props {
  inventory: Medicine[];
}

// Mock database of interactions between categories
const MOCK_INTERACTIONS: Record<string, Record<string, { severity: 'high' | 'moderate' | 'low', message: string }>> = {
  'Antibiotics': {
    'Painkillers': { severity: 'moderate', message: 'May increase the risk of side effects like nausea or stomach upset.' },
    'Vitamins': { severity: 'low', message: 'Certain vitamins (like Calcium or Iron) can decrease the absorption of some antibiotics. Separate doses by 2 hours.' },
  },
  'Painkillers': {
    'Antibiotics': { severity: 'moderate', message: 'May increase the risk of side effects like nausea or stomach upset.' },
    'Cold & Flu': { severity: 'high', message: 'Both may contain paracetamol/acetaminophen. Risk of accidental overdose and liver toxicity.' },
  },
  'Cold & Flu': {
    'Painkillers': { severity: 'high', message: 'Both may contain paracetamol/acetaminophen. Risk of accidental overdose and liver toxicity.' },
  },
  'Vitamins': {
    'Antibiotics': { severity: 'low', message: 'Certain vitamins (like Calcium or Iron) can decrease the absorption of some antibiotics. Separate doses by 2 hours.' }
  }
};

const InteractionChecker: React.FC<Props> = ({ inventory }) => {
  const [medOneId, setMedOneId] = useState<string>('');
  const [medTwoId, setMedTwoId] = useState<string>('');
  const [hasChecked, setHasChecked] = useState(false);

  const medOne = inventory.find(m => m.id === medOneId);
  const medTwo = inventory.find(m => m.id === medTwoId);

  const handleCheck = () => {
    setHasChecked(true);
  };

  const resetCheck = () => {
    setHasChecked(false);
  };

  let interactionResult = null;
  if (hasChecked && medOne && medTwo) {
    // Check for identical medicine
    if (medOne.id === medTwo.id) {
      interactionResult = { severity: 'high', message: 'Duplicate medication. Do not take multiple doses of the exact same medication unless prescribed.' };
    } 
    // Check for same category
    else if (medOne.category === medTwo.category) {
      interactionResult = { severity: 'high', message: 'Therapeutic duplication. Taking two medicines from the same category may lead to overdose.' };
    }
    // Check mock database
    else if (MOCK_INTERACTIONS[medOne.category]?.[medTwo.category]) {
      interactionResult = MOCK_INTERACTIONS[medOne.category][medTwo.category];
    } 
    else {
      interactionResult = { severity: 'none', message: 'No known interactions found between these categories in our database.' };
    }
  }

  return (
    <div className="animate-up" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Drug Interaction Checker</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>Proactively check for potential drug-drug interactions, therapeutic duplications, and side effects.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1.5rem', alignItems: 'end', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Medication 1</label>
            <select 
              value={medOneId} 
              onChange={(e) => { setMedOneId(e.target.value); resetCheck(); }}
              style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
            >
              <option value="">Select first medication</option>
              {inventory.map(m => <option key={m.id} value={m.id}>{m.name} ({m.category})</option>)}
            </select>
          </div>

          <div style={{ paddingBottom: '1rem', color: 'var(--text-muted)' }}>
            <Stethoscope size={24} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Medication 2</label>
            <select 
              value={medTwoId} 
              onChange={(e) => { setMedTwoId(e.target.value); resetCheck(); }}
              style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
            >
              <option value="">Select second medication</option>
              {inventory.map(m => <option key={m.id} value={m.id}>{m.name} ({m.category})</option>)}
            </select>
          </div>
        </div>

        <button 
          onClick={handleCheck}
          disabled={!medOneId || !medTwoId}
          style={{ 
            width: '100%', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)', 
            background: 'linear-gradient(135deg, var(--accent-alert), #be123c)', 
            color: 'white', 
            fontWeight: 700,
            fontSize: '1.1rem',
            opacity: (!medOneId || !medTwoId) ? 0.5 : 1,
            cursor: (!medOneId || !medTwoId) ? 'not-allowed' : 'pointer',
            border: 'none'
          }}
        >
          Analyze Interactions
        </button>
      </div>

      {hasChecked && interactionResult && (
        <div className="animate-fade-in glass" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', position: 'relative', overflow: 'hidden' }}>
          {interactionResult.severity === 'high' && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: '#ef4444' }} />
          )}
          {interactionResult.severity === 'moderate' && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: '#f59e0b' }} />
          )}
          {interactionResult.severity === 'low' && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: '#3b82f6' }} />
          )}
          {interactionResult.severity === 'none' && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: '#10b981' }} />
          )}

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ 
              background: 
                interactionResult.severity === 'high' ? 'rgba(239, 68, 68, 0.1)' : 
                interactionResult.severity === 'moderate' ? 'rgba(245, 158, 11, 0.1)' : 
                interactionResult.severity === 'low' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              color: 
                interactionResult.severity === 'high' ? '#ef4444' : 
                interactionResult.severity === 'moderate' ? '#f59e0b' : 
                interactionResult.severity === 'low' ? '#3b82f6' : '#10b981',
              padding: '1rem', 
              borderRadius: '50%'
            }}>
              {interactionResult.severity === 'high' ? <AlertCircle size={32} /> :
               interactionResult.severity === 'moderate' ? <AlertCircle size={32} /> :
               interactionResult.severity === 'low' ? <Info size={32} /> : <CheckCircle size={32} />}
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.4rem',
                color: 
                interactionResult.severity === 'high' ? '#ef4444' : 
                interactionResult.severity === 'moderate' ? '#f59e0b' : 
                interactionResult.severity === 'low' ? '#3b82f6' : '#10b981'
              }}>
                {interactionResult.severity === 'high' ? 'Major Interaction Detected' :
                 interactionResult.severity === 'moderate' ? 'Moderate Interaction' :
                 interactionResult.severity === 'low' ? 'Minor Interaction' : 'No Interactions Found'}
              </h3>
              
              <div style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {interactionResult.message}
              </div>

              <div style={{ display: 'flex', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Medication 1</div>
                  <div style={{ fontWeight: 600 }}>{medOne?.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{medOne?.category}</div>
                </div>
                <div style={{ width: '1px', background: 'var(--border-color)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Medication 2</div>
                  <div style={{ fontWeight: 600 }}>{medTwo?.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{medTwo?.category}</div>
                </div>
              </div>
              
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1.5rem', fontStyle: 'italic' }}>
                Disclaimer: This is a simulated checker for demonstration purposes. Only a qualified healthcare professional can evaluate the significance of a drug interaction.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractionChecker;
