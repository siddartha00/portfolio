import React from 'react';
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
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans text-slate-200">
      {/* Top right radial glow effect */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      {/* Main Content Container */}
      <main className="w-full max-w-5xl flex flex-col gap-12 relative z-10">
        {/* Hero Section */}
        <header className="flex flex-col items-center justify-between w-full h-[70vh]">
          <img src="/path/to/your/image.jpg" alt="Profile Photo" className="max-h-48 rounded-full my-16" />
          <div>
            <h1 className="text-5xl font-bold tracking-tight text-white">Siddartha</h1>
            <p className="text-lg text-emerald-300 max-w-md">Full-Stack Engineer specialized in Agentic AI and High-Performance Web Apps.</p>
          </div>
          <footer className="flex justify-between w-full">
            <div className="flex flex-col items-start">
              <a href="mailto:siddartha@example.com" className="text-lg text-emerald-300">Email</a>
              <a href="tel:+1234567890" className="text-lg text-emerald-300">Phone</a>
            </div>
            <div className="flex flex-row gap-4">
              <a href="https://linkedin.com/in/siddartha" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400">
                <Linkedin />
              </a>
              <a href="https://github.com/siddartha" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400">
                <GithubIcon />
              </a>
              <a href="mailto:siddartha@example.com" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400">
                <Mail />
              </a>
            </div>
          </footer>
        </header>

        {/* Project Grid (2x2 Bento Style) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors duration-300 h-300 justify-between"
            >
              {/* Hover overlay gradient */}
              <div className="absolute inset-0 bg-slate-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative z-10 flex-1">
                <div className="w-12 h-12 rounded-lg bg-slate-800 mb-4 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-all">
                  {/* Placeholder Icon based on index for demo purposes */}
                  {index % 2 === 0 ? (
                    <span className="text-2xl font-bold">AI</span>
                  ) : (
                    <span className="text-2xl font-bold">WEB</span>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-slate-100 mb-2">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-3">
                  {project.description}
                </p>
              </div>

              <div className="relative z-10 mt-4 flex items-center justify-between text-slate-400 text-sm group-hover:text-white transition-colors">
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