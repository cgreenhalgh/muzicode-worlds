export class Plan {
  public startTime:number;
  constructor(startTime:number) {
    this.startTime = startTime;
  }
  execute(now:number, sprite:Sprite) {
    // TODO
    let elapsed = now-this.startTime;
    if (elapsed<0)
      return;
    sprite.x = sprite.refX + 0.1*Math.sin(Math.PI*elapsed);
    sprite.y = sprite.refY + 0.1*Math.cos(Math.PI*elapsed);
  }
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
  draw(ctx:CanvasRenderingContext2D, xOffset:number, yOffset:number, width:number, height:number, now:number) {
    // TODO
    for (let plan of this.plans) 
      plan.execute(now, this);
    //console.log('sprite at '+this.x+','+this.y+' ref '+this.refX+','+this.refY);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(xOffset+width*this.x-5, yOffset+height*this.y-5, 10, 10);
  }
}

