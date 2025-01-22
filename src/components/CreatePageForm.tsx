// app/components/CreatePageForm.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { debounce } from "es-toolkit";

interface CreatePageFormProps {
  checkSlug: (slug: string) => Promise<boolean>;
  createPage: (params: {
    slug: string;
    title: string;
    description?: string;
  }) => Promise<{ success: boolean; editId?: string; error?: string }>;
}

export default function CreatePageForm({
  checkSlug,
  createPage,
}: CreatePageFormProps) {
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    description: "",
  });
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [createdPage, setCreatedPage] = useState<{
    slug: string;
    editId: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    [checkSlug]
  );

  useEffect(() => {
    return () => {
      debouncedCheck.cancel();
    };
  }, [debouncedCheck]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "slug") {
      const sanitizedValue = value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
      debouncedCheck(sanitizedValue);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slug || !isAvailable || !formData.title) return;

    try {
      const result = await createPage({
        slug: formData.slug,
        title: formData.title,
        ...(formData.description && { description: formData.description }),
      });
      if (result.success && result.editId) {
        setCreatedPage({ slug: formData.slug, editId: result.editId });
        setError(null);
      } else {
        setError(result.error || "Failed to create page");
      }
    } catch (err) {
      setError("Error creating page");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Page URL: {`dumpster.page/${formData.slug}`}
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            className="block w-full rounded-md border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
            placeholder="enter-your-url"
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
                ? `${formData.slug} is available!`
                : `${formData.slug} is already taken`}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Page Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="block w-full rounded-md border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
            placeholder="Enter page title"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Page Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
            placeholder="Enter page description (optional)"
          />
        </div>

        <button
          type="submit"
          disabled={!isAvailable || !formData.slug || !formData.title}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Create Page
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {createdPage && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
          <p>Page created successfully!</p>
          <div className="mt-4 space-y-2">
            <a
              href={`/${createdPage.slug}`}
              className="block text-blue-600 hover:text-blue-700 transition-colors"
            >
              View your page →
            </a>
            <a
              href={`/edit/${createdPage.editId}`}
              className="block text-blue-600 hover:text-blue-700 transition-colors"
            >
              Edit your page →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
