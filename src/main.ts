import * as ROT from "rot-js";
import * as $ from "jquery";
import { Camera } from "./camera";
import { Player } from "./creature";
//import { Map0 } from "./level/lv0";
import { Map0 } from "./level/arena";
import { Sound } from "./sound";

export function get_avg_atk(atk: any) {
    let z = 0;
    for (const a in atk) {
        if (a[0] == 'd') {
            z += atk[a] * (1 + parseInt(a.substr(1))) / 2;
        }        
    }
    return z;
}

export function parse_atk(atk: any) {
    let z = "";
    for (let a in atk) {
        if (z != "") z += ", ";
        z += atk[a] > 0 ? "+" : "";
        z += atk[a] + a;
    }
    return z;
}


export function rand(n: number): number {
    return Math.floor(ROT.RNG.getUniform() * n);    
}

export function dice(n: number): number {
    return rand(n) + 1;
}

export function pop_random(A: Array<[number, number]>): [number, number] {
    var index = rand(A.length);
    return A[index];
}

const DISPLAY_WIDTH = 40;
const DISPLAY_HEIGHT = 25;

class Game {
    
    display: any;
    map: any;
    player: Player;    
    camera: Camera;
    SE: Sound;
    score: number;

    scheduler: any;
    engine: any;

    init() {

        game.display = new ROT.Display({
            width: DISPLAY_WIDTH,
            height: DISPLAY_HEIGHT,
            fontSize: 24,            
            fontFamily: 'sans-serif',
        });
        document.body.replaceChild(game.display.getContainer(), document.getElementById('canvas'));
        this.SE = new Sound();

        //this.map = new Map();
        this.map = new Map0();
        this.score = 0;
        let p = pop_random(this.map.free_cells);
        game.player = new Player(p[0], p[1]);
        this.map.agents.push(game.player);

        this.camera = new Camera();
        

        this.scheduler = new ROT.Scheduler.Action();
        for (let i=0;i<this.map.agents.length;++i) {
            this.scheduler.add(this.map.agents[i], true);
        }
        this.engine = new ROT.Engine(this.scheduler);
        this.engine.start();
        this.draw();
        //this.draw_abilities(this.player);
    }
    reschedule() {
        this.scheduler.clear();
        for (let i=0;i<this.map.agents.length;++i) {
            this.scheduler.add(this.map.agents[i], true);
        }
    }
    draw_abilities(p: any) {
        $('#abilities div').each(function() {            
            $(this).remove();					
        });
        for (let i=0;i<p.abilities.length;++i) {
            let a = p.abilities[i];
            let dom = $('<div>').addClass('inventoryRow').addClass('abilitiesRow');
            let name =$('<div>').addClass('row_key').text(a.name);
            let tip = $('<div>').addClass("tooltip bottom right").text(a.description);
            tip.appendTo(dom);
            name.appendTo(dom);            
            dom.appendTo('div#abilities');
        }

        for (let i=0;i<p.buffs.length;++i) {
            let b = p.buffs[i];
            let dom = $('<div>').addClass('inventoryRow').addClass('abilitiesRow');
            let name =$('<div>').addClass('row_key').text(b.name);
            let tip = $('<div>').addClass("tooltip bottom right").text(b.description);
            tip.appendTo(dom);
            name.appendTo(dom);            
            dom.appendTo('div#abilities');
        }        
    }

