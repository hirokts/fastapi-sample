'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useState } from 'react';
import { useUpdateNoteMutation } from '@/app/hooks/useNotesApi';
import { useRouter } from 'next/navigation';
import { Note } from '@/app/lib/definitions';
import { UpdateNoteSchema } from '@/app/zodSchemas/note';

type FormErrors = {
  type: "api" | "zod";
  content?: string[];
};

export default function EditForm({ note }: { note: Note }) {
  const [content, setContent] = useState(note.content);
  const [errors, setErrors] = useState<FormErrors | null>(null); // State for validation errors
  const router = useRouter();
  const { mutate: updateNote, isPending: isLoading, isError, error } = useUpdateNoteMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null); // Clear previous errors

    // Validate form data using Zod
    const validatedFields = UpdateNoteSchema.safeParse({ content });

    // If validation fails, update errors state and return
    if (!validatedFields.success) {
      setErrors({
        type: "zod",
        ...validatedFields.error.flatten().fieldErrors
      });
      return;
    }

    updateNote(
      { id: note.id, content },
      {
        onSuccess: () => {
          setContent('');
          router.push('/dashboard/notes');
        },
        onError: (mutationError) => {
          console.error('Error creating a note:', mutationError);
          setErrors({
            type: "api",
            content: [mutationError.message]
          });
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Note Content */}
        <div className="mb-4">
          <label htmlFor="content" className="mb-2 block text-sm font-medium">
            Edit your note
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="content"
                name="content"
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content..."
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                aria-describedby="content-error"
              />
            </div>
          </div>
          {/* Display Zod validation errors */}
          <div id="content-error" aria-live="polite" className="mt-2 text-sm text-red-500">
            {errors?.type == "zod" && errors.content?.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
          {/* Display API call errors (optional, can be combined or styled differently) */}
          <div id="content-error" aria-live="polite" className="mt-2 text-sm text-red-500">
            {errors?.type == "api" && errors.content?.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/notes"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Note'}
        </Button>
      </div>
    </form>
  );
}
