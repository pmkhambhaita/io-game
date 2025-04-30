import { motion } from "framer-motion";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface InstructionsModalProps {
  onClose: () => void;
}

export default function InstructionsModal({ onClose }: InstructionsModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary flex items-center justify-between">
            How to Play
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
        
        <div className="space-y-4">
          <DialogDescription className="text-base text-foreground">
            Input-Output is a pattern-matching puzzle game where you need to figure out the rule that transforms inputs into outputs.
          </DialogDescription>
          
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Game Rules:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Examine the first two input-output pairs which are revealed as hints.</li>
              <li>Try to deduce the pattern that transforms each input into its corresponding output.</li>
              <li>Click on the locked output cards to reveal more outputs and confirm your theory.</li>
              <li>Click on the "Hidden Rule" card to reveal the actual rule when you're ready.</li>
            </ol>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Challenge yourself to guess the rule before revealing all the outputs!
          </p>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
