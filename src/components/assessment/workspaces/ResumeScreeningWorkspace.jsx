import { useState } from 'react';
import { FileText, ExternalLink, CheckCircle, XCircle, Star, User, Sparkles } from 'lucide-react';

export default function ResumeScreeningWorkspace({ assessment, onSave, onSubmit }) {
  const [notes, setNotes] = useState('');
  const [matchScore, setMatchScore] = useState(88);
  const candidate = assessment?.applicantId || assessment?.candidateId || {};

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
      {/* Left: Resume & Portfolio Viewer */}
      <div className="md:col-span-2 card p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
        <div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-hv-violet flex items-center justify-center font-bold text-lg">
                {candidate.name?.charAt(0) || 'C'}
              </div>
              <div>
                <h2 className="text-lg font-black text-hv-text">{candidate.name || 'Candidate Profile'}</h2>
                <p className="text-xs text-hv-muted">{candidate.headline || candidate.email || 'Applicant'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700">
              <Sparkles size={14} className="text-emerald-600" />
              <span>AI Match Score: {matchScore}%</span>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-200/60 rounded-2xl">
              <h3 className="text-xs font-bold text-hv-subtle uppercase tracking-wider mb-2">Resume PDF Document</h3>
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-xs font-bold text-hv-text">
                  <FileText className="text-hv-violet" size={16} />
                  <span>{candidate.name || 'Candidate'}_Resume_2026.pdf</span>
                </div>
                <a
                  href={candidate.resume?.data || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary text-[10px] py-1.5 px-3 flex items-center gap-1"
                >
                  View Full PDF <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* Skills & Experience */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-hv-subtle uppercase tracking-wider">Candidate Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {(candidate.skills || ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS']).map(s => (
                  <span key={s} className="chip chip-violet font-semibold text-xs py-1 px-3">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-hv-muted">
          <span>Verification Status: Partner Verified ✓</span>
          <span>Applied Date: Recent</span>
        </div>
      </div>

      {/* Right: Recruiter Evaluation Panel */}
      <div className="card p-6 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-sm font-black text-hv-text mb-2">Recruiter Screening Notes</h3>
          <p className="text-xs text-hv-muted mb-4">Record your candidate review notes and recommendation for the hiring round pipeline.</p>

          <textarea
            rows={8}
            value={notes}
            onChange={e => { setNotes(e.target.value); onSave({ recruiterNotes: e.target.value }); }}
            placeholder="Type feedback, strengths, alignment with startup culture..."
            className="input-field text-xs pt-2"
          />
        </div>

        <div className="space-y-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => { onSave({ status: 'shortlisted', notes }); onSubmit(); }}
            className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 border-none"
          >
            <CheckCircle size={14} /> Shortlist Candidate
          </button>
          <button
            onClick={() => { onSave({ status: 'rejected', notes }); onSubmit(); }}
            className="btn-ghost w-full py-2.5 text-xs flex items-center justify-center gap-1.5 text-red-600 hover:bg-red-50"
          >
            <XCircle size={14} /> Reject Application
          </button>
        </div>
      </div>
    </div>
  );
}
