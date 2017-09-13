import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { SynthService } from './synth.service';

@Component({
  selector: 'keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent implements OnInit {
  @ViewChild('keyboardCanvas') canvasRef: ElementRef;
  constructor(private synth: SynthService) {
  }
  ngOnInit() {
    //this.synth.noteOn(1000,100);
    let ctx: CanvasRenderingContext2D =
      this.canvasRef.nativeElement.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = '#DD0031';
    for (let i=0 ; i < 50000 ; i++) {
      let x = Math.random() * 500;
      let y = Math.random() * 500;
      ctx.moveTo(x, y);
      ctx.arc(x, y, 1, 0, Math.PI * 2);
    }
    ctx.fill();
  }
}
