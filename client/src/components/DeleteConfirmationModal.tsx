import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { usePuzzles } from "@/hooks/usePuzzles";

interface DeleteConfirmationModalProps {
  puzzleId: number;
  onClose: () => void;
  onCompleted: () => void;
}

export default function DeleteConfirmationModal({ 
  puzzleId, 
  onClose, 
  onCompleted 
}: DeleteConfirmationModalProps) {
  const { deletePuzzle, isDeleting } = usePuzzles();

  const handleDelete = () => {
    deletePuzzle(puzzleId);
    onCompleted();
  };

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="text-center">
          <div className="flex justify-center mb-2 text-destructive">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <AlertDialogTitle className="text-xl">Delete Puzzle?</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Are you sure you want to delete this puzzle? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center space-x-3">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-destructive hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
