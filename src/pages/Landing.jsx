import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  Zap, Users, Briefcase, BarChart3, ArrowRight,
  CheckCircle, Star, TrendingUp, Shield, Clock
} from 'lucide-react';
import { HLogo } from '../components/AppLoader';

// ─── Animated Counter ────────────────────────────────────────────
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = parseInt(target.replace(/\D/g, ''));
    const duration = 1800;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Feature card ────────────────────────────────────────────────
const features = [
  {
    icon: <Zap size={22} className="text-hv-coral" />,
    color: 'rgba(255,107,107,0.1)',
    title: 'Smart Job Matching',
    desc: 'AI-powered recommendations surface the right opportunities based on your skills and preferences.',
  },
  {
    icon: <Users size={22} className="text-hv-violet" />,
    color: 'rgba(139,92,246,0.1)',
    title: 'Professional Network',
    desc: 'Follow peers, share updates, and build meaningful connections in your industry.',
  },
  {
    icon: <BarChart3 size={22} className="text-hv-orange" />,
    color: 'rgba(255,184,107,0.1)',
    title: 'Real-time Tracker',
    desc: 'Track every application through each hiring stage with live status updates.',
  },
  {
    icon: <Shield size={22} className="text-hv-lavender" />,
    color: 'rgba(179,136,255,0.1)',
    title: 'Proctored Assessments',
    desc: 'Take company assessments inside HireVerse with full security and trust metrics.',
  },
  {
    icon: <Clock size={22} className="text-hv-coral" />,
    color: 'rgba(255,107,107,0.1)',
    title: 'Interview Scheduling',
    desc: 'Companies schedule rounds directly — you get notified instantly with all details.',
  },
  {
    icon: <TrendingUp size={22} className="text-hv-violet" />,
    color: 'rgba(139,92,246,0.1)',
    title: 'Career Analytics',
    desc: 'Insights into your profile strength, application performance, and market trends.',
  },
];

const stats = [
  { value: '50000', suffix: '+', label: 'Professionals' },
  { value: '10000', suffix: '+', label: 'Companies' },
  { value: '98',    suffix: '%', label: 'Success Rate' },
  { value: '1000000', suffix: '+', label: 'Connections' },
];

const testimonials = [
  {
    name: 'Priya Nair',
    role: 'Product Designer · Zomato',
    quote: 'HireVerse completely changed how I job hunt. The assessment process was seamless, and I got my dream role in 3 weeks.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=priya',
  },
  {
    name: 'Arjun Sharma',
    role: 'Software Engineer · Razorpay',
    quote: "The professional feed felt alive. Companies actually posted meaningful updates, and I connected with the right hiring manager.",
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=arjun',
  },
  {
    name: 'Meera Iyer',
    role: 'HR Manager · Freshworks',
    quote: 'As a recruiter, the applicant pipeline and proctored assessments saved us weeks of manual screening. Highly recommended.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=meera',
  },
];

const companiesRow = ['Google', 'Microsoft', 'Amazon', 'Adobe', 'Airtel', 'TCS', 'Infosys', 'Wipro', 'Razorpay', 'Zomato'];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const Landing = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-hv-bg overflow-x-hidden">

      {/* ─── Hero ──────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 py-20">
        {/* Mesh gradient blobs */}
        <div className="mesh-blob-1 animate-blob-1" style={{ top: '-5%', left: '-5%' }} />
        <div className="mesh-blob-2 animate-blob-2" style={{ bottom: '-5%', right: '-5%' }} />
        <div className="mesh-blob-3 animate-blob-3" style={{ top: '40%', left: '60%' }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 chip chip-violet mb-8 text-sm px-4 py-2"
          >
            <Zap size={13} /> Next Gen Career Platform · 2026
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-black tracking-tight leading-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)' }}
          >
            <span className="text-hv-text">One Platform.</span>
            <br />
            <span className="gradient-text">Every Career Journey.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg text-hv-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            HireVerse brings professionals, companies, and opportunities onto a single modern platform.
            Build your network, prove your skills, and land your dream role.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/register" className="btn-primary text-base px-8 py-3.5 animate-pulse-glow">
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-ghost text-base px-8 py-3.5">
              Sign In
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-6 mt-10 text-sm text-hv-muted"
          >
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-hv-success" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-hv-success" /> Free for professionals</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-hv-success" /> Join 50K+ professionals</span>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats ─────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="text-3xl font-black gradient-text">
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-sm text-hv-muted mt-1 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Trusted by marquee ────────────────────────────── */}
      <section className="py-12 px-6 overflow-hidden">
        <p className="text-center text-xs uppercase tracking-widest font-bold text-hv-subtle mb-8">
          Trusted by teams at
        </p>
        <div className="relative">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {[...companiesRow, ...companiesRow].map((name, i) => (
              <span key={i} className="text-xl font-black text-hv-text/20 flex-shrink-0">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="section-heading mb-4">
              Everything you need to<br />
              <span className="gradient-text">build your career</span>
            </h2>
            <p className="text-hv-muted text-lg max-w-xl mx-auto">
              A complete career platform built for the way modern professionals and companies work.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp} className="card p-6 group">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg text-hv-text mb-2">{f.title}</h3>
                <p className="text-hv-muted text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── How it works ──────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="section-heading mb-4">How it works</h2>
            <p className="text-hv-muted text-lg">From signup to your next job in 3 simple steps</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { step: '01', title: 'Create your profile', desc: 'Build a rich professional profile with your skills, experience, and resume.' },
              { step: '02', title: 'Discover & Apply', desc: 'Browse curated job listings from verified companies and apply in seconds.' },
              { step: '03', title: 'Get Hired', desc: 'Attend proctored assessments, ace interviews, and land your dream role.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className="text-5xl font-black gradient-text opacity-20 mb-3">{item.step}</div>
                <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(255,107,107,0.1), rgba(139,92,246,0.1))' }}>
                  <CheckCircle size={20} className="text-hv-violet" />
                </div>
                <h3 className="font-bold text-lg text-hv-text mb-2">{item.title}</h3>
                <p className="text-hv-muted text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ──────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="section-heading mb-4">
              Loved by <span className="gradient-text">professionals</span>
            </h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp} className="card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-hv-warning fill-current" style={{ fill: '#FBBF24' }} />
                  ))}
                </div>
                <p className="text-hv-text text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border-2 border-gray-100" />
                  <div>
                    <p className="font-bold text-sm text-hv-text">{t.name}</p>
                    <p className="text-xs text-hv-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Banner ────────────────────────────────────── */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center rounded-3xl p-14 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8FA3 40%, #8B5CF6 100%)' }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
          <h2 className="text-white font-black text-3xl md:text-4xl mb-4 relative z-10">
            Build. Prove. Belong.
          </h2>
          <p className="text-white/85 text-lg mb-8 relative z-10">
            Join 50,000+ professionals who found their next opportunity on HireVerse.
          </p>
          <Link
            to="/register"
            className="relative z-10 inline-flex items-center gap-2 bg-white font-bold text-hv-violet px-8 py-3.5 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Start for free <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* ─── Footer ────────────────────────────────────────── */}
      <footer className="py-10 px-6 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <HLogo size={32} />
            <span className="font-black text-base gradient-text">HireVerse</span>
          </div>
          <p className="text-sm text-hv-muted">© 2026 HireVerse Inc. · One Platform. Every Career Journey.</p>
          <div className="flex gap-6 text-sm font-semibold text-hv-muted">
            <Link to="/login" className="hover:text-hv-text transition-colors">Login</Link>
            <Link to="/register" className="hover:text-hv-text transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
