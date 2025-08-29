"use server";

import xior from "xior";
import { openErrorNotification } from "@/lib/helpers";

interface Props {
  companyId: string;
  storeId: string;
  skus: string[];
}

export async function fixAllFailedAction({ companyId, storeId, skus }: Props) {
  const URL = `https://api.manageyourecommerce.com/miams/api/v1/mapping/update-stock-by-channel/${companyId}/${storeId}`;

  try {
    const response = await xior.request({
      url: URL,
      method: "POST",
      data: { skus },
      headers: { "SECRET-KEY": process.env.MIAMS_SECRET_KEY as string },
    });

    return { success: true, data: response.data };
  } catch (error) {
    openErrorNotification("Error fixing failed products");
    return { success: false, error: "Error fixing failed products" };
  }
}
