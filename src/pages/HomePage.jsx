import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import heroImg from '../assests/hero.png';
import {
  GraduationCap,
  Search,
  BookOpen,
  ArrowRight,
  Code2,
  Cpu,
  Monitor,
  Workflow
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

  const popularTags = [
    'DevOps Engineering',
    'Java Full Stack Development',
    'Python Full Stack Development'
  ];

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-[#344054]">
      {/* ========================================================================= */}
      {/* HERO SECTION                                                             */}
      {/* Exactly matching reference: Clean ivory background, centered text,       */}
      {/* prominent search bar, popular pills, mini value proposition row, and     */}
      {/* right-side student graphic composition with floating badge pills         */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF7] via-[#FFFDF9] to-[#FAFBFD] pt-8 sm:pt-14 pb-14 sm:pb-20 border-b border-gray-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-left space-y-6 animate-fade-in-up">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#E9EFF8] border border-[#D5E2F3] text-[#173563] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-2xs">
                <GraduationCap className="h-4 w-4 text-[#3F6FA8]" />
                <span>AutoOps School · Learn. Build. Automate.</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-black text-[#102747] tracking-tight leading-[1.15]">
                Build Practical IT Skills. <br className="hidden sm:inline" />
                Prepare for <span className="text-[#F4D36B] drop-shadow-2xs">Your Career.</span>
              </h1>

              {/* Subheading */}
              <p className="text-sm sm:text-base lg:text-lg text-[#344054] max-w-xl leading-relaxed font-normal">
                Learn industry-relevant technologies through structured training, hands-on projects, and practical problem-solving with AutoOps School.
              </p>

              {/* Search Bar matching reference */}
              <form onSubmit={handleSearchSubmit} className="pt-1">
                <div className="relative flex items-center bg-white rounded-2xl border border-gray-200/90 shadow-[0_8px_25px_rgba(23,53,99,0.06)] hover:border-[#3F6FA8] focus-within:border-[#173563] focus-within:ring-2 focus-within:ring-[#173563]/10 transition p-1.5 sm:p-2">
                  <Search className="h-5 w-5 text-gray-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search DevOps, Java Full Stack, or Python Full Stack..."
                    className="w-full px-3 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 bg-[#173563] hover:bg-[#102747] text-white font-semibold px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Popular Courses Pills matching reference */}
              <div className="pt-1 space-y-2">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Popular Courses:
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className="inline-flex items-center text-xs font-semibold text-[#102747] bg-[#FFF2BF] hover:bg-[#F4D36B] border border-[#F4D36B]/60 px-3.5 py-1.5 rounded-full transition shadow-2xs cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Feature Highlights in a Row (Structured Learning, Hands-on Projects, Practical Problem-Solving, Career Preparation) */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#E9EFF8] text-[#173563] flex items-center justify-center shrink-0">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#102747] leading-tight">Structured</div>
                    <div className="text-[10px] text-gray-500">Learning</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF2BF] text-[#102747] flex items-center justify-center shrink-0">
                    <Code2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#102747] leading-tight">Hands-on</div>
                    <div className="text-[10px] text-gray-500">Projects</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#E9EFF8] text-[#3F6FA8] flex items-center justify-center shrink-0">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#102747] leading-tight">Practical</div>
                    <div className="text-[10px] text-gray-500">Problem-Solving</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF2BF] text-[#173563] flex items-center justify-center shrink-0">
                    <Workflow className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#102747] leading-tight">Career</div>
                    <div className="text-[10px] text-gray-500">Preparation</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Graphic Column: Using user's hero.png image */}
            <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <img
                  src={heroImg}
                  alt="AutoOps School — Build Practical IT Skills"
                  className="w-full h-auto object-contain rounded-2xl drop-shadow-xl"
                />
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
              <div className="relative max-w-xs sm:max-w-sm">
                <img
                  src="/cta-graphic.png"
                  alt="AutoOps School Laptop Learning"
                  className="w-full h-auto object-contain drop-shadow-2xl"
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
