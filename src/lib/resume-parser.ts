export interface ResumeEntry {
  title: string;
  subtitle?: string;
  date?: string;
  details: string[];
}

export interface ResumeSection {
  title: string;
  entries: ResumeEntry[];
}

export interface ParsedResume {
  name: string;
  contact: string[];
  sections: ResumeSection[];
}

function isSectionHeader(trimmedLine: string): boolean {
  return trimmedLine.startsWith('[') && trimmedLine.endsWith(']');
}

function isBulletPoint(trimmedLine: string): boolean {
  return trimmedLine.startsWith('- ');
}

function extractSubtitles(entries: ResumeEntry[]): ResumeEntry[] {
  const tempEntries: ResumeEntry[] = [];
  let i = 0;
  while (i < entries.length) {
    const entry = entries[i];
    if (i + 1 < entries.length) {
      const nextEntry = entries[i + 1];
      if (!nextEntry.date && nextEntry.details.length === 0) {
        entry.subtitle = nextEntry.title;
        i++;
      }
    }
    tempEntries.push(entry);
    i++;
  }
  return tempEntries;
}

export function parseResume(text: string): ParsedResume {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  if (lines.length === 0) {
    return { name: 'Your Name', contact: [], sections: [] };
  }

  const name = lines.shift() || 'Your Name';
  const contact = (lines.shift() || '').split('|').map(item => item.trim());

  const sections: ResumeSection[] = [];
  let currentSection: ResumeSection | null = null;
  let currentEntry: ResumeEntry | null = null;

  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    // Check for section headers (e.g., [EXPERIENCE])
    if (isSectionHeader(trimmedLine)) {
      if (currentSection) {
        if(currentEntry) {
          currentSection.entries.push(currentEntry);
        }
        sections.push(currentSection);
      }
      currentSection = {
        title: trimmedLine.substring(1, trimmedLine.length - 1).trim(),
        entries: []
      };
      currentEntry = null;
      return;
    }

    if (!currentSection) return;

    if (isBulletPoint(trimmedLine)) {
      if (!currentEntry) {
         currentEntry = { title: "Details", details: [] };
      }
      currentEntry.details.push(trimmedLine.substring(2).trim());
    } else {
      // It's a new entry (job title, school, etc.)
      if (currentEntry) {
        currentSection.entries.push(currentEntry);
      }
      
      const parts = trimmedLine.split('|').map(p => p.trim());
      const title = parts[0] || '';
      const date = parts.length > 1 ? parts[1] : undefined;

      currentEntry = {
        title,
        date,
        details: []
      };
    }
  });

  // Add the last section and entry
  if (currentSection) {
    if(currentEntry) {
      (currentSection as ResumeSection).entries.push(currentEntry);
    }
    sections.push(currentSection);
  }

  // A special pass for EXPERIENCE and EDUCATION to find subtitles
  sections.forEach(section => {
    if (section.title.toUpperCase() === 'EXPERIENCE' || section.title.toUpperCase() === 'EDUCATION') {
      section.entries = extractSubtitles(section.entries);
    }
  });

  return { name, contact, sections };
}