import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import { Search, Filter, BookOpen, ArrowUpDown } from 'lucide-react';

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

  // Filter links may use a category id, slug or name — the API resolves all
  // three, and the dropdown is synced to the matching option.
  const selectedCategoryValue = (() => {
    if (!selectedCategory) return '';
    const match = categories.find((c) =>
      c._id === selectedCategory
      || c.slug === selectedCategory
      || (c.name || '').toLowerCase() === selectedCategory.toLowerCase()
    );
    return match ? match._id : selectedCategory;
  })();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Catalog Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Explore All Courses</h1>
        <p className="text-sm text-gray-600 mt-1">
          Handcrafted curriculums taught by industry specialists to elevate your engineering career.
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-200">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses by title or topic..."
            value={searchQuery}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <ArrowUpDown className="h-4 w-4 text-gray-500" />
          <select
            value={sortOption}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Sort by: Newest</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 h-fit">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
              <Filter className="h-4 w-4 text-indigo-600" /> Filters
            </h3>
            {(selectedCategory || selectedLevel || selectedType || searchQuery) && (
              <button
                onClick={() => setSearchParams({})}
                className="text-xs text-indigo-600 hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">Category</label>
            <select
              value={selectedCategoryValue}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">Skill Level</label>
            <div className="space-y-2 text-sm text-gray-700">
              {['Beginner', 'Intermediate', 'Advanced', 'All Levels'].map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="level"
                    checked={selectedLevel === level}
                    onChange={() => updateFilter('level', level)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">Price Type</label>
            <div className="space-y-2 text-sm text-gray-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priceType"
                  checked={selectedType === ''}
                  onChange={() => updateFilter('isFree', '')}
                  className="text-indigo-600"
                />
                <span>All Courses</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priceType"
                  checked={selectedType === 'true'}
                  onChange={() => updateFilter('isFree', 'true')}
                  className="text-indigo-600"
                />
                <span>Free Courses</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priceType"
                  checked={selectedType === 'false'}
                  onChange={() => updateFilter('isFree', 'false')}
                  className="text-indigo-600"
                />
                <span>Paid / Premium</span>
              </label>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-80" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900">No courses match your filter</h3>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search criteria or clearing filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCatalogPage;

