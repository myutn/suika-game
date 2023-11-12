export class vec2 {
  x: number;
  y: number;
  length: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.length = this.dist(0, 0);
  }

  add(x: number, y: number) {
    return new vec2(this.x + x, this.y + y);
  }

  mul(a: number) {
    return new vec2(this.x * a, this.y * a);
  }

  dot(v: vec2) {
    return this.x * v.x + this.y * v.y;
  }

  cross(v: vec2) {
    return this.x * v.y - v.x * this.y;
  }

  unit() {
    return this.mul(1 / this.length);
  }

  // 反射面に直角なベクトル
  reflect(norm: vec2) {
    const normUnit = norm.unit();
    const dot = this.dot(normUnit);
    if (dot == 0) {
      // 直行している場合、逆にする
      return this.mul(-1);
    } else {
      const ref_vec = normUnit.mul(-2 * dot);
      return this.add(ref_vec.x, ref_vec.y);
    }
  }
  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  dist(x: number, y: number) {
    const _dist = (this.x - x) ** 2 + (this.y - y) ** 2;
    return Math.sqrt(_dist);
  }
}
