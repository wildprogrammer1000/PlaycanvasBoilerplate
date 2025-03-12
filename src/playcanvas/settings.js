export const PRELOAD_MODULES = [
  {
    moduleName: "Ammo",
    glueUrl: "modules/ammo/ammo.wasm.js",
    wasmUrl: "modules/ammo/ammo.wasm.wasm",
    fallbackUrl: "modules/ammo/ammo.js",
    preload: true,
  },
];

export const ASSET_PREFIX = "playcanvas/";
export const SCENE_PATH = "";
export const CONFIG_FILENAME = "playcanvas/config.json";
export const CONTEXT_OPTIONS = {
  antialias: true,
  alpha: false,
  preserveDrawingBuffer: false,
  deviceTypes: [`webgl2`, `webgl1`],
  powerPreference: "high-performance",
};
