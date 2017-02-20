// forked from phi's "Fire Effect - tmlib.js version" http://jsdo.it/phi/fv2D
// forked from phi's "Water Effect - tmlib.js version" http://jsdo.it/phi/7zF2
// forked from matsu4512's "Fire Effect" http://jsdo.it/matsu4512/b1jZ

var SCREEN_WIDTH = 465;
var SCREEN_HEIGHT = 480;
// var SCREEN_WIDTH = window.innerWidth;
// var SCREEN_HEIGHT = window.innerHeight;
var FLOWER_TYPE_NUM = 12;
var FLOWER_IMAGES = []; // キャッシュ用
var BACKGROUND_COLOR = "hsla(190, 50%, 50%, 1.0)";
var ASSETS = {
  "yuuka": "images/yuuka.png",
};

// 前処理
tm.preload(function() {
  var rInt = tm.util.Random.randint;
  for (var i=0; i<FLOWER_TYPE_NUM; i++) {
    var params = {
      radius: rInt(5, 15),
      petalNum: rInt(5, 15),
      cpGap: rInt(20, 39),
      centerHue: rInt(0, 360)
    };
    var f = tm.extends.drawFlower(params);
    FLOWER_IMAGES.push(f);
  }
});

tm.main(function() {
  var app = tm.app.CanvasApp("#world");
  app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  app.fitWindow();
  app.background = BACKGROUND_COLOR;
  // app.fps = 60;
  // app.enableStats();

  var loading = tm.app.LoadingScene({
    assets: ASSETS,
    nextScene: MainScene
  });
  app.replaceScene(loading);

  app.run();
});
