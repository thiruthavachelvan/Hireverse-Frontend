import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import {
  HelpCircle, Plus, Search, Filter, Trash2, Edit3, Upload,
  BarChart2, CheckCircle, Code, Layers, Sparkles, AlertCircle,
  Eye, Tag, Clock, Award, ChevronRight, X, ArrowLeft, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  'All',
  'Aptitude',
  'Technical',
  'Coding',
  'Debugging',
  'Frontend',
  'Backend',
  'Database',
  'System Design',
  'Product Thinking',
  'Founder Challenge',
  'UI/UX Design',
  'QA Testing',
  'AI / Machine Learning',
  'Cybersecurity',
  'DevOps',
  'Culture Fit',
  'Behavioral',
];

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard', 'Expert'];

const AdminQuestionBank = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Form State
  const [formState, setFormState] = useState({
    category: 'Technical',
    subCategory: 'React',
    difficulty: 'Medium',
    type: 'MCQ',
    question: '',
    description: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    expectedTime: 15,
    marks: 10,
    technology: 'JavaScript',
    tags: 'react, frontend',
  });

  const [importJson, setImportJson] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
    fetchAnalytics();
  }, [selectedCategory, selectedDifficulty, page, search]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        search: search.trim() || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
      };
      const { data } = await api.get('/question-bank', { params });
      setQuestions(data.questions || []);
      setTotalPages(data.pages || 1);
      setTotalCount(data.total || 0);
    } catch (err) {
      setError('Failed to fetch questions');
    }
    setLoading(false);
  };

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get('/question-bank/analytics');
      setAnalytics(data);
    } catch { /* ignore */ }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/question-bank/${id}`);
      fetchQuestions();
      fetchAnalytics();
    } catch {
      alert('Failed to delete question');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        ...formState,
        options: formState.type === 'MCQ' ? formState.options.filter(Boolean) : undefined,
        tags: typeof formState.tags === 'string' ? formState.tags.split(',').map(t => t.trim()) : formState.tags,
      };

      if (editingQuestion) {
        await api.put(`/question-bank/${editingQuestion._id}`, payload);
      } else {
        await api.post('/question-bank', payload);
      }

      setShowAddModal(false);
      setEditingQuestion(null);
      fetchQuestions();
      fetchAnalytics();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
    setActionLoading(false);
  };

  const handleBatchImport = async () => {
    try {
      const parsed = JSON.parse(importJson);
      const questionsArray = Array.isArray(parsed) ? parsed : parsed.questions;
      if (!questionsArray) throw new Error('JSON must contain an array of questions');
      setActionLoading(true);
      await api.post('/question-bank/import', { questions: questionsArray });
      setShowImportModal(false);
      setImportJson('');
      fetchQuestions();
      fetchAnalytics();
    } catch (err) {
      alert(err.message || 'Invalid JSON format');
    }
    setActionLoading(false);
  };

  const openEditModal = (q) => {
    setEditingQuestion(q);
    setFormState({
      category: q.category || 'Technical',
      subCategory: q.subCategory || 'General',
      difficulty: q.difficulty || 'Medium',
      type: q.type || 'MCQ',
      question: q.question || '',
      description: q.description || '',
      options: q.options?.length ? [...q.options] : ['', '', '', ''],
      correctAnswer: q.correctAnswer || '',
      explanation: q.explanation || '',
      expectedTime: q.expectedTime || 15,
      marks: q.marks || 10,
      technology: q.technology || 'General',
      tags: q.tags ? q.tags.join(', ') : '',
    });
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 relative bg-hv-bg text-hv-text">
      <div className="mesh-blob-1 animate-blob-1" style={{ top: '-10%', left: '-10%' }} />
      <div className="mesh-blob-2 animate-blob-2" style={{ bottom: '-10%', right: '-10%' }} />

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">

        {/* Back + Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/60 pb-6">
          <div>
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-1.5 text-hv-muted hover:text-hv-text transition-colors text-xs font-semibold mb-2"
            >
              <ArrowLeft size={14} /> Back to Admin Studio
            </button>
            <h1 className="text-3xl font-black text-hv-text flex items-center gap-3">
              <HelpCircle className="text-hv-violet" /> Question Bank System
            </h1>
            <p className="text-sm text-hv-muted mt-1 font-medium">
              Manage centralized interview questions across 16 categories, 4 difficulty tiers, and multi-round workspaces.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => { setShowImportModal(true); setImportJson(''); }}
              className="btn-ghost py-2.5 text-xs flex items-center gap-1.5 border border-gray-200"
            >
              <Upload size={14} /> Batch Import JSON
            </button>
            <button
              onClick={() => {
                setEditingQuestion(null);
                setFormState({
                  category: 'Technical',
                  subCategory: 'React',
                  difficulty: 'Medium',
                  type: 'MCQ',
                  question: '',
                  description: '',
                  options: ['', '', '', ''],
                  correctAnswer: '',
                  explanation: '',
                  expectedTime: 15,
                  marks: 10,
                  technology: 'JavaScript',
                  tags: 'react, frontend',
                });
                setShowAddModal(true);
              }}
              className="btn-primary py-2.5 text-xs flex items-center gap-1.5"
            >
              <Plus size={14} /> Add New Question
            </button>
          </div>
        </div>

        {/* Analytics Header Cards */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card-static p-4 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl">
              <p className="text-xs font-bold text-hv-muted uppercase tracking-wider">Total Questions</p>
              <p className="text-2xl font-black text-hv-text mt-1">{analytics.totalQuestions}</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">Across 16 categories</p>
            </div>
            <div className="card-static p-4 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl">
              <p className="text-xs font-bold text-hv-muted uppercase tracking-wider">Difficulties Breakdown</p>
              <div className="flex items-center gap-2 mt-1.5 text-xs font-bold">
                {analytics.byDifficulty?.map(d => (
                  <span key={d.difficulty} className={`chip text-[10px] px-2 py-0.5 ${
                    d.difficulty === 'Easy' ? 'chip-success' :
                    d.difficulty === 'Medium' ? 'chip-violet' :
                    d.difficulty === 'Hard' ? 'chip-warning' : 'chip-danger'
                  }`}>
                    {d.difficulty}: {d.count}
                  </span>
                ))}
              </div>
            </div>
            <div className="card-static p-4 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl">
              <p className="text-xs font-bold text-hv-muted uppercase tracking-wider">Top Technology</p>
              <p className="text-lg font-black text-hv-violet mt-1 truncate">
                {analytics.topTechnologies?.[0]?.technology || 'JavaScript'} ({analytics.topTechnologies?.[0]?.count || 0})
              </p>
              <p className="text-[10px] text-hv-muted mt-1">Most used in assessments</p>
            </div>
            <div className="card-static p-4 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl">
              <p className="text-xs font-bold text-hv-muted uppercase tracking-wider">Filtered View</p>
              <p className="text-2xl font-black text-hv-text mt-1">{totalCount}</p>
              <p className="text-[10px] text-hv-muted mt-1">Questions matching active filters</p>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="card-static p-4 flex flex-wrap gap-4 items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hv-subtle w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search question title, tags, technology, ID..."
              className="input-field pl-10 text-xs py-2.5"
            />
          </div>

          <div className="flex gap-3 flex-wrap items-center">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="input-field text-xs py-2 w-44"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat} Category</option>
              ))}
            </select>

            {/* Difficulty Filter Pills */}
            <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff}
                  onClick={() => { setSelectedDifficulty(diff); setPage(1); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-white text-hv-violet shadow-sm'
                      : 'text-hv-muted hover:text-hv-text'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Question Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-48 rounded-2xl" />
            ))}
          </div>
        ) : questions.length === 0 ? (
          <div className="card p-16 text-center max-w-md mx-auto space-y-4">
            <HelpCircle className="w-14 h-14 text-hv-subtle mx-auto animate-float" />
            <div>
              <p className="text-lg font-bold text-hv-text">No questions found</p>
              <p className="text-xs text-hv-muted mt-1">Try adjusting search query or category filters.</p>
            </div>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedDifficulty('All'); }}
              className="btn-ghost py-2 text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((q) => (
              <motion.div
                key={q._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-5 flex flex-col justify-between hover:border-violet-200"
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="chip chip-violet text-[10px] font-bold">
                      {q.category}
                    </span>
                    <span className={`chip text-[10px] font-bold ${
                      q.difficulty === 'Easy' ? 'chip-success' :
                      q.difficulty === 'Medium' ? 'chip-violet' :
                      q.difficulty === 'Hard' ? 'chip-warning' : 'chip-danger'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-hv-text text-sm leading-snug line-clamp-2 mb-2">
                    {q.question}
                  </h3>

                  {q.description && (
                    <p className="text-xs text-hv-muted line-clamp-2 mb-3 leading-relaxed">
                      {q.description}
                    </p>
                  )}

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap gap-1.5 text-[10px] mb-4 font-semibold">
                    {q.technology && (
                      <span className="bg-gray-100 text-hv-muted px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Code size={10} /> {q.technology}
                      </span>
                    )}
                    <span className="bg-gray-100 text-hv-muted px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock size={10} /> {q.expectedTime || 15}m
                    </span>
                    <span className="bg-gray-100 text-hv-muted px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Award size={10} /> {q.marks || 10} pts
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-hv-subtle font-mono">{q.questionId || 'QB-ID'}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewQuestion(q)}
                      className="p-1.5 text-hv-muted hover:text-hv-violet rounded-lg hover:bg-violet-50 transition-colors"
                      title="Preview Question"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => openEditModal(q)}
                      className="p-1.5 text-hv-muted hover:text-hv-violet rounded-lg hover:bg-violet-50 transition-colors"
                      title="Edit Question"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="p-1.5 text-hv-muted hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="btn-ghost py-1.5 px-3 text-xs disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-hv-muted px-2">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="btn-ghost py-1.5 px-3 text-xs disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

      </div>

      {/* ─── ADD / EDIT QUESTION MODAL ────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-lg font-black text-hv-text">
                  {editingQuestion ? 'Edit Question' : 'Add New Question to Bank'}
                </h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-hv-muted block mb-1">Category</label>
                    <select
                      value={formState.category}
                      onChange={e => setFormState({ ...formState, category: e.target.value })}
                      className="input-field text-xs py-2"
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-hv-muted block mb-1">Difficulty</label>
                    <select
                      value={formState.difficulty}
                      onChange={e => setFormState({ ...formState, difficulty: e.target.value })}
                      className="input-field text-xs py-2"
                    >
                      {['Easy', 'Medium', 'Hard', 'Expert'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-hv-muted block mb-1">Technology</label>
                    <input
                      type="text"
                      value={formState.technology}
                      onChange={e => setFormState({ ...formState, technology: e.target.value })}
                      placeholder="e.g. React, Node.js, Python, PostgreSQL"
                      className="input-field text-xs py-2"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-hv-muted block mb-1">Question Type</label>
                    <select
                      value={formState.type}
                      onChange={e => setFormState({ ...formState, type: e.target.value })}
                      className="input-field text-xs py-2"
                    >
                      <option value="MCQ">MCQ</option>
                      <option value="Coding">Coding Problem</option>
                      <option value="Debugging">Debugging Problem</option>
                      <option value="SystemDesign">System Design</option>
                      <option value="ProductThinking">Product Thinking</option>
                      <option value="FounderChallenge">Founder Challenge</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-hv-muted block mb-1">Question Title / Prompt *</label>
                  <input
                    type="text"
                    required
                    value={formState.question}
                    onChange={e => setFormState({ ...formState, question: e.target.value })}
                    placeholder="Enter question statement..."
                    className="input-field text-xs py-2 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-hv-muted block mb-1">Detailed Description / Instructions</label>
                  <textarea
                    rows={3}
                    value={formState.description}
                    onChange={e => setFormState({ ...formState, description: e.target.value })}
                    placeholder="Detailed problem statement, constraints, or guidelines..."
                    className="input-field text-xs pt-2"
                  />
                </div>

                {formState.type === 'MCQ' && (
                  <div className="space-y-2 border-t border-gray-100 pt-3">
                    <label className="font-bold text-hv-text block">MCQ Options & Correct Answer</label>
                    {formState.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="font-bold text-hv-violet w-6">#{idx + 1}</span>
                        <input
                          type="text"
                          value={opt}
                          onChange={e => {
                            const copy = [...formState.options];
                            copy[idx] = e.target.value;
                            setFormState({ ...formState, options: copy });
                          }}
                          placeholder={`Option ${idx + 1}`}
                          className="input-field text-xs py-1.5 flex-1"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="font-bold text-hv-muted block mt-2 mb-1">Correct Answer (Exact Option Text)</label>
                      <input
                        type="text"
                        value={formState.correctAnswer}
                        onChange={e => setFormState({ ...formState, correctAnswer: e.target.value })}
                        placeholder="Copy exact text of correct option"
                        className="input-field text-xs py-1.5 border-emerald-200"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="font-bold text-hv-muted block mb-1">Explanation (Visible in Admin / Review)</label>
                  <textarea
                    rows={2}
                    value={formState.explanation}
                    onChange={e => setFormState({ ...formState, explanation: e.target.value })}
                    placeholder="Step-by-step solution or answer rationale..."
                    className="input-field text-xs pt-2"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-ghost flex-1 py-2.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="btn-primary flex-1 py-2.5"
                  >
                    {actionLoading ? 'Saving...' : editingQuestion ? 'Update Question' : 'Add Question'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── PREVIEW QUESTION MODAL ───────────────────────────────────────────── */}
      <AnimatePresence>
        {previewQuestion && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="chip chip-violet font-bold text-xs">
                  {previewQuestion.category} · {previewQuestion.difficulty}
                </span>
                <button onClick={() => setPreviewQuestion(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-black text-hv-text leading-tight">{previewQuestion.question}</h3>
                {previewQuestion.description && (
                  <p className="text-xs text-hv-muted leading-relaxed whitespace-pre-wrap">{previewQuestion.description}</p>
                )}

                {previewQuestion.options?.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-bold text-hv-subtle uppercase tracking-wider">Options</p>
                    {previewQuestion.options.map((opt, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border text-xs font-medium ${
                          opt === previewQuestion.correctAnswer
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                            : 'bg-gray-50 border-gray-100 text-hv-text'
                        }`}
                      >
                        {opt} {opt === previewQuestion.correctAnswer && '✓ (Correct)'}
                      </div>
                    ))}
                  </div>
                )}

                {previewQuestion.explanation && (
                  <div className="bg-violet-50/70 border border-violet-100 rounded-xl p-3 text-xs text-hv-text">
                    <p className="font-bold text-hv-violet mb-1">Explanation Rationale</p>
                    <p className="leading-relaxed">{previewQuestion.explanation}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setPreviewQuestion(null)}
                className="btn-primary w-full py-2.5 text-xs mt-2"
              >
                Close Preview
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── BATCH IMPORT MODAL ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-lg font-black text-hv-text flex items-center gap-2">
                  <Upload size={18} className="text-hv-violet" /> Batch Import Questions JSON
                </h2>
                <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-hv-muted">
                Paste an array of question JSON objects following the Question Bank schema to bulk import into HireVerse.
              </p>

              <textarea
                rows={10}
                value={importJson}
                onChange={e => setImportJson(e.target.value)}
                placeholder='[ { "category": "Technical", "difficulty": "Easy", "type": "MCQ", "question": "...", "options": [...], "correctAnswer": "..." } ]'
                className="input-field font-mono text-[11px] p-3 resize-none"
              />

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowImportModal(false)} className="btn-ghost flex-1 py-2.5 text-xs">
                  Cancel
                </button>
                <button
                  onClick={handleBatchImport}
                  disabled={actionLoading || !importJson.trim()}
                  className="btn-primary flex-1 py-2.5 text-xs"
                >
                  {actionLoading ? 'Importing...' : 'Import Questions'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminQuestionBank;
