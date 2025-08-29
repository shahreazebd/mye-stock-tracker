"use server";

import xior from "xior";
import { getMyeStock } from "@/lib/products";

interface Payload {
  myeLocationId: string;
  myeCompanyId: string;
  myeStoreId: string;
  maxStock: number;
  name: string;
}

async function fetchProducts(storeId: string) {
  const products = await xior.get(
    `https://api.manageyourecommerce.com/otto/api/v1/product/quantity-fetch?channel_uid=${storeId}`,
  );

  return products.data?.data;
}

async function getMyeProducts(company: string, location: string) {
  const url = `https://api.manageyourecommerce.com/miams/api/v1/stock/get-all-stock/${company}/${location}/?page_size=5000&page=1`;

  const response = await xior.get(url, {
    headers: { "SECRET-KEY": `${process.env.MIAMS_SECRET_KEY}` },
  });

  return response.data?.data;
}

async function getMyeMappedProducts(company: string, storeId: string) {
  const url = `https://api.manageyourecommerce.com/miams/api/v1/mapping/mapped-product/${company}/${storeId}/`;

  const response = await xior.get(url, {
    headers: { "SECRET-KEY": `${process.env.MIAMS_SECRET_KEY}` },
  });

  return response.data?.data;
}

export async function checkOttoProducts(payload: Payload) {
  try {
    const { myeStoreId, myeLocationId, myeCompanyId, maxStock, name } = payload;

    const data = await getMyeStock(myeCompanyId, myeStoreId);
    const ottoProducts = await fetchProducts(myeStoreId);

    // const myeProducts = await getMyeProducts(myeCompanyId, myeLocationId);
    // const myeMappedProducts = await getMyeMappedProducts(myeCompanyId, myeStoreId);

    // const productWithInventory = myeMappedProducts.map((mapped: any) => {
    //   const mappedProduct = myeProducts.find(
    //     (product: any) =>
    //       product.local_product.local_product_id === mapped?.mapping?.local_product,
    //   );

    //   return {
    //     isMapped: !!mapped?.mapping?.local_product,
    //     localProductId: mappedProduct?.local_product?.local_product_id,
    //     localProductName: mappedProduct?.local_product?.local_product_name,
    //     localProductSku: mappedProduct?.local_product?.local_product_sku,
    //     inOpen: mappedProduct?.in_open || 0,
    //     stockLevel: mappedProduct?.stock_level || 0,
    //     pendingQuantity: mappedProduct?.pending_quantity || 0,
    //     remoteProductId: +mapped?.remote_product_id,
    //     remoteProductSku: mapped?.remote_product_sku,
    //   };
    // });

    const final = data.stock_data.map((product) => {
      const otto: any = ottoProducts.find(
        (v: any) => v.sku === product?.remote_product_sku,
      );

      return {
        otto: {
          remoteProductSku: otto?.sku,
          stockQuantity: otto?.quantity,
        },
        mye: product,
      };
    });

    // const final = productWithInventory.map((product: any) => {
    //   const otto: any = ottoProducts.find(
    //     (v: any) => v.sku === product?.remoteProductSku,
    //   );
    //   // const { id, sku, permalink, stock_status, stock_quantity } = variation;
    //   return {
    //     otto: {
    //       remoteProductSku: otto?.sku,
    //       stockQuantity: otto?.quantity,
    //     },
    //     mye: product,
    //   };
    // });

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
      failedSku: [] as any[],
      unmappedSku: [] as any[],
    };

    const finalData = final.map((item: any) => {
      summary.total += 1;
      const { mye, otto } = item;
      // if (!mye.isMapped) {
      //   summary.unmapped += 1;
      //   summary.unmappedSku.push(item?.otto?.remoteProductSku ?? "");
      // } else {

      const isFailed = otto.stockQuantity !== mye.available_quantity;

      // if (mye.stockLevel < otto.stockQuantity) {
      //   isFailed = true;
      // } else if (mye.stockLevel <= 10) {
      //   isFailed = mye.stockLevel !== otto.stockQuantity + mye.inOpen;
      // } else {
      //   isFailed = otto.stockQuantity !== maxStock;
      // }

      // if (otto.stockQuantity === mye.available_quantity) {
      //   console.log(otto.stockQuantity, "=", mye.available_quantity);
      //   isFailed = false;
      // } else {
      //   isFailed = true;
      // }

      if (isFailed) {
        summary.failed += 1;
        summary.failedSku.push(item?.otto?.remoteProductSku ?? "");
      } else {
        summary.success += 1;
      }
      // }

      return item;
    });

    return {
      success: true,
      message: "Products checked successfully",
      data: finalData,
      summary: {
        ...summary,
        accuracy: ((summary.success / summary.total) * 100).toFixed(2),
      },
    };

    // const finalData = final.map((item: any) => {
    //   summary.total += 1;
    //   const { mye, otto } = item;
    //   if (!mye.isMapped) {
    //     summary.unmapped += 1;
    //     summary.unmappedSku.push(item?.otto?.remoteProductSku ?? "");
    //   } else {
    //     let isFailed = false;

    //     if (mye.stockLevel < otto.stockQuantity) {
    //       isFailed = true;
    //     } else if (mye.stockLevel <= 10) {
    //       isFailed = mye.stockLevel !== otto.stockQuantity + mye.inOpen;
    //     } else {
    //       isFailed = otto.stockQuantity !== maxStock;
    //     }

    //     if (isFailed) {
    //       summary.failed += 1;
    //       summary.failedSku.push(item?.otto?.remoteProductSku ?? "");
    //     } else {
    //       summary.success += 1;
    //     }
    //   }

    //   return item;
    // });

    // return {
    //   success: true,
    //   message: "Products checked successfully",
    //   data: finalData,
    //   summary: {
    //     ...summary,
    //     accuracy: ((summary.success / summary.total) * 100).toFixed(2),
    //   },
    // };
  } catch (error) {
    console.error("Error checking products:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while checking products",
    };
  }
}
