import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import StudentTestimonials from '../components/StudentTestimonials';
import StudentVideoTestimonials from '../components/StudentVideoTestimonials';
import bgHero from '../assests/bg.png';
import bgmHero from '../assests/bgm.png';
import whyLearnImg from '../assests/why-learn.jpg';
import {
  GraduationCap,
  Search,
  BookOpen,
  ArrowRight,
  Code2,
  Cpu,
  Monitor,
  Workflow,
  Users,
  Award,
  Rocket,
  BarChart3,
  Cog,
  InfinityIcon,
  CheckCircle2
} from 'lucide-react';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeCourses = async () => {
      try {
        const res = await api.get('/courses?limit=6');
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error('Home load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeCourses();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/courses');
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/courses?search=${encodeURIComponent(tag)}`);
  };

  const popularCourses = [
    {
      title: 'DevOps Engineering',
      icon: <InfinityIcon className="w-3.5 h-3.5 stroke-[2.2]" />,
    },
    {
      title: 'Java Full Stack Development',
      icon: <Code2 className="w-3.5 h-3.5 stroke-[2.2]" />,
    },
    {
      title: 'Python Full Stack Development',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2c-3.1 0-5.8 1.4-6.8 3.5h3.6c2.7 0 4.9 2.2 4.9 4.9v1.2h2.5c2.7 0 4.9-2.2 4.9-4.9C21.1 4.2 17 2 12 2zm-1.8 2.5c.7 0 1.2.5 1.2 1.2 0 .7-.5 1.2-1.2 1.2-.7 0-1.2-.5-1.2-1.2 0-.7.5-1.2 1.2-1.2zM2.9 12.4c0 2.7 2.2 4.9 4.9 4.9h2.5v-1.2c0-2.7 2.2-4.9 4.9-4.9h3.6C17.8 9.1 15.1 7.7 12 7.7c-5 0-9.1 2.2-9.1 4.7zm8.3 6.7c-.7 0-1.2-.5-1.2-1.2 0-.7.5-1.2 1.2-1.2.7 0 1.2.5 1.2 1.2 0 .7-.5 1.2-1.2 1.2zM12 22c3.1 0 5.8-1.4 6.8-3.5h-3.6c-2.7 0-4.9-2.2-4.9-4.9v-1.2H7.8c-2.7 0-4.9 2.2-4.9 4.9 0 2.5 4.1 4.7 9.1 4.7z" />
        </svg>
      ),
    },
  ];

  const whyLearnFeatures = [
    {
      title: 'Industry-Ready Curriculum',
      description: 'Learn skills aligned with real-world industry requirements.',
    },
    {
      title: 'Hands-On Practical Training',
      description: 'Apply your knowledge through practical exercises and projects.',
    },
    {
      title: 'Expert Instructor Guidance',
      description: 'Get guidance and support from experienced industry professionals.',
    },
    {
      title: 'Learn at Your Own Pace',
      description: 'Access structured learning materials and progress at your convenience.',
    },
    {
      title: 'Real-World Project Experience',
      description: 'Build practical projects to strengthen your portfolio and technical skills.',
    },
    {
      title: 'Career-Focused Learning',
      description: 'Develop the confidence and knowledge needed for your next career opportunity.',
    },
  ];

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-[#344054]">
      {/* ========================================================================= */}
      {/* HERO SECTION — Seamless Full-Width Background Using bg.png / bgm.png    */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-[#FFFCF7] border-b border-[#F0EBE1]">
        
        {/* DESKTOP HERO (lg: 1024px and above) */}
        <div
          className="hidden lg:block w-full bg-cover bg-center bg-no-repeat pt-12 lg:pt-16 pb-16 lg:pb-20"
          style={{ backgroundImage: `url(${bgHero})` }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-12 gap-8 items-center min-h-[500px]">
              
              {/* Left Content Column (~55% width) */}
              <div className="col-span-7 text-left space-y-6 animate-fade-in-up z-10 max-w-2xl py-2">
                {/* Badge */}
                <div>
                  <div className="inline-flex items-center gap-2 bg-[#EAF2FC] border border-[#D0E2F6] text-[#12294B] px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-tight shadow-xs">
                    <GraduationCap className="h-4 w-4 text-[#2B5E9E] shrink-0" />
                    <span>AutoOps School · Learn. Build. Automate.</span>
                  </div>
                </div>

                {/* Main Heading */}
                <h1 className="text-[3.35rem] xl:text-[3.5rem] font-black text-[#12294B] tracking-[-0.03em] leading-[1.14]">
                  Build Practical <span className="text-[#2B6FE0]">IT Skills.</span> <br />
                  Prepare for <span className="text-[#F8D568]">Your Career.</span>
                </h1>

                {/* Subheading */}
                <p className="text-lg lg:text-[1.0625rem] text-[#475467] leading-relaxed max-w-xl font-normal">
                  Learn industry-relevant technologies through structured training, hands-on projects, and practical problem-solving with AutoOps School.
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="pt-0.5">
                  <div className="relative flex items-center bg-white rounded-2xl border border-[#E4E7EC] shadow-[0_4px_20px_rgba(18,41,75,0.06)] hover:border-[#CBD5E1] focus-within:border-[#12294B] focus-within:ring-2 focus-within:ring-[#12294B]/10 transition-all p-2 max-w-2xl">
                    <Search className="h-5 w-5 text-[#98A2B3] ml-3.5 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search DevOps, Java Full Stack, or Python Full Stack..."
                      className="w-full px-3 py-2 text-sm text-[#1D2939] placeholder-[#98A2B3] bg-transparent focus:outline-none font-normal"
                    />
                    <button
                      type="submit"
                      className="shrink-0 inline-flex items-center gap-1.5 bg-[#12294B] hover:bg-[#1B3765] text-white font-medium px-6 py-2.5 rounded-xl text-sm shadow-sm transition-colors cursor-pointer"
                    >
                      <span>Search</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                    </button>
                  </div>
                </form>

                {/* Popular Courses */}
                <div className="space-y-2 pt-0.5">
                  <div className="text-xs font-bold text-[#667085] uppercase tracking-wider">
                    POPULAR COURSES:
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {popularCourses.map((course) => (
                      <button
                        key={course.title}
                        type="button"
                        onClick={() => handleTagClick(course.title)}
                        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#12294B] bg-[#FEF4D1] hover:bg-[#FDECAE] border border-[#F9E295] px-3.5 py-1.5 rounded-full transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer"
                      >
                        <span className="text-[#12294B] shrink-0 opacity-80">{course.icon}</span>
                        <span>{course.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3 Compact Learning Benefits */}
                <div className="pt-4 border-t border-[#EAE4D7] grid grid-cols-3 gap-4 max-w-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#EAF2FC] text-[#2B6FE0] flex items-center justify-center shrink-0 border border-[#D5E4F7]">
                      <BookOpen className="h-4 w-4 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#12294B] leading-tight truncate">Structured</div>
                      <div className="text-[11px] text-[#667085] leading-tight">Learning Path</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#FEF4D1] text-[#A67B10] flex items-center justify-center shrink-0 border border-[#F9E295]">
                      <Code2 className="h-4 w-4 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#12294B] leading-tight truncate">Hands-on</div>
                      <div className="text-[11px] text-[#667085] leading-tight">Projects</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#EAF2FC] text-[#2B6FE0] flex items-center justify-center shrink-0 border border-[#D5E4F7]">
                      <BarChart3 className="h-4 w-4 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#12294B] leading-tight truncate">Career</div>
                      <div className="text-[11px] text-[#667085] leading-tight">Preparation</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Spacer for bg.png visual */}
              <div className="col-span-5 min-h-[480px] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* MOBILE & TABLET HERO (< 1024px) */}
        {/* Integrated hero section using bgm.png with natural aspect ratio */}
        <div className="block lg:hidden w-full relative">
          <div
            className="relative w-full max-w-[500px] mx-auto"
            style={{ aspectRatio: '940 / 1672' }}
          >
            {/* Full background image - complete, uncropped, natural aspect ratio */}
            <img
              src={bgmHero}
              alt="AutoOps School Hero Background"
              className="absolute inset-0 w-full h-full object-contain object-top pointer-events-none select-none"
              loading="eager"
            />

            {/* Hero text overlay positioned cleanly over the upper blank area */}
            <div className="relative z-10 px-4 min-[375px]:px-5 pt-3 min-[360px]:pt-4 min-[390px]:pt-5 sm:pt-7 text-left space-y-2 min-[360px]:space-y-2.5 min-[390px]:space-y-3">
              {/* Badge */}
              <div>
                <div className="inline-flex items-center gap-1.5 bg-[#EAF2FC]/95 border border-[#D0E2F6] text-[#12294B] px-2.5 py-0.5 rounded-full text-[11px] min-[360px]:text-[11.5px] font-medium tracking-tight shadow-xs">
                  <GraduationCap className="h-3.5 w-3.5 text-[#2B5E9E] shrink-0" />
                  <span>AutoOps School · Learn. Build. Automate.</span>
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="text-[21px] min-[360px]:text-[23px] min-[390px]:text-[25px] font-black text-[#12294B] tracking-tight leading-[1.18]">
                Build Practical <span className="text-[#2B6FE0]">IT Skills.</span> <br />
                Prepare for <span className="text-[#E5A800]">Your Career.</span>
              </h1>

              {/* Subheading / Description */}
              <p className="text-[12.5px] min-[360px]:text-[13px] min-[390px]:text-[13.5px] text-[#475467] leading-[1.38] font-normal max-w-[96%]">
                Learn industry-relevant technologies through structured training, hands-on projects, and practical problem-solving with AutoOps School.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="w-full pt-0.5">
                <div className="relative flex items-center bg-white rounded-xl border border-[#E4E7EC] shadow-[0_2px_10px_rgba(18,41,75,0.06)] hover:border-[#CBD5E1] focus-within:border-[#12294B] focus-within:ring-2 focus-within:ring-[#12294B]/10 transition-all p-1">
                  <Search className="h-4 w-4 text-[#98A2B3] ml-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search DevOps, Java Full Stack, or Python Full Stack..."
                    className="w-full min-w-0 px-2 py-1 text-[12px] min-[360px]:text-[13px] text-[#1D2939] placeholder-[#98A2B3] bg-transparent focus:outline-none font-normal"
                  />
                  <button
                    type="submit"
                    className="shrink-0 inline-flex items-center gap-1 bg-[#12294B] hover:bg-[#1B3765] text-white font-medium px-3 py-1.5 rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3 h-3 stroke-[2.2]" />
                  </button>
                </div>
              </form>

              {/* Popular Courses */}
              <div className="space-y-1.5 pt-0.5">
                <div className="text-[10px] min-[360px]:text-[10.5px] font-bold text-[#667085] uppercase tracking-wider">
                  POPULAR COURSES:
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {popularCourses.map((course) => (
                    <button
                      key={course.title}
                      type="button"
                      onClick={() => handleTagClick(course.title)}
                      className="inline-flex items-center gap-1 text-[10.5px] min-[360px]:text-[11px] font-medium text-[#12294B] bg-[#FEF4D1] hover:bg-[#FDECAE] border border-[#F9E295] px-2.5 py-0.5 rounded-full transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] cursor-pointer"
                    >
                      <span className="text-[#12294B] shrink-0 opacity-80">{course.icon}</span>
                      <span className="whitespace-nowrap">{course.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* STATS SECTION                                                            */}
      {/* 4 numeric stats with circular icons: Learners Trained, DevOps Courses,   */}
      {/* Industry Experience, Hands-On Learning                                   */}
      {/* ========================================================================= */}
      <section className="bg-[#FAF8F3] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6 text-center">
            {/* 1. Learners Trained */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-[0_4px_16px_rgba(18,41,75,0.08)] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#2B6FE0] stroke-[2.2]" />
              </div>
              <div className="text-2xl sm:text-[1.75rem] font-extrabold text-[#12294B] tracking-tight leading-tight">100+</div>
              <div className="text-xs sm:text-sm text-[#667085]">Learners Trained</div>
            </div>

            {/* 2. DevOps Courses */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-[0_4px_16px_rgba(18,41,75,0.08)] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#12B76A] stroke-[2.2]" />
              </div>
              <div className="text-2xl sm:text-[1.75rem] font-extrabold text-[#12294B] tracking-tight leading-tight">10+</div>
              <div className="text-xs sm:text-sm text-[#667085]">DevOps Courses</div>
            </div>

            {/* 3. Industry Experience */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-[0_4px_16px_rgba(18,41,75,0.08)] flex items-center justify-center">
                <Award className="w-5 h-5 text-[#F04438] stroke-[2.2]" />
              </div>
              <div className="text-2xl sm:text-[1.75rem] font-extrabold text-[#12294B] tracking-tight leading-tight">4+ Years</div>
              <div className="text-xs sm:text-sm text-[#667085]">Industry Experience</div>
            </div>

            {/* 4. Hands-On Learning */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-[0_4px_16px_rgba(18,41,75,0.08)] flex items-center justify-center">
                <Rocket className="w-5 h-5 text-[#F5A623] stroke-[2.2]" />
              </div>
              <div className="text-2xl sm:text-[1.75rem] font-extrabold text-[#12294B] tracking-tight leading-tight">100%</div>
              <div className="text-xs sm:text-sm text-[#667085]">Hands-On Learning</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* WHY LEARN WITH US SECTION                                                 */}
      {/* Official AutoOps School Brand Styling: Navy, Gold, Cream, Slate            */}
      {/* ========================================================================= */}
      <section className="bg-white py-14 sm:py-16 lg:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Learners Image (4:3 aspect ratio, rounded-2xl, natural shadow) */}
            <div className="lg:col-span-6 w-full">
              <div className="relative overflow-hidden rounded-[20px] shadow-[0_10px_30px_rgba(16,39,71,0.08)] border border-gray-100">
                <img
                  src={whyLearnImg}
                  alt="AutoOps School Learners collaborating in modern technology training environment"
                  className="w-full aspect-[4/3] object-cover block"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Column: Content */}
            <div className="lg:col-span-6 space-y-5 text-left">
              {/* Section Badge: Soft Cream (#FFF2BF) with Deep Navy (#102747) text */}
              <div>
                <span className="inline-block bg-[#FFF2BF] text-[#102747] border border-[#F4D36B]/60 text-xs font-bold px-3.5 py-1 rounded-full tracking-wide shadow-2xs">
                  Why Learn With Us
                </span>
              </div>

              {/* Main Heading: Primary Navy (#173563) with Warm Gold (#F4D36B / #C99718) highlight */}
              <h2 className="text-2xl sm:text-3xl lg:text-[2.35rem] font-extrabold text-[#173563] tracking-tight leading-[1.2]">
                Learn In-Demand Skills. Build <span className="text-[#C99718] font-black">Real-World Expertise.</span>
              </h2>

              {/* Description: Slate Text (#344054) */}
              <p className="text-[#344054] text-sm sm:text-[15px] leading-relaxed font-normal">
                Our industry-focused training programs combine expert guidance, practical projects, and structured learning to help you master the skills that matter. Learn at your own pace, gain hands-on experience, and build the confidence to succeed in your tech career.
              </p>

              {/* 6 Features in 2-column grid on desktop/tablet, 1-col on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-1">
                {whyLearnFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#173563] shrink-0 stroke-[2.2] mt-0.5" />
                    <div>
                      <h4 className="text-sm sm:text-[14.5px] font-bold text-[#173563] leading-snug">
                        {feature.title}
                      </h4>
                      <p className="text-xs sm:text-[13px] text-[#344054] leading-relaxed mt-0.5">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button: Primary Navy (#173563), Warm Gold (#F4D36B) arrow, Deep Navy hover (#102747) */}
              <div className="pt-2">
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#173563] hover:bg-[#102747] text-white font-semibold text-sm sm:text-[15px] px-6 py-3 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 group cursor-pointer"
                >
                  <span>Explore Our Courses</span>
                  <ArrowRight className="w-4 h-4 text-[#F4D36B] transition-transform group-hover:translate-x-1 stroke-[2.2]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURED COURSES SECTION                                                 */}
      {/* "Explore Popular Courses" with "View All Courses ->" top right link       */}
      {/* Real dynamic courses loaded from backend API                             */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-extrabold text-[#3F6FA8]">
              Featured Courses
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#102747] tracking-tight mt-1">
              Explore Popular Courses
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
              Build practical skills with structured learning paths designed for real-world technology careers.
            </p>
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#173563] hover:text-[#102747] border border-gray-300 hover:border-[#173563] px-4 py-2 rounded-xl transition shadow-2xs shrink-0"
          >
            <span>View All Courses</span>
            <ArrowRight className="h-4 w-4 text-[#3F6FA8]" />
          </Link>
        </div>

        {/* Dynamic Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4 animate-pulse">
                <div className="aspect-[16/9] bg-gray-100 rounded-xl" />
                <div className="h-5 bg-gray-100 rounded-md w-3/4" />
                <div className="h-4 bg-gray-100 rounded-md w-full" />
                <div className="h-10 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-gray-300 p-8 shadow-2xs">
            <BookOpen className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">No published courses available</h3>
            <p className="text-xs text-gray-500 mt-1">
              Admin published courses will appear here dynamically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {courses.slice(0, 3).map((course, idx) => (
              <CourseCard key={course._id || idx} course={course} featured={true} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* WHY CHOOSE AUTOOPS SCHOOL SECTION                                        */}
      {/* Exactly as in reference: "WHY CHOOSE AUTOOPS SCHOOL / Learn Skills That  */}
      {/* Matter" with clean 4 horizontal benefit items                            */}
      {/* ========================================================================= */}
      <section className="bg-[#FFFDF7] border-y border-[#F4D36B]/30 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest font-extrabold text-[#3F6FA8]">
              Why Choose AutoOps School
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#102747] tracking-tight mt-1">
              Learn Skills That Matter
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Benefit 1 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#E9EFF8] text-[#173563] flex items-center justify-center shrink-0 shadow-2xs">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-[#102747]">
                  Industry-Relevant Curriculum
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Learn the latest technologies used in real-world environments.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFF2BF] text-[#102747] flex items-center justify-center shrink-0 shadow-2xs">
                <Monitor className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-[#102747]">
                  Hands-On Learning
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Practice with real-world projects and practical scenarios.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#E9EFF8] text-[#3F6FA8] flex items-center justify-center shrink-0 shadow-2xs">
                <Workflow className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-[#102747]">
                  Structured Learning Paths
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Step-by-step learning for better understanding and confidence.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFF2BF] text-[#173563] flex items-center justify-center shrink-0 shadow-2xs">
                <Cpu className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-[#102747]">
                  Career-Focused Training
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Build problem-solving skills and prepare for technical interviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DYNAMIC STUDENT TESTIMONIALS SECTION                                     */}
      {/* Placed immediately after "Why Choose AutoOps School"                     */}
      {/* ========================================================================= */}
      <StudentTestimonials />

      {/* ========================================================================= */}
      {/* DYNAMIC STUDENT VIDEO TESTIMONIALS SECTION                               */}
      {/* Placed immediately after Student Testimonials                            */}
      {/* ========================================================================= */}
      <StudentVideoTestimonials />

      {/* ========================================================================= */}
      {/* CALL TO ACTION SECTION                                                   */}
      {/* Dark navy banner matching reference with yellow CTA button & graphic      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#102747] via-[#173563] to-[#102747] rounded-3xl p-8 sm:p-14 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Start Building Your IT Skills Today
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed">
                Explore courses, learn practical technologies, and build your career with AutoOps School.
              </p>
              <div className="pt-2">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2.5 bg-[#F4D36B] hover:bg-[#ebd068] text-[#102747] font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition transform hover:-translate-y-0.5"
                >
                  <span>Explore All Courses</span>
                  <ArrowRight className="h-4 w-4 text-[#102747]" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
                <img
                  src="/cta-graphic.png"
                  alt="AutoOps School DevOps & IT Skills Platform"
                  className="w-full h-auto object-contain rounded-2xl drop-shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
