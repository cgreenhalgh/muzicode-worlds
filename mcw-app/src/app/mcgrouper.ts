import { Note } from './note';
import { ProjectionParameters, FilterParameters } from './mcparameters';

// note grouper

export class NoteGroup {
  public notes:Note[] = [];
  public closed:boolean = false;
  public lastTime:number;
}

export class NoteGrouper {
  private closedGroups:NoteGroup[] = [];
  private currentGroup:NoteGroup;
  projectionParameters:ProjectionParameters;
  constructor(projectionParameters:ProjectionParameters) {
    this.projectionParameters = projectionParameters;
  }
  getClosedGroups(time:number): NoteGroup[] {
    this.closeGroups(time);
    let cgs = this.closedGroups;
    this.closedGroups = [];
    return cgs;
  }
  // filter note, add if appropriate, return group added to or null
  addNote(note:Note): NoteGroup {
    this.closeGroups(note.time);
    if (note.off) {
      if (this.projectionParameters.filterParameters.useNoteOff && this.currentGroup) {
        for (let n of this.currentGroup.notes) {
          if (n.midinote == note.midinote)
            this.currentGroup.lastTime = note.time;
        }
      }
      return null;
    }
    if (!this.currentGroup) {
      this.currentGroup= new NoteGroup();
    }
    this.currentGroup.notes.push(note); 
    this.currentGroup.lastTime = note.time;
    return this.currentGroup;
  }
  private closeGroups(time:number) {
    if (!this.currentGroup)
      return;
    if (this.currentGroup.lastTime+this.projectionParameters.filterParameters.streamGap < time) {
      this.currentGroup.closed = true;
      this.closedGroups.push(this.currentGroup);
      this.currentGroup = null;
    }
  }
}

