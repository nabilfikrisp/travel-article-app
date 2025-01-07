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
import { mutateDeleteArticle } from "@/store/slices/article/articleSlice";
import { fetchGetMe } from "@/store/slices/auth/authSlice";
import { Trash2Icon } from "lucide-react";
import { useNavigate } from "react-router";

type DeleteArticleButtonProps = {
  articleDocumentId: string;
};

export default function DeleteArticleButton({ articleDocumentId }: DeleteArticleButtonProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  async function onDeleteClick() {
    try {
      await dispatch(mutateDeleteArticle(articleDocumentId)).unwrap();

      await dispatch(fetchGetMe());
      navigate("/profile");
      toast({ description: "Article successfully deleted!" });
    } catch (error: unknown) {
      toast({ description: `Uh Oh! ${error as string}`, variant: "destructive" });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="text-foreground">
          Delete
          <Trash2Icon className="ml-1 h-4 w-4 text-foreground" />
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
