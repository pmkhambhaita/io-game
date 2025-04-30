import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Puzzle } from "@shared/schema";

interface GameContainerProps {
  isLoading: boolean;
  puzzle: Puzzle | null;
  puzzleNumber: number;
  totalPuzzles: number;
  onPrevClick: () => void;
  onNextClick: () => void;
}

export default function GameContainer({
  isLoading,
  puzzle,
  puzzleNumber,
  totalPuzzles,
  onPrevClick,
  onNextClick
}: GameContainerProps) {
  const [isRuleRevealed, setIsRuleRevealed] = useState(false);
  const [revealedOutputs, setRevealedOutputs] = useState<boolean[]>([]);

  // Reset state when puzzle changes
  useEffect(() => {
    setIsRuleRevealed(false);
    // First two outputs are always revealed
    setRevealedOutputs([true, true, false, false, false, false]);
  }, [puzzle]);

  // Toggle output reveal
  const toggleOutput = (index: number) => {
    if (index < 2) return; // First two are always revealed
    
    setRevealedOutputs(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Skeleton className="h-6 w-32 mb-4 mx-auto" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array(6).fill(0).map((_, i) => (
                  <Skeleton key={`input-skeleton-${i}`} className="h-24 rounded-xl" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-6 w-32 mb-4 mx-auto" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array(6).fill(0).map((_, i) => (
                  <Skeleton key={`output-skeleton-${i}`} className="h-24 rounded-xl" />
                ))}
              </div>
            </div>
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
                    <p className="text-sm opacity-80">Click to reveal the pattern</p>
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

          {/* Input-Output Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in-50">
            {/* Inputs Column */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-center text-blue-400">Inputs</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {puzzle.inputs.map((input, index) => (
                  <motion.div
                    key={`input-${puzzle.id}-${index}`}
                    className="bg-gray-700 text-white rounded-xl p-4 shadow-md flex items-center justify-center h-24 font-semibold text-2xl"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 260,
                      damping: 20 
                    }}
                  >
                    {input}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Outputs Column */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-center text-purple-400">Outputs</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {puzzle.outputs.map((output, index) => {
                  // First two are always revealed
                  const isRevealed = revealedOutputs[index];
                  
                  return (
                    <motion.div
                      key={`output-${puzzle.id}-${index}`}
                      className="h-24 relative overflow-hidden"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 260,
                        damping: 20 
                      }}
                    >
                      <div 
                        className="absolute inset-0 rounded-xl shadow-md cursor-pointer"
                        onClick={() => index >= 2 && toggleOutput(index)}
                      >
                        <div 
                          className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white transition-transform duration-500"
                          style={{
                            transform: isRevealed ? 'translateY(-100%)' : 'translateY(0)',
                            zIndex: 2
                          }}
                        >
                          <Lock className="h-6 w-6" />
                        </div>
                        <div 
                          className="absolute inset-0 bg-gray-700 rounded-xl flex items-center justify-center text-white transition-transform duration-500"
                          style={{
                            transform: isRevealed ? 'translateY(0)' : 'translateY(100%)',
                            zIndex: 1
                          }}
                        >
                          <span className="font-semibold text-2xl">{output}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
