import { toast } from "sonner";

const getPlatformColor = (name: string) => {
  switch (name) {
    case "WOOCOMMERCE":
      return "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800";
    case "EBAY":
      return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    case "AMAZON":
      return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
    case "OTTO":
      return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
    case "TIKTOK":
      return "bg-black dark:bg-black/20 border-black dark:border-black";
    default:
      return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
  }
};

const getBadgeColor = (name: string) => {
  switch (name) {
    case "WOOCOMMERCE":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800";
    case "EBAY":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800";
    case "AMAZON":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-800";
    case "OTTO":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800";
    case "TIKTOK":
      return "bg-black text-white dark:bg-black dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800";
  }
};

function downloadJSON<T>(data: T, filename: string = "data.json") {
  if (!data) {
    console.warn("No data provided to download JSON.");
    return;
  }

  // Convert data to JSON string
  const jsonString = JSON.stringify(data, null, 2); // pretty print

  // Create a blob
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a temporary link and click it
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const openSuccessNotification = (description: string) => {
  return toast.success(description);
};

const openErrorNotification = (description: string) => {
  return toast.error(description);
};

export {
  downloadJSON,
  getBadgeColor,
  getPlatformColor,
  openErrorNotification,
  openSuccessNotification,
};
