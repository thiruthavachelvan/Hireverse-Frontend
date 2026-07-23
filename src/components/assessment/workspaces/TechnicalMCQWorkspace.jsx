import { useState } from 'react';
import { CheckCircle2, ArrowLeft, ArrowRight, Code, Bookmark } from 'lucide-react';

export default function TechnicalMCQWorkspace({ assessment, candidateResponse, onSave }) {
  const questions = assessment?.questions || [];
  const [activeIdx, setActiveIdx] = useState(0);
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const currentQ = questions[activeIdx] || {};

  const handleSelectOption = (opt) => {
    onSave({ ...candidateResponse, [currentQ._id || activeIdx]: opt });
  };

  const toggleReview = (idx) => {
    setMarkedForReview(prev => {
      const copy = new Set(prev);
      if (copy.has(idx)) copy.delete(idx);
      else copy.add(idx);
      return copy;
    });
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
      <div className="lg:col-span-3 card p-6 flex flex-col justify-between space-y-6 overflow-y-auto">
        <div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="chip chip-violet font-bold text-xs">
                Question {activeIdx + 1} of {questions.length}
              </span>
              {currentQ.technology && (
                <span className="chip chip-gray text-xs font-semibold">
                  <Code size={11} /> {currentQ.technology}
                </span>
              )}
            </div>

            <button
              onClick={() => toggleReview(activeIdx)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                markedForReview.has(activeIdx)
                  ? 'bg-amber-100 text-amber-800 border-amber-300 font-black'
                  : 'bg-gray-50 border-gray-200 text-hv-muted'
              }`}
            >
              <Bookmark size={14} /> {markedForReview.has(activeIdx) ? 'Marked' : 'Mark Review'}
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <h2 className="text-base font-black text-hv-text leading-relaxed">
              {currentQ.question}
            </h2>

            {currentQ.description && (
              <div className="p-4 bg-gray-900 text-gray-100 font-mono text-xs rounded-2xl overflow-x-auto border border-gray-800">
                <pre>{currentQ.description}</pre>
              </div>
            )}

            <div className="space-y-3 pt-2">
              {(currentQ.options || ['Option A', 'Option B', 'Option C', 'Option D']).map((opt, i) => {
                const selected = candidateResponse[currentQ._id || activeIdx] === opt;
                return (
                  <div
                    key={i}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-4 rounded-2xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                      selected
                        ? 'border-hv-violet bg-violet-50/60 text-hv-text shadow-sm ring-1 ring-hv-violet'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-hv-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                        selected ? 'bg-hv-violet text-white' : 'bg-gray-100 text-hv-muted'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt}</span>
                    </div>
                    {selected && <CheckCircle2 size={16} className="text-hv-violet" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <button
            disabled={activeIdx === 0}
            onClick={() => setActiveIdx(i => i - 1)}
            className="btn-ghost py-2 px-4 text-xs flex items-center gap-1 disabled:opacity-40"
          >
            <ArrowLeft size={14} /> Previous
          </button>
          <span className="text-xs font-bold text-hv-muted">
            {Object.keys(candidateResponse).length} of {questions.length} answered
          </span>
          <button
            disabled={activeIdx === questions.length - 1}
            onClick={() => setActiveIdx(i => i + 1)}
            className="btn-primary py-2 px-5 text-xs flex items-center gap-1 disabled:opacity-40"
          >
            Next <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="card p-6 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xs font-bold text-hv-subtle uppercase tracking-wider mb-3">Question Palette</h3>
          <div className="grid grid-cols-4 gap-2">
            {questions.map((q, idx) => {
              const isAnswered = !!candidateResponse[q._id || idx];
              const isReview = markedForReview.has(idx);
              const isCurrent = idx === activeIdx;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                    isCurrent ? 'ring-2 ring-hv-violet ring-offset-2 font-black' : ''
                  } ${
                    isReview ? 'bg-amber-400 text-white' :
                    isAnswered ? 'bg-emerald-500 text-white' :
                    'bg-gray-100 text-hv-muted hover:bg-gray-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 text-[10px] font-semibold text-hv-muted pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Answered</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-400" /> Review</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-200" /> Unanswered</div>
        </div>
      </div>
    </div>
  );
}
