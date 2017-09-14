import { Note } from './note';

export class Plan {
  public startTime:number;
  public freq:number = 1;
  constructor(startTime:number) {
    this.startTime = startTime;
  }
  execute(now:number, sprite:Sprite) {
    // TODO
    let elapsed = now-this.startTime;
    if (elapsed<0)
      return;
    sprite.x = sprite.refX + 0.1*Math.sin(Math.PI*elapsed*this.freq);
    sprite.y = sprite.refY + 0.1*Math.cos(Math.PI*elapsed*this.freq);
  }
}

export class SpriteContext {
  public ctx:CanvasRenderingContext2D;
  public xOffset:number; 
  public yOffset:number;
  public width:number;
  public height:number
  public now:number
  public activeNotes:Note[] = [];
  public newNotes:Note[] = [];
  constructor() {}
}
export class Sprite {
  public zIndex:number;
  public x:number;
  public y:number;
  public refX:number;
  public refY:number;
  public plans:Plan[] = [];
  constructor(x:number, y:number, zIndex=0) {
    this.x = this.refX = x; this.y = this.refY = y; this.zIndex = zIndex;
    this.plans.push(new Plan((new Date()).getTime()*0.001));
  }
  draw(context:SpriteContext) {
    // TODO
    for (let plan of this.plans) {
      plan.freq = context.activeNotes.length>0 ? context.activeNotes[0].midinote-59 : 0; 
      plan.execute(context.now, this);
    }
    //console.log('sprite at '+this.x+','+this.y+' ref '+this.refX+','+this.refY);
    context.ctx.fillStyle = '#00ff00';
    context.ctx.fillRect(context.xOffset+context.width*this.x-5, 
      context.yOffset+context.height*this.y-5, 10, 10);
  }
}

