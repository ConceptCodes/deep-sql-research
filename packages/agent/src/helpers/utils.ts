import type { Section } from "@shared/types";

export const formatSections = (sections: Section[]): string => {
  let formatted_str = "";
  sections.forEach((section, index) => {
    const idx = index + 1;
    const separator = "=".repeat(60);
    formatted_str += `
${separator}
Section ${idx}: ${section.title} 
${separator}
Description: ${section.description}

Content: ${section.content}"}
`;
  });
  return formatted_str.trim();
};
