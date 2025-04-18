/**
 * Helper functions for the CLI
 */

/**
 * Pause execution for the specified amount of time
 * @param {number} ms - Time to sleep in milliseconds
 * @returns {Promise} - Promise that resolves after the specified time
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Format text for displaying in the console
 * @param {string} text - Text to format
 * @param {string} type - Type of formatting (success, error, info, warning)
 * @returns {string} - Formatted text
 */
export const formatText = (text, type = 'info') => {
  return text;
};

/**
 * Validate if a string is a valid name (no special characters)
 * @param {string} name - Name to validate
 * @returns {boolean} - Whether the name is valid
 */
export const isValidName = (name) => {
  return /^[a-zA-Z0-9-_]+$/.test(name);
};