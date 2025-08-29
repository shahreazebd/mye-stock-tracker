"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Dispatch, type SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { checkEbayProducts } from "@/actions/ebay-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import stores from "@/data/ebay.json";
import type { Summary } from "@/types/common";
import type { EbayProductData } from "@/types/ebay";

const formSchema = z.object({
  store: z.string().min(1, "Store is required"),
});

interface Props {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setData: Dispatch<SetStateAction<EbayProductData[]>>;
  setSummary: Dispatch<SetStateAction<Summary | undefined>>;
}

export function EbayProductCheckModal(props: Props) {
  const [isShowDialog, setIsShowDialog] = useState(false);
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
        myeLocationId: store.myeLocationId,
        myeStoreId: store.myeStoreId,
        myeCompanyId: store.myeCompanyId,
        maxStock: store.maxStock,
        name: store.name,
      };
      setData([]);
      setSummary(undefined);
      setIsLoading(true);
      setIsShowDialog(false);
      const result = await checkEbayProducts(payload);

      if (result.success && result?.data?.length) {
        console.log(result.data);

        setData(result.data);
        setSummary(result.summary);
      }
    } catch (error) {
      console.error("Error checking products:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button disabled={isLoading} onClick={() => setIsShowDialog(true)}>
        {isLoading ? "Checking Products..." : "Check Products"}
      </Button>

      <Dialog open={isShowDialog} onOpenChange={setIsShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check eBay Products</DialogTitle>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5">
                <FormField
                  control={form.control}
                  name="store"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select channel" />
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

                <div className="mt-5">
                  <Button disabled={isLoading} type="submit">
                    Check Products
                  </Button>
                </div>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
