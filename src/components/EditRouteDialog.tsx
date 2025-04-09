"use client";

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
import { useToast } from "@/hooks/use-toast";

// Define the shape of the data passed to the component
import type { Route } from "@/server/models/routes";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Define the Zod schema for form validation
// We only validate fields that are editable in the form
const routeFormSchema = z.object({
  id: z.number(),
  slug: z.string().min(2).min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  name: z.string().min(2),
  routeNumber: z.number(),
  grade: z.number(),
  stars: z.number().nullable(),
  firstAscent: z.string(),
  date: z.string(),
  info: z.string(),
  routeStyle: z.string(),
  sectorId: z.number(),
  description: z.string(),
});

// Define the type for the validated form data
type FormValues = z.infer<typeof routeFormSchema>;

// Define the props for the dialog component
interface EditHeadlandDialogProps {
  route: Route;
  // The server action to call on save
  // It receives the original ID and the updated form data
  onSaveAction: (data: {
    id: number;
    slug: string;
    name: string;
    routeNumber: number;
    grade: number;
    stars: number | null;
    description: string;
    firstAscent: string;
    date: string;
    info: string;
    routeStyle: string;
    sectorId: number;
  }) => Promise<
    { status: string; id: number } | { status: string; error: string }
  >; // Allow returning an error object
  children: React.ReactNode; // The element that triggers the dialog (e.g., a Button)
  onFinishedAction?: () => void; // Optional callback after save/close
}

// Simple slug generation function
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove invalid chars
    .replace(/\s+/g, "-") // Collapse whitespace and replace by -
    .replace(/-+/g, "-"); // Collapse dashes
};
export function EditRouteDialog({
  route,
  onSaveAction,
  children,
  onFinishedAction,
}: EditHeadlandDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const { toast } = useToast();
  // Initialize react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(routeFormSchema),
    // Use defaultValues to pre-populate the form
    defaultValues: {
      id: route.id || 0,
      name: route.name || "",
      slug: route.slug || "",
      routeNumber: route.routeNumber || 0,
      grade: route.grade || 8,
      stars: route.stars || null,
      firstAscent: route.firstAscent || "",
      date: route.date || "",
      info: route.info || "",
      routeStyle: route.routeStyle || "",
      sectorId: route.sectorId || 0,
      description: route.description || "",
    },
  });
  React.useEffect(() => {
    console.log(
      "onSaveAction is:",
      typeof onSaveAction === "function" ? "a function" : "NOT a function",
    );
  }, [onSaveAction]);

  // Reset form when route prop changes (if dialog is reused)
  // or when dialog opens to ensure fresh default values
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        id: route.id || 0,
        name: route.name || "",
        slug: route.slug || "",
        routeNumber: route.routeNumber || 0,
        grade: route.grade || 0,
        stars: route.stars || null,
        firstAscent: route.firstAscent || "",
        date: route.date || "",
        info: route.info || "",
        routeStyle: route.routeStyle || "",
        sectorId: route.sectorId || 0,
        description: route.description || "",
      });
      setServerError(null); // Clear previous errors when opening
    }
  }, [isOpen, route, form]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    console.log("Form submitted with values:", values);
    try {
      // Call the server action passed via props
      const data = {
        id: values.id || route.id,
        slug: values.slug || route.slug,
        name: values.name || route.name,
        routeNumber: values.routeNumber || route.routeNumber,
        grade: values.grade || route.grade,
        stars: values.stars || route.stars,
        firstAscent: values.firstAscent || route.firstAscent,
        date: values.date || route.date,
        info: values.info || route.info,
        routeStyle: values.routeStyle || route.routeStyle,
        sectorId: values.sectorId || route.sectorId,
        description: values.description || route.description,
      };
      const result = await onSaveAction(data);

      if (result?.status === "error") {
        // Handle errors returned from server action
        // setServerError(result.error);
        // Optional: Show toast notification for server error
        toast({
          title: "Save Failed",
          description: result.error || "Unknown error",
          open: true,
        });
      }
      if (result?.status === "success") {
        // Optional: Show success toast
        toast({
          title: "Success",
          description: "Route updated successfully.",
          open: true,
        });
        setIsOpen(false); // Close dialog on success
        onFinishedAction?.(); // Call the finished callback if provided
      }
    } catch (error) {
      console.error("Failed to save route:", error);
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
          <DialogTitle>{`Edit Route - ${route.name}`}</DialogTitle>
          <DialogDescription>
            Make changes to the Route details. Click save when you are done.
          </DialogDescription>
        </DialogHeader>

        {/* Use the shadcn Form component */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.error("Form validation errors:", errors);
            })}
            className="space-y-4"
          >
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Stanage Edge"
                      {...field}
                      onChange={(e) => {
                        // Call original onChange to update the name field state
                        field.onChange(e);
                        // Generate slug from the new name value
                        const newName = e.target.value;
                        const slug = generateSlug(newName);
                        // Set the value of the slug field
                        form.setValue("slug", slug, { shouldValidate: true }); // Optional: trigger validation
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug Field */}
            {/* <FormField */}
            {/*   control={form.control} */}
            {/*   name="slug" */}
            {/*   render={({ field }) => ( */}
            {/*     <FormItem> */}
            {/*       <FormLabel>Slug</FormLabel> */}
            {/*       <FormControl> */}
            {/*         <Input placeholder="e.g., stanage-edge" {...field} /> */}
            {/*       </FormControl> */}
            {/*       <FormMessage /> */}
            {/*     </FormItem> */}
            {/*   )} */}
            {/* /> */}

            <div className="flex flex-row gap-2">
              {/* Route Number Field */}
              <FormField
                control={form.control}
                name="routeNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Route Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 1"
                        {...field}
                        type="number"
                        onChange={(e) => {
                          const value = e.target.value;
                          // Convert to number, default to 0 or null if empty/invalid
                          field.onChange(
                            value === "" ? 0 : parseInt(value, 10),
                          );
                        }}
                        // Ensure the value passed *to* the input is also a number
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Grade Field */}
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 1"
                        {...field}
                        type="number"
                        onChange={(e) => {
                          const value = e.target.value;
                          // Convert to number, default to 0 or null if empty/invalid
                          field.onChange(
                            value === "" ? 0 : parseInt(value, 10),
                          );
                        }}
                        // Ensure the value passed *to* the input is also a number
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* stars Field */}
              <FormField
                control={form.control}
                name="stars"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stars</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 4"
                        {...field}
                        type="number"
                        onChange={(e) => {
                          const value = e.target.value;
                          // Convert to number, default to 0 or null if empty/invalid
                          field.onChange(
                            value === "" ? 0 : parseInt(value, 10),
                          );
                        }}
                        // Ensure the value passed *to* the input is also a number
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the route..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-2">
              {/* First Ascent Field */}
              <FormField
                control={form.control}
                name="firstAscent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Ascent</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Derek Marshall " {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Date Field */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2023-01-01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row gap-2">
              {/* Route Style Field */}
              <FormField
                control={form.control}
                name="routeStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Route Style</FormLabel>
                    {/* Use value and onChange directly from field */}
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger id="routeStyle" className="w-[180px]">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="trad">Trad</SelectItem>
                        <SelectItem value="sport">Sport</SelectItem>
                        <SelectItem value="solo">Solo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Info Field */}
              <FormField
                control={form.control}
                name="info"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Info</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief info about the route..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
