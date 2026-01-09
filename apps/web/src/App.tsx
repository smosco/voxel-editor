import type { Command, Voxel } from '@voxel-editor/shared-types';
import { useRef, useState } from 'react';
import { VoxelScene } from './components/canvas/VoxelScene';
import { type EditorMode, Toolbar } from './components/ui/Toolbar';
import { CommandManager } from './managers';
import { downloadBlob, exportVoxelsToGLB } from './utils/glb-exporter';

// 테스트용 복셀 데이터
const initialVoxels: Voxel[] = [
  { x: 0, y: 0.5, z: 0, color: { r: 0.86, g: 0.86, b: 0.86 } },
  { x: 1, y: 0.5, z: 0, color: { r: 1, g: 0, b: 0 } },
  { x: -1, y: 0.5, z: 0, color: { r: 0, g: 1, b: 0 } },
  { x: 0, y: 0.5, z: 1, color: { r: 0, g: 0, b: 1 } },
  { x: 0, y: 1.5, z: 0, color: { r: 1, g: 1, b: 0 } },
];

function App() {
  const [voxels, setVoxels] = useState<Voxel[]>(initialVoxels);
  const [editorMode, setEditorMode] = useState<EditorMode>('add');
  const [selectedColor, setSelectedColor] = useState<number>(0); // 팔레트 인덱스 (0 = Cyan)

  // CommandManager 초기화
  const commandManager = useRef(new CommandManager()).current;
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

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
