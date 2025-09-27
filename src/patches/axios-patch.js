// Patch for axios toString read-only error
// This patch is applied before importing axios anywhere in the app

if (typeof window !== 'undefined' && window.URLSearchParams) {
  const originalURLSearchParams = window.URLSearchParams;
  
  // Create a patched version that doesn't have read-only toString
  window.URLSearchParams = class PatchedURLSearchParams extends originalURLSearchParams {
    constructor(...args) {
      super(...args);
      // Make toString writable
      Object.defineProperty(this, 'toString', {
        value: super.toString,
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  };
  
  // Copy static methods
  Object.setPrototypeOf(window.URLSearchParams, originalURLSearchParams);
  Object.setPrototypeOf(window.URLSearchParams.prototype, originalURLSearchParams.prototype);
}