import React, { createContext, useState } from "react";
import type { ReactNode } from "react";

interface GeneratedEmail {
  to: string;
  subject: string;
  body: string;
}

interface GenerateContextType {
  selectedTemplate: string; // template display name
  setSelectedTemplate: (template: string) => void;
  templateId: string;
  setTemplateId: (id: string) => void;
  content: string;
  setContent: (content: string) => void;
  generatedDocument: string;
  setGeneratedDocument: (document: string) => void;
  documentId: string;
  setDocumentId: (id: string) => void;
  structuredData: Record<string, unknown>;
  setStructuredData: (data: Record<string, unknown>) => void;
  outputUrl: string;
  setOutputUrl: (url: string) => void;
  generatedEmail: GeneratedEmail;
  setGeneratedEmail: (email: GeneratedEmail) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const GenerateContext = createContext<GenerateContextType | undefined>(
  undefined,
);

interface GenerateProviderProps {
  children: ReactNode;
}

export const GenerateProvider: React.FC<GenerateProviderProps> = ({
  children,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [templateId, setTemplateId] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [generatedDocument, setGeneratedDocument] = useState<string>("");
  const [documentId, setDocumentId] = useState<string>("");
  const [structuredData, setStructuredData] = useState<Record<string, unknown>>(
    {},
  );
  const [outputUrl, setOutputUrl] = useState<string>("");
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmail>({
    to: "",
    subject: "",
    body: "",
  });

  const value: GenerateContextType = {
    selectedTemplate,
    setSelectedTemplate,
    templateId,
    setTemplateId,
    content,
    setContent,
    generatedDocument,
    setGeneratedDocument,
    documentId,
    setDocumentId,
    structuredData,
    setStructuredData,
    outputUrl,
    setOutputUrl,
    generatedEmail,
    setGeneratedEmail,
  };

  return (
    <GenerateContext.Provider value={value}>
      {children}
    </GenerateContext.Provider>
  );
};
