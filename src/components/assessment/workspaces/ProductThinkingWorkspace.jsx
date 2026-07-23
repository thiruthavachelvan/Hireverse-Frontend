import { useState } from 'react';
import { Target, Lightbulb, CheckSquare, FileText } from 'lucide-react';

export default function ProductThinkingWorkspace({ assessment, candidateResponse, onSave }) {
  const currentQ = assessment?.questions?.[0] || {};
  const [response, setResponse] = useState(candidateResponse.productSpec || '');

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
      {/* Left: Problem & Guidelines */}
      <div className="card p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="chip chip-violet font-bold text-xs flex items-center gap-1">
              <Target size={13} /> Product Thinking Challenge
            </span>
          </div>

          <h2 className="text-lg font-black text-hv-text">
            {currentQ.question || 'Improve Swiggy Instamart Checkout Flow'}
          </h2>

          <p className="text-xs text-hv-muted leading-relaxed">
            {currentQ.description || 'Propose product features, UX improvements, and success metrics to increase 3-minute quick commerce conversion.'}
          </p>
        </div>

        <div className="p-4 bg-violet-50 border border-violet-200 rounded-2xl text-xs space-y-2">
          <p className="font-bold text-hv-violet flex items-center gap-1">
            <Lightbulb size={14} /> Evaluation Structure Guide:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-hv-muted">
            <li>Target User Personas & Pain Points</li>
            <li>Proposed Product Feature Specs</li>
            <li>Wireframe / Flow Outline</li>
            <li>Success Metrics (AOV, Conversion %, Drop-off)</li>
          </ul>
        </div>
      </div>

      {/* Right: Spec Editor */}
      <div className="card p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-black text-hv-text flex items-center gap-1.5">
            <FileText size={14} className="text-hv-violet" /> Product Requirements Document (PRD)
          </label>
          <textarea
            rows={16}
            value={response}
            onChange={(e) => {
              setResponse(e.target.value);
              onSave({ ...candidateResponse, productSpec: e.target.value });
            }}
            placeholder="Structure your Product Spec here using Markdown or headers..."
            className="input-field text-xs pt-3 leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-hv-subtle pt-2">
          <span>{response.length} characters written</span>
          <span>Autosaved ✓</span>
        </div>
      </div>
    </div>
  );
}
