import { parse_typst_to_ast } from "@/../../dist/typst_to_ast";
import {
	ASTNodeTypes,
	type TxtNode,
	type TxtNodeType,
	type TxtParentNode,
	type TxtTextNode,
} from "@textlint/ast-node-types";
import type { Content } from "@textlint/ast-node-types/lib/src/NodeType";

const TypstSyntaxKindToTextlintASTNodeType = (typstSyntaxKind: string) => {
	switch (typstSyntaxKind) {
		/// The contents of a file or content block.
		case "Markup":
			return ASTNodeTypes.Paragraph;
		/// Plain text without markup.
		case "Text":
			return ASTNodeTypes.Str;
		/// Whitespace. Contains at most one newline in markup, as more indicate a
		/// paragraph break.
		case "Space":
			return ASTNodeTypes.Str;
		/// A forced line break: `\`.
		case "Linebreak":
			return ASTNodeTypes.Break;
		/// A paragraph break, indicated by one or multiple blank lines.
		case "Parbreak":
			return ASTNodeTypes.Break;
		/// An escape sequence: `\#`, `\u{1F5FA}`.
		case "Escape":
			return ASTNodeTypes.Str;
		/// A shorthand for a unicode codepoint. For example, `~` for non-breaking
		/// space or `-?` for a soft hyphen.
		case "Shorthand":
			return ASTNodeTypes.Str;
		/// A smart quote: `'` or `"`.
		case "SmartQuote":
			return ASTNodeTypes.Str;
		/// Strong content: `*Strong*`.
		case "Strong":
			return ASTNodeTypes.Strong;
		/// Emphasized content: `_Emphasized_`.
		case "Emph":
			return ASTNodeTypes.Emphasis;
		/// Raw text with optional syntax highlighting: `` `...` ``.
		case "Raw":
			return ASTNodeTypes.Code;
		/// A language tag at the start of raw text: ``typ ``.
		case "RawLang":
			return ASTNodeTypes.Code;
		/// A raw delimiter consisting of 1 or 3+ backticks: `` ` ``.
		case "RawDelim":
			return ASTNodeTypes.Code;
		/// A sequence of whitespace to ignore in a raw block: `
		case "RawTrimmed":
			return ASTNodeTypes.Code;
		/// A hyperlink: `https://typst.org`.
		case "Link":
			return ASTNodeTypes.Link;
		/// A label: `<intro>`.
		case "Label":
			return ASTNodeTypes.Str;
		/// A reference: `@target`, `@target[..]`.
		case "Ref":
			return ASTNodeTypes.Str;
		/// Introduces a reference: `@target`.
		case "RefMarker":
			return ASTNodeTypes.Str;
		/// A section heading: `= Introduction`.
		case "Heading":
			return ASTNodeTypes.Header;
		/// Introduces a section heading: `=`, `==`, ...
		case "HeadingMarker":
			return ASTNodeTypes.Str;
		/// An item in a bullet list: `- ...`.
		case "ListItem":
			return ASTNodeTypes.ListItem;
		/// Introduces a list item: `-`.
		case "ListMarker":
			return ASTNodeTypes.Str;
		/// An item in an enumeration (numbered list): `+ ...` or `1. ...`.
		case "EnumItem":
			return ASTNodeTypes.ListItem;
		/// Introduces an enumeration item: `+`, `1.`.
		case "EnumMarker":
			return ASTNodeTypes.Str;
		/// An item in a term list: `/ Term: Details`.
		case "TermItem":
			return ASTNodeTypes.ListItem;
		/// Introduces a term item: `/`.
		case "TermMarker":
			return ASTNodeTypes.Str;
		/// A mathematical equation: `$x$`, `$ x^2 $`.
		case "Equation":
			return ASTNodeTypes.Str;
		/// The contents of a mathematical equation: `x^2 + 1`.
		case "Math":
			return ASTNodeTypes.Str;
		/// An identifier in math: `pi`.
		case "MathIdent":
			return ASTNodeTypes.Str;
		/// An alignment point in math: `&`.
		case "MathAlignPoint":
			return ASTNodeTypes.Str;
		/// Matched delimiters in math: `[x + y]`.
		case "MathDelimited":
			return ASTNodeTypes.Str;
		/// A base with optional attachments in math: `a_1^2`.
		case "MathAttach":
			return ASTNodeTypes.Str;
		/// Grouped primes in math: `a'''`.
		case "MathPrimes":
			return ASTNodeTypes.Str;
		/// A fraction in math: `x/2`.
		case "MathFrac":
			return ASTNodeTypes.Str;
		/// A root in math: `√x`, `∛x` or `∜x`.
		case "MathRoot":
			return ASTNodeTypes.Str;
		/// A hash that switches into code mode: `#`.
		case "Hash":
			return ASTNodeTypes.Str;
		/// A left curly brace, starting a code block: `{`.
		case "LeftBrace":
			return ASTNodeTypes.Str;
		/// A right curly brace, terminating a code block: `}`.
		case "RightBrace":
			return ASTNodeTypes.Str;
		/// A left square bracket, starting a content block: `[`.
		case "LeftBracket":
			return ASTNodeTypes.Str;
		/// A right square bracket, terminating a content block: `]`.
		case "RightBracket":
			return ASTNodeTypes.Str;
		/// A left round parenthesis, starting a grouped expression, collection,
		/// argument or parameter list: `(`.
		case "LeftParen":
			return ASTNodeTypes.Str;
		/// A right round parenthesis, terminating a grouped expression, collection,
		/// argument or parameter list: `)`.
		case "RightParen":
			return ASTNodeTypes.Str;
		/// A comma separator in a sequence: `,`.
		case "Comma":
			return ASTNodeTypes.Str;
		/// A semicolon terminating an expression: `;`.
		case "Semicolon":
			return ASTNodeTypes.Str;
		/// A colon between name/key and value in a dictionary, argument or
		/// parameter list, or between the term and body of a term list term: `:`.
		case "Colon":
			return ASTNodeTypes.Str;
		/// The strong text toggle, multiplication operator, and wildcard import
		/// symbol: `*`.
		case "Star":
			return ASTNodeTypes.Str;
		/// Toggles emphasized text and indicates a subscript in math: `_`.
		case "Underscore":
			return ASTNodeTypes.Str;
		/// Starts and ends a mathematical equation: `$`.
		case "Dollar":
			return ASTNodeTypes.Str;
		/// The unary plus and binary addition operator: `+`.
		case "Plus":
			return ASTNodeTypes.Str;
		/// The unary negation and binary subtraction operator: `-`.
		case "Minus":
			return ASTNodeTypes.Str;
		/// The division operator and fraction operator in math: `/`.
		case "Slash":
			return ASTNodeTypes.Str;
		/// The superscript operator in math: `^`.
		case "Hat":
			return ASTNodeTypes.Str;
		/// The prime in math: `'`.
		case "Prime":
			return ASTNodeTypes.Str;
		/// The field access and method call operator: `.`.
		case "Dot":
			return ASTNodeTypes.Str;
		/// The assignment operator: `=`.
		case "Eq":
			return ASTNodeTypes.Str;
		/// The equality operator: `==`.
		case "EqEq":
			return ASTNodeTypes.Str;
		/// The inequality operator: `!=`.
		case "ExclEq":
			return ASTNodeTypes.Str;
		/// The less-than operator: `<`.
		case "Lt":
			return ASTNodeTypes.Str;
		/// The less-than or equal operator: `<=`.
		case "LtEq":
			return ASTNodeTypes.Str;
		/// The greater-than operator: `>`.
		case "Gt":
			return ASTNodeTypes.Str;
		/// The greater-than or equal operator: `>=`.
		case "GtEq":
			return ASTNodeTypes.Str;
		/// The add-assign operator: `+=`.
		case "PlusEq":
			return ASTNodeTypes.Str;
		/// The subtract-assign operator: `-=`.
		case "HyphEq":
			return ASTNodeTypes.Str;
		/// The multiply-assign operator: `*=`.
		case "StarEq":
			return ASTNodeTypes.Str;
		/// The divide-assign operator: `/=`.
		case "SlashEq":
			return ASTNodeTypes.Str;
		/// Indicates a spread or sink: `..`.
		case "Dots":
			return ASTNodeTypes.Str;
		/// An arrow between a closure's parameters and body: `=>`.
		case "Arrow":
			return ASTNodeTypes.Str;
		/// A root: `√`, `∛` or `∜`.
		case "Root":
			return ASTNodeTypes.Str;
		/// The `not` operator.
		case "Not":
			return ASTNodeTypes.Str;
		/// The `and` operator.
		case "And":
			return ASTNodeTypes.Str;
		/// The `or` operator.
		case "Or":
			return ASTNodeTypes.Str;
		/// The `none` literal.
		case "None":
			return ASTNodeTypes.Str;
		/// The `auto` literal.
		case "Auto":
			return ASTNodeTypes.Str;
		/// The `let` keyword.
		case "Let":
			return ASTNodeTypes.Str;
		/// The `set` keyword.
		case "Set":
			return ASTNodeTypes.Str;
		/// The `show` keyword.
		case "Show":
			return ASTNodeTypes.Str;
		/// The `context` keyword.
		case "Context":
			return ASTNodeTypes.Str;
		/// The `if` keyword.
		case "If":
			return ASTNodeTypes.Str;
		/// The `else` keyword.
		case "Else":
			return ASTNodeTypes.Str;
		/// The `for` keyword.
		case "For":
			return ASTNodeTypes.Str;
		/// The `in` keyword.
		case "In":
			return ASTNodeTypes.Str;
		/// The `while` keyword.
		case "While":
			return ASTNodeTypes.Str;
		/// The `break` keyword.
		case "Break":
			return ASTNodeTypes.Str;
		/// The `continue` keyword.
		case "Continue":
			return ASTNodeTypes.Str;
		/// The `return` keyword.
		case "Return":
			return ASTNodeTypes.Str;
		/// The `import` keyword.
		case "Import":
			return ASTNodeTypes.Str;
		/// The `include` keyword.
		case "Include":
			return ASTNodeTypes.Str;
		/// The `as` keyword.
		case "As":
			return ASTNodeTypes.Str;
		/// The contents of a code block.
		case "Code":
			return ASTNodeTypes.CodeBlock;
		/// An identifier: `it`.
		case "Ident":
			return ASTNodeTypes.Str;
		/// A boolean: `true`, `false`.
		case "Bool":
			return ASTNodeTypes.Str;
		/// An integer: `120`.
		case "Int":
			return ASTNodeTypes.Str;
		/// A floating-point number: `1.2`, `10e-4`.
		case "Float":
			return ASTNodeTypes.Str;
		/// A numeric value with a unit: `12pt`, `3cm`, `2em`, `90deg`, `50%`.
		case "Numeric":
			return ASTNodeTypes.Str;
		/// A quoted string: `"..."`.
		case "Str":
			return ASTNodeTypes.Str;
		/// A code block: `{ let x = 1; x + 2 }`.
		case "CodeBlock":
			return ASTNodeTypes.Str;
		/// A content block: `[*Hi* there!]`.
		case "ContentBlock":
			return ASTNodeTypes.Str;
		/// A grouped expression: `(1 + 2)`.
		case "Parenthesized":
			return ASTNodeTypes.Str;
		/// An array: `(1, "hi", 12cm)`.
		case "Array":
			return ASTNodeTypes.Str;
		/// A dictionary: `(thickness: 3pt, pattern: dashed)`.
		case "Dict":
			return ASTNodeTypes.Str;
		/// A named pair: `thickness: 3pt`.
		case "Named":
			return ASTNodeTypes.Str;
		/// A keyed pair: `"spacy key": true`.
		case "Keyed":
			return ASTNodeTypes.Str;
		/// A unary operation: `-x`.
		case "Unary":
			return ASTNodeTypes.Str;
		/// A binary operation: `a + b`.
		case "Binary":
			return ASTNodeTypes.Str;
		/// A field access: `properties.age`.
		case "FieldAccess":
			return ASTNodeTypes.Str;
		/// An invocation of a function or method: `f(x, y)`.
		case "FuncCall":
			return ASTNodeTypes.Str;
		/// A function call's argument list: `(12pt, y)`.
		case "Args":
			return ASTNodeTypes.Str;
		/// Spread arguments or an argument sink: `..x`.
		case "Spread":
			return ASTNodeTypes.Str;
		/// A closure: `(x, y) => z`.
		case "Closure":
			return ASTNodeTypes.Str;
		/// A closure's parameters: `(x, y)`.
		case "Params":
			return ASTNodeTypes.Str;
		/// A let binding: `let x = 1`.
		case "LetBinding":
			return ASTNodeTypes.Comment;
		/// A set rule: `set text(...)`.
		case "SetRule":
			return ASTNodeTypes.Comment;
		/// A show rule: `show heading: it => emph(it.body)`.
		case "ShowRule":
			return ASTNodeTypes.Comment;
		/// A contextual expression: `context text.lang`.
		case "Contextual":
			return ASTNodeTypes.Comment;
		/// An if-else conditional: `if x { y } else { z }`.
		case "Conditional":
			return ASTNodeTypes.Comment;
		/// A while loop: `while x { y }`.
		case "WhileLoop":
			return ASTNodeTypes.Comment;
		/// A for loop: `for x in y { z }`.
		case "ForLoop":
			return ASTNodeTypes.Comment;
		/// A module import: `import "utils.typ": a, b, c`.
		case "ModuleImport":
			return ASTNodeTypes.Comment;
		/// Items to import from a module: `a, b, c`.
		case "ImportItems":
			return ASTNodeTypes.Comment;
		/// A renamed import item: `a as d`.
		case "RenamedImportItem":
			return ASTNodeTypes.Comment;
		/// A module include: `include "chapter1.typ"`.
		case "ModuleInclude":
			return ASTNodeTypes.Comment;
		/// A break from a loop: `break`.
		case "LoopBreak":
			return ASTNodeTypes.Comment;
		/// A continue in a loop: `continue`.
		case "LoopContinue":
			return ASTNodeTypes.Comment;
		/// A return from a function: `return`, `return x + 1`.
		case "FuncReturn":
			return ASTNodeTypes.Comment;
		/// A destructuring pattern: `(x, _, ..y)`.
		case "Destructuring":
			return ASTNodeTypes.Comment;
		/// A destructuring assignment expression: `(x, y) = (1, 2)`.
		case "DestructAssignment":
			return ASTNodeTypes.Comment;
		/// A line comment: `// ...`.
		case "LineComment":
			return ASTNodeTypes.Comment;
		/// A block comment: `/* ... */`.
		case "BlockComment":
			return ASTNodeTypes.Comment;
		/// An invalid sequence of characters.
		case "Error":
			return ASTNodeTypes.Comment;
		/// The end of the file.
		case "Eof":
			return ASTNodeTypes.Comment;
		default:
			return ASTNodeTypes.Comment;
	}
};

