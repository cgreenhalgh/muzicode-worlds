import { Component, OnInit, ViewChild, ElementRef, Inject, HostListener } from '@angular/core';
import { Note } from './note';

@Component({
  selector: 'world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css']
})
export class WorldComponent implements OnInit {
  @ViewChild('worldCanvas') canvasRef: ElementRef;
  @ViewChild('worldDiv') divRef: ElementRef;
  constructor() {
  }
  @HostListener('window:resize', ['$event.target']) onResize() { 
    //console.log('window:resize');
    this.resize();
    this.redraw();
  }
  ngOnInit() {
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
    let width = this.canvasRef.nativeElement.width;
    let height = this.canvasRef.nativeElement.height;
    let ctx: CanvasRenderingContext2D =
      this.canvasRef.nativeElement.getContext('2d');
    let size = Math.min(width, height);
    console.log('redraw world '+width+'x'+height+' -> '+size);
    ctx.fillStyle = '#700000';
    ctx.fillRect((width-size)/2, (height-size)/2, size, size);
  }
  OnNote(note:Note) {
    console.log('Note '+note.note+' vel '+note.velocity);
  }
}
