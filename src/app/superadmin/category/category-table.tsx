import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatISODate } from "@/lib/format-iso-date";
import { Category } from "@/store/slices/category/types";
import DeleteCategoryButton from "./components/delete-category-button";
import { EditCategoryDialogForm } from "./components/edit-category-dialog-form";

export default function CategoryTable({ categories }: { categories: Category[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Dcoument Id</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Descirption</TableHead>
          <TableHead>Published</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">{category.id}</TableCell>
            <TableCell className="font-medium">{category.documentId}</TableCell>
            <TableCell>{category.name}</TableCell>
            <TableCell>{category.description || "-"}</TableCell>
            <TableCell>{formatISODate(category.publishedAt)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <div className="ml-auto flex items-center gap-2">
                  <EditCategoryDialogForm category={category} />
                  <DeleteCategoryButton documentId={category.documentId} />
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
