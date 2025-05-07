# PROTEL2 Language Support for VSCode

A VSCode extension providing syntax highlighting and language support for the PROTEL2 language.

## Features

- Syntax highlighting for PROTEL2 language
- Support for BNF grammar notation
- Enhanced highlighting for control structures (IF/ELSEIF/ENDIF)
- Comment toggling support (use `;` for comments)
- Auto-brackets for `()`, `[]`, `<>` and quotes

## Installation

Yes, to use the syntax highlighter, it **must be installed as a VSCode extension**. Here are the installation methods:

### From Visual Studio Code Marketplace

1. Open VS Code
2. Go to Extensions view (Ctrl+Shift+X)
3. Search for "PROTEL2"
4. Click Install

### Manual Installation

1. Download the `.vsix` file from the releases
2. Open VS Code
3. Go to Extensions view (Ctrl+Shift+X)
4. Click on the "..." menu (top-right of Extensions view)
5. Select "Install from VSIX..." and choose the downloaded file

### Development Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Copy it to your VS Code extensions folder:
   - Windows: `%USERPROFILE%\.vscode\extensions`
   - macOS/Linux: `~/.vscode/extensions`
4. Restart VS Code

## Usage

Files with the following extensions will be automatically recognized as PROTEL2 files:
- `.p2`
- `.protel2`
- `.yacc`
- `.protel`

## Language Features

### Syntax Highlighting

The extension provides syntax highlighting for:
- Comments (starting with `;`)
- Keywords (if, then, else, endif, case, etc.)
- Control flow structures with special highlighting:
  - `if`/`then` statements
  - `elseif` conditions
  - `else` blocks
  - `endif` terminators
- BNF grammar notation (::=, |, [], etc.)
- Strings (enclosed in double quotes)
- Operators (->+*/<>=, etc.)
- Special identifiers and types
- Non-terminals in BNF notation (enclosed in angle brackets)

## Development

This extension includes:
- A language server built with vscode-languageserver
- TextMate grammar for syntax highlighting
- Language configuration for editor features

### Building and Packaging

The extension includes auto-versioning for easy releases:

```bash
# Install dependencies
npm install

# Automatically increment patch version (1.0.0 -> 1.0.1) and package
node build.js

# Specify version increment type (patch, minor, or major)
node build.js minor  # 1.0.0 -> 1.1.0
node build.js major  # 1.0.0 -> 2.0.0

# Manual version control
npm run patch        # Increment patch version
npm run minor        # Increment minor version
npm run major        # Increment major version
npm run package      # Create VSIX package
```

## License

MIT 