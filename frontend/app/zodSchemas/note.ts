import { z } from "zod"

const NoteFormSchema = z.object({
  id: z.string(),
  content: z.string().min(5, { message: 'Content must be at least 5 characters long' }),
  created_at: z.string(),
});

export const CreateNoteSchema = NoteFormSchema.omit({ id: true, created_at: true });
export const UpdateNoteSchema = NoteFormSchema.omit({ id: true, created_at: true });
