import { COLORS } from '@voxel-editor/shared-types';
import { Download, Minus, Paintbrush, Plus, Redo2, Undo2 } from 'lucide-react';
import styles from './Toolbar.module.css';

export type EditorMode = 'add' | 'remove' | 'paint';

interface ToolbarProps {
  currentMode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  selectedColor: number;
  onColorChange: (colorIndex: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExport: () => void;
}

/**
 * 왼쪽 툴바 UI (툴 버튼, Undo/Redo, 컬러 팔레트)
 */
export function Toolbar({
  currentMode,
  onModeChange,
  selectedColor,
  onColorChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExport,
}: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      {/* 툴 버튼들 */}
      <button
        type="button"
        className={`${styles.toolButton} ${currentMode === 'add' ? styles.active : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onModeChange('add');
        }}
        title="Add voxel"
      >
        <Plus size={20} strokeWidth={2.5} />
      </button>
      <button
        type="button"
        className={`${styles.toolButton} ${currentMode === 'remove' ? styles.active : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onModeChange('remove');
        }}
        title="Remove voxel"
      >
        <Minus size={20} strokeWidth={2.5} />
      </button>
      <button
        type="button"
        className={`${styles.toolButton} ${currentMode === 'paint' ? styles.active : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onModeChange('paint');
        }}
        title="Paint voxel"
      >
        <Paintbrush size={20} strokeWidth={2.5} />
      </button>

      <div className={styles.divider} />

      {/* Undo/Redo 버튼 */}
      <div className={styles.historyButtons}>
        <button
          type="button"
          className={styles.historyButton}
          onClick={(e) => {
            e.stopPropagation();
            onUndo();
          }}
          disabled={!canUndo}
          title="Undo"
        >
          <Undo2 size={18} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          className={styles.historyButton}
          onClick={(e) => {
            e.stopPropagation();
            onRedo();
          }}
          disabled={!canRedo}
          title="Redo"
        >
          <Redo2 size={18} strokeWidth={2.5} />
        </button>
      </div>

      <div className={styles.divider} />

      {/* Export 버튼 */}
      <button
        type="button"
        className={styles.toolButton}
        onClick={(e) => {
          e.stopPropagation();
          onExport();
        }}
        title="Export GLB"
      >
        <Download size={20} strokeWidth={2.5} />
      </button>

      <div className={styles.divider} />

      {/* 컬러 팔레트 (4x4 그리드) */}
      <div className={styles.colorPalette}>
        {COLORS.PALETTE.map((paletteItem, index) => {
          return (
            <button
              type="button"
              key={index}
              className={`${styles.colorButton} ${selectedColor === index ? styles.selected : ''}`}
              style={{ backgroundColor: paletteItem.hex }}
              onClick={(e) => {
                e.stopPropagation();
                onColorChange(index);
              }}
              title={paletteItem.name}
            />
          );
        })}
      </div>
    </div>
  );
}
