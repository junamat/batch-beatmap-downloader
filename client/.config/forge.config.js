const path = require("path");
const package = require("../package.json");
require("dotenv").config();

const packageAssetsPath = path.join(__dirname, "..", "src", "render", "assets");

console.log(packageAssetsPath);

module.exports = {
  packagerConfig: {
    asar: true,
    icon: path.join(packageAssetsPath, "bbd.ico"),
    executableName: "batch-beatmap-downloader",
  },
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "nzbasic",
          name: "batch-beatmap-downloader",
          authToken: process.env.GITHUB_TOKEN,
        },
        draft: true,
      },
    },
  ],
  makers: [
    // https://www.electronforge.io/config/makers

    {
      name: "@electron-forge/maker-squirrel",
      platforms: ["win32"],
      config: {
        // https://js.electronforge.io/maker/squirrel/interfaces/makersquirrelconfig
        setupExe: "BBDWindowsSetup.exe",
        setupIcon: path.join(packageAssetsPath, "bbd.ico"),
        icon: path.join(packageAssetsPath, "bbd.ico"),
        iconUrl:
          "https://raw.githubusercontent.com/nzbasic/batch-beatmap-downloader/0d3d2a2f6754e0ba95f8470e71b82c579e0c5ee2/client/src/bbd.ico",
        authors: "nzbasic",
      },
    },
    {
      name: "@electron-forge/maker-dmg",
      platforms: ["darwin"],
      config: {
        // https://js.electronforge.io/maker/dmg/interfaces/makerdmgconfig
        icon: path.join(packageAssetsPath, "bbd.png"),
        overwrite: true,
        name: "Batch Beatmap Downloader", // NEEDS TO BE SHORTER THAN 27 CHARACTERS
      },
    },
    {
      name: "@electron-forge/maker-deb",
      platforms: ["linux"],
      config: {
        // https://js.electronforge.io/maker/deb/interfaces/makerdebconfig
        icon: path.join(packageAssetsPath, "bbd.png"),
      },
    },
    {
      name: "@electron-forge/maker-rpm",
      platforms: ["linux"],
      config: {
        icon: path.join(packageAssetsPath, "bbd.png"),
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["linux"],
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-webpack",
      config: {
        mainConfig: "./.config/webpack.main.config.js",
        renderer: {
          config: "./.config/webpack.renderer.config.js",
          devContentSecurityPolicy: `img-src * 'self' data: https:; default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' https://cdnjs.buymeacoffee.com;`,
          entryPoints: [
            {
              html: "./src/render/index.html",
              js: "./src/renderer.tsx",
              name: "main_window",
              preload: {
                js: "./src/preload.ts",
              },
            },
          ],
        },
      },
    },
  ],
};
