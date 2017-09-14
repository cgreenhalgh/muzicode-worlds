import { NoteGrouper, NoteGroup } from './mcgrouper';
import { ProjectionParameters } from './mcparameters';
import { Note } from './note';

describe('Note grouper', () => {
  let grouper : NoteGrouper;
  let parameters : ProjectionParameters;

  beforeEach( () => { 
    parameters = new ProjectionParameters();
    grouper = new NoteGrouper(parameters); 
  });

  it('true should be true', () => {
    expect(true).toBe(true);
  });

  it('addNote should return a NoteGroup', () => {
    let note = new Note(60, 127, 1);
    let ng = grouper.addNote(note); 
    expect(ng).not.toBe(null);
    expect(ng.notes.length).toBe(1);
  });

  it ('should close a group after 2 seconds', () => {
    let note = new Note(60, 127, 1);
    let ng = grouper.addNote(note);
    let cgs = grouper.getClosedGroups(3.5);
    expect(cgs.length).toBe(1);
  });

  it ('should not close a group after 1 seconds', () => {
    let note = new Note(60, 127, 1);
    let ng = grouper.addNote(note);
    let cgs = grouper.getClosedGroups(2.5);
    expect(cgs.length).toBe(0);
  });
  it ('should not close a group with useNoteOff while note is on', () => {
    parameters.filterParameters.useNoteOff = true;
    let note = new Note(60, 127, 1);
    let ng = grouper.addNote(note);
    let cgs = grouper.getClosedGroups(3.5);
    expect(cgs.length).toBe(0);
  });
  it ('should close a group with useNoteOff after note is off', () => {
    parameters.filterParameters.useNoteOff = true;
    let note = new Note(60, 127, 1);
    grouper.addNote(note);
    let note2 = new Note(60, 0, 3);
    grouper.addNote(note2);
    let cgs = grouper.getClosedGroups(5.5);
    expect(cgs.length).toBe(1);
  });
});
