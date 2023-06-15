const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');
const path = require('path');

let loadedWasm = false;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(nextConfig) {
    if (!loadedWasm) {
      loadedWasm = true;
      nextConfig.plugins.push(
        new WasmPackPlugin({
          crateDirectory: path.resolve(__dirname, 'utfdump', 'wasm'),
          outDir: path.resolve(__dirname, 'wasm', 'utfdump'),
          forceMode: 'production',
          extraArgs: '--target web',
        })
      );
    }

    return nextConfig;
  },
};

module.exports = nextConfig;
