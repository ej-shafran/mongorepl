/**
 * Check if an environment variable has been set to a `true`-like value
 *
 * @param {string} varName the name of the field within `process.env` to check
 *
 * @example
 * // checks if `process.env.HELLO_WORLD` is `"true"`, `"yes"`, etc.
 * const isHelloWorld = envTrue("HELLO_WORLD");
 */
export function envTrue(varName) {
  const envVar = process.env[varName];

  return (
    envVar && ["true", "yes", "1", "on", "y"].includes(envVar.toLowerCase())
  );
}
