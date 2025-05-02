"use client";

import { UpdateNoteButton, DeleteNoteButton } from '@/app/ui/notes/buttons';
import { formatDateToLocal } from '@/app/lib/utils';
import { useNotesQuery } from "@/app/hooks/useNotesApi"

export default function NotesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  console.log(`query: ${query} currentPage: ${currentPage}`);
  const { data: notes } = useNotesQuery(undefined, undefined, { suspense: true });

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {notes?.map((note) => (
              <div
                key={note.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="text-sm text-gray-500">{note.content}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>{formatDateToLocal(note.created_at)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateNoteButton id={note.id} />
                    <DeleteNoteButton id={note.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium">
                  Note
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {notes?.map((note) => (
                <tr
                  key={note.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3 w-full">
                    {note.content}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(note.created_at)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateNoteButton id={note.id} />
                      <DeleteNoteButton id={note.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
