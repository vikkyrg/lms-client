import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  BookOpen,
  Laptop,
  FolderGit2,
  AlertCircle,
  FileCheck,
  Compass,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Building2,
  MapPin,
  Globe,
  Mail,
  Sparkles
} from 'lucide-react';
import { PageHero, CtaBanner } from '../components/BrandComponents';
import HeroBackgroundWaves from '../components/HeroBackgroundWaves';
import { AnimatedSection } from '../components/AnimatedSection';
import RevealGroup from '../components/RevealGroup';
import aboutHeroImg from '../assests/about.png';
import founderImg from '../assests/foundar.png';

const trainingMethodology = [
  {
    step: '01',
    title: 'Concept-Based Learning',
    description: 'Build a solid conceptual foundation of core architectures and tools before progressing to advanced topics.',
    icon: BookOpen
  },
  {
    step: '02',
    title: 'Hands-On Practice',
    description: 'Apply newly learned concepts immediately through guided lab sessions, terminal commands, and structured exercises.',
    icon: Laptop
  },
  {
    step: '03',
    title: 'Project Implementation',
    description: 'Work on realistic projects that mirror common modern industry workflows and production setups.',
    icon: FolderGit2
  },
  {
    step: '04',
    title: 'Scenario-Based Learning',
    description: 'Practice real-world troubleshooting, system breakdown analysis, log inspection, and technical problem-solving.',
    icon: AlertCircle
  },
  {
    step: '05',
    title: 'Interview Preparation',
    description: 'Prepare with curated technical question banks, mock interview simulations, and actionable evaluation feedback.',
    icon: FileCheck
  },
  {
    step: '06',
    title: 'Career Guidance',
    description: 'Receive structured resume guidance, technical portfolio reviews, and best practices for job-search platforms.',
    icon: Compass
  }
];

// Company Overview information cards (single source of truth for the grid)
const companyInfoData = [
  { id: 'name', label: 'Company Name', value: 'AutoOps School', icon: Building2 },
  { id: 'industry', label: 'Industry', value: 'IT Training and Technical Education', icon: GraduationCap },
  { id: 'location', label: 'Location', value: 'Bengaluru, Karnataka, India', icon: MapPin },
  {
    id: 'website',
    label: 'Website',
    value: 'https://autoopsschool.in',
    href: 'https://autoopsschool.in',
    external: true,
    icon: Globe
  },
  {
    id: 'email',
    label: 'Email',
    value: 'autoopsschool@gmail.com',
    href: 'mailto:autoopsschool@gmail.com',
    icon: Mail
  },
  { id: 'tagline', label: 'Tagline', value: 'Learn. Build. Automate.', icon: Sparkles }
];

