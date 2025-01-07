import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch } from "@/store/hooks";
import { mutateDeleteCategory } from "@/store/slices/category/categorySlice";
import { Trash2Icon } from "lucide-react";

export default function DeleteCategoryButton({ documentId }: { documentId: string }) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  async function handleDeleteClick() {
    try {
      await dispatch(mutateDeleteCategory(documentId)).unwrap();

      toast({ description: "Article successfully deleted!" });
    } catch (error: unknown) {
      toast({ description: `Uh Oh! ${error as string}`, variant: "destructive" });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2Icon className="text-foreground" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your comment our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button asChild variant="destructive" className="text-foreground">
            <AlertDialogAction onClick={() => handleDeleteClick()}>Delete</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
