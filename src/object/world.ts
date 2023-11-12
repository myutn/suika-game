import { vec2 } from "./vec2";
import { circle } from "./circle";
import { rectangle } from "./rectangle";
import { baseObject } from "./baseObject";

export class world extends rectangle {
  width: number;
  height: number;
  right_top: vec2;
  gravity: vec2;
  objects: baseObject[] = [];
  constructor(x: number, y: number, width: number, height: number, g: vec2) {
    const position = new vec2(x, y); // 外の世界の座標
    super(width, height, position, 0);
    this.width = width;
    this.height = height;
    this.right_top = new vec2(x - width / 2, y - height / 2);
    this.gravity = g;
  }
  warp(p: vec2): void {
    super.warp(p);
    this.right_top = new vec2(p.x - this.width / 2, p.y - this.height / 2);
  }

  addObject(e: baseObject) {
    this.objects.push(e);
  }

  elapsedTime = (t: number, callback?: CallableFunction) => {
    // すべてのオブジェクトを動かす
    this.objects.forEach((obj) => {
      obj.velocity = obj.velocity.add(this.gravity.x, this.gravity.y);
      obj.move(obj.velocity.x, obj.velocity.y);
    });
    // すべてのオブジェクト総当りで衝突判定
    this.objects.forEach((obj1, index1) => {
      this.objects.forEach((obj2, index2) => {
        if (index1 === index2) {
          return;
        }

        if (obj1 instanceof circle && obj2 instanceof circle) {
          obj1.collisionCircle(obj2, callback);
        } else {
          /** Not Implimented */
        }
      });
      // 壁との衝突判定
      if (obj1 instanceof circle) {
        this.collisionCircle(obj1);
      }
    });
  };
}
