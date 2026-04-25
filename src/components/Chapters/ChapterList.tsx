import { Pencil, Trash2 } from 'lucide-react';
import type { Chapter } from '../../types';
import { parseISODate, formatDate } from '../../utils/date';
import styles from './ChapterList.module.css';

interface ChapterListProps {
  chapters: Chapter[];
  onEdit: (chapter: Chapter) => void;
  onDelete: (id: string) => void;
}

export function ChapterList({ chapters, onEdit, onDelete }: ChapterListProps) {
  return (
    <div className={styles.list}>
      {chapters.map((chapter) => (
        <div key={chapter.id} className={styles.item}>
          <div className={styles.colorDot} style={{ background: chapter.color }} />
          <div className={styles.info}>
            <span className={styles.name}>{chapter.name}</span>
            <span className={styles.dates}>
              {formatDate(parseISODate(chapter.startDate))} — {formatDate(parseISODate(chapter.endDate))}
            </span>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.actionButton}
              onClick={() => onEdit(chapter)}
              aria-label={`Edit ${chapter.name}`}
            >
              <Pencil size={14} />
            </button>
            <button
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={() => onDelete(chapter.id)}
              aria-label={`Delete ${chapter.name}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
