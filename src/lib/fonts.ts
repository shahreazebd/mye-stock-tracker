import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

// Export font variables for CSS custom properties
export const fontSans = GeistSans.variable; // will be --font-geist-sans
export const fontMono = GeistMono.variable; // will be --font-geist-mono

// Combined font classes for applying to html/body
export const fontClasses = `${fontSans} ${fontMono}`;

// Export the font objects for direct use if needed
export { GeistMono, GeistSans };