export const AboutPage = () => (
  <div className="bg-[#FAFBFD] min-h-screen text-[#344054]">
    <PageHero
      badge="About AutoOps School"
      title={
        <>
          Practical Learning <span className="text-[#3478F6]">for the Work Ahead</span>
        </>
      }
      subtitle="At AutoOps School, we help aspiring IT professionals develop the technical skills and practical confidence needed for modern technology careers. Our learning approach combines structured training, hands-on projects, and industry-relevant knowledge."
      image={aboutHeroImg}
      imageAlt="About AutoOps School IT Training and Practical Education"
      features={[
        'Practical Technical Training',
        'Industry-Relevant Skills',
        'Learning Through Projects'
      ]}
      primaryCta={{ text: 'Discover Our Story', link: '#about-content' }}
      secondaryCta={{ text: 'Our Teaching Approach', link: '#training-methodology' }}
    />

    <div id="about-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 scroll-mt-24">
      
      {/* Company Overview Card */}
      <section className="bg-white border border-[#E2E8F0] rounded-[24px] p-[26px] sm:p-10 lg:p-12 xl:p-[52px] shadow-[0_10px_40px_rgba(18,41,75,0.06)]">
        {/* Full-width introduction */}
        <AnimatedSection direction="up" delay={50}>
          <span className="text-[12px] sm:text-xs uppercase tracking-[0.18em] font-extrabold text-[#3F6FA8] block mb-2">
            Institute Profile
          </span>
          <h2 className="text-[28px] sm:text-[32px] lg:text-[38px] font-extrabold text-[#17345F] tracking-tight leading-[1.15]">
            Company <span className="text-[#2563EB]">Overview</span>
          </h2>
          {/* Golden-yellow underline accent */}
          <div className="mt-3 mb-6 h-1 w-16 rounded-full bg-[#F4D36B]" />
          <p className="text-[15px] sm:text-[17px] lg:text-[18px] leading-[1.7] text-[#586579]">
            AutoOps School is an IT training institute focused on helping students, fresh graduates, and aspiring IT professionals develop practical, industry-relevant technical skills. Our training approach emphasizes hands-on learning, real-world projects, technical problem-solving, and interview preparation.
          </p>
          <p className="mt-4 text-[15px] sm:text-[17px] lg:text-[18px] leading-[1.7] text-[#586579]">
            We aim to bridge the gap between academic knowledge and practical IT skills through structured training programs in DevOps Engineering, Java Full Stack Development, and Python Full Stack Development. Through guided practice, project implementation, mock interviews, and career guidance, learners can build technical confidence and prepare for opportunities in the IT industry.
          </p>
        </AnimatedSection>

        {/* Subtle divider between introduction and information grid */}
        <div className="my-8 sm:my-10 h-px w-full bg-[#E2E8F0]" />

        {/* Company Information Grid — staggered reveal (3 columns × 2 rows) */}
        <RevealGroup
          stagger={90}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {companyInfoData.map((item) => {
            const Icon = item.icon;
            const isLink = Boolean(item.href);
            return (
              <div
                key={item.id}
                className="group flex items-center gap-4 min-h-[110px] bg-white border border-[#E2E8F0] rounded-2xl p-[18px] sm:p-6 shadow-[0_2px_10px_rgba(20,47,85,0.05)] transition-all duration-[250ms] ease-out hover:border-[#BFD4F0] hover:shadow-[0_10px_28px_rgba(20,47,85,0.10)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
              >
                {/* Light-blue rounded icon container */}
                <div className="shrink-0 w-11 h-11 sm:w-[52px] sm:h-[52px] rounded-[14px] bg-[#EFF6FF] flex items-center justify-center">
                  <Icon className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#1D4ED8] stroke-[2.1]" />
                </div>
                {/* Label + value */}
                <div className="min-w-0">
                  <span className="text-[12px] sm:text-[13px] uppercase font-bold tracking-wider text-[#64748B] block">
                    {item.label}
                  </span>
                  {isLink ? (
                    <a
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="mt-0.5 block text-[15px] sm:text-[16px] lg:text-[17px] font-bold text-[#2563EB] break-words leading-snug hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="mt-0.5 block text-[15px] sm:text-[16px] lg:text-[17px] font-bold text-[#142F55] break-words leading-snug">
                      {item.value}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </RevealGroup>
      </section>

      {/* 3. Founder & Leadership — Premium Spotlight */}
      <section className="relative overflow-hidden bg-white rounded-3xl border border-[#E2E8F0] shadow-[0_4px_24px_rgba(20,43,80,0.06)] p-6 sm:p-10 lg:p-12">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#EAF3FF]/70 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#EFF6FF]/60 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Founder Profile Card / Frame */}
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <AnimatedSection direction="up" delay={100} className="w-full max-w-[280px]">
              <div className="relative mx-auto rounded-3xl p-3 bg-gradient-to-b from-[#EBF3FE] to-white border border-[#DCEBFF] shadow-xs">
                {/* Elegant Navy Frame with Founder Image */}
                <div className="relative w-full aspect-[4/4.5] rounded-2xl bg-[#172F56] overflow-hidden shadow-inner border border-[#1F3D6D] group">
                  <img
                    src={founderImg}
                    alt="Bhoomika R H - Founder, AutoOps School"
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Profile Meta Below Image Frame */}
                <div className="pt-3.5 pb-1">
                  <h4 className="text-base sm:text-lg font-extrabold text-[#172F56] tracking-tight">
                    Bhoomika R H
                  </h4>
                  <p className="text-xs font-semibold text-[#3478F6] uppercase tracking-wider mt-0.5">
                    Founder, AutoOps School
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right Column: Founder Introduction & Vision */}
          <div className="lg:col-span-8 space-y-5">
            <AnimatedSection direction="up" delay={200} className="space-y-2">
              <span className="text-[11px] sm:text-xs uppercase tracking-widest font-extrabold text-[#3478F6] inline-flex items-center gap-1.5">
                <span className="w-2 h-0.5 bg-[#3478F6] rounded-full" />
                MEET OUR FOUNDER
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172F56] tracking-tight leading-tight">
                Leadership That Inspires Learning
              </h2>
            </AnimatedSection>

            {/* Founder Biography */}
            <AnimatedSection direction="up" delay={250} className="space-y-3.5 text-sm sm:text-base text-[#475467] leading-relaxed">
              <p>
                AutoOps School was founded by <strong className="text-[#172F56] font-bold">Bhoomika R H</strong> with the mission of bridging the gap between theoretical knowledge and practical IT skills.
              </p>
              <p>
                Under her leadership, the institute is committed to structured technical education, hands-on learning, real-world project problem-solving, and career-focused preparation for aspiring IT professionals.
              </p>
            </AnimatedSection>

            {/* Highlighted Vision Statement */}
            <AnimatedSection direction="up" delay={300}>
              <div className="p-4 sm:p-5 rounded-2xl bg-[#EAF3FF] border-l-4 border-[#3478F6] shadow-2xs">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#3478F6] block mb-1">
                  Core Founding Vision
                </span>
                <p className="text-sm sm:text-base font-bold text-[#172F56] leading-snug">
                  "Bridging the gap between theoretical knowledge and practical IT skills."
                </p>
              </div>
            </AnimatedSection>
          </div>

        </div>
      </section>

      {/* 4. Vision & Mission */}
      <AnimatedSection direction="up" delay={100} className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200/90 p-8 shadow-xs hover:shadow-md transition duration-300">
          <div className="w-12 h-12 rounded-xl bg-[#EAF2FC] text-[#2B6FE0] flex items-center justify-center mb-5 border border-[#D5E4F7]">
            <Compass className="h-6 w-6 stroke-[2.2]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#102747]">Our Vision</h2>
          <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
            To become a trusted learning destination for aspiring IT professionals by making practical technical education accessible, relevant, and career-focused.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/90 p-8 shadow-xs hover:shadow-md transition duration-300">
          <div className="w-12 h-12 rounded-xl bg-[#FFF2BF] text-[#102747] flex items-center justify-center mb-5 border border-[#F4D36B]">
            <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#102747]">Our Mission</h2>
          <ul className="mt-4 space-y-3 text-gray-600 text-sm sm:text-base">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#12B76A] mt-1 shrink-0 stroke-[2.2]" />
              <span>Deliver structured, hands-on technical training.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#12B76A] mt-1 shrink-0 stroke-[2.2]" />
              <span>Help learners apply concepts through practical projects and real-world scenarios.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#12B76A] mt-1 shrink-0 stroke-[2.2]" />
              <span>Build problem-solving, troubleshooting, and technical interview skills.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#12B76A] mt-1 shrink-0 stroke-[2.2]" />
              <span>Provide resume guidance, mock interviews, and career preparation.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#12B76A] mt-1 shrink-0 stroke-[2.2]" />
              <span>Encourage continuous learning in modern IT technologies and automation.</span>
            </li>
          </ul>
        </div>
      </AnimatedSection>

      {/* 5. Target Learners: Who Can Join — warm ivory panel, staggered audience cards */}
      <section className="rounded-[24px] bg-[#FFFCF5] border border-[#F1DCA8] p-8 sm:p-10 shadow-[0_6px_24px_rgba(20,47,85,0.05)]">
        <AnimatedSection direction="up" delay={50}>
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] font-extrabold text-[#3478F6] block mb-1.5">
            Target Audience
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#16345C] tracking-tight">Our Learners — Who We Support</h2>
          <p className="mt-2 text-[#5B667A] text-sm sm:text-base leading-relaxed max-w-2xl">
            Our programs are thoughtfully structured to serve learners at pivotal career milestones:
          </p>
        </AnimatedSection>
        <RevealGroup
          stagger={100}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
        >
          {[
            'Fresh graduates entering the tech workforce',
            'Final-year college students preparing for campus drives',
            'Beginners entering the IT industry',
            'Career switchers transitioning into software and DevOps',
            'IT professionals (0–2 years exp.) strengthening skills'
          ].map((learner, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 min-h-[72px] bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 text-xs sm:text-sm font-semibold text-[#16345C] shadow-[0_2px_8px_rgba(20,47,85,0.05)] transition-shadow duration-300 ease-out hover:shadow-[0_6px_18px_rgba(20,47,85,0.08)]"
            >
              <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 stroke-[2.1]" />
              <span className="leading-snug">{learner}</span>
            </div>
          ))}
        </RevealGroup>
      </section>

      {/* 6. Training Methodology — white panel, numbered pedagogy cards with staggered reveal */}
      <section id="training-methodology" className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 sm:p-10 shadow-[0_6px_24px_rgba(20,47,85,0.05)] scroll-mt-24">
        <AnimatedSection direction="up" delay={50}>
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] font-extrabold text-[#3478F6] block mb-1.5">
            Pedagogy
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#16345C] tracking-tight">Our Training Methodology</h2>
          <p className="mt-2 text-[#5B667A] text-sm sm:text-base leading-relaxed max-w-2xl">
            How AutoOps School teaches: moving from concept mastery to hands-on execution and career readiness.
          </p>
        </AnimatedSection>
        <RevealGroup
          stagger={90}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-8"
        >
          {trainingMethodology.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.step}
                className="flex flex-col h-full rounded-xl border border-[#E2E8F0] bg-[#FAF8F4] p-6 transition-colors duration-300 ease-out hover:border-[#C9D6E8]"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-extrabold tracking-[0.12em] text-[#3478F6]">{m.step}</span>
                  <span className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0">
                    <Icon className="h-[18px] w-[18px] text-[#16345C] stroke-[2]" />
                  </span>
                </div>
                <h3 className="font-bold text-[#102747] text-base">{m.title}</h3>
                <p className="mt-2 text-sm text-[#5B667A] leading-relaxed">{m.description}</p>
              </div>
            );
          })}
        </RevealGroup>
      </section>

    </div>

    <CtaBanner
      title="Start Your Learning Journey with Us"
      description="Connect with our advisors to discuss syllabus, prerequisites, and upcoming live batch schedules."
      buttonText="Explore Courses"
      buttonLink="/courses"
    />
  </div>
);

import CareerSupportPage from './CareerSupportPage';
export { CareerSupportPage };
export { default as LegalPage } from './LegalPage';

export default AboutPage;
