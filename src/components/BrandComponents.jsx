import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Standardized Page Hero Banner matching the AutoOps School brand design language:
 * - Eyebrow in warm gold / cream pill or supporting blue
 * - Crisp bold heading in Deep Navy #102747
 * - Subtitle in Slate Text #475467
 * - Soft cream / warm gold / slate subtle borders
 */
export const PageHero = ({
  badge,
  title,
  subtitle,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-[#FFFCF7] border-b border-[#F0EBE1] py-12 sm:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {badge && (
            <div className="inline-flex items-center gap-2 bg-[#FFF2BF] border border-[#F4D36B]/60 text-[#102747] px-3.5 py-1 rounded-full text-xs font-bold tracking-wide shadow-2xs mb-4">
              <span>{badge}</span>
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-[#102747] tracking-tight leading-[1.2]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-base sm:text-lg text-[#475467] leading-relaxed font-normal">
              {subtitle}
            </p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </div>
  );
};

/**
 * Reusable AutoOps School CTA Banner matching the homepage's high-converting dark navy banner
 */
export const CtaBanner = ({
  title = "Start Building Your IT Skills Today",
  description = "Explore courses, learn practical technologies, and build your career with AutoOps School.",
  buttonText = "Explore All Courses",
  buttonLink = "/courses"
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#102747] via-[#173563] to-[#102747] rounded-3xl p-8 sm:p-14 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-block text-xs uppercase tracking-widest font-extrabold text-[#F4D36B]">
              Ready to take the next step?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed">
              {description}
            </p>
            <div className="pt-2">
              <Link
                to={buttonLink}
                className="inline-flex items-center gap-2.5 bg-[#F4D36B] hover:bg-[#ebd068] text-[#102747] font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{buttonText}</span>
                <ArrowRight className="h-4 w-4 text-[#102747] stroke-[2.2]" />
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
  );
};

