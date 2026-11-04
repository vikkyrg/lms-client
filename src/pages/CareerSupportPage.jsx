import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { PageHero } from '../components/BrandComponents';
import { AnimatedSection } from '../components/AnimatedSection';
import careerSupportImage from '../assests/careersupport.png';
import {
  ShieldCheck,
  Video,
  FileText,
  Globe2,
  Terminal,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Sparkles,
  BookOpen,
  Cpu,
  Layers,
  Server,
  Cloud,
  GitBranch,
  Box,
  Activity,
  Workflow,
  Compass,
  Briefcase,
  Target,
  Award,
  MessageSquare,
  Users,
  Check
} from 'lucide-react';

// 4 Pillars of Career Support Services
const CAREER_SERVICES = [
  {
    id: 'mock-interviews',
    title: 'Mock Technical Interviews',
    subtitle: 'Simulated 1-on-1 and panel technical interviews covering live problem-solving scenarios, conceptual depth, and behavioral communication with actionable feedback.',
    tag: 'Scenario Q&A · Troubleshooting Drills',
    icon: Video,
    accentBorder: 'border-blue-200 hover:border-[#2F6FE4]',
    iconBg: 'bg-[#EAF2FC] text-[#2F6FE4] group-hover:bg-[#2F6FE4] group-hover:text-white',
    bulletPoints: [
      'Live technical deep-dives with realistic interviewer questions',
      'System design and pipeline architecture walk-throughs',
      'Actionable evaluation rubrics highlighting areas to strengthen'
    ]
  },
  {
    id: 'resume-guidance',
    title: 'Resume & Portfolio Guidance',
    subtitle: 'Step-by-step guidance on structuring resumes to highlight practical projects, core tools, and technical competencies effectively.',
    tag: 'Project Framing · ATS Best Practices',
    icon: FileText,
    accentBorder: 'border-amber-200 hover:border-[#F4D36B]',
    iconBg: 'bg-[#FFF9E6] text-[#B78103] group-hover:bg-[#F4D36B] group-hover:text-[#102747]',
    bulletPoints: [
      'Framing hands-on projects with quantifiable production metrics',
      'Formatting for modern Applicant Tracking Systems (ATS)',
      'GitHub repository curation and documentation best practices'
    ]
  },
  {
    id: 'job-platforms',
    title: 'Job-Search Platform Guidance',
    subtitle: 'Practical strategies for presenting skills, optimizing technical profiles on LinkedIn and developer platforms, and discovering opportunities.',
    tag: 'Profile Optimization · Networking Guidance',
    icon: Globe2,
    accentBorder: 'border-emerald-200 hover:border-[#12B76A]',
    iconBg: 'bg-[#E8F8F0] text-[#12B76A] group-hover:bg-[#12B76A] group-hover:text-white',
    bulletPoints: [
      'LinkedIn headline, summary, and skills section optimization',
      'Strategic networking outreach to engineering peers and managers',
      'Navigating direct career portals and tech community job boards'
    ]
  },
  {
    id: 'troubleshooting-scenarios',
    title: 'Technical Problem-Solving & Scenarios',
    subtitle: 'Rigorous practice addressing real-world troubleshooting scenarios, debugging logs, deployment failures, and pipeline bottlenecks.',
    tag: 'Incident Diagnosis · Root-Cause Analysis',
    icon: Terminal,
    accentBorder: 'border-indigo-200 hover:border-[#173563]',
    iconBg: 'bg-[#EEF2F9] text-[#173563] group-hover:bg-[#173563] group-hover:text-white',
    bulletPoints: [
      'Diagnosing CrashLoopBackOff & Kubernetes pod failures',
      'Investigating broken CI/CD pipelines & artifact deploy issues',
      'Reading log aggregators & formulating structured post-mortems'
    ]
  }
];

// 4-Step Process: Your Journey to Career Readiness
const PREPARATION_STEPS = [
  {
    number: '01',
    title: 'Assess Your Skills',
    description: 'Identify technical strengths, knowledge gaps, and specific areas requiring targeted improvement across tools and architectures.',
    badge: 'Baseline Diagnostic'
  },
  {
    number: '02',
    title: 'Build Your Professional Profile',
    description: 'Improve your resume, portfolio, project presentation, and professional online presence across developer networks.',
    badge: 'Portfolio & ATS'
  },
  {
    number: '03',
    title: 'Practice Real-World Interviews',
    description: 'Participate in mock interviews, technical discussions, live troubleshooting exercises, and behavioral roleplays.',
    badge: 'Simulated Scenarios'
  },
  {
    number: '04',
    title: 'Prepare for Opportunities',
    description: 'Develop structured job-search strategies, improve communication, and prepare for technical rounds with confidence.',
    badge: 'Interview Ready'
  }
];

