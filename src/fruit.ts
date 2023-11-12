import { vec2 } from "./object/vec2";
import { circle } from "./object/circle";
import param from "./param.json";
const FRUITS = param.fruit;

export class fruit extends circle {
    color: string;
    type: string;
    typeIndex: number;
    visible: boolean;
    point: number;
    constructor(position: vec2) {
        const randomFluitIndex = () => {
            const initFruit = FRUITS.filter(f => f.isInit);
            const typeNum = initFruit.length;
            const rand = Math.floor(Math.random() * typeNum);
            return rand;
        };
        const index = randomFluitIndex();
        const param = FRUITS[index];
        super(param.radius, position, param.restitution);
        this.color = param.color;
        this.type = param.type;
        this.typeIndex = index;
        this.visible = true;
        this.point = param.point;

    }
    grow(f: fruit) {
        const newPos = this.position.add(f.position.x, f.position.y).mul(1 / 2);
        this.warp(newPos)
        const newIndex = this.typeIndex + 1
        if (newIndex < FRUITS.length - 1) {
            this.typeIndex = newIndex;
            this.type = FRUITS[this.typeIndex].type;
            this.color = FRUITS[this.typeIndex].color;
            this.radius = FRUITS[this.typeIndex].radius;
            this.restitution = FRUITS[this.typeIndex].restitution;
            this.point = FRUITS[this.typeIndex].point;
        } else if (newIndex === FRUITS.length - 1) {
            this.typeIndex = newIndex;
            this.type = FRUITS[this.typeIndex].type;
            this.color = FRUITS[this.typeIndex].color;
            this.radius = FRUITS[this.typeIndex].radius;
            this.restitution = FRUITS[this.typeIndex].restitution;
            this.point = FRUITS[this.typeIndex].point;
            this.visible = false;
        }
        else {
            // ここにはこない
            this.visible = false;
        }
    }

}