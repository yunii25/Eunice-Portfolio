import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Mail, 
  MapPin, 
  ExternalLink, 
  ChevronRight, 
  Code2, 
  Database, 
  Layout, 
  Cpu, 
  GraduationCap, 
  Briefcase,
  Palette, 
  Server, 
  RefreshCw, 
  Terminal, 
  Cloud, 
  Flame, 
  Zap, 
  Wind, 
  Atom, 
  GitBranch, 
  ShieldCheck,
  Globe,
  Menu,
  X,
  ArrowUpRight,
  Settings,
  Save,
  Plus,
  Trash2,
  Lock
} from 'lucide-react';

// --- Types ---

interface HeroContent {
  name: string;
  role: string;
  description: string;
}

interface AboutContent {
  text1: string;
  text2: string;
  text3: string;
}

interface Solution {
  id: string;
  title: string;
  description: string;
}

interface Experience {
  id: string;
  period: string;
  title: string;
  company: string;
  points: string[];
}

interface PortfolioData {
  hero: HeroContent;
  about: AboutContent;
  solutions: Solution[];
  experience: Experience[];
  skills: string[];
}

// --- Components ---

const ProjectCard = ({ 
  title, 
  description, 
  icon: Icon 
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType;
  key?: React.Key;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -10 }}
    className="p-8 rounded-[32px] glass group transition-all"
  >
    <div className="w-14 h-14 rounded-2xl bg-brand-pink/10 flex items-center justify-center mb-6 group-hover:bg-brand-pink group-hover:text-brand-black transition-all">
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-2xl font-display font-bold mb-4">{title}</h3>
    <p className="text-white/60 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const SectionTitle = ({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) => (
  <div className="mb-12">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-display font-bold mb-4"
    >
      {children}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-brand-pink/60 max-w-2xl"
      >
        {subtitle}
      </motion.p>
    )}
    <motion.div 
      initial={{ width: 0 }}
      whileInView={{ width: 100 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="h-1 bg-brand-pink mt-6"
    />
  </div>
);

const ExperienceCard = ({ 
  title, 
  company, 
  period, 
  points 
}: { 
  title: string; 
  company: string; 
  period: string; 
  points: string[];
  key?: React.Key;
}) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="relative pl-8 pb-12 border-l border-white/10 last:pb-0"
  >
    <div className="absolute left-[-5px] top-0 w-[10px] h-[10px] rounded-full bg-brand-pink shadow-[0_0_10px_rgba(255,209,220,0.8)]" />
    <span className="text-xs font-mono text-brand-pink/60 mb-2 block">{period}</span>
    <h3 className="text-2xl font-display font-bold mb-1">{title}</h3>
    <p className="text-brand-pink font-medium mb-4">{company}</p>
    <ul className="space-y-3">
      {points.map((point, idx) => (
        <li key={idx} className="flex gap-3 text-white/60 text-sm leading-relaxed">
          <ChevronRight className="w-4 h-4 text-brand-pink shrink-0 mt-1" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

const SkillBadge = ({ name, icon: Icon }: { name: string; icon: React.ElementType; key?: React.Key }) => (
  <motion.div 
    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 209, 220, 0.1)' }}
    className="flex items-center gap-3 px-4 py-3 rounded-xl glass transition-colors"
  >
    <Icon className="w-5 h-5 text-brand-pink" />
    <span className="font-medium text-sm">{name}</span>
  </motion.div>
);

const getIconForSkill = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('php') || lower.includes('codeigniter')) return Flame;
  if (lower.includes('js') || lower.includes('javascript') || lower.includes('jquery')) return Zap;
  if (lower.includes('react')) return Atom;
  if (lower.includes('laravel')) return Wind;
  if (lower.includes('sql') || lower.includes('database')) return Database;
  if (lower.includes('cloud') || lower.includes('digital ocean') || lower.includes('365')) return Cloud;
  if (lower.includes('git')) return GitBranch;
  if (lower.includes('server') || lower.includes('apache') || lower.includes('node')) return Server;
  if (lower.includes('style') || lower.includes('css') || lower.includes('palette')) return Palette;
  if (lower.includes('terminal') || lower.includes('vs code')) return Terminal;
  if (lower.includes('shield') || lower.includes('admin')) return ShieldCheck;
  return Code2;
};

// --- Admin Panel ---

const AdminPanel = ({ 
  data, 
  onSave, 
  onClose 
}: { 
  data: PortfolioData; 
  onSave: (data: PortfolioData, password: string) => void; 
  onClose: () => void 
}) => {
  const [formData, setFormData] = useState<PortfolioData>(data);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        alert('Invalid password');
        onClose();
      }
    } catch (err) {
      alert('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, hero: { ...formData.hero, [e.target.name]: e.target.value } });
  };

  const handleAboutChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, about: { ...formData.about, [e.target.name]: e.target.value } });
  };

  const updateSolution = (index: number, field: string, value: string) => {
    const newSolutions = [...formData.solutions];
    newSolutions[index] = { ...newSolutions[index], [field]: value };
    setFormData({ ...formData, solutions: newSolutions });
  };

  const addSolution = () => {
    setFormData({ 
      ...formData, 
      solutions: [...formData.solutions, { id: Date.now().toString(), title: "New Solution", description: "" }] 
    });
  };

  const removeSolution = (index: number) => {
    setFormData({ ...formData, solutions: formData.solutions.filter((_, i) => i !== index) });
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const newExp = [...formData.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    setFormData({ ...formData, experience: newExp });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { id: Date.now().toString(), period: "2024", title: "New Role", company: "Company", points: ["Point 1"] }]
    });
  };

  const removeExperience = (index: number) => {
    setFormData({ ...formData, experience: formData.experience.filter((_, i) => i !== index) });
  };

  if (!isAuthenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[100] bg-brand-black/95 backdrop-blur-xl flex items-center justify-center p-6"
      >
        <div className="max-w-md w-full glass p-8 rounded-[32px] text-center">
          <Lock className="w-12 h-12 text-brand-pink mx-auto mb-6" />
          <h2 className="text-2xl font-display font-bold mb-6">Admin Access</h2>
          <input 
            type="password" 
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            className="w-full p-4 rounded-xl bg-white/5 border-none focus:ring-2 focus:ring-brand-pink mb-6 text-center"
            autoFocus
          />
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl glass hover:bg-white/10 transition-all font-bold"
            >
              Cancel
            </button>
            <button 
              onClick={handleVerify}
              disabled={isVerifying}
              className="flex-1 px-6 py-3 rounded-xl bg-brand-pink text-brand-black font-bold hover:bg-white transition-all disabled:opacity-50"
            >
              {isVerifying ? 'Verifying...' : 'Access'}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-brand-black/95 backdrop-blur-xl overflow-y-auto p-6 md:p-12"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-display font-bold">Admin Panel</h2>
          <div className="flex gap-4">
            <button 
              onClick={() => onSave(formData, password)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-pink text-brand-black font-bold hover:bg-white transition-all"
            >
              <Save className="w-5 h-5" /> Save Changes
            </button>
            <button 
              onClick={onClose}
              className="p-3 rounded-xl glass hover:bg-white/10 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="space-y-12 pb-24">
          {/* Hero Section Edit */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-brand-pink uppercase tracking-widest">Hero Section</h3>
            <div className="grid gap-4">
              <input 
                name="name" 
                value={formData.hero.name} 
                onChange={handleHeroChange}
                className="w-full p-4 rounded-xl glass border-none focus:ring-2 focus:ring-brand-pink"
                placeholder="Name"
              />
              <input 
                name="role" 
                value={formData.hero.role} 
                onChange={handleHeroChange}
                className="w-full p-4 rounded-xl glass border-none focus:ring-2 focus:ring-brand-pink"
                placeholder="Role"
              />
              <textarea 
                name="description" 
                value={formData.hero.description} 
                onChange={handleHeroChange}
                rows={3}
                className="w-full p-4 rounded-xl glass border-none focus:ring-2 focus:ring-brand-pink"
                placeholder="Description"
              />
            </div>
          </section>

          {/* About Section Edit */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-brand-pink uppercase tracking-widest">About Section</h3>
            <div className="grid gap-4">
              <textarea 
                name="text1" 
                value={formData.about.text1} 
                onChange={handleAboutChange}
                rows={3}
                className="w-full p-4 rounded-xl glass border-none focus:ring-2 focus:ring-brand-pink"
                placeholder="Paragraph 1"
              />
              <textarea 
                name="text2" 
                value={formData.about.text2} 
                onChange={handleAboutChange}
                rows={3}
                className="w-full p-4 rounded-xl glass border-none focus:ring-2 focus:ring-brand-pink"
                placeholder="Paragraph 2"
              />
              <textarea 
                name="text3" 
                value={formData.about.text3} 
                onChange={handleAboutChange}
                rows={3}
                className="w-full p-4 rounded-xl glass border-none focus:ring-2 focus:ring-brand-pink"
                placeholder="Paragraph 3"
              />
            </div>
          </section>

          {/* Solutions Section Edit */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-brand-pink uppercase tracking-widest">Solutions</h3>
              <button onClick={addSolution} className="flex items-center gap-2 text-sm font-bold text-brand-pink hover:text-white">
                <Plus className="w-4 h-4" /> Add Solution
              </button>
            </div>
            <div className="grid gap-6">
              {formData.solutions.map((sol, idx) => (
                <div key={sol.id} className="p-6 rounded-2xl glass relative group">
                  <button 
                    onClick={() => removeSolution(idx)}
                    className="absolute top-4 right-4 text-white/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="grid gap-4">
                    <input 
                      value={sol.title} 
                      onChange={(e) => updateSolution(idx, 'title', e.target.value)}
                      className="w-full p-3 rounded-lg bg-white/5 border-none focus:ring-1 focus:ring-brand-pink"
                      placeholder="Title"
                    />
                    <textarea 
                      value={sol.description} 
                      onChange={(e) => updateSolution(idx, 'description', e.target.value)}
                      rows={2}
                      className="w-full p-3 rounded-lg bg-white/5 border-none focus:ring-1 focus:ring-brand-pink"
                      placeholder="Description"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Experience Section Edit */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-brand-pink uppercase tracking-widest">Experience</h3>
              <button onClick={addExperience} className="flex items-center gap-2 text-sm font-bold text-brand-pink hover:text-white">
                <Plus className="w-4 h-4" /> Add Experience
              </button>
            </div>
            <div className="grid gap-6">
              {formData.experience.map((exp, idx) => (
                <div key={exp.id} className="p-6 rounded-2xl glass relative group">
                  <button 
                    onClick={() => removeExperience(idx)}
                    className="absolute top-4 right-4 text-white/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        value={exp.period} 
                        onChange={(e) => updateExperience(idx, 'period', e.target.value)}
                        className="w-full p-3 rounded-lg bg-white/5 border-none focus:ring-1 focus:ring-brand-pink"
                        placeholder="Period"
                      />
                      <input 
                        value={exp.company} 
                        onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                        className="w-full p-3 rounded-lg bg-white/5 border-none focus:ring-1 focus:ring-brand-pink"
                        placeholder="Company"
                      />
                    </div>
                    <input 
                      value={exp.title} 
                      onChange={(e) => updateExperience(idx, 'title', e.target.value)}
                      className="w-full p-3 rounded-lg bg-white/5 border-none focus:ring-1 focus:ring-brand-pink"
                      placeholder="Title"
                    />
                    <textarea 
                      value={exp.points.join('\n')} 
                      onChange={(e) => updateExperience(idx, 'points', e.target.value.split('\n'))}
                      rows={4}
                      className="w-full p-3 rounded-lg bg-white/5 border-none focus:ring-1 focus:ring-brand-pink"
                      placeholder="Points (one per line)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Edit */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-brand-pink uppercase tracking-widest">Skills</h3>
            <textarea 
              value={formData.skills.join(', ')} 
              onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()) })}
              rows={4}
              className="w-full p-4 rounded-xl glass border-none focus:ring-2 focus:ring-brand-pink"
              placeholder="Skills (comma separated)"
            />
          </section>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(setData);

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSave = async (newData: PortfolioData, password: string) => {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: newData, password })
    });
    if (res.ok) {
      setData(newData);
      setIsAdmin(false);
    } else {
      alert('Invalid password');
    }
  };

  if (!data) return <div className="min-h-screen bg-brand-black flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin" />
  </div>;

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-brand-pink selection:text-brand-black">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4 glass' : 'py-8 bg-transparent'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <motion.a 
            href="#" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-display font-bold tracking-tighter"
          >
            ER<span className="text-brand-pink">.</span>
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium text-white/70 hover:text-brand-pink transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#contact" 
              className="px-5 py-2 rounded-full bg-brand-pink text-brand-black font-bold text-sm hover:bg-white transition-all transform hover:-translate-y-1"
            >
              Hire Me
            </a>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-40 bg-brand-black flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-display font-bold hover:text-brand-pink transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button 
              onClick={() => { setIsAdmin(true); setMobileMenuOpen(false); }}
              className="text-3xl font-display font-bold hover:text-brand-pink transition-colors opacity-0 pointer-events-none"
            >
              Admin
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Overlay */}
      <AnimatePresence>
        {isAdmin && (
          <AdminPanel 
            data={data} 
            onSave={handleSave} 
            onClose={() => setIsAdmin(false)} 
          />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-pink/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-pink/5 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full glass text-brand-pink text-xs font-bold tracking-widest uppercase mb-6">
                Available for new opportunities
              </span>
              <h1 className="text-6xl md:text-8xl font-display font-bold leading-[0.9] mb-8">
                {data.hero.name.split(' ')[0]} <span className="text-brand-pink">{data.hero.name.split(' ')[1]}</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/60 font-light max-w-2xl mb-10 leading-relaxed">
                {data.hero.role} <span className="text-white font-medium">{data.hero.description}</span>
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <a 
                href="#contact" 
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-pink text-brand-black font-bold hover:bg-white transition-all"
              >
                Let's Talk
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              <a 
                href="#experience" 
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl glass font-bold hover:bg-white/10 transition-all"
              >
                View Work
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-20 flex items-center gap-8 text-white/40"
            >
              <div className="flex flex-col">
                <span className="text-2xl font-display font-bold text-white">2+</span>
                <span className="text-xs uppercase tracking-wider">Years Experience</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-2xl font-display font-bold text-white">ERP</span>
                <span className="text-xs uppercase tracking-wider">Specialization</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-brand-black/50">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="Bridging the gap between complex business requirements and scalable software solutions.">
            About Me
          </SectionTitle>
          
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6 text-lg text-white/70 leading-relaxed"
            >
              <p>{data.about.text1}</p>
              <p>{data.about.text2}</p>
              <p>{data.about.text3}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="p-6 rounded-3xl glass space-y-4">
                <Cpu className="w-8 h-8 text-brand-pink" />
                <h4 className="font-display font-bold text-xl">Backend Logic</h4>
                <p className="text-sm text-white/50">Designing scalable architectures and complex business logic for ERP systems.</p>
              </div>
              <div className="p-6 rounded-3xl glass space-y-4 mt-8">
                <Database className="w-8 h-8 text-brand-pink" />
                <h4 className="font-display font-bold text-xl">Database Design</h4>
                <p className="text-sm text-white/50">Optimizing MySQL and PostgreSQL schemas for high-performance data handling.</p>
              </div>
              <div className="p-6 rounded-3xl glass space-y-4">
                <Layout className="w-8 h-8 text-brand-pink" />
                <h4 className="font-display font-bold text-xl">Responsive UI</h4>
                <p className="text-sm text-white/50">Crafting intuitive and accessible interfaces for internal business tools.</p>
              </div>
              <div className="p-6 rounded-3xl glass space-y-4 mt-8">
                <Code2 className="w-8 h-8 text-brand-pink" />
                <h4 className="font-display font-bold text-xl">API Integration</h4>
                <p className="text-sm text-white/50">Connecting systems with Google Maps, MS Graph, and AWS S3 buckets.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Business Management Solutions Section */}
      <section id="solutions" className="py-24">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="Scalable enterprise systems deployed across AU, US and PH markets.">
            Business Management Solutions
          </SectionTitle>

          <div className="grid md:grid-cols-3 gap-8">
            {data.solutions.map((sol) => (
              <ProjectCard 
                key={sol.id}
                title={sol.title}
                icon={sol.title.includes('Migration') ? Cloud : sol.title.includes('Lead') ? Layout : Briefcase}
                description={sol.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="My professional journey in building enterprise-grade software.">
            Work Experience
          </SectionTitle>

          <div className="max-w-3xl">
            {data.experience.map((exp) => (
              <ExperienceCard 
                key={exp.id}
                period={exp.period}
                title={exp.title}
                company={exp.company}
                points={exp.points}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 bg-brand-black/50">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="The tools and technologies I use to bring ideas to life.">
            Technical Arsenal
          </SectionTitle>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.skills.map((skill) => (
              <SkillBadge key={skill} name={skill} icon={getIconForSkill(skill)} />
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-24">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="Academic foundation and continuous learning.">
            Education
          </SectionTitle>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl glass relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <GraduationCap className="w-24 h-24" />
              </div>
              <span className="text-brand-pink font-mono text-xs mb-4 block">2020 - 2024</span>
              <h3 className="text-2xl font-display font-bold mb-2">BS in Information Technology</h3>
              <p className="text-brand-pink font-medium mb-4">Bulacan State University</p>
              <div className="space-y-4 text-white/60 text-sm">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-pink" />
                  Magna Cum Laude Honors
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-pink" />
                  Best in Research: SiPa (Siguradong Pagpaplano)
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl glass relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <GraduationCap className="w-24 h-24" />
              </div>
              <span className="text-brand-pink font-mono text-xs mb-4 block">2018 - 2020</span>
              <h3 className="text-2xl font-display font-bold mb-2">Senior High School</h3>
              <p className="text-brand-pink font-medium mb-4">New Era University</p>
              <div className="space-y-4 text-white/60 text-sm">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-pink" />
                  STEM Strand
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-pink" />
                  Academic Honors
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-pink/5 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <SectionTitle subtitle="Let's discuss how I can help your business grow.">
            Get In Touch
          </SectionTitle>

          <div className="max-w-4xl mx-auto glass p-12 rounded-[40px]">
            <h3 className="text-4xl md:text-5xl font-display font-bold mb-8">
              Ready to start a <span className="text-brand-pink">project?</span>
            </h3>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12">
              <a href="mailto:euniceroxas0@gmail.com" className="group flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center group-hover:bg-brand-pink group-hover:text-brand-black transition-all">
                  <Mail className="w-8 h-8" />
                </div>
                <span className="font-medium">euniceroxas0@gmail.com</span>
              </a>
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-brand-pink" />
                </div>
                <span className="font-medium">Quezon City, Metro Manila</span>
              </div>
            </div>

            <div className="flex justify-center gap-6">
              <a href="#" className="p-4 rounded-xl glass hover:bg-brand-pink hover:text-brand-black transition-all">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="p-4 rounded-xl glass hover:bg-brand-pink hover:text-brand-black transition-all">
                <ExternalLink className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 relative">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Eunice Roxas. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-white/40 hover:text-brand-pink transition-colors text-sm">LinkedIn</a>
            <a href="#" className="text-white/40 hover:text-brand-pink transition-colors text-sm">GitHub</a>
          </div>
        </div>
        {/* Discreet Admin Access */}
        <button 
          onClick={() => setIsAdmin(true)}
          className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-white/5 hover:bg-brand-pink/20 transition-all cursor-default"
          title="."
        />
      </footer>
    </div>
  );
}
