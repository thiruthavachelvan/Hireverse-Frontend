import { useState } from 'react';
import { Calendar, Video, Star, FileText } from 'lucide-react';

export default function HRInterviewWorkspace({ assessment, candidateResponse, onSave }) {
  const [rating, setRating] = useState(candidateResponse.rating || 5);
  const [feedback, setFeedback] = useState(candidateResponse.feedback || '');

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
      {/* Left: Meeting & Schedule */}
      <div className="card p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="chip chip-violet font-bold text-xs flex items-center gap-1">
              <Calendar size={13} /> HR Live Panel Interview
            </span>
          </div>

          <div className="p-6 bg-gradient-to-br from-hv-violet/10 to-hv-coral/10 rounded-2xl border border-violet-200 text-center space-y-3">
            <Video size={36} className="text-hv-violet mx-auto" />
            <h3 className="font-extrabold text-sm text-hv-text">Google Meet Live Room Ready</h3>
            <a
              href="https://meet.google.com/new"
              target="_blank"
              rel="noreferrer"
              className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <Video size={14} /> Join Video Room Now
            </a>
          </div>
        </div>
      </div>

      {/* Right: Feedback & Evaluation */}
      <div className="card p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <h3 className="text-sm font-black text-hv-text">Interviewer Feedback & Score</h3>

          <div className="space-y-2">
            <label className="text-xs font-bold text-hv-muted block">Overall Candidate Rating (1 - 5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => { setRating(star); onSave({ ...candidateResponse, rating: star }); }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    rating >= star ? 'bg-amber-400 text-white border-amber-400' : 'bg-gray-50 text-gray-400 border-gray-200'
                  }`}
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-hv-muted block mb-1">Detailed Recruiter Notes</label>
            <textarea
              rows={6}
              value={feedback}
              onChange={e => { setFeedback(e.target.value); onSave({ ...candidateResponse, feedback: e.target.value }); }}
              placeholder="Record candidate communication, salary expectation, availability..."
              className="input-field text-xs pt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
