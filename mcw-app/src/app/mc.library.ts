import { CodeParser, CodeParserState } from './mccode';
import { CodeMatcher, ParserNodeMap } from './mcmatcher';
import { NoteGrouper, NoteGroup } from './mcgrouper';
import { ProjectionParameters } from './mcparameters';
import { Note, PitchOrDelay } from './note';
import { NoteProcessor } from './mcnoteprocessor';

export interface MatcherInfo {
  code:string;
  matcher:CodeMatcher;
}

// single projection for now
export class MuzicodeEngine {
  projection:ProjectionParameters;
  grouper:NoteGrouper;
  np:NoteProcessor;
  matchers:MatcherInfo[] = [];
  constructor() {
    this.projection = new ProjectionParameters();
    this.grouper = new NoteGrouper(this.projection);
    this.np = new NoteProcessor();
  }
  addCodeMatcher(code:string): MatcherInfo {
    let parser = new CodeParser();
    let pres = parser.parse(code);
    if (pres.state!==CodeParserState.OK) {
      console.log('Code parse error for "'+code+'": '+pres.message+' (location '+pres.location+')');
      return null;
    }
    let codenode = parser.normalise(pres.node);
    let matcher = new CodeMatcher();
    matcher.compile(codenode);
    let minfo = {
      code: code,
      matcher: matcher
    };
    this.matchers.push(minfo);
    return minfo;
  }
  setTime(now:number) {
    let cgs = this.grouper.getClosedGroups(now);
  }
  addNote(note:Note) {
    let ng = this.grouper.addNote(note);
    this.setTime(note.time);
    if (!ng) {
      //console.log('not groupd: ', note);
      return;
    }  
    let notes = this.np.projectNotes(this.projection, ng.notes);
    for (let minfo of this.matchers) {
      if (minfo.matcher.match(notes)) {
        console.log('Matches '+minfo.code);
        // TODO...
      } else {
        let matchedIds = minfo.matcher.getMatchedIds();
        console.log('Does not match (yet) '+minfo.code, notes, matchedIds);
      }
    }
  }
}