export const parseTypstToAST = (typstCode: string): TxtNode => {
	let parseResult: string = parse_typst_to_ast(typstCode);

	const match = parseResult.match(/^Markup\((.*)\)$/);
	parseResult = match ? match[1] : "";
	const splitedSyntaxes = parseResult
		.split(/(\w+: "(?:[^"\\]|\\.)*"|\w+: \d+|\[|\])/g)
		.filter(Boolean);

	let currentLine = 1;
	let currentColumn = 0;
	let accumLength = 0;

	const childrenTxtNodeStack: Content[][] = [[]];
	const nodeTypeStack: string[] = [];
	const nodeStartLineStack: number[] = [];
	const nodeStartColumnStack: number[] = [];
	const nodeStartAccumLengthStack: number[] = [];
	const nodeLengthStack: number[] = [];

	for (const syntax of splitedSyntaxes) {
		const match = syntax.match(/(\w+: "(?:[^"\\]|\\.)*"|\w+: \d+)/);
		if (match) {
			let [key, value] = match[1].split(": ");
			key = TypstSyntaxKindToTextlintASTNodeType(key);

			if (/^[0-9]+$/.test(value)) {
				nodeTypeStack.push(key);
				nodeLengthStack.push(Number.parseInt(value));
				nodeStartLineStack.push(currentLine);
				nodeStartColumnStack.push(currentColumn)
				nodeStartAccumLengthStack.push(accumLength);
			} else {
				value = value.slice(1, -1);
				const breakLineMatch = value.match(/\\n/g);
				const breakLineCount = breakLineMatch ? breakLineMatch.length : 0;
				if (breakLineMatch) {
					value = value.replace(/\\n/g, " ");
				}

				const startLine = currentLine;
				const startColumn = currentColumn;
				const endLine = currentLine + breakLineCount;
				const endColumn = breakLineCount > 0 ? 0 : currentColumn + value.length;

				const txtNode: TxtNode | TxtParentNode | TxtTextNode = {
					type: key as TxtNodeType,
					raw: value,
					value: value,
					range: [accumLength, accumLength + value.length],
					loc: {
						start: {
							line: startLine,
							column: startColumn,
						},
						end: {
							line: endLine,
							column: endColumn,
						},
					},
					children: [],
				};
				childrenTxtNodeStack[childrenTxtNodeStack.length - 1].push(
					txtNode as Content,
				);
				currentLine += breakLineCount;
				if (breakLineCount > 0) {
					currentColumn = 0;
				} else {
					currentColumn += value.length;
				}
				accumLength += value.length;
			}
		} else if (syntax === "[") {
			childrenTxtNodeStack.push([]);
		} else if (syntax === "]") {
			const children = childrenTxtNodeStack.pop();
			const parentType = nodeTypeStack.pop() as string;
			const parentLength = nodeLengthStack.pop() as number;
			const startLine = nodeStartLineStack.pop() as number;
			const startColumn  = nodeStartColumnStack.pop() as number;
			const startAccumLength = nodeStartAccumLengthStack.pop() as number;
			const txtNode: TxtParentNode = {
				type: parentType as TxtNodeType,
				raw: "", // WIP
				range: [startAccumLength, startAccumLength + parentLength],
				loc: {
					start: {
						line: startLine,
						column: currentColumn - parentLength > 0 ? currentColumn - parentLength : startColumn,
					},
					end: {
						line: currentLine,
						column: currentColumn,
					},
				},
				children: children as Content[],
			};
			childrenTxtNodeStack[childrenTxtNodeStack.length - 1].push(
				txtNode as Content,
			);
		}
	}

	return childrenTxtNodeStack[0][0];
};
