import { useState } from 'react';
import { CheckCircle2, Bookmark, Calculator, Edit3, ArrowLeft, ArrowRight } from 'lucide-react';

export default function AptitudeWorkspace({ assessment, candidateResponse, onSave }) {
  const questions = assessment?.questions || [];
  const [activeIdx, setActiveIdx] = useState(0);
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [showCalculator, setShowCalculator] = useState(false);
  const [showRoughSheet, setShowRoughSheet] = useState(false);
  const [roughNotes, setRoughNotes] = useState('');
  const [calcInput, setCalcInput] = useState('');

  const currentQ = questions[activeIdx] || {};

  const handleSelectOption = (opt) => {
    const updated = { ...candidateResponse, [currentQ._id || activeIdx]: opt };
    onSave(updated);
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
      {/* Left 3 cols: Question & Options */}
      <div className="lg:col-span-3 card p-6 flex flex-col justify-between space-y-6 overflow-y-auto">
        <div>
          {/* Action Bar */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <span className="chip chip-violet font-bold text-xs">
              Question {activeIdx + 1} of {questions.length}
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCalculator(v => !v)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  showCalculator ? 'bg-violet-100 text-hv-violet border-violet-300' : 'bg-gray-50 border-gray-200 text-hv-muted'
                }`}
              >
                <Calculator size={14} /> Calculator
              </button>
              <button
                onClick={() => setShowRoughSheet(v => !v)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  showRoughSheet ? 'bg-violet-100 text-hv-violet border-violet-300' : 'bg-gray-50 border-gray-200 text-hv-muted'
                }`}
              >
                <Edit3 size={14} /> Rough Sheet
              </button>
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
          </div>

          {/* Calculator Popup */}
          {showCalculator && (
            <div className="mt-3 p-3 bg-gray-900 text-white rounded-2xl max-w-xs space-y-2 border border-gray-700 shadow-xl">
              <div className="text-right text-lg font-mono p-2 bg-gray-800 rounded-xl min-h-[40px]">
                {calcInput || '0'}
              </div>
              <div className="grid grid-cols-4 gap-1 text-xs font-bold text-center">
                {['7','8','9','/','4','5','6','*','1','2','3','-','C','0','.','+'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => {
                      if (btn === 'C') setCalcInput('');
                      else setCalcInput(prev => prev + btn);
                    }}
                    className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl"
                  >
                    {btn}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  try { setCalcInput(eval(calcInput).toString()); } catch { setCalcInput('Error'); }
                }}
                className="w-full py-2 bg-hv-violet text-white font-bold rounded-xl text-xs"
              >
                Calculate =
              </button>
            </div>
          )}

          {/* Rough Scratchpad */}
          {showRoughSheet && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
              <p className="text-xs font-bold text-amber-900">Scratchpad Rough Sheet</p>
              <textarea
                rows={4}
                value={roughNotes}
                onChange={e => setRoughNotes(e.target.value)}
                placeholder="Scratch calculations, formulas, or logical notes here..."
                className="w-full bg-white p-2.5 rounded-xl border border-amber-200 text-xs resize-none"
              />
            </div>
          )}

          {/* Question Statement */}
          <div className="mt-6 space-y-4">
            <h2 className="text-base font-black text-hv-text leading-relaxed">
              {currentQ.question || 'Select an option to complete the quantitative aptitude question.'}
            </h2>

            {/* Options */}
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

        {/* Navigation CTAs */}
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

      {/* Right col: Question Palette */}
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

        {/* Legend */}
        <div className="space-y-2 text-[10px] font-semibold text-hv-muted pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" /> Answered
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400" /> Marked for Review
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-200" /> Unanswered
          </div>
        </div>
      </div>
    </div>
  );
}
