export type Language = "EN" | "ES";

export interface Social {
  name: string;
  url: string;
  className: string;
}

export interface Address {
  street?: string;
  city: string;
  state: string;
  zip: string;
}

export interface MainData {
  name: string;
  occupation: string;
  description: string;
  image: string;
  bio: string;
  contactmessage: string;
  email: string;
  phone: string;
  address: Address;
  website: string;
  resumedownload: string;
  social: Social[];
}

export interface Education {
  school: string;
  degree: string;
  graduated: string;
  description: string;
}

export interface Work {
  company: string;
  title: string;
  years: string;
  description: string;
}

export interface Skill {
  name: string;
  level: string;
}

export interface ResumeData {
  skillmessage: string;
  education: Education[];
  work: Work[];
  skills: Skill[];
}

export interface Project {
  title: string;
  category: string;
  image: string;
  url: string;
}

export interface PortfolioData {
  projects: Project[];
}

export interface Testimonial {
  text: string;
  user: string;
  profile: string;
}

export interface TestimonialsData {
  testimonials: Testimonial[];
}

export interface FullResumeData {
  main: MainData;
  resume: ResumeData;
  portfolio: PortfolioData;
  testimonials: TestimonialsData;
}
