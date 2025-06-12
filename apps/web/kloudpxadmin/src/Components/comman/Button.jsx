import React from 'react';

const Button = ({ text, disabled = false, loading = false, onClick, type = "button", className = "" }) => {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={` font-semibold py-3 rounded-md transition flex justify-center items-center gap-2
        ${disabled || loading
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-[#0070BA] hover:bg-[#005f8d] cursor-pointer text-white'
                } ${className}`}
        >
            {loading && (
                <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                    ></path>
                </svg>
            )}
            <span>{text}</span>
        </button>
    );
};

export default Button;
