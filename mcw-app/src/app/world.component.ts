import { Component, AfterViewInit, OnDestroy, 
         ViewChild, ElementRef, Inject, HostListener } from '@angular/core';
import { Note } from './note';
import { Sprite } from './sprite';

@Component({
  selector: 'world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css']
})
export class WorldComponent implements AfterViewInit, OnDestroy {
  @ViewChild('worldCanvas') canvasRef: ElementRef;
  @ViewChild('worldDiv') divRef: ElementRef;
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
  }
  redraw() {
    this.rafid = requestAnimationFrame(()=> {
      this.redraw()
    });

    let width = this.canvasRef.nativeElement.width;
    let height = this.canvasRef.nativeElement.height;
    let ctx: CanvasRenderingContext2D =
      this.canvasRef.nativeElement.getContext('2d');
    let size = Math.min(width, height);
    //console.log('redraw world '+width+'x'+height+' -> '+size);
    ctx.fillStyle = '#700000';
    ctx.fillRect((width-size)/2, (height-size)/2, size, size);
    this.sprites.sort((a,b) => { return a.zIndex - b.zIndex });
    let now = (new Date()).getTime()*0.001;
    for (let sprite of this.sprites) {
      sprite.draw(ctx, (width-size)/2, (height-size)/2, size, size, now);
    }
  }
  ngOnDestroy() {
    if (this.rafid)
      cancelAnimationFrame(this.rafid);
  }
  OnNote(note:Note) {
    console.log('Note '+note.note+' vel '+note.velocity);
  }
}
