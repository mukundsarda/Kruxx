import React from "react";

const Collections = () => {
  return (
    <section className="py-10 text-center">
      <h2 className="text-2xl font-bold">Collections</h2>
      <div className="flex justify-center gap-6 mt-6 flex-wrap">
        <div className="bg-gray-100 p-6 rounded-lg w-48 shadow-lg text-center">
          <h3 className="text-lg font-semibold">My Collection</h3>
          <p>0 questions</p>
        </div>
        <div className="bg-gray-200 p-6 rounded-lg w-48 border-2 border-dashed border-gray-400 text-center">
          <h3 className="text-lg font-semibold">Add New Collection</h3>
        </div>
      </div>
    </section>
  );
};

export default Collections;
