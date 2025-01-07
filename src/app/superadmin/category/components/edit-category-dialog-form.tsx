import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import CategoryForm from "./category-form";
import { FilePenLineIcon } from "lucide-react";
import { Category } from "@/store/slices/category/types";

import { DialogTrigger } from "@radix-ui/react-dialog";

export function EditCategoryDialogForm({ category }: { category: Category }) {
  return (
    <Dialog>
      <Button size="icon" asChild>
        <DialogTrigger>
          <FilePenLineIcon className="text-foreground" />
        </DialogTrigger>
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <CategoryForm initialValues={category} />
      </DialogContent>
    </Dialog>
  );
}
