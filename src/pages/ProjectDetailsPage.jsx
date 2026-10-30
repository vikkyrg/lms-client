import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
  Target,
  FileCode,
  AlertCircle,
  BookOpen,
  FolderGit2,
  GraduationCap,
  ShieldCheck,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { PageHero, CtaBanner } from '../components/BrandComponents';

const ProjectDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const res = await api.get(`/projects/${slug}`);
        if (res.data?.project) {
          setProject(res.data.project);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#FAFBFD] min-h-screen py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-6 w-32 bg-gray-200 rounded-lg" />
            <div className="h-12 w-3/4 bg-gray-200 rounded-xl" />
            <div className="h-64 bg-gray-200 rounded-2xl" />
            <div className="h-32 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="bg-[#FAFBFD] min-h-screen py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#102747]">Project Not Found</h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-relaxed">
            The project you are looking for does not exist or is currently unpublished.
          </p>
          <Link
            to="/projects"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173563] text-white text-xs font-semibold hover:bg-[#102747] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Projects</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-[#344054]">
      {/* ========================================================================= */}
      {/* HERO SECTION — Matching Homepage Brand Palette                          */}
      {/* ========================================================================= */}
      <section className="bg-[#FFFCF7] border-b border-[#F0EBE1] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173563] hover:text-[#2B6FE0] transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Projects</span>
          </Link>

          <div className="max-w-4xl space-y-4">
            {/* Category and Difficulty Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF2FC] text-[#2B6FE0] border border-[#D5E4F7]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2B6FE0]" />
                <span>{project.category || 'Industry Project'}</span>
              </span>

              {project.difficulty && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FFF2BF] text-[#102747] border border-[#F4D36B]/60">
                  {project.difficulty} Level
                </span>
              )}

              {project.estimatedDuration && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-gray-600 border border-gray-200">
                  <Clock className="w-3.5 h-3.5 inline mr-1 text-[#3F6FA8]" />
                  {project.estimatedDuration}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#12294B] tracking-tight leading-[1.15]">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-[#475467] leading-relaxed font-normal">
              {project.shortDescription}
            </p>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Full Project Details */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Featured Image if present */}
            {project.image && (
              <div className="rounded-2xl overflow-hidden border border-gray-200/90 shadow-md">
                <img
                  src={project.image}
                  alt={project.imageAlt || project.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Overview / Detailed Description */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-8 shadow-xs space-y-4">
              <span className="text-xs uppercase tracking-widest font-extrabold text-[#3F6FA8] block">
                Project Architecture
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#173563]">
                Project Overview & Scope
              </h2>
              <div className="text-gray-600 leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line">
                {project.description || project.shortDescription}
              </div>
            </div>

            {/* Key Learning Outcomes */}
            {project.learningOutcomes && project.learningOutcomes.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200/90 p-8 shadow-xs space-y-4">
                <span className="text-xs uppercase tracking-widest font-extrabold text-[#3F6FA8] block">
                  Core Competencies
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#173563]">
                  What You Will Learn & Implement
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  {project.learningOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F3] border border-[#F0EBE1]">
                      <CheckCircle2 className="w-5 h-5 text-[#12B76A] mt-0.5 shrink-0 stroke-[2.2]" />
                      <span className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                        {outcome}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Objectives */}
            {project.objectives && project.objectives.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200/90 p-8 shadow-xs space-y-4">
                <span className="text-xs uppercase tracking-widest font-extrabold text-[#3F6FA8] block">
                  Milestones
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#173563]">
                  Project Objectives
                </h2>
                <ul className="space-y-3 pt-2">
                  {project.objectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#EAF2FC] text-[#2B6FE0] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {obj}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Right Column: Metadata & Action Card */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-[0_4px_20px_rgba(18,41,75,0.06)] space-y-6 sticky top-24">
              
              <div>
                <h3 className="text-lg font-extrabold text-[#102747]">Project Specifications</h3>
                <p className="text-xs text-gray-500 mt-1">Review tools and requirements before starting</p>
              </div>

              {/* Technologies Stack */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-xs uppercase tracking-wider font-extrabold text-[#3F6FA8] block mb-2.5">
                    Technologies & Tools
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold text-[#12294B] bg-[#FEF4D1] border border-[#F9E295] px-3 py-1 rounded-full shadow-2xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Prerequisites */}
              {project.prerequisites && (
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-xs uppercase tracking-wider font-extrabold text-[#3F6FA8] block mb-1.5">
                    Prerequisites
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {project.prerequisites}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Link
                  to="/courses"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#173563] hover:bg-[#102747] text-white font-bold py-3 px-5 rounded-xl text-xs sm:text-sm shadow-md transition"
                >
                  <span>Enroll to Build This Project</span>
                  <ArrowRight className="w-4 h-4 text-[#F4D36B]" />
                </Link>

                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#FAF8F3] hover:bg-[#F0EBE1] text-[#102747] border border-[#F0EBE1] font-semibold py-2.5 px-4 rounded-xl text-xs transition"
                >
                  <span>Talk to Course Advisor</span>
                </Link>
              </div>

            </div>

          </div>

        </div>
      </div>

      <CtaBanner
        title="Ready to Build Real-World Cloud Projects?"
        description="AutoOps School provides industry mentors, code reviews, and structured lab environments to master Cloud and DevOps."
        buttonText="View All Courses"
        buttonLink="/courses"
      />
    </div>
  );
};

export default ProjectDetailsPage;
