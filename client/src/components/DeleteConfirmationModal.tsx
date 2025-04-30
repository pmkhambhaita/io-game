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
      <AlertDialogContent className="max-w-md bg-gray-800 border-gray-700 text-white">
        <AlertDialogHeader className="text-center">
          <div className="flex justify-center mb-2 text-red-400">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <AlertDialogTitle className="text-xl text-white">Delete Puzzle?</AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-300">
            Are you sure you want to delete this puzzle? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center space-x-3">
          <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
