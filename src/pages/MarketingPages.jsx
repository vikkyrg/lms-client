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
  GraduationCap
} from 'lucide-react';
import { PageHero, CtaBanner } from '../components/BrandComponents';
import { AnimatedSection } from '../components/AnimatedSection';

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

export const AboutPage = () => (
  <div className="bg-[#FAFBFD] min-h-screen text-[#344054]">
    <PageHero
      badge="About AutoOps School"
      title="Practical Learning for the Work Ahead"
      subtitle="Learn. Build. Automate. We help aspiring IT professionals develop practical, industry-relevant technical skills through structured training and projects."
    />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Company Overview Card */}
      <AnimatedSection direction="up" delay={50} className="bg-white rounded-2xl border border-gray-200/90 p-8 sm:p-10 shadow-[0_4px_20px_rgba(18,41,75,0.04)]">
        <span className="text-xs uppercase tracking-widest font-extrabold text-[#3F6FA8] block mb-1">
          Institute Profile
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173563] tracking-tight mb-4">
          Company Overview
        </h2>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
          AutoOps School is an IT training institute focused on helping students, fresh graduates, and aspiring IT professionals develop practical, industry-relevant technical skills. Our training approach emphasizes hands-on learning, real-world projects, technical problem-solving, and interview preparation.
        </p>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base mt-4">
          We aim to bridge the gap between academic knowledge and practical IT skills through structured training programs in DevOps Engineering, Java Full Stack Development, and Python Full Stack Development. Through guided practice, project implementation, mock interviews, and career guidance, learners can build technical confidence and prepare for opportunities in the IT industry.
        </p>

        {/* Company Quick Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-100">
          <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#F0EBE1]">
            <span className="text-[11px] uppercase font-bold text-gray-500 block">Company Name</span>
            <span className="text-sm font-bold text-[#102747] mt-0.5 block">AutoOps School</span>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#F0EBE1]">
            <span className="text-[11px] uppercase font-bold text-gray-500 block">Industry</span>
            <span className="text-sm font-bold text-[#102747] mt-0.5 block">IT Training and Technical Education</span>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#F0EBE1]">
            <span className="text-[11px] uppercase font-bold text-gray-500 block">Location</span>
            <span className="text-sm font-bold text-[#102747] mt-0.5 block">Bengaluru, Karnataka, India</span>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#F0EBE1]">
            <span className="text-[11px] uppercase font-bold text-gray-500 block">Website</span>
            <a href="https://autoopsschool.in" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#2B6FE0] hover:underline mt-0.5 block">
              https://autoopsschool.in
            </a>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#F0EBE1]">
            <span className="text-[11px] uppercase font-bold text-gray-500 block">Email</span>
            <a href="mailto:autoopsschool@gmail.com" className="text-sm font-bold text-[#2B6FE0] hover:underline mt-0.5 block">
              autoopsschool@gmail.com
            </a>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#F0EBE1]">
            <span className="text-[11px] uppercase font-bold text-gray-500 block">Tagline</span>
            <span className="text-sm font-bold text-[#102747] mt-0.5 block">Learn. Build. Automate.</span>
          </div>
        </div>
      </AnimatedSection>

      {/* Vision & Mission */}
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

      {/* Target Learners: Who Can Join */}
      <AnimatedSection direction="up" delay={150} className="rounded-2xl bg-[#FFFDF7] border border-[#F4D36B]/40 p-8 sm:p-10 shadow-xs">
        <span className="text-xs uppercase tracking-widest font-extrabold text-[#3F6FA8] block mb-1">
          Target Audience
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-[#102747]">Our Learners — Who We Support</h2>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Our programs are thoughtfully structured to serve learners at pivotal career milestones:
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[
            'Fresh graduates entering the tech workforce',
            'Final-year college students preparing for campus drives',
            'Beginners entering the IT industry',
            'Career switchers transitioning into software and DevOps',
            'IT professionals (0–2 years exp.) strengthening skills'
          ].map((learner, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#102747] shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-[#12B76A] shrink-0 stroke-[2.2]" />
              <span>{learner}</span>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Training Methodology */}
      <AnimatedSection direction="up" delay={200} className="bg-white rounded-2xl border border-gray-200/90 p-8 sm:p-10 shadow-xs">
        <span className="text-xs uppercase tracking-widest font-extrabold text-[#3F6FA8] block mb-1">
          Pedagogy
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#173563]">Our Training Methodology</h2>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          How AutoOps School teaches: moving from concept mastery to hands-on execution and career readiness.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {trainingMethodology.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={m.step} className="rounded-2xl border border-gray-100 bg-[#FAF8F3] p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black tracking-wider text-[#3F6FA8]">{m.step}</span>
                  <div className="w-10 h-10 rounded-xl bg-white text-[#173563] flex items-center justify-center border border-gray-200">
                    <Icon className="h-5 w-5 stroke-[2.2]" />
                  </div>
                </div>
                <h3 className="font-bold text-[#102747] text-base">{m.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">{m.description}</p>
              </div>
            );
          })}
        </div>
      </AnimatedSection>

      {/* Founder and Leadership */}
      <AnimatedSection direction="up" delay={250} className="bg-white rounded-2xl border border-gray-200/90 p-8 sm:p-10 shadow-xs">
        <span className="text-xs uppercase tracking-widest font-extrabold text-[#3F6FA8] block mb-1">
          Leadership
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#173563]">Founder & Leadership</h2>
        <div className="mt-6 flex flex-col sm:flex-row items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#173563] text-[#F4D36B] font-black flex items-center justify-center text-2xl shrink-0 shadow-md">
            B
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#102747]">Bhoomika R H</h3>
            <p className="text-xs text-[#2B6FE0] font-bold uppercase tracking-wider">Founder, AutoOps School</p>
            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl">
              AutoOps School was founded by Bhoomika R H with the mission of bridging the gap between theoretical knowledge and practical IT skills. Under her leadership, the institute is committed to structured technical education, hands-on learning, real-world project problem-solving, and career-focused preparation for aspiring IT professionals.
            </p>
          </div>
        </div>
      </AnimatedSection>

    </div>

    <CtaBanner
      title="Start Your Learning Journey with Us"
      description="Connect with our advisors to discuss syllabus, prerequisites, and upcoming live batch schedules."
      buttonText="Explore Courses"
      buttonLink="/courses"
    />
  </div>
);

