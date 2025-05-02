"use client";

import { use } from 'react';
import EditForm from '@/app/ui/notes/edit-form';
import Breadcrumbs from '@/app/ui/components/breadcrumbs';
import { notFound } from 'next/navigation';
import { useNoteByIdQuery } from '@/app/hooks/useNotesApi';

export default function Page(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const id = params.id;

  const { data: note, isLoading, isError, error } = useNoteByIdQuery(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error("Error fetching note:", error);
    return <div>Error loading note data. Please try again later.</div>;
  }

  if (!note) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Notes', href: '/dashboard/notes' },
          {
            label: 'Edit Note',
            href: `/dashboard/notes/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditForm note={note} />
    </main>
  );
}

