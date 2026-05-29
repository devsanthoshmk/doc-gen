import React from "react";
import { IconCheck } from "@tabler/icons-react";

interface StepperProps {
  currentStep: number;
}

const labels = [
  "Select Template",
  "Generate & Review Document",
  "Generate & Review Email",
  "Success",
];

export default function Stepper({ currentStep }: StepperProps) {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "20px",
  };

  const stepperStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: "0",
    maxWidth: "900px",
    width: "100%",
  };

  const stepWrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    position: "relative",
  };

  const getStepCircleStyle = (stepNumber: number): React.CSSProperties => {
    let backgroundColor: string;
    let borderColor: string;
    let textColor: string;
    let boxShadow: string | undefined;

    if (currentStep > stepNumber) {
      // Completed step
      backgroundColor = "#5d3fd3";
      borderColor = "#5d3fd3";
      textColor = "#ffffff";
    } else if (currentStep === stepNumber) {
      // Current step
      backgroundColor = "#5d3fd3";
      borderColor = "#5d3fd3";
      textColor = "#ffffff";
      boxShadow = "0 0 0 4px rgba(93,63,211,0.15)";
    } else {
      // Upcoming step
      backgroundColor = "#ffffff";
      borderColor = "#d1d5db";
      textColor = "#9ca3af";
    }

    return {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      backgroundColor,
      border: `2px solid ${borderColor}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      fontWeight: 700,
      color: textColor,
      zIndex: 10,
      flexShrink: 0,
      boxShadow,
    };
  };

  const getStepLabelStyle = (stepNumber: number): React.CSSProperties => {
    const isCompletedOrCurrent = currentStep >= stepNumber;

    return {
      marginTop: "10px",
      fontSize: "13px",
      fontWeight: isCompletedOrCurrent ? 600 : 400,
      color: isCompletedOrCurrent ? "#5d3fd3" : "#9ca3af",
      textAlign: "center",
      maxWidth: "100px",
      fontFamily: "DM Sans, sans-serif",
    };
  };

  const getLineStyle = (stepNumber: number): React.CSSProperties => {
    const isLeftStepCompleted = currentStep > stepNumber;

    return {
      position: "absolute",
      top: "25px",
      left: "calc(50% + 25px)",
      width: "calc(100% - 25px)",
      height: "2px",
      backgroundColor: isLeftStepCompleted ? "#5d3fd3" : "#e5e7eb",
      zIndex: 1,
    };
  };

  const renderStepContent = (stepNumber: number): React.ReactNode => {
    if (currentStep > stepNumber) {
      return <IconCheck size={18} />;
    }
    return stepNumber;
  };

  return (
    <div style={containerStyle}>
      <div style={stepperStyle}>
        {labels.map((label, index) => {
          const stepNumber = index + 1;
          return (
            <div key={stepNumber} style={stepWrapperStyle}>
              {/* Connecting line */}
              {index < labels.length - 1 && (
                <div style={getLineStyle(stepNumber)}></div>
              )}

              {/* Step circle */}
              <div style={getStepCircleStyle(stepNumber)}>
                {renderStepContent(stepNumber)}
              </div>

              {/* Step label */}
              <div style={getStepLabelStyle(stepNumber)}>{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
