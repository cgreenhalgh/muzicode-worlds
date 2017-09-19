export interface ParserNode {
  type: number;
  children?: ParserNode[];
  name?: string;
  accidental?: string;
  octave?: number;
  beats?:number;
  minNote?:ParserNode;
  maxNote?:ParserNode;
  minBeats?:number;
  maxBeats?:number;
  minRepeat?:number;
  maxRepeat?:number;
  // normalised
  midinote?:number;
  minMidinote?:number;
  maxMidinote?:number;
}

export function parse(text:string): ParserNode;
