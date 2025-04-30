import { Button } from "@/components/ui/button";
import { HelpCircle, Settings } from "lucide-react";

interface GameHeaderProps {
  onInstructionsClick: () => void;
  onManagePuzzlesClick: () => void;
}

export default function GameHeader({ 
  onInstructionsClick, 
  onManagePuzzlesClick 
}: GameHeaderProps) {
  return (
    <header className="py-4 px-6 md:px-10 flex justify-between items-center bg-gray-800/50 backdrop-blur-sm shadow-md">
      <div className="flex items-center">
        <h1 className="text-2xl md:text-3xl font-bold">
          <span className="text-blue-400">Input</span>-<span className="text-purple-400">Output</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          onClick={onInstructionsClick}
          className="flex items-center bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">How to Play</span>
        </Button>
        
        <Button 
          onClick={onManagePuzzlesClick}
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Settings className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Manage Puzzles</span>
        </Button>
      </div>
    </header>
  );
}
