import { useState } from 'react';
import { UserCheck, FileText } from 'lucide-react';

export default function BehavioralWorkspace({ assessment, candidateResponse, onSave }) {
  const [starData, setStarData] = useState(
    candidateResponse.starData || { situation: '', task: '', action: '', result: '' }
  );

  const handleUpdate = (field, val) => {
    const updated = { ...starData, [field]: val };
    setStarData(updated);
    onSave({ ...candidateResponse, starData: updated });
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
      {/* Left: Prompt */}
      <div className="card p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="chip chip-violet font-bold text-xs flex items-center gap-1">
              <UserCheck size={13} /> Behavioral Interview (STAR Method)
            </span>
          </div>

          <h2 className="text-lg font-black text-hv-text">
            Describe a situation where a critical feature broke right before release. How did you handle it?
          </h2>
        </div>
      </div>

      {/* Right: STAR Method Template */}
      <div className="card p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-hv-text block mb-1">S — Situation</label>
            <input
              type="text"
              value={starData.situation}
              onChange={e => handleUpdate('situation', e.target.value)}
              placeholder="Describe the context and background..."
              className="input-field text-xs py-2"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-hv-text block mb-1">T — Task</label>
            <input
              type="text"
              value={starData.task}
              onChange={e => handleUpdate('task', e.target.value)}
              placeholder="What was your specific responsibility?"
              className="input-field text-xs py-2"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-hv-text block mb-1">A — Action</label>
            <textarea
              rows={3}
              value={starData.action}
              onChange={e => handleUpdate('action', e.target.value)}
              placeholder="Detail the exact steps and decisions you took..."
              className="input-field text-xs pt-2"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-hv-text block mb-1">R — Result</label>
            <textarea
              rows={2}
              value={starData.result}
              onChange={e => handleUpdate('result', e.target.value)}
              placeholder="What was the outcome? Include metrics or key learnings..."
              className="input-field text-xs pt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
