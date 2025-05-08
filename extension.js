const path = require('path');
const { workspace, ExtensionContext } = require('vscode');
const {
  LanguageClient,
  TransportKind
} = require('vscode-languageclient/node');

let client;

function activate(context) {
  // Server options
  const serverModule = context.asAbsolutePath(path.join('server.js'));
  const serverOptions = {
    run: {
      module: serverModule,
      transport: TransportKind.ipc
    },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: { execArgv: ['--nolazy', '--inspect=6009'] }
    }
  };

  // Client options
  const clientOptions = {
    documentSelector: [{ scheme: 'file', language: 'protel2' }],
    synchronize: {
      fileEvents: workspace.createFileSystemWatcher('**/*.{protel,protel2}')
    }
  };

  // Create and start client
  client = new LanguageClient(
    'protel2LanguageServer',
    'PROTEL2 Language Server',
    serverOptions,
    clientOptions
  );

  // Start the client
  client.start();
}

function deactivate() {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

module.exports = { activate, deactivate }; 