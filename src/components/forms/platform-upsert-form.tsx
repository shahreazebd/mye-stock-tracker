"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2, Plus, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { upsertPlatform } from "@/actions/platform-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { type PlatformFormData, platformSchema } from "@/lib/validations/platform";

interface Props {
  platform?: {
    id: string;
    name: string;
    description: string | null;
    image: string;
  };
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function PlatformUpsertForm({ platform, trigger, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    platform?.image || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PlatformFormData>({
    resolver: zodResolver(platformSchema),
    defaultValues: {
      name: platform?.name || undefined,
      description: platform?.description || "",
      image: undefined,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(platform?.image || null);
    form.setValue("image", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: PlatformFormData) => {
    try {
      const formData = new FormData();

      // Add platform ID if editing
      if (platform?.id) {
        formData.append("id", platform.id);
      }

      formData.append("name", data.name);

      if (data.description) {
        formData.append("description", data.description);
      }

      if (data.image) {
        formData.append("image", data.image);
      }

      const result = await upsertPlatform(formData);

      if (result.success) {
        toast.success(
          platform ? "Platform updated successfully!" : "Platform created successfully!",
        );
        setOpen(false);
        setImagePreview(null);
        form.reset();
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to save platform");
      }
    } catch (error) {
      console.error("Error saving platform:", error);
      toast.error("Failed to save platform");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
      setImagePreview(platform?.image || null);
    }
  };

  const defaultTrigger = (
    <Button size="sm" className="gap-2">
      {platform ? (
        <>
          <Edit className="h-4 w-4" />
          Edit
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" />
          Add platform
        </>
      )}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{platform ? "Edit Platform" : "Add New Platform"}</DialogTitle>
          <DialogDescription>
            {platform
              ? "Update the platform information below."
              : "Create a new platform by filling out the form below."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform Name</FormLabel>
                  <Input placeholder="Enter platform name..." {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter platform description..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Platform Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {imagePreview ? (
                        <Card>
                          <CardContent className="p-4">
                            <div className="relative">
                              <Image
                                src={imagePreview}
                                alt="Preview"
                                width={400}
                                height={128}
                                className="h-32 w-full rounded-lg object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={handleRemoveImage}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed text-sm transition-colors hover:border-muted-foreground/50"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Click to upload image
                            </span>
                          </div>
                        </button>
                      )}
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {platform ? "Update" : "Create"} Platform
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
