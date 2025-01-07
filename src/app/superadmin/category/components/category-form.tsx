import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { mutatePostCategory, mutatePutCategory } from "@/store/slices/category/categorySlice";
import { Category } from "@/store/slices/category/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type CategoryFormProps = {
  initialValues?: Category;
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Invalid category name" }),
});

export default function CategoryForm({ initialValues }: CategoryFormProps) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.category.mutation);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (initialValues) {
        await dispatch(
          mutatePutCategory({ documentId: initialValues.documentId, name: values.name })
        ).unwrap();
        toast({ description: "Category Successfully edited  " });
      } else {
        await dispatch(mutatePostCategory(values)).unwrap();
        toast({ description: "Category Successfully created" });
      }
    } catch (error: unknown) {
      toast({ description: `Uh Oh! ${error as string}`, variant: "destructive" });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-4" isLoading={status === "loading"}>
          {initialValues ? "Edit Category" : "Create Category"}
        </Button>
      </form>
    </Form>
  );
}
