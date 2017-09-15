import { CodeParser, CodeNode, CodeNodeType, CodeParserState } from './mccode';

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
});