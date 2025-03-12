import {
  Application,
  createGraphicsDevice,
  ElementInput,
  Keyboard,
  Mouse,
  TouchDevice,
} from "playcanvas";
import {
  ASSET_PREFIX,
  CONFIG_FILENAME,
  CONTEXT_OPTIONS,
  PRELOAD_MODULES,
  SCENE_PATH,
} from "./settings";
import { loadModules } from "./modules";
import showLoadingScreen from "./loading";
import evt from "@/utils/event-handler";

async function main() {
  const container = document.querySelector("#app-canvas-container");
  const canvas = document.querySelector("#app-canvas");
  if (!canvas) {
    console.error("canvas not found");
    return;
  }
  const device = await createGraphicsDevice(canvas, CONTEXT_OPTIONS);
  device.maxPixelRatio = Math.min(window.devicePixelRatio, 2);
  const resize = () => {
    canvas.width = container.clientWidth * device.maxPixelRatio;
    canvas.height = container.clientHeight * device.maxPixelRatio;
    canvas.style.width = container.clientWidth + "px";
    canvas.style.height = container.clientHeight + "px";
  };
  resize();
  window.addEventListener("resize", resize);

  const app = new Application(canvas, {
    graphicsDevice: device,
    elementInput: new ElementInput(canvas, {
      useMouse: true,
      useTouch: true,
    }),
    keyboard: new Keyboard(window),
    mouse: new Mouse(canvas),
    touch: new TouchDevice(canvas),
    assetPrefix: ASSET_PREFIX,
  });
  app.on("canvas:resize", resize);

  evt.emit("asset:beforeload", app);

  loadModules(PRELOAD_MODULES, "", () => {
    showLoadingScreen(app);
    app.configure(CONFIG_FILENAME, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      setTimeout(() => {
        app.preload(() => {
          app.scenes.loadScene(SCENE_PATH, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            app.start();
          });
        });
      });
    });
  });
  return app;
}
export default main;
