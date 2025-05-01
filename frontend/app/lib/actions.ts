'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type NoteState = {
  errors?: {
    id?: string[];
    content?: string[];
  };
  message?: string | null;
};

const NoteFormSchema = z.object({
  id: z.string(),
  content: z.string(),
  created_at: z.string(),
});

const CreateNote = NoteFormSchema.omit({ id: true, created_at: true });
const UpdateNote = NoteFormSchema.omit({ id: true, created_at: true });

export async function createNote(prevState: NoteState, formData: FormData): Promise<NoteState> {
  const validatedFields = CreateNote.safeParse({
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Note.',
    };
  }

  const { content } = validatedFields.data;

  const post_url = `${API_BASE_URL}/notes/`;
  try {
    const response = await fetch(post_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      throw new Error('Failed to create a note');
    }
    return {
      errors: {},
      message: 'Note created successfully',
    };
  } catch (error) {
    console.error('Error creating a note:', error);
    return {
      errors: {},
      message: 'Failed to create a note.',
    };
  } finally {
    revalidatePath('/dashboard/notes');
    redirect('/dashboard/notes');
  }
}

export async function updateNote(id: string, prevState: NoteState, formData: FormData): Promise<NoteState> {
  const validatedFields = UpdateNote.safeParse({
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Note.',
    };
  }

  const { content } = validatedFields.data;

  const put_url = `${API_BASE_URL}/notes/${id}`;
  try {
    const response = await fetch(put_url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      throw new Error('Failed to update a note');
    }
    return {
      errors: {},
      message: 'Note updated successfully',
    };
  } catch (error) {
    console.error('Error updating a note:', error);
    return {
      errors: {},
      message: 'Failed to update a note.',
    };
  } finally {
    revalidatePath('/dashboard/notes');
    redirect('/dashboard/notes');
  }
}

export async function deleteNote(id: string) {
  const delete_url = `${API_BASE_URL}/notes/${id}`;
  try {
    const response = await fetch(delete_url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete a note');
    }
  } catch (error) {
    console.error('Error deleting a note:', error);
    throw new Error('Failed to delete a note.');
  }
  revalidatePath('/dashboard/notes');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  // try {
  //   await signIn('credentials', formData);
  // } catch (error) {
  //   if (error instanceof AuthError) {
  //     switch (error.type) {
  //       case 'CredentialsSignin':
  //         return 'Invalid credentials.';
  //       default:
  //         return 'Something went wrong.';
  //     }
  //   }
  //   throw error;
  // }
  console.log(`prevState: ${prevState} formData: ${formData}`);
  return "dummy"
}