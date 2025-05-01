import { Note } from "./definitions";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export async function fetchCardData() {
  try {
    const notesCountPromise = fetchNotesCount();

    const data = await Promise.all([notesCountPromise]);

    const notesCount = data[0];

    return {
      notesCount,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchNotesCount() {
  try {
    const response = await fetch(`${API_BASE_URL}/notes-count`);
    if (!response.ok) {
      throw new Error('Failed to fetch notes count');
    }
    const data = await response.json();
    return Number(data.count);
  } catch (error) {
    console.error('Error fetching notes count:', error);
    throw new Error('Failed to fetch notes count.');
  }
}

export async function fetchNotes(skip: number = 0, limit: number = 10): Promise<Note[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/?skip=${skip}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }
    const data: Note[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw new Error('Failed to fetch notes.');
  }
}

export async function fetchNoteById(id: string): Promise<Note> {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch a note');
    }
    const data: Note = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching a note:', error);
    throw new Error('Failed to fetch a note.');
  }
}
