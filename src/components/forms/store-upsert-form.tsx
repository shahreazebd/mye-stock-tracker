"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { upsertStore } from "@/actions/store-actions";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type StoreFormData, storeSchema } from "@/lib/validations/store";
import type { StorePlatform } from "@/types/store";

interface StoreUpsertFormProps {
  store?: {
    id: string;
    name: string;
    url: string;
    platform: StorePlatform;
    description: string | null;
  };
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const platformOptions = [
  { value: "WOOCOMMERCE", label: "WooCommerce" },
  { value: "SHOPIFY", label: "Shopify" },
  { value: "MAGENTO", label: "Magento" },
  { value: "CUSTOM", label: "Custom" },
] as const;

export function StoreUpsertForm({ store, trigger, onSuccess }: StoreUpsertFormProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: store?.name || "",
      url: store?.url || "",
      platform: store?.platform || undefined,
      description: store?.description || "",
    },
  });

  const onSubmit = async (data: StoreFormData) => {
    try {
      const formData = new FormData();

      // Add store ID if editing
      if (store?.id) {
        formData.append("id", store.id);
      }

      formData.append("name", data.name);
      formData.append("url", data.url);
      formData.append("platform", data.platform);

      if (data.description) {
        formData.append("description", data.description);
      }

      const result = await upsertStore(formData);

      if (result.success) {
        toast.success(
          store ? "Store updated successfully!" : "Store created successfully!",
        );
        setOpen(false);
        form.reset();
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to save store");
      }
    } catch (error) {
      console.error("Error saving store:", error);
      toast.error("Failed to save store");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
    }
  };

  const defaultTrigger = (
    <Button size="sm" className="gap-2">
      {store ? (
        <>
          <Edit className="h-4 w-4" />
          Edit
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" />
          Add Store
        </>
      )}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{store ? "Edit Store" : "Add New Store"}</DialogTitle>
          <DialogDescription>
            {store
              ? "Update the store information below."
              : "Create a new store by filling out the form below."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter store name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {platformOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      placeholder="Enter store description..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
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
                {store ? "Update" : "Create"} Store
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
