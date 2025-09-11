import React, { useState, useCallback } from "react";
import { ExternalLink, Github, ChevronDown, ChevronUp, Info, Eye, Code, Shield, Users, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ProjectModal } from "./ProjectModal";

const projects = [];

const exampleProjects = [
  {
    title: "Neural Network Optimizer",
    description: "Advanced optimization algorithms for deep neural networks that reduce training time by 35% while maintaining accuracy.",
    fullDescription: "This project represents a breakthrough in neural network optimization, developing novel algorithms that significantly reduce training time while maintaining model accuracy. Through extensive research and experimentation, I created a system that processes large datasets 35% faster than traditional methods. The optimizer incorporates adaptive learning rates, momentum-based updates, and innovative gradient descent techniques that have been proven effective across various neural architectures.",
    image: "https://images.unsplash.com/photo-1564707944519-7a116ef3841c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNoaW5lJTIwbGVhcm5pbmclMjBBSSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3NTcyMTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    techStack: ["Python", "PyTorch", "CUDA", "NumPy"],
    liveDemo: "#",
    github: "#",
    features: [
      "35% reduction in training time across multiple architectures",
      "Adaptive learning rate scheduling with momentum optimization",
      "GPU-accelerated computations using CUDA",
      "Comprehensive benchmarking against standard optimizers",
      "Support for both supervised and unsupervised learning"
    ],
    timeline: "6 months",
    teamSize: "Solo project",
    role: "Lead AI Researcher & Developer"
  },
  {
    title: "Real-time Analytics Platform",
    description: "Full-stack web application providing real-time data visualization and insights for enterprise clients.",
    fullDescription: "A comprehensive analytics platform designed for enterprise clients requiring real-time data insights. The system processes millions of data points per second, providing interactive dashboards, customizable reports, and predictive analytics. Built with a microservices architecture for scalability and reliability, featuring real-time WebSocket connections, advanced caching strategies, and responsive data visualizations.",
    image: "https://images.unsplash.com/photo-1748609160056-7b95f30041f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHlzaXMlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzU3NTIxNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    liveDemo: "#",
    github: "#",
    features: [
      "Real-time data processing with WebSocket connections",
      "Interactive dashboards with customizable widgets",
      "Advanced filtering and search capabilities",
      "Automated report generation and scheduling",
      "Role-based access control and data security"
    ],
    timeline: "8 months",
    teamSize: "4 developers",
    role: "Full-Stack Lead Developer"
  },
  {
    title: "Modern Web Framework",
    description: "Lightweight, performant web framework with built-in state management and component system.",
    fullDescription: "A next-generation web framework designed for modern web development, emphasizing performance, developer experience, and maintainability. The framework features a unique component architecture, efficient state management, and optimized bundling strategies. Built with WebAssembly for performance-critical operations and includes comprehensive tooling for development, testing, and deployment.",
    image: "https://images.unsplash.com/photo-1676731820390-a119efe23333?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3ZWIlMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NTc1NzIxMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    techStack: ["JavaScript", "WebAssembly", "Vite", "CSS3"],
    github: "#",
    features: [
      "Ultra-lightweight runtime with zero dependencies",
      "Built-in state management with reactive updates",
      "Component hot-reloading and development tools",
      "WebAssembly integration for performance optimization",
      "Comprehensive documentation and examples"
    ],
    timeline: "12 months",
    teamSize: "Solo project",
    role: "Framework Architect & Developer"
  },
  {
    title: "AI Content Generator",
    description: "Advanced natural language processing system that generates high-quality content for marketing and technical documentation.",
    fullDescription: "An enterprise-grade AI content generation platform leveraging advanced natural language processing models to create high-quality content across multiple domains. The system incorporates custom-trained language models, content optimization algorithms, and quality assurance mechanisms to ensure consistent, engaging, and accurate content generation for marketing materials, technical documentation, and creative writing.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2V8ZW58MXx8fHwxNzU3NTcyMTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    techStack: ["Python", "TensorFlow", "FastAPI", "Redis"],
    isPrivate: true,
    features: [
      "Multi-domain content generation (marketing, technical, creative)",
      "Custom language model training and fine-tuning",
      "Content quality scoring and optimization",
      "API-first architecture with rate limiting",
      "Real-time content generation with caching"
    ],
    timeline: "10 months",
    teamSize: "3 AI researchers",
    role: "AI/ML Lead Engineer"
  },
  {
    title: "Blockchain Voting System",
    description: "Secure, transparent voting platform built on blockchain technology ensuring immutable and verifiable election results.",
    fullDescription: "A revolutionary blockchain-based voting platform designed to address traditional election security and transparency concerns. The system utilizes smart contracts for vote recording, cryptographic techniques for voter privacy, and decentralized consensus for result verification. Built with accessibility and user experience as primary considerations, ensuring democratic participation while maintaining the highest security standards.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTc1NzIxNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    techStack: ["Solidity", "Web3.js", "React", "MetaMask"],
    github: "#",
    features: [
      "Immutable vote recording using smart contracts",
      "Zero-knowledge proofs for voter privacy",
      "Real-time election monitoring and transparency",
      "Multi-signature verification for election integrity",
      "Accessibility features for inclusive voting"
    ],
    timeline: "14 months",
    teamSize: "5 developers",
    role: "Blockchain Lead Developer"
  },
  {
    title: "IoT Smart Home Hub",
    description: "Centralized control system for smart home devices with AI-powered automation and energy optimization features.",
    fullDescription: "An intelligent IoT ecosystem that transforms traditional homes into smart, energy-efficient environments. The system integrates multiple smart devices, sensors, and automation protocols to provide seamless control, monitoring, and optimization. Features include predictive energy management, security monitoring, environmental controls, and machine learning-based automation that adapts to user preferences and behaviors.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGhvbWUlMjBJb1R8ZW58MXx8fHwxNzU3NTcyMTc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    techStack: ["Arduino", "Raspberry Pi", "MQTT", "Flutter"],
    liveDemo: "#",
    isPrivate: true,
    features: [
      "Multi-device integration with 50+ smart home protocols",
      "AI-powered energy optimization reducing costs by 30%",
      "Predictive maintenance alerts for connected devices",
      "Voice control integration with natural language processing",
      "Advanced security monitoring with anomaly detection"
    ],
    timeline: "18 months",
    teamSize: "6 engineers",
    role: "IoT Systems Architect"
  }
];

