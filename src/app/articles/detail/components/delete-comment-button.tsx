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
import { articleSliceAction } from "@/store/slices/article/articleSlice";
import { mutateDeleteComment } from "@/store/slices/comment/commentSlice";
import { Trash2Icon } from "lucide-react";

type DeleteCommentButtonProps = {
  commentDocumentId: string;
  articleDocumentId: string;
};

export default function DeleteCommentButton({
  commentDocumentId,
  articleDocumentId,
}: DeleteCommentButtonProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  async function onDeleteClick() {
    try {
      await dispatch(mutateDeleteComment({ articleDocumentId, commentDocumentId })).unwrap();

      dispatch(
        articleSliceAction.deleteCommentFromArticle({ articleDocumentId, commentDocumentId })
      );
      toast({ description: "Comment successfully deleted!" });
    } catch (error: unknown) {
      toast({ description: `Uh Oh! ${error as string}`, variant: "destructive" });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" className="h-8 w-8">
          <Trash2Icon className="h-4 w-4 text-foreground" />
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
            <AlertDialogAction onClick={() => onDeleteClick()}>Delete</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
