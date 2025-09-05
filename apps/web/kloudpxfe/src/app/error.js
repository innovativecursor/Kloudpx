"use client";

export default function GlobalError({ error, reset }) {
    console.log(error);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <h1 className="text-2xl font-bold text-red-600 mb-2">
                Oops!
            </h1>
            <p className="text-gray-700 mb-4">{error?.message}</p>
            <button
                onClick={() => reset()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Try Again
            </button>
        </div>
    );
}
