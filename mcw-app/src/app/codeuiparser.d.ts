export interface ParserNode {
  type: number;
  children?: ParserNode[];
  name?: string;
  accidental?: string;
  octave?: number;
  beats?:number;
  minNote?:number;
  maxNote?:number;
  minBeats?:number;
  maxBeats?:number;
  minRepeat?:number;
  maxRepeat?:number;
}

export function parse(text:string): ParserNode;
