import { useState } from 'react';
import { Heart, Mic, Video, FileText } from 'lucide-react';

export default function CultureFitWorkspace({ assessment, candidateResponse, onSave }) {
  const [textResponse, setTextResponse] = useState(candidateResponse.cultureFitText || '');
  const [mode, setMode] = useState('written'); // written | audio | video

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
      {/* Left: Culture Prompt */}
      <div className="card p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="chip chip-violet font-bold text-xs flex items-center gap-1">
              <Heart size={13} /> Startup Culture Fit Round
            </span>
          </div>

          <h2 className="text-lg font-black text-hv-text">
            Why choose an early-stage startup over an MNC? How do you handle extreme ambiguity?
          </h2>

          <p className="text-xs text-hv-muted leading-relaxed">
            Share your personal philosophy on startup speed, high ownership, customer focus, and dealing with rapid pivots.
          </p>
        </div>
      </div>

      {/* Right: Submission mode */}
      <div className="card p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="flex rounded-xl border border-gray-200 overflow-hidden text-xs font-bold">
            <button
              onClick={() => setMode('written')}
              className={`flex-1 py-2 flex items-center justify-center gap-1.5 ${mode === 'written' ? 'bg-hv-violet text-white' : 'bg-gray-50 text-hv-muted'}`}
            >
              <FileText size={13} /> Written Response
            </button>
            <button
              onClick={() => setMode('video')}
              className={`flex-1 py-2 flex items-center justify-center gap-1.5 ${mode === 'video' ? 'bg-hv-violet text-white' : 'bg-gray-50 text-hv-muted'}`}
            >
              <Video size={13} /> Video Pitch
            </button>
          </div>

          {mode === 'written' ? (
            <textarea
              rows={12}
              value={textResponse}
              onChange={e => {
                setTextResponse(e.target.value);
                onSave({ ...candidateResponse, cultureFitText: e.target.value });
              }}
              placeholder="Share your personal story, values, and startup mindset..."
              className="input-field text-xs pt-3 leading-relaxed"
            />
          ) : (
            <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center space-y-3">
              <Video size={36} className="text-hv-violet mx-auto" />
              <p className="text-xs font-bold text-hv-text">Record 2-Minute Video Response</p>
              <button className="btn-primary text-xs py-2 px-4">Start Recording</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
