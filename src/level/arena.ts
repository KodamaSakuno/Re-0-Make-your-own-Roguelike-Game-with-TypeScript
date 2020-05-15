import * as ROT from "rot-js";
import { game, pop_random, dice, rand } from "../main";
import { Player, Rat, Snake, Orc, Slime } from "../creature";
import { Map, Box, Tile, add_shadow } from "../map";

const MAP_WIDTH = 80;
const MAP_HEIGHT = 60;

class Grass extends Tile {
    constructor() {
        super();
        this.ch = "."
        this.color = "#2f2";
        this.pass = true;
        this.light = true;
    }
}

class Tree extends Tile {
    constructor() {
        super();
        this.ch = "樹"
        this.color = "#1f1";
        this.pass = false;
        this.light = false;
    }
}

class Stair extends Tile {

    target: any;

    constructor() {
        super();
        this.color = "#bbf";
        this.pass = true;
        this.light = true;
    }    
    enter(who: any) {
        game.map.move(who, this.target);        
    }
}

class Downstair extends Stair {
    constructor() {
        super();
        this.ch = "下";
    }
    enter(who: any) {
        if (!this.target) {
            this.target = {};
            this.target.map = new Map0();
            let p = pop_random(this.target.map.free_cells);
            this.target.x = p[0];
            this.target.y = p[1];
            this.target.map.layer[p[0]+','+p[1]] = new Upstair();
            this.target.map.layer[p[0]+','+p[1]].target.map = game.map;
            this.target.map.layer[p[0]+','+p[1]].target.x = who.x;
            this.target.map.layer[p[0]+','+p[1]].target.y = who.y;
        }
        super.enter(who);
    }
}

class Upstair extends Stair {
    constructor() {
        super();
        this.ch = "上";
    }
    enter(who: any) {
        if (!this.target) {
            game.score += 1;
            this.target = {};
            this.target.map = new Map0();
            let p = pop_random(this.target.map.free_cells);
            this.target.x = p[0];
            this.target.y = p[1];
            this.target.map.layer[p[0]+','+p[1]] = new Downstair();
            this.target.map.layer[p[0]+','+p[1]].target = {};
            this.target.map.layer[p[0]+','+p[1]].target.map = game.map;
            this.target.map.layer[p[0]+','+p[1]].target.x = who.x;
            this.target.map.layer[p[0]+','+p[1]].target.y = who.y;
        }
        super.enter(who);
    }
}

export class Map0 extends Map {

    free_cells: Array<[number, number]>;

    constructor() {
        super();       
        this.width = MAP_WIDTH;
        this.height = MAP_HEIGHT;
        this.layer = {};
        this.shadow = {};
        this.free_cells = [];
        let digger = new ROT.Map.Arena(this.width, this.height);
        digger.create((x, y, value) => {
            if (value) return; 
            var key = x + "," + y;
            this.layer[key] = new Grass();
            this.free_cells.push([x, y]);
        });

        for (let i=0;i<10+rand(40);++i) {            
            let p = pop_random(this.free_cells);                        
            let key = p[0]+','+p[1];
            this.layer[key] = new Tree();
        }

        
        this.agents = Array<any>();

        for (let i=0;i<dice(7);++i) {            
            let p = pop_random(this.free_cells);
            let r = new Rat(p[0], p[1]);
            this.agents.push(r);
        }
        for (let i=0;i<dice(5);++i) {            
            let p = pop_random(this.free_cells);
            let r = new Snake(p[0], p[1]);
            this.agents.push(r);
        }

        /*for (let i=0;i<rand(3);++i) {
            let p = pop_random(this.free_cells);
            let r = new Slime(p[0], p[1]);
            this.agents.push(r);
        }*/

        for (let i=0;i<dice(2);++i) {
            let p = pop_random(this.free_cells);
            let r = new Orc(p[0], p[1]);
            this.agents.push(r);
        }
        
        this.agents.sort(function(a: any, b: any): number {
            if (a.z < b.z) return -1;
            if (a.z > b.z) return 1;
            return 0;
        });

        for (let i=0;i<2;++i) {
            let p = pop_random(this.free_cells);
            let t = new Upstair();
            let key = p[0]+','+p[1];
            this.layer[key] = t;
        }

        for (let i=0;i<1;++i) {
            let p = pop_random(this.free_cells);
            let t = new Box();
            let key = p[0]+','+p[1];
            this.layer[key] = t;
        }
    }
}