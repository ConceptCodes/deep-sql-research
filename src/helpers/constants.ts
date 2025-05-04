export enum Nodes {
  GENERATE_RESEARCH_PLAN = "GENERATE_RESEARCH_PLAN",
  REVIEW_PLAN = "REVIEW_PLAN",

  ASSIGN_TASK = "ASSIGN_TASK",
  GENERATE_QUERY = "GENERATE_QUERY",
  EXECUTE_QUERY = "EXECUTE_QUERY",

  BUILD_SECTION = "BUILD_SECTION",
  SEARCH = "SEARCH",
  WRITE_SECTION = "WRITE_SECTION",
  GATHER_COMPLETED_SECTIONS = "GATHER_COMPLETED_SECTIONS",
  WRITE_FINAL_SECTIONS = "WRITE_FINAL_SECTIONS",
  COMPILE_FINAL_REPORT = "COMPILE_FINAL_REPORT",
}

export const DEFAULT_REPORT_STRUCTURE = `Use this structure to create a report on the user-provided topic:

1. Introduction (no research needed)
   - Brief overview of the topic area

2. Main Body Sections (2-5 sections):
   - Each section should focus on a sub-topic of the user-provided topic
   
3. Conclusion (summarize the main points of the report)
   - Aim for 1 structural element (either a list of table) that distills the main body sections 
   - Provide a concise summary of the report
`;
