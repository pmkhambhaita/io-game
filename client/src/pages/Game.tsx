import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import GameHeader from "@/components/GameHeader";
import FlashcardGameContainer from "@/components/FlashcardGameContainer";
import InstructionsModal from "@/components/InstructionsModal";
import ManagePuzzlesModal from "@/components/ManagePuzzlesModal";
import PuzzleFormModal from "@/components/PuzzleFormModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import ImportPuzzlesModal from "@/components/ImportPuzzlesModal";
import { usePuzzles } from "@/hooks/usePuzzles";
import { Puzzle } from "@shared/schema";

export default function Game() {
  const { puzzles, isLoading } = usePuzzles();
  
  // Modal states
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isManagePuzzlesOpen, setIsManagePuzzlesOpen] = useState(false);
  const [isPuzzleFormOpen, setIsPuzzleFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  // Form states
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPuzzleId, setCurrentPuzzleId] = useState<number | null>(null);
  const [selectedPuzzleIndex, setSelectedPuzzleIndex] = useState(0);

  // Current puzzle based on selection
  const currentPuzzle = !isLoading && puzzles.length > 0 
    ? puzzles[selectedPuzzleIndex] 
    : null;

  // Handle puzzle navigation
  const handlePrevPuzzle = () => {
    if (puzzles.length > 0) {
      setSelectedPuzzleIndex((prev) => 
        prev === 0 ? puzzles.length - 1 : prev - 1
      );
    }
  };

  const handleNextPuzzle = () => {
    if (puzzles.length > 0) {
      setSelectedPuzzleIndex((prev) => 
        prev === puzzles.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Add new puzzle
  const handleAddPuzzle = () => {
    setIsEditMode(false);
    setCurrentPuzzleId(null);
    setIsManagePuzzlesOpen(false);
    setIsPuzzleFormOpen(true);
  };

  // Import puzzles
  const handleImportPuzzles = () => {
    setIsManagePuzzlesOpen(false);
    setIsImportModalOpen(true);
  };

  // Edit puzzle
  const handleEditPuzzle = (puzzle: Puzzle) => {
    setIsEditMode(true);
    setCurrentPuzzleId(puzzle.id);
    setIsManagePuzzlesOpen(false);
    setIsPuzzleFormOpen(true);
  };

  // Delete puzzle
  const handleDeleteClick = (id: number) => {
    setCurrentPuzzleId(id);
    setIsDeleteModalOpen(true);
  };

  // Get puzzle being edited
  const getPuzzleToEdit = () => {
    if (!currentPuzzleId) return null;
    return puzzles.find(p => p.id === currentPuzzleId) || null;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen font-sans text-white">
      <GameHeader 
        onInstructionsClick={() => setIsInstructionsOpen(true)}
        onManagePuzzlesClick={() => setIsManagePuzzlesOpen(true)}
      />
      
      <FlashcardGameContainer 
        isLoading={isLoading}
        puzzle={currentPuzzle}
        puzzleNumber={selectedPuzzleIndex + 1}
        totalPuzzles={puzzles.length}
        onPrevClick={handlePrevPuzzle}
        onNextClick={handleNextPuzzle}
      />

      <AnimatePresence mode="wait">
        {isInstructionsOpen && (
          <InstructionsModal onClose={() => setIsInstructionsOpen(false)} />
        )}
        
        {isManagePuzzlesOpen && (
          <ManagePuzzlesModal 
            puzzles={puzzles}
            onClose={() => setIsManagePuzzlesOpen(false)}
            onAdd={handleAddPuzzle}
            onEdit={handleEditPuzzle}
            onDelete={handleDeleteClick}
            onImport={handleImportPuzzles}
          />
        )}
        
        {isPuzzleFormOpen && (
          <PuzzleFormModal 
            isEditMode={isEditMode}
            puzzle={getPuzzleToEdit()}
            onClose={() => {
              setIsPuzzleFormOpen(false);
              setIsManagePuzzlesOpen(true);
            }}
          />
        )}
        
        {isDeleteModalOpen && (
          <DeleteConfirmationModal 
            puzzleId={currentPuzzleId as number}
            onClose={() => setIsDeleteModalOpen(false)}
            onCompleted={() => {
              setIsDeleteModalOpen(false);
              // If we deleted the current puzzle, select the first one
              if (currentPuzzleId === currentPuzzle?.id) {
                setSelectedPuzzleIndex(0);
              }
            }}
          />
        )}
        
        {isImportModalOpen && (
          <ImportPuzzlesModal 
            onClose={() => {
              setIsImportModalOpen(false);
              setIsManagePuzzlesOpen(true);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
