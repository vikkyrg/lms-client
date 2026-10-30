import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import { Search, Filter, BookOpen, ArrowUpDown, GraduationCap, X } from 'lucide-react';
import { CtaBanner } from '../components/BrandComponents';

const CourseCatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || '';
  const selectedLevel = searchParams.get('level') || '';
  const selectedType = searchParams.get('isFree') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortOption = searchParams.get('sort') || '';

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedLevel) params.append('level', selectedLevel);
      if (selectedType) params.append('isFree', selectedType);
      if (searchQuery) params.append('search', searchQuery);
      if (sortOption) params.append('sort', sortOption);

      const res = await api.get(`/courses?${params.toString()}`);
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const selectedCategoryValue = (() => {
    if (!selectedCategory) return '';
    const match = categories.find((c) =>
      c._id === selectedCategory
      || c.slug === selectedCategory
      || (c.name || '').toLowerCase() === selectedCategory.toLowerCase()
    );
    return match ? match._id : selectedCategory;
  })();

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    selectedCategory || selectedLevel || selectedType || searchQuery || sortOption
  );

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-[#344054]">
      {/* ========================================================================= */}
      {/* HERO SECTION — Matching AutoOps School Homepage Design                   */}
      {/* ========================================================================= */}
      <section className="bg-[#FFFCF7] border-b border-[#F0EBE1] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FFF2BF] border border-[#F4D36B]/60 text-[#102747] px-3.5 py-1 rounded-full text-xs font-bold tracking-wide shadow-2xs">
              <GraduationCap className="h-4 w-4 text-[#173563] shrink-0" />
              <span>Training Programs · Industry Curriculum</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#12294B] tracking-tight leading-[1.15]">
              Explore <span className="text-[#2B6FE0]">All Courses</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#475467] leading-relaxed font-normal">
              Structured IT training programs in DevOps Engineering, Java Full Stack Development, and Python Full Stack Development designed for real-world technology careers.
            </p>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FILTER & SEARCH BAR SECTION                                              */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Unified Search & Filters Card */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-[0_4px_20px_rgba(18,41,75,0.04)] space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            
            {/* Search Input Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by title, technology, or topic..."
                value={searchQuery}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-[#1D2939] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#173563]/10 focus:border-[#173563] transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => updateFilter('search', '')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Category */}
              <select
                value={selectedCategoryValue}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#173563]/10 focus:border-[#173563] transition cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Level */}
              <select
                value={selectedLevel}
                onChange={(e) => updateFilter('level', e.target.value)}
                className="px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#173563]/10 focus:border-[#173563] transition cursor-pointer"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              {/* Pricing Type */}
              <select
                value={selectedType}
                onChange={(e) => updateFilter('isFree', e.target.value)}
                className="px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#173563]/10 focus:border-[#173563] transition cursor-pointer"
              >
                <option value="">All Pricing</option>
                <option value="true">Free Only</option>
                <option value="false">Paid Only</option>
              </select>

              {/* Sort */}
              <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-2.5 py-1">
                <ArrowUpDown className="h-4 w-4 text-gray-400 shrink-0" />
                <select
                  value={sortOption}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="py-1.5 pr-2 bg-transparent text-xs sm:text-sm text-gray-700 focus:outline-none cursor-pointer"
                >
                  <option value="">Default Sorting</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-3.5 py-2.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

          </div>

          {/* Active status indicators */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 font-medium pt-2 border-t border-gray-100">
            <span>
              Showing <span className="font-bold text-[#102747]">{courses.length}</span> {courses.length === 1 ? 'course' : 'courses'}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COURSES GRID                                                             */}
        {/* ========================================================================= */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4 animate-pulse">
                <div className="aspect-[16/9] bg-gray-100 rounded-xl" />
                <div className="h-5 bg-gray-100 rounded-md w-3/4" />
                <div className="h-4 bg-gray-100 rounded-md w-full" />
                <div className="h-10 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-gray-300 p-8 shadow-2xs max-w-lg mx-auto">
            <BookOpen className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#102747]">No courses found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Try adjusting your search query, selecting different categories, or clearing filters.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-4 px-5 py-2 rounded-xl text-xs font-semibold bg-[#173563] text-white hover:bg-[#102747] transition cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {courses.map((course) => (
              <CourseCard key={course._id || course.slug} course={course} />
            ))}
          </div>
        )}

      </div>

      {/* Global CTA Banner */}
      <CtaBanner
        title="Ready to Build Real-World IT Skills?"
        description="Enroll in a structured training program with hands-on projects, industry curriculum, and interview preparation."
        buttonText="Contact Course Advisor"
        buttonLink="/contact"
      />
    </div>
  );
};

export default CourseCatalogPage;
