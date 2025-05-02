"use client";

import React, { useState } from 'react';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useDeleteNoteMutation } from "@/app/hooks/useNotesApi"

export function CreateNoteButton() {
  return (
    <Link
      href="/dashboard/notes/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Note</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateNoteButton({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/notes/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteNoteButton({ id }: { id: string }) {
  const [errors, setErrors] = useState<string | null>(null);
  const { mutate: deleteNote, isPending: isLoading, isError, error } = useDeleteNoteMutation();

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null); // Clear previous errors

    deleteNote(
      { id },
      {
        onError: (mutationError) => {
          console.error('Error deleting a note:', mutationError);
          setErrors(mutationError.message);
        }
      }
    );
  }

  return (
    <div className="relative group">
      <button type="button" onClick={handleDelete} className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
      {errors && (
        <div className="absolute left-1/2 top-full z-10 mt-2 w-max -translate-x-1/2 rounded-md bg-gray-800 px-3 py-2 text-sm text-white opacity-0 group-hover:opacity-100">
          {errors}
        </div>
      )}
    </div>
  );
}