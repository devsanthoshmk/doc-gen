import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GenerateProvider } from "./context/GenerateContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import SelectTemplate from "./pages/SelectTemplate";
import EnterContent from "./pages/EnterContent";
import ReviewEmail from "./pages/ReviewEmail";
import Success from "./pages/Success";
import TemplateLibrary from "./pages/TemplateLibrary";
import UploadTemplate from "./pages/UploadTemplate";
import TemplateEditor from "./pages/TemplateEditor";
import DocumentHistory from "./pages/DocumentHistory";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <GenerateProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/generate/select-template"
            element={
              <Layout>
                <SelectTemplate />
              </Layout>
            }
          />
          <Route
            path="/generate/enter-content"
            element={
              <Layout>
                <EnterContent />
              </Layout>
            }
          />
          <Route
            path="/generate/review-email"
            element={
              <Layout>
                <ReviewEmail />
              </Layout>
            }
          />
          <Route
            path="/generate/success"
            element={
              <Layout>
                <Success />
              </Layout>
            }
          />
          <Route
            path="/templates"
            element={
              <Layout>
                <TemplateLibrary />
              </Layout>
            }
          />
          <Route
            path="/templates/upload"
            element={
              <Layout>
                <UploadTemplate />
              </Layout>
            }
          />
          <Route
            path="/templates/editor"
            element={
              <Layout>
                <TemplateEditor />
              </Layout>
            }
          />
          <Route
            path="/history"
            element={
              <Layout>
                <DocumentHistory />
              </Layout>
            }
          />
        </Routes>
      </GenerateProvider>
    </BrowserRouter>
  );
};
export default App;
