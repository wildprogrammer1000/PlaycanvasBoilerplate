import main from "@/playcanvas/start";
import { useEffect } from "react";

const Main = () => {
  useEffect(() => {
    main();
  }, []);
  return (
    <div className="flex-1 overflow-hidden" id="app-canvas-container">
      <canvas className="bg-black" id="app-canvas" />
    </div>
  );
};
export default Main;
