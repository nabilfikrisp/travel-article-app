import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { articleSliceAction } from "@/store/slices/article/articleSlice";
import { mutatePostComment } from "@/store/slices/comment/commentSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ArticleCreateCommentFormProps = {
  articleId: number;
  articleDocumentId: string;
};

const formSchema = z.object({
  content: z.string().min(1, { message: "Comment must not be empty" }),
  article: z.number(),
});

export default function ArticleCreateCommentForm({
  articleId,
  articleDocumentId,
}: ArticleCreateCommentFormProps) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.comment.mutation);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      article: articleId,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { response } = await dispatch(
        mutatePostComment({ ...values, articleDocumentId })
      ).unwrap();

      dispatch(
        articleSliceAction.pushCommentToArticle({ articleDocumentId, comment: response.data })
      );
      toast({ description: "Comment successfully sent!" });
    } catch (error: unknown) {
      toast({ description: `Uh Oh! ${error as string}`, variant: "destructive" });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-5 flex flex-col gap-4">
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
          Post Comment
        </Button>
      </form>
    </Form>
  );
}
