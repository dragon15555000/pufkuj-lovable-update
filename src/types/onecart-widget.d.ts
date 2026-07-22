// Global widget API exposed by 1koszyk embeded.bundle.js
// Confirmed by inspecting the real embed script — do not add unverified methods.
export interface OneCartWidget {
  addProduct: (shortCodeUri: string) => void;
  showWidget: () => void;
}

declare global {
  interface Window {
    oneCart?: OneCartWidget;
  }
}
