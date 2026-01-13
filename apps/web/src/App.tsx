import type { Command, Voxel } from '@voxel-editor/shared-types';
import { useEffect, useRef, useState } from 'react';
import { VoxelScene } from './components/canvas/VoxelScene';
import { type EditorMode, Toolbar } from './components/ui/Toolbar';
import { CommandManager } from './managers';
import { downloadBlob, exportVoxelsToGLB } from './utils/glb-exporter';
import { loadVoxelsFromLocalStorage, saveVoxelsToLocalStorage } from './utils/localStorage';

function App() {
  const [voxels, setVoxels] = useState<Voxel[]>(() => loadVoxelsFromLocalStorage());
  const [editorMode, setEditorMode] = useState<EditorMode>('add');
  const [selectedColor, setSelectedColor] = useState<number>(0); // 팔레트 인덱스 (0 = Cyan)

  // CommandManager 초기화
  const commandManager = useRef(new CommandManager()).current;
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // LocalStorage 자동 저장
  useEffect(() => {
    saveVoxelsToLocalStorage(voxels);
  }, [voxels]);

  // Undo 실행
  const handleUndo = () => {
    commandManager.backward();
    updateUndoRedoState();
  };

  // Redo 실행
  const handleRedo = () => {
    commandManager.forward();
    updateUndoRedoState();
  };

  // Command 실행
  const executeCommand = (command: Command) => {
    commandManager.executeCommand(command);
    updateUndoRedoState();
  };

  // Undo/Redo 상태 업데이트
  const updateUndoRedoState = () => {
    setCanUndo(commandManager.canBackward());
    setCanRedo(commandManager.canForward());
  };

  // GLB Export
  const handleExport = async () => {
    try {
      const blob = await exportVoxelsToGLB(voxels);
      downloadBlob(blob, 'voxel-model.glb');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export GLB file');
    }
  };

  // Clear All
  const handleClearAll = () => {
    if (voxels.length === 0) return;

    if (confirm('Are you sure you want to clear all voxels?')) {
      const clearAllCommand: Command = {
        execute: (currentVoxels) => [],
        undo: () => voxels,
      };
      executeCommand(clearAllCommand);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <Toolbar
        currentMode={editorMode}
        onModeChange={setEditorMode}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onExport={handleExport}
        onClearAll={handleClearAll}
      />
      <VoxelScene
        voxels={voxels}
        editorMode={editorMode}
        selectedColor={selectedColor}
        onExecuteCommand={executeCommand}
        onVoxelsChange={setVoxels}
      />
    </div>
  );
}

export default App;
