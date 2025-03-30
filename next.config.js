/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  /**
   * Customizes the Webpack configuration.
   * @param {import('webpack').Configuration} config The current Webpack configuration.
   * @param {{ webpack: typeof import('webpack'), buildId: string, dev: boolean, isServer: boolean, defaultLoaders: object }} options Context object provided by Next.js, including the webpack instance.
   * @returns {import('webpack').Configuration} The modified Webpack configuration.
   */
  webpack: (config, { webpack }) => {
    // Ensure plugins array exists before pushing
    config.plugins = config.plugins || [];

    if (process.env.NODE_ENV === "production") {
      // Now 'webpack' comes from the destructured 'options' parameter,
      // and 'config' is typed by the JSDoc above.
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/app\/\(app\)\/seed\//,
        }),
      );
    }
    return config;
  },
};

export default config;
