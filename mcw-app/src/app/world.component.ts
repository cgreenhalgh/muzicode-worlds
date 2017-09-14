import { Component, AfterViewInit, OnDestroy, 
         ViewChild, ElementRef, Inject, HostListener } from '@angular/core';
import { Note } from './note';
import { Sprite, SpriteContext } from './sprite';

@Component({
  selector: 'world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css']
})
export class WorldComponent implements AfterViewInit, OnDestroy {
  @ViewChild('worldCanvas') canvasRef: ElementRef;
  @ViewChild('worldDiv') divRef: ElementRef;
  private context:SpriteContext = new SpriteContext();
  private sprites:Sprite[] = [];
  private rafid:number;
  constructor() {
    this.sprites.push(new Sprite(0.5 ,0.5));
  }
  @HostListener('window:resize', ['$event.target']) onResize() { 
    //console.log('window:resize');
    this.resize();
    //this.redraw();
  }
  ngAfterViewInit() {
    this.resize();
    this.redraw();
  }
  resize() {
    let width = this.divRef.nativeElement.clientWidth;
    let height = this.divRef.nativeElement.clientHeight;
    //console.log('resize world '+width+'x'+height);
    this.canvasRef.nativeElement.width = width;
    this.canvasRef.nativeElement.height = height;
    let size = Math.min(width, height);
    this.context.width = size;
    this.context.height = size;
    this.context.xOffset = (width-size)/2;
    this.context.yOffset = (height-size)/2;
    let ctx: CanvasRenderingContext2D =
      this.canvasRef.nativeElement.getContext('2d');
    this.context.ctx = ctx;
  }
  redraw() {
    this.rafid = requestAnimationFrame(()=> {
      this.redraw()
    });
    this.context.now = (new Date()).getTime()*0.001;
    this.context.ctx.fillStyle = '#700000';
    this.context.ctx.fillRect(this.context.xOffset, this.context.yOffset, this.context.width, this.context.height);
    this.sprites.sort((a,b) => { return a.zIndex - b.zIndex });
    for (let sprite of this.sprites) {
      sprite.draw(this.context);
    }
    this.context.newNotes = [];
  }
  ngOnDestroy() {
    if (this.rafid)
      cancelAnimationFrame(this.rafid);
  }
  OnNote(note:Note) {
    console.log('Note '+note.note+' vel '+note.velocity);
    this.context.newNotes.push(note);
    for (let i=0; i<this.context.activeNotes.length; i++) {
      let n = this.context.activeNotes[i];
      if (note.midinote == n.midinote) {
        this.context.activeNotes.splice(i,1);
        i--;
      }
    }
    if (!note.off) {
      this.context.activeNotes.push(note);
    }
  }
}
