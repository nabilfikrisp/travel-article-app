import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { formatISODate } from "@/lib/format-iso-date";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { articleSliceAction } from "@/store/slices/article/articleSlice";
import { mutatePutComment } from "@/store/slices/comment/commentSlice";
import { CommentDetail } from "@/store/slices/comment/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePenLineIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DeleteCommentButton from "./delete-comment-button";

type ArticleCommendCardProps = {
  datum: CommentDetail;
  articleDocumentId: string;
};

const formSchema = z.object({
  content: z.string().min(1, { message: "Comment must not be empty" }),
  article: z.number(),
});

export default function ArticleCommentCard({ datum, articleDocumentId }: ArticleCommendCardProps) {
  const dispatch = useAppDispatch();
  const userFromStore = useAppSelector((state) => state.auth);
  const { status } = useAppSelector((state) => state.comment.mutation);
  const { id: articleId } = useAppSelector(
    (state) => state.article.detail.datum[articleDocumentId]
  );
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: datum.content,
      article: articleId,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { response } = await dispatch(
        mutatePutComment({ ...values, commentDocumentId: datum.documentId, articleDocumentId })
      ).unwrap();

      dispatch(
        articleSliceAction.updateCommentOfArticle({ articleDocumentId, comment: response.data })
      );
      toast({ description: "Comment successfully edited!" });
      setIsEditing(false);
    } catch (error: unknown) {
      toast({ description: `Uh Oh! ${error as string}`, variant: "destructive" });
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-foreground p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{datum.user.username}</span>
          <span className="text-sm">{formatISODate(datum.publishedAt)}</span>
        </div>
        {userFromStore && userFromStore.user?.id === datum.user.id && (
          <div className="flex items-center gap-2">
            <Button size="icon" className="h-8 w-8" onClick={() => setIsEditing((prev) => !prev)}>
              <FilePenLineIcon className="h-4 w-4" />
            </Button>
            <DeleteCommentButton
              articleDocumentId={articleDocumentId}
              commentDocumentId={datum.documentId}
            />
          </div>
        )}
      </div>

      {!isEditing ? (
        <p>{datum.content}</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Share your thoughts..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" isLoading={status === "loading"}>
              Edit Comment
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
