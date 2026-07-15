import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  Zap, Users, Briefcase, BarChart3, ArrowRight,
  CheckCircle, Star, TrendingUp, Shield, Clock,
  Play, Laptop, StarHalf, Sparkles
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

// ─── Startup Feature Cards ───────────────────────────────────────
const features = [
  {
    icon: <Zap size={22} className="text-hv-coral" />,
    color: 'rgba(255,107,107,0.1)',
    title: 'Founders & Builders Match',
    desc: 'Smart matchmaking connects skilled developers directly with early-stage and high-growth startup founders.',
  },
  {
    icon: <Users size={22} className="text-hv-violet" />,
    color: 'rgba(139,92,246,0.1)',
    title: 'Startup Builder Feed',
    desc: 'Follow product launches, share engineering challenges, and build in public with the startup community.',
  },
  {
    icon: <BarChart3 size={22} className="text-hv-orange" />,
    color: 'rgba(255,184,107,0.1)',
    title: 'Real-time Opportunity Tracker',
    desc: 'Track your application status dynamically at every round, from submitted to hired.',
  },
  {
    icon: <Shield size={22} className="text-hv-lavender" />,
    color: 'rgba(179,136,255,0.1)',
    title: 'Automated MCQ & Coding Tests',
    desc: 'Verify engineering competence through proctored secure coding assessments inside the platform.',
  },
  {
    icon: <Clock size={22} className="text-hv-coral" />,
    color: 'rgba(255,107,107,0.1)',
    title: 'Direct Interview Schedulers',
    desc: 'Skip recruiter filters. Schedule face-to-face technical panel rounds directly with core builders.',
  },
  {
    icon: <TrendingUp size={22} className="text-hv-violet" />,
    color: 'rgba(139,92,246,0.1)',
    title: 'Equity & Growth Analytics',
    desc: 'Evaluate startup equity packages, analyze market hiring rates, and showcase your profile strength.',
  },
];

const stats = [
  { value: '50000', suffix: '+', label: 'Builders' },
  { value: '2500',  suffix: '+', label: 'Active Startups' },
  { value: '98',    suffix: '%', label: 'Placement Success' },
  { value: '150000', suffix: '+', label: 'Connections' },
];

const testimonials = [
  {
    name: 'Priya Nair',
    role: 'Lead Designer · NovaTech AI',
    quote: 'Found my founding designer role in a seed-stage AI startup in just 2 weeks. The direct connection to the founder was a game-changer.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=priya',
  },
  {
    name: 'Rohan Mehta',
    role: 'Backend Architect · PixelForge Labs',
    quote: 'Coding assessments were secure and straightforward. I skipped the traditional HR filters and spoke straight with the engineering lead.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=rohan',
  },
  {
    name: 'Anjali Roy',
    role: 'Founding Engineer · EcoSphere',
    quote: 'I love building in public. HireVerse enabled me to demonstrate my product building capabilities to tech-first founders.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=anjali',
  },
];

const startupsRow = ['Stripe', 'Vercel', 'Supabase', 'Linear', 'Retool', 'Figma', 'Scale AI', 'Hugging Face', 'Railway', 'Resend'];

