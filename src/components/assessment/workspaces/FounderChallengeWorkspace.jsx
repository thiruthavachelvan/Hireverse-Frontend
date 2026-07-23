import { useState } from 'react';
import { Rocket, Link as LinkIcon, Video, FileText, CheckCircle } from 'lucide-react';

export default function FounderChallengeWorkspace({ assessment, candidateResponse, onSave }) {
  const [githubUrl, setGithubUrl] = useState(candidateResponse.githubUrl || '');
  const [demoUrl, setDemoUrl] = useState(candidateResponse.demoUrl || '');
  const [pitchVideoUrl, setPitchVideoUrl] = useState(candidateResponse.pitchVideoUrl || '');
  const [notes, setNotes] = useState(candidateResponse.notes || '');

  const handleChange = (field, val) => {
    const updated = { ...candidateResponse, [field]: val };
    onSave(updated);
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
      {/* Left: Challenge Brief */}
      <div className="card p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="chip chip-coral font-bold text-xs flex items-center gap-1">
              <Rocket size={13} /> Founder Challenge (0-to-1 Execution)
            </span>
          </div>

          <h2 className="text-lg font-black text-hv-text">
            Build a High-Converting MVP Landing Page & Pitch Strategy
          </h2>

          <p className="text-xs text-hv-muted leading-relaxed">
            As an early-stage founding team member, deliver a working MVP prototype, repository, and investor pitch outline.
          </p>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2 text-xs">
            <p className="font-bold text-hv-text">Required Deliverables:</p>
            <ul className="list-disc pl-4 space-y-1 text-hv-muted">
              <li>Working GitHub Repository</li>
              <li>Deploved Live Web Demo URL</li>
              <li>Loom / YouTube Pitch Video Link</li>
              <li>Launch Plan Notes & Execution Roadmap</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right: Submission Form */}
      <div className="card p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <h3 className="text-sm font-black text-hv-text">Startup Deliverables Submission</h3>

          <div>
            <label className="text-xs font-bold text-hv-muted block mb-1">GitHub Repository URL *</label>
            <input
              type="text"
              value={githubUrl}
              onChange={e => { setGithubUrl(e.target.value); handleChange('githubUrl', e.target.value); }}
              placeholder="https://github.com/org/repo"
              className="input-field text-xs py-2"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-hv-muted block mb-1">Live Web Demo URL *</label>
            <input
              type="text"
              value={demoUrl}
              onChange={e => { setDemoUrl(e.target.value); handleChange('demoUrl', e.target.value); }}
              placeholder="https://app.startup.io"
              className="input-field text-xs py-2"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-hv-muted block mb-1">Loom / YouTube Pitch Video Link</label>
            <input
              type="text"
              value={pitchVideoUrl}
              onChange={e => { setPitchVideoUrl(e.target.value); handleChange('pitchVideoUrl', e.target.value); }}
              placeholder="https://loom.com/share/..."
              className="input-field text-xs py-2"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-hv-muted block mb-1">Execution & Roadmap Notes</label>
            <textarea
              rows={4}
              value={notes}
              onChange={e => { setNotes(e.target.value); handleChange('notes', e.target.value); }}
              placeholder="Detail your launch strategy, tech choices, and growth tactics..."
              className="input-field text-xs pt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
