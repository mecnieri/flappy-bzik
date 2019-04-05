//#region Global Variables
import hitTestRectangle from "./hitTestRectangle.js";

let Application = PIXI.Application,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite,
  TextureCache = PIXI.utils.TextureCache,
  Rectangle = PIXI.Rectangle,
  Text = PIXI.Text,
  Graphics = PIXI.Graphics,
  Container = PIXI.Container,
  TextStyle = PIXI.TextStyle;
//Create a Pixi Application
let app = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: true,
  transparent: false,
  resolution: 1
});

document.body.appendChild(app.view);

//#endregion
let state, gameScene, gameOverScene, message;

loader.load(setup);
function setup() {
  //#region  Create gameScene
  state = play;
  gameScene = new Container();
  app.stage.addChild(gameScene);

  app.stage.interactive = true;
  app.stage.hitArea = new PIXI.Rectangle(
    0,
    0,
    app.screen.width,
    app.screen.height
  );
  //#endregion

  //#region  Create gameOverScene
  gameOverScene = new Container();
  gameOverScene.visible = false;
  app.stage.addChild(gameOverScene);

  //#endregion

  //#region  Create message
  let style = new TextStyle({
    fontFamily: "Futura",
    fontSize: 64,
    fill: "white"
  });
  message = new Text("You lose!", style);
  message.x = app.view.width / 2 - 100;
  message.y = app.view.height / 2 - 32;
  gameOverScene.addChild(message);

  //#endregion

  //#region  Create Circle

  const c = new Graphics();
  c.beginFill(0xba5bac);
  c.lineStyle(0);
  c.drawCircle(0, 0, 30);
  c.x = 300;
  c.y = 300;
  c.endFill();

  gameScene.addChild(c);

  let gravity = 1;

  //#endregion

  //#region  Create barriers

  let barriers = new Container();
  gameScene.addChild(barriers);

  //#endregion

  app.stage.on("pointerdown", onPointerDown);

  function onPointerDown() {
    gravity = -7;
  }

  setInterval(() => {
    let h = Math.random() * (app.screen.height - 400) + 100;
    let h2 = app.screen.height - (h + 200);

    if (barriers.children.length === 0) {
      let r = new Graphics();
      r.beginFill(0x66ccff);
      r.drawRect(0, 0, 100, h);
      r.endFill();
      r.x = app.screen.width + 300;
      barriers.addChild(r);

      let r2 = new Graphics();
      r2.beginFill(0x66ccff);
      r2.drawRect(0, 0, 100, h2);
      r2.endFill();
      r2.x = app.screen.width + 300;
      r2.y = h + 300;
      barriers.addChild(r2);
    } else {
      let newX = barriers.children[barriers.children.length - 1].x + 300;
      let r3 = new Graphics();
      r3.beginFill(0x6622ff);
      r3.drawRect(0, 0, 100, h);
      r3.endFill();
      r3.x = newX;
      barriers.addChild(r3);

      let r4 = new Graphics();
      r4.beginFill(0x66ccff);
      r4.drawRect(0, 0, 100, h2);
      r4.endFill();
      r4.x = newX;
      r4.y = h + 300;
      barriers.addChild(r4);
    }
  }, 5000);

  function play() {
    barriers.x -= 1;
    console.log(barriers.children.length);
    if (-gravity > 0) {
      if (-gravity > 0.5) {
        gravity /= 1.082;
        c.y += gravity;
      } else gravity = -gravity;
    } else {
      gravity *= 1.082;
      if (gravity > 7) {
        gravity = 7;
      }
      c.y += gravity;
    }

    if (c.y > app.screen.height) {
      state = end;
    }

    for (
      let i = barriers.children.length - 13;
      i < barriers.children.length;
      i++
    ) {
      if (barriers.children[i]) {
        if (barriers.children[i].getGlobalPosition().x == c.x && c.y < 0) {
          state = end;
        }

        if (hitTestRectangle(c, barriers.children[i])) {
          state = end;
        }
      }
    }
  }
  function end() {
    app.ticker.stop();
    message.text = ` Your Score is ${barriers.children.length / 2 - 3}`;
    gameScene.visible = false;
    gameOverScene.visible = true;
  }
  app.ticker.add(() => {
    state();
  });
}
