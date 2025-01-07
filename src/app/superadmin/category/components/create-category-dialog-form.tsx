import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CategoryForm from "./category-form";

export function CreateCategoryDialogForm() {
  return (
    <Dialog>
      <Button asChild>
        <DialogTrigger>Create New Category</DialogTrigger>
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <CategoryForm />
      </DialogContent>
    </Dialog>
  );
}