// Practical Technical Interview Preparation Topics
const TECHNICAL_TOPICS = [
  { name: 'Linux and Shell Scripting', category: 'Core OS', icon: Terminal },
  { name: 'Git and GitHub', category: 'Version Control', icon: GitBranch },
  { name: 'Docker and Containerization', category: 'Containers', icon: Box },
  { name: 'Kubernetes', category: 'Orchestration', icon: Layers },
  { name: 'AWS and Cloud Fundamentals', category: 'Cloud Infrastructure', icon: Cloud },
  { name: 'CI/CD Pipelines', category: 'Automation', icon: Workflow },
  { name: 'Jenkins', category: 'Build Automation', icon: Cpu },
  { name: 'Terraform & IaC', category: 'Infrastructure Code', icon: Server },
  { name: 'Monitoring & Troubleshooting', category: 'Observability', icon: Activity },
  { name: 'DevOps Real-World Scenarios', category: 'Production Systems', icon: Briefcase }
];

// Career Readiness Benefits
const CAREER_BENEFITS = [
  {
    title: 'Strong Technical Fundamentals',
    description: 'Master underlying core concepts rather than memorizing buzzwords or superficial syntax.',
    icon: Cpu
  },
  {
    title: 'Real-World Problem-Solving Skills',
    description: 'Tackle real infrastructure failures, pipeline errors, and architectural trade-offs.',
    icon: Terminal
  },
  {
    title: 'Professional Resume & Portfolio',
    description: 'Showcase verified production-style projects that demonstrate tangible engineering competency.',
    icon: FileText
  },
  {
    title: 'Interview Confidence',
    description: 'Express technical depth calmly and articulately under live pressure through repeated mock practice.',
    icon: Target
  },
  {
    title: 'Effective Technical Communication',
    description: 'Explain architectures, incident root causes, and technical decisions clearly to interview panels.',
    icon: MessageSquare
  },
  {
    title: 'Industry-Relevant Practical Knowledge',
    description: 'Learn modern DevOps workflows mirroring what top technology companies actually use every day.',
    icon: Award
  }
];

// Career Support FAQs (with dynamic API fallback)
const DEFAULT_CAREER_FAQS = [
  {
    question: 'What career support does AutoOps School provide?',
    answer: 'AutoOps School provides end-to-end practical career readiness support. This includes simulated 1-on-1 and panel technical mock interviews, structured resume and GitHub portfolio reviews, LinkedIn profile optimization, hands-on production troubleshooting drills, and job-search strategy guidance.'
  },
  {
    question: 'Are mock technical interviews included in the training?',
    answer: 'Yes. Mock technical interviews are an integral part of our curriculum. Students undergo simulated technical rounds featuring real-world scenario questions, architecture walk-throughs, and debugging tests followed by personalized feedback on conceptual clarity and communication.'
  },
  {
    question: 'Does AutoOps School provide resume preparation guidance?',
    answer: 'Yes. We guide you step-by-step on framing your practical training projects, highlighting quantifiable technical accomplishments, selecting the right keywords for modern Applicant Tracking Systems (ATS), and structuring a clean, professional engineering resume.'
  },
  {
    question: 'Can beginners receive career guidance?',
    answer: 'Absolutely. Whether you are a college graduate, a fresher entering the IT workforce, or a professional transitioning from another domain (e.g. system administration, testing, or development), our guidance is tailored to bridge your specific background with DevOps market requirements.'
  },
  {
    question: 'Does career support include real-world technical interview preparation?',
    answer: 'Yes. Rather than rote memorization of question banks, we emphasize scenario-based problem solving—such as troubleshooting crashed Kubernetes pods, diagnosing pipeline bottlenecks, and writing Terraform scripts live during technical interview rounds.'
  },
  {
    question: 'Does AutoOps School guarantee job placement?',
    answer: 'No. AutoOps School focuses on authentic skill development, interview readiness, and hands-on preparation. We clearly distinguish our interview training, mock evaluations, and resume guidance from guaranteed job placement claims. We equip you with the practical competence and confidence required to clear technical interviews on your own merit.'
  }
];

