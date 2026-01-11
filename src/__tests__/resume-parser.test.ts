import { parseWithRegex } from '@/lib/resumeParser';

describe('resumeParser.parseWithRegex', () => {
  test('extracts basic fields', () => {
    const text = `John Doe\njohn.doe@example.com\n+1 (555) 123-4567\nSkills: JavaScript, React, Node.js\n`;
    const parsed = parseWithRegex(text);

    expect(parsed.name).toBe('John Doe');
    expect(parsed.email).toBe('john.doe@example.com');
    expect(parsed.phone).toMatch(/555/);
    expect(parsed.skills).toContain('JavaScript');
    expect(parsed.skills).toContain('React');
  });
});
