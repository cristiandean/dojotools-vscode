import * as vscode from 'vscode';
import { DojoWatcherExtension } from './dojo_watcher';
import { DojoTimerExtension } from './dojo_timer';
import { Commands, Messages } from './consts';


export function activate(context: vscode.ExtensionContext) {
	var dojoWatcher = new DojoWatcherExtension(context);
	var dojoTimer = new DojoTimerExtension(context);
	let disposeStatus = dojoWatcher.showStatusMessage(Messages.StartingDojoTools);

	/** Dojo Watcher */
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => dojoWatcher.configReload(e)));
	context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => dojoWatcher.runCommands(document)));
	context.subscriptions.push(vscode.commands.registerCommand(Commands.CMD_ENABLE_WATCHER, () => { dojoWatcher.activate(); }));
	context.subscriptions.push(vscode.commands.registerCommand(Commands.CMD_DISABLE_WATCHER, () => { dojoWatcher.deactivate(); }));
	/** Dojo Timer */

	context.subscriptions.push(vscode.commands.registerCommand(Commands.CMD_DISABLE_TIMER, () => dojoTimer.deactivate()));
	context.subscriptions.push(vscode.commands.registerCommand(Commands.CMD_ENABLE_TIMER, () => dojoTimer.activate()));
	context.subscriptions.push(vscode.commands.registerCommand(Commands.CMD_SET_TIMER, () => dojoTimer.cmdSetTimer()));
	context.subscriptions.push(vscode.commands.registerCommand(Commands.CMD_TIMER_RESET, () => dojoTimer.cmdResetTimer()));
	context.subscriptions.push(vscode.commands.registerCommand(Commands.CMD_TIMER_START, () => dojoTimer.cmdStartTimer()));

	/** Both */
	context.subscriptions.push(vscode.commands.registerCommand(Commands.CMD_ENABLE_EXTENSION, () => {
		vscode.commands.executeCommand(Commands.CMD_ENABLE_WATCHER)
		vscode.commands.executeCommand(Commands.CMD_ENABLE_TIMER)
	}));
	context.subscriptions.push(vscode.commands.registerCommand(Commands.CMD_DISABLE_EXTENSION, () => {
		vscode.commands.executeCommand(Commands.CMD_DISABLE_WATCHER)
		vscode.commands.executeCommand(Commands.CMD_DISABLE_TIMER)
	}));

	disposeStatus.dispose();
}

export function deactivate() {

}
