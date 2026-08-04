import React, { useState } from "react";
import { ExternalLink } from "lucide-react";

const ProjectCard = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`bg-white rounded-2xl border ${
        project.featured ? "border-indigo-200 shadow-md" : "border-gray-100 shadow-sm"
      } hover:shadow-lg hover:border-indigo-300 transition-all duration-300 group relative overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full z-20 shadow-sm">
          Featured
        </div>
      )}

      {/* Preview Overlay – shows on hover */}
      <div
        className={`absolute inset-0 bg-white/98 backdrop-blur-sm transition-all duration-400 ease-in-out flex items-center justify-center p-4 z-10 ${
          isHovered ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="w-full h-full relative rounded-xl overflow-hidden border border-gray-200 shadow-lg">
          {project.previewUrl ? (
            <iframe
              src={project.previewUrl}
              className="w-full h-full"
              title={`${project.title} Preview`}
              sandbox="allow-scripts allow-same-origin"
            />
          ) : project.previewImage ? (
            <div className="relative w-full h-full">
              <img
                src={project.previewImage}
                alt={`${project.title} Preview`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent flex items-end p-4">
                <p className="text-white text-sm font-semibold">{project.title} Preview</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-50">
              <div className="text-center p-6">
                <ExternalLink className="w-14 h-14 mx-auto mb-4 text-indigo-400" />
                <p className="text-gray-700 text-lg font-semibold mb-1">Live Preview</p>
                <p className="text-gray-400 text-sm">Click to view project</p>
              </div>
            </div>
          )}

          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg flex items-center gap-1.5 shadow-md transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            Open <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 sm:p-8 relative z-0">
        <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-500 mb-5 leading-relaxed text-sm sm:text-base">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech.map((tech, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-slate-50 text-gray-600 rounded-lg text-xs sm:text-sm font-medium border border-gray-200"
            >
              {tech}
            </span>
          ))}
        </div>
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-colors"
        >
          View Project
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
