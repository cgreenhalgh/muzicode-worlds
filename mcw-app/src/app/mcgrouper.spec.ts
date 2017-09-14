import { NoteGrouper, NoteGroup } from './mcgrouper';
import { ProjectionParameters } from './mcparameters';
import { Note } from './note';

describe('Note grouper', () => {
  let grouper : NoteGrouper;
  let parameters = new ProjectionParameters();

  beforeEach( () => { grouper = new NoteGrouper(parameters); } );

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
});
