import { useState } from 'react';
import { Bug, Play, CheckCircle, Terminal, RefreshCw } from 'lucide-react';

export default function DebuggingWorkspace({ assessment, candidateResponse, onSave }) {
  const questions = assessment?.questions || [];
  const currentQ = questions[0] || {};

  const [code, setCode] = useState(
    candidateResponse.code || currentQ.starterCode?.javascript || `// Buggy code example\nfunction fixBug() {\n  // Identify and fix state mutation bug\n}`
  );
  const [output, setOutput] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const handleTestFix = () => {
    setIsTesting(true);
    setOutput('Running static analysis and test suite against buggy starter snippet...');
    setTimeout(() => {
      setOutput('✅ Bug Resolution Confirmed!\n✅ Stale closure reference removed.\n✅ 4/4 edge cases passed.');
      setIsTesting(false);
    }, 1000);
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
      <div className="card p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="chip chip-warning font-bold text-xs flex items-center gap-1">
              <Bug size={13} /> Debugging Challenge
            </span>
            <span className="chip chip-gray text-xs font-semibold">
              {currentQ.technology || 'JavaScript'}
            </span>
          </div>

          <h2 className="text-lg font-black text-hv-text">
            {currentQ.question || 'Fix Buggy Component / Routine'}
          </h2>

          <div className="text-xs text-hv-muted leading-relaxed whitespace-pre-wrap">
            {currentQ.description || 'Identify the bug in the code snippet on the right panel and refactor it to resolve execution failure.'}
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1">
          <p className="font-bold text-amber-900">Debugging Instructions:</p>
          <p className="text-amber-800 leading-relaxed">
            Modify the code directly in the editor to fix memory leaks, stale states, or logical syntax bugs.
          </p>
        </div>
      </div>

      <div className="card p-4 flex flex-col justify-between space-y-3 bg-gray-950 text-gray-100 border border-gray-800">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <span className="text-xs font-bold text-hv-violet flex items-center gap-1.5">
            <Bug size={14} /> Buggy Code Editor
          </span>

          <button
            onClick={handleTestFix}
            disabled={isTesting}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Play size={13} /> {isTesting ? 'Testing...' : 'Test Fix'}
          </button>
        </div>

        <div className="flex-1 flex flex-col font-mono text-xs relative">
          <textarea
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              onSave({ ...candidateResponse, code: e.target.value });
            }}
            className="flex-1 bg-gray-900 text-amber-300 p-4 rounded-xl resize-none focus:outline-none border border-gray-800 leading-relaxed font-mono"
            spellCheck={false}
          />
        </div>

        <div className="h-32 bg-gray-900 rounded-xl p-3 border border-gray-800 font-mono text-[11px] overflow-y-auto space-y-1">
          <div className="flex items-center gap-1.5 text-gray-400 font-bold border-b border-gray-800 pb-1 mb-1">
            <Terminal size={12} /> Test Suite Console
          </div>
          <pre className="text-gray-300 leading-relaxed whitespace-pre-wrap">{output || 'Click "Test Fix" to run candidate code through bug verifier.'}</pre>
        </div>
      </div>
    </div>
  );
}
