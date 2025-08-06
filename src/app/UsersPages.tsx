"use client";

import usePagesStore from "@/lib/usePagesStore";
import React, { useMemo } from "react";

const formatLastVisited = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60),
  );

  if (diffInHours < 1) {
    return "now";
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
};

const UsersPages = () => {
  const { pages } = usePagesStore();

  const { ownedPages, visitedPages } = useMemo(() => {
    const owned = pages.filter((page) => page.editId);
    const visited = pages.filter((page) => !page.editId);

    // Sort by most recently visited
    owned.sort((a, b) => b.lastVisited - a.lastVisited);
    visited.sort((a, b) => b.lastVisited - a.lastVisited);

    return { ownedPages: owned, visitedPages: visited };
  }, [pages]);

  return (
    <div className="flex gap-8 w-full">
      {/* Your Dumpsters */}
      <div className="flex-1">
        <h1 className="text-xl font-semibold mb-4 text-gray-900">
          Your Dumpsters
        </h1>
        {ownedPages.length === 0 ? (
          <p className="text-gray-500 italic">No dumpsters created yet</p>
        ) : (
          <div className="flex flex-col gap-3">
            {ownedPages.map((page) => (
              <div
                key={page.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <a
                      href={`/${page.slug}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-lg"
                    >
                      {page.slug}
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      Last visited {formatLastVisited(page.lastVisited)}
                    </p>
                  </div>
                  <a
                    href={`/edit/${page.editId}`}
                    className="ml-4 px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Edit
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dumpsters You Dove In */}
      <div className="flex-1">
        <h1 className="text-xl font-semibold mb-4 text-gray-900">
          Dumpsters You Dove In
        </h1>
        {visitedPages.length === 0 ? (
          <p className="text-gray-500 italic">No dumpsters visited yet</p>
        ) : (
          <div className="flex flex-col gap-3">
            {visitedPages.map((page) => (
              <div
                key={page.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <a
                      href={`/${page.slug}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-lg"
                    >
                      {page.slug}
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      Last visited {formatLastVisited(page.lastVisited)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPages;
