"use client";

import { LocalPage } from "@/lib/types";
import usePagesStore from "@/lib/usePagesStore";
import React, { useEffect, useCallback } from "react";

const LocalPageProvider = ({
  page,
  children,
}: {
  page: LocalPage;
  children: React.ReactNode;
}) => {
  const { upsertPage } = usePagesStore();

  useEffect(() => {
    upsertPage(page);
  }, [page, upsertPage]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/${page.slug}`
      );
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }, [page.slug]);

  return (
    <>
      <div className="absolute top-0 left-[85%] -translate-x-1/2 z-50 bg-white/80 backdrop-blur-sm px-10 py-2 rounded-b-xl shadow-md">
        <div className="flex items-center gap-4">
          <a
            href={`/${page.slug}`}
            className="text-gray-800 hover:text-gray-600 font-medium flex items-center justify-center gap-2"
          >
            editing /{page.slug}
            <span className="text-sm">&#8599;</span>
          </a>
          <button
            onClick={copyToClipboard}
            className="text-gray-800 hover:text-gray-600 cursor-pointer"
            title="Copy link"
          >
            &#128279;
          </button>
        </div>
      </div>
      {children}
    </>
  );
};

export default LocalPageProvider;
