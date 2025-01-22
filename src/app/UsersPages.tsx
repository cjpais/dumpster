"use client";

import usePagesStore from "@/lib/usePagesStore";
import React from "react";

const UsersPages = () => {
  const { pages } = usePagesStore();

  return (
    <div className="flex gap-4 w-full">
      <div className="flex-1">
        <h1 className="text-xl font-semibold mb-4">ur dumpsters</h1>
        <div className="flex flex-col gap-3">
          {pages.map((page) => (
            <div key={page.id} className="flex items-center justify-between">
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
      <div className="flex-1 text-right">
        <h1 className="text-xl font-semibold mb-4 ">dumpsters u dove in</h1>
        <b>coming soon.</b>
        {/* <div className="flex flex-col gap-3">
            {pages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between bg-white rounded p-3"
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
          </div> */}
      </div>
    </div>
  );
};

export default UsersPages;
