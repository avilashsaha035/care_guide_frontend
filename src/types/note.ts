export interface Note {
  _id: string;
  title: string;
  content: string;
  userId: string | { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
}

export interface NoteFilterParams {
  page?: number;
  limit?: number;
  all?: boolean; // For admins to view all users' notes
}
