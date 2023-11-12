import { vec2 } from "./vec2";
import { baseObject } from "./baseObject";

export class circle extends baseObject {
  radius: number;
  isFix: boolean;

  constructor(radius: number, position: vec2, restitution: number) {
    super(position, restitution);
    this.radius = radius;
    this.isFix = false;
  }
  /**円と円 */
  collisionCircle(c: circle, callback?: CallableFunction) {
    const dist = this.position.dist(c.position.x, c.position.y);
    if (dist > this.radius + c.radius) {
      // 衝突していないので何もしない
      return;
    }
    if (callback) {
      if (callback(this, c)) {
        return;
      }
    }
    const overlap = this.radius + c.radius - dist;

    // 円->円のベクトル
    const Center2Center = new vec2(
      this.position.x - c.position.x,
      this.position.y - c.position.y
    );

    // ここに来ているということは衝突=重なっているので少し戻して重なりをなくす。
    let returnDist = overlap;

    if (!c.isFix) {
      // 両方動く場合、距離は半々
      returnDist = overlap / 2;

      const moveDirection = Center2Center.unit().mul(-1);
      // 戻す
      c.move(moveDirection.x * returnDist, moveDirection.y * returnDist);
      // 反射
      c.velocity = c.velocity.reflect(Center2Center).mul(c.restitution);;
    }

    const moveDirection = Center2Center.unit();
    // 戻す
    this.move(moveDirection.x * returnDist, moveDirection.y * returnDist);
    //反射
    this.velocity = this.velocity.reflect(Center2Center).mul(c.restitution);;
  };
  contains = (p: vec2) => {
    const dist = this.position.dist(p.x, p.y);
    if (dist < this.radius) {
      return true;
    }
    return false;
  };
}
