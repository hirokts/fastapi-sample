import { useQuery, useMutation, UseQueryResult, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { Note } from '@/app/lib/definitions';
import { useSupabaseAuth } from '@/app/hooks/useSupabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type NoteState = {
  errors?: {
    id?: string[];
    content?: string[];
  };
  message?: string | null;
};

/**
 * ノート数を取得するためのカスタムフック
 * @param options オプションで指定できるクエリオプション
 * @returns ノート数のクエリ結果
 */
export function useNotesCountQuery(options = {}): UseQueryResult<number, Error> {
  const { session } = useSupabaseAuth();

  return useQuery<number, Error>({
    queryKey: ['notes-count'],
    queryFn: async () => {
      if (!session) {
        throw new Error('User is not authenticated');
      }
      const res = await fetch(`${API_BASE_URL}/notes-count`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      return Number(data.count);
    },
    staleTime: 60000,
    ...options,
  });
}

/**
 * ノート一覧を取得するためのカスタムフック
 * @param skip スキップする件数
 * @param limit 取得する件数
 * @param options オプションで指定できるクエリオプション
 * @returns ノート一覧のクエリ結果
 */
export function useNotesQuery(skip = 0, limit = 10, options = {}): UseQueryResult<Note[], Error> {
  const { session } = useSupabaseAuth();

  return useQuery<Note[], Error>({
    queryKey: ['notes', skip, limit],
    queryFn: async () => {
      if (!session) {
        throw new Error('User is not authenticated');
      }

      const res = await fetch(`${API_BASE_URL}/notes/?skip=${skip}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return await res.json() as Note[];
    },
    staleTime: 60000,
    ...options,
  });
}

/**
 * 特定のIDのノートを取得するためのカスタムフック
 * @param id ノートID
 * @param options オプションで指定できるクエリオプション
 * @returns 特定のノートのクエリ結果
 */
export function useNoteByIdQuery(id: string, options = {}): UseQueryResult<Note, Error> {
  const { session } = useSupabaseAuth();

  return useQuery<Note, Error>({
    queryKey: ['note', id],
    queryFn: async () => {
      if (!session) {
        throw new Error('User is not authenticated');
      }

      const res = await fetch(`${API_BASE_URL}/notes/${id}/`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return await res.json() as Note;
    },
    staleTime: 60000,
    ...options,
  });
}

/**
 * ノート作成のためのカスタムフック
 * @returns ノート作成のミューテーション結果
 */
export function useCreateNoteMutation(): UseMutationResult<NoteState, Error, { content: string }> {
  const queryClient = useQueryClient();
  const { session } = useSupabaseAuth();

  return useMutation<NoteState, Error, { content: string }>({
    mutationFn: async ({ content }) => {
      if (!session) {
        throw new Error('User is not authenticated');
      }

      const res = await fetch(`${API_BASE_URL}/notes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        throw new Error('Failed to create a note');
      }

      return {
        errors: {},
        message: 'Note created successfully',
      };
    },
    onSuccess: () => {
      // ノート作成成功後に関連するキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes-count'] });
    },
    onError: (error) => {
      // エラー発生時の処理
      console.error('Error creating note:', error);
      // 必要に応じてトースト通知などを表示する処理を追加できます
      return error
    }
  });
}

/**
 * ノート更新のためのカスタムフック
 * @returns ノート更新のミューテーション結果
 */
export function useUpdateNoteMutation(): UseMutationResult<NoteState, Error, { id: string; content: string }> {
  const queryClient = useQueryClient();
  const { session } = useSupabaseAuth();

  return useMutation<NoteState, Error, { id: string; content: string }>({
    mutationFn: async ({ id, content }) => {
      if (!session) {
        throw new Error('User is not authenticated');
      }

      const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        throw new Error('Failed to update a note');
      }

      return {
        errors: {},
        message: 'Note updated successfully',
      };
    },
    onSuccess: (_, variables) => {
      // ノート更新成功後に関連するキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note', variables.id] });
    },
    onError: (error, variables) => {
      // エラー発生時の処理
      console.error(`Error updating note ID ${variables.id}:`, error);
      // 必要に応じてトースト通知などを表示する処理を追加できます
    }
  });
}

/**
 * ノート削除のためのカスタムフック
 * @returns ノート削除のミューテーション結果
 */
export function useDeleteNoteMutation(): UseMutationResult<NoteState, Error, { id: string }> {
  const queryClient = useQueryClient();
  const { session } = useSupabaseAuth();

  return useMutation<NoteState, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      if (!session) {
        throw new Error('User is not authenticated');
      }

      const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete a note');
      }

      return {
        errors: {},
        message: 'Note deleted successfully',
      };
    },
    onSuccess: (_, variables) => {
      // ノート削除成功後に関連するキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes-count'] });
      queryClient.invalidateQueries({ queryKey: ['note', variables.id] });
    },
    onError: (error, variables) => {
      // エラー発生時の処理
      console.error(`Error deleting note ID ${variables.id}:`, error);
      // 必要に応じてトースト通知などを表示する処理を追加できます
    }
  });
}

