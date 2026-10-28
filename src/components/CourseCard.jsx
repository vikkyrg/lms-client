import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Layers, ArrowRight } from 'lucide-react';
import {
  courseThumbnail,
  formatCoursePrice,
  isFreeCourse,
  PLACEHOLDER_THUMBNAIL
} from '../utils/courseAccess';

/**
 * Course card matching the reference image layout and styling:
 * - Rounded modern card with clean border
 * - Top thumbnail with Free / Paid pill badge
 * - Bold title
 * - Description (clamp)
 * - Metadata row: Modules count & Self-paced duration
 * - Action button: "View Course ->"
 */
const CourseCard = ({ course, featured = false }) => {
  const free = isFreeCourse(course);
  const thumbnailSrc = courseThumbnail(course);
  const moduleCount = Number(course?.moduleCount || (Array.isArray(course?.modules) ? course.modules.length : 0)) || 0;
  const duration = course?.duration || 'Self-paced';

  return (
    <div className="group bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Thumbnail */}
      <Link
        to={`/courses/${course.slug || course._id}`}
        className="relative block aspect-[16/9] w-full overflow-hidden bg-gray-100"
      >
        <img
          src={thumbnailSrc}
          alt={course.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER_THUMBNAIL;
          }}
        />

        {/* Free / Paid pill badge in the top right - styled exactly as reference */}
        <div className="absolute top-3 right-3 z-10">
          {free ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F6E7] text-[#1E7E34] border border-[#C3E6CB] shadow-xs">
              Free
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF2BF] text-[#102747] border border-[#F4D36B] shadow-xs">
              Paid · {formatCoursePrice(course)}
            </span>
          )}
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-[#102747] group-hover:text-[#173563] transition text-base sm:text-lg leading-snug line-clamp-2 min-h-[2.8rem]">
            <Link to={`/courses/${course.slug || course._id}`}>
              {course.title}
            </Link>
          </h3>

          <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
            {course.shortDescription || course.description}
          </p>

          {/* Module & Duration Meta */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-[#3F6FA8]" />
              {moduleCount > 0 ? `${moduleCount} Modules` : 'Modular Path'}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#3F6FA8]" />
              {duration}
            </span>
          </div>
        </div>

        {/* Button */}
        <div className="mt-5">
          <Link
            to={`/courses/${course.slug || course._id}`}
            className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition duration-200 ${
              featured
                ? 'bg-[#173563] hover:bg-[#102747] text-white shadow-xs'
                : 'bg-[#F2F5F9] hover:bg-[#173563] text-[#173563] hover:text-white'
            }`}
          >
            <span>View Course</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