const CareerSupportPage = () => {
  const [faqs, setFaqs] = useState(DEFAULT_CAREER_FAQS);
  const [openFaqIndex, setOpenFaqIndex] = useState(0); // first item open by default

  useEffect(() => {
    let isMounted = true;
    const fetchFaqs = async () => {
      try {
        const res = await api.get('/faqs');
        if (isMounted && res.data && res.data.faqs && res.data.faqs.length > 0) {
          // Look for career-specific FAQs if present
          const careerFaqs = res.data.faqs.filter(
            (f) =>
              f.category?.toLowerCase().includes('career') ||
              f.category?.toLowerCase().includes('support') ||
              f.category?.toLowerCase().includes('interview')
          );
          if (careerFaqs.length >= 3) {
            setFaqs(careerFaqs);
          }
        }
      } catch (err) {
        // Fallback to DEFAULT_CAREER_FAQS is already set
      }
    };
    fetchFaqs();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-[#344054] selection:bg-[#F4D36B]/40 selection:text-[#102747]">
      {/* 1. HERO SECTION (Redesigned with Balanced Content & Proportions) */}
      <PageHero
        badge="Career Development"
        title={
          <>
            Career Preparation <span className="text-[#3478F6]">That Stays Practical</span>
          </>
        }
        subtitle="Prepare for your next career opportunity with focused interview practice, technical problem-solving, professional resume guidance, and structured career preparation. Build the confidence to present your skills effectively in the technology industry."
        image={careerSupportImage}
        imageAlt="AutoOps School Practical Career Support and Interview Readiness"
        features={[
          'Interview Preparation',
          'Resume Guidance',
          'Technical Problem-Solving'
        ]}
        primaryCta={{ text: 'Explore Career Services', link: '#career-services' }}
        secondaryCta={{ text: 'Prepare for Interviews', link: '#interview-prep' }}
      />

      {/* Main Container below Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 sm:space-y-24">
        
        {/* ========================================================================= */}
        {/* 2. CAREER GUIDANCE COMMITMENT SECTION                                    */}
        {/* ========================================================================= */}
        <AnimatedSection direction="up" delay={50}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFFDF7] via-white to-[#FFFDF7] border-2 border-[#F4D36B]/60 p-6 sm:p-9 shadow-[0_8px_30px_rgba(244,211,107,0.12)]">
            {/* Subtle decorative background shapes */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FFF2BF]/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#EAF2FC]/40 rounded-full blur-xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#FFF2BF] to-[#F4D36B] text-[#102747] flex items-center justify-center shrink-0 border border-[#F4D36B] shadow-sm">
                  <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.3]" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#102747] text-[#F4D36B] text-[11px] font-bold tracking-wider uppercase mb-1.5 shadow-2xs">
                    <span>Integrity & Transparency</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#102747] tracking-tight">
                    Our Career Guidance Commitment
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl">
                    AutoOps School focuses strictly on authentic skill development, interview readiness, hands-on architectural preparation, and professional resume guidance. We clearly distinguish our practical interview simulations, scenario workshops, and mentor evaluations from guaranteed job placement claims.
                  </p>
                </div>
              </div>

              {/* Verified Trust Pill */}
              <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-amber-200/80 pt-4 md:pt-0 md:pl-8 gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3F6FA8]">Policy Status</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#102747] bg-[#FFF2BF] px-3.5 py-1.5 rounded-xl border border-[#F4D36B]/60">
                  <Check className="w-3.5 h-3.5 text-[#12B76A] stroke-[3]" />
                  100% Practical Ethics
                </span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* ========================================================================= */}
        {/* 3. CAREER SUPPORT SERVICES SECTION (Premium 4-Card Layout)                */}
        {/* ========================================================================= */}
        <section id="career-services" className="scroll-mt-24">
          <AnimatedSection direction="up" delay={50} className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <span className="inline-block bg-[#EAF2FC] text-[#173563] border border-[#D0E2F6] text-xs font-extrabold px-3.5 py-1 rounded-full tracking-wider uppercase mb-3 shadow-2xs">
              PRACTICAL PATHWAY
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#173563] tracking-tight leading-tight">
              Your Career. <span className="text-[#2F6FE4]">Your Next Opportunity.</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
              Practical career support designed to help you become technically confident, interview-ready, and professionally prepared.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {CAREER_SERVICES.map((service, idx) => {
              const Icon = service.icon;
              return (
                <AnimatedSection key={service.id} direction="up" delay={80 + idx * 60}>
                  <div className={`group relative bg-white rounded-3xl border-2 ${service.accentBorder} p-7 sm:p-9 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full`}>
                    <div>
                      {/* Top Header Row with Icon and Badge */}
                      <div className="flex items-center justify-between gap-4 mb-5">
                        <div className={`w-13 h-13 rounded-2xl ${service.iconBg} flex items-center justify-center transition-colors duration-300 shadow-xs`}>
                          <Icon className="w-6 h-6 stroke-[2.2]" />
                        </div>
                        <span className="text-[11px] font-bold text-[#102747] bg-[#FAF8F3] border border-[#F0EBE1] px-3.5 py-1.5 rounded-full shadow-2xs">
                          {service.tag}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl font-extrabold text-[#102747] tracking-tight group-hover:text-[#2F6FE4] transition-colors duration-200">
                        {service.title}
                      </h3>
                      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                        {service.subtitle}
                      </p>

                      {/* Bullet Highlights */}
                      <ul className="mt-6 space-y-2.5 pt-5 border-t border-gray-100">
                        {service.bulletPoints.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-[#12B76A] shrink-0 mt-0.5 stroke-[2.2]" />
                            <span className="leading-snug">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom subtle accent bar */}
                    <div className="mt-6 pt-4 flex items-center text-xs font-bold text-[#2F6FE4] group-hover:translate-x-1 transition-transform duration-200">
                      <span>Included in DevOps Programs</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CAREER PREPARATION PROCESS (Horizontal on Desktop, Timeline on Mobile) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-gray-200/90 p-8 sm:p-12 shadow-[0_4px_25px_rgba(16,39,71,0.04)]">
          <AnimatedSection direction="up" delay={50} className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="inline-block bg-[#FFF2BF] text-[#102747] border border-[#F4D36B]/60 text-xs font-extrabold px-3.5 py-1 rounded-full tracking-wider uppercase mb-3 shadow-2xs">
              STRUCTURED METHODOLOGY
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#102747] tracking-tight">
              Your Journey to Career Readiness
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
              A structured approach that transforms your technical knowledge into professional confidence.
            </p>
          </AnimatedSection>

          {/* Desktop Connected 4-Step Timeline / Mobile Vertical Timeline */}
          <div className="relative">
            {/* Horizontal Connecting Line for Desktop */}
            <div className="hidden lg:block absolute top-7 left-12 right-12 h-1 bg-gradient-to-r from-[#2F6FE4] via-[#F4D36B] to-[#12B76A] z-0 rounded-full" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {PREPARATION_STEPS.map((step, idx) => (
                <AnimatedSection key={step.number} direction="up" delay={100 + idx * 80}>
                  <div className="relative bg-[#FAFBFD] lg:bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#2F6FE4] hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
                    {/* Step Number Circle */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#142F59] text-[#FFD95A] font-extrabold text-lg flex items-center justify-center shadow-md group-hover:scale-105 group-hover:bg-[#2F6FE4] group-hover:text-white transition-all duration-200">
                        {step.number}
                      </div>
                      <span className="text-[11px] font-bold text-[#142F59] bg-[#EAF2FC] border border-[#D0E2F6] px-2.5 py-1 rounded-md">
                        {step.badge}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-[#102747] text-base sm:text-lg mb-2 group-hover:text-[#2F6FE4] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. TECHNICAL INTERVIEW PREPARATION (Interactive Technology Grid)         */}
        {/* ========================================================================= */}
        <section id="interview-prep" className="scroll-mt-24">
          <AnimatedSection direction="up" delay={50} className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <span className="inline-block bg-[#EAF2FC] text-[#173563] border border-[#D0E2F6] text-xs font-extrabold px-3.5 py-1 rounded-full tracking-wider uppercase mb-3 shadow-2xs">
              HANDS-ON SIMULATION
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#173563] tracking-tight leading-tight">
              Practice Like an Engineer. <span className="text-[#2F6FE4]">Interview With Confidence.</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
              Students practice core technical concepts through realistic production scenarios, live terminal problem-solving, and architecture defense rather than memorizing superficial interview answers.
            </p>
          </AnimatedSection>

          {/* Technology Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {TECHNICAL_TOPICS.map((topic, idx) => {
              const Icon = topic.icon;
              return (
                <AnimatedSection key={topic.name} direction="up" delay={40 + idx * 30}>
                  <div className="group bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 hover:border-[#2F6FE4] hover:shadow-md transition-all duration-200 flex flex-col items-start h-full">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F3] text-[#102747] group-hover:bg-[#102747] group-hover:text-[#F4D36B] flex items-center justify-center mb-3 transition-colors duration-200 border border-[#F0EBE1]">
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-[#3F6FA8] tracking-wider mb-1">
                      {topic.category}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-[#102747] group-hover:text-[#2F6FE4] transition-colors leading-snug">
                      {topic.name}
                    </h4>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          {/* Supporting Scenario Callout Box */}
          <AnimatedSection direction="up" delay={120} className="mt-8">
            <div className="bg-[#FAF8F3] border border-[#F0EBE1] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#102747] text-[#F4D36B] flex items-center justify-center shrink-0">
                  <Terminal className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  <strong className="text-[#102747]">Production Rigor:</strong> Every mock session tests failure modes: CrashLoopBackOff, SSL certificate expirations, DNS split-brain, and pipeline regression debugging.
                </p>
              </div>
              <Link
                to="/courses"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F6FE4] hover:text-[#102747] transition shrink-0"
              >
                <span>View Full Syllabus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </AnimatedSection>
        </section>

        {/* ========================================================================= */}
        {/* 6. CAREER READINESS BENEFITS SECTION                                     */}
        {/* ========================================================================= */}
        <section className="bg-gradient-to-b from-white to-[#F8FAFD] rounded-3xl border border-gray-200/90 p-8 sm:p-12 shadow-[0_4px_25px_rgba(16,39,71,0.04)]">
          <AnimatedSection direction="up" delay={50} className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <span className="inline-block bg-[#FFF2BF] text-[#102747] border border-[#F4D36B]/60 text-xs font-extrabold px-3.5 py-1 rounded-full tracking-wider uppercase mb-3 shadow-2xs">
              COMPETENCY OUTCOMES
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#102747] tracking-tight leading-tight">
              Build the Confidence Employers Look For
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
              Ground your confidence in genuine technical competence, clear articulation, and hands-on system troubleshooting experience.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAREER_BENEFITS.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <AnimatedSection key={benefit.title} direction="up" delay={60 + idx * 50}>
                  <div className="bg-white rounded-2xl border border-gray-200/90 p-6 hover:shadow-md hover:border-[#2F6FE4] transition-all duration-200 h-full flex flex-col">
                    <div className="w-11 h-11 rounded-xl bg-[#EAF2FC] text-[#2F6FE4] flex items-center justify-center mb-4 border border-[#D0E2F6] shadow-2xs">
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <h3 className="font-extrabold text-base text-[#102747] mb-2 leading-snug">
                      {benefit.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. CAREER SUPPORT FAQ SECTION (Accordion with smooth toggle)             */}
        {/* ========================================================================= */}
        <section>
          <AnimatedSection direction="up" delay={50} className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block bg-[#EAF2FC] text-[#173563] border border-[#D0E2F6] text-xs font-extrabold px-3.5 py-1 rounded-full tracking-wider uppercase mb-3 shadow-2xs">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#173563] tracking-tight">
              Career Support FAQs
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
              Transparent answers regarding our interview preparation, resume reviews, and career guidance policies.
            </p>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <AnimatedSection key={idx} direction="up" delay={40 + idx * 30}>
                  <div className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-2xs transition-all duration-200">
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#102747] hover:text-[#2F6FE4] transition cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <div className={`w-8 h-8 rounded-full bg-[#FAFBFD] border border-gray-200 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#102747] text-white' : 'text-gray-500'}`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-[#FAFBFD]/50 animate-fade-in-up">
                        <p className="whitespace-pre-line">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/faq"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2F6FE4] hover:text-[#102747] transition"
            >
              <span>Have more questions? Browse all general FAQs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. FINAL CAREER SUPPORT CTA SECTION                                      */}
        {/* ========================================================================= */}
        <AnimatedSection direction="up" delay={50}>
          <div className="relative overflow-hidden bg-gradient-to-r from-[#102747] via-[#142F59] to-[#173563] rounded-3xl p-8 sm:p-14 text-white shadow-2xl border border-white/10">
            {/* Subtle radial light accents matching brand Home Page */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#2F6FE4]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F4D36B]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-[#FFF2BF]/15 border border-[#F4D36B]/40 text-[#F4D36B] px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-2xs mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#F4D36B]" />
                <span>Take the Next Step</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Ready to Take the Next Step in Your Career?
              </h2>

              <p className="mt-4 text-sm sm:text-base text-gray-200 leading-relaxed max-w-2xl font-normal">
                Build practical skills, strengthen your professional profile, and prepare for your next technical opportunity with AutoOps School.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center gap-2 bg-[#F4D36B] hover:bg-[#ebd068] text-[#102747] font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-md transition-all duration-200 cursor-pointer"
                >
                  <span>Explore Our Courses</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl border border-white/20 transition-all duration-200 cursor-pointer backdrop-blur-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contact Our Career Support Team</span>
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
};

export default CareerSupportPage;

