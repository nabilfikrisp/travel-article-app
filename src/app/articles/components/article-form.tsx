import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchArticleByDocumentId,
  mutatePostArticle,
  mutatePostImage,
  mutatePutArticle,
} from "@/store/slices/article/articleSlice";
import { Category } from "@/store/slices/category/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

const MAX_IMAGE_SIZE = 5242880; // 5 MB
// const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

function getImageData(event: ChangeEvent<HTMLInputElement>) {
  // FileList is immutable, so we need to create a new one
  const dataTransfer = new DataTransfer();

  // Add newly uploaded images
  Array.from(event.target.files!).forEach((image) => dataTransfer.items.add(image));

  const files = dataTransfer.files;
  const displayUrl = URL.createObjectURL(event.target.files![0]);

  return { files, displayUrl };
}

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Invalid title" })
    .max(100, { message: "Character limit reached" })
    .trim(),
  description: z
    .string()
    .min(5, { message: "Invalid description" })
    .max(400, { message: "Character limit reached" })
    .trim(),
  cover_image_url: z.string().optional(),
  category: z.coerce.number().optional(),

  files: z
    .custom<FileList>((val) => val instanceof FileList, "Silahkan pilih gambar")
    .refine((files) => files.length > 0, `Silahkan pilih gambar`)
    .refine((files) => files.length <= 1, `Only 1 image are allowed.`)
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_IMAGE_SIZE),
      `File size should be less than 5 MB.`
    )
    .optional(),
  // .refine(
  //   (files) => Array.from(files).every((file) => ALLOWED_IMAGE_TYPES.includes(file.type)),
  //   "Hanya ekstensi .jpg and .jpeg yang dapat diupload"
  // ),
});

type ArticleFormProps = {
  categories: Category[];
  initialData?: {
    title: string;
    description: string;
    cover_image_url: string | null | undefined;
    category: Category | null | undefined;
    articleDocumentId: string;
  };
};

// INITIAL DATA ONLY USED WHEN EDIT
export default function ArticleForm({ categories, initialData }: ArticleFormProps) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.article.mutation);
  const { status: categoriesStatus } = useAppSelector((state) => state.category.categories);
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string>(
    initialData ? initialData.cover_image_url || "" : ""
  );

  const categoriesInput = categories.map((datum) => ({ label: datum.name, value: datum.id }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          cover_image_url: initialData.cover_image_url || "",
          category: initialData.category?.id || undefined,
        }
      : {
          title: "",
          description: "",
          cover_image_url: "",
          category: undefined,
        },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let coverImageUrl;
      if (values.files && values.files.length > 0) {
        const uploadImageResponse = await dispatch(mutatePostImage(values.files[0])).unwrap();
        coverImageUrl = uploadImageResponse[0].url;
      }

      const articlePayload = {
        title: values.title,
        description: values.description,
        category: values.category || undefined,
        cover_image_url: coverImageUrl || values.cover_image_url,
      };

      if (initialData) {
        await dispatch(
          mutatePutArticle({
            articleDocumentId: initialData.articleDocumentId,
            dto: articlePayload,
          })
        ).unwrap();
      } else {
        await dispatch(mutatePostArticle(articlePayload)).unwrap();
      }
      toast({ description: initialData ? "Article updated!" : "Article created!" });

      if (initialData) {
        await dispatch(fetchArticleByDocumentId(initialData.articleDocumentId));
        navigate(`/articles/${initialData.articleDocumentId}`);
      } else {
        navigate("/profile");
      }
    } catch (error: unknown) {
      console.error(error);
      toast({ description: `Uh Oh! ${String(error)}`, variant: "destructive" });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Title <span className="text-red-400">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Kebumen" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description <span className="text-red-400">*</span>
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Kebumen adalah tempat yang indah" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Category</FormLabel>
              <Popover>
                <PopoverTrigger asChild disabled={categoriesStatus === "loading"}>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "flex w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? categoriesInput.find((category) => category.value === field.value)?.label
                        : "Select category"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search categories..." />
                    <CommandList>
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {categoriesInput.map((category) => (
                          <CommandItem
                            value={category.label}
                            key={category.value}
                            onSelect={() => {
                              form.setValue("category", category.value);
                            }}
                          >
                            {category.label}
                            <CheckIcon
                              className={cn(
                                "ml-auto",
                                category.value === field.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="files"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Input Gambar</FormLabel>
              <FormControl>
                <Input
                  className="dark:file:text-foreground"
                  type="file"
                  onChange={(event) => {
                    const { files, displayUrl } = getImageData(event);
                    setPreview(displayUrl);
                    onChange(files);
                  }}
                  {...rest}
                />
              </FormControl>
              {/* <FormDescription>Gambar dengan ekstensi .jpg dan .jpeg</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex h-[300px] w-full items-center justify-center rounded-sm border border-input p-2 sm:h-[400px]">
          {preview ? (
            <img src={preview} className="mx-auto h-full max-h-[300px] sm:max-h-[400px]" />
          ) : (
            <div className="text-center text-gray-400">Preview Gambar</div>
          )}
        </div>

        <Button type="submit" className="mt-4" isLoading={status === "loading"}>
          {initialData ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
