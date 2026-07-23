import { useState } from 'react';
import { Cpu, Play, BarChart, FileCode, CheckCircle } from 'lucide-react';

export default function AIMLWorkspace({ assessment, candidateResponse, onSave }) {
  const [code, setCode] = useState(
    candidateResponse.code || `# AI/ML Model Training Notebook\nimport torch\nimport torch.nn as nn\n\nclass StartupClassifier(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.fc = nn.Linear(128, 2)\n        \n    def forward(self, x):\n        return self.fc(x)`
  );
  const [metrics, setMetrics] = useState(null);
  const [isTraining, setIsTraining] = useState(false);

  const handleTrain = () => {
    setIsTraining(true);
    setTimeout(() => {
      setMetrics({
        accuracy: '94.8%',
        precision: '93.2%',
        recall: '95.1%',
        f1Score: '0.941',
        loss: '0.124'
      });
      onSave({ ...candidateResponse, code, metrics: { accuracy: '94.8%' } });
      setIsTraining(false);
    }, 1200);
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
      {/* Left: Jupyter Style Editor */}
      <div className="card p-4 flex flex-col justify-between space-y-3 bg-gray-950 text-gray-100 border border-gray-800">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2">
          <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
            <Cpu size={14} /> PyTorch / TensorFlow Jupyter Notebook Cell
          </span>
          <button
            onClick={handleTrain}
            disabled={isTraining}
            className="px-4 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
          >
            <Play size={12} /> {isTraining ? 'Training...' : 'Run Cell'}
          </button>
        </div>

        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          className="flex-1 bg-gray-900 text-emerald-300 p-4 rounded-xl font-mono text-xs resize-none focus:outline-none border border-gray-800"
          spellCheck={false}
        />
      </div>

      {/* Right: Metrics Dashboard */}
      <div className="card p-6 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-sm font-black text-hv-text mb-4 flex items-center gap-1.5">
            <BarChart className="text-hv-violet" size={16} /> Model Metrics & Evaluation
          </h3>

          {metrics ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                <p className="text-xs font-bold text-emerald-800">Accuracy</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">{metrics.accuracy}</p>
              </div>
              <div className="p-4 bg-violet-50 border border-violet-200 rounded-2xl text-center">
                <p className="text-xs font-bold text-hv-violet">F1 Score</p>
                <p className="text-2xl font-black text-hv-violet mt-1">{metrics.f1Score}</p>
              </div>
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-center">
                <p className="text-xs font-bold text-sky-800">Precision</p>
                <p className="text-2xl font-black text-sky-600 mt-1">{metrics.precision}</p>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center">
                <p className="text-xs font-bold text-gray-700">Loss</p>
                <p className="text-2xl font-black text-gray-800 mt-1">{metrics.loss}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-hv-muted text-center py-12">Run notebook cell to evaluate model performance metrics.</p>
          )}
        </div>
      </div>
    </div>
  );
}
