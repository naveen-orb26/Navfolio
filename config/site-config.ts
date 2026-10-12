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
    "Tell me about Naveen's 3 research papers and ongoing publications.",
    "What did Naveen accomplish during his internships at BRFL and ANU?",
    "What are Naveen's leadership roles in Student Welfare and Rotaract?",
    "Tell me about Naveen's education at VIT Chennai and Narayana.",
    "What is FLUXMIND and how does the DER dispatch engine work?"
  ],
  navItems: [
    { label: "Overview", href: "#hero" },
    { label: "Projects", href: "#projects" },
    { label: "Tech Stack", href: "#tech-stack" },
    { label: "Education", href: "#education" },
    { label: "Research", href: "#research" },
    { label: "Experience", href: "#experience" },
    { label: "Leadership", href: "#leadership" },
    { label: "Hobbies & Skills", href: "#hobbies" }
  ]
};
