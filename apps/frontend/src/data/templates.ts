interface Template {
  id: number;
  name: string;
  placeholderSchema: string[];
}

const placeholderSchema = [
  "Recipient Name",
  "Project Name",
  "Date",
  "Main Goal",
  "Milestone 1",
  "Milestone 2",
  "Milestone 3",
  "Department",
  "Deadline Date",
  "Document Name",
  "Proposed Date",
  "Your Full Name",
  "Your Job Title",
  "Company Name",
  "Phone Number",
];

export const templates: Template[] = [
  {
    id: 1,
    name: "Project Update Letter",
    placeholderSchema,
  },
  {
    id: 2,
    name: "Client Progress Report",
    placeholderSchema,
  },
  {
    id: 3,
    name: "Milestone Summary Letter",
    placeholderSchema,
  },
  {
    id: 4,
    name: "Weekly Status Update",
    placeholderSchema,
  },
  {
    id: 5,
    name: "Project Completion Notice",
    placeholderSchema,
  },
  {
    id: 6,
    name: "Stakeholder Update Letter",
    placeholderSchema,
  },
];
