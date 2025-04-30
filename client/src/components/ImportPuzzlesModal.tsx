import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Upload, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { usePuzzles } from "@/hooks/usePuzzles";
import { useToast } from "@/hooks/use-toast";

interface ImportPuzzlesModalProps {
  onClose: () => void;
}

interface ImportPuzzle {
  id?: number;
  rule: string;
  examples: { input: any; output: any }[];
  tests: { input: any; output: any }[];
}

export default function ImportPuzzlesModal({ onClose }: ImportPuzzlesModalProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { importPuzzles } = usePuzzles();
  const { toast } = useToast();

  const handleImport = async () => {
    try {
      setIsImporting(true);
      setValidationError(null);
      
      // Validate JSON format
      let parsedData: ImportPuzzle | ImportPuzzle[];
      try {
        // Clean up the input to handle multiple JSON objects not in an array
        const cleanedInput = jsonInput.trim();
        
        // Handle regular JSON parsing first
        try {
          parsedData = JSON.parse(cleanedInput);
        } catch (error) {
          // If regular parsing fails, check if there are multiple JSON objects
          if (cleanedInput.match(/\}\s*\{/)) {
            // Try to parse as multiple separate objects
            const objectsText = cleanedInput.replace(/\}\s*\{/g, '}|{');
            const objects = objectsText.split('|');
            
            if (objects.length > 1) {
              parsedData = objects.map(obj => JSON.parse(obj));
            } else {
              throw error; // Re-throw if splitting didn't help
            }
          } else {
            throw error; // Re-throw the original error
          }
        }
      } catch (error) {
        console.error('Parse error:', error);
        setValidationError("Invalid JSON format. Please check your input.");
        setIsImporting(false);
        return;
      }

      // If it's a single object, convert to array
      const puzzles = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      // Validate puzzle structure
      for (const puzzle of puzzles) {
        if (!puzzle.rule || !puzzle.examples || !puzzle.tests) {
          setValidationError("Each puzzle must have 'rule', 'examples', and 'tests' fields.");
          setIsImporting(false);
          return;
        }
        
        if (!Array.isArray(puzzle.examples) || !Array.isArray(puzzle.tests)) {
          setValidationError("'examples' and 'tests' must be arrays.");
          setIsImporting(false);
          return;
        }
        
        if (puzzle.examples.length < 2) {
          setValidationError("Each puzzle must have at least 2 examples.");
          setIsImporting(false);
          return;
        }
        
        if (puzzle.tests.length < 4) {
          setValidationError("Each puzzle must have at least 4 test cases.");
          setIsImporting(false);
          return;
        }
      }
      
      // Format puzzles for API
      const formattedPuzzles = puzzles.map(puzzle => {
        // Combine examples and tests for inputs and outputs
        const allInputOutput = [...puzzle.examples, ...puzzle.tests];
        
        // Convert to string arrays
        const inputs = allInputOutput.map(item => String(item.input));
        const outputs = allInputOutput.map(item => String(item.output));
        
        // Use all available input/output pairs - don't limit to 6
        const finalInputs = inputs;
        const finalOutputs = outputs;
        
        return {
          rule: puzzle.rule,
          inputs: finalInputs,
          outputs: finalOutputs
        };
      });
      
      // Import puzzles
      await importPuzzles(formattedPuzzles);
      
      toast({
        title: "Import Successful",
        description: `Imported ${formattedPuzzles.length} puzzle(s)`,
      });
      
      onClose();
    } catch (error) {
      console.error('Import error:', error);
      setValidationError("Failed to import puzzles. Please try again.");
    } finally {
      setIsImporting(false);
    }
  };

  // Sample JSON template
  const sampleJsonTemplate = `{
  "rule": "Add the digit sum to the number",
  "examples": [
    {"input": 10, "output": 11},
    {"input": 15, "output": 21}
  ],
  "tests": [
    {"input": 1, "output": 2},
    {"input": 24, "output": 30},
    {"input": 39, "output": 51},
    {"input": 100, "output": 101}
  ]
}

{
  "rule": "Multiply by 2 and add the original number",
  "examples": [
    {"input": 5, "output": 15},
    {"input": 10, "output": 30}
  ],
  "tests": [
    {"input": 1, "output": 3},
    {"input": 7, "output": 21},
    {"input": 12, "output": 36},
    {"input": 20, "output": 60}
  ]
}`;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-blue-400 flex items-center justify-between">
            Import Puzzles
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
        
        <div className="space-y-4">
          <p className="text-gray-300">
            Paste JSON data below to import puzzles. You can import a single puzzle, multiple puzzles pasted one after another, or an array of puzzles.
          </p>
          
          <Textarea 
            className="h-60 font-mono text-sm bg-gray-700 border-gray-600 text-gray-200"
            placeholder={sampleJsonTemplate}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
          
          {validationError && (
            <div className="rounded-md bg-red-900/20 border border-red-600 p-3 flex gap-2 items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <p className="text-red-300 text-sm">{validationError}</p>
            </div>
          )}
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2 text-blue-300">JSON Format:</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li><strong>rule</strong>: String describing the puzzle rule</li>
              <li><strong>examples</strong>: Array of at least 2 example objects with input and output fields</li>
              <li><strong>tests</strong>: Array of at least 4 test objects with input and output fields</li>
            </ul>
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
            onClick={handleImport}
            disabled={isImporting || !jsonInput.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isImporting ? 'Importing...' : 'Import Puzzles'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}