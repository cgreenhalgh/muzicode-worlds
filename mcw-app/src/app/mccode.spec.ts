import { CodeParser, CodeNodeType, CodeParserState, parserNodeToString } from './mccode';

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
	it('should parse and normalise C#,(C#,C#) as a sequence of three notes', function() {
		var parser = new CodeParser();
		// jasmine.objectContaining()
		expect(parser.normalise(parser.parse('C#,(C#,C#)').node)).toEqual({
			// Left or right associative?!
					type: CodeNodeType.SEQUENCE,
					children: 
						[
						 { type: CodeNodeType.NOTE, midinote: 61 },
						 { type: CodeNodeType.NOTE, midinote: 61 },
						 { type: CodeNodeType.NOTE, midinote: 61 }
						 ]
		});
	});
	it('should parse and normalise [C-D] as a note range', function() {
			var parser = new CodeParser();
			// jasmine.objectContaining()
			expect(parser.normalise(parser.parse('[C-D]').node)).toEqual({
				// Left or right associative?!
				type: CodeNodeType.NOTE_RANGE,
				minMidinote: 60,
				maxMidinote: 62
			});
	});
	// 17
	it('should parse and normalise /1,/1 as a /2', function() {
			var parser = new CodeParser();
			// jasmine.objectContaining()
			expect(parser.normalise(parser.parse('/1,/1').node)).toEqual({
				// Left or right associative?!
				type: CodeNodeType.DELAY,
				beats: 2
			});
	});
	it('should parse and print C as C4', function() {
			var parser = new CodeParser();
			// jasmine.objectContaining()
			expect(parserNodeToString(parser.normalise(parser.parse('C').node))).toEqual('C4');
	});
	it('should parse and print C3 as C3', function() {
			var parser = new CodeParser();
			// jasmine.objectContaining()
			expect(parserNodeToString(parser.normalise(parser.parse('C3').node))).toEqual('C3');
	});
	it('should parse and print C,D|E as C4,D4|E4', function() {
			var parser = new CodeParser();
			// jasmine.objectContaining()
			expect(parserNodeToString(parser.normalise(parser.parse('C,D|E').node))).toEqual('C4,D4|E4');
	});
	it('should parse and print (C,D) (C4,D4)', function() {
			var parser = new CodeParser();
			// jasmine.objectContaining()
			expect(parserNodeToString(parser.normalise(parser.parse('(C,D)').node))).toEqual('C4,D4');
	});
	it('should parse and print /0.5 as /0.5', function() {
			var parser = new CodeParser();
			// jasmine.objectContaining()
			expect(parserNodeToString(parser.normalise(parser.parse('/0.5').node))).toEqual('/0.5');
	});
	it('should parse and print (C?,D*|E)+ as (C4?,D4*|E4)+', function() {
			var parser = new CodeParser();
			// jasmine.objectContaining()
			expect(parserNodeToString(parser.normalise(parser.parse('(C?,D*|E)+').node))).toEqual('(C4?,D4*|E4)+');
	});
	it('should normalise (C4,/0.5,D4) as (C4,/0.5,D4)', function() {
			var parser = new CodeParser();
			// jasmine.objectContaining()
			var node = parser.parse('(C4,/0.5,D4)').node;
			console.log('node: '+JSON.stringify( node ));
			var norm = parser.normalise(node);
			console.log('norm: '+JSON.stringify( norm ));
			expect(parserNodeToString(norm)).toEqual('C4,/0.5,D4');
	});
});
