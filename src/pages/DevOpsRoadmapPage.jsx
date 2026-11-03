import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import TechIcon from '../components/TechIcon';
import { AnimatedSection } from '../components/AnimatedSection';
import RevealGroup from '../components/RevealGroup';
import { defaultRoadmapData } from '../utils/roadmapDefaults';
import logoImg from '../assests/logo.png';
import {
  Compass,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Layers,
  Cpu,
  FolderGit2,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Zap,
  Shield,
  Activity,
  Workflow,
  Server,
  Cloud,
  Terminal,
  Code2,
  Box,
  Rocket,
  Check,
  X,
  Info,
  Award
} from 'lucide-react';

const DevOpsRoadmapPage = () => {
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(defaultRoadmapData);
  const [loading, setLoading] = useState(true);

  // Stage expansion state: key = stageNumber, val = boolean
  const [expandedStages, setExpandedStages] = useState(() => {
    const init = {};
    defaultRoadmapData.stages.forEach((st, idx) => {
      // First 2 open by default on desktop, others collapsed
      init[st.stageNumber] = idx < 2;
    });
    return init;
  });

  // Cloud Tab state in Stage 07: 'aws' | 'azure' | 'both'
  const [cloudTab, setCloudTab] = useState('aws');

  // Active workflow step state for interactive inspection
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(1);

  // Selected project for modal detail
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await api.get('/roadmap/devops-roadmap');
        if (res.data?.roadmap) {
          setRoadmap(res.data.roadmap);
          // Preserve any newly added stages into state
          setExpandedStages(prev => {
            const next = { ...prev };
            res.data.roadmap.stages.forEach((st, idx) => {
              if (next[st.stageNumber] === undefined) {
                next[st.stageNumber] = idx < 2;
              }
            });
            return next;
          });
        }
      } catch (err) {
        console.warn('Roadmap API loaded from local canonical defaults:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, []);

  const toggleStage = (stageNum) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageNum]: !prev[stageNum]
    }));
  };

  const handleExpandAll = () => {
    const all = {};
    (roadmap.stages || []).forEach(st => {
      all[st.stageNumber] = true;
    });
    setExpandedStages(all);
  };

  const handleCollapseAll = () => {
    const all = {};
    (roadmap.stages || []).forEach(st => {
      all[st.stageNumber] = false;
    });
    setExpandedStages(all);
  };

  const scrollToRoadmap = (e) => {
    e.preventDefault();
    const elem = document.getElementById('roadmap-stages');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stagesList = (roadmap.stages || []).filter(st => st.isEnabled !== false);
  const workflowSteps = (roadmap.workflowSteps || []).sort((a, b) => a.order - b.order);
  const projectsList = (roadmap.projects || []).filter(p => p.isEnabled !== false);
  const activeStepData = workflowSteps.find(s => s.stepNumber === activeWorkflowStep) || workflowSteps[0];

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-[#102747] selection:bg-[#F4D36B]/40 selection:text-[#102747]">
      
      {/* 1. HERO INTRODUCTION SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-white via-[#FAFBFD] to-[#F1F5F9] border-b border-slate-200/80">
        
        {/* Subtle background tech accents */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-r from-blue-100/50 via-indigo-100/40 to-amber-100/30 blur-3xl rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-5">
            
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF2BF] text-[#102747] border border-[#F4D36B]/60 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#173563] stroke-[2.2]" />
              <span className="text-[11px] font-black uppercase tracking-widest text-[#173563]">
                {roadmap.eyebrow || 'AUTOOPS SCHOOL · DEVOPS LEARNING PATH'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#102747] tracking-tight leading-[1.12]">
              {roadmap.heading || 'Your Complete DevOps Learning Roadmap'}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
              {roadmap.description ||
                'Master the tools, technologies, and practices used to build, automate, deploy, and monitor modern applications. Follow a structured learning path with hands-on projects and real-world workflows.'}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
              <Link
                to={roadmap.primaryCta?.link && !roadmap.primaryCta.link.includes('devops-engineering-course') ? roadmap.primaryCta.link : '/projects'}
                className="px-6 py-3.5 rounded-xl bg-[#173563] hover:bg-[#102747] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group cursor-pointer"
              >
                <span>{roadmap.primaryCta?.text && !roadmap.primaryCta.text.includes('DevOps Course') ? roadmap.primaryCta.text : 'Explore Practical Projects'}</span>
                <ArrowRight className="w-4 h-4 text-[#F4D36B] transition group-hover:translate-x-0.5" />
              </Link>

              <button
                type="button"
                onClick={scrollToRoadmap}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#102747] text-sm font-bold border border-slate-200 shadow-2xs hover:shadow-xs transition duration-200 flex items-center gap-2 cursor-pointer"
              >
                <span>{roadmap.secondaryCta?.text || 'View Learning Roadmap'}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>

          </div>

          {/* Quick Metrics & Progression Highlights Bar */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            
            <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200/90 p-4 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#173563]">
                {roadmap.stats?.stagesCount || 8}
              </div>
              <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mt-1">
                Learning Stages
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200/90 p-4 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#173563]">
                {roadmap.stats?.technologiesCount || 22}+
              </div>
              <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mt-1">
                Core Technologies
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200/90 p-4 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#173563]">
                {roadmap.stats?.projectsCount || 5}
              </div>
              <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mt-1">
                Hands-On Projects
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200/90 p-4 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                100%
              </div>
              <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mt-1">
                Practical Workflows
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 2. EIGHT STRUCTURED LEARNING STAGES ROADMAP */}
      <section id="roadmap-stages" className="py-16 sm:py-20 lg:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-slate-200/80">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#173563]">
              <Compass className="w-4 h-4 text-[#F4D36B]" />
              Structured Curriculum Progression
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#102747] tracking-tight">
              Eight Progressive Learning Stages
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              From absolute Linux command-line fundamentals to production-scale multi-cloud container orchestration and site reliability.
            </p>
          </div>

          {/* Expand / Collapse All Controls */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-end">
            <button
              type="button"
              onClick={handleExpandAll}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition cursor-pointer"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Timeline Stages List */}
        <div className="mt-10 space-y-6 relative">
          
          {/* Vertical Connecting Guide Line for Desktop */}
          <div className="hidden lg:block absolute left-[31px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-[#173563] via-[#D4AF37] to-[#102747] z-0 opacity-25" />

          {stagesList.map((stage, idx) => {
            const isExpanded = !!expandedStages[stage.stageNumber];
            const isCloudStage = stage.stageNumber === 'Stage 07' || stage.title.toLowerCase().includes('cloud');

            return (
              <article
                key={stage.stageNumber || idx}
                className="relative z-10 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Stage Header Button */}
                <button
                  type="button"
                  onClick={() => toggleStage(stage.stageNumber)}
                  aria-expanded={isExpanded}
                  className="w-full text-left p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition group"
                >
                  <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0">
                    
                    {/* Stage Number Badge */}
                    <div className="w-12 h-12 rounded-xl bg-[#102747] group-hover:bg-[#173563] text-white flex flex-col items-center justify-center shrink-0 border border-[#173563]/40 shadow-2xs transition">
                      <span className="text-[9px] uppercase font-bold text-[#F4D36B] tracking-wider leading-none">
                        Stage
                      </span>
                      <span className="text-sm font-black leading-none mt-0.5">
                        {stage.stageNumber.replace(/\D/g, '') || idx + 1}
                      </span>
                    </div>

                    {/* Title & Short Description */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-[#102747] tracking-tight group-hover:text-[#173563] transition">
                          {stage.title}
                        </h3>
                        {isCloudStage && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                            Dual Cloud Tracks
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">
                        {stage.shortDescription}
                      </p>
                    </div>
                  </div>

                  {/* Expand Chevron Icon */}
                  <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 transition">
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 text-[#173563]' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Collapsible Content Area */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-6 sm:px-6 sm:pb-7 border-t border-slate-100 pt-4 space-y-5">
                      
                      {/* Short summary block */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {stage.shortDescription}
                      </p>

                      {/* Tool Tags */}
                      {stage.tools?.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
                            Key Technologies & Tools
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {stage.tools.map((tool, tIdx) => (
                              <TechIcon key={tIdx} name={tool} showLabel={true} size={15} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* SPECIAL HANDLER: Stage 07 Dual Cloud Paths */}
                      {isCloudStage && roadmap.cloudPaths && (
                        <div className="pt-2 space-y-4">
                          
                          {/* Cloud Track Switcher Tabs */}
                          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                            <button
                              type="button"
                              onClick={() => setCloudTab('aws')}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                cloudTab === 'aws'
                                  ? 'bg-white text-[#102747] shadow-xs'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              <TechIcon name="AWS" size={14} />
                              AWS Learning Path
                            </button>
                            <button
                              type="button"
                              onClick={() => setCloudTab('azure')}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                cloudTab === 'azure'
                                  ? 'bg-white text-[#102747] shadow-xs'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              <TechIcon name="Azure" size={14} />
                              Azure Learning Path
                            </button>
                          </div>

                          {/* Cloud Cards Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* AWS Track Card */}
                            {(cloudTab === 'aws' || cloudTab === 'both') && roadmap.cloudPaths.aws && (
                              <div className="p-5 rounded-xl border border-amber-200/90 bg-amber-50/40 space-y-4">
                                <div className="flex items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
                                  <div className="flex items-center gap-2">
                                    <TechIcon name="AWS" size={20} />
                                    <h4 className="font-extrabold text-sm sm:text-base text-amber-950">
                                      {roadmap.cloudPaths.aws.title}
                                    </h4>
                                  </div>
                                  <span className="text-[10px] font-bold text-amber-800 uppercase px-2 py-0.5 rounded-full bg-amber-100">
                                    Track A
                                  </span>
                                </div>
                                <p className="text-xs text-amber-900/80 leading-relaxed">
                                  {roadmap.cloudPaths.aws.description}
                                </p>
                                <div className="space-y-1.5">
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900/60 block">
                                    Curriculum Syllabus Topics
                                  </span>
                                  <ul className="space-y-1 text-xs text-slate-700">
                                    {(roadmap.cloudPaths.aws.topics || []).map((top, topIdx) => (
                                      <li key={topIdx} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                        <span>{top}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}

                            {/* Azure Track Card */}
                            {(cloudTab === 'azure' || cloudTab === 'both') && roadmap.cloudPaths.azure && (
                              <div className="p-5 rounded-xl border border-blue-200/90 bg-blue-50/40 space-y-4">
                                <div className="flex items-center justify-between gap-2 border-b border-blue-200/80 pb-3">
                                  <div className="flex items-center gap-2">
                                    <TechIcon name="Azure" size={20} />
                                    <h4 className="font-extrabold text-sm sm:text-base text-blue-950">
                                      {roadmap.cloudPaths.azure.title}
                                    </h4>
                                  </div>
                                  <span className="text-[10px] font-bold text-blue-800 uppercase px-2 py-0.5 rounded-full bg-blue-100">
                                    Track B
                                  </span>
                                </div>
                                <p className="text-xs text-blue-900/80 leading-relaxed">
                                  {roadmap.cloudPaths.azure.description}
                                </p>
                                <div className="space-y-1.5">
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-900/60 block">
                                    Curriculum Syllabus Topics
                                  </span>
                                  <ul className="space-y-1 text-xs text-slate-700">
                                    {(roadmap.cloudPaths.azure.topics || []).map((top, topIdx) => (
                                      <li key={topIdx} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                                        <span>{top}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}

                          </div>
                        </div>
                      )}

                      {/* General Stage Topics Checklist */}
                      {stage.topics?.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
                            Core Learning Modules & Competencies
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                            {stage.topics.map((topic, tpIdx) => (
                              <div key={tpIdx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50/70 border border-slate-100">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="font-medium text-slate-800">{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>

              </article>
            );
          })}

        </div>

      </section>

      {/* 3. SEPARATE END-TO-END DEVOPS CI/CD WORKFLOW SECTION */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
        
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[#F4D36B] text-[11px] font-bold uppercase tracking-widest">
              <Workflow className="w-3.5 h-3.5" /> Automated Pipeline
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              End-to-End DevOps Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Understand how code moves from development to production through an automated DevOps pipeline. Select any stage to inspect its operational role.
            </p>
          </div>

          {/* Interactive Desktop Horizontal Pipeline Flow */}
          <div className="bg-slate-800/80 rounded-3xl border border-slate-700 p-6 sm:p-8 space-y-8 backdrop-blur-xs">
            
            {/* Horizontal Nodes Scroll Container */}
            <div className="overflow-x-auto pb-4 scrollbar-thin">
              <div className="flex items-center gap-3 min-w-[1000px] justify-between relative px-2">
                
                {/* Horizontal progress connection bar */}
                <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-slate-700 z-0" />

                {workflowSteps.map((step) => {
                  const isActive = step.stepNumber === activeWorkflowStep;
                  return (
                    <button
                      key={step.stepNumber}
                      type="button"
                      onClick={() => setActiveWorkflowStep(step.stepNumber)}
                      className={`relative z-10 flex flex-col items-center group transition cursor-pointer ${
                        isActive ? 'scale-105' : 'hover:scale-102'
                      }`}
                    >
                      {/* Step Circle */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xs transition border ${
                          isActive
                            ? 'bg-[#F4D36B] text-[#102747] border-[#F4D36B] shadow-[0_0_15px_rgba(244,211,107,0.35)]'
                            : 'bg-slate-900 text-slate-400 border-slate-700 group-hover:border-slate-500'
                        }`}
                      >
                        {step.stepNumber}
                      </div>

                      {/* Step Title Label */}
                      <span
                        className={`text-[11px] font-bold mt-2 text-center max-w-[90px] leading-tight transition ${
                          isActive ? 'text-[#F4D36B]' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        {step.title}
                      </span>
                    </button>
                  );
                })}

              </div>
            </div>

            {/* Active Workflow Node Inspection Detail Card */}
            {activeStepData && (
              <div className="bg-slate-900/90 rounded-2xl border border-slate-700 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                <div className="md:col-span-8 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F4D36B] text-[#102747]">
                      Step {activeStepData.stepNumber} of {workflowSteps.length}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      Phase: {activeStepData.category}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {activeStepData.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activeStepData.description}
                  </p>
                </div>

                <div className="md:col-span-4 bg-slate-800/80 rounded-xl p-4 border border-slate-700 space-y-2.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    Applied Tools & Automation
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(activeStepData.tools || []).map((tl, idx) => (
                      <TechIcon key={idx} name={tl} size={15} showLabel={true} />
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </section>

      {/* 4. FIVE HANDS-ON DEVOPS PROJECT CARDS */}
      <section className="py-16 sm:py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Heading */}
        <AnimatedSection direction="up" delay={50} className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#173563]">
            <Award className="w-4 h-4 text-[#F4D36B]" /> Practical Portfolio Experience
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#102747] tracking-tight">
            Build Real-World DevOps Projects
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            Apply your learning through practical projects that simulate real-world DevOps workflows. Master enterprise pipelines from scratch.
          </p>
        </AnimatedSection>

        {/* Project Cards Grid */}
        <RevealGroup stagger={100} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsList.map((project, pIdx) => {
            const difficultyBadgeColor =
              project.difficulty === 'Beginner'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : project.difficulty === 'Advanced'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200';

            return (
              <div
                key={project.projectNumber || pIdx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#173563] bg-[#FFF2BF] px-2.5 py-1 rounded-md border border-[#F4D36B]/60">
                      {project.projectNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyBadgeColor}`}>
                      {project.difficulty}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-extrabold text-[#102747] leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] uppercase font-extrabold tracking-wider text-slate-400 block">
                      Stack Tools
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(project.technologies || []).map((tech, tIdx) => (
                        <TechIcon key={tIdx} name={tech} size={13} showLabel={true} />
                      ))}
                    </div>
                  </div>

                  {/* Key Learning Outcomes */}
                  {project.learningOutcomes?.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <span className="text-[9px] uppercase font-extrabold tracking-wider text-slate-400 block">
                        Key Competencies Mastered
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {project.learningOutcomes.slice(0, 3).map((outc, oIdx) => (
                          <li key={oIdx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{outc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Card Action Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    to={project.detailsUrl || `/projects/${project.slug || project._id}`}
                    className="flex-1 py-2.5 rounded-xl bg-slate-50 hover:bg-[#173563] text-[#102747] hover:text-white border border-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Project Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    title="Quick Preview"
                    className="px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 text-xs font-bold transition cursor-pointer"
                  >
                    Preview
                  </button>
                </div>

              </div>
            );
          })}
        </RevealGroup>

      </section>

      {/* 5. PROJECT DETAILS MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#173563] bg-[#FFF2BF] px-2.5 py-1 rounded-md border border-[#F4D36B]/60 inline-block mb-1.5">
                  {selectedProject.projectNumber} · {selectedProject.difficulty}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#102747]">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Project Overview & Workflow
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Technologies Integrated
              </h4>
              <div className="flex flex-wrap gap-2">
                {(selectedProject.technologies || []).map((t, idx) => (
                  <TechIcon key={idx} name={t} size={15} showLabel={true} />
                ))}
              </div>
            </div>

            {selectedProject.learningOutcomes?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Full Learning Outcomes
                </h4>
                <div className="space-y-1.5">
                  {selectedProject.learningOutcomes.map((loc, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{loc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                Close
              </button>
              <Link
                to={selectedProject.detailsUrl || `/projects/${selectedProject.slug || selectedProject._id}`}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#102747] bg-[#FFF2BF] hover:bg-[#FDECAE] border border-[#F4D36B] transition shadow-xs flex items-center gap-1.5"
              >
                <span>Full Project Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* 6. FINAL NAVIGATION & CTA SECTION */}
      <section className="py-16 sm:py-20 bg-gradient-to-t from-slate-100 via-[#FAFBFD] to-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="w-14 h-14 bg-[#FFF2BF] text-[#102747] border border-[#F4D36B]/60 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
            <Compass className="h-7 w-7 text-[#173563] stroke-[2.2]" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#102747] tracking-tight">
            {roadmap.finalCta?.heading || 'Start Your DevOps Journey Today'}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {roadmap.finalCta?.description ||
              'Learn industry-relevant tools, build real-world projects, and prepare for your DevOps career with AutoOps School.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            <Link
              to={roadmap.finalCta?.primaryButtonLink && !roadmap.finalCta.primaryButtonLink.includes('devops-engineering-course') ? roadmap.finalCta.primaryButtonLink : '/courses'}
              className="px-6 py-3.5 rounded-xl bg-[#173563] hover:bg-[#102747] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group cursor-pointer"
            >
              <span>{roadmap.finalCta?.primaryButtonText && !roadmap.finalCta.primaryButtonText.includes('DevOps Course') ? roadmap.finalCta.primaryButtonText : 'Explore All Courses'}</span>
              <ArrowRight className="w-4 h-4 text-[#F4D36B] transition group-hover:translate-x-0.5" />
            </Link>

            <Link
              to={roadmap.finalCta?.secondaryButtonLink && !roadmap.finalCta.secondaryButtonLink.includes('devops-engineering-course') ? roadmap.finalCta.secondaryButtonLink : '/projects'}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#102747] text-sm font-bold border border-slate-200 shadow-2xs hover:shadow-xs transition duration-200 flex items-center gap-2 cursor-pointer"
            >
              <span>{roadmap.finalCta?.secondaryButtonText && !roadmap.finalCta.secondaryButtonText.includes('courses/devops') ? roadmap.finalCta.secondaryButtonText : 'Explore Practical Projects'}</span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};

export default DevOpsRoadmapPage;

