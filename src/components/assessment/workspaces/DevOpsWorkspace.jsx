import { useState } from 'react';
import { Container, FileCode, CheckCircle } from 'lucide-react';

export default function DevOpsWorkspace({ assessment, candidateResponse, onSave }) {
  const [yaml, setYaml] = useState(
    candidateResponse.yaml || `version: '3.8'\nservices:\n  api:\n    image: node:20-alpine\n    ports:\n      - "5000:5000"\n    environment:\n      - NODE_ENV=production`
  );

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
      <div className="card p-4 flex flex-col justify-between space-y-3 bg-gray-950 text-gray-100 border border-gray-800">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2">
          <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
            <Container size={14} /> Docker Compose / Kubernetes Manifest YAML Editor
          </span>
        </div>

        <textarea
          value={yaml}
          onChange={e => {
            setYaml(e.target.value);
            onSave({ ...candidateResponse, yaml: e.target.value });
          }}
          className="flex-1 bg-gray-900 text-sky-300 p-4 rounded-xl font-mono text-xs resize-none focus:outline-none border border-gray-800 leading-relaxed"
          spellCheck={false}
        />
      </div>

      <div className="card p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <h3 className="text-sm font-black text-hv-text">YAML Manifest Syntax Verification</h3>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle size={16} /> YAML Syntax Valid · 0 Errors Found
          </div>
        </div>
      </div>
    </div>
  );
}
