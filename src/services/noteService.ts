import { apiClient } from './api';
import { Note, CreateNoteInput, UpdateNoteInput, NoteFilterParams } from '../types/note';
import { ApiResponse, PaginatedResult } from '../types/api';

export const noteService = {
  async getNotes(params?: NoteFilterParams): Promise<PaginatedResult<Note>> {
    const res = await apiClient.get<ApiResponse<PaginatedResult<Note>>>('/notes', {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        all: params?.all ? 'true' : undefined,
      },
    });
    return res.data;
  },

  async getNoteById(id: string): Promise<Note> {
    const res = await apiClient.get<ApiResponse<Note>>(`/notes/${id}`);
    return res.data;
  },

  async createNote(input: CreateNoteInput): Promise<Note> {
    const res = await apiClient.post<ApiResponse<Note>>('/notes', input);
    return res.data;
  },

  async updateNote(id: string, input: UpdateNoteInput): Promise<Note> {
    const res = await apiClient.put<ApiResponse<Note>>(`/notes/${id}`, input);
    return res.data;
  },

  async deleteNote(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/notes/${id}`);
  },
};
