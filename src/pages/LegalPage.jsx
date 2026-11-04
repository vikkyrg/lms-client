import React from 'react';
import {
  ShieldCheck,
  FileText,
  Mail,
  Phone,
  MapPin,
  Lock,
  UserCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import HeroBackgroundWaves from '../components/HeroBackgroundWaves';
import { AnimatedSection } from '../components/AnimatedSection';

/**
 * Unified LegalPage Component for /terms and /privacy-policy (/privacy)
 * 
 * Architecture:
 * - Single seamless container with the brand HeroBackgroundWaves on top.
 * - Hero header seamlessly transitions into comprehensive, professional policy sections.
 * - Rich, structured content addressing Terms of Service or Privacy Policy.
 * - Perfectly responsive on mobile, tablet, and desktop without awkward blank gaps.
 */
export const LegalPage = ({ type }) => {
  const isPrivacy = type === 'privacy';

  return (
    <div className="bg-[#FAFBFD] text-[#344054] min-h-screen">
      {/* ========================================================================= */}
      {/* 1. SEAMLESS HERO HEADER                                                   */}
      {/* ========================================================================= */}
      <div className="relative bg-[#F8FAFD] border-b border-[#E5EDF6] pt-8 sm:pt-12 pb-10 sm:pb-14 overflow-hidden">
        <HeroBackgroundWaves variant="default" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#EBF3FE] border border-[#BFDBFE] text-[#1F70F7] px-3.5 py-1 rounded-full text-xs font-bold tracking-wide shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Legal & Policy</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#142B50] tracking-tight leading-tight">
            {isPrivacy ? 'Privacy Policy' : 'Terms and Conditions'}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#475467] leading-relaxed max-w-2xl mx-auto font-normal">
            {isPrivacy
              ? 'Learn how AutoOps School collects, safeguards, and respects your personal information across our training platform and services.'
              : 'Please review the rules, terms, and guidelines governing your enrollment, course materials, and participation at AutoOps School.'}
          </p>

          <div className="pt-1 text-[11px] sm:text-xs text-slate-400 font-medium">
            Last Updated: November 2026 · Effective Immediately
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. POLICY CONTENT SECTIONS (Single cohesive document flow)               */}
      {/* ========================================================================= */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <AnimatedSection direction="up" delay={50}>
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-[0_4px_24px_rgba(20,43,80,0.04)] p-6 sm:p-10 lg:p-12 space-y-8 sm:space-y-10">
            {isPrivacy ? (
              /* ================= PRIVACY POLICY CONTENT ================= */
              <>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#142B50] tracking-tight mb-3">
                    1. Information We Collect
                  </h2>
                  <p className="text-xs sm:text-sm text-[#475467] leading-relaxed mb-3">
                    AutoOps School collects personal information necessary to deliver our IT education, verify enrollments, and support learner success. This includes:
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#475467]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1F70F7] shrink-0 mt-0.5" />
                      <span><strong>Contact Details:</strong> Your name, email address, phone number, and location when submitting enquiry forms or enrolling in courses.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1F70F7] shrink-0 mt-0.5" />
                      <span><strong>Account Credentials:</strong> Securely hashed passwords and account authentication data for your student portal access.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1F70F7] shrink-0 mt-0.5" />
                      <span><strong>Learning Progress:</strong> Course module completion, assignment submissions, review ratings, and attendance records.</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h2 className="text-lg sm:text-xl font-black text-[#142B50] tracking-tight mb-3">
                    2. How We Use Your Information
                  </h2>
                  <p className="text-xs sm:text-sm text-[#475467] leading-relaxed mb-3">
                    Your personal information is handled transparently and used solely for educational and administrative purposes:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-[#475467] pl-1">
                    <li>Granting student portal access and tracking course completion milestones.</li>
                    <li>Sending critical schedule updates, mentor announcements, and enrollment confirmations.</li>
                    <li>Issuing verifiable course completion certificates upon successful program completion.</li>
                    <li>Providing technical assistance and answering admissions inquiries.</li>
                  </ul>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h2 className="text-lg sm:text-xl font-black text-[#142B50] tracking-tight mb-3">
                    3. Data Security & Storage
                  </h2>
                  <p className="text-xs sm:text-sm text-[#475467] leading-relaxed">
                    We implement modern industry-standard security measures including SSL/TLS encryption, secure database access controls, and hashed credentials. We never sell, rent, or monetize student personal information with third-party advertisers.
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h2 className="text-lg sm:text-xl font-black text-[#142B50] tracking-tight mb-3">
                    4. Student Rights & Data Choices
                  </h2>
                  <p className="text-xs sm:text-sm text-[#475467] leading-relaxed">
                    You have the right to request access to your personal data, update your profile details, or request account closure at any time by contacting our support desk.
                  </p>
                </div>
              </>
            ) : (
              /* ================= TERMS & CONDITIONS CONTENT ================= */
              <>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#142B50] tracking-tight mb-3">
                    1. Enrollment & Access Eligibility
                  </h2>
                  <p className="text-xs sm:text-sm text-[#475467] leading-relaxed mb-3">
                    By enrolling in any AutoOps School training program (DevOps Engineering, Java Programming, Python Programming), you agree to comply with our academic standards and platform rules:
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#475467]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1F70F7] shrink-0 mt-0.5" />
                      <span><strong>Personal Access:</strong> Student accounts and enrolled course materials are intended strictly for individual use by the registered student.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1F70F7] shrink-0 mt-0.5" />
                      <span><strong>Course Duration:</strong> Access to curriculum materials, lab references, and mentor support is provided for the duration specified at enrollment.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1F70F7] shrink-0 mt-0.5" />
                      <span><strong>Account Integrity:</strong> Sharing student portal credentials with external parties is strictly prohibited.</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h2 className="text-lg sm:text-xl font-black text-[#142B50] tracking-tight mb-3">
                    2. Intellectual Property & Materials
                  </h2>
                  <p className="text-xs sm:text-sm text-[#475467] leading-relaxed">
                    All training videos, architecture diagrams, project code repositories, assignment briefs, and downloadable resources provided by AutoOps School are protected by copyright and intellectual property laws. Content may not be redistributed, republished, or broadcast without prior written consent.
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h2 className="text-lg sm:text-xl font-black text-[#142B50] tracking-tight mb-3">
                    3. Practical Training & Career Guidance Commitment
                  </h2>
                  <p className="text-xs sm:text-sm text-[#475467] leading-relaxed">
                    AutoOps School provides practical, industry-focused technical education, interview preparation, resume reviews, and career guidance. While we actively mentor students to build real-world skills, we maintain transparent educational ethics and do not provide misleading fake placement guarantees.
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h2 className="text-lg sm:text-xl font-black text-[#142B50] tracking-tight mb-3">
                    4. Code of Conduct
                  </h2>
                  <p className="text-xs sm:text-sm text-[#475467] leading-relaxed">
                    Students are expected to maintain professional conduct during live Q&A sessions, collaborative project labs, and communications with mentors and peers.
                  </p>
                </div>
              </>
            )}

            {/* Direct Contact & Support Details */}
            <div className="border-t border-slate-200/90 pt-6 sm:pt-8 bg-slate-50/70 -mx-6 sm:-mx-10 lg:-mx-12 -mb-6 sm:-mb-10 lg:-mb-12 p-6 sm:p-10 rounded-b-2xl">
              <h3 className="text-sm sm:text-base font-bold text-[#142B50] mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1F70F7]" />
                <span>Questions or Policy Inquiries?</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#475467] leading-relaxed mb-4">
                If you have questions about our {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}, enrollment requirements, or data practices, our admissions team is here to assist you:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#475467]">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>Email: <a href="mailto:autoopsschool@gmail.com" className="text-[#1F70F7] hover:underline font-medium">autoopsschool@gmail.com</a></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>Phone: <a href="tel:+918072066014" className="text-[#1F70F7] hover:underline font-medium">+91 8072066014</a></span>
                </div>
                <div className="flex items-center gap-2.5 sm:col-span-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Location: Bengaluru, Karnataka, India · <a href="https://autoopsschool.in" target="_blank" rel="noreferrer" className="text-[#1F70F7] hover:underline">autoopsschool.in</a></span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default LegalPage;

