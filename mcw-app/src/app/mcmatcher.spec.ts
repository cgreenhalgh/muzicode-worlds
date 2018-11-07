import { CodeParser, CodeParserState, CodeNodeType } from './mccode';
import { CodeMatcher, ParserNodeMap } from './mcmatcher';

describe('CodeMatcher class', function() {
	it('should match 60 as C', function() {
			let parser = new CodeParser();
			let pcode = parser.parse("C");
			expect(pcode.state).toEqual(CodeParserState.OK);
			let code = parser.normalise(pcode.node);
			expect(code).toBeDefined();
			
			let matcher = new CodeMatcher();
			matcher.compile(code);
			
			let notes = [{ midinote: 60 }];
			// jasmine.objectContaining()
			expect(matcher.match(notes)).toEqual(true);
	});
	it('should not match 61 as C', function() {
			let parser = new CodeParser();
			let pcode = parser.parse("C");
			expect(pcode.state).toEqual(CodeParserState.OK);
			let code = parser.normalise(pcode.node);
			expect(code).toBeDefined();
			
			let matcher = new CodeMatcher();
			matcher.compile(code);
			
			let notes = [{ midinote: 61 }];
			// jasmine.objectContaining()
			expect(matcher.match(notes)).toEqual(false);
	});
	it('should match /1 as /1', function() {
			let parser = new CodeParser();
			let pcode = parser.parse("/1");
			expect(pcode.state).toEqual(CodeParserState.OK);
			let code = parser.normalise(pcode.node);
			expect(code).toBeDefined();
			
			let matcher = new CodeMatcher();
			matcher.compile(code);
			
			let notes = [{ beats: 1 }];
			// jasmine.objectContaining()
			expect(matcher.match(notes)).toEqual(true);
	});
	it('should match /[-] as /1', function() {
			var parser = new CodeParser();
			var pcode = parser.parse("/[-]");
			expect(pcode.state).toEqual(CodeParserState.OK);
			let code = parser.normalise(pcode.node);
			expect(code).toBeDefined();
			
			var matcher = new CodeMatcher();
			matcher.compile(code);
			
			var notes = [{ beats: 1 }];
			// jasmine.objectContaining()
			expect(matcher.match(notes)).toEqual(true);
	});
	it('should match /[-1] as /1', function() {
			var parser = new CodeParser();
			var pcode = parser.parse("/[-1]");
			expect(pcode.state).toEqual(CodeParserState.OK);
			let code = parser.normalise(pcode.node);
			expect(code).toBeDefined();
			
			var matcher = new CodeMatcher();
			matcher.compile(code);
			
			var notes = [{ beats: 1 }];
			// jasmine.objectContaining()
			expect(matcher.match(notes)).toEqual(true);
	});
	it('should not match /[-1] as /2', function() {
			var parser = new CodeParser();
			var pcode = parser.parse("/[-1]");
			expect(pcode.state).toEqual(CodeParserState.OK);
			let code = parser.normalise(pcode.node);
			expect(code).toBeDefined();
			
			var matcher = new CodeMatcher();
			matcher.compile(code);
			
			var notes = [{ beats: 2 }];
			// jasmine.objectContaining()
			expect(matcher.match(notes)).toEqual(false);
	});
	it('should not match /2 as /1', function() {
			var parser = new CodeParser();
			var pcode = parser.parse("/1");
			expect(pcode.state).toEqual(CodeParserState.OK);
			let code = parser.normalise(pcode.node);
			expect(code).toBeDefined();
			
			var matcher = new CodeMatcher();
			matcher.compile(code);
			
			var notes = [{ beats: 2 }];
			// jasmine.objectContaining()
			expect(matcher.match(notes)).toEqual(false);
	});
	it('should match 60,62 as C,D', function() {
			var parser = new CodeParser();
			var pcode = parser.parse("C,D");
			expect(pcode.state).toEqual(CodeParserState.OK);
			let code = parser.normalise(pcode.node);
			expect(code).toBeDefined();
			
			var matcher = new CodeMatcher();
			matcher.compile(code);
			
			var notes = [{ midinote: 60 }, {midinote: 62}];
			// jasmine.objectContaining()
			expect(matcher.match(notes)).toEqual(true);
	});
	it('should match 62 as C|D', function() {
			var parser = new CodeParser();
			var pcode = parser.parse("C|D");
			expect(pcode.state).toEqual(CodeParserState.OK);
			let code = parser.normalise(pcode.node);
			expect(code).toBeDefined();
			
			var matcher = new CodeMatcher();
			matcher.compile(code);
			
			var notes = [{midinote: 62}];
			// jasmine.objectContaining()
			expect(matcher.match(notes)).toEqual(true);
	});
	it('should match 62 as .', function() {
			var parser = new CodeParser();
			var pcode = parser.parse(".");
			expect(pcode.state).toEqual(CodeParserState.OK);
			let code = parser.normalise(pcode.node);
			expect(code).toBeDefined();
			
			var matcher = new CodeMatcher();
			matcher.compile(code);
			
			var notes = [{midinote: 62}];
			// jasmine.objectContaining()
			expect(matcher.match(notes)).toEqual(true);
	});
	it('should match /1 as .', function() {
			var parser = new CodeParser();
			var pcode = parser.parse(".");
			expect(pcode.state).toEqual(CodeParserState.OK);
			let code = parser.normalise(pcode.node);
			expect(code).toBeDefined();
			
			var matcher = new CodeMatcher();
			matcher.compile(code);
			
			var notes = [{beats: 1}];
			// jasmine.objectContaining()
			expect(matcher.match(notes)).toEqual(true);
	});
	it('should match 62 as C?,D', function() {
			var parser = new CodeParser();
			var pcode = parser.parse("C?,D");
			expect(pcode.state).toEqual(CodeParserState.OK);
			let code = parser.normalise(pcode.node);
			expect(code).toBeDefined();
			
			var matcher = new CodeMatcher();
			matcher.compile(code);
			
			var notes = [{midinote: 62}];
			// jasmine.objectContaining()
			expect(matcher.match(notes)).toEqual(true);
	});
	it('should match 60,62 as C?,D', function() {
			var parser = new CodeParser();
			var pcode = parser.parse("C?,D");
			expect(pcode.state).toEqual(CodeParserState.OK);
			let code = parser.normalise(pcode.node);
			expect(code).toBeDefined();
			
			var matcher = new CodeMatcher();
			matcher.compile(code);
			
			var notes = [{midinote: 60},{midinote: 62}];
			// jasmine.objectContaining()
			expect(matcher.match(notes)).toEqual(true);
	});
	it('should not match 60,60,62 as C?,D', function() {
			var parser = new CodeParser();
			var pcode = parser.parse("C?,D");
			expect(pcode.state).toEqual(CodeParserState.OK);
			let code = parser.normalise(pcode.node);
			expect(code).toBeDefined();
			
			var matcher = new CodeMatcher();
			matcher.compile(code);
			
			var notes = [{midinote: 60},{midinote: 60},{midinote: 62}];
			// jasmine.objectContaining()
			expect(matcher.match(notes)).toEqual(false);
	});
	it('should match 60 as .*', function() {
			var parser = new CodeParser();
			var pcode = parser.parse(".*");
			expect(pcode.state).toEqual(CodeParserState.OK);
			let code = parser.normalise(pcode.node);
			expect(code).toBeDefined();
			
			var matcher = new CodeMatcher();
			matcher.compile(code);
			
			var notes = [{midinote: 60}];
			// jasmine.objectContaining()
			expect(matcher.match(notes)).toEqual(true);
	});
	it('should match 60,60,62 as .*', function() {
			var parser = new CodeParser();
			var pcode = parser.parse(".*");
			expect(pcode.state).toEqual(CodeParserState.OK);
			let code = parser.normalise(pcode.node);
			expect(code).toBeDefined();
			
			var matcher = new CodeMatcher();
			matcher.compile(code);
			
			var notes = [{midinote: 60},{midinote: 60},{midinote: 62}];
			// jasmine.objectContaining()
			expect(matcher.match(notes)).toEqual(true);
	});
	it('should match 60,62 as C,.*,D', function() {
			var parser = new CodeParser();
			var pcode = parser.parse("C,.*,D");
			expect(pcode.state).toEqual(CodeParserState.OK);
			let code = parser.normalise(pcode.node);
			expect(code).toBeDefined();
			
			var matcher = new CodeMatcher();
			matcher.compile(code);
			
			var notes = [{midinote: 60},{midinote: 62}];
			// jasmine.objectContaining()
			expect(matcher.match(notes)).toEqual(true);
	});
	it('should match 60,60,62,62 as C,.*,D', function() {
			var parser = new CodeParser();
			var pcode = parser.parse("C,.*,D");
			expect(pcode.state).toEqual(CodeParserState.OK);
			let code = parser.normalise(pcode.node);
			expect(code).toBeDefined();
			
			var matcher = new CodeMatcher();
			matcher.compile(code);
			
			var notes = [{midinote: 60},{midinote: 60},{midinote: 62},{midinote: 62}];
			// jasmine.objectContaining()
			expect(matcher.match(notes)).toEqual(true);
	});
	it('should part-match C,D with 60 as *C*,D', function() {
			var parser = new CodeParser();
			var pcode = parser.parse("C,D");
			expect(pcode.state).toEqual(CodeParserState.OK);
			let code = parser.normalise(pcode.node);
			expect(code).toBeDefined();
			
			var matcher = new CodeMatcher();
			matcher.compile(code);
			
			var notes = [{midinote: 60}];
			expect(matcher.match(notes)).toEqual(false);
			let matchedIds:ParserNodeMap = {2:{type:CodeNodeType.NOTE,midinote:60,id:2}};
			expect(matcher.getMatchedIds()).toEqual(matchedIds);
	});
});