export const CareerSupportPage = () => (
  <div className="bg-[#FAFBFD] min-h-screen text-[#344054]">
    <PageHero
      badge="Career Development"
      title="Career Preparation That Stays Practical"
      subtitle="Our career support is focused on concrete interview readiness, technical problem-solving, and professional resume guidance."
    />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Transparency Note */}
      <AnimatedSection direction="up" delay={50} className="bg-[#FFFDF7] border border-[#F4D36B]/60 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#FFF2BF] text-[#102747] flex items-center justify-center shrink-0 border border-[#F4D36B]">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="font-bold text-[#102747] text-base sm:text-lg">Our Career Guidance Commitment</h2>
            <p className="mt-1 text-gray-600 text-sm leading-relaxed">
              AutoOps School focuses on authentic skill development, interview readiness, and hands-on preparation. We clearly distinguish our interview training, mock evaluations, and resume guidance from guaranteed job placement claims.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Support Pillars Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {[
          {
            title: 'Mock Technical Interviews',
            desc: 'Simulated 1-on-1 and panel technical interviews covering live problem scenarios, conceptual depth, and behavioral communication with actionable feedback.',
            tools: 'Scenario Q&A · Troubleshooting drills'
          },
          {
            title: 'Resume & Portfolio Guidance',
            desc: 'Step-by-step guidance on structuring your resume to highlight practical projects, core tools, and technical competencies effectively.',
            tools: 'Project framing · ATS best practices'
          },
          {
            title: 'Job-Search Platform Guidance',
            desc: 'Practical strategies for presenting your skills, optimizing your technical profiles on LinkedIn and developer platforms, and discovering opportunities.',
            tools: 'Profile optimization · Networking guidance'
          },
          {
            title: 'Technical Problem-Solving & Scenarios',
            desc: 'Rigorous practice addressing real-world troubleshooting scenarios, debugging logs, deployment failures, and pipeline bottlenecks.',
            tools: 'Incident diagnosis · Root-cause analysis'
          }
        ].map((item, idx) => (
          <AnimatedSection key={idx} direction="up" delay={100 + idx * 70}>
            <div className="bg-white rounded-2xl border border-gray-200/90 p-8 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#EAF2FC] text-[#2B6FE0] flex items-center justify-center shrink-0 border border-[#D5E4F7]">
                  <CheckCircle2 className="h-4 w-4 stroke-[2.2]" />
                </div>
                <h3 className="font-bold text-[#102747] text-base sm:text-lg">{item.title}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed pl-12">{item.desc}</p>
              <div className="mt-5 pl-12">
                <span className="text-xs font-semibold text-[#12294B] bg-[#FEF4D1] border border-[#F9E295] px-3.5 py-1.5 rounded-full inline-block">
                  {item.tools}
                </span>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

    </div>

    <CtaBanner
      title="Prepare for Your Next IT Role"
      description="Learn skills that matter and build confidence for technical interviews through hands-on practice."
      buttonText="Explore Courses"
      buttonLink="/courses"
    />
  </div>
);

export const LegalPage = ({ type }) => (
  <div className="bg-[#FAFBFD] min-h-screen text-[#344054]">
    <PageHero
      badge="Legal & Policy"
      title={type === 'privacy' ? 'Privacy Policy' : 'Terms and Conditions'}
      subtitle="AutoOps School is committed to transparent education practices and student data privacy."
    />

    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <AnimatedSection direction="up" delay={50} className="bg-white rounded-2xl border border-gray-200/90 p-8 sm:p-10 shadow-xs space-y-6">
        <h2 className="font-bold text-[#102747] text-xl">
          AutoOps School {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          AutoOps School (Bengaluru, Karnataka, India • https://autoopsschool.in) is committed to protecting your personal data and ensuring a transparent learning experience.
        </p>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          For inquiries regarding our terms, admissions, or privacy practices, please contact us directly at <a href="mailto:autoopsschool@gmail.com" className="text-[#2B6FE0] underline font-medium">autoopsschool@gmail.com</a> or phone +91 74830 85370.
        </p>
      </AnimatedSection>
    </div>
  </div>
);

export default AboutPage;
