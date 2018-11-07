import { ProjectionParameters, Context } from './mcparameters';
import { Note, PitchOrDelay } from './note';


export class NoteProcessor {
	mapRawNote(context:Context, note:Note, prevNote?:Note, projection?:ProjectionParameters): PitchOrDelay[] {
		var notes:PitchOrDelay[] = [];
		if (prevNote!==undefined && prevNote.time!==undefined && note.time && context.tempo) {
			notes.push({beats: (note.time-prevNote.time)*context.tempo/60 });
		}
		if (note.midinote) {
			notes.push({ midinote: note.midinote });
		}
		// TODO single octave or single pitch
		return notes;
	}
	mapRawNotes(context:Context, rawNotes:Note[], projection:ProjectionParameters): PitchOrDelay[] {
		var notes:PitchOrDelay[] = [];
		var prevNote:Note = undefined;
		var ni = 0;
		// TODO polyphonic
		while(ni<rawNotes.length) {
			let rawNote = rawNotes[ni++];
			var newNotes = this.mapRawNote(context, rawNote, prevNote, projection);
			notes = notes.concat(newNotes);
			prevNote = rawNote;
		}
		return notes;
	}
	projectNotes(projection:ProjectionParameters, notes:PitchOrDelay[]): PitchOrDelay[] {
		var res:PitchOrDelay[] = [];
		var lostBeats = 0.0;
		for (let note of notes) {
			var notep:PitchOrDelay = null;
			if (note.beats!==undefined && projection.countsPerBeat) {
				var beats = Math.floor( (note.beats+lostBeats)*projection.countsPerBeat + 0.5 ) / projection.countsPerBeat;
				lostBeats += note.beats-beats;
				if (beats>0) {
					if (res.length>0 && res[res.length-1].beats!==undefined) {
						// merge
						res[res.length-1] = {beats: res[res.length-1].beats + beats};
					} else {
						notep = {beats:beats};
					}
				}
			}
			else if (note.midinote!==undefined && projection.pitchesPerSemitone) { 				
				notep = {midinote: Math.floor( note.midinote*projection.pitchesPerSemitone + 0.5 ) / projection.pitchesPerSemitone};				
			} else {			
				// ??
			}
			if (notep) {
				res.push(notep);
			}
		}
		return res;
	}	
}