import Form from '@/app/ui/notes/edit-form';
import Breadcrumbs from '@/app/ui/components/breadcrumbs';
import { fetchNoteById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [note] = await Promise.all([
    fetchNoteById(id),
  ]);

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
      <Form note={note} />
    </main>
  );
}
