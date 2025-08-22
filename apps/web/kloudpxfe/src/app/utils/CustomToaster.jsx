"use client";

import { Toaster } from "react-hot-toast";

const IconWrapper = ({ children, color }) => (
  <div
    style={{
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: `${color}33`, 
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "pulse 1.5s ease-in-out infinite",
    }}
  >
    {children}
  </div>
);

const SuccessIcon = () => (
  <IconWrapper color="#22c55e">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#22c55e"
      viewBox="0 0 24 24"
      width="20"
      height="20"
    >
      <path d="M9 16.2l-3.5-3.5 1.41-1.41L9 13.38l7.09-7.09 1.41 1.41z" />
    </svg>
  </IconWrapper>
);

const ErrorIcon = () => (
  <IconWrapper color="#f87171">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#f87171"
      viewBox="0 0 24 24"
      width="20"
      height="20"
    >
      <path d="M18.3 5.71l-1.41-1.41L12 9.59 7.11 4.7 5.7 6.11 10.59 11 5.7 15.89l1.41 1.41L12 12.41l4.89 4.89 1.41-1.41L13.41 11z" />
    </svg>
  </IconWrapper>
);

const LoadingIcon = () => (
  <IconWrapper color="#3b82f6">
    <svg
      className="spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="#3b82f6"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="20"
      height="20"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="#3b82f6"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  </IconWrapper>
);

export default function CustomToaster() {
  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .spin {
          animation: spin 1.5s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#121212",
            color: "#e0e0e0",
            borderRadius: "14px",
            padding: "14px 20px",
            fontWeight: "600",
            fontSize: "15px",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            maxWidth: "360px",
            border: "1.5px solid #272727",
          },
          success: {
            icon: <SuccessIcon />,
            style: {
              background: "#1f2a20",
              color: "#22c55e",
              border: "1.5px solid #22c55e",
            },
          },
          error: {
            icon: <ErrorIcon />,
            style: {
              background: "#3a1a1a",
              color: "#f87171",
              border: "1.5px solid #f87171",
            },
          },
          loading: {
            icon: <LoadingIcon />,
            style: {
              background: "#1e2a47",
              color: "#3b82f6",
              border: "1.5px solid #3b82f6",
            },
          },
        }}
      />
    </>
  );
}
