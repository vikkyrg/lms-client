import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const projects = [
  ['Automated application delivery', 'Build a CI/CD pipeline that tests and deploys an application safely.', ['Git', 'Jenkins', 'Docker']],
  ['Containerized service platform', 'Package and run services consistently across development environments.', ['Docker', 'Linux']],
  ['Kubernetes deployment lab', 'Deploy a resilient application with services, configuration, and scaling.', ['Kubernetes', 'Docker']],
  ['Cloud infrastructure baseline', 'Define a repeatable cloud environment and document operational decisions.', ['AWS', 'Terraform']],
  ['Monitoring and troubleshooting', 'Create dashboards and alerts that support practical incident investigation.', ['Prometheus', 'Grafana']],
];

export const AboutPage = () => (
  <Marketing title="Practical learning for the work ahead">
    <p className="text-lg text-slate-600 max-w-3xl">AutoOps School is an IT training institute in Bengaluru focused on structured technical learning, hands-on practice, real-world projects, troubleshooting, interview preparation, resume guidance, and career development.</p>
    <div className="grid md:grid-cols-2 gap-6 mt-10">
      <Info title="Our vision">To become a trusted learning destination for aspiring IT professionals by making practical technical education accessible, relevant, and career-focused.</Info>
      <Info title="Our mission">Deliver structured, hands-on training; build problem-solving skills; and support learners with projects, interview preparation, resume guidance, and continuous learning.</Info>
    </div>
    <div className="mt-10 rounded-2xl bg-[#FFF2BF] p-6"><h2 className="font-bold text-[#173563]">Who we support</h2><p className="mt-2 text-slate-700">Fresh graduates, final-year students, beginners entering IT, career switchers, and IT professionals with 0–2 years of experience.</p></div>
    <p className="mt-8 text-slate-600">Founder: <strong className="text-[#173563]">Bhoomika R H</strong></p>
  </Marketing>
);

export const ProjectsPage = () => <Marketing title="Hands-on projects" intro="Practice with project scenarios that connect concepts to operational problem-solving."><Projects /></Marketing>;
export const CareerSupportPage = () => <Marketing title="Career preparation that stays practical"><div className="grid md:grid-cols-2 gap-4">{['Technical problem-solving', 'Troubleshooting practice', 'Interview preparation', 'Resume guidance', 'Mock interview preparation', 'Career development'].map(item => <div className="rounded-xl border border-slate-200 p-5 flex gap-3" key={item}><CheckCircle2 className="text-[#3F6FA8] shrink-0" /> <span>{item}</span></div>)}</div></Marketing>;
export const TestimonialsPage = () => <Marketing title="Learner stories"><p className="text-slate-600">Learner testimonials will appear here when approved content is available.</p></Marketing>;
export const FaqPage = () => <Marketing title="Frequently asked questions"><div className="space-y-4">{[['Who are the programs for?', 'Our programs are designed for students, fresh graduates, beginners, career switchers, and early-career IT professionals.'], ['How is training delivered?', 'Training is online. Other modes are subject to confirmation.'], ['Are placements guaranteed?', 'AutoOps School does not make placement or job-guarantee claims.']].map(([q, a]) => <Info key={q} title={q}>{a}</Info>)}</div></Marketing>;
export const LegalPage = ({ type }) => <Marketing title={type === 'privacy' ? 'Privacy Policy' : 'Terms and Conditions'}><p className="text-slate-600">This page is a placeholder for the final policy approved by AutoOps School. Please contact autoopsschool@gmail.com for policy questions.</p></Marketing>;

const Projects = () => <section className="mt-12"><h2 className="text-2xl font-bold text-[#173563]">Project practice</h2><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">{projects.map(([title, description, tools]) => <article key={title} className="rounded-2xl border border-slate-200 p-5"><h3 className="font-bold text-[#173563]">{title}</h3><p className="mt-2 text-sm text-slate-600">{description}</p><p className="mt-4 text-xs font-semibold text-[#3F6FA8]">{tools.join(' · ')}</p></article>)}</div></section>;
const Info = ({ title, children }) => <div className="rounded-2xl border border-slate-200 p-6"><h2 className="font-bold text-[#173563]">{title}</h2><p className="mt-2 text-slate-600">{children}</p></div>;
const Marketing = ({ title, intro, children }) => <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16"><div className="max-w-3xl mb-10"><p className="text-sm font-bold uppercase tracking-widest text-[#3F6FA8]">AutoOps School</p><h1 className="mt-2 text-4xl font-extrabold text-[#173563]">{title}</h1>{intro && <p className="mt-4 text-lg text-slate-600">{intro}</p>}</div>{children}<div className="mt-12"><Link to="/courses" className="inline-flex rounded-xl bg-[#173563] px-5 py-3 font-bold text-white">Explore courses</Link></div></div>;

export default Marketing;
