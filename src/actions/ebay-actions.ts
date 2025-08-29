"use server";

import { fetchEbayProducts, getMyeStock } from "@/lib/products";
import type { EbayProductData } from "@/types/ebay";

interface Payload {
  myeLocationId: string;
  myeCompanyId: string;
  myeStoreId: string;
  maxStock: number;
  name: string;
}

export async function checkEbayProducts(payload: Payload) {
  try {
    const { myeStoreId, myeLocationId, myeCompanyId, maxStock, name } = payload;

    const data = await getMyeStock(myeCompanyId, myeStoreId);

    // console.log(data);

    const ebayProducts = await fetchEbayProducts(myeStoreId);
    // const myeProductStock = await getMyeProductStock(myeCompanyId, myeLocationId);
    // const myeMappedProducts = await getMyeMappedProducts(myeCompanyId, myeStoreId);

    // const productWithInventory = myeMappedProducts.map((mappedPd) => {
    //   const mappedProduct = myeProductStock.find(
    //     (stock) =>
    //       stock.local_product.local_product_id === mappedPd?.mapping?.local_product,
    //   );
    //   const { stock_level = 0, in_open = 0, pending_quantity = 0 } = mappedProduct ?? {};

    //   return {
    //     inOpen: in_open,
    //     stockLevel: stock_level,
    //     available: stock_level - (in_open + pending_quantity),
    //     pendingQuantity: pending_quantity,
    //     isMapped: mappedProduct?.is_mapped,
    //     remoteProductId: +mappedPd?.remote_product_id,
    //     remoteProductSku: mappedPd?.remote_product_sku,
    //     localProductSku: mappedProduct?.local_product?.sku,
    //     localProductName: mappedProduct?.local_product?.name,
    //     localProductId: mappedProduct?.local_product?.local_product_id,
    //   };
    // });

    // console.log(productWithInventory);

    const final = data.stock_data.map((product) => {
      const ebay = ebayProducts.find((v) => v.sku === product?.remote_product_sku);

      return {
        ebay: {
          id: ebay?.id,
          remoteProductSku: ebay?.sku,
          name: ebay?.name,
          stockQuantity: ebay?.quantity || 0,
        },
        mye: product,
      };
    });

    const summary = {
      name,
      myeStoreId,
      myeCompanyId,
      myeLocationId,
      maxStock,
      accuracy: "0",
      success: 0,
      total: 0,
      failed: 0,
      unmapped: 0,
      failedSku: [] as string[],
      unmappedSku: [] as string[],
    };

    const finalData = final
      .filter((item) => item?.ebay?.id)
      .map((item) => {
        summary.total += 1;
        const { mye, ebay } = item;
        const isFailed = ebay.stockQuantity !== mye.available_quantity;

        // if (!mye.isMapped) {
        //   isFailed = false;
        //   summary.unmapped += 1;
        //   summary.unmappedSku.push(item?.ebay?.remoteProductSku ?? "");
        // } else {
        //   // =====

        //   // ======
        // }

        // if (
        //   // (mye.available_quantity >= maxStock && ebay.stockQuantity === maxStock) ||
        //   // (mye.available_quantity <= maxStock &&
        //   ebay.stockQuantity === mye.available_quantity
        // ) {
        //   isFailed = false;
        // } else {
        //   isFailed = true
        // }

        if (isFailed) {
          summary.failed += 1;
          summary.failedSku.push(item?.ebay?.remoteProductSku ?? "");
        } else {
          summary.success += 1;
        }

        return { ...item, isFailed };
      });

    return {
      success: true,
      message: "Products checked successfully",
      data: finalData as any as EbayProductData[],
      summary: {
        ...summary,
        accuracy: ((summary.success / summary.total) * 100).toFixed(2),
      },
    };
  } catch (error) {
    console.error("Error checking products:", error);
    return {
      success: false,
    };
  }
}
