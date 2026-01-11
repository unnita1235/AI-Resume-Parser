export interface ParsedResume {
  name: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  skills: string[];
  experience: string[];
  education: string[];
  summary: string;
}

export function parseWithRegex(text: string): ParsedResume {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const linkedinRegex = /linkedin\.com\/in\/([\w\-]+)|linkedin\.com\/company\/([\w\-]+)/i;
  const githubRegex = /github\.com\/([\w\-]+)/i;

  const skillsKeywords = [
    'Python','JavaScript','TypeScript','Java','C++','C#','PHP','Ruby','Go','Rust','React','Vue.js','Vue','Angular','Node.js','Express','Django','Flask','Spring','FastAPI','MongoDB','PostgreSQL','MySQL','Redis','Elasticsearch','Docker','Kubernetes','AWS','Azure','GCP','Jenkins','Git','GraphQL','REST','SOAP','Machine Learning','TensorFlow','PyTorch','Data Analysis','Pandas','NumPy','HTML','CSS','SCSS','Tailwind','Bootstrap','SQL','NoSQL','Agile','Scrum','CI/CD'
  ];

  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  const name = lines[0]?.trim() ?? null;

  const emailMatch = text.match(emailRegex);
  const phoneMatch = text.match(phoneRegex);
  const linkedinMatch = text.match(linkedinRegex);
  const githubMatch = text.match(githubRegex);

  const foundSkills: string[] = [];
  skillsKeywords.forEach((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(^|[\\s,])(${escaped})($|[\\s,])`, 'i');
    if (pattern.test(text)) foundSkills.push(skill);
  });

  return {
    name,
    email: emailMatch?.[0] ?? null,
    phone: phoneMatch?.[0] ?? null,
    linkedin: linkedinMatch?.[0] ?? null,
    github: githubMatch?.[0] ?? null,
    skills: foundSkills,
    experience: [],
    education: [],
    summary: text.substring(0, 500),
  };
}
