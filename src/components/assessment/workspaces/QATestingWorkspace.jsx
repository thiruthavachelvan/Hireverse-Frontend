import { useState } from 'react';
import { AlertCircle, Plus, Trash2, CheckSquare } from 'lucide-react';

export default function QATestingWorkspace({ assessment, candidateResponse, onSave }) {
  const [bugs, setBugs] = useState(
    candidateResponse.bugs || [
      { id: '1', title: 'Payment modal fails to close on ESC key', severity: 'Medium', steps: '1. Open payment modal\n2. Press ESC\n3. Modal remains open' }
    ]
  );

  const addBug = () => {
    const newBugs = [...bugs, { id: Date.now().toString(), title: 'New Bug Title', severity: 'High', steps: 'Reproduction steps...' }];
    setBugs(newBugs);
    onSave({ ...candidateResponse, bugs: newBugs });
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
      {/* Left: QA Brief & Bug List */}
      <div className="card p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="chip chip-coral font-bold text-xs flex items-center gap-1">
              <AlertCircle size={13} /> QA Testing & Bug Board
            </span>
            <button onClick={addBug} className="btn-primary text-[10px] py-1.5 px-3 flex items-center gap-1">
              <Plus size={12} /> File Bug Report
            </button>
          </div>

          <h2 className="text-lg font-black text-hv-text">
            Execute QA Test Suite & Log Defect Reports
          </h2>

          <div className="space-y-3 mt-4">
            {bugs.map((b, idx) => (
              <div key={b.id} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-hv-text">Bug #{idx + 1}: {b.title}</span>
                  <span className={`chip text-[9px] ${
                    b.severity === 'Critical' ? 'chip-danger' :
                    b.severity === 'High' ? 'chip-warning' : 'chip-violet'
                  }`}>
                    {b.severity}
                  </span>
                </div>
                <p className="text-hv-muted font-mono text-[11px] whitespace-pre-wrap">{b.steps}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Bug Reporter */}
      <div className="card p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <h3 className="text-sm font-black text-hv-text">Logged Bug Count: {bugs.length}</h3>
          <p className="text-xs text-hv-muted">
            Inspect the target application build, log edge case failures, severity ratings, and reproduction steps.
          </p>
        </div>
      </div>
    </div>
  );
}
