export enum CodeTokenType {
	FIXED_TEXT = 1,
	NODE,
	NOTE_NAME,
	NOTE_ACCIDENTAL,
	NUMBER
}
export interface CodeToken {
	type:CodeTokenType;
	text?:string;
	number?:number;
//	constructor(type:CodeTokenType) {
//		this.type = type;
//	}
}
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
export interface CodeNode {
	type:CodeNodeType;
	children?:CodeNode[];
	name?:string;
	midinote?:number;
	beats?:number;
}

export enum CodeParserState {
	OK = 0,
	EMPTY,
	ERROR
}
export interface ParseResult {
	state:CodeParserState;
	node?:CodeNode;
}


export class CodeParser {
	constructor() {}
	parse(text): ParseResult {
		return {state: CodeParserState.ERROR};
	}
}
