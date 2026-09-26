"use client";

import React, { useState, useEffect, useRef } from 'react';
import profilePic from '../img/zero_bg.png';
import go2Media from '../media_sources/rl-blind-go2/artifact_go2.gif';
import nav2Media from '../media_sources/nav2-auto-nav/path-planning-cover.png';
import ur10Media from '../media_sources/hrl-bd-spot/image1.png';
import spotMedia from '../media_sources/hrl-bd-spot/image27.png';
import multiRobotMedia from '../media_sources/hrl-bd-spot/image2.png';
import depthCover from '../media_sources/rgb-depth/depth-cover.png';
import depthInput from '../media_sources/rgb-depth/orig-_in.png';
import depthOutput from '../media_sources/rgb-depth/depth_out.png';
import {
  LuExternalLink as ExternalLinkIcon,
  LuMail as Mail,
  LuLinkedin as Linkedin,
  LuGithub as GithubIcon,
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
  LuLayers as LayersIcon,
  LuX as CloseIcon,
  LuUser as UserIcon,
  LuUsers as UsersIcon,
  LuMaximize2 as MaximizeIcon,
  LuPlay as PlayIcon,
  LuBriefcaseBusiness as BriefcaseIcon,
  LuGraduationCap as GraduationCapIcon,
  LuDownload as DownloadIcon,
} from 'react-icons/lu';

// TypeScript interfaces for project data and props
export interface Project {
  id: string;
  title: string;
  category: 'Solo' | 'Group';
  subtitle?: string;
  overview: string;
  summaryPoints: string[];
  fullDetails: string[];
  metrics?: string;
  role?: string[];
  githubUrl: string;
  youtubeUrl: string;
  image?: string;
  tags: string[];
  mediaFolder?: string;
  detailImages?: {
    src: string;
    alt: string;
    caption: string;
  }[];
}

export interface Achievement {
  title: string;
  description: string;
  date: string;
  link?: string;
  youtube: string;
  image: string;
}

interface PortfolioProps {
  projects: Project[];
  achievements: Achievement[];
}

