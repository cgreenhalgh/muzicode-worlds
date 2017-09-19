import { ParserNode, parse } from './codeuiparser';

// NB sync with pegjs parser values!
export enum CodeNodeType {
  NOTE = 1,
  DELAY,
  GROUP,
  SEQUENCE,
  CHOICE,
  REPEAT,
  REPEAT_0_OR_MORE,
  REPEAT_1_OR_MORE,
  REPEAT_0_OR_1,
  NOTE_RANGE,
  DELAY_RANGE,
  WILDCARD
}

export enum CodeParserState {
	OK = 0,
	EMPTY,
	ERROR
}
export interface ParseResult {
	state:CodeParserState;
	node?:ParserNode;
  location?:number;
  message?:string;
}

let NOTE_NAMES = {
		'C': 60,
		'D': 62,
		'E': 64,
		'F': 65,
		'G': 67,
		'A': 69,
		'B': 71,
		'c': 72,
		'd': 74,
		'e': 76,
		'f': 77,
		'g': 79,
		'a': 81,
		'b': 83
	};
let ACCIDENTALS = {
		'#': 1,
		'b': -1
		// TODO double, etc.
	};
let debug = false;

let NOTES = [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B' ];

function midinoteToString(midinote:number): string {
	// C4 = 60
	var pitch = Math.floor(midinote+0.5 - 60);
	var octave = Math.floor( pitch / 12);
	pitch = pitch - 12*octave;
	octave = octave+4;
	//console.log('midinote '+midinote+' -> pitch '+pitch+', octave '+octave);
	// TODO: alt print forms?
	var res = NOTES[pitch] + String(octave);
	return res;
};
function beatsToString(beats:number): string {
	// centibeats?!
	var res = String(Number(beats).toFixed(2));
	if (res.substring(res.length-3)=='.00') {
		res = res.substring(0, res.length-3);
	} else if (res.substring(res.length-1)=='0') {
		res = res.substring(0, res.length-1);
	}
	return res;
}
let PRECEDENCE_CHOICE = 1;
let PRECEDENCE_SEQUENCE = 2;
let PRECEDENCE_REPEAT = 3;

export function parserNodeToString(node: ParserNode, precedence?:number): string {
	var res = '';
	switch(node.type) {
	case CodeNodeType.NOTE:
		res += midinoteToString(node.midinote);
		break;
	case CodeNodeType.DELAY:
		res += '/'+beatsToString(node.beats);
		break;
	case CodeNodeType.SEQUENCE:
		if (precedence!==undefined && precedence>PRECEDENCE_SEQUENCE) {
			res += '(';
		}
		for (var ci = 0; ci<node.children.length; ci++) {
			var child = node.children[ci];
			if (ci>0)
				res += ',';
			res += parserNodeToString(child, PRECEDENCE_SEQUENCE);
		}
		if (precedence!==undefined && precedence>PRECEDENCE_SEQUENCE) {
			res += ')';
		}
		break;
	case CodeNodeType.CHOICE:
		if (precedence!==undefined && precedence>PRECEDENCE_CHOICE) {
			res += '(';
		}
		for (var ci = 0; ci<node.children.length; ci++) {
			var child = node.children[ci];
			if (ci>0)
				res += '|';
			res += parserNodeToString(child, PRECEDENCE_CHOICE);
		}
		if (precedence!==undefined && precedence>PRECEDENCE_CHOICE) {
			res += ')';
		}
		break;
	case CodeNodeType.REPEAT:
	case CodeNodeType.REPEAT_0_OR_1:
	case CodeNodeType.REPEAT_0_OR_MORE:
	case CodeNodeType.REPEAT_1_OR_MORE:
		var child = node.children[0];
		if (child.type!=CodeNodeType.NOTE && child.type!=CodeNodeType.DELAY &&
				child.type!=CodeNodeType.NOTE_RANGE && child.type!=CodeNodeType.DELAY_RANGE &&
				child.type!=CodeNodeType.WILDCARD && child.type!=CodeNodeType.GROUP) {
			res += '(';
		}
		res += parserNodeToString(child);
		if (child.type!=CodeNodeType.NOTE && child.type!=CodeNodeType.DELAY &&
				child.type!=CodeNodeType.NOTE_RANGE && child.type!=CodeNodeType.DELAY_RANGE &&
				child.type!=CodeNodeType.WILDCARD && child.type!=CodeNodeType.GROUP) {
			res += ')';
		}
		if (node.type==CodeNodeType.REPEAT_0_OR_1 || (node.minRepeat==0 && node.maxRepeat==1)) {
			res += '?';
		} else if (node.type==CodeNodeType.REPEAT_1_OR_MORE || (node.minRepeat==1 && (node.maxRepeat===null || node.maxRepeat===undefined))) {
			res += '+';
		} else if (node.type==CodeNodeType.REPEAT_0_OR_MORE || (node.minRepeat==0 && (node.maxRepeat===null || node.maxRepeat===undefined))) {
			res += '*';
		} else {
			res += '{';
			if (node.minRepeat!==undefined && node.minRepeat!==null)
				res += node.minRepeat;
			res += '-';
			if (node.maxRepeat!==undefined && node.maxRepeat!==null)
				res += node.maxRepeat;
			res += '}';
		}
		break;
	case CodeNodeType.NOTE_RANGE:
		res += '[';
		if (node.minMidinote!==undefined && node.minMidinote!==null) 
			res += midinoteToString(node.minMidinote);
		res += '-';
		if (node.maxMidinote!==undefined && node.maxMidinote!==null) 
			res += midinoteToString(node.maxMidinote);
		res += ']';
		break;
	case CodeNodeType.DELAY_RANGE:
		res += '/[';
		if (node.minBeats!==undefined && node.minBeats!==null) 
			res += beatsToString(node.minBeats);
		res += '-';
		if (node.maxBeats!==undefined && node.maxBeats!==null) 
			res += beatsToString(node.maxBeats);
		res += ']';
		break;
	case CodeNodeType.WILDCARD:
		res += '.';
		break;
	case CodeNodeType.GROUP:
		res += '(';
		var child = node.children[0];
		res += parserNodeToString(child);
		res += ')';
		break;
	default:
		res += '<ERROR:unknown type '+node.type+'>';
		break;
	}		
	return res;
}

export class CodeParser {
	constructor() {}
	parse(text:string): ParseResult {
    try {
      var res = parse(text);
      return {
        state: CodeParserState.OK,
        node: this.stripNulls(res)
      };
    }
    catch (err) {
      console.log("Error parsing "+text+(err.location ? ' at '+JSON.stringify(err.location.start) : ''), err);
      console.log(err);
      return {
        state: CodeParserState.ERROR,
        location: (err.location ? err.location.start.offset : undefined),
        message: err.message
      };
    }
  }
  stripNulls(obj:ParserNode): ParserNode {
    for (var key in obj) {
      if (obj[key]===null)
        delete obj[key];
    }
    if (obj.children!==undefined) {
      for (var ci in obj.children) {
        this.stripNulls(obj.children[ci]);
      }
    }
    return obj;
  }
	normaliseNote(node:ParserNode) {
		// middle C = 60 = C4; 'C' = C4, 'c' = C5 (ABC - Helmholz is two octaves lower)
		if (node.name!==undefined && node.name!==null) {
			var n = NOTE_NAMES[node.name];
			if (n!==undefined) {
				node.midinote = n;
			} else {
				console.log('Unknown note name '+node.name);
				node.midinote = 60;
			}
			delete node.name;
		}
		// octave before accidental!
		if (node.octave!==undefined && node.octave!==null) {
			if (node.midinote!==undefined) {
				var oct = Math.floor((node.midinote-60+4*12+0.5)/12);
				var p = node.midinote-60+(4-oct)*12;
				node.midinote = 60+12*(node.octave-4)+p;
			}
			else {
				node.midinote = 60+12*(oct-4);
			}
			delete node.octave;
		}
		if (node.accidental!==undefined && node.accidental!==null) {
			var a = ACCIDENTALS[node.accidental];
			if (a!==undefined) {
				node.midinote += a;
			}
			else {
				console.log('Unknown accidental '+node.accidental);
			}
			delete node.accidental;
		}		
	}
	normalise(node: ParserNode): ParserNode {
		switch(node.type) {
		case CodeNodeType.NOTE:
			this.normaliseNote(node);
			break;
		case CodeNodeType.DELAY:
			if (node.beats===null || node.beats===undefined || node.beats===0 || node.beats<0) {
				return null;
			}
			break;
		case CodeNodeType.GROUP:
			// not needed at abstract syntax level
			if (node.children!==null && node.children!==undefined && node.children.length>0) {
				return this.normalise(node.children[0]);
			}
			return null;
		case CodeNodeType.SEQUENCE:
		case CodeNodeType.CHOICE:
			// merge child nodes of same type
			var children = node.children;
			node.children = [];
			if (debug) console.log('normalise children '+JSON.stringify(children));
			while (children.length>0) {
				var child = children.splice(0,1)[0];
				if (debug) console.log('normalise check child '+JSON.stringify(child));
				while(child!==undefined && child.type==CodeNodeType.GROUP) {
					if (child.children.length>0) {
						// into group
						child = child.children[0];
					}
					else {
						child = undefined;
						break;
					}
				}
				if (child===null) {
					// ignore
				} else if (child.type==node.type) {
					if (debug) console.log('normalise recurse into sequence/choice '+JSON.stringify(child));
					// replace with children in place/order
					if (child.children!==undefined && child.children!==null) {
						var j = 0;
						for (var ci in child.children) {
							if (child.children[ci]!==null)
								children.splice(j++, 0, child.children[ci]);
						}
					}
				} else {
					// OK to include anything else
						if (debug) console.log('normalise simple child '+JSON.stringify(child));
					child = this.normalise(child);
					if (child!==null) {
						// except we want to merge consecutive delays in a sequence...
						if (node.type==CodeNodeType.SEQUENCE && child.type==CodeNodeType.DELAY && node.children.length>0 && node.children[node.children.length-1].type==CodeNodeType.DELAY) {
							var prev = node.children[node.children.length-1];
							if (debug) console.log('merge delay '+child.beats+' into '+JSON.stringify(prev));
							prev.beats += child.beats;
						} else {
							if (debug) console.log('normalise add child '+JSON.stringify(child));
							node.children.push(child);
						}
					}
				}
			}
			if (node.children===null || node.children===undefined || node.children.length==0)
				// ignore
				return null;
			if (node.children.length==1) {
				// only one!
				return node.children[0];
			}
			break;
		case CodeNodeType.REPEAT:
		case CodeNodeType.REPEAT_0_OR_MORE:
		case CodeNodeType.REPEAT_1_OR_MORE:
		case CodeNodeType.REPEAT_0_OR_1:
			// TODO extend to REPEAT as child of REPEAT
			// not needed at abstract syntax level
			if (node.children!==null && node.children!==undefined && node.children.length>0) {
				var child = this.normalise(node.children[0]);
				if (child!==null)
					node.children = [child];
				else {
					// meaningless
					return null;
				}
			}
			if (node.type==CodeNodeType.REPEAT_0_OR_MORE) {
				node.minRepeat = 0;
				delete node.maxRepeat;
				node.type = CodeNodeType.REPEAT;
			} else if (node.type==CodeNodeType.REPEAT_1_OR_MORE) {
				node.minRepeat = 1;
				delete node.maxRepeat;
				node.type = CodeNodeType.REPEAT;
			} else if (node.type==CodeNodeType.REPEAT_0_OR_1) {
				node.minRepeat = 0;
				node.maxRepeat = 1;
				node.type = CodeNodeType.REPEAT;
			} else if (node.maxRepeat!==undefined && node.maxRepeat<=0) {
				// nothing!
				return null;
			}
			break;
		case CodeNodeType.NOTE_RANGE:
			if (node.minNote!==undefined && node.minNote!==null) {
				node.minMidinote = this.normalise(node.minNote).midinote;
				delete node.minNote;
			}
			if (node.maxNote!==undefined && node.maxNote!==null) {
				node.maxMidinote = this.normalise(node.maxNote).midinote;
				delete node.maxNote;
			}
			break;
		case CodeNodeType.DELAY_RANGE:
			break;
		case CodeNodeType.WILDCARD:
			// OK
			break;
		}
		return node;
	};
}
