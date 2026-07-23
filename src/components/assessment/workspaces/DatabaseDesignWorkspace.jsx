import { useState } from 'react';
import { Database, Plus, Trash2, Key, Code, Download } from 'lucide-react';

export default function DatabaseDesignWorkspace({ assessment, candidateResponse, onSave }) {
  const [tables, setTables] = useState(
    candidateResponse.tables || [
      { name: 'Users', fields: [{ name: 'id', type: 'UUID', isPK: true }, { name: 'email', type: 'VARCHAR(255)', isPK: false }] },
      { name: 'Orders', fields: [{ name: 'id', type: 'UUID', isPK: true }, { name: 'user_id', type: 'UUID', isPK: false }, { name: 'amount', type: 'DECIMAL', isPK: false }] }
    ]
  );

  const [activeTableIdx, setActiveTableIdx] = useState(0);

  const addTable = () => {
    const newName = `Collection_${tables.length + 1}`;
    const newTables = [...tables, { name: newName, fields: [{ name: 'id', type: 'UUID', isPK: true }] }];
    setTables(newTables);
    onSave({ ...candidateResponse, tables: newTables });
  };

  const addField = (tIdx) => {
    const copy = [...tables];
    copy[tIdx].fields.push({ name: 'field_name', type: 'VARCHAR(100)', isPK: false });
    setTables(copy);
    onSave({ ...candidateResponse, tables: copy });
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
      {/* Left: Table List */}
      <div className="card p-6 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-black text-hv-text flex items-center gap-1.5">
              <Database className="text-hv-violet" size={16} /> ER Tables / Collections
            </h3>
            <button onClick={addTable} className="btn-primary text-[10px] py-1.5 px-3 flex items-center gap-1">
              <Plus size={12} /> Add Table
            </button>
          </div>

          <div className="space-y-2 mt-4">
            {tables.map((t, idx) => (
              <div
                key={idx}
                onClick={() => setActiveTableIdx(idx)}
                className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-between ${
                  activeTableIdx === idx ? 'bg-violet-50 border-hv-violet text-hv-violet' : 'bg-gray-50 border-gray-200 text-hv-text'
                }`}
              >
                <span>{t.name} ({t.fields.length} columns)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center: Column / Field Editor */}
      <div className="card p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
        {tables[activeTableIdx] && (
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-hv-text">
                Table: {tables[activeTableIdx].name}
              </h3>
              <button
                onClick={() => addField(activeTableIdx)}
                className="btn-ghost text-[10px] py-1 px-2.5 flex items-center gap-1"
              >
                <Plus size={12} /> Add Column
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {tables[activeTableIdx].fields.map((f, fIdx) => (
                <div key={fIdx} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-xs">
                  <Key size={12} className={f.isPK ? 'text-amber-500' : 'text-gray-400'} />
                  <input
                    type="text"
                    value={f.name}
                    onChange={(e) => {
                      const copy = [...tables];
                      copy[activeTableIdx].fields[fIdx].name = e.target.value;
                      setTables(copy);
                      onSave({ ...candidateResponse, tables: copy });
                    }}
                    className="input-field text-xs py-1 flex-1 font-mono"
                  />
                  <select
                    value={f.type}
                    onChange={(e) => {
                      const copy = [...tables];
                      copy[activeTableIdx].fields[fIdx].type = e.target.value;
                      setTables(copy);
                      onSave({ ...candidateResponse, tables: copy });
                    }}
                    className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-mono"
                  >
                    <option>VARCHAR(255)</option>
                    <option>UUID</option>
                    <option>INTEGER</option>
                    <option>DECIMAL</option>
                    <option>BOOLEAN</option>
                    <option>TIMESTAMP</option>
                    <option>ObjectId</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: DDL Output */}
      <div className="card p-4 bg-gray-950 text-gray-100 border border-gray-800 flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2">
          <span className="text-xs font-bold text-gray-300 flex items-center gap-1">
            <Code size={14} /> Generated DDL SQL Schema
          </span>
        </div>

        <div className="flex-1 bg-gray-900 rounded-xl p-4 border border-gray-800 font-mono text-[11px] overflow-y-auto">
          <pre className="text-emerald-300 leading-relaxed">
            {tables.map(t => (
              `CREATE TABLE ${t.name.toLowerCase()} (\n` +
              t.fields.map(f => `  ${f.name} ${f.type}${f.isPK ? ' PRIMARY KEY' : ''}`).join(',\n') +
              '\n);\n\n'
            )).join('')}
          </pre>
        </div>
      </div>
    </div>
  );
}
