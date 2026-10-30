import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  ArrowRight,
  MessageSquare,
  BookOpen,
  DollarSign,
  Award,
  Laptop,
  CheckCircle2,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { PageHero, CtaBanner } from '../components/BrandComponents';
import { AnimatedSection } from '../components/AnimatedSection';

const CATEGORIES = [
  'All',
  'Fees & Pricing',
  'Payment Plans',
  'Course Prerequisites',
  'Course Access & Recordings',
  'Certificates',
  'Enrollment & Support'
];

const categoryIcons = {
  'Fees & Pricing': DollarSign,
  'Payment Plans': DollarSign,
  'Course Prerequisites': Laptop,
  'Course Access & Recordings': BookOpen,
  'Certificates': Award,
  'Enrollment & Support': HelpCircle
};

const FALLBACK_FAQS = [
  {
    category: 'Fees & Pricing',
    question: 'What is the fee for each course?',
    answer: 'Course fees vary depending on the selected course and learning program. Visit the Courses page to view the current pricing and course details.',
    displayOrder: 1
  },
  {
    category: 'Fees & Pricing',
    question: 'Are there any additional charges?',
    answer: 'All applicable fees and additional charges should be clearly displayed before enrollment.',
    displayOrder: 2
  },
  {
    category: 'Payment Plans',
    question: 'Do you offer installment payment options?',
    answer: 'Payment plan availability depends on the course. Contact our team for information about available installment options.',
    displayOrder: 1
  },
  {
    category: 'Payment Plans',
    question: 'Can I pay the course fee in installments?',
    answer: 'If installment options are available for your selected course, the payment schedule will be shared during enrollment.',
    displayOrder: 2
  },
  {
    category: 'Course Prerequisites',
    question: 'Do I need prior technical knowledge to join?',
    answer: 'Prerequisites depend on the selected course. Beginner-friendly courses may not require prior technical experience.',
    displayOrder: 1
  },
  {
    category: 'Course Prerequisites',
    question: 'Do I need a laptop?',
    answer: 'A laptop or desktop is recommended for practical technical training. Specific system requirements depend on the course.',
    displayOrder: 2
  },
  {
    category: 'Course Access & Recordings',
    question: 'Will I get access to recorded sessions?',
    answer: 'Recording availability depends on the course and its learning format.',
    displayOrder: 1
  },
  {
    category: 'Course Access & Recordings',
    question: 'How long can I access the recordings?',
    answer: 'The recording access period should be displayed in the relevant course details.',
    displayOrder: 2
  },
  {
    category: 'Certificates',
    question: 'Will I receive a certificate after completing the course?',
    answer: 'Certificate eligibility depends on the course completion requirements.',
    displayOrder: 1
  },
  {
    category: 'Certificates',
    question: 'Is the certificate provided digitally?',
    answer: 'Certificate format and delivery details should be specified in the course information.',
    displayOrder: 2
  },
  {
    category: 'Enrollment & Support',
    question: 'How do I enroll in a course?',
    answer: 'Browse our course catalog, choose your desired course, and complete the enrollment steps online or reach out via our Contact page for guided registration.',
    displayOrder: 1
  },
  {
    category: 'Enrollment & Support',
    question: 'How can I get technical or mentor support during my learning journey?',
    answer: 'Enrolled students can reach their instructor and teaching assistants directly through our student portal, community channels, and scheduled live mentoring sessions.',
    displayOrder: 2
  }
];

