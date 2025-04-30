import { motion } from "framer-motion";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Plus, Edit, Trash, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Puzzle } from "@shared/schema";

interface ManagePuzzlesModalProps {
  puzzles: Puzzle[];
  onClose: () => void;
  onAdd: () => void;
  onEdit: (puzzle: Puzzle) => void;
  onDelete: (id: number) => void;
  onImport?: () => void;
}

export default function ManagePuzzlesModal({ 
  puzzles, 
  onClose, 
  onAdd, 
  onEdit, 
  onDelete,
  onImport
}: ManagePuzzlesModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-blue-400">
            Manage Puzzles
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Add, edit, delete or import puzzles for your game.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-6 flex flex-wrap gap-3">
          <Button 
            onClick={onAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Add New Puzzle
          </Button>
          
          {onImport && (
            <Button 
              onClick={onImport}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Upload className="h-4 w-4 mr-2" /> Import Puzzles
            </Button>
          )}
        </div>
        
        <ScrollArea className="max-h-96 pr-2 space-y-3">
          {puzzles.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No puzzles available. Create your first puzzle!
            </div>
          ) : (
            <div className="space-y-3">
              {puzzles.map((puzzle) => (
                <motion.div
                  key={puzzle.id}
                  className="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <h3 className="font-medium text-gray-200">Puzzle {puzzle.id}</h3>
                    <p className="text-sm text-gray-400 truncate max-w-md">
                      Rule: {puzzle.rule}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(puzzle)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-gray-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(puzzle.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-gray-600 transition-colors"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <Button onClick={onClose} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
          Done
        </Button>
      </DialogContent>
    </Dialog>
  );
}
