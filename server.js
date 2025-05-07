const {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  SemanticTokensBuilder,
  TextDocumentSyncKind,
  SemanticTokensLegend
} = require('vscode-languageserver/node');

const { TextDocument } = require('vscode-languageserver-textdocument');

// Create a connection for the server
const connection = createConnection(ProposedFeatures.all);

// Create a document manager
const documents = new TextDocuments(TextDocument);

// Define token types
const tokenTypes = [
  'comment',
  'keyword',
  'string',
  'operator',
  'number',
  'type',
  'function',
  'parameter',
  'variable',
  'property',
  'class'
];

// Define token modifiers
const tokenModifiers = ['declaration', 'documentation', 'readonly', 'static', 'abstract'];

// Create a semantic tokens legend
const legend = new SemanticTokensLegend(tokenTypes, tokenModifiers);

// PROTEL2 language patterns
const PROTEL2_PATTERNS = {
  // Comments start with semicolon
  comment: /;.*/,
  
  // Keywords from the grammar
  keyword: /\b(interface|section|fast|perprocess|definitions|uses|of|type|class|abstract|if|then|endif|else|elseif|case|endcase|in|do|enddo|method|operations|nil|round_up)\b/,
  
  // Control flow keywords with special highlighting
  controlFlow: {
    if: /\b(if)\b/,
    then: /\b(then)\b/,
    elseif: /\b(elseif)\b/,
    else: /\b(else)\b/,
    endif: /\b(endif)\b/
  },
  
  // Special identifiers
  specialIdentifier: /\b(any|class|inspect|operations|method|\$classdesc|raise|retry|readable|writable|exclusive|rare|usual|create|fixed|overriding)\b/,
  
  // Operators
  operator: /(\->|\+|\-|\*|\/|<<|>>|=|\^=|<|>|<=|>=|&|\||!|mod|incl|notincl|&:|\|:|\^|ptr|desc|upb|tdsize)/,
  
  // String literals
  string: /"[^"]*"/,
  
  // BNF syntax elements
  bnfSyntax: /(::=|\[|\]|\|)/,
  
  // Identifier (non-terminals in the BNF are represented in angle brackets)
  nonTerminal: /<[a-zA-Z0-9\-_]+>/
};

// Initialize the server
connection.onInitialize(() => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      semanticTokensProvider: {
        legend,
        full: true,
        range: false
      }
    }
  };
});

// Provide semantic tokens for a document
connection.languages.semanticTokens.on(async ({ textDocument }) => {
  const document = documents.get(textDocument.uri);
  if (!document) {
    return null;
  }

  const tokensBuilder = new SemanticTokensBuilder(legend);
  const text = document.getText();
  const lines = text.split(/\r?\n/);

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];

    // Process comments
    const commentMatch = line.match(PROTEL2_PATTERNS.comment);
    if (commentMatch) {
      const startChar = commentMatch.index;
      const length = commentMatch[0].length;
      tokensBuilder.push(lineIndex, startChar, length, tokenTypes.indexOf('comment'), 0);
      // Skip further processing for this line if it's a comment
      if (startChar === 0) continue;
    }

    // Process BNF syntax elements
    let match;
    const regex = new RegExp(PROTEL2_PATTERNS.bnfSyntax, 'g');
    while ((match = regex.exec(line)) !== null) {
      tokensBuilder.push(lineIndex, match.index, match[0].length, tokenTypes.indexOf('operator'), 0);
    }

    // Process non-terminals (grammar elements in angle brackets)
    const nonTerminalRegex = new RegExp(PROTEL2_PATTERNS.nonTerminal, 'g');
    while ((match = nonTerminalRegex.exec(line)) !== null) {
      tokensBuilder.push(lineIndex, match.index, match[0].length, tokenTypes.indexOf('type'), 0);
    }

    // Process control flow structures with special highlighting
    // IF keyword
    let ifMatch;
    const ifRegex = new RegExp(PROTEL2_PATTERNS.controlFlow.if, 'g');
    while ((ifMatch = ifRegex.exec(line)) !== null) {
      tokensBuilder.push(lineIndex, ifMatch.index, ifMatch[0].length, tokenTypes.indexOf('keyword'), tokenModifiers.indexOf('static'));
    }

    // THEN keyword
    let thenMatch;
    const thenRegex = new RegExp(PROTEL2_PATTERNS.controlFlow.then, 'g');
    while ((thenMatch = thenRegex.exec(line)) !== null) {
      tokensBuilder.push(lineIndex, thenMatch.index, thenMatch[0].length, tokenTypes.indexOf('keyword'), tokenModifiers.indexOf('static'));
    }

    // ELSEIF keyword
    let elseifMatch;
    const elseifRegex = new RegExp(PROTEL2_PATTERNS.controlFlow.elseif, 'g');
    while ((elseifMatch = elseifRegex.exec(line)) !== null) {
      tokensBuilder.push(lineIndex, elseifMatch.index, elseifMatch[0].length, tokenTypes.indexOf('keyword'), tokenModifiers.indexOf('static'));
    }

    // ELSE keyword
    let elseMatch;
    const elseRegex = new RegExp(PROTEL2_PATTERNS.controlFlow.else, 'g');
    while ((elseMatch = elseRegex.exec(line)) !== null) {
      tokensBuilder.push(lineIndex, elseMatch.index, elseMatch[0].length, tokenTypes.indexOf('keyword'), tokenModifiers.indexOf('static'));
    }

    // ENDIF keyword
    let endifMatch;
    const endifRegex = new RegExp(PROTEL2_PATTERNS.controlFlow.endif, 'g');
    while ((endifMatch = endifRegex.exec(line)) !== null) {
      tokensBuilder.push(lineIndex, endifMatch.index, endifMatch[0].length, tokenTypes.indexOf('keyword'), tokenModifiers.indexOf('static'));
    }

    // Process remaining keywords (except those already processed in control flow)
    const keywordRegex = new RegExp(PROTEL2_PATTERNS.keyword, 'g');
    while ((match = keywordRegex.exec(line)) !== null) {
      // Skip if this keyword is a control flow keyword that was already processed
      const keyword = match[0].toLowerCase();
      if (keyword === 'if' || keyword === 'then' || keyword === 'elseif' || keyword === 'else' || keyword === 'endif') {
        continue;
      }
      tokensBuilder.push(lineIndex, match.index, match[0].length, tokenTypes.indexOf('keyword'), 0);
    }

    // Process special identifiers
    const specialIdRegex = new RegExp(PROTEL2_PATTERNS.specialIdentifier, 'g');
    while ((match = specialIdRegex.exec(line)) !== null) {
      tokensBuilder.push(lineIndex, match.index, match[0].length, tokenTypes.indexOf('function'), 0);
    }

    // Process operators
    const operatorRegex = new RegExp(PROTEL2_PATTERNS.operator, 'g');
    while ((match = operatorRegex.exec(line)) !== null) {
      tokensBuilder.push(lineIndex, match.index, match[0].length, tokenTypes.indexOf('operator'), 0);
    }

    // Process string literals
    const stringRegex = new RegExp(PROTEL2_PATTERNS.string, 'g');
    while ((match = stringRegex.exec(line)) !== null) {
      tokensBuilder.push(lineIndex, match.index, match[0].length, tokenTypes.indexOf('string'), 0);
    }
  }

  return tokensBuilder.build();
});

// Set up document management
documents.listen(connection);

// Start listening on the connection
connection.listen(); 