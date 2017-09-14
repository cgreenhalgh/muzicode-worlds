export function midi2freq(midinote) {
  return 261.6*Math.pow(2, (midinote-60)/12.0);
}

export function freq2midi(freq) {
  let logfreq = Math.log2( freq / 261.6 );
  return (logfreq - Math.floor(logfreq))*12 + 60;
}

let NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export function midi2name(midinote) {
  // note 60 is middle C, which I think plugin calls C4, freq. is nominally 261.6Hz
  return NOTE_NAMES[midinote % 12]+String(Math.floor(midinote / 12)-1);
}

export class Note {
  public note:string;
  //public freq:number;
  public midinote:number;
  public velocity:number; // 0-127
  public off:boolean;
  constructor(midinote:number, velocity:number) {
    this.velocity = velocity;
    this.off = velocity<=0;
    this.midinote = midinote;
    //this.freq = midi2freq(midinote);
    this.note = midi2name(midinote);
  }
}

