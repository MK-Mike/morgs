"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect, useMemo } from "react";

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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { info } from "console";
// Define the shape of the data passed to the component

type SectorAndId = {
  id: number;
  name: string;
  routeNumbers: number[];
};

// Define the Zod schema for form validation
// We only validate fields that are editable in the form

// Create a schema factory function that takes sectors data
const createRouteFormSchema = (sectors: SectorAndId[]) =>
  z
    .object({
      slug: z.string().min(2, {
        message:
          "Slug too short. Like a crimp hold, we need at least 2 fingers... er, characters.",
      }),
      routeNumber: z.number({
        invalid_type_error:
          "Must be a number. Routes aren't graded with letters, mate.",
      }),
      name: z.string().min(2, {
        message: "Route name too short. Even 'V0' has two characters.",
      }),
      firstAscent: z.string({
        invalid_type_error:
          "We need a name. 'Some bloke' doesn't count as a first ascent.",
      }),
      date: z.string({
        invalid_type_error:
          "Need a proper date. 'When dinosaurs roamed' isn't specific enough.",
      }),
      info: z.string().optional(),
      sectorId: z.coerce.number().positive({
        message: "Please select a sector. Routes don't just float in mid-air.",
      }),
      grade: z
        .number({
          invalid_type_error:
            "Grades are numbers. 'Scary' is not a valid grade.",
        })
        .min(8, {
          message: "Grade too low. Even a boulderer could warm up on this.",
        })
        .max(40, {
          message: "Grade too high....",
        }),
      routeStyle: z.enum(["trad", "sport", "solo"], {
        errorMap: () => ({
          message:
            "Invalid style. Pick trad, sport, or solo. No 'freefall' option here.",
        }),
      }),
      stars: z.number().min(0).max(5, {
        message: "Max 5 stars. This isn't a Michelin restaurant on a cliff.",
      }),
      description: z.string().refine((val) => val.split(/\s+/).length > 3, {
        message:
          "Description too short. Give us more than 'it was hard'—at least 3 words.",
      }),
    })
    .superRefine((data, ctx) => {
      console.log("Running superRefine validation", {
        sectorId: data.sectorId,
        routeNumber: data.routeNumber,
      });

      // Skip validation if no sector selected or no route number
      if (!data.sectorId || data.routeNumber === undefined) {
        console.log("Skipping validation - missing data");
        return;
      }

      const selectedSector = sectors.find((s) => s.id === data.sectorId);
      console.log("Selected sector:", selectedSector);

      if (!selectedSector) {
        console.log("Sector not found");
        return;
      }

      console.log("Checking route numbers:", {
        routeNumbers: selectedSector.routeNumbers,
        currentNumber: data.routeNumber,
        exists: selectedSector.routeNumbers.includes(data.routeNumber),
      });

      if (selectedSector.routeNumbers.includes(data.routeNumber)) {
        console.log("Route number already exists - adding issue");
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Route number ${data.routeNumber} already exists in ${selectedSector.name}. Try another number.`,
          path: ["routeNumber"],
        });
      }
    });
// Define the props for the dialog component
interface EditHeadlandDialogProps {
  sectors: SectorAndId[];
  // The server action to call on save
  // It receives the original ID and the updated form data
  onSaveAction: (data: {
    slug: string;
    name: string;
    routeNumber: number | null;
    grade: number | null;
    stars: number;
    description: string;
    firstAscent: string;
    date: string;
    info: string;
    routeStyle: string;
    sectorId: number;
  }) => Promise<{ status: string; success: boolean; message: object }>;
  // children: React.ReactNode; // The element that triggers the dialog (e.g., a Button)
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
export function NewRouteForm({
  onSaveAction,
  sectors,
  onFinishedAction,
}: EditHeadlandDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Define the type for the validated form data
  const routeFormSchema = createRouteFormSchema(sectors);
  type FormValues = z.infer<typeof routeFormSchema>;
  const { toast } = useToast();
  const defaultFormValues = useMemo(
    () => ({
      name: "",
      slug: "",
      // Use undefined for empty number fields if schema requires numbers
      routeNumber: undefined,
      grade: undefined,
      stars: undefined,
      firstAscent: "",
      date: "",
      info: "",
      // Use 'as const' or explicitly type the union for routeStyle
      routeStyle: "trad" as "trad" | "sport" | "solo",
      sectorId: 0,
      description: "",
    }),
    [],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(routeFormSchema),
    mode: "onChange",
    // Use defaultValues to pre-populate the form
    defaultValues: defaultFormValues,
  });

  // Reset form when route prop changes (if dialog is reused)
  // or when dialog opens to ensure fresh default values if form being used inside a dialog
  useEffect(() => {
    if (isOpen) {
      form.reset(defaultFormValues);
      setServerError(null); // Clear previous errors when opening
    }
  }, [defaultFormValues, isOpen, form]);

  useEffect(() => {
    if (!isSubmitting) {
      form.reset(defaultFormValues);
      setServerError(null); // Clear previous errors when opening
    }
  }, [defaultFormValues, isSubmitting, form]);
  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    console.log("Form submitted with values:", values);
    try {
      // Call the server action passed via props
      const data = {
        slug: values.slug,
        name: values.name,
        routeNumber: values.routeNumber,
        grade: values.grade,
        stars: values.stars,
        firstAscent: values.firstAscent,
        date: values.date,
        info: values.info,
        routeStyle: values.routeStyle,
        sectorId: values.sectorId,
        description: values.description,
      };
      const result = await onSaveAction(data);

      if (result?.status === "error") {
        // Handle errors returned from server action
        // setServerError(result.error);
        // Optional: Show toast notification for server error
        toast({
          title: "Save Failed",
          description: result.message.toString() || "Unknown error",
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
    <div className="flex h-full w-full flex-col items-center justify-center">
      {/* Use the shadcn Form component */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.error("Form validation errors:", errors);
          })}
          className="space-y-4"
        >
          <div className="w-full">
            {/* Sector Field */}
            <FormField
              control={form.control}
              name="sectorId" // Control the ID field
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sector</FormLabel>
                  <Select
                    // Ensure the controlled value is a string for the Select
                    value={
                      field.value !== undefined && field.value !== null
                        ? String(field.value)
                        : ""
                    }
                    onValueChange={(value) => {
                      // Pass the string ID from the SelectItem to RHF
                      field.onChange(value);

                      // Find the selected sector
                      const selectedSector = sectors.find(
                        (s) => s.id === parseInt(value),
                      );

                      // If sector found, set routeNumber to the next available number
                      if (selectedSector) {
                        const existingNumbers = selectedSector.routeNumbers;
                        // Find the next available number or use length + 1
                        const nextNumber =
                          existingNumbers.length > 0
                            ? Math.max(...existingNumbers) + 1
                            : 1;

                        form.setValue("routeNumber", nextNumber);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger id="sectorId" className="w-[180px]">
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="select" disabled>
                        Select a sector
                      </SelectItem>
                      {sectors.map((sector) => (
                        <SelectItem key={sector.id} value={String(sector.id)}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                      type="number"
                      onChange={(e) => {
                        const value = e.target.value;
                        // If empty, set to undefined or null instead of 0
                        field.onChange(
                          value === "" ? undefined : parseInt(value, 10),
                        );
                      }}
                      // Format the value to avoid leading zeros
                      value={field.value === 0 ? "" : (field.value ?? "")}
                      // Add min attribute to prevent negative numbers if needed
                      min="1"
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
                      placeholder="e.g., 18"
                      type="number"
                      onChange={(e) => {
                        const value = e.target.value;
                        // Convert to number, default to 0 or null if empty/invalid
                        field.onChange(
                          value === "" ? undefined : parseInt(value, 10),
                        );
                      }}
                      // Ensure the value passed *to* the input is also a number
                      value={field.value ?? ""}
                      min="8"
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
                      type="number"
                      onChange={(e) => {
                        const value = e.target.value;
                        // Convert to number, default to 0 or null if empty/invalid
                        field.onChange(
                          value === "" ? undefined : parseInt(value, 10),
                        );
                      }}
                      // Ensure the value passed *to* the input is also a number
                      value={field.value ?? ""}
                      min="-1"
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

          <div className="flex w-full flex-row justify-between gap-2 pt-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
