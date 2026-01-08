import type { Voxel } from '@voxel-editor/shared-types';
import { useState } from 'react';
import { VoxelScene } from './components/canvas/VoxelScene';
import { type EditorMode, Toolbar } from './components/ui/Toolbar';

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
  const [history, setHistory] = useState<Voxel[][]>([initialVoxels]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      if (previousState) {
        setHistoryIndex(newIndex);
        setVoxels(previousState);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      if (nextState) {
        setHistoryIndex(newIndex);
        setVoxels(nextState);
      }
    }
  };

  const addToHistory = (newVoxels: Voxel[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newVoxels);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setVoxels(newVoxels);
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
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />
      <VoxelScene
        voxels={voxels}
        editorMode={editorMode}
        selectedColor={selectedColor}
        onVoxelsChange={addToHistory}
      />
    </div>
  );
}

export default App;
