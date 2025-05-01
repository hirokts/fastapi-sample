import Form from '@/app/ui/notes/create-form';
import Breadcrumbs from '@/app/ui/components/breadcrumbs';

export default async function Page() {

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Notes', href: '/dashboard/notes' },
          {
            label: 'Create Note',
            href: '/dashboard/notes/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
