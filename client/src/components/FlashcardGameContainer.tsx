import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Puzzle } from "@shared/schema";

interface FlashcardGameContainerProps {
  isLoading: boolean;
  puzzle: Puzzle | null;
  puzzleNumber: number;
  totalPuzzles: number;
  onPrevClick: () => void;
  onNextClick: () => void;
}

export default function FlashcardGameContainer({
  isLoading,
  puzzle,
  puzzleNumber,
  totalPuzzles,
  onPrevClick,
  onNextClick
}: FlashcardGameContainerProps) {
  // State for individual components
  const [isRuleRevealed, setIsRuleRevealed] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [completedPairs, setCompletedPairs] = useState<{input: string, output: string}[]>([]);
  
  // Reset states when puzzle changes
  useEffect(() => {
    setIsRuleRevealed(false);
    setCurrentCardIndex(0);
    setIsCardFlipped(false);
    setCompletedPairs([]);
  }, [puzzle]);
  
  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!puzzle) return;
    
    if (e.code === 'Space') {
      e.preventDefault();
      setIsCardFlipped(prev => !prev);
    } else if (e.code === 'KeyR') {
      e.preventDefault();
      setIsRuleRevealed(prev => !prev);
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      handleNextCard();
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      handlePrevCard();
    }
  }, [puzzle, currentCardIndex, isCardFlipped]);
  
  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  // Navigate between cards
  const handleNextCard = () => {
    if (!puzzle) return;
    
    // If card is flipped, mark as complete and add to history
    if (isCardFlipped) {
      const pair = {
        input: puzzle.inputs[currentCardIndex],
        output: puzzle.outputs[currentCardIndex]
      };
      
      if (!completedPairs.some(p => p.input === pair.input && p.output === pair.output)) {
        setCompletedPairs(prev => [...prev, pair]);
      }
    }
    
    // Move to next card if available
    if (currentCardIndex < puzzle.inputs.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsCardFlipped(false);
    }
  };
  
  const handlePrevCard = () => {
    if (!puzzle) return;
    
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsCardFlipped(false);
    }
  };
  
  // Mark current card as complete
  const handleMarkComplete = () => {
    if (!puzzle) return;
    
    const pair = {
      input: puzzle.inputs[currentCardIndex],
      output: puzzle.outputs[currentCardIndex]
    };
    
    if (!completedPairs.some(p => p.input === pair.input && p.output === pair.output)) {
      setCompletedPairs(prev => [...prev, pair]);
    }
    
    // Go to next card if available
    if (currentCardIndex < puzzle.inputs.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsCardFlipped(false);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden p-6 md:p-10">
          <Skeleton className="h-28 w-full mb-8 rounded-xl" />
          <div className="flex justify-center">
            <Skeleton className="h-64 w-96 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // No puzzles state
  if (!puzzle) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
        <div className="bg-gray-800 text-white rounded-2xl shadow-xl overflow-hidden p-10 text-center">
          <h2 className="text-2xl font-semibold mb-4">No Puzzles Available</h2>
          <p className="mb-6">Create your first puzzle to get started!</p>
          <Button onClick={onNextClick}>Manage Puzzles</Button>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
      {/* Puzzle Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-gray-800 shadow-md hover:bg-gray-700 text-white"
          onClick={onPrevClick}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="bg-gray-800 text-white rounded-full shadow-md px-5 py-2 flex items-center">
          <span className="font-medium mr-2">Puzzle {puzzleNumber}</span>
          <div className="flex space-x-1">
            {Array(totalPuzzles).fill(0).map((_, i) => (
              <span 
                key={`dot-${i}`}
                className={`w-2 h-2 rounded-full ${i === puzzleNumber - 1 ? 'bg-primary' : 'bg-gray-500'}`}
              />
            ))}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-gray-800 shadow-md hover:bg-gray-700 text-white"
          onClick={onNextClick}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Game Board */}
      <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 md:p-10">
          {/* Completed Pairs Table */}
          {completedPairs.length > 0 && (
            <div className="mb-6 overflow-x-auto">
              <div className="inline-block min-w-full">
                <div className="overflow-hidden border border-gray-700 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider">
                          Input
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-400 uppercase tracking-wider">
                          Output
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {completedPairs.map((pair, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{pair.input}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{pair.output}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Rule Box */}
          <div className="mb-8">
            <motion.div 
              className="mx-auto max-w-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div 
                className="rounded-xl h-28 w-full shadow-lg cursor-pointer relative overflow-hidden"
                onClick={() => setIsRuleRevealed(!isRuleRevealed)}
              >
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white transition-transform duration-500"
                  style={{ 
                    transform: isRuleRevealed ? 'translateY(-100%)' : 'translateY(0)',
                    zIndex: 2
                  }}
                >
                  <div className="text-center">
                    <h2 className="text-xl font-semibold">Hidden Rule</h2>
                    <p className="text-sm opacity-80">Click to reveal the pattern (or press 'R')</p>
                  </div>
                </div>
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600 flex items-center justify-center text-white transition-transform duration-500"
                  style={{ 
                    transform: isRuleRevealed ? 'translateY(0)' : 'translateY(100%)',
                    zIndex: 1
                  }}
                >
                  <div className="text-center px-6">
                    <h2 className="text-xl font-semibold mb-1">Rule Revealed!</h2>
                    <p id="rule-text" className="text-base">{puzzle.rule}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Flashcard */}
          <div className="flex justify-center mb-8">
            <div className="perspective-1000 w-full max-w-md">
              <motion.div 
                className="relative h-64 w-full cursor-pointer"
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div 
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white p-6"
                  animate={{ 
                    rotateY: isCardFlipped ? 180 : 0,
                    opacity: isCardFlipped ? 0 : 1,
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-center">
                    <h3 className="text-lg uppercase tracking-wider mb-4 text-blue-300">Input</h3>
                    <p className="text-4xl font-bold">{puzzle.inputs[currentCardIndex]}</p>
                    <p className="mt-6 text-sm text-blue-200">Click to see output (or press Space)</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white p-6"
                  initial={{ rotateY: 180, opacity: 0 }}
                  animate={{ 
                    rotateY: isCardFlipped ? 0 : -180,
                    opacity: isCardFlipped ? 1 : 0,
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-center">
                    <h3 className="text-lg uppercase tracking-wider mb-4 text-purple-300">Output</h3>
                    <p className="text-4xl font-bold">{puzzle.outputs[currentCardIndex]}</p>
                    <p className="mt-6 text-sm text-purple-200">Click to see input (or press Space)</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevCard}
              disabled={currentCardIndex === 0}
              className="px-6 py-2 border-gray-600 text-gray-200 hover:bg-gray-700 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            
            <div className="text-gray-300 text-sm">
              {currentCardIndex + 1} of {puzzle.inputs.length}
            </div>
            
            <Button
              variant={isCardFlipped ? "default" : "outline"}
              onClick={isCardFlipped ? handleMarkComplete : handleNextCard}
              disabled={currentCardIndex === puzzle.inputs.length - 1 && isCardFlipped}
              className={isCardFlipped 
                ? "px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50" 
                : "px-6 py-2 border-gray-600 text-gray-200 hover:bg-gray-700 disabled:opacity-50"}
            >
              {isCardFlipped 
                ? <><Eye className="h-4 w-4 mr-2" /> Mark Complete</>
                : <><ChevronRight className="h-4 w-4 mr-2" /> Next</>}
            </Button>
          </div>
          
          {/* Keyboard Shortcuts Guide */}
          <div className="mt-8 text-center text-sm text-gray-400">
            <p>Keyboard shortcuts: Space (flip card), R (reveal rule), ← (previous), → (next)</p>
          </div>
        </div>
      </div>
    </main>
  );
}