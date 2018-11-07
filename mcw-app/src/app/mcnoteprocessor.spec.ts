import { NoteProcessor } from './mcnoteprocessor';
import { ProjectionParameters, Context } from './mcparameters';
import { Note, PitchOrDelay } from './note';

describe('Note processor', () => {
	let np : NoteProcessor;
	let parameters : ProjectionParameters;

	beforeEach( () => { 
		np = new NoteProcessor();
		parameters = new ProjectionParameters();
	});
	it('should be defined', function() {
		expect(NoteProcessor).toBeDefined();
	});
	it('should map a raw note to a note via context', function() {
		// A4 = 440 = 69
		let context = new Context();
		let note = new Note(69, 127, 100);
		expect(np.mapRawNote(context, note)).toEqual([{midinote:69}]);		
	});
	it('should map a raw second note to a delay and a note via context', function() {
		let context = new Context();
		context.tempo = 120;
		expect(np.mapRawNote(context, new Note(69, 127, 101), new Note(69, 127, 100)))
			.toEqual([{beats:2},{midinote: 69}]);
	});
	it('should map a two raw notes to a note, delay and a note via context', function() {
		let context = new Context();
		context.tempo = 120;
		expect(np.mapRawNotes(context, [new Note(69, 127, 100), new Note(70, 127, 101)], parameters))
			.toEqual([{midinote:69},{beats:2},{midinote: 70}]);
	});
	it('should map 2.2 beats at quant. 2 to 2 beats', function() {
		parameters.countsPerBeat = 2;
		var notes:PitchOrDelay[] = [{beats:2.2}];
		expect(np.projectNotes(parameters, notes))
			.toEqual([{beats:2}]);
	});

	it('should map 2.4 beats at quant. 2 to 2.5 beats', function() {
		parameters.countsPerBeat = 2;
		var notes:PitchOrDelay[] = [{beats:2.4}];
		expect(np.projectNotes(parameters, notes))
			.toEqual([{beats:2.5}]);
	});
	it('should map 0.4,0.4 beats at quant. 1 to 1 beat', function() {
		parameters.countsPerBeat = 1;
		var notes:PitchOrDelay[] = [{beats:0.4},{beats:0.4}];
		expect(np.projectNotes(parameters, notes))
			.toEqual([{beats:1}]);
	});
	it('should map note 60.2 at quant. 2 to 60', function() {
		parameters.pitchesPerSemitone = 2;
		var notes:PitchOrDelay[] = [{midinote:60.2}];
		expect(np.projectNotes(parameters, notes))
			.toEqual([{midinote:60}]);
	});
	it('should map note 60.4 beats at quant. 2 to 60.5', function() {
		parameters.pitchesPerSemitone = 2;
		var notes:PitchOrDelay[] = [{midinote:60.4}];
		expect(np.projectNotes(parameters, notes))
			.toEqual([{midinote:60.5}]);
	});
	it('should map 1,1 beats at quant. 1 to 2 beats', function() {
		parameters.countsPerBeat = 1;
		var notes:PitchOrDelay[] = [{beats:1},{beats:1}];
		expect((new NoteProcessor()).projectNotes(parameters, notes))
			.toEqual([{beats:2}]);
	});
	it('should map 0.1 beats at quant. 1 to nothing', function() {
		parameters.countsPerBeat = 1;
		var notes:PitchOrDelay[] = [{beats:0.1}];
		expect((new NoteProcessor()).projectNotes(parameters, notes))
			.toEqual([]);
	});

});
