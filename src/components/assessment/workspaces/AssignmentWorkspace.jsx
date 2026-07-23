import { useState } from 'react';
import { Package, GitBranch, ExternalLink, FileText, Clock } from 'lucide-react';

export default function AssignmentWorkspace({ assessment, candidateResponse, onSave }) {
  const [githubUrl, setGithubUrl] = useState(candidateResponse.githubUrl || '');
  const [liveUrl, setLiveUrl] = useState(candidateResponse.liveUrl || '');
  const [notes, setNotes] = useState(candidateResponse.notes || '');

  const handleChange = (field, val) => {
    onSave({ ...candidateResponse, [field]: val });
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
      {/* Left: Problem Statement */}
      <div className="card p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="chip chip-violet font-bold text-xs flex items-center gap-1">
              <Package size={13} /> Take-Home Assignment
            </span>
          </div>

          <h2 className="text-lg font-black text-hv-text">
            {assessment?.questions?.[0]?.question || 'Build a Full-Stack REST API with Authentication'}
          </h2>

          <p className="text-xs text-hv-muted leading-relaxed whitespace-pre-wrap">
            {assessment?.questions?.[0]?.description || 'Design and implement a full-stack application with JWT authentication, CRUD operations, and deployment on any cloud platform.'}
          </p>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs space-y-2">
            <p className="font-bold text-hv-text">Deliverables Required:</p>
            <ul className="list-disc pl-4 space-y-1 text-hv-muted">
              <li>GitHub Repository with clean commit history</li>
              <li>Live deployed URL (Vercel, Render, or Railway)</li>
              <li>README with setup instructions</li>
              <li>Optional: Loom demo video walkthrough</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-800">
          <Clock size={14} /> Deadline: 48 hours from round opening
        </div>
      </div>

      {/* Right: Submission Form */}
      <div className="card p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <h3 className="text-sm font-black text-hv-text">Submit Your Assignment</h3>

          <div>
            <label className="text-xs font-bold text-hv-muted block mb-1 flex items-center gap-1">
              <GitBranch size={12} /> GitHub Repository URL *
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={e => { setGithubUrl(e.target.value); handleChange('githubUrl', e.target.value); }}
              placeholder="https://github.com/username/repo"
              className="input-field text-xs py-2 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-hv-muted block mb-1 flex items-center gap-1">
              <ExternalLink size={12} /> Live Demo URL
            </label>
            <input
              type="url"
              value={liveUrl}
              onChange={e => { setLiveUrl(e.target.value); handleChange('liveUrl', e.target.value); }}
              placeholder="https://my-project.vercel.app"
              className="input-field text-xs py-2 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-hv-muted block mb-1 flex items-center gap-1">
              <FileText size={12} /> Implementation Notes & Tech Choices
            </label>
            <textarea
              rows={7}
              value={notes}
              onChange={e => { setNotes(e.target.value); handleChange('notes', e.target.value); }}
              placeholder="Describe your architecture decisions, tech stack, trade-offs, and what you'd improve with more time..."
              className="input-field text-xs pt-2 leading-relaxed"
            />
          </div>
        </div>

        <div className="text-[10px] text-hv-subtle text-right font-semibold pt-2">
          Autosaved to session ✓
        </div>
      </div>
    </div>
  );
}
