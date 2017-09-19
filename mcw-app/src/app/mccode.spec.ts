import { CodeParser, CodeNodeType, CodeParserState } from './mccode';

describe('CodeParser class', function() {
	it('should parse C as a note', function() {
		var parser = new CodeParser();
		expect(parser.parse('C')).toEqual({
			state: CodeParserState.OK,
			node: {
				type: CodeNodeType.NOTE,
				name: 'C'
			}
		});
	});
  it('should parse C# as a note', function() {
    var parser = new CodeParser();
    // jasmine.objectContaining()
    expect(parser.parse('C#')).toEqual({
      state: CodeParserState.OK,
      node: {
        type: CodeNodeType.NOTE,
        name: 'C',
        accidental: '#'
      }
    });
  });
  it('should parse Cb as a note', function() {
    var parser = new CodeParser();
    // jasmine.objectContaining()
    expect(parser.parse('Cb')).toEqual({
      state: CodeParserState.OK,
      node: {
        type: CodeNodeType.NOTE,
        name: 'C',
        accidental: 'b'
      }
    });
  });
  it('should parse C#5 as a note', function() {
    var parser = new CodeParser();
    // jasmine.objectContaining()
    expect(parser.parse('C#5')).toEqual({
      state: CodeParserState.OK,
      node: {
        type: CodeNodeType.NOTE,
        name: 'C',
        accidental: '#',
        octave: 5
      }
    });
  });
  it('should refuse C5# as a note', function() {
    var parser = new CodeParser();
    // jasmine.objectContaining()
    expect(parser.parse('C5#').state).toEqual(CodeParserState.ERROR);
  });
  it('should parse C? as a repeat of a note', function() {
    var parser = new CodeParser();
    // jasmine.objectContaining()
    expect(parser.parse('C?')).toEqual({
      state: CodeParserState.OK,
      node: {
        type: CodeNodeType.REPEAT_0_OR_1,
        children: 
          [
           {
             type: CodeNodeType.NOTE,
             name: 'C'
           }
           ]
      }
    });
  });
  it('should parse C* as a repeat of a note', function() {
    var parser = new CodeParser();
    // jasmine.objectContaining()
    expect(parser.parse('C*')).toEqual({
      state: CodeParserState.OK,
      node: {
        type: CodeNodeType.REPEAT_0_OR_MORE,
        children: 
          [
           {
             type: CodeNodeType.NOTE,
             name: 'C'
           }
           ]
      }
    });
  });
  it('should parse C+ as a repeat of a note', function() {
    var parser = new CodeParser();
    // jasmine.objectContaining()
    expect(parser.parse('C+')).toEqual({
      state: CodeParserState.OK,
      node: {
        type: CodeNodeType.REPEAT_1_OR_MORE,
        children: 
          [
           {
             type: CodeNodeType.NOTE,
             name: 'C'
           }
           ]
      }
    });
  });
  it('should refuse ,', function() {
    var parser = new CodeParser();
    // jasmine.objectContaining()
    expect(parser.parse(',').state).toEqual(CodeParserState.ERROR);
  });
  it('should parse C,C as a sequence of two notes', function() {
    var parser = new CodeParser();
    // jasmine.objectContaining()
    expect(parser.parse('C,C')).toEqual({
      state: CodeParserState.OK,
      node: {
        type: CodeNodeType.SEQUENCE,
        children: 
          [
           { type: CodeNodeType.NOTE, name: 'C' },
           { type: CodeNodeType.NOTE, name: 'C' }
           ]
      }
    });
  });
  it('should parse C#,C# as a sequence of two notes', function() {
    var parser = new CodeParser();
    // jasmine.objectContaining()
    expect(parser.parse('C#,C#')).toEqual({
      state: CodeParserState.OK,
      node: {
        type: CodeNodeType.SEQUENCE,
        children: 
          [
           { type: CodeNodeType.NOTE, name: 'C', accidental: '#' },
           { type: CodeNodeType.NOTE, name: 'C', accidental: '#' }
           ]
      }
    });
  });
  it('should parse C#,C#,C# as a sequence of three notes', function() {
    var parser = new CodeParser();
    // jasmine.objectContaining()
    expect(parser.parse('C#,C#,C#')).toEqual({
      state: CodeParserState.OK,
      node: {
        // Left or right associative?!
        type: CodeNodeType.SEQUENCE,
        children: 
          [
           {   type: CodeNodeType.NOTE, name: 'C', accidental: '#' },
           {   type: CodeNodeType.SEQUENCE,
             children: 
               [
                { type: CodeNodeType.NOTE, name: 'C', accidental: '#' },
                { type: CodeNodeType.NOTE, name: 'C', accidental: '#' }
                ]
           }
           ]
      }
    });
  });
});