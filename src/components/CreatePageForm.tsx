// app/components/CreatePageForm.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { debounce } from "es-toolkit";

interface CreatePageFormProps {
  checkSlug: (slug: string) => Promise<boolean>;
  createPage: (
    slug: string
  ) => Promise<{ success: boolean; editId?: string; error?: string }>;
}

export default function CreatePageForm({
  checkSlug,
  createPage,
}: CreatePageFormProps) {
  const [slug, setSlug] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [createdPage, setCreatedPage] = useState<{
    slug: string;
    editId: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Create debounced function using useCallback
  const debouncedCheck = useCallback(
    debounce(async (value: string) => {
      if (!value) {
        setIsAvailable(null);
        return;
      }

      setIsChecking(true);
      try {
        const available = await checkSlug(value);
        setIsAvailable(available);
      } catch (err) {
        setError("Error checking slug availability");
      } finally {
        setIsChecking(false);
      }
    }, 300),
    [checkSlug] // Dependencies array
  );

  // Cleanup the debounced function on component unmount
  useEffect(() => {
    return () => {
      debouncedCheck.cancel();
    };
  }, [debouncedCheck]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    setSlug(value);
    debouncedCheck(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !isAvailable) return;

    try {
      const result = await createPage(slug);
      if (result.success && result.editId) {
        setCreatedPage({ slug, editId: result.editId });
        setError(null);
      } else {
        setError(result.error || "Failed to create page");
      }
    } catch (err) {
      setError("Error creating page");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-300"
          >
            Page URL
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={handleSlugChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-2 py-1 text-gray-800"
              placeholder="enter-your-slug"
            />
            {isChecking && (
              <div className="text-sm text-gray-500 mt-1">
                Checking availability...
              </div>
            )}
            {!isChecking && isAvailable !== null && (
              <div
                className={`text-sm mt-1 ${
                  isAvailable ? "text-green-600" : "text-red-600"
                }`}
              >
                {isAvailable
                  ? `${slug} is available!`
                  : `${slug} is already taken`}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isAvailable || !slug}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          Create Page
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {createdPage && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
          <p>Page created successfully!</p>
          <p className="mt-2">
            <a
              href={`/${createdPage.slug}`}
              className="text-blue-600 hover:underline"
            >
              View your page
            </a>
          </p>
          <p className="mt-2">
            <a
              href={`/edit/${createdPage.editId}`}
              className="text-blue-600 hover:underline"
            >
              Edit your page
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