const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState(new Set());

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/faqs');
        if (res.data?.faqs && res.data.faqs.length > 0) {
          setFaqs(res.data.faqs);
          const initialOpen = new Set(res.data.faqs.slice(0, 2).map((f) => f._id || f.question));
          setOpenIds(initialOpen);
        } else {
          setFaqs(FALLBACK_FAQS);
          setOpenIds(new Set(['What is the fee for each course?', 'Do you offer installment payment options?']));
        }
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setFaqs(FALLBACK_FAQS);
        setOpenIds(new Set(['What is the fee for each course?', 'Do you offer installment payment options?']));
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleAccordion = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    const all = new Set(filteredFaqs.map((f) => f._id || f.question));
    setOpenIds(all);
  };

  const collapseAll = () => {
    setOpenIds(new Set());
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        faq.category?.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        faq.question?.toLowerCase().includes(q) ||
        faq.answer?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const groupedFaqs = useMemo(() => {
    if (selectedCategory !== 'All') {
      return { [selectedCategory]: filteredFaqs };
    }
    const groups = {};
    CATEGORIES.filter((c) => c !== 'All').forEach((cat) => {
      groups[cat] = [];
    });
    filteredFaqs.forEach((faq) => {
      const cat = faq.category || 'General';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(faq);
    });
    return groups;
  }, [filteredFaqs, selectedCategory]);

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-[#344054]">
      {/* Brand Hero Banner */}
      <PageHero
        badge="Knowledge Base"
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about AutoOps School's training programs, learning mode, prerequisites, recordings, and career guidance."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* Search Input Box */}
        <AnimatedSection direction="up" delay={50} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions by topic, fees, certificates, or prerequisites..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#173563]/10 focus:border-[#173563] shadow-xs transition-all duration-200"
            />
          </div>
        </AnimatedSection>

        {/* Category Filter Pills */}
        <AnimatedSection direction="up" delay={100} className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            const Icon = categoryIcons[category];
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#173563] text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:text-[#173563] hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5 stroke-[2.2]" />}
                <span>{category}</span>
              </button>
            );
          })}
        </AnimatedSection>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200 text-xs sm:text-sm text-gray-500 font-medium mb-8">
          <div>
            Showing <strong className="text-[#102747]">{filteredFaqs.length}</strong> questions
            {selectedCategory !== 'All' && <span> in <strong className="text-[#2B6FE0]">{selectedCategory}</strong></span>}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={expandAll}
              className="font-bold text-[#173563] hover:text-[#2B6FE0] transition cursor-pointer"
            >
              Expand All
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={collapseAll}
              className="font-bold text-gray-500 hover:text-gray-800 transition cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Accordions List */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-gray-200 p-6 h-20 animate-pulse" />
              ))}
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center max-w-md mx-auto shadow-2xs">
              <HelpCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="font-bold text-[#102747] text-base">No Matching Questions</h3>
              <p className="text-xs text-gray-500 mt-1">Try searching with different keywords or switch categories.</p>
            </div>
          ) : (
            Object.entries(groupedFaqs).map(([categoryName, groupItems], catIdx) => {
              if (!groupItems || groupItems.length === 0) return null;
              return (
                <AnimatedSection key={categoryName} direction="up" delay={catIdx * 60} className="space-y-4">
                  {selectedCategory === 'All' && (
                    <div className="flex items-center gap-2 pt-2">
                      <span className="h-4 w-1 bg-[#F4D36B] rounded-full" />
                      <h2 className="text-base sm:text-lg font-extrabold text-[#102747]">
                        {categoryName}
                      </h2>
                    </div>
                  )}

                  <div className="space-y-3">
                    {groupItems.map((faq) => {
                      const id = faq._id || faq.question;
                      const isOpen = openIds.has(id);

                      return (
                        <div
                          key={id}
                          className={`bg-white rounded-2xl border transition-all duration-300 shadow-2xs overflow-hidden ${
                            isOpen
                              ? 'border-[#173563]/30 shadow-xs ring-1 ring-[#173563]/10'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleAccordion(id)}
                            className="w-full text-left px-5 sm:px-6 py-4.5 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                            aria-expanded={isOpen}
                          >
                            <span className="font-bold text-sm sm:text-base text-[#102747] leading-snug">
                              {faq.question}
                            </span>
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                                isOpen
                                  ? 'bg-[#FFF2BF] text-[#102747] rotate-180'
                                  : 'bg-gray-50 text-gray-400'
                              }`}
                            >
                              <ChevronDown className="w-4 h-4 stroke-[2.2]" />
                            </div>
                          </button>

                          {/* Smooth Accordion Content Animation */}
                          <div
                            style={{
                              maxHeight: isOpen ? '500px' : '0px',
                              opacity: isOpen ? 1 : 0,
                              transition: 'max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-in-out',
                            }}
                            className="overflow-hidden bg-[#FAFBFD]/60"
                          >
                            <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                              <p className="whitespace-pre-line">{faq.answer}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AnimatedSection>
              );
            })
          )}
        </div>

      </div>

      <CtaBanner
        title="Still Have Questions About Our Programs?"
        description="Our admissions team is available via email or WhatsApp to clarify prerequisites, fees, and syllabus details."
        buttonText="Contact Course Advisor"
        buttonLink="/contact"
      />
    </div>
  );
};

export default FaqPage;
