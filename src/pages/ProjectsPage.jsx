import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  ArrowRight,
  FolderGit2,
  CheckCircle2,
  Clock,
  Search,
  Terminal,
  Cpu,
  ShieldCheck,
  Zap,
  GraduationCap,
  X
} from 'lucide-react';
import { CtaBanner } from '../components/BrandComponents';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Cards visibility map for IntersectionObserver scroll reveal
  const [visibleCardIds, setVisibleCardIds] = useState(new Set());
  const cardRefs = useRef(new Map());

  // Scroll Progress calculation
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch projects on category change
  useEffect(() => {
    fetchProjects();
  }, [selectedCategory]);

  const fetchProjects = async () => {
    try {
      setIsTransitioning(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await api.get(`/projects?${params.toString()}`);
      if (res.data?.projects) {
        setProjects(res.data.projects);
      }
      if (res.data?.categories) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    const fetchWithoutSearch = async () => {
      try {
        setIsTransitioning(true);
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        const res = await api.get(`/projects?${params.toString()}`);
        if (res.data?.projects) setProjects(res.data.projects);
        if (res.data?.categories) setCategories(res.data.categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setTimeout(() => setIsTransitioning(false), 50);
      }
    };
    fetchWithoutSearch();
  };

  // IntersectionObserver for scroll-reveal animation
  useEffect(() => {
    if (loading || isTransitioning) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-project-id');
            if (id) {
              setVisibleCardIds((prev) => {
                if (prev.has(id)) return prev;
                const next = new Set(prev);
                next.add(id);
                return next;
              });
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [projects, loading, isTransitioning]);

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-[#344054] relative">
      
      {/* Scroll progress indicator at top edge */}
      <div
        className="fixed top-0 left-0 h-[2.5px] bg-[#2B6FE0] z-50 transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ========================================================================= */}
      {/* HERO SECTION — Matching Homepage's #FFFCF7 Header Palette                */}
      {/* ========================================================================= */}
      <section className="bg-[#FFFCF7] border-b border-[#F0EBE1] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            
            {/* Eyebrow Badge (Matching Homepage Soft Cream Badge) */}
            <div className="inline-flex items-center gap-2 bg-[#FFF2BF] border border-[#F4D36B]/60 text-[#102747] px-3.5 py-1 rounded-full text-xs font-bold tracking-wide shadow-2xs">
              <GraduationCap className="h-4 w-4 text-[#173563] shrink-0" />
              <span>Practical Portfolio · Real-World Engineering</span>
            </div>

            {/* Main Heading (Matching Homepage 3.35rem weight & highlight styling) */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#12294B] tracking-tight leading-[1.15]">
              Hands-On <span className="text-[#2B6FE0]">Cloud & DevOps</span> Projects
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#475467] leading-relaxed font-normal">
              Practice with structured project scenarios that connect foundational concepts to operational problem-solving and industry production environments.
            </p>

            {/* Quick Benefits Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E4E7EC] text-xs font-semibold text-[#12294B] shadow-2xs">
                <Terminal className="w-3.5 h-3.5 text-[#2B6FE0]" />
                <span>Production Architecture</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E4E7EC] text-xs font-semibold text-[#12294B] shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#12B76A]" />
                <span>Industry Standards</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTRO FEATURE PANEL — Styled like Homepage's "Why Learn" section          */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-8 shadow-[0_4px_20px_rgba(18,41,75,0.04)] mb-10">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-widest font-extrabold text-[#3F6FA8] block mb-1">
              Skill Development
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#173563] tracking-tight">
              How Practical Projects Support Skill Development
            </h2>
            <p className="mt-2 text-sm text-[#475467] leading-relaxed">
              At AutoOps School, projects are not just code demonstrations — they are structured engineering exercises designed to mirror real industry environments. By working through deployment challenges, configuration tasks, and troubleshooting incidents, learners gain the technical confidence required to succeed in technical interviews and day-to-day IT roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF2FC] text-[#2B6FE0] flex items-center justify-center shrink-0 border border-[#D5E4F7]">
                <Cpu className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#102747]">Production Environments</h3>
                <p className="text-xs text-gray-500 mt-1 leading-normal">
                  Real container registries, clusters, and infrastructure automation setups.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E7F6E7] text-[#1E7E34] flex items-center justify-center shrink-0 border border-[#C3E6CB]">
                <Zap className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#102747]">Incident Scenarios</h3>
                <p className="text-xs text-gray-500 mt-1 leading-normal">
                  Diagnose system degradation, rollbacks, and configuration drift.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF2BF] text-[#102747] flex items-center justify-center shrink-0 border border-[#F4D36B]">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#102747]">Portfolio Validation</h3>
                <p className="text-xs text-gray-500 mt-1 leading-normal">
                  Showcase measurable engineering artifacts in technical interviews.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FILTER & SEARCH BAR                                                      */}
        {/* ========================================================================= */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Categories Pill Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#173563] text-white shadow-xs'
                      : 'bg-white text-gray-600 hover:text-[#173563] hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-80 shrink-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or technologies..."
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl shadow-2xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#173563]/10 focus:border-[#173563] transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Counter Info */}
        {!loading && projects.length > 0 && (
          <div className="mb-6 flex items-center justify-between text-xs sm:text-sm text-gray-500 font-medium px-1">
            <span>
              Showing <span className="font-bold text-[#102747]">{projects.length}</span> {projects.length === 1 ? 'project' : 'projects'}
              {selectedCategory !== 'All' && <span> in <span className="text-[#2B6FE0] font-semibold">{selectedCategory}</span></span>}
              {searchQuery && <span> matching "<span className="text-[#102747] font-semibold">{searchQuery}</span>"</span>}
            </span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PROJECTS GRID (Matching CourseCard styling & structure)                   */}
        {/* ========================================================================= */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-gray-200 p-5 h-96 animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="h-5 w-24 bg-gray-100 rounded-md" />
                    <div className="h-5 w-16 bg-gray-100 rounded-md" />
                  </div>
                  <div className="h-6 w-3/4 bg-gray-100 rounded-md" />
                  <div className="h-12 w-full bg-gray-100 rounded-md" />
                  <div className="h-14 w-full bg-gray-100 rounded-md" />
                </div>
                <div className="h-10 w-full bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center max-w-lg mx-auto shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#102747] text-base">No Projects Found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
              {searchQuery || selectedCategory !== 'All'
                ? 'No projects match your current filters. Try changing keywords or resetting the category.'
                : 'Projects are being prepared and will appear here shortly.'}
            </p>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-5 py-2 rounded-xl text-xs font-semibold bg-[#173563] text-white hover:bg-[#102747] transition cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {projects.map((project, index) => {
              const projectId = project._id || project.slug || `project-${index}`;
              const projectIndex = (project.displayOrder || index + 1).toString().padStart(2, '0');
              const isVisible = visibleCardIds.has(projectId);
              const staggerDelay = (index % 3) * 100;

              return (
                <div
                  key={projectId}
                  data-project-id={projectId}
                  ref={(el) => {
                    if (el) cardRefs.current.set(projectId, el);
                    else cardRefs.current.delete(projectId);
                  }}
                  style={{ transitionDelay: `${staggerDelay}ms` }}
                  className={`group bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                    isVisible ? 'card-scroll-visible' : 'card-scroll-hidden'
                  }`}
                >
                  {/* Top Segment */}
                  <div>
                    {/* Optional Thumbnail if present */}
                    {project.image ? (
                      <div className="aspect-[16/9] w-full bg-gray-100 overflow-hidden border-b border-gray-100 relative">
                        <img
                          src={project.image}
                          alt={project.imageAlt || project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#102747] border border-gray-200 shadow-2xs">
                          #{projectIndex}
                        </div>
                      </div>
                    ) : null}

                    <div className="p-5 sm:p-6">
                      {/* Category Badge + Difficulty */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF2FC] text-[#2B6FE0] border border-[#D5E4F7]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2B6FE0]" />
                          <span>{project.category || 'DevOps'}</span>
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          {project.difficulty && (
                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFF2BF] text-[#102747] border border-[#F4D36B]/60">
                              {project.difficulty}
                            </span>
                          )}
                          {!project.image && (
                            <span className="text-[11px] font-mono font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                              #{projectIndex}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Project Title */}
                      <h3 className="font-bold text-[#102747] group-hover:text-[#173563] transition text-base sm:text-lg leading-snug line-clamp-2 min-h-[2.8rem]">
                        <Link to={`/projects/${project.slug}`}>
                          {project.title}
                        </Link>
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                        {project.shortDescription}
                      </p>

                      {/* Technologies Used: Clean tags matching homepage warm gold / cream pills */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mt-4 pt-3.5 border-t border-gray-100">
                          <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#3F6FA8] block mb-2">
                            TECHNOLOGIES USED
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {project.technologies.map((tech, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] font-medium text-[#12294B] bg-[#FEF4D1] hover:bg-[#FDECAE] border border-[#F9E295] px-2.5 py-0.5 rounded-full transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Learning Outcomes: Crisp checklist */}
                      {project.learningOutcomes && project.learningOutcomes.length > 0 && (
                        <div className="mt-4 pt-3.5 border-t border-gray-100">
                          <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#3F6FA8] block mb-2">
                            LEARNING OUTCOMES
                          </span>
                          <ul className="space-y-1.5 text-xs text-gray-600">
                            {project.learningOutcomes.slice(0, 3).map((outcome, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#12B76A] mt-0.5 shrink-0 stroke-[2.2]" />
                                <span className="line-clamp-2 leading-relaxed">{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: View Project Details */}
                  <div className="p-5 sm:p-6 pt-0">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 bg-[#173563] hover:bg-[#102747] text-white shadow-xs hover:shadow-md transition-all duration-200 group/btn cursor-pointer"
                    >
                      <span>View Project Details</span>
                      <ArrowRight className="h-4 w-4 text-[#F4D36B] transition-transform duration-200 group-hover/btn:translate-x-1 stroke-[2.2]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* GLOBAL REUSABLE CTA BANNER                                               */}
      {/* ========================================================================= */}
      <CtaBanner
        title="Ready to Build Real-World Engineering Projects?"
        description="Join AutoOps School to gain practical experience, master DevOps workflows, and prepare for high-impact technical roles."
        buttonText="Explore All Courses"
        buttonLink="/courses"
      />

    </div>
  );
};

export default ProjectsPage;
export { ProjectsPage };
