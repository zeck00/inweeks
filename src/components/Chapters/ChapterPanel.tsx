import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button/Button';
import { Modal } from '../common/Modal/Modal';
import { ChapterForm } from './ChapterForm';
import { ChapterList } from './ChapterList';
import type { Chapter } from '../../types';
import styles from './ChapterPanel.module.css';

export function ChapterPanel() {
  const { state, addChapter, dispatch } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  const handleSave = (chapter: Omit<Chapter, 'id'>) => {
    if (editingChapter) {
      dispatch({
        type: 'UPDATE_CHAPTER',
        payload: { ...chapter, id: editingChapter.id },
      });
    } else {
      addChapter(chapter);
    }
    setIsFormOpen(false);
    setEditingChapter(null);
  };

  const handleEdit = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_CHAPTER', payload: id });
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingChapter(null);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Life Chapters</h2>
          <p className={styles.subtitle}>Color your weeks by life phases</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsFormOpen(true)}
          icon={<Plus size={16} />}
        >
          Add
        </Button>
      </div>

      {state.chapters.length > 0 ? (
        <ChapterList
          chapters={state.chapters}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            No chapters yet. Add milestones like school, career, or travel to colorize your life grid.
          </p>
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={handleClose}
        title={editingChapter ? 'Edit Chapter' : 'Add Chapter'}
        size="sm"
      >
        <ChapterForm
          initial={editingChapter}
          birthday={state.profile?.birthday ?? ''}
          onSave={handleSave}
          onCancel={handleClose}
        />
      </Modal>
    </div>
  );
}
