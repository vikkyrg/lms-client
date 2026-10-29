/**
 * Course pricing/type helpers.
 *
 * Everything is derived from the fields the backend returns for a course
 * (`price`, `discountPrice`, `isFree`) — no course data is hardcoded here.
 * The rules mirror the backend guards: a course is treated as free when it is
 * flagged `isFree` or its price resolves to zero (see enrollmentController
 * `/enrollments/free` and paymentController `/payments/create-order`).
 */
export const resolvePrice = (course) => {
  if (!course) return 0;
  if (course.isFree) return 0;
  const price = Number(course.price) || 0;
  const discount = Number(course.discountPrice) || 0;
  return discount > 0 ? discount : price;
};

export const isFreeCourse = (course) => resolvePrice(course) === 0;

export const formatCoursePrice = (course) => {
  const price = resolvePrice(course);
  if (price <= 0) return 'Free';
  return `₹${price.toLocaleString('en-IN')}`;
};

/**
 * Badge label used on course cards: "Free" or the formatted rupee price.
 */
export const courseTypeLabel = (course) => (isFreeCourse(course) ? 'Free' : 'Paid');

export const curriculumSummary = (course) => {
  const modules = Number(course?.moduleCount || 0);
  const lessons = Number(course?.lessonCount || 0);
  if (!modules) return 'Curriculum published by the instructor';
  return `${modules} modules • ${lessons} lessons`;
};

/**
 * Branded placeholder served from this app's own /public folder, used whenever a
 * course record has no (or an unloadable) thumbnail so no broken image ever shows.
 */
export const PLACEHOLDER_THUMBNAIL = '/course-placeholder.svg';

export const resolveThumbnailUrl = (url) => {
  if (!url || typeof url !== 'string' || !url.trim()) return PLACEHOLDER_THUMBNAIL;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  const apiBase = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/api\/v1\/?$/, '');
  if (trimmed.startsWith('/')) {
    return `${apiBase}${trimmed}`;
  }
  return `${apiBase}/${trimmed}`;
};

export const courseThumbnail = (course) => {
  return resolveThumbnailUrl(course?.thumbnail);
};
