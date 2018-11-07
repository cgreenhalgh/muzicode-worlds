import { ParserNode } from './codeuiparser';
import { CodeNodeType } from './mccode';
import { PitchOrDelay } from './note';

var debug = false;

export interface ParserNodeMap {
	[key:number]: ParserNode;
}

interface MatcherState {
	nodes: ParserNode[];
	counts: number[];
	matched: ParserNode[];
}

let SMALL_PITCH = 0.005;
let SMALL_DELAY = 0.005;

function matchesAtomic(node: ParserNode, note: PitchOrDelay):boolean {
	if (note.midinote!==undefined && note.midinote!==null) {
		if (node.type==CodeNodeType.NOTE) {
			if (Math.abs(node.midinote-note.midinote)<SMALL_PITCH) {
				return true;
			}
			else {
				// failed
				if (debug) 
					console.log('fail match '+JSON.stringify(note)+' against '+JSON.stringify(node)+': NOTE '+note.midinote+' expected '+node.midinote);
				return false;
			}
		} else if (node.type==CodeNodeType.NOTE_RANGE) {
			if (node.minMidinote!==undefined && node.minMidinote!==null && node.minMidinote-SMALL_PITCH>note.midinote) {
				// failed
				if (debug) 
					console.log('fail match '+JSON.stringify(note)+' against '+JSON.stringify(node)+': NOTE min '+note.midinote+' expected '+node.minMidinote);
				return false;
			} else if (node.maxMidinote!==undefined && node.maxMidinote!==null && node.maxMidinote+SMALL_PITCH<note.midinote) {
				// failed
				if (debug) 
					console.log('fail match '+JSON.stringify(note)+' against '+JSON.stringify(node)+': NOTE max '+note.midinote+' expected '+node.maxMidinote);
				return false;
			} else {
				// OK
				return true;
			}
		} else if (node.type==CodeNodeType.WILDCARD) {
			// OK
			return true;
		} else {
			// failed - can't match against...
			if (debug) 
				console.log('fail match '+JSON.stringify(note)+' against '+JSON.stringify(node)+': NOTE '+note.midinote);
			return false;
		}
	} else if (note.beats!==undefined && note.beats!==null) {
		if (node.type==CodeNodeType.DELAY) {
			if (Math.abs(node.beats-note.beats)<SMALL_DELAY) {
				return true;
			}
			else {
				// failed
				if (debug) 
					console.log('fail match '+JSON.stringify(note)+' against '+JSON.stringify(node)+': DELAY '+note.beats+' expected '+node.beats);
				return false;
			}
		} else if (node.type==CodeNodeType.DELAY_RANGE) {
			if (node.minBeats!==undefined && node.minBeats!==null && node.minBeats-SMALL_DELAY>note.beats) {
				// failed
				if (debug) 
					console.log('fail match '+JSON.stringify(note)+' against '+JSON.stringify(node)+': DELAY min '+note.beats+' expected '+node.minBeats);
				return false;
			} else if (node.maxBeats!==undefined && node.maxBeats!==null && node.maxBeats+SMALL_DELAY<note.beats) {
				// failed
				if (debug) 
					console.log('fail match '+JSON.stringify(note)+' against '+JSON.stringify(node)+': DELAY max '+note.beats+' expected '+node.maxBeats);
				return false;
			} else {
				// OK
				return true;
			}
		} else if (node.type==CodeNodeType.WILDCARD) {
			// OK
			return true;
		} else {
			if (debug) 
				console.log('fail match '+JSON.stringify(note)+' against '+JSON.stringify(node)+': DELAY '+note.beats);
			return false;
		}
	}
	if (debug) 
		console.log('fail match '+JSON.stringify(note)+' against non-atomic '+JSON.stringify(node));
	return false;
}

export class CodeMatcher {
	node: ParserNode;
	matchedIds: ParserNodeMap;
	states: MatcherState[];

