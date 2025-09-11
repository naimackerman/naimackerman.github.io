import React from "react";
import { X, ExternalLink, Github, Calendar, Users, Code, Shield, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProjectModalProps {
  project: {
    title: string;
    description: string;
    fullDescription?: string;
    image: string;
    techStack: string[];
    liveDemo?: string;
    github?: string;
    isPrivate?: boolean;
    features?: string[];
    timeline?: string;
    teamSize?: string;
    role?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

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

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="relative">
          <ImageWithFallback
            src={project.image}
            alt={project.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-gray-900/80 text-white rounded-full hover:bg-gray-900 transition-colors backdrop-blur-sm"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Project Title */}
          <div className="absolute bottom-4 left-6">
            <h2 className="text-3xl font-bold text-white mb-2">{project.title}</h2>
            <div className="flex items-center gap-4 text-gray-300">
              {project.timeline && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{project.timeline}</span>
                </div>
              )}
              {project.teamSize && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{project.teamSize}</span>
                </div>
              )}
              {project.isPrivate && (
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Private</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">About This Project</h3>
              <p className="text-gray-300 leading-relaxed">
                {project.fullDescription || project.description}
              </p>
            </div>
            
            {/* Role */}
            {project.role && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">My Role</h3>
                <p className="text-gray-300">{project.role}</p>
              </div>
            )}
            
            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full mt-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Tech Stack */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Technology Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span 
                    key={tech}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-[#3B82F6]/20 text-[#3B82F6] rounded-lg text-sm border border-[#3B82F6]/30"
                  >
                    <span className="text-xs">{techIcons[tech] || "🔧"}</span>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-gray-900/50">
          <div className="flex flex-col sm:flex-row gap-3">
            {project.liveDemo && (
              <Button 
                size="lg"
                className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white gap-2"
                onClick={() => window.open(project.liveDemo, '_blank')}
              >
                <ExternalLink className="w-5 h-5" />
                View Live Demo
              </Button>
            )}
            
            {!project.liveDemo && (
              <Button 
                size="lg"
                variant="outline"
                className="flex-1 border-gray-600 text-gray-400 cursor-not-allowed gap-2"
                disabled
              >
                <Eye className="w-5 h-5" />
                No Live Demo
              </Button>
            )}
            
            {project.github && !project.isPrivate && (
              <Button 
                variant="outline" 
                size="lg"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 gap-2"
                onClick={() => window.open(project.github, '_blank')}
              >
                <Github className="w-5 h-5" />
                View Code
              </Button>
            )}
            
            {(project.isPrivate || !project.github) && (
              <Button 
                variant="outline" 
                size="lg"
                className="flex-1 border-gray-600 text-gray-400 cursor-not-allowed gap-2"
                disabled
              >
                <Shield className="w-5 h-5" />
                {project.isPrivate ? 'Private Repository' : 'Code Unavailable'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}