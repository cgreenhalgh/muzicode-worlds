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
}
