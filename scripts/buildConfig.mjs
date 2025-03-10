/*global process*/

/**
 *
 * @param {string|undefined} nodeEnv NODE_ENV value
 * @returns {import('esbuild').BuildOptions}
 */
export default function getBuildConfig(nodeEnv = "development") {
  const define = {
    [`process.env.APP_BUILD_VERSION`]: JSON.stringify(
      process.env.npm_package_version
    ),
    [`process.env.NODE_ENV`]: JSON.stringify(nodeEnv),
  };

  return {
    entryPoints: ["src/index.tsx"],
    bundle: true,
    sourcemap: true,
    outfile: "docs/bundle.js",
    define,
  };
}
