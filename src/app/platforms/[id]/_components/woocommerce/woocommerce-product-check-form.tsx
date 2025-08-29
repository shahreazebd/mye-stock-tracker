"use client";

import { checkWooCommerceProducts } from "@/actions/woocommerce-actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import stores from "@/data/woocommerce.json";
import type { Summary } from "@/types/common";
import type { ProductData } from "@/types/woocommerce";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  store: z.string().min(1, "Store is required"),
});

interface Props {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setData: Dispatch<SetStateAction<ProductData[]>>;
  setSummary: Dispatch<SetStateAction<Summary | undefined>>;
}

export function WooCommerceProductCheckForm(props: Props) {
  const { isLoading, setIsLoading, setData, setSummary } = props;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const store = stores?.find((s) => s.id === values.store);
      if (!store) {
        throw new Error("Store not found");
      }

      const payload = {
        url: store.url,
        consumerKey: store.consumerKey,
        consumerSecret: store.consumerSecret,
        myeLocationId: store.myeLocationId,
        myeStoreId: store.myeStoreId,
        myeCompanyId: store.myeCompanyId,
        maxStock: store.maxStock,
        name: store.name,
      };

      setIsLoading(true);
      const result = await checkWooCommerceProducts(payload);

      if (result.success) {
        setData(result.data);
        setSummary(result.summary);
        // You can add success feedback here
      } else {
        console.error("Error checking products:", result.error);
        // You can add error feedback here
      }
    } catch (error) {
      console.error("Error checking products:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="store"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select website" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button disabled={isLoading} type="submit">
            {isLoading ? "Loading..." : "Check Products"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
