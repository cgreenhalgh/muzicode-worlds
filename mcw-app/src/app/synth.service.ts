import { Inject } from '@angular/core';

class NPlay {
  freq:number;
  audioContext:any;
  vco:any;
  vca:any;
  constructor(audioContext:AudioContext, freq:number) {
    this.freq = freq;
    this.audioContext = audioContext;
    this.vco = audioContext.createOscillator();
    this.vco.type = 'sine';
    this.vco.frequency.value = freq;

    /* VCA */
    this.vca = audioContext.createGain();
    this.vca.gain.value = 0;
    /* connections */
    this.vco.connect(this.vca);
    this.vco.start(audioContext.currentTime);
    this.vca.connect(audioContext.destination);
    console.log('noteOn new osc '+freq);
  }
  on(velocity:number) {
    var volume = 0.3;
    if (velocity!==undefined && velocity!==null)
      volume = 0.4*velocity/127;
    else
      volume = 0.4;
    this.vca.gain.cancelScheduledValues(this.audioContext.currentTime);
    this.vca.gain.linearRampToValueAtTime(volume,this.audioContext.currentTime+0.05);
    this.vca.gain.linearRampToValueAtTime(volume*0.6,this.audioContext.currentTime+0.02);
  }
  off() {
    this.vca.gain.cancelScheduledValues(this.audioContext.currentTime);
    this.vca.gain.linearRampToValueAtTime(0,this.audioContext.currentTime+0.03);
  }
}

let NOT_MUCH = 0.001
// VERY simple polyphonic synth
export class SynthService {
  audioContext:AudioContext;
  notes:NPlay[] = [];
  constructor(@Inject(Window) private window: Window) {
//	window.AudioContext = window.AudioContext ||
//		window.webkitAudioContext;
    try {
      this.audioContext = new AudioContext();
    }
    catch (err) {
      console.log('Error creating AudioContext: '+err.message);
    }

  }
  noteOn(freq:number, velocity:number) {
    console.log('noteOn('+freq+','+velocity);
    var nplay = this.notes.find((n) => Math.abs(freq-n.freq)<NOT_MUCH); 
    if (!nplay) {
      nplay = new NPlay(this.audioContext, freq);
      this.notes.push(nplay);
    } else {
      nplay.off();
    }
    nplay.on(velocity);
  }
  noteOff(freq:number) {
    console.log('noteOff('+freq+')');
    var nplay = this.notes.find((n) => Math.abs(freq-n.freq)<NOT_MUCH); 
    if (!!nplay) {
      nplay.off();
    }
  }
  allOff() {
    this.notes.forEach((n) => n.off());
  }
}