// Tech stack icon mapping
const techIcons: { [key: string]: string } = {
  Python: "🐍",
  PyTorch: "🔥",
  CUDA: "⚡",
  NumPy: "🔢",
  React: "⚛️",
  TypeScript: "📘",
  "Node.js": "🟢",
  PostgreSQL: "🐘",
  JavaScript: "💛",
  WebAssembly: "🔧",
  Vite: "⚡",
  CSS3: "🎨",
  TensorFlow: "🧠",
  FastAPI: "🚀",
  Redis: "🔴",
  Solidity: "💎",
  "Web3.js": "🌐",
  MetaMask: "🦊",
  Arduino: "🔌",
  "Raspberry Pi": "🍓",
  MQTT: "📡",
  Flutter: "🐦"
};

export function Projects() {
  const [showAll, setShowAll] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const displayedProjects = showAll ? projects : projects.slice(0, 3);

  const openProjectModal = useCallback((project: typeof projects[0]) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  const closeProjectModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProject(null);
  }, []);

  return (
    <section className="py-20 bg-[#0F172A] px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Projects
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A showcase of my projects
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length > 0 ? displayedProjects.map((project, index) => (
            <div 
              key={index}
              className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-[#3B82F6]/50 transition-all duration-300 transform hover:scale-105"
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <ImageWithFallback 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Project Status Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {project.isPrivate && (
                    <div className="bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <Shield className="w-3 h-3 text-orange-400" />
                      <span className="text-xs text-orange-400">Private</span>
                    </div>
                  )}
                  {!project.liveDemo && (
                    <div className="bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <Eye className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">No Demo</span>
                    </div>
                  )}
                </div>

                {/* Project Metadata */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                  {project.timeline && (
                    <div className="bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-300" />
                      <span className="text-xs text-gray-300">{project.timeline}</span>
                    </div>
                  )}
                  {project.teamSize && (
                    <div className="bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <Users className="w-3 h-3 text-gray-300" />
                      <span className="text-xs text-gray-300">{project.teamSize}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-[#3B82F6] transition-colors duration-300">
                  {project.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span 
                      key={tech}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#3B82F6]/20 text-[#3B82F6] rounded-full text-sm border border-[#3B82F6]/30"
                    >
                      <span className="text-xs">{techIcons[tech] || "🔧"}</span>
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {/* Details Button */}
                  <Button 
                    size="sm"
                    variant="outline"
                    className="flex-1 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white gap-2"
                    onClick={() => openProjectModal(project)}
                  >
                    <Info className="w-4 h-4" />
                    Details
                  </Button>
                  
                  {/* Live Demo Button */}
                  {project.liveDemo ? (
                    <Button 
                      size="sm"
                      className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white gap-2"
                      onClick={() => window.open(project.liveDemo, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Demo
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-400 cursor-not-allowed gap-2"
                      disabled
                    >
                      <Eye className="w-4 h-4" />
                      No Demo
                    </Button>
                  )}
                  
                  {/* Code Button */}
                  {project.github && !project.isPrivate ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 gap-2"
                      onClick={() => window.open(project.github, '_blank')}
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 border-gray-600 text-gray-400 cursor-not-allowed gap-2"
                      disabled
                      title={project.isPrivate ? "Private Repository" : "Code Unavailable"}
                    >
                      {project.isPrivate ? <Shield className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                      {project.isPrivate ? "Private" : "N/A"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center text-gray-400">
              No projects yet
            </div>
          )}
        </div>

        {/* View All Projects Button */}
        <div className="text-center mt-12">
          <Button 
            size="lg"
            variant="outline"
            className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white px-8 py-3 transition-all duration-300"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                <ChevronUp className="w-5 h-5 mr-2" />
                Show Featured Projects
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5 mr-2" />
                View All Projects ({projects.length})
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={closeProjectModal}
        />
      )}
    </section>
  );
}