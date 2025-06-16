'use client'

import React, { useState, useRef, useEffect } from 'react'

const Prescription = () => {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef(null)

    // Close popup on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    return (
        <>
            <div className="flex justify-center">
                <div className="flex justify-center sm:mt-9 mt-6 md:w-1/2 w-[80%]">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-[#0070BA]/6 text-gray-600 hover:bg-[#0070BA]/20 hover:text-[#0070BA] w-full px-6 md:py-5 sm:py-3 py-2 rounded-md cursor-pointer md:text-sm text-xs font-medium flex justify-center gap-3 items-center"
                    >
                        <img
                            src="/assets/prescription.png"
                            alt="Upload"
                            className="w-6 h-6 object-contain"
                        />Upload Prescription
                    </button>
                </div>
            </div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 z-40"></div>

                    <div
                        ref={menuRef}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                       bg-white p-6 rounded-md shadow-md z-50 w-full max-w-md"
                    >
                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Upload
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Prescription
