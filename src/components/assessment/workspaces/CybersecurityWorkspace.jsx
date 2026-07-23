import { useState } from 'react';
import { Terminal as TermIcon, ShieldAlert, Key, CheckCircle } from 'lucide-react';

export default function CybersecurityWorkspace({ assessment, candidateResponse, onSave }) {
  const [flag, setFlag] = useState(candidateResponse.flag || '');
  const [submittedFlag, setSubmittedFlag] = useState(candidateResponse.isFlagCorrect || false);
  const [terminalLogs, setTerminalLogs] = useState([
    'Connected to CTF Target Node [10.10.14.92]',
    'Scanning ports 80, 443, 8080...',
    'Vulnerability Found: JWT Algorithm Confusion (RS256 -> HS256)',
  ]);

  const handleFlagSubmit = (e) => {
    e.preventDefault();
    if (flag.trim().toLowerCase().includes('hireverse{') || flag.trim().length > 8) {
      setSubmittedFlag(true);
      onSave({ ...candidateResponse, flag, isFlagCorrect: true });
    }
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
      {/* Left: Terminal Emulator */}
      <div className="card p-4 flex flex-col justify-between space-y-3 bg-gray-950 text-emerald-400 font-mono border border-gray-800">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <TermIcon size={14} /> CTF Terminal Shell [target@hireverse-box:~]
          </span>
        </div>

        <div className="flex-1 bg-gray-900 rounded-xl p-4 font-mono text-xs overflow-y-auto space-y-2">
          {terminalLogs.map((log, i) => (
            <p key={i} className="leading-relaxed">$ {log}</p>
          ))}
        </div>
      </div>

      {/* Right: Flag Submission Panel */}
      <div className="card p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="chip chip-coral font-bold text-xs flex items-center gap-1">
              <ShieldAlert size={13} /> Cybersecurity CTF Challenge
            </span>
          </div>

          <h2 className="text-lg font-black text-hv-text">
            Exploit JWT RS256 to HS256 Key Confusion & Extract Admin Flag
          </h2>

          <p className="text-xs text-hv-muted leading-relaxed">
            Obtain the root flag hidden inside the `/etc/secret_flag.txt` file on the target server.
          </p>

          <form onSubmit={handleFlagSubmit} className="space-y-3 pt-4">
            <label className="text-xs font-bold text-hv-muted block">Submit Flag string:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={flag}
                onChange={e => setFlag(e.target.value)}
                placeholder="hireverse{jwt_alg_confusion_pwned_2026}"
                className="input-field text-xs font-mono py-2 flex-1"
              />
              <button type="submit" className="btn-primary text-xs py-2 px-4">
                Submit Flag
              </button>
            </div>

            {submittedFlag && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700 flex items-center gap-2">
                <CheckCircle size={16} /> Flag Verified & Accepted! (+50 pts)
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
