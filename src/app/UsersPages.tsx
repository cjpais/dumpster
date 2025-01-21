"use client";

import usePagesStore from "@/lib/usePagesStore";
import React from "react";

const UsersPages = () => {
  const { pages } = usePagesStore();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Your Pages</h1>
      <div className="grid gap-3">
        {pages.map((page) => (
          <div
            key={page.id}
            className="flex items-center justify-between bg-white rounded p-3 shadow-sm hover:shadow transition-shadow"
          >
            <a
              href={`/${page.slug}`}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {page.slug}
            </a>
            <a
              href={`/edit/${page.editId}`}
              className="text-gray-500 hover:text-gray-700"
            >
              Edit
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPages;
