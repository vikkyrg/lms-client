import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import HeroBackgroundWaves from './HeroBackgroundWaves';
import { AnimatedSection } from './AnimatedSection';

/**
 * Standardized Page Hero Banner matching the AutoOps School brand design language:
 * - Professional two-column layout on desktop: Left 52%, Right 48%.
 * - Responsive clamp typography for headings and descriptions.
 * - Integrated feature highlights row.
 * - Optional primary and secondary CTA action buttons.
 * - Supports custom image or JSX on the right.
 * - Responsive full-viewport height calculation (min-h-[calc(100vh-5rem)] min-h-[calc(100svh-5rem)]).
 */
export const PageHero = ({
  badge,
  title,
  subtitle,
  image,
  imageAlt = "Hero Illustration",
  features = [],
  primaryCta,
  secondaryCta,
  children,
  className = '',
  waveVariant = 'default'
}) => {
  return (
    <div
      className={`relative bg-[#F8FAFD] border-b border-[#E5EDF6] py-10 sm:py-14 lg:py-16 min-h-[calc(100vh-5rem)] min-h-[calc(100svh-5rem)] flex items-center overflow-hidden ${className}`}
    >
      {/* Redesigned Modern Blue & Brand Accent Waves Background */}
      <HeroBackgroundWaves variant={waveVariant} />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full my-auto">
        {image ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Left Column: 52% on Desktop */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-5 max-w-2xl">
              {/* Eyebrow Badge */}
              {badge && (
                <div className="inline-flex items-center gap-2 bg-[#EBF3FE] border border-[#BFDBFE] text-[#1F70F7] px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-bold tracking-wide shadow-2xs">
                  <span>{badge}</span>
                </div>
              )}

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] font-black text-[#142B50] tracking-tight leading-[1.12]">
                {title}
              </h1>

              {/* Description */}
              {subtitle && (
                <p className="text-base sm:text-lg lg:text-[1.08rem] text-[#475467] leading-[1.68] font-normal">
                  {subtitle}
                </p>
              )}

              {/* Feature Highlights Row */}
              {features && features.length > 0 && (
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {features.map((item, idx) => {
                    const text = typeof item === 'string' ? item : item.text;
                    const Icon = typeof item === 'object' && item.icon ? item.icon : CheckCircle2;
                    return (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E4E7EC] text-xs font-semibold text-[#142B50] shadow-2xs"
                      >
                        <Icon className="w-3.5 h-3.5 text-[#3478F6] stroke-[2.2]" />
                        <span>{text}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* CTA Action Buttons */}
              {(primaryCta || secondaryCta) && (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {primaryCta && (
                    primaryCta.link?.startsWith('#') ? (
                      <a
                        href={primaryCta.link}
                        onClick={(e) => {
                          if (primaryCta.onClick) primaryCta.onClick(e);
                          const el = document.querySelector(primaryCta.link);
                          if (el) {
                            e.preventDefault();
                            el.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="inline-flex items-center justify-center gap-2 bg-[#142B50] hover:bg-[#10223d] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow-md transition-all duration-200 cursor-pointer group"
                      >
                        <span>{primaryCta.text}</span>
                        <ArrowRight className="w-4 h-4 text-[#FFD95A] transition group-hover:translate-x-0.5" />
                      </a>
                    ) : (
                      <Link
                        to={primaryCta.link || '/courses'}
                        onClick={primaryCta.onClick}
                        className="inline-flex items-center justify-center gap-2 bg-[#142B50] hover:bg-[#10223d] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow-md transition-all duration-200 cursor-pointer group"
                      >
                        <span>{primaryCta.text}</span>
                        <ArrowRight className="w-4 h-4 text-[#FFD95A] transition group-hover:translate-x-0.5" />
                      </Link>
                    )
                  )}
                  {secondaryCta && (
                    secondaryCta.link?.startsWith('http://') || secondaryCta.link?.startsWith('https://') ? (
                      <a
                        href={secondaryCta.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={secondaryCta.onClick}
                        className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#142B50] text-xs sm:text-sm font-bold px-5 py-3 rounded-xl border border-slate-300 shadow-2xs hover:shadow-xs transition duration-200 cursor-pointer"
                      >
                        <span>{secondaryCta.text}</span>
                      </a>
                    ) : secondaryCta.link?.startsWith('#') ? (
                      <a
                        href={secondaryCta.link}
                        onClick={(e) => {
                          if (secondaryCta.onClick) secondaryCta.onClick(e);
                          const el = document.querySelector(secondaryCta.link);
                          if (el) {
                            e.preventDefault();
                            el.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#142B50] text-xs sm:text-sm font-bold px-5 py-3 rounded-xl border border-slate-300 shadow-2xs hover:shadow-xs transition duration-200 cursor-pointer"
                      >
                        <span>{secondaryCta.text}</span>
                      </a>
                    ) : (
                      <Link
                        to={secondaryCta.link || '/contact'}
                        onClick={secondaryCta.onClick}
                        className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#142B50] text-xs sm:text-sm font-bold px-5 py-3 rounded-xl border border-slate-300 shadow-2xs hover:shadow-xs transition duration-200 cursor-pointer"
                      >
                        <span>{secondaryCta.text}</span>
                      </Link>
                    )
                  )}
                </div>
              )}

              {children && <div className="pt-2">{children}</div>}
            </div>

            {/* Right Column: 48% on Desktop */}
            <div className="lg:col-span-5 xl:col-span-5 w-full flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-lg lg:max-w-none transition-transform duration-300 ease-out hover:scale-[1.01] motion-reduce:hover:scale-100">
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-[#E9E4D8] bg-white">
                  <img
                    src={image}
                    alt={imageAlt}
                    className="w-full h-auto object-cover max-h-[360px] sm:max-h-[400px] lg:max-h-[440px] mx-auto select-none pointer-events-none block"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl space-y-5">
            {badge && (
              <div className="inline-flex items-center gap-2 bg-[#EBF3FE] border border-[#BFDBFE] text-[#1F70F7] px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-bold tracking-wide shadow-2xs mb-1">
                <span>{badge}</span>
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] font-black text-[#142B50] tracking-tight leading-[1.12]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-base sm:text-lg lg:text-[1.08rem] text-[#475467] leading-[1.68] font-normal">
                {subtitle}
              </p>
            )}

            {features && features.length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {features.map((item, idx) => {
                  const text = typeof item === 'string' ? item : item.text;
                  const Icon = typeof item === 'object' && item.icon ? item.icon : CheckCircle2;
                  return (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E4E7EC] text-xs font-semibold text-[#142B50] shadow-2xs"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#3478F6] stroke-[2.2]" />
                      <span>{text}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {(primaryCta || secondaryCta) && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {primaryCta && (
                  primaryCta.link?.startsWith('#') ? (
                    <a
                      href={primaryCta.link}
                      onClick={(e) => {
                        if (primaryCta.onClick) primaryCta.onClick(e);
                        const el = document.querySelector(primaryCta.link);
                        if (el) {
                          e.preventDefault();
                          el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="inline-flex items-center justify-center gap-2 bg-[#142B50] hover:bg-[#10223d] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow-md transition-all duration-200 cursor-pointer group"
                    >
                      <span>{primaryCta.text}</span>
                      <ArrowRight className="w-4 h-4 text-[#FFD95A] transition group-hover:translate-x-0.5" />
                    </a>
                  ) : (
                    <Link
                      to={primaryCta.link || '/courses'}
                      onClick={primaryCta.onClick}
                      className="inline-flex items-center justify-center gap-2 bg-[#142B50] hover:bg-[#10223d] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow-md transition-all duration-200 cursor-pointer group"
                    >
                      <span>{primaryCta.text}</span>
                      <ArrowRight className="w-4 h-4 text-[#FFD95A] transition group-hover:translate-x-0.5" />
                    </Link>
                  )
                )}
                {secondaryCta && (
                  secondaryCta.link?.startsWith('#') ? (
                    <a
                      href={secondaryCta.link}
                      onClick={(e) => {
                        if (secondaryCta.onClick) secondaryCta.onClick(e);
                        const el = document.querySelector(secondaryCta.link);
                        if (el) {
                          e.preventDefault();
                          el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#142B50] text-xs sm:text-sm font-bold px-5 py-3 rounded-xl border border-slate-300 shadow-2xs hover:shadow-xs transition duration-200 cursor-pointer"
                    >
                      <span>{secondaryCta.text}</span>
                    </a>
                  ) : (
                    <Link
                      to={secondaryCta.link || '/contact'}
                      onClick={secondaryCta.onClick}
                      className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#142B50] text-xs sm:text-sm font-bold px-5 py-3 rounded-xl border border-slate-300 shadow-2xs hover:shadow-xs transition duration-200 cursor-pointer"
                    >
                      <span>{secondaryCta.text}</span>
                    </Link>
                  )
                )}
              </div>
            )}

            {children && <div className="pt-2">{children}</div>}
          </div>
        )}
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
    <div className="relative overflow-hidden bg-gradient-to-r from-[#102747] via-[#173563] to-[#102747] py-14 sm:py-16 text-white border-t border-gray-800">
      <AnimatedSection direction="up" delay={50} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
          {title}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to={buttonLink}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F4D36B] hover:bg-[#ebd068] text-[#102747] font-bold text-sm shadow-md transition-all duration-200 cursor-pointer"
          >
            <span>{buttonText}</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
};
