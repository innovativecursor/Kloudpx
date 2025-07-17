import React, { useState } from "react";
import Title from "../comman/Title";
import Button from "../comman/Button";

const AddSupplier = () => {
    const [formData, setFormData] = useState({
        supplierName: "",
        supplierProduct: "",
        discount: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log("Form Submitted:", formData);
    };

    return (
        <div className="flex justify-center items-center mb-20">
            <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md border mt-20 border-gray-200 p-8 shadow-xl rounded-2xl">
                <div className="mb-8 text-center">
                    <Title text="Add Supplier" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-9">
                    {/* Supplier Name */}
                    <div className="relative">
                        <label
                            htmlFor="supplierName"
                            className="absolute -top-3.5 left-3 text-sm font-medium text-gray-600 bg-white px-1"
                        >
                            Supplier Name
                        </label>
                        <input
                            type="text"
                            name="supplierName"
                            id="supplierName"
                            value={formData.supplierName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-inner text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter supplier name"
                            required
                        />
                    </div>

                    {/* Supplier Product */}
                    <div className="relative">
                        <label
                            htmlFor="supplierProduct"
                            className="absolute -top-3.5 left-3 text-sm font-medium text-gray-600 bg-white px-1"
                        >
                            Supplier Product
                        </label>
                        <input
                            type="text"
                            name="supplierProduct"
                            id="supplierProduct"
                            value={formData.supplierProduct}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-inner text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter product name"
                            required
                        />
                    </div>

                    {/* Discount */}
                    <div className="relative">
                        <label
                            htmlFor="discount"
                            className="absolute -top-3.5 left-3 text-sm font-medium text-gray-600 bg-white px-1"
                        >
                            Discount (%)
                        </label>
                        <input
                            type="number"
                            name="discount"
                            id="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-inner text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter discount"
                        />
                    </div>

                    <div className="flex justify-center ">
                        <Button className="w-72" text="Submit" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSupplier;