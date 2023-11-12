import { vec2 } from "./vec2";
import { line } from "./line";
import { baseObject } from "./baseObject";
import { circle } from "./circle";

export class rectangle extends baseObject {
  width: number;
  height: number;
  lt: vec2;
  lb: vec2;
  rt: vec2;
  rb: vec2;

  constructor(width: number, height: number, position: vec2, restitution: number) {
    super(position, restitution);
    this.width = width;
    this.height = height;
    this.lt = new vec2(-width / 2, -height / 2); // この世界での座標
    this.lb = new vec2(-width / 2, height / 2);
    this.rt = new vec2(width / 2, -height / 2);
    this.rb = new vec2(width / 2, height / 2);
  }
  contains(c: circle) {
    let outside_x = c.position.x - c.radius + this.width / 2;

    if (outside_x > 0) {
      outside_x = c.position.x + c.radius - this.width / 2;
      if (outside_x < 0) {
        outside_x = 0;
      }
    }
    let outside_y = c.position.y - c.radius + this.height / 2;

    if (outside_y > 0) {
      outside_y = c.position.y + c.radius - this.height / 2;
      if (outside_y < 0) {
        outside_y = 0;
      }
    }
    const res = new vec2(outside_x, outside_y);
    console.log(res);
    return res;
  }

  nearLine = (p: vec2) => {
    const top = new line(this.lt, this.rt);
    const bottom = new line(this.lb, this.rb);
    const right = new line(this.rt, this.rb);
    const left = new line(this.lt, this.lb);

    let min_line = top
    let min_dist = top.dist(p);

    if (min_dist > bottom.dist(p)) {
      min_dist = bottom.dist(p)
      min_line = bottom;
    }
    if (min_dist > right.dist(p)) {
      min_dist = right.dist(p)
      min_line = right;
    }
    if (min_dist > left.dist(p)) {
      min_dist = left.dist(p)
      min_line = left;
    }
    return min_line;
  };

  collisionCircle(c: circle) {
    const outside = this.contains(c);
    if (outside.x == 0 && outside.y == 0) {
      return;
    }
    const moveDirection = c.velocity.unit().mul(-1);
    c.move(moveDirection.x * outside.x, moveDirection.y * outside.y);
    const nearLine = this.nearLine(c.position);
    const line2center = nearLine.fromPoint(c.position).mul(-1);
    c.velocity = c.velocity.reflect(line2center).mul(c.restitution);

    // 反射後外に出ていたら強制的に内側に戻す
    const outside2 = this.contains(c)
    if (outside2.x == 0 && outside2.y == 0) {
      return;
    }
    c.move(-outside2.x, -outside2.y);
  };
}