	constructor(node?: ParserNode) {
		if (node)
			this.compile(node);
	};
	compile(node: ParserNode) {
		this.node = node;
		this.label(node);
	}
	label(node?:ParserNode) {
		var nextId = 1;
		function label(node) {
			if (node===undefined)
				return;
			node.id = nextId++;
			//console.log('label '+node.id+'('+nextId+'): '+JSON.stringify(node));
			if (node.children!==undefined && node.children!==null) {
				for (var ci in node.children) {
					var child = node.children[ci];
					label(child);
				}
			}
		}
		label(node);
	};
	// return true/false and decorate notes with match status for vis'n
	// normalised input notes, i.e. note.freq or delay.beats
	match(notes:PitchOrDelay[]):boolean {
		this.reset();
		var matched = true;
		for (var ni in notes) {
			var note = notes[ni];
			matched = this.matchNext(note);
		}
		
		if(debug)
			console.log('end match '+matched+' with states '+JSON.stringify(this.states)+' and matchedIds '+JSON.stringify(this.matchedIds));
		
		return matched;
	};
	reset() {
		// alternative part-match states, each with place in code hierarchy
		this.states = [ { nodes: [this.node], counts: [0], matched: [] } ];	
		this.matchedIds = null;
	}
	matchNext(note:PitchOrDelay): boolean {
		this.matchedIds = null;
		// each state possibility...
		var newStates:MatcherState[] = [];
		// expand possible states
		while(this.states.length>0) {
			var state = this.states.splice(0,1)[0];
			if (debug)
				console.log('expand next state '+JSON.stringify(state));
			var depth = state.nodes.length-1;

			var node = state.nodes[depth];
			if (node.type==CodeNodeType.SEQUENCE) {
				state.nodes.splice(depth+1, 0, node.children[state.counts[depth]]);
				state.counts.splice(depth+1, 0, 0);
				if (debug)
					console.log('down into sequence child '+state.counts[depth]);
				this.states.push(state);
			} else if (node.type==CodeNodeType.DELAY || node.type==CodeNodeType.NOTE ||
						node.type==CodeNodeType.DELAY_RANGE || node.type==CodeNodeType.NOTE_RANGE ||
						node.type==CodeNodeType.WILDCARD) {
				// OK
				newStates.push(state);
			} else if (node.type==CodeNodeType.CHOICE) {
				// each choice is an option...
				for (var ci in node.children) {
					var child = node.children[ci];
					var newState = { nodes: state.nodes.concat(child), counts: state.counts.concat(0), matched: state.matched.slice(0) };
					// go down in each choice...
					this.states.push(newState);
					if (debug)
						console.log('down into choice child '+ci);
				}
			} else if (node.type==CodeNodeType.REPEAT) {
				// maybe can be skipped? but still need to eat a token
				if (depth>0 && state.counts[depth]==0 && (node.minRepeat===undefined || node.minRepeat===null || node.minRepeat<=0)) {
					// special case here on pre-check is to match with 0 occurrences; otherwise it would have appeared
					// as a candidate match on the way out!
					if (debug)
						console.log('done match 0-repeat at depth '+depth+' on '+JSON.stringify(node));
					// clone/alt!
					var newState = { nodes: state.nodes.slice(0,depth), counts: state.counts.slice(0,depth), matched: state.matched.slice(0) };
					if (newState.matched.length==0 || newState.matched[newState.matched.length-1]!==node) {
						newState.matched.push(node);
					}
					// match at parent
					newState.counts[depth-1]++;
					// what else if matched ?! any new repeat is in states for drill-down 
					this.checkCloseState(newState, this.states);
					if (newState.nodes.length>0)
						this.states.push(newState);
				}
				// maybe it can be matched again?
				if ((node.maxRepeat===undefined || node.maxRepeat===null || node.maxRepeat>state.counts[depth]) && node.children!==undefined && node.children.length>0) {
					var newState = { nodes: state.nodes.concat(node.children[0]), counts: state.counts.concat(0), matched: state.matched.slice(0) };
					// go down in each choice...
					this.states.push(newState);
					if (debug)
						console.log('down into repeat child '+JSON.stringify(node.children[0]));
				}
				// Note: to avoid state explosion perhaps need to suppress skip state if match state succeeds?!
				// Or perhaps we only insert the skip state if the match state fails?
			} else {
				console.log('unhandled state node '+JSON.stringify(node));
			}
		}
		this.states = newStates;
		newStates = [];
		for (var si in this.states) {
			var state = this.states[si];
			// check leaf state
			var node = state.nodes[state.nodes.length-1];
			if(matchesAtomic(node, note)) {
				// OK
				state.matched.push(node);
				state.counts[state.nodes.length-1]++;
				newStates.push(state);
			}
		}
		this.states = newStates;

		newStates = [];
		// close finished states 
		var matched = false;
		while(this.states.length>0) {
			var state = this.states.splice(0,1)[0];
			this.checkCloseState(state, newStates);
			if (state.nodes.length==0) {
				// finished
				matched = true;
				this.matchedIds = this.getMatchedIds([state]);
			} else {
				newStates.push(state);
			}
		}
		this.states = newStates;
		return matched;
	}
	checkCloseState(state:MatcherState, newStates:MatcherState[]) {
		var depth = state.nodes.length-1;
		// close finished states
		while (depth>=0 && state.counts[depth]>0) {
			var node = state.nodes[depth];
			// a successfully matched repeat which could match again has to fork here
			if (node.type==CodeNodeType.REPEAT && 
					(node.minRepeat===undefined || node.minRepeat===null || node.minRepeat<=state.counts[depth]) &&
					(node.maxRepeat===undefined || node.maxRepeat===null || node.maxRepeat>state.counts[depth])) {
				// clone!
				if (debug)
					console.log('clone matched repeat '+JSON.stringify(node));
				var newState = { nodes: state.nodes.slice(0), counts: state.counts.slice(0), matched: state.matched.slice(0) };
				newStates.push(newState);
			}
			// atom
			if ((node.type==CodeNodeType.DELAY || node.type==CodeNodeType.NOTE ||
					node.type==CodeNodeType.DELAY_RANGE ||node.type==CodeNodeType.NOTE_RANGE ||
					node.type==CodeNodeType.CHOICE || node.type==CodeNodeType.WILDCARD) ||
					// sequence
					(node.type==CodeNodeType.SEQUENCE && state.counts[depth]>=node.children.length) ||
					// repeat
					(node.type==CodeNodeType.REPEAT && 
					 (node.minRepeat===undefined || node.minRepeat===null || node.minRepeat<=state.counts[depth]))) {
				// done 
				if (debug)
					console.log('done match at depth '+depth+' on '+JSON.stringify(node));
				if (state.matched.length==0 || state.matched[state.matched.length-1]!==node) {
					state.matched.push(node);
				}
				state.nodes.splice(depth,1);
				state.counts.splice(depth,1);
				depth--;
				if (depth>=0)
					state.counts[depth]++;
			}
			else 
				break;
		}

	};
	// map with ids as keys (for speed)
	getMatchedIds(states?:MatcherState[]):ParserNodeMap {
		if (states===undefined && this.matchedIds!==null) {
			// cached from success
			return this.matchedIds;
		}
		var matched:ParserNodeMap = {};
		if (states===undefined)
			states = this.states;
		for (var si in states) {
			var state = states[si];
			for (var mi in state.matched) {
				var node = state.matched[mi];
				if (node.id!==undefined && node.id!==null) {
					matched[node.id] = node;
				}
			}
		}
		return matched;
	}
}