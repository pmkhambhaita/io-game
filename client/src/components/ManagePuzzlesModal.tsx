import { motion } from "framer-motion";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Plus, Edit, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Puzzle } from "@shared/schema";

interface ManagePuzzlesModalProps {
  puzzles: Puzzle[];
  onClose: () => void;
  onAdd: () => void;
  onEdit: (puzzle: Puzzle) => void;
  onDelete: (id: number) => void;
}

export default function ManagePuzzlesModal({ 
  puzzles, 
  onClose, 
  onAdd, 
  onEdit, 
  onDelete 
}: ManagePuzzlesModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary flex items-center justify-between">
            Manage Puzzles
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 rounded-full p-0 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mb-6">
          <Button 
            onClick={onAdd}
            className="bg-[#10B981] hover:bg-[#0D9488] text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Add New Puzzle
          </Button>
        </div>
        
        <ScrollArea className="max-h-96 pr-2 space-y-3">
          {puzzles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No puzzles available. Create your first puzzle!
            </div>
          ) : (
            <div className="space-y-3">
              {puzzles.map((puzzle) => (
                <motion.div
                  key={puzzle.id}
                  className="bg-muted rounded-lg p-4 flex justify-between items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <h3 className="font-medium">Puzzle {puzzle.id}</h3>
                    <p className="text-sm text-muted-foreground truncate max-w-md">
                      Rule: {puzzle.rule}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(puzzle)}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(puzzle.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <Button onClick={onClose} className="w-full mt-4">
          Done
        </Button>
      </DialogContent>
    </Dialog>
  );
}
