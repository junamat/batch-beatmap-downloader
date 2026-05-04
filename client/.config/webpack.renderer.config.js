/* eslint @typescript-eslint/no-var-requires: "off"  */
const allRules = require("./webpack.rules");
const plugins = require("./webpack.renderer.plugins");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const path = require("path");

// asset-relocator-loader uses __dirname at runtime — not available in renderer (nodeIntegration: false)
const rules = allRules.filter(r => {
  const loaders = [].concat(r.use || []);
  return !loaders.some(l => (l.loader || l) === "@vercel/webpack-asset-relocator-loader");
});

rules.push({
  test: /\.css$/,
  use: [
    { loader: "style-loader" },
    { loader: "css-loader", options: { importLoaders: 1 } },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          config: path.join(__dirname, "postcss.config.js"),
        },
      },
    },
  ],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    fallback: { domain: false },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    plugins: [
      new TsconfigPathsPlugin({
        baseUrl: ".",
      }),
    ],
  },
};
