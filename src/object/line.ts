import { vec2 } from "./vec2";

export class line {
  p1: vec2;
  p2: vec2;
  constructor(p1: vec2, p2: vec2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  fromVec() { }
  vec() {
    const inv = this.p1.mul(-1);
    return this.p2.add(inv.x, inv.y);
  }

  slope() {
    return (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
  }
  intercept() {
    return this.p2.y - this.slope() * this.p2.x;
  }

  dist(p: vec2) {
    if (this.p1.x === this.p2.x) {
      return Math.abs(p.x - this.p1.x);
    } else if (this.p1.y === this.p2.y) {
      return Math.abs(p.y - this.p1.y);
    }
    // y = Sx + I を ax + by +c =0に
    const a = -this.slope();
    const b = 1;
    const c = -this.intercept();

    // 公式
    const numer = Math.abs(a * p.x + b * p.y + c);
    const denom = Math.sqrt(a ** 2 + b ** 2);
    return numer / denom;
  }

  fromPoint(p: vec2) {
    const line = this.vec();
    const start2point = new vec2(p.x - this.p1.x, p.y - this.p2.y);
    const start2crossDist = start2point.dot(line) / this.vec().length ** 2;
    const start2cross = this.vec().mul(start2crossDist);
    return start2point.add(-start2cross.x, -start2cross.y);
  }

  isCross(l: line) {
    // 外積0の場合、ベクトルどうし並行
    if (this.vec().cross(l.vec()) == 0) {
      return false;
    }

    // 始点からもう一方の直線の始点・終点へのベクトル
    const l1p1_l2p1 = new vec2(l.p1.x - this.p1.x, l.p1.y - this.p1.y);
    const l1p1_l2p2 = new vec2(l.p2.x - this.p1.x, l.p2.y - this.p1.y);

    const l2p1_l1p1 = new vec2(this.p1.x - l.p1.x, this.p1.y - l.p1.y);
    const l2p1_l1p2 = new vec2(this.p2.x - l.p1.x, this.p2.y - l.p1.y);

    const c1 = this.vec().cross(l1p1_l2p1) * this.vec().cross(l1p1_l2p2);
    const c2 = l.vec().cross(l2p1_l1p1) * l.vec().cross(l2p1_l1p2);
    return c1 < 0 && c2 < 0;
  }
}