    draw_attributes(p: any) {
        let detail = this.player.abilities_detail();
                        
        $("#HP > .row_key").text("HP:" + this.player.hp + "/" + this.player.HP);
        $("#HP > .tooltip").text(detail.hp.join("\n"));
        $("#MP > .row_key").text("MP:" + this.player.mp + "/" + this.player.MP);
        $("#MP > .tooltip").text(detail.mp.join("\n"));
        $("#SP > .row_key").text("SP:" + this.player.sp + "/" + this.player.SP);
        $("#SP > .tooltip").text(detail.sp.join("\n"));

        let atk = get_avg_atk(this.player.atk);
        $("#ATK > .row_key").text("ATK:" + atk);
        $("#ATK > .tooltip").text(this.player.parse_atk_buffs());
        $("#DEF > .row_key").text("DEF:" + this.player.def);
        $("#DEF > .tooltip").text(this.player.parse_def_buffs());

        $("#STR > .row_key").text("STR:" + this.player.str);
        $("#STR > .tooltip").text(detail.str.join("\n"));
        $("#DEX > .row_key").text("DEX:" + this.player.dex);
        $("#DEX > .tooltip").text(detail.dex.join("\n"));
        $("#CON > .row_key").text("CON:" + this.player.con);
        $("#CON > .tooltip").text(detail.con.join("\n"));
        $("#INT > .row_key").text("INT:" + this.player.int);
        $("#INT > .tooltip").text(detail.int.join("\n"));
        $("#WIS > .row_key").text("WIS:" + this.player.wis);
        $("#WIS > .tooltip").text(detail.wis.join("\n"));
        $("#CHA > .row_key").text("CHA:" + this.player.cha);
        $("#CHA > .tooltip").text(detail.cha.join("\n"));
    }

    draw() {     
        this.map.draw();

        this.draw_attributes(this.player);
        
        let d = new Date();
        d.setTime(Math.floor(this.scheduler.getTime()));
        $("#TIME > .row_key").text(d.toUTCString());
        $("#SCORE > .row_key").text("SCORE:" + game.score);

        this.player.inventory.draw();        
        this.draw_abilities(this.player);
    }
};

export let game = new Game();
game.init();



import { _, Events } from "./event";
import { Apple, Axes } from "./inventory";

Events.init();

//import { genCharacterUI } from "./UI/character"
//Events.startEvent(genCharacterUI(game.player));


let juqing = {
    title: _('伊莎貝拉'),
    scenes: {
        'start': {
            text: [
                _('到此為止吧，伊莎貝拉殿下。'),
            ],
            buttons: {
                'open': {
                    text: _('繼續'),
                    nextScene: 'p0'
                },
            }
        },
        'p0': {
            text: [
                _('李、李貝爾隊長，為什麼連你也會在這裏。'),
            ],
            buttons: {
                'open': {
                    text: _('繼續'),
                    nextScene: 'p1'
                },
            }
        },
        'p1': {
            text: [
                _('你的亂來已經給安琪拉造成很多困擾了，現在必須把你抓回去。'),
            ],
            buttons: {
                'p21': {
                    text: _('1. 安琪拉是我生長的地方，無論如何我也不想去做人質。'),
                    nextScene: 'p21'
                },
                'p22': {
                    text: _('2. 別怪我不手下留情。'),
                    nextScene: 'p22'
                },                
            }
        },        
        'p21': {
            text: [
                _('為了安琪拉的未來，只有讓公主委屈一下了。'),
            ],
            buttons: {
                'leave': {
                    text: '結束'
                }            
            }
        },           
        'p22': {
            text: [
                _('那就讓我來檢驗一下公主殿下的成長吧。'),
            ],
            buttons: {
                'leave': {
                    text: '結束'
                }            
            }
        },           
    }
};

Events.startEvent(juqing);



/*
Events.startEvent({
    title: _('伊莎貝拉'),
    scenes: {
        'start': {
            text: [
                _('你發現地上有一個上鎖的金色寶箱。'),
            ],
            buttons: {
                'open': {
                    text: _('用鑰匙打開'),
                    nextScene: {1: 'open'}
                },
                'destroy': {
                    text: _('暴力破壞'),
                    nextScene: {1: 'destory'}
                },
                'leave': {
                    text: _('離開它，這或許是一個陷阱。'),
                    nextScene: 'end'
                }
            }
        },
        'open': {
            text: [
                _('沒有鑰匙。'),
            ],
            buttons: {
                'leave': {
                    text: _('leave'),
                    nextScene: 'end'
                }
            }
        },
        'destory': {
            text: [
                _("一番努力之後，你打開了箱子，獲得了一把斧頭。"),
            ],
            onLoad: function() {
                game.player.inventory.push(new Axes());
            },            
            buttons: {
                'leave': {
                    text: _('leave'),
                    nextScene: 'end'
                }
            }
        }
    }
});
*/