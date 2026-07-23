import { useState } from 'react';
import { Send, Server, Key, CheckCircle, FileText, Code } from 'lucide-react';

export default function BackendWorkspace({ assessment, candidateResponse, onSave }) {
  const [method, setMethod] = useState('POST');
  const [url, setUrl] = useState('/api/v1/auth/login');
  const [token, setToken] = useState('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  const [body, setBody] = useState(`{\n  "email": "candidate@startup.io",\n  "password": "SecurePassword123!"\n}`);
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const handleSendRequest = () => {
    setIsSending(true);
    setTimeout(() => {
      setResponseStatus(200);
      setResponseData({
        success: true,
        message: 'Authentication successful',
        user: { id: 'usr_99182', email: 'candidate@startup.io', role: 'founding_engineer' },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfOTkxODIiLCJleHAiOjE3ODQ5MDAwMDB9',
      });
      onSave({ ...candidateResponse, method, url, token, body });
      setIsSending(false);
    }, 800);
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
      {/* Left: API Tester Panel */}
      <div className="card p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="chip chip-violet font-bold text-xs flex items-center gap-1">
              <Server size={13} /> Backend / API Challenge
            </span>
            <span className="chip chip-gray text-xs font-semibold">REST API / JWT</span>
          </div>

          {/* URL & Method Bar */}
          <div className="flex gap-2">
            <select
              value={method}
              onChange={e => setMethod(e.target.value)}
              className="bg-gray-100 font-bold text-xs px-3 py-2 rounded-xl border border-gray-200"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="input-field text-xs flex-1 font-mono"
            />
            <button
              onClick={handleSendRequest}
              disabled={isSending}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <Send size={13} /> {isSending ? 'Sending...' : 'Send'}
            </button>
          </div>

          {/* Authorization Token */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-hv-muted flex items-center gap-1">
              <Key size={12} /> JWT Authorization Token
            </label>
            <input
              type="text"
              value={token}
              onChange={e => setToken(e.target.value)}
              className="input-field text-xs font-mono py-1.5 text-hv-subtle"
            />
          </div>

          {/* Body Editor */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-hv-muted">JSON Request Body</label>
            <textarea
              rows={8}
              value={body}
              onChange={e => setBody(e.target.value)}
              className="input-field text-xs font-mono pt-2 bg-gray-900 text-emerald-400 border border-gray-800"
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* Right: Live API Response Viewer */}
      <div className="card p-4 flex flex-col justify-between space-y-3 bg-gray-950 text-gray-100 border border-gray-800">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2">
          <span className="text-xs font-bold text-gray-300">Live API Response</span>
          {responseStatus && (
            <span className="chip bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
              HTTP Status: {responseStatus} OK
            </span>
          )}
        </div>

        <div className="flex-1 bg-gray-900 rounded-xl p-4 border border-gray-800 font-mono text-xs overflow-y-auto">
          {responseData ? (
            <pre className="text-sky-300 leading-relaxed whitespace-pre-wrap">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 text-xs">
              Click "Send" to test endpoint response payload.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
