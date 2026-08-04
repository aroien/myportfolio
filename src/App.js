import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import ProjectCard from "./components/ProjectCard";

import {
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
  Send,
  Download,
  Briefcase,
  Award,
  Users,
  Code2,
  ArrowRight,
  Check,
} from "lucide-react";

const ROLES = [
  "Frontend Developer",
  "React Specialist",
  "UI Engineer",
  "Next.js Developer",
];

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
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentYear = require("current-year");

  const EMAILJS_SERVICE_ID = "service_ebqxlce";
  const EMAILJS_TEMPLATE_ID = "template_8z7doha";
  const EMAILJS_PUBLIC_KEY = "80PfHghuTAIsE4rS3";

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    let timeout;

    if (!isDeleting && typedText.length < currentRole.length) {
      timeout = setTimeout(
        () => setTypedText(currentRole.substring(0, typedText.length + 1)),
        100,
      );
    } else if (!isDeleting && typedText.length === currentRole.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && typedText.length > 0) {
      timeout = setTimeout(
        () => setTypedText(currentRole.substring(0, typedText.length - 1)),
        50,
      );
    } else if (isDeleting && typedText.length === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, roleIndex]);

  const projects = [
    {
      title: "IGRS Learning Platform",
      description:
        "A full-stack e-learning platform with course management, interactive quizzes, and student progress tracking. Built with Next.js and TypeScript, deployed to production.",
      tech: ["Next.js", "React", "TypeScript", "PostgreSQL", "Tailwind CSS"],
      link: "https://igrs-learning.vercel.app/",
      featured: true,
      previewUrl: "https://igrs-learning.vercel.app/",
    },
    {
      title: "E-Commerce Platform",
      description:
        "A full-featured online shopping platform with product catalog, cart management, secure checkout flow, and an admin dashboard for inventory management.",
      tech: ["React", "Redux Toolkit", "Node.js", "MongoDB", "Stripe"],
      link: "https://github.com/aroien",
      featured: true,
      previewImage:
        "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
    },
    {
      title: "Weather Dashboard",
      description:
        "Interactive weather app with geolocation-based forecasts, 7-day outlook, and animated data visualizations built with Chart.js.",
      tech: ["React", "OpenWeather API", "Chart.js", "CSS3"],
      link: "https://github.com/aroien",
      featured: false,
      previewImage:
        "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop",
    },
    {
      title: "Social Media Analytics",
      description:
        "Real-time analytics dashboard aggregating social media metrics with interactive D3.js visualizations and CSV export functionality.",
      tech: ["React", "D3.js", "REST API", "Tailwind CSS"],
      link: "https://github.com/aroien",
      featured: false,
      previewImage:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    },
  ];

  const skillCategories = [
    {
      category: "Frontend",
      skills: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript (ES6+)",
        "Tailwind CSS",
        "HTML5",
        "CSS3",
      ],
    },
    {
      category: "Backend & Data",
      skills: ["Node.js", "REST APIs", "PostgreSQL", "MongoDB"],
    },
    {
      category: "Tools & Workflow",
      skills: [
        "Git & GitHub",
        "Vercel",
        "Figma",
        "VS Code",
        "ESLint / Prettier",
      ],
    },
  ];

  const stats = [
    { icon: Briefcase, value: "3+", label: "Years Experience" },
    { icon: Award, value: "15+", label: "Projects Completed" },
    { icon: Users, value: "10+", label: "Happy Clients" },
    { icon: Code2, value: "10+", label: "Technologies" },
  ];

  const services = [
    {
      title: "Web Development",
      description:
        "Building fast, scalable web applications with React and Next.js, optimized for performance and SEO.",
      features: ["React / Next.js", "TypeScript", "Performance Optimization"],
    },
    {
      title: "UI Implementation",
      description:
        "Translating Figma designs into pixel-perfect, responsive interfaces with full attention to accessibility.",
      features: [
        "Responsive Design",
        "Accessibility (a11y)",
        "Cross-browser Compatibility",
      ],
    },
    {
      title: "Technical Consulting",
      description:
        "Architecture reviews, code audits, and technical guidance to help teams ship better software faster.",
      features: ["Code Review", "Architecture Planning", "Best Practices"],
    },
  ];

  const navItems = [
    "home",
    "about",
    "services",
    "projects",
    "skills",
    "contact",
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        EMAILJS_PUBLIC_KEY,
      );
      if (result.text === "OK") {
        alert("Message sent successfully! I'll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Something went wrong. Please try again or email me directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen relative overflow-hidden">
      {/* Subtle background orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 md:w-[36rem] md:h-[36rem] bg-indigo-100/70 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 md:w-[36rem] md:h-[36rem] bg-violet-100/70 rounded-full blur-3xl"></div>
      </div>

      {/* Cursor follower */}
      <div
        className="hidden md:block fixed w-80 h-80 rounded-full pointer-events-none z-0 opacity-40 blur-3xl transition-all duration-500"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          left: mousePosition.x - 160,
          top: mousePosition.y - 160,
        }}
      />

      {/* ── Navigation ── */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-lg z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex justify-between items-center">
          <a
            href="/"
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent font-mono tracking-tight"
          >
            &lt;mMehedi /&gt;
          </a>

          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => ScrollToSection(item)}
                className={`capitalize px-3 py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-200 ${
                  activeSection === item
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            className="md:hidden text-gray-500 hover:text-gray-900 transition-colors p-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => ScrollToSection(item)}
                className="block w-full text-left px-6 py-3.5 capitalize text-gray-700 hover:bg-gray-50 hover:text-indigo-600 font-medium transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center px-5 sm:px-8 pt-20"
      >
        <div
          className={`max-w-4xl mx-auto text-center z-10 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Available for new opportunities
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-5 leading-tight tracking-tight text-gray-900">
            M.{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Mehedi
            </span>
          </h1>

          <div className="mb-6 h-9 sm:h-11 flex items-center justify-center">
            <p className="text-lg sm:text-xl md:text-2xl font-mono text-gray-500">
              <span className="text-indigo-600 font-semibold">{typedText}</span>
              <span className="animate-pulse text-indigo-500 ml-0.5">|</span>
            </p>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Building performant, accessible, and beautiful web experiences with{" "}
            <span className="text-indigo-600 font-semibold">3+ years</span> of
            expertise in React &amp; Next.js.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
            <button
              onClick={() => ScrollToSection("projects")}
              className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all text-sm sm:text-base"
            >
              View Projects
              <ArrowRight size={17} />
            </button>
            <a
              href="/resume.pdf"
              download
              className="w-full sm:w-auto px-7 py-3.5 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-sm sm:text-base"
            >
              <Download size={17} />
              Download Resume
            </a>
            <button
              onClick={() => ScrollToSection("contact")}
              className="w-full sm:w-auto px-7 py-3.5 border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-800 rounded-xl font-semibold transition-all text-sm sm:text-base"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 sm:py-20 px-5 sm:px-8 bg-slate-50 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 sm:p-7 border border-gray-100 shadow-sm text-center hover:shadow-md hover:border-indigo-200 transition-all"
            >
              <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 mx-auto mb-3 text-indigo-500" />
              <div className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section
        id="about"
        className="py-20 sm:py-24 md:py-28 px-5 sm:px-8 bg-white relative z-10"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-gray-900">
              About{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Me
              </span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">
              A bit about who I am and what I do
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-slate-50 rounded-2xl p-7 sm:p-9 border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-indigo-600">
                My Background
              </h3>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4">
                I'm a frontend developer with 3+ years of hands-on experience
                building production-grade web applications. I specialize in
                React and Next.js, with a strong focus on performance,
                accessibility, and clean code architecture.
              </p>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                I care deeply about user experience — every interface I build is
                designed to be fast, responsive, and intuitive. I thrive in
                collaborative environments where quality and clear communication
                are valued.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-7 sm:p-9 border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-purple-600">
                What I Bring
              </h3>
              <ul className="space-y-3">
                {[
                  "Production-ready React & Next.js applications",
                  "TypeScript-first development practices",
                  "Responsive & accessible UI implementation",
                  "Performance optimization & Core Web Vitals",
                  "Clean, maintainable, well-structured code",
                  "Strong communication & team collaboration",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start text-gray-700 text-sm sm:text-base"
                  >
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section
        id="services"
        className="py-20 sm:py-24 md:py-28 px-5 sm:px-8 bg-slate-50 relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-gray-900">
              What I{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Do
              </span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">
              Specialized areas I can contribute to
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 sm:p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
              >
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 mb-5 text-sm sm:text-base leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center text-gray-600 text-xs sm:text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2.5 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section
        id="projects"
        className="py-20 sm:py-24 md:py-28 px-5 sm:px-8 bg-white relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-gray-900">
              Featured{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">
              A selection of work I'm proud of
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-5 sm:gap-6">
            {projects.map((project, idx) => (
              <ProjectCard key={idx} project={project} index={idx} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="https://github.com/aroien"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all text-sm font-medium shadow-sm"
            >
              <Github size={17} />
              See more on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section
        id="skills"
        className="py-20 sm:py-24 md:py-28 px-5 sm:px-8 bg-slate-50 relative z-10"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-gray-900">
              Skills &{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Technologies
              </span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">
              Tools and technologies I work with
            </p>
          </div>

          <div className="space-y-5">
            {skillCategories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 sm:p-8 border border-gray-100 shadow-sm"
              >
                <h3 className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-5">
                  {cat.category}
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {cat.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-slate-50 text-gray-700 rounded-xl text-sm font-medium border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section
        id="contact"
        className="py-20 sm:py-24 md:py-28 px-5 sm:px-8 bg-white relative z-10"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-gray-900">
              Let's{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Connect
              </span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
              I'm actively looking for frontend engineering roles. Whether you
              have an opportunity or just want to talk — my inbox is open.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mb-12">
            <a
              href="mailto:admin@mmehedi.me"
              title="Email"
              className="p-4 bg-white border border-gray-200 text-gray-500 rounded-2xl shadow-sm hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md transition-all"
            >
              <Mail size={22} />
            </a>
            <a
              href="https://github.com/aroien"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="p-4 bg-white border border-gray-200 text-gray-500 rounded-2xl shadow-sm hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md transition-all"
            >
              <Github size={22} />
            </a>
            <a
              href="https://www.linkedin.com/in/momehedi/"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="p-4 bg-white border border-gray-200 text-gray-500 rounded-2xl shadow-sm hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md transition-all"
            >
              <Linkedin size={22} />
            </a>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-7 sm:p-10 border border-gray-100 shadow-sm">
            <h3 className="text-2xl sm:text-3xl font-bold mb-7 text-gray-900">
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 mb-2 font-medium text-sm"
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
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all disabled:opacity-50 text-sm sm:text-base"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 mb-2 font-medium text-sm"
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
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all disabled:opacity-50 text-sm sm:text-base"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-700 mb-2 font-medium text-sm"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  rows="6"
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none disabled:opacity-50 text-sm sm:text-base"
                  placeholder="Tell me about the role or project..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all"
              >
                <Send size={18} />
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-5 sm:px-8 bg-gray-900 text-center relative z-10">
        <p className="text-gray-400 text-sm mb-1">
          &copy; {currentYear()} M. Mehedi — Frontend Developer
        </p>
        <p className="text-gray-600 text-xs">
          Built with React &amp; Tailwind CSS
        </p>
      </footer>
    </div>
  );
}

export default App;
