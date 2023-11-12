import p5 from "p5";

import { vec2 } from "./object/vec2";
import { world } from "./object/world";
import { fruit } from "./fruit";
import * as CP from "./constant";

export const suikaGame = (p: p5) => {
  let nextFruit = new fruit(new vec2(0, 0));
  let afterNextFruit = new fruit(new vec2(0, 0));
  let point = 0;

  // ウィンドウサイズ変更時に移動必要
  const basket = new world(
    p.windowWidth / 2,
    p.windowHeight / 2,
    CP.BOX_WIDTH,
    CP.BOX_HEIGHT,
    new vec2(0, CP.GRAVITY_ACCEL)
  );
  let afterNextPotision = new vec2(p.windowWidth / 2 + CP.BOX_WIDTH / 2 + CP.BASIC_MARGIN, p.windowHeight / 2 - CP.BOX_HEIGHT / 2)
  let pointPotision = new vec2(p.windowWidth / 2 - CP.BOX_WIDTH / 2 - CP.BASIC_MARGIN * 2, p.windowHeight / 2 - CP.BOX_HEIGHT / 2)

  /** 描画系関数 */
  /** フルーツ類 */
  const drawFruits = () => {
    basket.objects = basket.objects.filter((f: fruit) => f.visible)
    basket.objects.forEach((f: fruit) => {
      if (f.visible) {
        const color = p.color(f.color);
        p.stroke(color);
        p.fill(color);
        p.circle(
          f.position.x + basket.position.x,
          f.position.y + basket.position.y,
          f.radius * 2
        );
      }
    }
    );
  };
  /** 雲 */
  const drawCloud = () => {
    if (
      p.mouseX > basket.position.x - CP.BOX_WIDTH / 2 &&
      p.mouseX < basket.position.x + CP.BOX_WIDTH / 2
    ) {
      p.textSize(120);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.blendMode(p.SCREEN);
      p.text("☁", p.mouseX, p.windowHeight / 2 - CP.BOX_HEIGHT / 2 - CP.CLOUD_MARGIN);
      p.blendMode(p.BLEND);
      p.stroke(nextFruit.color);
      p.fill(nextFruit.color);
      p.circle(
        p.mouseX,
        p.windowHeight / 2 - CP.BOX_HEIGHT / 2 - CP.BASIC_MARGIN,
        nextFruit.radius * 2
      );
    }

  }
  /** 次の次 */
  const drawAfterNext = () => {
    p.stroke(CP.BASIC_COLOR);
    p.noFill();
    p.rect(afterNextPotision.x, afterNextPotision.y, CP.NEXT_BOX_WIDTH, CP.NEXT_BOX_HEIGHT);
    p.noStroke();
    p.fill(CP.BASIC_COLOR);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(CP.TEXT_SIZE);
    p.text("Next", afterNextPotision.x + CP.NEXT_BOX_WIDTH / 2, afterNextPotision.y - CP.BASIC_MARGIN)
    p.stroke(afterNextFruit.color);
    p.fill(afterNextFruit.color);
    p.circle(
      afterNextPotision.x + CP.NEXT_BOX_WIDTH / 2,
      afterNextPotision.y + CP.NEXT_BOX_HEIGHT / 2,
      afterNextFruit.radius * 2
    );
    p.noStroke();
    p.fill(CP.BASIC_COLOR);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(afterNextFruit.type, afterNextPotision.x + CP.NEXT_BOX_WIDTH / 2, afterNextPotision.y + CP.NEXT_BOX_HEIGHT / 2)
  };

  /** 得点 */
  const drawPoint = () => {
    p.fill(CP.BASIC_COLOR);
    p.noStroke();
    p.textSize(CP.TEXT_SIZE);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("POINT", pointPotision.x, pointPotision.y)
    p.textAlign(p.CENTER, p.CENTER);
    p.text(point.toString(), pointPotision.x, pointPotision.y + CP.POINT_MARGIN)
  };

  /** 衝突時のコールバック関数 */
  const collisionCallback = (f1: fruit, f2: fruit) => {
    if (f1.visible) {
      if (f1.type === f2.type) {
        f1.grow(f2);
        point += f1.point;
        f2.visible = false;
        return true;
      }
    }
    return false;
  }

  /**イベントハンドラ */
  const onClick = () => {
    const x = p.mouseX;
    // basketの座標系で追加
    const pos = new vec2(x - basket.position.x, -CP.BOX_HEIGHT / 2);
    const f = new fruit(pos);

    if (
      x > basket.position.x - CP.BOX_WIDTH / 2 + f.radius &&
      x < basket.position.x + CP.BOX_WIDTH / 2 - f.radius
    ) {
      nextFruit.warp(pos);
      basket.addObject(nextFruit);
      nextFruit = afterNextFruit;
      afterNextFruit = f;
    }
  };

  /** p5での描画処理 */
  /** 初期化 */
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(60);
  };

  /** フレームごとの描画処理 */
  p.draw = () => {
    p.push();
    // 背景
    p.background(p.color(CP.BG_COLOR));
    // 箱
    p.stroke(CP.BASIC_COLOR);
    p.line(basket.position.x + basket.lt.x, basket.position.y + basket.lt.y, basket.position.x + basket.lb.x, basket.position.y + basket.lb.y);
    p.line(basket.position.x + basket.lb.x, basket.position.y + basket.lb.y, basket.position.x + basket.rb.x, basket.position.y + basket.rb.y);
    p.line(basket.position.x + basket.rt.x, basket.position.y + basket.rt.y, basket.position.x + basket.rb.x, basket.position.y + basket.rb.y);

    // その他　オブジェクト類の描画
    drawCloud()
    drawPoint()
    drawAfterNext();
    drawFruits();
    // フレーム毎の処理
    basket.elapsedTime(1, collisionCallback);
    p.pop();
  };

  /**クリック */
  p.mouseClicked = () => {
    onClick();
  };

  /**リサイズ */
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    const new_center = new vec2(p.windowWidth / 2, p.windowHeight / 2);
    basket.warp(new_center);
    pointPotision = new vec2(p.windowWidth / 2 - CP.BOX_WIDTH / 2 - CP.BASIC_MARGIN * 2, p.windowHeight / 2 - CP.BOX_HEIGHT / 2)
    afterNextPotision = new vec2(p.windowWidth / 2 + CP.BOX_WIDTH / 2 + CP.BASIC_MARGIN, p.windowHeight / 2 - CP.BOX_HEIGHT / 2)
  };
};
