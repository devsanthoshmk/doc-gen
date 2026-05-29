import React, { createContext, useState } from "react";
import type { ReactNode } from "react";

interface GeneratedEmail {
  to: string;
  subject: string;
  body: string;
}

interface GenerateContextType {
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  content: string;
  setContent: (content: string) => void;
  generatedDocument: string;
  setGeneratedDocument: (document: string) => void;
  generatedEmail: GeneratedEmail;
  setGeneratedEmail: (email: GeneratedEmail) => void;
}

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
  const [content, setContent] = useState<string>("");
  const [generatedDocument, setGeneratedDocument] = useState<string>("");
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmail>({
    to: "",
    subject: "",
    body: "",
  });

  const value: GenerateContextType = {
    selectedTemplate,
    setSelectedTemplate,
    content,
    setContent,
    generatedDocument,
    setGeneratedDocument,
    generatedEmail,
    setGeneratedEmail,
  };

  return (
    <GenerateContext.Provider value={value}>
      {children}
    </GenerateContext.Provider>
  );
};
