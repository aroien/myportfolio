import React, { useState, useEffect } from "react";
import {
  Code,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Menu,
  X,
  Send,
  Download,
  Briefcase,
  Award,
  Users,
  Coffee,
  ArrowRight,
  Check,
} from "lucide-react";

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const projects = [
    {
      title: "E-Commerce Platform",
      description:
        "A full-featured online shopping platform with cart management, payment integration, and admin dashboard.",
      tech: ["React", "Redux", "Node.js", "MongoDB"],
      link: "#",
      featured: true,
    },
    {
      title: "Task Management App",
      description:
        "Collaborative project management tool with real-time updates, drag-and-drop interface, and team features.",
      tech: ["React", "TypeScript", "Firebase", "Tailwind"],
      link: "#",
      featured: true,
    },
    {
      title: "Weather Dashboard",
      description:
        "Interactive weather application with location-based forecasts, beautiful visualizations, and historical data.",
      tech: ["React", "API Integration", "Chart.js", "CSS3"],
      link: "#",
      featured: false,
    },
    {
      title: "Social Media Analytics",
      description:
        "Real-time analytics dashboard for social media metrics with data visualization and export features.",
      tech: ["React", "D3.js", "REST API", "Tailwind"],
      link: "#",
      featured: false,
    },
  ];

  const skills = [
    { name: "React", level: 95, category: "Frontend" },
    { name: "JavaScript", level: 90, category: "Frontend" },
    { name: "TypeScript", level: 85, category: "Frontend" },
    { name: "Tailwind CSS", level: 90, category: "Frontend" },
    { name: "Node.js", level: 75, category: "Backend" },
    { name: "Git", level: 85, category: "Tools" },
  ];

  const stats = [
    { icon: Briefcase, value: "3+", label: "Years Experience" },
    { icon: Award, value: "15+", label: "Projects Completed" },
    { icon: Users, value: "10+", label: "Happy Clients" },
    { icon: Coffee, value: "100+", label: "Cups of Coffee" },
  ];

  const services = [
    {
      title: "Web Development",
      description:
        "Building responsive, high-performance web applications with modern frameworks",
      features: [
        "React/Next.js",
        "Responsive Design",
        "Performance Optimization",
      ],
    },
    {
      title: "UI/UX Design",
      description: "Creating beautiful, intuitive interfaces that users love",
      features: ["User Research", "Wireframing", "Prototyping"],
    },
    {
      title: "Consulting",
      description: "Technical consulting and code reviews for your projects",
      features: ["Code Review", "Architecture", "Best Practices"],
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      content:
        "Outstanding developer! Delivered our project ahead of schedule with exceptional quality.",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "CTO at StartupXYZ",
      content:
        "Highly skilled and professional. Great communication and problem-solving abilities.",
      avatar: "MC",
    },
  ];

  const ScrollToSection = (id) => {
    setActiveSection(id);
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Message sent successfully! I will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Cursor follower effect */}
      <div
        className="fixed w-96 h-96 rounded-full pointer-events-none z-0 opacity-20 blur-3xl transition-all duration-300"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)",
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Navigation */}
      <nav className="fixed w-full bg-gray-900/95 backdrop-blur-md z-50 border-b border-gray-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            &lt;Hi, I am M Mehedi/&gt;
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {[
              "home",
              "about",
              "services",
              "projects",
              "skills",
              "testimonials",
              "contact",
            ].map((item) => (
              <button
                key={item}
                onClick={() => ScrollToSection(item)}
                className={`capitalize transition-all duration-300 ${
                  activeSection === item
                    ? "text-indigo-400 font-semibold"
                    : "text-gray-300 hover:text-indigo-400"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-indigo-400 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800/95 backdrop-blur-md border-t border-gray-700">
            {[
              "home",
              "about",
              "services",
              "projects",
              "skills",
              "testimonials",
              "contact",
            ].map((item) => (
              <button
                key={item}
                onClick={() => ScrollToSection(item)}
                className="block w-full text-left px-6 py-3 capitalize hover:bg-gray-700/50 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center px-6 pt-20"
      >
        <div
          className={`max-w-5xl mx-auto text-center z-10 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-6 inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <Code
                size={80}
                className="relative text-indigo-400 animate-bounce"
              />
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
            Frontend Developer
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-4 max-w-3xl mx-auto">
            Crafting beautiful, responsive web experiences
          </p>
          <p className="text-lg text-gray-500 mb-8">
            with <span className="text-indigo-400 font-semibold">3 years</span>{" "}
            of expertise in modern technologies
          </p>
          <div className="flex justify-center space-x-4 flex-wrap gap-4">
            <button
              onClick={() => ScrollToSection("projects")}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-indigo-500/50 font-semibold flex items-center gap-2"
            >
              View Projects
              <ArrowRight size={20} />
            </button>
            <a
              href="/resume.pdf"
              download
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/50 font-semibold flex items-center gap-2"
            >
              <Download size={20} />
              Download Resume
            </a>
            <button
              onClick={() => ScrollToSection("contact")}
              className="px-8 py-4 border-2 border-indigo-600 hover:bg-indigo-600/10 rounded-lg transition-all font-semibold"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 text-center hover:border-indigo-500/50 transition-all transform hover:scale-105"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-indigo-400" />
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl font-bold mb-4 text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            About Me
          </h2>
          <p className="text-center text-gray-400 mb-12 text-lg">
            Get to know me better
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <h3 className="text-2xl font-bold mb-4 text-indigo-400">
                My Story
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                I'm a passionate frontend developer with 3 years of experience
                building modern, user-centric web applications. I specialize in
                React and have a keen eye for design and performance
                optimization.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                My journey in web development has taught me the importance of
                clean code, responsive design, and creating seamless user
                experiences.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <h3 className="text-2xl font-bold mb-4 text-purple-400">
                What I Bring
              </h3>
              <ul className="space-y-3">
                {[
                  "Clean, maintainable code",
                  "Pixel-perfect implementations",
                  "Performance optimization",
                  "Responsive design expertise",
                  "Strong problem-solving skills",
                  "Excellent communication",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold mb-4 text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Services
          </h2>
          <p className="text-center text-gray-400 mb-12 text-lg">
            What I can do for you
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-indigo-500/50 transition-all transform hover:-translate-y-2 group"
              >
                <h3 className="text-2xl font-bold mb-3 text-indigo-400 group-hover:text-purple-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center text-gray-300 text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold mb-4 text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-center text-gray-400 mb-12 text-lg">
            Some of my recent work
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border ${
                  project.featured
                    ? "border-indigo-500/50"
                    : "border-gray-700/50"
                } hover:border-indigo-500 transition-all transform hover:-translate-y-2 group relative overflow-hidden`}
              >
                {project.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-500 text-xs font-semibold rounded-full">
                    Featured
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-3 text-indigo-400 group-hover:text-purple-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-indigo-600/20 text-indigo-300 rounded-full text-sm border border-indigo-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors font-semibold group-hover:gap-3 gap-2"
                >
                  View Project{" "}
                  <ExternalLink size={16} className="transition-all" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl font-bold mb-4 text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Skills & Technologies
          </h2>
          <p className="text-center text-gray-400 mb-12 text-lg">
            My technical expertise
          </p>

          <div className="space-y-8">
            {skills.map((skill, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-200 font-semibold text-lg">
                      {skill.name}
                    </span>
                    <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-xs">
                      {skill.category}
                    </span>
                  </div>
                  <span className="text-indigo-400 font-bold text-lg">
                    {skill.level}%
                  </span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-4 overflow-hidden border border-gray-600/50">
                  <div
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${skill.level}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold mb-4 text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Testimonials
          </h2>
          <p className="text-center text-gray-400 mb-12 text-lg">
            What people say about my work
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-indigo-500/50 transition-all"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-200">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl font-bold mb-4 text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <p className="text-gray-400 text-lg mb-12 text-center">
            I'm always open to new opportunities and collaborations. Feel free
            to reach out!
          </p>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-12">
            <a
              href="mailto:mehedimhdn@gmail.com"
              className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-gray-700/50 rounded-full hover:border-indigo-500 hover:scale-110 transition-all"
            >
              <Mail size={24} />
            </a>
            <a
              href="https://github.com"
              className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-gray-700/50 rounded-full hover:border-indigo-500 hover:scale-110 transition-all"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com"
              className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-gray-700/50 rounded-full hover:border-indigo-500 hover:scale-110 transition-all"
            >
              <Linkedin size={24} />
            </a>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <h3 className="text-3xl font-bold mb-6 text-indigo-400">
              Send me a message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-300 mb-2 font-medium"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-300 mb-2 font-medium"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-300 mb-2 font-medium"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all transform hover:scale-105 font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/50"
              >
                <Send size={20} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800/50 text-center text-gray-500 relative z-10">
        <p className="mb-2">&copy; 2025 M Mehedi. All rights reserved.</p>
        <p className="text-sm">
          Built with React & Tailwind CSS | Designed with ❤️
        </p>
      </footer>
    </div>
  );
}

export default App;
