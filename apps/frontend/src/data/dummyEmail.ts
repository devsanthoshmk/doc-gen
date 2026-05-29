export interface EmailDraft {
  to: string;
  subject: string;
  body: string;
}

export const dummyEmail: EmailDraft = {
  to: "john.smith@acmecorp.com",
  subject: "Project Update: Mobile App Redesign - June 2025",
  body: `Dear John Smith,

I hope this email finds you well. I'm writing to provide you with an update on the Mobile App Redesign project at Acme Corp.

We are pleased to report significant progress on this project. Our team has completed the initial UI wireframes with a 40% efficiency increase over our initial projections. Additionally, we have finalized the budget allocation for Q3, which positions us well for the remaining phases of development. Most recently, we conducted a comprehensive stakeholder review where we received valuable feedback on the design system that will enhance the final deliverable.

The project remains on track with a deadline of July 30, 2025. Our Design and Development department is committed to delivering a fully redesigned mobile application that meets all project objectives and exceeds stakeholder expectations.

I would like to propose a meeting on June 20, 2025 at 2:00 PM to discuss the next phase of development, address any questions you may have, and review the progress to date.

Please feel free to reach out if you require any additional information or would like to discuss this matter further. I look forward to our continued collaboration on this important project.

Best regards,

Sarah Johnson
Project Manager
Mergex
+91 90421 72025`,
};
