module.exports = {
  // Tells Jest where to find the test files
  roots: ['<rootDir>/src'], 
  
  // Use jsdom environment to simulate a browser DOM
  testEnvironment: 'jsdom', 

  // Points Jest to the file that imports the custom matchers (setupTests.js)
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'], 

  // CRITICAL FIX: Maps CSS imports to a mock object so tests don't break
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  
  // Use babel-jest for modern JS/JSX files
  transformIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest', 
  },
};