import { DEVELOPER_PROFILE } from './profile-knowledge';

export const SITE_CONFIG = {
  name: DEVELOPER_PROFILE.name,
  title: `${DEVELOPER_PROFILE.name} | ${DEVELOPER_PROFILE.title}`,
  description: DEVELOPER_PROFILE.tagline,
  url: "https://naveen-ai-portfolio.vercel.app",
  ogImage: "/og-image.png",
  author: DEVELOPER_PROFILE.name,
  links: {
    github: DEVELOPER_PROFILE.contact.github,
    linkedin: DEVELOPER_PROFILE.contact.linkedin,
    twitter: DEVELOPER_PROFILE.contact.twitter,
    email: DEVELOPER_PROFILE.contact.email,
  },
  starterPrompts: [
    "What are Naveen's core AI skills?",
    "Tell me about Nexus Agentic OS.",
    "Why hire Naveen as an AI Systems Architect?",
    "How does Naveen prevent prompt injection?",
    "What is Naveen's experience with Three.js WebGL?"
  ],
  navItems: [
    { label: "Overview", href: "#hero" },
    { label: "AI Agent", href: "#ai-chat" },
    { label: "Projects", href: "#projects" },
    { label: "Tech Stack", href: "#tech-stack" },
    { label: "Experience", href: "#experience" }
  ]
};
