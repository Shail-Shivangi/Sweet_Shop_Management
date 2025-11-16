// CRITICAL FIX: Imports the extended matchers for Jest from jest-dom
import '@testing-library/jest-dom';

// CRITICAL FIX: Suppress React Router V6 warnings from cluttering the console output during tests
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  const routerWarnings = args.some(arg => 
    typeof arg === 'string' && arg.includes('React Router Future Flag Warning')
  );
  if (!routerWarnings) {
    originalConsoleWarn(...args);
  }
};