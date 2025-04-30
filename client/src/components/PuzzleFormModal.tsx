import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { puzzleFormSchema } from "@shared/schema";
import { usePuzzles } from "@/hooks/usePuzzles";
import { Puzzle } from "@shared/schema";

interface PuzzleFormModalProps {
  isEditMode: boolean;
  puzzle: Puzzle | null;
  onClose: () => void;
}

export default function PuzzleFormModal({ 
  isEditMode, 
  puzzle, 
  onClose 
}: PuzzleFormModalProps) {
  const { createPuzzle, updatePuzzle, isCreating, isUpdating } = usePuzzles();
  
  // Initialize form with default values or puzzle data if editing
  const form = useForm({
    resolver: zodResolver(puzzleFormSchema),
    defaultValues: {
      rule: "",
      inputs: ["", "", "", "", "", ""],
      outputs: ["", "", "", "", "", ""],
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && puzzle) {
      form.reset({
        rule: puzzle.rule,
        inputs: [...puzzle.inputs],
        outputs: [...puzzle.outputs],
      });
    }
  }, [isEditMode, puzzle, form]);

  // Handle form submission
  const onSubmit = (data: any) => {
    if (isEditMode && puzzle) {
      updatePuzzle({
        id: puzzle.id,
        ...data
      });
    } else {
      createPuzzle(data);
    }
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-blue-400 flex items-center justify-between">
            {isEditMode ? "Edit Puzzle" : "Add New Puzzle"}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 rounded-full p-0 text-gray-400 hover:text-red-400"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rule"
              render={({ field }) => (
                <FormItem className="text-gray-200">
                  <FormLabel>Rule:</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Add 2 and multiply by 3" 
                      className="bg-gray-700 border-gray-600 text-gray-200"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inputs */}
              <div>
                <h3 className="font-medium mb-3 text-blue-400">Inputs:</h3>
                <div className="space-y-3">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <FormField
                      key={`input-${index}`}
                      control={form.control}
                      name={`inputs.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex">
                            <span className="flex items-center justify-center w-8 bg-gray-700 border border-r-0 border-gray-600 rounded-l-md text-gray-300">
                              {index + 1}
                            </span>
                            <FormControl>
                              <Input
                                className="rounded-l-none bg-gray-700 border-gray-600 text-gray-200"
                                placeholder="Enter input value"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
              
              {/* Outputs */}
              <div>
                <h3 className="font-medium mb-3 text-purple-400">Outputs:</h3>
                <div className="space-y-3">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <FormField
                      key={`output-${index}`}
                      control={form.control}
                      name={`outputs.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex">
                            <span className="flex items-center justify-center w-8 bg-gray-700 border border-r-0 border-gray-600 rounded-l-md text-gray-300">
                              {index + 1}
                            </span>
                            <FormControl>
                              <Input
                                className="rounded-l-none bg-gray-700 border-gray-600 text-gray-200"
                                placeholder="Enter output value"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isCreating || isUpdating}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isCreating || isUpdating ? 'Saving...' : 'Save Puzzle'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
