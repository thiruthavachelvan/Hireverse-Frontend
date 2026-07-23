import { useState } from 'react';
import { Eye, Code, Layout, Play, RefreshCw } from 'lucide-react';

export default function FrontendWorkspace({ assessment, candidateResponse, onSave }) {
  const currentQ = assessment?.questions?.[0] || {};
  const [htmlCode, setHtmlCode] = useState(
    candidateResponse.html || `<div class="card">\n  <h2>Startup Glassmorphic Card</h2>\n  <button class="btn">Click Me</button>\n</div>`
  );
  const [cssCode, setCssCode] = useState(
    candidateResponse.css || `body { font-family: sans-serif; background: #f8f8fc; display: flex; justify-content: center; align-items: center; min-h: 100vh; }\n.card { background: rgba(255,255,255,0.8); backdrop-filter: blur(12px); padding: 2rem; border-radius: 1rem; border: 1px solid rgba(255,255,255,0.6); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }\n.btn { background: linear-gradient(135deg, #FF6B6B, #8B5CF6); color: white; border: none; padding: 0.5rem 1.5rem; border-radius: 0.5rem; cursor: pointer; font-weight: bold; }`
  );
  const [activeTab, setActiveTab] = useState('html');

  const combinedSrc = `
    <html>
      <head><style>${cssCode}</style></head>
      <body>${htmlCode}</body>
    </html>
  `;

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
      {/* Left: Code Editor */}
      <div className="card p-4 flex flex-col justify-between space-y-3 bg-gray-950 text-gray-100 border border-gray-800">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${activeTab === 'html' ? 'bg-hv-violet text-white' : 'text-gray-400 hover:text-white'}`}
            >
              HTML
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${activeTab === 'css' ? 'bg-hv-violet text-white' : 'text-gray-400 hover:text-white'}`}
            >
              CSS
            </button>
          </div>
          <span className="text-[10px] text-gray-400 font-bold">Live UI Builder</span>
        </div>

        <div className="flex-1 flex flex-col font-mono text-xs relative">
          <textarea
            value={activeTab === 'html' ? htmlCode : cssCode}
            onChange={(e) => {
              if (activeTab === 'html') {
                setHtmlCode(e.target.value);
                onSave({ ...candidateResponse, html: e.target.value, css: cssCode });
              } else {
                setCssCode(e.target.value);
                onSave({ ...candidateResponse, html: htmlCode, css: e.target.value });
              }
            }}
            className="flex-1 bg-gray-900 text-sky-300 p-4 rounded-xl resize-none focus:outline-none border border-gray-800 font-mono leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Right: Live Preview Panel */}
      <div className="card p-4 flex flex-col justify-between space-y-3 overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <span className="text-xs font-extrabold text-hv-text flex items-center gap-1.5">
            <Eye size={14} className="text-hv-violet" /> Live Browser Preview
          </span>
          <span className="chip chip-success text-[9px]">Hot Reloading</span>
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-inner relative">
          <iframe
            srcDoc={combinedSrc}
            title="Live Preview"
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </div>
  );
}
