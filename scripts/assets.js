/*
* tm.graphics.Canvasの拡張
* 二次曲線（quadraticCurveTo）をチェーンメソッドで使えるよう拡張
*/
tm.graphics.Canvas.prototype.quadraticCurveTo = function (cpx, cpy, x, y) {
  this.context.quadraticCurveTo(cpx, cpy, x, y);
  return this;
};

tm.extends = tm.extends || {};

/**
 * 花を描画したキャンバスを返す
 * @return tm.graphics.Canvas
 */
tm.extends.drawFlower = function(params) {
  // オプション
  var radius = params.radius || 16;
  var petalNum = params.petalNum || 8;
  var cpGap = params.cpGap || 30; // 制御点用の角度差、 大きくするほど弁の幅が広まる
  var centerHue = params.centerHue || 30; // 制御点用の角度差、 大きくするほど弁の幅が広まる

  var c = tm.graphics.Canvas();
  var degree = Math.round(360 / petalNum); //花弁を均等に配置するための角度
  c.resize(radius * 20, radius * 20);
  c.setTransformCenter();

  // this.size = tm.util.Random.randint(this.range[0],this.range[1]);//(35,55); // 半径：数値はランダム
  // var colorAngle = i + 180;
  var radialGradient = tm.graphics.RadialGradient(0, 0, 0, 0, 0, radius * 20);
  radialGradient.addColorStopList([
    { offset: 0.0, color: "hsla({0}, 75%, 50%, 1.0)".format(centerHue) },
    // { offset: 1.0, color: "hsla({0}, 75%, 50%, 0.0)".format(colorAngle * 2) }
    { offset: 1.0, color: "hsla({0}, 75%, 50%, 0.0)".format(0) }
  ]);

  // color
  //c.strokeStyle = "hsla({0}, 75%, 50%, 1.0)".format(tm.util.Random.randint(0,360));
  //c.fillStyle = "hsla({0}, 75%, 50%, 1.0)".format(tm.util.Random.randint(0,360));
  c.fillStyle = radialGradient.toStyle()

  // stroke幅
  c.lineWidth = radius / 2 || 2;
  c.lineJoin = "miter";

  // draw ==
  // 中心の円
  c.fillCircle(0, 0, radius).stroke();

  // 花弁
  for (var j=0;　j<petalNum;　j++) {
    // 方向
    var vector = {
      x: Math.cos(Math.PI/180 * degree*j),
      y: Math.sin(Math.PI/180 * degree*j)
    };
    //描画開始点
    var start = {
      x: vector.x * radius*2 |0,
      y: vector.y * radius*2 |0
    };
    //制御点その1（往路）
    var cPoint1 = {
      x: Math.cos(Math.PI/180 * (degree*j-cpGap)) * radius*8 |0,
      y: Math.sin(Math.PI/180 * (degree*j-cpGap)) * radius*8 |0
    };
    //先っぽ
    var terminal = {
      x: vector.x * radius*10 |0,
      y: vector.y * radius*10 |0
    };
    //制御点その2（復路）
    var cPoint2 = {
      x: Math.cos(Math.PI/180 * (degree*j+cpGap)) * radius*8 |0,
      y: Math.sin(Math.PI/180 * (degree*j+cpGap)) * radius*8 |0
    };

    // 描画
    c.beginPath()
    .moveTo(start.x, start.y) //スタート地点へ
    .quadraticCurveTo(cPoint1.x, cPoint1.y, terminal.x, terminal.y)  //二次曲線　往路
    .quadraticCurveTo(cPoint2.x, cPoint2.y, start.x, start.y)  //二次曲線　復路
    .closePath()
    .stroke()
    .fill()
    ;
  }

  return c;
}

var Flower = tm.createClass({
  superClass: tm.app.Sprite,

  init: function(x, y) {
    this.superInit(FLOWER_IMAGES.random());

    this.position.set(x||0, y||0);
    this.blendMode = "lighter";

    this.velocity = tm.geom.Vector2( //方向（行き先）を作成
      tm.util.Random.randint(-10, 10), //X軸： -3~5のランダムな整数を生成
      tm.util.Random.randint(-8, 10) //Y軸： 同上
    );
    this.angularVelocity = tm.util.Random.randint(-8, 8);
    //花の周りにオーラ（重い）
    //var spotLight = SpotLight(0,0, this.radius*3).addChildTo(this);
    //console.log(FLOWER_IMAGES.random());
  },

  update: function(app) {
    this.rotation += this.angularVelocity;
    this.position.add(this.velocity);

    if (app.frame % 6 === 0) {
      this.velocity.x += (app.frame%2 === 0) ? 1 : -1;
      this.velocity.y -= 1;
    };
    this.scaleX *= 0.95;
    this.scaleY *= 0.95;

    if (this.scaleX < 0.1) {
      this.alpha -= 0.1;
      if (this.alpha < 0.1) {
        this.remove();
        // console.log("removed");
      }
    }
  }
});

