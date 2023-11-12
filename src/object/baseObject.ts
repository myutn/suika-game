import { vec2 } from "./vec2";

export class baseObject {
  position: vec2;
  velocity: vec2;
  restitution: number;
  constructor(position: vec2, restitution: number) {
    this.position = position;
    this.restitution = restitution;
    this.velocity = new vec2(0, 0);
  }
  warp(p: vec2) {
    this.position = p;
  }
  move(dx: number, dy: number) {
    const new_x = this.position.x + dx;
    const new_y = this.position.y + dy;
    this.position = new vec2(new_x, new_y);
    return this.position;
  }
}
