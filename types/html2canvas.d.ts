export = index;
declare function index(element: any, conf: any): any;
declare namespace index {
  class CanvasRenderer {
    constructor(canvas: any);
    canvas: any;
    clip(clipPaths: any, callback: any): void;
    drawImage(image: any, source: any, destination: any): void;
    drawShape(path: any, color: any): void;
    fill(color: any): void;
    getTarget(): any;
    path(_path: any): void;
    rectangle(x: any, y: any, width: any, height: any, color: any): void;
    render(options: any): void;
    renderLinearGradient(bounds: any, gradient: any): void;
    renderRadialGradient(bounds: any, gradient: any): void;
    renderRepeat(path: any, image: any, imageSize: any, offsetX: any, offsetY: any): void;
    renderTextNode(textBounds: any, color: any, font: any, textDecoration: any, textShadows: any): void;
    resizeImage(image: any, size: any): any;
    setOpacity(opacity: any): void;
    transform(offsetX: any, offsetY: any, matrix: any, callback: any): void;
  }
}
