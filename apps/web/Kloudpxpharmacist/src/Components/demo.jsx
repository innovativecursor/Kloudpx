"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useProductContext } from "@/app/contexts/ProductContext";

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");

  const { getItemsByCategory, filteredItems } = useProductContext();

  useEffect(() => {
    if (categoryId) {
      getItemsByCategory(categoryId);
    }
  }, [categoryId]);

  console.log(filteredItems);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Filtered Products</h1>

      {/* {filteredItems.loading ? (
        <p>Loading...</p>
      ) : filteredItems.data.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {filteredItems.data.map((item) => (
            <div key={item.ID} className="border p-3 rounded shadow">
              <p className="text-sm font-medium">{item.name}</p>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default ProductsPage;
