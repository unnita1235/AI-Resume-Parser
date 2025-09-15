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
    if (trimmedLine.startsWith('[') && trimmedLine.endsWith(']')) {
      if (currentSection) {
        if(currentEntry) currentSection.entries.push(currentEntry);
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

    if (trimmedLine.startsWith('- ')) { // Bullet point
      if (!currentEntry) {
         currentEntry = { title: "Details", details: [] };
      }
      currentEntry.details.push(trimmedLine.substring(2).trim());
    } else {
      // It's a new entry (job title, school, etc.)
      if (currentEntry && currentSection) {
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

      // Check if next line is a subtitle (indented or italicized pattern can be complex, simple check for now)
      // This simple parser assumes the next line after a title line might be a subtitle.
    }
  });

  if (currentSection) {
    if(currentEntry) currentSection.entries.push(currentEntry);
    sections.push(currentSection);
  }

  // A special pass for EXPERIENCE and EDUCATION to find subtitles
  sections.forEach(section => {
    if (section.title.toUpperCase() === 'EXPERIENCE' || section.title.toUpperCase() === 'EDUCATION') {
      let tempEntries: ResumeEntry[] = [];
      let i = 0;
      while(i < section.entries.length) {
        let entry = section.entries[i];
        if (i + 1 < section.entries.length) {
            let nextEntry = section.entries[i+1];
            if(!nextEntry.date && nextEntry.details.length === 0) {
                entry.subtitle = nextEntry.title;
                i++; // consume next entry as subtitle
            }
        }
        tempEntries.push(entry);
        i++;
      }
      section.entries = tempEntries;
    }
  });


  return { name, contact, sections };
}
