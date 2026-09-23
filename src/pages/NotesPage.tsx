import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Note } from '../types/note';
import { noteService } from '../services/noteService';
import { Pagination } from '../components/Pagination';
import { Modal } from '../components/Modal';
import { Alert } from '../components/Alert';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  User as UserIcon,
  RefreshCw,
  Eye,
  FileText,
  Shield,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const NotesPage: React.FC = () => {
  const { user, isAdmin } = useAuth();

  // State
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(10);
  const [viewAll, setViewAll] = useState(false); // Admin toggle

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form States
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await noteService.getNotes({
        page: currentPage,
        limit,
        all: isAdmin && viewAll,
      });
      setNotes(res.items);
      setTotalPages(res.pagination.totalPages);
      setTotalItems(res.pagination.totalItems);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notes.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, isAdmin, viewAll]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleOpenCreate = () => {
    setFormTitle('');
    setFormContent('');
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      setError('Please provide both title and content.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      if (editingNote) {
        await noteService.updateNote(editingNote._id, {
          title: formTitle.trim(),
          content: formContent.trim(),
        });
        setSuccessMsg('Note updated successfully.');
        setEditingNote(null);
      } else {
        await noteService.createNote({
          title: formTitle.trim(),
          content: formContent.trim(),
        });
        setSuccessMsg('Note created successfully.');
        setIsCreateOpen(false);
      }

      fetchNotes();
    } catch (err: any) {
      setError(err.message || 'Failed to save note.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsSubmitting(true);
      await noteService.deleteNote(id);
      setSuccessMsg('Note deleted successfully.');
      setDeleteConfirmId(null);
      fetchNotes();
    } catch (err: any) {
      setError(err.message || 'Failed to delete note.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to safely format author name
  const getAuthorDisplay = (note: Note) => {
    if (typeof note.userId === 'object' && note.userId !== null) {
      return note.userId.name || note.userId.email;
    }
    return note.userId === user?._id ? 'You' : 'User';
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <FileText className="w-5 h-5 text-blue-600" />
            </span>
            Notes
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isAdmin && viewAll
              ? "Viewing all users' notes (Admin Privileges Active)"
              : 'Manage your personal secure notes.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => {
                setViewAll(!viewAll);
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${viewAll
                  ? 'bg-purple-50 text-purple-700 border-purple-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <span>{viewAll ? 'Switch to My Notes' : "View All Users' Notes"}</span>
            </button>
          )}

          <button
            onClick={fetchNotes}
            disabled={isLoading}
            className="btn-icon btn-icon-gray"
            style={{ width: '2.375rem', height: '2.375rem' }}
            title="Refresh notes"
          >
            <RefreshCw className={`w-4 h-4 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Create Note</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg(null)} />}

      {/* Notes Grid */}
      {isLoading && notes.length === 0 ? (
        <div className="py-20 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mb-3" />
          <p className="text-sm text-gray-500">Loading notes from server...</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <FileText className="w-7 h-7 text-indigo-600" />
          </div>
          <p className="text-gray-600 font-medium">No notes found.</p>
          <p className="text-xs text-gray-400 mt-1">Get started by creating your first note.</p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4 text-indigo-600" /> New Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {notes.map((note) => {
            const isOwner =
              (typeof note.userId === 'object' && note.userId?._id === user?._id) ||
              note.userId === user?._id;
            const canModify = isOwner || isAdmin;

            return (
              <div
                key={note._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow transition-shadow flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                      <h3 className="font-semibold text-gray-900 line-clamp-1 text-base">
                        {note.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => setViewingNote(note)}
                      className="btn-icon btn-icon-blue"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-3 whitespace-pre-line mb-4">
                    {note.content}
                  </p>
                </div>

                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-gray-600" title="Author">
                      <UserIcon className="w-3.5 h-3.5 text-indigo-500" />
                      {getAuthorDisplay(note)}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-600" title="Date created">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {canModify && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(note)}
                        className="btn-icon btn-icon-indigo"
                        title="Edit Note"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(note._id)}
                        className="btn-icon btn-icon-rose"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        limit={limit}
        onPageChange={(page) => setCurrentPage(page)}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setCurrentPage(1);
        }}
        disabled={isLoading}
      />

      {/* Create / Edit Note Modal */}
      <Modal
        isOpen={isCreateOpen || !!editingNote}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingNote(null);
        }}
        title={editingNote ? 'Edit Note' : 'Create New Note'}
      >
        <form onSubmit={handleSaveNote} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="e.g. Architecture Decisions"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
            <textarea
              required
              rows={5}
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Write note content here..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-5">
            <button
              type="button"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingNote(null);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : editingNote ? 'Save Changes' : 'Create Note'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* View Note Modal */}
      <Modal
        isOpen={!!viewingNote}
        onClose={() => setViewingNote(null)}
        title={viewingNote?.title || 'Note Details'}
      >
        {viewingNote && (
          <div className="space-y-4">
            <div className="p-3.5 bg-gray-50 rounded-xl text-xs text-gray-600 space-y-2 border border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span><strong>Note ID:</strong> {viewingNote._id}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserIcon className="w-3.5 h-3.5 text-indigo-500" />
                <span><strong>Author:</strong> {getAuthorDisplay(viewingNote)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span><strong>Created:</strong> {new Date(viewingNote.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <div className="prose text-sm text-gray-800 whitespace-pre-wrap leading-relaxed pt-1">
              {viewingNote.content}
            </div>
            <div className="flex justify-end pt-3 border-t border-gray-100 mt-4">
              <button
                type="button"
                onClick={() => setViewingNote(null)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Deletion"
        maxWidth="sm"
      >
        <div className="text-center py-2">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
          <p className="text-sm text-gray-600 leading-normal">
            Are you sure you want to delete this note? This action cannot be undone.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
          <button
            type="button"
            onClick={() => setDeleteConfirmId(null)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            disabled={isSubmitting}
            className="btn-danger"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};
