import React, { useState } from "react";
import { ExternalLink } from "lucide-react";

/**
 * ProjectCard Component - Displays a project with hover preview functionality
 *
 * @param {Object} project - Project data object
 * @param {string} project.title - Project title
 * @param {string} project.description - Project description
 * @param {Array} project.tech - Array of technology strings
 * @param {string} project.link - Project URL
 * @param {boolean} project.featured - Whether the project is featured
 * @param {string} project.previewImage - URL to preview image (optional)
 * @param {string} project.previewUrl - URL for live iframe preview (optional)
 */
const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border ${
        project.featured ? "border-indigo-500/50" : "border-gray-700/50"
      } hover:border-indigo-500 transition-all transform hover:-translate-y-2 group relative overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2 sm:px-3 py-1 bg-indigo-500 text-xs font-semibold rounded-full z-20">
          Featured
        </div>
      )}

      {/* Preview Overlay - Shows on Hover */}
      <div
        className={`absolute inset-0 bg-gray-900/98 backdrop-blur-md transition-all duration-500 ease-in-out flex items-center justify-center p-4 z-10 ${
          isHovered ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="w-full h-full relative rounded-lg overflow-hidden border-2 border-indigo-500/50 shadow-2xl">
          {project.previewUrl ? (
            // Live iframe preview for deployed projects
            <iframe
              src={project.previewUrl}
              className="w-full h-full"
              title={`${project.title} Preview`}
              sandbox="allow-scripts allow-same-origin"
            />
          ) : project.previewImage ? (
            // Image preview with overlay
            <div className="relative w-full h-full">
              <img
                src={project.previewImage}
                alt={`${project.title} Preview`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent flex items-end p-4">
                <p className="text-white text-sm font-semibold">
                  {project.title} Preview
                </p>
              </div>
            </div>
          ) : (
            // Fallback when no preview available
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
              <div className="text-center p-6">
                <ExternalLink className="w-16 h-16 mx-auto mb-4 text-indigo-400" />
                <p className="text-gray-300 text-lg font-semibold mb-2">
                  Live Preview
                </p>
                <p className="text-gray-400 text-sm">Click to view project</p>
              </div>
            </div>
          )}

          {/* Quick access button on preview */}
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            Open <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Project Card Content */}
      <div className="relative z-0">
        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-indigo-400 group-hover:text-purple-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          {project.tech.map((tech, i) => (
            <span
              key={i}
              className="px-2 sm:px-3 py-1 bg-indigo-600/20 text-indigo-300 rounded-full text-xs sm:text-sm border border-indigo-500/30"
            >
              {tech}
            </span>
          ))}
        </div>
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors font-semibold group-hover:gap-3 gap-2 text-sm sm:text-base"
        >
          View Project{" "}
          <ExternalLink size={14} className="sm:w-4 sm:h-4 transition-all" />
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
