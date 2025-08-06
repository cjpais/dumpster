"use client";

import { useEffect, ReactNode } from "react";
import usePagesStore from "@/lib/usePagesStore";

interface PageWrapperProps {
  pageData: {
    id: number;
    slug: string;
  };
  children: ReactNode;
}

const PageWrapper = ({ pageData, children }: PageWrapperProps) => {
  const upsertPage = usePagesStore((state) => state.upsertPage);

  useEffect(() => {
    // Upsert page without editId - keeping editId server-side only
    upsertPage({
      id: pageData.id,
      slug: pageData.slug,
      lastVisited: Date.now(),
    });
  }, [pageData.id, pageData.slug, upsertPage]);

  return <>{children}</>;
};

export default PageWrapper;