// Responsive video showcase templates
const startupVideos = [
  {
    title: 'Engineering Culture at scale',
    category: 'Engineering Culture',
    url: 'https://www.youtube.com/embed/P6Ff585K8bM',
    thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=500&q=80'
  },
  {
    title: 'Founder Pitch: Scaling from 0 to 1',
    category: 'Founder Story',
    url: 'https://www.youtube.com/embed/KeF1E2Xm6zM',
    thumbnail: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=500&q=80'
  },
  {
    title: 'Office Tour & Life at a Startup',
    category: 'Life at Startup',
    url: 'https://www.youtube.com/embed/P28jQ11wO4o',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=80'
  }
];

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
  const [activeVideo, setActiveVideo] = useState(null);

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-hv-bg overflow-x-hidden">
      
      {/* ─── Video Overlay Modal ────────────────────────────────────── */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={() => setActiveVideo(null)}>
          <div className="bg-black rounded-3xl overflow-hidden aspect-video w-full max-w-4xl relative" onClick={e => e.stopPropagation()}>
            <iframe
              src={`${activeVideo}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* ─── Hero ──────────────────────────────────────────── */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden px-6 py-20">
        {/* Mesh gradient blobs */}
        <div className="mesh-blob-1 animate-blob-1" style={{ top: '-5%', left: '-5%' }} />
        <div className="mesh-blob-2 animate-blob-2" style={{ bottom: '-5%', right: '-5%' }} />
        <div className="mesh-blob-3 animate-blob-3" style={{ top: '40%', left: '60%' }} />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 chip chip-violet mb-8 text-sm px-4 py-2 font-bold"
          >
            <Sparkles size={13} className="animate-spin-slow" /> Where Startups Meet Builders
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-black tracking-tight leading-tight mb-6"
            style={{ fontSize: 'clamp(2.6rem, 7.5vw, 4.8rem)' }}
          >
            <span className="text-hv-text">Build the Next</span>
            <br />
            <span className="gradient-text">Unicorn.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl text-hv-muted max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
          >
            Discover ambitious startups. Show your skills. Build products that matter.
            Skip the recruiter spam and talk directly to startup founders.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/register" className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-violet-200">
              Explore Startups <ArrowRight size={16} />
            </Link>
            <Link to="/register" className="btn-secondary text-base px-8 py-3.5">
              Start Building
            </Link>
            <Link to="/register?type=company" className="text-sm font-bold text-hv-violet hover:underline ml-2">
              I'm Hiring for a Startup →
            </Link>
          </motion.div>

          {/* Verification check items */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-hv-muted font-semibold"
          >
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-hv-success" /> Early & High-growth startups</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-hv-success" /> Direct Founder Connection</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-hv-success" /> Join 50K+ Tech Builders</span>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats ─────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="text-4xl font-black gradient-text">
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs uppercase tracking-wider text-hv-muted mt-2 font-bold">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Startup Video Stories Showcase ───────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="chip chip-violet text-xs font-bold px-3 py-1 mb-3">Startup Stories</span>
            <h2 className="section-heading mb-4">
              Watch Startup <span className="gradient-text">Life & Tech</span>
            </h2>
            <p className="text-hv-muted text-lg max-w-xl mx-auto">
              Get an insider look at startup offices, founder journeys, and engineering cultures.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {startupVideos.map((video, idx) => (
              <motion.div
                key={video.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="card overflow-hidden group cursor-pointer border border-gray-100 hover:border-violet-200"
                onClick={() => setActiveVideo(video.url)}
              >
                <div className="relative aspect-video bg-gray-900 overflow-hidden">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      className="w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-hv-violet"
                    >
                      <Play size={20} className="fill-current ml-0.5" />
                    </motion.div>
                  </div>
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {video.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-hv-text group-hover:text-hv-violet transition-colors text-base leading-snug">
                    {video.title}
                  </h3>
                  <p className="text-xs text-hv-muted mt-2 font-medium">Click to watch story</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Startup Marquee ────────────────────────────── */}
      <section className="py-12 px-6 overflow-hidden bg-white/50 border-y border-gray-50">
        <p className="text-center text-xs uppercase tracking-widest font-extrabold text-hv-subtle mb-8">
          Builders working at fast-scaling startups
        </p>
        <div className="relative">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {[...startupsRow, ...startupsRow].map((name, i) => (
              <span key={i} className="text-2xl font-black text-hv-text/25 flex-shrink-0 flex items-center gap-1.5">
                <Laptop size={18} className="text-hv-violet/30" /> {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features grid ──────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="section-heading mb-4">
              Everything built for<br />
              <span className="gradient-text">Startup Builders</span>
            </h2>
            <p className="text-hv-muted text-lg max-w-xl mx-auto">
              Skip traditional corporate hoops. We coordinate high-trust, fast-velocity startup hiring.
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
                <h3 className="font-extrabold text-lg text-hv-text mb-2">{f.title}</h3>
                <p className="text-hv-muted text-sm leading-relaxed font-medium">{f.desc}</p>
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
            <p className="text-hv-muted text-lg font-medium">Join founding and product teams in 3 simple steps</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { step: '01', title: 'Create Builder Profile', desc: 'Build a comprehensive profile highlighting your projects, GitHub repositories, and coding skills.' },
              { step: '02', title: 'Meet Startup Founders', desc: 'Apply to active opportunities, chat directly, and take proctored assessments.' },
              { step: '03', title: 'Build the Future', desc: 'Secure equity packages and launch products that make an immediate impact.' },
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
                <h3 className="font-extrabold text-lg text-hv-text mb-2">{item.title}</h3>
                <p className="text-hv-muted text-sm leading-relaxed font-medium">{item.desc}</p>
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
              Loved by <span className="gradient-text">builders</span>
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
                    <Star key={i} size={14} className="text-hv-warning fill-current animate-pulse" style={{ fill: '#FBBF24' }} />
                  ))}
                </div>
                <p className="text-hv-text text-sm leading-relaxed mb-5 italic font-medium">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border-2 border-gray-100" />
                  <div>
                    <p className="font-extrabold text-sm text-hv-text">{t.name}</p>
                    <p className="text-xs text-hv-muted font-semibold">{t.role}</p>
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
          className="max-w-4xl mx-auto text-center rounded-3xl p-14 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8FA3 40%, #8B5CF6 100%)' }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
          <h2 className="text-white font-black text-3xl md:text-4xl mb-4 relative z-10">
            Build products that matter.
          </h2>
          <p className="text-white/85 text-lg mb-8 relative z-10 max-w-lg mx-auto">
            Join 50,000+ engineers, designers, and marketers who connect directly with founding startup teams.
          </p>
          <Link
            to="/register"
            className="relative z-10 inline-flex items-center gap-2 bg-white font-bold text-hv-violet px-8 py-3.5 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Explore Startup Openings <ArrowRight size={16} />
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
          <p className="text-sm text-hv-muted font-medium">© 2026 HireVerse Inc. · Where Startups Meet Builders.</p>
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