const Portfolio: React.FC<PortfolioProps> = ({ projects, achievements }) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const [activeTab, setActiveTab] = useState('#hero');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFilter, setProjectFilter] = useState<'All' | 'Solo' | 'Group'>('All');
  const navRef = useRef<HTMLDivElement>(null);
  const navSelectionLock = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navItems = [
    { name: 'Home', href: '#hero' },
    { name: 'About Me', href: '#about-me' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Projects', href: '#projects' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (navSelectionLock.current) return;
      let currentActive = navItems[0].href;
      for (const item of navItems) {
        const section = document.querySelector(item.href) as HTMLElement;
        if (section) {
          const rect = section.getBoundingClientRect();
          // Check if the section's top is past the middle of the viewport
          if (rect.top <= window.innerHeight / 2) {
            currentActive = item.href;
          }
        }
      }
      setActiveTab(currentActive);
    };
    
    // Set initial active tab on mount
    handleScroll();

    const releaseNavSelectionLock = () => {
      if (navSelectionLock.current) {
        clearTimeout(navSelectionLock.current);
        navSelectionLock.current = null;
        handleScroll();
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scrollend', releaseNavSelectionLock);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scrollend', releaseNavSelectionLock);
    };
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const activeLink = navRef.current?.querySelector(`a[href="${activeTab}"]`) as HTMLElement;
      if (activeLink) {
        setIndicatorStyle({
          left: activeLink.offsetLeft,
          width: activeLink.offsetWidth,
        });
      }
    };
    
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab]);

  // Lock body scroll and listen for Escape key when island modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setActiveTab(href);
    if (navSelectionLock.current) clearTimeout(navSelectionLock.current);
    // Keep the clicked item active through the smooth-scroll transition so the
    // indicator does not briefly jump through intermediate sections.
    navSelectionLock.current = setTimeout(() => {
      navSelectionLock.current = null;
    }, 2500);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const nextAchievement = () => {
    setCurrentAchievementIndex((prevIndex) => (prevIndex + 1) % achievements.length);
  };

  const prevAchievement = () => {
    setCurrentAchievementIndex((prevIndex) => (prevIndex - 1 + achievements.length) % achievements.length);
  };

  // Autoplay functionality for carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAchievementIndex((prevIndex) => (prevIndex + 1) % achievements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [achievements.length]);

  const filteredProjects = projects.filter((p) => {
    if (projectFilter === 'All') return true;
    return p.category === projectFilter;
  });
  const projectCounts = {
    All: projects.length,
    Solo: projects.filter((project) => project.category === 'Solo').length,
    Group: projects.filter((project) => project.category === 'Group').length,
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    try {
      const parsedUrl = new URL(url);
      const videoId = parsedUrl.hostname.includes('youtu.be')
        ? parsedUrl.pathname.slice(1)
        : parsedUrl.searchParams.get('v') ?? parsedUrl.pathname.split('/').pop();
      return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0` : null;
    } catch {
      return null;
    }
  };

  const getYoutubeThumbnailUrl = (url: string) => {
    const embedUrl = getYoutubeEmbedUrl(url);
    const videoId = embedUrl?.split('/embed/')[1]?.split('?')[0];
    return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans text-slate-200">
      {/* Navigation - Occupies entire width of container, no visible borders */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-slate-950/90 backdrop-blur-lg flex justify-center">
        <div className="w-full max-w-5xl flex relative" ref={navRef}>
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`flex-1 text-center py-5 text-sm uppercase tracking-widest font-semibold transition duration-300 ${
                activeTab === item.href ? 'text-[#00ffd0]' : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              {item.name}
            </a>
          ))}
          {/* Moving Aqua Green Line */}
          <span
            className="absolute bottom-0 h-[3px] bg-[#00ffd0] transition-all duration-300 ease-out"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          ></span>
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="w-full max-w-5xl flex flex-col gap-12 relative z-10 px-6 pt-24 pb-12">
        {/* Hero Section */}
        <section id="hero" className="flex flex-col items-center justify-center w-full min-h-[70vh] relative overflow-hidden rounded-3xl border border-emerald-300/10 bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,0.16),transparent_48%),linear-gradient(135deg,rgba(30,41,59,0.9),rgba(2,6,23,0.88)_55%,rgba(6,78,59,0.3))] pt-10">
          <img src={profilePic.src} alt="Profile Photo" className="max-h-48 rounded-full mb-8" />
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white">Sai Siddartha Alleni</h1>
            <p className="mt-3 text-xl font-medium text-emerald-300">Robotics Software Engineer</p>
            <p className="mt-3 text-base text-slate-300 max-w-2xl mx-auto">M.Eng. in Robotics from Purdue University, building reliable, learning-enabled autonomous systems.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {['Reinforcement Learning', 'Robot Perception', 'Autonomous Navigation'].map((specialty) => (
                <span key={specialty} className="rounded-full border border-emerald-300/25 bg-slate-950/40 px-3 py-1 text-[11px] font-mono tracking-wide text-emerald-200">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={`${basePath}/Sai-Siddartha-Alleni-Resume.pdf`} download className="inline-flex items-center gap-2 rounded-xl bg-[#00ffd0] px-4 py-2.5 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-[#00ffd0] focus:ring-offset-2 focus:ring-offset-slate-950">
              <DownloadIcon className="h-4 w-4" />
              Download résumé
            </a>
            <a href="mailto:allenisaisiddartha@gmail.com" className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/40 bg-slate-950/40 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition-colors hover:border-[#00ffd0] hover:text-[#00ffd0] focus:outline-none focus:ring-2 focus:ring-[#00ffd0] focus:ring-offset-2 focus:ring-offset-slate-950">
              <Mail className="h-4 w-4" />
              Contact me
            </a>
          </div>
          <footer className="flex justify-center w-full mt-7">
            <div className="flex flex-row gap-6">
              <a href="https://www.linkedin.com/in/sai-siddartha-alleni" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400 scale-125 transition-transform hover:scale-150">
                <Linkedin />
              </a>
              <a href="https://github.com/siddartha00" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400 scale-125 transition-transform hover:scale-150">
                <GithubIcon />
              </a>
              <a href="mailto:allenisaisiddartha@gmail.com" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400 scale-125 transition-transform hover:scale-150">
                <Mail />
              </a>
            </div>
          </footer>
        </section>

        {/* About Me Section */}
        <section id="about-me" className="flex flex-col gap-6 py-20 min-h-[50vh] justify-center">
          <h2 className="text-3xl font-bold text-white mb-2 text-center md:text-left">About Me</h2>
          <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-xl border border-slate-800/50 w-full">
            <p className="text-slate-400 leading-relaxed text-lg">
             Robotics Software Engineer with an M.Eng. in Robotics from Purdue University, specializing in reinforcement learning for legged locomotion, robot perception, and autonomous navigation. I train parallelized policies in Isaac Lab and PyTorch, build ROS 2 navigation systems, and design dependable coordination layers for real-world robots. My work focuses on sim-to-real transfer, computer vision, and robot learning.
            </p>
          </div>
        </section>

        {/* Experience & Education */}
        <section className="flex flex-col gap-6 py-20 min-h-[50vh] justify-center">
          <div className="flex items-center gap-3">
            <BriefcaseIcon className="h-6 w-6 text-[#00ffd0]" />
            <h2 className="text-3xl font-bold text-white">Experience & Education</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-xl border border-slate-800/70 bg-slate-900/50 p-6 backdrop-blur-sm">
              <p className="font-mono text-xs uppercase tracking-widest text-[#00ffd0]">Experience</p>
              <div className="mt-5 border-l border-emerald-500/30 pl-5">
                <h3 className="text-lg font-bold text-white">Visteon Corporation</h3>
                <p className="mt-1 text-sm text-emerald-300">Software Engineer · Jul 2023 – Jul 2024</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">Built tooling used by five teams, maintained QNX automotive middleware CI/CD, recovered 3% CPU utilization, and validated DDS communication with automated testing.</p>
                <p className="mt-4 text-sm text-slate-300">Software Engineering Intern · Jan 2023 – Jun 2023</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">Developed 11 Clang-Tidy safety checks and a CMake-integrated static-analysis workflow for QNX firmware.</p>
              </div>
            </article>
            <article className="rounded-xl border border-slate-800/70 bg-slate-900/50 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <GraduationCapIcon className="h-5 w-5 text-[#00ffd0]" />
                <p className="font-mono text-xs uppercase tracking-widest text-[#00ffd0]">Education</p>
              </div>
              <div className="mt-5 border-l border-emerald-500/30 pl-5">
                <h3 className="text-lg font-bold text-white">Purdue University</h3>
                <p className="mt-1 text-sm text-emerald-300">Master of Engineering in Robotics · Jul 2024 – May 2026</p>
                <p className="mt-4 text-sm font-medium text-slate-300">Vellore Institute of Technology</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">Bachelor of Technology in Electronics and Communication · Jul 2019 – Jun 2023</p>
              </div>
            </article>
          </div>
        </section>

        {/* Achievements Section */}
        <section id="achievements" className="flex flex-col gap-6 py-20 min-h-[50vh] justify-center w-full">
          <h2 className="text-3xl font-bold text-white mb-2 text-center md:text-left">Achievements</h2>
          <div className="relative w-full overflow-hidden bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out w-full"
              style={{ transform: `translateX(-${currentAchievementIndex * 100}%)` }}
            >
              {achievements.map((achievement, index) => {
                const achievementVideo = getYoutubeEmbedUrl(achievement.youtube);
                return (
                  <div key={index} className="w-full flex-shrink-0 p-8 md:p-12">
                    <div className="flex flex-col items-center text-center group">
                      {(achievementVideo || achievement.image) && (
                        <div className="mb-6 aspect-video w-full max-w-3xl overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950 shadow-lg">
                          {achievementVideo ? (
                            <iframe
                              src={achievementVideo}
                              title={`${achievement.title} video`}
                              className="h-full w-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          ) : (
                            <img src={achievement.image} alt={achievement.title} className="h-full w-full object-cover" />
                          )}
                        </div>
                      )}
                      <span className="text-[#00ffd0] font-mono text-sm mb-4 bg-[#00ffd0]/10 px-4 py-1 rounded-full">{achievement.date}</span>
                      {achievement.link ? (
                        <a href={achievement.link} target="_blank" rel="noopener noreferrer" className="text-2xl font-bold text-white mb-4 flex items-center gap-2 hover:text-[#00ffd0] transition-colors duration-300">
                          {achievement.title}
                          <ExternalLinkIcon className="w-6 h-6" />
                        </a>
                      ) : (
                        <h3 className="text-2xl font-bold text-white mb-4">{achievement.title}</h3>
                      )}
                      <p className="text-slate-400 leading-relaxed text-lg max-w-3xl group-hover:text-slate-300 transition-colors duration-300">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Carousel Controls */}
            <button 
              onClick={prevAchievement}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 hover:text-[#00ffd0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00ffd0]/50"
              aria-label="Previous Achievement"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextAchievement}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 hover:text-[#00ffd0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00ffd0]/50"
              aria-label="Next Achievement"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {achievements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAchievementIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    currentAchievementIndex === index ? 'bg-[#00ffd0]' : 'bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section - Compact Vertical Tiles with Island Modal */}
        <section id="projects" className="py-20 min-h-[70vh] w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white text-center sm:text-left">Projects</h2>
              <p className="text-slate-400 text-sm mt-1 text-center sm:text-left">Click any project tile to view the complete technical details</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center justify-center sm:justify-end gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl">
              {(['All', 'Solo', 'Group'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setProjectFilter(filter)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    projectFilter === filter
                      ? 'bg-[#00ffd0]/20 text-[#00ffd0] border border-[#00ffd0]/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {filter} ({projectCounts[filter]})
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-5 w-full">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group relative flex flex-col sm:flex-row bg-slate-900/50 hover:bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 hover:border-[#00ffd0]/40 rounded-xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(0,255,208,0.08)] cursor-pointer"
              >
                {/* Subtle hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.03] to-[#00ffd0]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Left Side: Compact Project Photo / Preview */}
                <div className="relative w-full sm:w-56 md:w-64 aspect-video sm:aspect-auto sm:h-auto min-h-[140px] md:min-h-[150px] bg-slate-950/80 shrink-0 overflow-hidden flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-800/60">
                  {getYoutubeThumbnailUrl(project.youtubeUrl) ? (
                    <>
                      <img src={getYoutubeThumbnailUrl(project.youtubeUrl)!} alt={`${project.title} video preview`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/25 transition-colors group-hover:bg-slate-950/10">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-slate-950/75 text-[#00ffd0] shadow-lg"><PlayIcon className="ml-0.5 h-5 w-5" /></span>
                      </div>
                    </>
                  ) : project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-600 group-hover:text-emerald-400/80 transition-colors">
                      <LayersIcon className="w-8 h-8 mb-1 stroke-[1.5]" />
                      <span className="text-[10px] uppercase tracking-widest font-mono text-slate-500">Preview</span>
                    </div>
                  )}

                  {/* Category Pill on Image */}
                  <span
                    className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1 text-[11px] font-medium font-mono px-2 py-0.5 rounded-md backdrop-blur-md ${
                      project.category === 'Solo'
                        ? 'bg-slate-950/80 text-[#00ffd0] border border-[#00ffd0]/30'
                        : 'bg-slate-950/80 text-amber-300 border border-amber-400/30'
                    }`}
                  >
                    {project.category === 'Solo' ? <UserIcon className="w-3 h-3" /> : <UsersIcon className="w-3 h-3" />}
                    {project.category}
                  </span>
                </div>

                {/* Right Side: Project Summary & Actions */}
                <div className="relative z-10 flex-1 p-4 md:p-5 flex flex-col justify-between">
                  <div>
                    {/* Top line: Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      {project.tags.slice(0, 3).map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 text-emerald-300/90 border border-emerald-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 text-slate-500">
                          +{project.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Compact Title */}
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-[#00ffd0] transition-colors duration-300 flex items-center gap-2">
                      <span>{project.title}</span>
                    </h3>

                    {project.metrics && (
                      <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-lg border border-emerald-500/20 bg-slate-950/50 px-2.5 py-1 text-xs">
                        <span className="font-mono uppercase tracking-wide text-slate-500">Outcome</span>
                        <span className="truncate font-mono font-semibold text-[#00ffd0]">{project.metrics}</span>
                      </div>
                    )}

                    {/* Compact 2-bullet Overview */}
                    <ul className="space-y-1.5 text-slate-300/85 text-xs md:text-sm leading-relaxed">
                      {project.summaryPoints.map((point, pointIdx) => (
                        <li key={pointIdx} className="flex items-start gap-2">
                          <span className="text-[#00ffd0] mt-0.5 text-xs shrink-0 select-none">▸</span>
                          <span className="line-clamp-2">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Bar: Island Modal Trigger + Available External Links */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 group-hover:text-[#00ffd0] transition-colors"
                    >
                      <MaximizeIcon className="w-3.5 h-3.5" />
                      <span>Full Details & Architecture</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 hover:border-[#00ffd0]/50 text-xs font-medium transition-all duration-200 group/btn" aria-label={`GitHub repository for ${project.title}`}>
                          <GithubIcon className="w-3.5 h-3.5 text-emerald-400 group-hover/btn:text-[#00ffd0] transition-colors" />
                          <span>GitHub</span>
                          <ExternalLinkIcon className="w-3 h-3 opacity-60 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-all" />
                        </a>
                      )}
                      {project.youtubeUrl && (
                        <a href={project.youtubeUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 hover:border-red-400/60 text-xs font-medium transition-all duration-200" aria-label={`YouTube video for ${project.title}`}>
                          <span>Video</span>
                          <ExternalLinkIcon className="w-3 h-3 opacity-60" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ==========================================
          Island-Style Modal Window for Full Details
          ========================================== */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-950/80 backdrop-blur-md transition-all duration-300"
          onClick={() => setSelectedProject(null)}
        >
          {/* Island Modal Card */}
          <div
            className="relative w-full max-w-3xl max-h-[88vh] overflow-hidden bg-slate-900/95 border border-slate-700/90 rounded-2xl p-6 md:p-8 shadow-2xl shadow-cyan-950/40 text-slate-200 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="custom-scrollbar -mr-3 max-h-[calc(88vh-3rem)] overflow-y-auto pr-3 md:-mr-4 md:max-h-[calc(88vh-4rem)] md:pr-4">
              <div className="flex flex-col gap-6">
            {/* Header: Type Badge, Institution & Close Button */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-0.5 rounded-md ${
                      selectedProject.category === 'Solo'
                        ? 'bg-[#00ffd0]/10 text-[#00ffd0] border border-[#00ffd0]/30'
                        : 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
                    }`}
                  >
                    {selectedProject.category === 'Solo' ? <UserIcon className="w-3 h-3" /> : <UsersIcon className="w-3 h-3" />}
                    {selectedProject.category} Project
                  </span>
                  <span className="text-xs font-mono text-slate-400">• Purdue University</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">
                  {selectedProject.title}
                </h3>
                {selectedProject.subtitle && (
                  <p className="text-sm text-emerald-300/90 font-medium">
                    {selectedProject.subtitle}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700 shrink-0"
                aria-label="Close island window"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Key Metric Highlight */}
            {selectedProject.metrics && (
              <div className="bg-slate-950/70 border border-emerald-500/20 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Key Performance Metric</span>
                <span className="text-sm font-mono font-bold text-[#00ffd0]">{selectedProject.metrics}</span>
              </div>
            )}

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap gap-2">
              {selectedProject.tags.map((tag, tagIdx) => (
                <span
                  key={tagIdx}
                  className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800/90 text-emerald-300 border border-emerald-500/25"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Project Video */}
            {getYoutubeEmbedUrl(selectedProject.youtubeUrl) && (
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950 shadow-lg">
                <iframe
                  src={getYoutubeEmbedUrl(selectedProject.youtubeUrl)!}
                  title={`${selectedProject.title} video`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}

            {selectedProject.detailImages && selectedProject.detailImages.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-widest font-mono text-slate-400 mb-3">Input & Predicted Output</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedProject.detailImages.map((image) => (
                    <figure key={image.alt} className="overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950/70">
                      <img src={image.src} alt={image.alt} className="aspect-video w-full object-cover" />
                      <figcaption className="border-t border-slate-800 px-3 py-2 text-xs text-slate-400">{image.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {/* Project Overview */}
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/60">
              <h4 className="text-xs uppercase tracking-widest font-mono text-slate-400 mb-2">Project Overview</h4>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                {selectedProject.overview}
              </p>
            </div>

            {/* Comprehensive Technical Highlights */}
            <div>
              <h4 className="text-xs uppercase tracking-widest font-mono text-slate-400 mb-3">Key Technical Highlights & Implementation</h4>
              <ul className="space-y-2.5 text-sm md:text-base text-slate-300 leading-relaxed">
                {selectedProject.fullDetails.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-[#00ffd0] mt-1 text-sm shrink-0 select-none">▸</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specific Group Project Role & Contribution (if applicable) */}
            {selectedProject.role && selectedProject.role.length > 0 && (
              <div className="bg-emerald-950/20 border-l-4 border-[#00ffd0] p-4 rounded-r-xl">
                <h4 className="text-xs uppercase tracking-widest font-mono text-[#00ffd0] font-semibold mb-2">My Role & Specific Contributions</h4>
                <ul className="space-y-2 text-sm text-slate-300 leading-relaxed">
                  {selectedProject.role.map((r, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2">
                      <span className="text-[#00ffd0] mt-1 text-xs shrink-0 select-none">✔</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-2">
              <div className="flex flex-wrap gap-2">
                {selectedProject.githubUrl && (
                  <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-[#00ffd0]/50 hover:shadow-[0_0_15px_rgba(0,255,208,0.2)] text-sm font-medium transition-all">
                    <GithubIcon className="w-4 h-4 text-[#00ffd0]" />
                    <span>View on GitHub</span>
                    <ExternalLinkIcon className="w-4 h-4 opacity-70" />
                  </a>
                )}
                {selectedProject.youtubeUrl && (
                  <a href={selectedProject.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-red-400/60 text-sm font-medium transition-all">
                    <span>Watch video</span>
                    <ExternalLinkIcon className="w-4 h-4 opacity-70" />
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// Real Projects Data (Purdue University: Solo & Group Projects)
// =========================================================================
const mockProjects: Project[] = [
  // --- Solo Projects ---
  {
    id: "quadruped-blind-locomotion",
    title: "Quadruped Blind Locomotion via Asymmetric Actor-Critic",
    category: "Solo",
    subtitle: "Proprioceptive terrain walking on Unitree Go2 with NVIDIA Isaac Lab",
    overview: "Trained an asymmetric actor-critic PPO policy for Unitree Go2 blind locomotion across seven terrain types in GPU-parallel Isaac Lab simulation.",
    summaryPoints: [
      "Trained across 2,000 parallel environments for blind locomotion over seven terrain types.",
      "Reached 90% velocity-tracking accuracy while reducing command error to ±0.1 m/s."
    ],
    fullDetails: [
      "Trained an asymmetric actor-critic PPO policy across 2,000 parallel Isaac Lab environments for blind locomotion on seven terrain types.",
      "Designed a LiDAR-based observation space with proprioceptive state history, reducing velocity command error to ±0.1 m/s across randomized friction and motor dynamics.",
      "Applied domain randomization across terrain geometry, body mass, and joint damping to improve physical-transfer generalization.",
      "Optimized GPU-parallel simulation to achieve 3× faster iteration cycles than single-environment baselines."
    ],
    metrics: "90% Velocity Tracking across 7 Terrains",
    githubUrl: "https://github.com/siddartha00/go2_blindWalk",
    youtubeUrl: "https://youtu.be/WDvUrUKvsgQ",
    mediaFolder: "media_sources/rl-blind-go2",
    image: go2Media.src,
    tags: ["Isaac Lab", "Unitree Go2", "PPO", "Reinforcement Learning", "Isaac Sim", "Python"]
  },
  // {
  //   id: "so-arm-moveit2-control",
  //   title: "Sim-to-Sim SO-ARM Manipulation via ROS 2 & MoveIt 2",
  //   category: "Solo",
  //   subtitle: "Containerized robotic arm manipulation and classical CV perception",
  //   overview: "Sim-to-sim manipulation pipeline controlling a SO-ARM manipulator in Isaac Sim with MoveIt 2 inside Docker, using camera intrinsics and Behavior Trees for deterministic pick-and-place execution.",
  //   summaryPoints: [
  //     "Controlled simulated SO-ARM in Isaac Sim with MoveIt 2 running inside a Docker container.",
  //     "Employed classical CV and camera intrinsics with Behavior Trees for deterministic pick-and-place grasping."
  //   ],
  //   fullDetails: [
  //     "Controlled a SO-ARM manipulator simulated in Isaac Sim to execute pick-and-place tasks using MoveIt 2 motion planning.",
  //     "Containerized the ROS 2 and MoveIt 2 planning stack inside Docker for reproducible simulation execution.",
  //     "Estimated precise 3D object grasping poses using classical computer vision pipelines and calibrated camera intrinsics.",
  //     "Architected high-level task execution with ROS 2 Node Lifecycles and Behavior Trees to ensure deterministic, fault-tolerant state transitions."
  //   ],
  //   metrics: "Deterministic Behavior Tree State Execution",
  //   githubUrl: "https://github.com/siddartha00/so-arm-ros2-moveit2",
  //   image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  //   tags: ["ROS 2", "MoveIt 2", "Isaac Sim", "Docker", "Behavior Trees", "Computer Vision", "C++"]
  // },
  {
    id: "autonomous-slam-frontier-nav2",
    title: "Autonomous Frontier Exploration & SLAM with Nav2",
    category: "Solo",
    subtitle: "Occupancy grid frontier exploration and obstacle-aware navigation",
    overview: "ROS 2 Navigation2 system combining SLAM Toolbox, LiDAR, and Gazebo for real-time mapping, planning, and obstacle avoidance.",
    summaryPoints: [
      "Built real-time occupancy-grid mapping and A* path planning with Nav2 and SLAM Toolbox.",
      "Configured behavior-tree recovery, DWB obstacle avoidance, and EKF sensor fusion."
    ],
    fullDetails: [
      "Developed a full ROS 2 Navigation2 stack with SLAM Toolbox for real-time occupancy-grid mapping and A* path planning.",
      "Configured a behavior-tree recovery system and DWB local planner for dynamic obstacle avoidance at 200 Hz.",
      "Integrated LiDAR scan matching with EKF sensor fusion for reliable localization in feature-sparse environments."
    ],
    metrics: "200 Hz Dynamic Obstacle Avoidance",
    githubUrl: "https://github.com/siddartha00/AutoNavData",
    youtubeUrl:"",
    mediaFolder: "media_sources/nav2-auto_nav",
    image: nav2Media.src,
    tags: ["ROS 2", "Nav2", "SLAM", "OpenCV", "Gazebo", "Autonomous Navigation", "Python"]
  },
  {
    id: "depth-estimation-vision-transformers",
    title: "Marigold Depth Replica: Relative-Depth Estimation",
    category: "Solo",
    subtitle: "PyTorch Lightning implementation adapting Stable Diffusion 2 for monocular relative depth",
    overview: "Research implementation of diffusion-based monocular relative-depth estimation inspired by Marigold. The pipeline adapts the Stable Diffusion 2 latent-diffusion backbone to predict relative scene depth from a single RGB image.",
    summaryPoints: [
      "Adapted a Stable Diffusion 2 U-Net from 4 to 8 input channels for depth-conditioned denoising.",
      "Used DDIM inference to decode a single-channel relative-depth map from an RGB image."
    ],
    fullDetails: [
      "Reused pretrained Stable Diffusion 2 components: a frozen VAE encodes both RGB images and normalized relative-depth targets into latent tensors.",
      "Concatenated the noisy depth latent with the image latent to create an 8-channel input for a modified U-Net, initialized from the original Stable Diffusion input weights.",
      "Trained the depth-conditioned denoiser to predict injected Gaussian noise using mean-squared error.",
      "Ran DDIM inference to iteratively denoise a random depth latent, then decoded it into a single-channel relative-depth visualization.",
      "Prepared Virtual KITTI-style RGB/depth pairs at 512 × 512 with percentile-normalized depth targets; outputs represent relative scene structure, not calibrated metric distance."
    ],
    metrics: "8-Channel U-Net + DDIM Relative-Depth Inference",
    githubUrl: "https://github.com/siddartha00/marigoldDepthReplica.git",
    mediaFolder: "media_sources/rgb-depth",
    youtubeUrl: "",
    image: depthCover.src,
    detailImages: [
      { src: depthInput.src, alt: "Foggy driving scene RGB input", caption: "RGB input image" },
      { src: depthOutput.src, alt: "Predicted relative-depth map for the driving scene", caption: "Predicted relative depth" }
    ],
    tags: ["PyTorch Lightning", "Stable Diffusion 2", "DDIM", "Virtual KITTI 2", "Monocular Depth"]
  },
  
  // --- Group Projects ---
  {
    id: "ur10-realworld-sorting-servoing",
    title: "Real-World UR10 Sorting & Visual Servoing",
    category: "Group",
    subtitle: "Industrial manipulator vision-guided sorting with Intel RealSense",
    overview: "Physical sorting workcell programmed on a UR10 industrial manipulator utilizing Intel RealSense 3D camera intrinsics and contour detection for real-time visual servoing.",
    summaryPoints: [
      "Programmed physical UR10 industrial robot arm for automated object sorting with Intel RealSense.",
      "Implemented contour-based orientation extraction and visual servoing with <2% failure rate."
    ],
    fullDetails: [
      "Programmed a physical UR10 industrial robot arm to autonomously sort objects in real-world workspace environments.",
      "Extracted accurate real-world 3D coordinates using Intel RealSense depth sensing and calibrated camera intrinsic matrices.",
      "Applied classical computer vision contour analysis to compute object area, centroid, and bounding orientation in real-time.",
      "Implemented closed-loop visual servoing to dynamically align the gripper with object orientation, achieving <2% sorting failure rate."
    ],
    role: [
      "Implemented a computer-vision pipeline to detect using contours and group them based on the area.",
      "Programmed an algorithm for real world co-ordinates of the objects using realsense intrinsic and extrinsic co-ordinates.",
      "Applied tranformation matrices to get the object co-ordinates with respect to the robot base for picking up the object."
    ],
    metrics: "<2% Sorting Failure Rate in Physical Tests",
    githubUrl: "",
    youtubeUrl:"https://youtu.be/X9wfPik49sg",
    image: ur10Media.src,
    mediaFolder: "",
    tags: ["UR10", "Intel RealSense", "Visual Servoing", "OpenCV", "Robotics", "Python"]
  },
  {
    id: "hrl-spot-navigation-door-manipulation",
    title: "Hierarchical RL Navigation & Door Manipulation on Spot",
    category: "Group",
    subtitle: "Multi-policy HRL collision avoidance and vision-guided door opening on Boston Dynamics Spot",
    overview: "Hierarchical Reinforcement Learning framework coordinating Boston Dynamics Spot quadruped base locomotion, collision avoidance, and arm manipulation to detect, open, and navigate through doors.",
    summaryPoints: [
      "Multi-policy HRL coordinating Spot quadruped locomotion, obstacle avoidance, and arm door opening.",
      "YOLO11 + PCA orientation estimation for door handle grasping with 60% end-to-end success rate."
    ],
    fullDetails: [
      "Hierarchical Reinforcement Learning (HRL) architecture coordinating low-level locomotion primitives (walking, turning) to navigate toward target poses on Boston Dynamics Spot.",
      "Trained Soft Actor-Critic (SAC) HRL policy to articulate the robotic arm for door opening and holding while walking through doorways.",
      "Trained a custom YOLO11 detector for door and handle detection, using Principal Component Analysis (PCA) on segmentation masks to extract 3D handle orientation.",
      "Achieved a 60% end-to-end success rate for approaching, opening, holding the door, and passing through while avoiding dynamic obstacles."
    ],
    role: [
      "Created the HRL navigation and collision avoidance policy using RGB-D depth camera feedback.",
      "Built the computer vision model that detects real-world door coordinates and door handle 3D orientation for navigation and grasping."
    ],
    metrics: "60% End-to-End Clearance Success Rate",
    githubUrl: "https://github.com/siddartha00/rlProjectBDSpot.git",
    youtubeUrl: "",
    mediaFolder: "media_sources/hrl-bd-spot",
    image: spotMedia.src,
    tags: ["Boston Dynamics Spot", "HRL", "SAC", "YOLO11", "PCA", "RGB-D Vision", "PyTorch"]
  },
  {
    id: "multi-robot-industrial-pipeline",
    title: "Multi-Robot Production Cell: TM12 Arms & Fetch AMR",
    category: "Group",
    subtitle: "Industrial manufacturing coordination across dual Techman TM12 arms and Fetch AMR",
    overview: "Synchronized industrial manufacturing cell orchestrating two Techman TM12 robotic arms and a Fetch Robotics AMR for precision parts loading, transfer, and swapping in a production pipeline.",
    summaryPoints: [
      "Orchestrated two Techman TM12 robot arms and a Fetch AMR with 1mm movement precision.",
      "Automated end-to-end parts loading, transfer, and swap pipeline synchronized via Modbus & Node-RED."
    ],
    fullDetails: [
      "Orchestrated an automated multi-station production cycle swapping parts between dual Techman TM12 robotic arms and a Fetch AMR.",
      "Station 1 TM12 loads items into a tumbler on the AMR trolley; AMR traverses to Station 2 for part swap; AMR returns to Station 1 for unloading.",
      "Achieved 1mm movement precision across robot arm docking and part manipulation operations.",
      "Built real-time inter-robot communication and synchronization using Node-RED and Modbus messaging."
    ],
    role: [
      "Designed the AMR autonomous scheduling and transit workflows using FetchCore fleet management software.",
      "Implemented Node-RED and Modbus communication layer for real-time synchronization between the robotic arms and mobile robot."
    ],
    metrics: "1mm Precision Multi-Robot Synchronization",
    youtubeUrl: "https://youtu.be/FOkDF0Ck3DE",
    githubUrl: "",
    mediaFolder: "",
    image: multiRobotMedia.src,
    tags: ["Techman TM12", "Fetch AMR", "Node-RED", "Modbus", "FetchCore", "Industrial Automation"]
  }
];

const mockAchievements: Achievement[] = [
  {
    title: "1st Place: Ford Robotic Gripper Challenge @ StarkHacks",
    description: "Project: Multimodal Compliant Gripper with Force Feedback. Organized by Humanoid Research Organization at Purdue University. Sponsored by AMD, Ford, Espressif, Qualcomm, MLH, and Ultimaker.",
    date: "April 17-19, 2026",
    link: "https://devpost.com/software/multimodal-compliant-gripper-with-force-feedback",
    youtube: "https://youtu.be/Yh4Lk9BP-3s?si=03OGHrp1SApgz0MC",
    image: "",
  }
];

export default function App() {
  const portfolioProjects = [
    ...mockProjects.filter((project) => project.id !== "ur10-realworld-sorting-servoing" && project.id !== "multi-robot-industrial-pipeline"),
    ...mockProjects.filter((project) => project.id === "ur10-realworld-sorting-servoing" || project.id === "multi-robot-industrial-pipeline"),
  ];

  return (
    <Portfolio projects={portfolioProjects} achievements={mockAchievements} />
  );
}

