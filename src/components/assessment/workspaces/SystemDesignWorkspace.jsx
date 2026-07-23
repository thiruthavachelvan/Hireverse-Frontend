import { useState } from 'react';
import { Layers, Server, Database, Cpu, Zap, HardDrive, Globe, Plus, Move } from 'lucide-react';

const NODE_TYPES = [
  { type: 'server', label: 'App Microservice', icon: Server, color: 'border-blue-300 bg-blue-50 text-blue-800' },
  { type: 'db', label: 'PostgreSQL Database', icon: Database, color: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
  { type: 'cache', label: 'Redis Cache', icon: Zap, color: 'border-amber-300 bg-amber-50 text-amber-800' },
  { type: 'queue', label: 'Kafka Queue', icon: HardDrive, color: 'border-purple-300 bg-purple-50 text-purple-800' },
  { type: 'cdn', label: 'Cloudflare CDN', icon: Globe, color: 'border-sky-300 bg-sky-50 text-sky-800' },
];

export default function SystemDesignWorkspace({ assessment, candidateResponse, onSave }) {
  const [nodes, setNodes] = useState(
    candidateResponse.nodes || [
      { id: '1', type: 'cdn', label: 'Cloudflare CDN', x: 50, y: 100 },
      { id: '2', type: 'server', label: 'API Gateway', x: 220, y: 100 },
      { id: '3', type: 'db', label: 'Primary DB', x: 400, y: 100 },
    ]
  );

  const addNode = (nType) => {
    const newNode = {
      id: Date.now().toString(),
      type: nType.type,
      label: nType.label,
      x: 100 + nodes.length * 30,
      y: 100 + nodes.length * 20,
    };
    const updated = [...nodes, newNode];
    setNodes(updated);
    onSave({ ...candidateResponse, nodes: updated });
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
      {/* Left Toolbar */}
      <div className="card p-6 space-y-4">
        <h3 className="text-xs font-bold text-hv-subtle uppercase tracking-wider">Architecture Component Palette</h3>
        <div className="space-y-2">
          {NODE_TYPES.map((nt) => {
            const Icon = nt.icon;
            return (
              <button
                key={nt.type}
                onClick={() => addNode(nt)}
                className={`w-full p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${nt.color}`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} />
                  <span>{nt.label}</span>
                </div>
                <Plus size={14} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Canvas */}
      <div className="lg:col-span-3 card p-6 flex flex-col justify-between space-y-4 bg-gray-50/70 relative border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <span className="text-xs font-black text-hv-text flex items-center gap-1.5">
            <Layers size={14} className="text-hv-violet" /> System Design Architecture Canvas
          </span>
          <span className="text-[10px] text-hv-muted font-semibold">Drag & Connect Nodes</span>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-white rounded-2xl border border-dashed border-gray-300 relative p-6 overflow-auto min-h-[400px]">
          {nodes.map((node) => (
            <div
              key={node.id}
              style={{ left: `${node.x}px`, top: `${node.y}px` }}
              className="absolute p-3 bg-white rounded-2xl border border-hv-violet shadow-md flex items-center gap-2 text-xs font-bold text-hv-text cursor-move group"
            >
              <Move size={12} className="text-hv-subtle" />
              <span>{node.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
