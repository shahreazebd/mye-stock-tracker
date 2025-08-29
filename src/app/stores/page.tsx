import { Plus } from "lucide-react";
import { getStores } from "@/actions/store-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StoreUpsertWrapper } from "./_components/store-upsert-wrapper";

export const dynamic = "force-dynamic";

export default async function StoresPage() {
  const result = await getStores();
  const stores = result.success && result.data ? result.data : [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl text-foreground">Stores</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your store configurations and settings
          </p>
        </div>
        <StoreUpsertWrapper />
      </div>

      {stores.length === 0 ? (
        <Card className="py-12 text-center">
          <CardHeader>
            <CardTitle>No stores found</CardTitle>
            <CardDescription>Get started by creating your first store</CardDescription>
          </CardHeader>
          <CardContent>
            <StoreUpsertWrapper
              trigger={
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add First Store
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <Card key={store.id}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {store.platformId}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{store.myeStoreId}</CardDescription>
                <div className="text-muted-foreground text-sm">
                  <p className="truncate">URL: {store.myeStoreId}</p>
                  <p className="mt-1">
                    Created: {new Date(store.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
