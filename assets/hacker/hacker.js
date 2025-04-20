// color scheme = https://coolors.co/palette/590d22-800f2f-a4133c-c9184a-ff4d6d-ff758f-ff8fa3-ffb3c1-ffccd5-fff0f3

backgroundColor(164, 19, 60);

// panel = 128, 15, 47
// panel4 = 128, 15, 47
// av = 128, 15, 47
// unnamed = 255, 117, 143
// unnamed3 = 255, 117, 143
// unnamed4 = 255, 117, 143

function fetchImageAsBase64(url, key) {
  const cached = localStorage.getItem(key);
  if (cached) return Promise.resolve(cached);

  return fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            localStorage.setItem(key, reader.result);
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
}

const panelColor = fetchImageAsBase64(
  "https://raw.githubusercontent.com/Byson94/MSE-Themes/refs/heads/main/assets/hacker/panel.png",
  "MSETHEMEpanelcolor"
);
const unnamedColor = fetchImageAsBase64(
  "https://raw.githubusercontent.com/Byson94/MSE-Themes/refs/heads/main/assets/hacker/unnamed.png",
  "MSETHEMEunnamedcolor"
);

function createUniqueTexture(base64) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const base = new PIXI.BaseTexture(image);
      const texture = new PIXI.Texture(base);
      resolve(texture);
    };
    image.onerror = reject;
    image.src = base64;
  });
}

Promise.all([panelColor, unnamedColor])
  .then(([panelBase64, unnamedBase64]) => {
    return Promise.all([
      createUniqueTexture(panelBase64),
      createUniqueTexture(unnamedBase64),
    ]);
  })
  .then(([panelTexture, unnamedTexture]) => {
    if (runtimeScene.getName() === "mse_win") {
      ["panel", "panel4", "av"].forEach((name) => {
        const objects = runtimeScene.getObjects(name);
        objects.forEach((sprite) => {
          const width = sprite.getWidth();
          const height = sprite.getHeight();
          const zOrder = sprite.getZOrder();
          sprite.getRendererObject().texture = panelTexture;
          sprite.setWidth(width);
          sprite.setHeight(height);
          sprite.setZOrder(zOrder);
        });
      });

      ["Unnamed", "Unnamed3", "Unnamed4"].forEach((name) => {
        const objects = runtimeScene.getObjects(name);
        objects.forEach((sprite) => {
          const width = sprite.getWidth();
          const height = sprite.getHeight();
          const zOrder = sprite.getZOrder();
          sprite.getRendererObject().texture = unnamedTexture;
          sprite.setWidth(width);
          sprite.setHeight(height);
          sprite.setZOrder(zOrder);
        });
      });

      // input fields
      const eventinput = runtimeScene.getObjects("event")[0];
      eventinput.setFillColor("255;117;143");
      eventinput.setBorderColor("255;117;143");

      const speedinput = runtimeScene.getObjects("speed")[0];
      speedinput.setFillColor("255;117;143");
      speedinput.setBorderColor("255;117;143");

      const searchinput = runtimeScene.getObjects("search")[0];
      searchinput.setFillColor("255;117;143");
      searchinput.setBorderColor("255;117;143");

      const setsnapinput = runtimeScene.getObjects("set_snap")[0];
      setsnapinput.setFillColor("255;117;143");
      setsnapinput.setBorderColor("255;117;143");

      const coderinput = runtimeScene.getObjects("coder")[0];
      coderinput.setFillColor("89;13;34");
      coderinput.setBorderColor("89;13;34");

      // runtimeScene.requestChange(
      //   gdjs.RuntimeScene.REPLACE_SCENE,
      //   runtimeScene.getName()
      // );
    }
  })
  .catch((error) => {
    console.error("Error loading textures:", error);
  });
