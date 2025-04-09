"use client"; // Forms require client-side interactivity

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Import DialogClose for the cancel button
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Define the shape of the data passed to the component
export type Headland = {
  slug: string;
  name: string;
  description: string;
  id: number;
};

// Define the Zod schema for form validation
// We only validate fields that are editable in the form
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  slug: z
    .string()
    .min(2, {
      message: "Slug must be at least 2 characters.",
    })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must be lowercase alphanumeric with hyphens.",
    }), // Basic slug validation
  description: z.string(),
});

// Define the type for the validated form data
type FormValues = z.infer<typeof formSchema>;

// Define the props for the dialog component
interface EditHeadlandDialogProps {
  headland: Headland; // The existing data
  // The server action to call on save
  // It receives the original ID and the updated form data
  onSaveAction: (data: {
    id: number;
    slug: string;
    description: string;
    name: string;
  }) => Promise<void | { error: string }>; // Allow returning an error object
  children: React.ReactNode; // The element that triggers the dialog (e.g., a Button)
  onFinishedAction?: () => void; // Optional callback after save/close
}

export function EditHeadlandDialog({
  headland,
  onSaveAction,
  children,
  onFinishedAction,
}: EditHeadlandDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  // Initialize react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // Use defaultValues to pre-populate the form
    defaultValues: {
      name: headland.name || "",
      slug: headland.slug || "",
      description: headland.description || "",
    },
  });

  // Reset form when headland prop changes (if dialog is reused)
  // or when dialog opens to ensure fresh default values
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: headland.name || "",
        slug: headland.slug || "",
        description: headland.description || "",
      });
      setServerError(null); // Clear previous errors when opening
    }
  }, [isOpen, headland, form]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setServerError(null);
    console.log("Form submitted with values:", values);
    try {
      // Call the server action passed via props
      const data = {
        id: headland.id,
        slug: values.slug,
        description: values.description,
        name: values.name,
      };
      const result = await onSaveAction(data);

      if (!result) {
        // Handle errors returned from server action
        setServerError(result.error);
        // Optional: Show toast notification for server error
        // toast({ title: "Save Failed", description: result.error, variant: "destructive" });
      } else {
        // Optional: Show success toast
        // toast({ title: "Success", description: "Headland updated successfully." });
        setIsOpen(false); // Close dialog on success
        onFinishedAction?.(); // Call the finished callback if provided
      }
    } catch (error) {
      console.error("Failed to save headland:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      setServerError(errorMessage);
      // Optional: Show generic error toast
      // toast({ title: "Error", description: "Could not save headland.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Headland</DialogTitle>
          <DialogDescription>
            Make changes to the headland details. Click save when you are done.
          </DialogDescription>
        </DialogHeader>

        {/* Use the shadcn Form component */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Stanage Edge" {...field} />
                  </FormControl>
                  <FormMessage /> {/* Displays validation errors */}
                </FormItem>
              )}
            />

            {/* Slug Field */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., stanage-edge" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the headland..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display server-side errors */}
            {serverError && (
              <p className="text-sm font-medium text-destructive">
                {serverError}
              </p>
            )}

            <DialogFooter>
              {/* Use DialogClose for the Cancel button */}
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
