import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Puzzle } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export const usePuzzles = () => {
  const { toast } = useToast();

  // Fetch all puzzles
  const {
    data: puzzles = [],
    isLoading,
    isError,
    error,
  } = useQuery<Puzzle[]>({
    queryKey: ["/api/puzzles"],
  });

  // Create a new puzzle
  const createPuzzleMutation = useMutation({
    mutationFn: async (newPuzzle: Omit<Puzzle, "id">) => {
      const res = await apiRequest("POST", "/api/puzzles", newPuzzle);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/puzzles"] });
      toast({
        title: "Success",
        description: "Puzzle created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create puzzle: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update a puzzle
  const updatePuzzleMutation = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<Puzzle> & { id: number }) => {
      const res = await apiRequest("PUT", `/api/puzzles/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/puzzles"] });
      toast({
        title: "Success",
        description: "Puzzle updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update puzzle: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete a puzzle
  const deletePuzzleMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/puzzles/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/puzzles"] });
      toast({
        title: "Success",
        description: "Puzzle deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete puzzle: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    puzzles,
    isLoading,
    isError,
    error,
    createPuzzle: createPuzzleMutation.mutate,
    updatePuzzle: updatePuzzleMutation.mutate,
    deletePuzzle: deletePuzzleMutation.mutate,
    isCreating: createPuzzleMutation.isPending,
    isUpdating: updatePuzzleMutation.isPending,
    isDeleting: deletePuzzleMutation.isPending,
  };
};
