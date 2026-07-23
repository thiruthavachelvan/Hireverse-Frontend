import { useState } from 'react';
import { Palette, ExternalLink, Image, Upload } from 'lucide-react';

export default function UIDesignWorkspace({ assessment, candidateResponse, onSave }) {
  const [figmaUrl, setFigmaUrl] = useState(candidateResponse.figmaUrl || '');
  const [prototypeUrl, setPrototypeUrl] = useState(candidateResponse.prototypeUrl || '');
  const [designRationale, setDesignRationale] = useState(candidateResponse.designRationale || '');

  const handleChange = (field, val) => {
    onSave({ ...candidateResponse, [field]: val });
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
      {/* Left: Design Brief */}
      <div className="card p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="chip chip-violet font-bold text-xs flex items-center gap-1">
              <Palette size={13} /> UI/UX Design Challenge
            </span>
          </div>

          <h2 className="text-lg font-black text-hv-text">
            Redesign the Startup Onboarding Experience
          </h2>

          <p className="text-xs text-hv-muted leading-relaxed">
            Design a sleek, high-converting 3-step onboarding flow for a developer-focused SaaS platform.
          </p>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-2 text-xs">
            <p className="font-bold text-purple-900">Design Deliverables:</p>
            <ul className="list-disc pl-4 space-y-1 text-purple-800">
              <li>Figma Design File Link (View/Edit Access)</li>
              <li>Figma Prototype Link</li>
              <li>UX Design Rationale & Component System Notes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right: Submission Panel */}
      <div className="card p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <h3 className="text-sm font-black text-hv-text">Figma & Prototype Links</h3>

          <div>
            <label className="text-xs font-bold text-hv-muted block mb-1">Figma Design File Link *</label>
            <input
              type="text"
              value={figmaUrl}
              onChange={e => { setFigmaUrl(e.target.value); handleChange('figmaUrl', e.target.value); }}
              placeholder="https://figma.com/file/..."
              className="input-field text-xs py-2"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-hv-muted block mb-1">Figma Prototype Link</label>
            <input
              type="text"
              value={prototypeUrl}
              onChange={e => { setPrototypeUrl(e.target.value); handleChange('prototypeUrl', e.target.value); }}
              placeholder="https://figma.com/proto/..."
              className="input-field text-xs py-2"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-hv-muted block mb-1">UX Rationale & Typography Choice</label>
            <textarea
              rows={5}
              value={designRationale}
              onChange={e => { setDesignRationale(e.target.value); handleChange('designRationale', e.target.value); }}
              placeholder="Explain color hierarchy, accessibility (WCAG), micro-animations, and design system choices..."
              className="input-field text-xs pt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
