"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  LuExternalLink as ExternalLinkIcon,
  LuMail as Mail,
  LuLinkedin as Linkedin,
  LuGithub as GithubIcon,
} from 'react-icons/lu';

// TypeScript interfaces for project data and props
interface Project {
  title: string;
  description: string;
  link: string;
  image: string;
}

interface PortfolioProps {
  projects: Project[];
}

const Portfolio: React.FC<PortfolioProps> = ({ projects }) => {
  const [activeTab, setActiveTab] = useState('#hero');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: 'Home', href: '#hero' },
    { name: 'About Me', href: '#about-me' },
    { name: 'Projects', href: '#projects' },
  ];

  useEffect(() => {
    const handleScroll = () => {
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setActiveTab(href);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans text-slate-200">
      {/* Navigation - Occupies entire width of container, no visible borders */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/90 backdrop-blur-lg flex justify-center">
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
        <section id="hero" className="flex flex-col items-center justify-center w-full min-h-[70vh] relative pt-10">
          <img src="/path/to/your/image.jpg" alt="Profile Photo" className="max-h-48 rounded-full mb-8" />
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white mb-4">Siddartha</h1>
            <p className="text-lg text-emerald-300 max-w-md mx-auto">Full-Stack Engineer specialized in Agentic AI and High-Performance Web Apps.</p>
          </div>
          <footer className="flex justify-center w-full mt-12">
            <div className="flex flex-row gap-6">
              <a href="https://linkedin.com/in/siddartha" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400 scale-125 transition-transform hover:scale-150">
                <Linkedin />
              </a>
              <a href="https://github.com/siddartha" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400 scale-125 transition-transform hover:scale-150">
                <GithubIcon />
              </a>
              <a href="mailto:siddartha@example.com" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400 scale-125 transition-transform hover:scale-150">
                <Mail />
              </a>
            </div>
          </footer>
        </section>

        {/* About Me Section */}
        <section id="about-me" className="flex flex-col gap-6 py-20 min-h-[50vh] justify-center">
          <h2 className="text-3xl font-bold text-white mb-2 text-center md:text-left">About Me</h2>
          <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-xl border border-slate-800/50">
            <p className="text-slate-400 leading-relaxed text-lg">
              I am a passionate software engineer with a deep interest in artificial intelligence and web technologies.
              My experience spans across building robust backend systems, creating intuitive user interfaces,
              and integrating advanced AI models to solve real-world problems.
            </p>
          </div>
        </section>

        {/* Project Grid (2x2 Bento Style) */}
        <section id="projects" className="py-20 min-h-[70vh]">
          <h2 className="text-3xl font-bold text-white mb-8 text-center md:text-left">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <a
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors duration-300 justify-between h-full min-h-[250px]"
              >
                {/* Hover overlay gradient */}
                <div className="absolute inset-0 bg-slate-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-slate-800 mb-4 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-all">
                    {/* Placeholder Icon based on index for demo purposes */}
                    {index % 2 === 0 ? (
                      <span className="text-xl font-bold">AI</span>
                    ) : (
                      <span className="text-xl font-bold">WEB</span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-slate-100 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div className="relative z-10 mt-6 flex items-center justify-between text-slate-400 text-sm group-hover:text-white transition-colors">
                  <span>View Source</span>
                  <div className="flex items-center gap-2">
                    {/* GitHub Icon */}
                    <GithubIcon className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />

                    {/* External Link Icon */}
                    <ExternalLinkIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

// Mock data for demonstration
const mockProjects: Project[] = [
  {
    title: "Agentic Orchestration Core",
    description: "A high-performance background service built with Rust and Next.js that manages complex multi-agent workflows with sub-millisecond latency.",
    link: "https://github.com/example/orchestration-core",
    image: "/api/placeholder/400/300", // Placeholder for image
  },
  {
    title: "Neural UI Designer",
    description: "An experimental browser extension that generates component code directly in the canvas using LLM agents to speed up prototyping.",
    link: "https://github.com/example/neural-ui",
    image: "/api/placeholder/400/300", // Placeholder for image
  },
  {
    title: "Quantum Finance Dashboard",
    description: "Real-time data visualization platform handling millions of ticks per second using WebGL and WebGL shaders.",
    link: "https://github.com/example/quantum-finance",
    image: "/api/placeholder/400/300", // Placeholder for image
  },
  {
    title: "OpenSource AI Helper",
    description: "A comprehensive toolchain designed to assist developers in integrating LLMs into legacy codebases with strict type safety.",
    link: "https://github.com/example/ai-helper",
    image: "/api/placeholder/400/300", // Placeholder for image
  }
];

export default function App() {
  return (
    <Portfolio projects={mockProjects} />
  );
}
