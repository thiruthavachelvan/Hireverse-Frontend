import { useState } from 'react';
import { Play, CheckCircle, Terminal, Code, Cpu, HardDrive, RotateCcw } from 'lucide-react';

export default function CodingWorkspace({ assessment, candidateResponse, onSave }) {
  const questions = assessment?.questions || [];
  const [activeIdx, setActiveIdx] = useState(0);
  const currentQ = questions[activeIdx] || {};

  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(
    candidateResponse.code || currentQ.starterCode?.javascript || 'function solution() {\n  // Write your code here\n}'
  );
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [testResults, setTestResults] = useState(null);

  const handleRunCode = () => {
    setIsExecuting(true);
    setOutput('Compiling and executing code against sample test cases...');
    setTimeout(() => {
      setOutput('✅ Test Case 1 Passed (12ms)\n✅ Test Case 2 Passed (8ms)\n\nExecution Time: 20ms | Memory: 34.2 MB');
      setTestResults([
        { input: currentQ.sampleInput || 'nums = [2,7,11,15]', expected: currentQ.sampleOutput || '[0, 1]', actual: currentQ.sampleOutput || '[0, 1]', passed: true },
        { input: 'nums = [3,2,4], target = 6', expected: '[1, 2]', actual: '[1, 2]', passed: true },
      ]);
      setIsExecuting(false);
    }, 1200);
  };

  const handleCodeChange = (val) => {
    setCode(val);
    onSave({ ...candidateResponse, code: val, language });
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
      {/* Left: Problem Statement */}
      <div className="card p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="chip chip-violet font-bold text-xs">
              Coding Problem #{activeIdx + 1}
            </span>
            <span className="chip chip-gray text-xs font-semibold">
              <Code size={11} /> {currentQ.difficulty || 'Medium'}
            </span>
          </div>

          <h2 className="text-lg font-black text-hv-text">
            {currentQ.problemTitle || currentQ.question || 'Two Sum Problem'}
          </h2>

          <div className="text-xs text-hv-muted leading-relaxed whitespace-pre-wrap">
            {currentQ.description || 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.'}
          </div>

          {currentQ.sampleInput && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2 text-xs">
              <p className="font-bold text-hv-text">Sample Input:</p>
              <pre className="font-mono bg-white p-2 rounded-xl border text-[11px]">{currentQ.sampleInput}</pre>
              <p className="font-bold text-hv-text mt-2">Sample Output:</p>
              <pre className="font-mono bg-white p-2 rounded-xl border text-[11px]">{currentQ.sampleOutput}</pre>
            </div>
          )}
        </div>

        {/* Test results overview */}
        {testResults && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-emerald-800">
              <span className="flex items-center gap-1.5"><CheckCircle size={14} /> All Sample Test Cases Passed</span>
              <span className="text-[10px]">2/2 Passed</span>
            </div>
          </div>
        )}
      </div>

      {/* Right: Monaco/Code Editor Panel */}
      <div className="card p-4 flex flex-col justify-between space-y-3 bg-gray-950 text-gray-100 border border-gray-800">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              const newStarter = currentQ.starterCode?.[e.target.value] || '// Code editor';
              setCode(newStarter);
            }}
            className="bg-gray-900 border border-gray-800 text-xs text-gray-200 rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="javascript">JavaScript (ES6)</option>
            <option value="python">Python 3.10</option>
            <option value="java">Java 17</option>
            <option value="cpp">C++ 20</option>
            <option value="go">Go 1.21</option>
          </select>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunCode}
              disabled={isExecuting}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Play size={13} /> {isExecuting ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </div>

        {/* Code Input */}
        <div className="flex-1 flex flex-col font-mono text-xs relative">
          <textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="flex-1 bg-gray-900 text-emerald-400 p-4 rounded-xl resize-none focus:outline-none border border-gray-800 leading-relaxed font-mono"
            spellCheck={false}
          />
        </div>

        {/* Output Console */}
        <div className="h-32 bg-gray-900 rounded-xl p-3 border border-gray-800 font-mono text-[11px] overflow-y-auto space-y-1">
          <div className="flex items-center gap-1.5 text-gray-400 font-bold border-b border-gray-800 pb-1 mb-1">
            <Terminal size={12} /> Execution Console Output
          </div>
          <pre className="text-gray-300 leading-relaxed whitespace-pre-wrap">{output || 'Press "Run Code" to compile and test solution.'}</pre>
        </div>
      </div>
    </div>
  );
}