// ポワッとした光
var SpotLight = tm.createClass({
  superClass: tm.display.CircleShape,

  init: function(x, y, r) {
    this.radius = r || 64;
    var radialGradient = tm.graphics.RadialGradient(this.radius/2,this.radius/2,0,this.radius/2,this.radius/2,this.radius/3|0); // 円形グラデーションを指定
    //memo: RadialGradient(x0, y0, r0, x1, y1, r1): 中心座標が (x0, y0) で半径 r0 の円と、中心座標が (x1, y1) で半径 r1 の円を指定する
    radialGradient.addColorStopList([ // カラー点をリストで追加 prop: object, ...
      {offset: 0.0, color: "hsla(0,100%,99%, 0.8)"},
      {offset: 0.5, color: "hsla(0,100%,99%, 0.5)"},
      {offset: 1.0, color: "hsla(0,100%,0%, 0)"}
    ]);
    //this.color = "rgba(240,234,52,0.9)";
    this.color = radialGradient.toStyle();

    this.superInit(this.radius,this.radius,{
      fillStyle: this.color,
      strokeStyle:"transparent",
    });
    this.blendMode = "lighter";
    this.position.set(x||0, y||0);
    this.isDisappeared = false;
  },

  update: function(app) {
    if (this.alpha < 0.1) { //this.alpha < 0　にすると一瞬チカッとする
      this.isDisappeared = true;
    } else if (this.alpha > 0.9) {
      this.isDisappeared = false;
    };

    // 消えそうなら透明度上げる　そうでないなら下げる
    this.alpha += (this.isDisappeared) ? 0.03 : -0.03;
  }
});

/**
 * Main Scene
 */
var MainScene = tm.createClass({
  superClass: tm.app.Scene,

  init: function() {
    this.superInit();
    //this.stats = enableStats(); //Stats.js生成

    var yuuka = this.yuuka = tm.app.Sprite("yuuka").setPosition(310, 400).addChildTo(this);
    yuuka.flowerEmitter = tm.display.CanvasElement().setPosition(-130, -80).addChildTo(yuuka);
    SpotLight(0, 0, 10*25).addChildTo(yuuka.flowerEmitter);

    tm.display.Label("FLOWER MASTER")
    .setOrigin(0, 0.5)
    .setPosition(SCREEN_WIDTH*0.05, SCREEN_HEIGHT*0.5)
    // .setStrokeStyle("black")
    .setFillStyle("white")
    .setFontSize(22)
    .setFontFamily('Pacifico')
    .addChildTo(this);

    // this.label_description = tm.display.Label("クリック or タップで貴方もフラワーマスター")
    // //.setOrigin(SCREEN_WIDTH*0.6, SCREEN_HEIGHT*0.2)
    // .setPosition(this.label_title.x, this.label_title.y+40)
    // .setFillStyle("white")
    // .setFontSize(20)
    // .setFontFamily('arial')
    // .addChildTo(this)
    ;
  },

  update: function(app) {
    //this.stats.update(); //更新
    var p = app.pointing;
    var yuuka = this.yuuka;

    // 手の位置で自動発生
    if (app.frame%18 === 0) {
      // var randX = Math.rand(140, 190); //170前後
      // var randY = Math.rand(300, 315); //315前後
      for (var i=0; i<3; i++) {
        Flower(0, 0).addChildTo(yuuka.flowerEmitter);
        // Flower(randX, randY).addChildTo(this);
      };
    };

    if (p.getPointing()) {
      Flower(p.x, p.y).addChildTo(this);
      //var light = SpotLight(p.x,p.y).addChildTo(this);
      //var circle = tm.display.StarShape(p.x,p.y).addChildTo(this);
      //for (i=0;i<10;i++) var flower = Flower(p.x,p.y).addChildTo(this);
    };
  }
});

// var enableStats = function() {
//   if (window.Stats === undefined) return null;

//   var stats = new Stats();
//   // 右上に設定
//   stats.domElement.style.position = "fixed";
//   stats.domElement.style.right    = "5px";
//   stats.domElement.style.top      = "5px";
//   document.body.appendChild(stats.domElement);

//   return stats;
// };
