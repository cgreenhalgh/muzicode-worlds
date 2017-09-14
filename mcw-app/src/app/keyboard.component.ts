import { Component, ElementRef, EventEmitter, HostListener, Inject, 
         OnInit, Output, ViewChild } from '@angular/core';
import { SynthService } from './synth.service';
import { Note, midi2freq } from './note';

// C,C#,D,D#,E,F,F#,G,G#,A,A#,B
let NOTEX = [0,0.5,1,1.5,2,3,3.5,4,4.5,5,5.5,6,7];

class Key {
  public pressed:boolean = false;
  public active:boolean = false;
  public xOffset:number;
  public black:boolean;
  constructor(public midinote:number) {
    // 60 = middle C
    let octave = Math.floor(midinote/12);
    let note = midinote-12*octave;
    this.xOffset = 7*octave+NOTEX[note];
    this.black = (this.xOffset-Math.floor(this.xOffset)>0.1); 
  }
}
let LOWEST_MIDINOTE = 60;
let HIGHEST_MIDINOTE = 72;
let BLACK_KEY_WIDTH = 0.5;
let BLACK_KEY_HEIGHT = 0.66;

@Component({
  selector: 'keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent implements OnInit {
  @ViewChild('keyboardCanvas') canvasRef: ElementRef;
  @ViewChild('keyboardDiv') divRef: ElementRef;
  @Output() note: EventEmitter<Note> = new EventEmitter();
  keys:Key[] = [];
  private minXOffset:number;
  private maxXOffset:number;
  constructor(private synth: SynthService) {
    for (let midi=LOWEST_MIDINOTE; midi<=HIGHEST_MIDINOTE; midi++) {
      this.keys.push(new Key(midi));
    }
    this.minXOffset = this.keys[0].xOffset;
    this.maxXOffset = this.keys[this.keys.length-1].xOffset;
  }
  @HostListener('window:resize', ['$event.target']) onResize() { 
    //console.log('window:resize');
    this.resize();
    this.redraw();
  }
  ngOnInit() {
    //console.log('keyboard init');
    //this.synth.noteOn(1000,100);
    this.resize();
    this.redraw();
  }
  resize() {
    let width = this.divRef.nativeElement.clientWidth;
    let height = this.divRef.nativeElement.clientHeight;
    //console.log('resize keyboard '+width+'x'+height);
    this.canvasRef.nativeElement.width = width;
    this.canvasRef.nativeElement.height = height;
  }
  redraw() {
    //console.log('redraw keyboard');
    let width = this.canvasRef.nativeElement.width;
    let height = this.canvasRef.nativeElement.height;
    let ctx: CanvasRenderingContext2D =
      this.canvasRef.nativeElement.getContext('2d');
    let keywidth = width/(this.maxXOffset+1-this.minXOffset);
    // white first
    for (let key of this.keys) {
      if (key.black)
        continue;
      if (!key.pressed) 
        ctx.fillStyle = '#f8f8f8';
      else
        ctx.fillStyle = '#e8e8e8';
      ctx.fillRect((key.xOffset-this.minXOffset)*keywidth+1, 0, keywidth-2, height-2);
    }
    for (let key of this.keys) {
      if (!key.black)
        continue;
      if (!key.pressed) 
        ctx.fillStyle = '#000000';
      else
        ctx.fillStyle = '#303030';
      ctx.fillRect((key.xOffset-this.minXOffset+(1-BLACK_KEY_WIDTH)/2)*keywidth, 0, 
        BLACK_KEY_WIDTH*keywidth, height*BLACK_KEY_HEIGHT-2);
    }
    //ctx.fill();
  }
  onTouchStart($event) {
    $event.preventDefault();
    //console.log('touchstart '+$event.changedTouches.length+'/'+$event.targetTouches.length);
    this.updateKeys($event);
  }
  onTouchEnd($event) {
    $event.preventDefault();
    //console.log('touchend'+$event.changedTouches.length+'/'+$event.targetTouches.length);
    this.updateKeys($event);
  }
  onTouchCancel($event) {
    $event.preventDefault();
    //console.log('touchcancel'+$event.changedTouches.length+'/'+$event.targetTouches.length);
    this.updateKeys($event);
  }
  onTouchMove($event) {
    $event.preventDefault();
    //console.log('touchmove'+$event.changedTouches.length+'/'+$event.targetTouches.length);
    this.updateKeys($event);
  }
  updateKeys($event) {
    let rect = this.canvasRef.nativeElement.getBoundingClientRect();
    let width = this.canvasRef.nativeElement.width;
    let height = this.canvasRef.nativeElement.height;
    let keywidth = width/(this.maxXOffset+1-this.minXOffset);

    for (let key of this.keys)
      key.pressed = false;
    for (let i=0; i<$event.targetTouches.length; i++) {
      let touch = $event.targetTouches.item(i);
      let x = touch.clientX - rect.left;
      let y = touch.clientY - rect.top;
      //console.log('touch at '+x+','+y);
      let xOffset = x/keywidth+this.minXOffset;
      if (x<0 || y<0 || x>=width || y>=height)
        continue;
      var possibleKey = null;
      for (let key of this.keys) {
        if (key.black) {
          if (y>=0 && y<height*BLACK_KEY_HEIGHT &&
              Math.abs(xOffset-0.5-key.xOffset)<BLACK_KEY_WIDTH/2)
            possibleKey = key;
        } else {
          if (Math.abs(xOffset-0.5-key.xOffset)<=0.5 && 
              (!possibleKey))
            possibleKey = key;
        }
      }
      if (possibleKey)
        possibleKey.pressed = true;
    }
    for (let key of this.keys) {
      if (key.pressed && !key.active) {
        //console.log('press '+key.midinote);
        this.note.emit(new Note(key.midinote, 127));
        key.active = true;
        this.synth.noteOn(midi2freq(key.midinote), 127);
      } else if (!key.pressed && key.active) {
        //console.log('release '+key.midinote);
        this.note.emit(new Note(key.midinote, 0));
        key.active = false;
        this.synth.noteOff(midi2freq(key.midinote));
      }
    }
    this.redraw();
  }
}
