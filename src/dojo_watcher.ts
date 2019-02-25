import { exec } from 'child_process';
import * as vscode from 'vscode';
import { Colors, Commands, Config, Keys, Messages, TestStatus } from './consts';
import { createStatusBarItem, getDarker, parseCommandWithParams, setCustomColors } from './util';

interface CMD {
	match?: string;
	notMatch?: string;
	cmd: string;
}

interface DojoWatcherConfig {
	shell: string;
	commands: Array<CMD>;
}

export class DojoWatcherExtension {
	private _outputChannel: vscode.OutputChannel;
	private _extensionContext: vscode.ExtensionContext;
	private _config: DojoWatcherConfig;
	private _statusBarItem: vscode.StatusBarItem;

	constructor(context: vscode.ExtensionContext) {
		this._extensionContext = context;
		this._outputChannel = vscode.window.createOutputChannel(Config.OUTPUT_CHANNEL_NAME);
		this._config = <DojoWatcherConfig><any>vscode.workspace.getConfiguration(Config.PROJECT_SECTION);
		this._statusBarItem = createStatusBarItem(Commands.CMD_ENABLE_WATCHER, Messages.DojoWatcherText, Messages.DojoWatcherTooltip, vscode.StatusBarAlignment.Right)
	}

	public configReload(event: vscode.ConfigurationChangeEvent) {
		if (!event.affectsConfiguration(Config.PROJECT_SECTION)) {
			return;
		}
		let disposeStatus = this.showStatusMessage(Messages.ReloadingConfig);
		this.loadConfig();
		disposeStatus.dispose();
	}

	public runCommands(document: vscode.TextDocument) {
		if (!this.isEnabled || this.commands.length === 0 || document.fileName.split('/').slice(-1)[0] == "settings.json") {
			return;
		}

		this._outputChannel.show(true)
		this._outputChannel.dispose

		const match = (pattern: string) => pattern && pattern.length > 0 && new RegExp(pattern).test(document.fileName);
		const commandConfigs = this.commands.filter(cfg => {
			const matchPattern = cfg.match || '';
			const negatePattern = cfg.notMatch || '';
			const isMatch = matchPattern.length === 0 || match(matchPattern);
			const isNegate = negatePattern.length > 0 && match(negatePattern);
			return !isNegate && isMatch;
		});

		if (commandConfigs.length === 0) {
			return;
		}

		this.showStatusMessage(Messages.RunningTests);

		const commands: Array<CMD> = [];

		commandConfigs.forEach(cfg => commands.push(
			{
				cmd: parseCommandWithParams(cfg.cmd, document)
			}
		))

		this._runCommands(commands);
	}

	public get isEnabled(): boolean {
		return !!this._extensionContext.globalState.get(Keys.IS_ENABLE, true);
	}

	public set isEnabled(value: boolean) {
		this._statusBarItem.command = value ? Commands.CMD_DISABLE_WATCHER : Commands.CMD_ENABLE_WATCHER;
		this._statusBarItem.color = value ? Colors.Green : Colors.Red;
		const outputMessage = this.isEnabled ? Messages.DojoToolsWatcherEnabled : ''
		this._extensionContext.globalState.update(Keys.IS_ENABLE, value).then(() => this.showOutputMessage(outputMessage));
	}

	public showOutputMessage(message: string): void {
		this._outputChannel.appendLine(message);
	}

	public get commands(): Array<CMD> {
		return this._config.commands || [];
	}

	public setStatus(status: TestStatus) {
		setCustomColors({
			'statusBar.background': status,
			'statusBar.noFolderBackground': status,
			'statusBar.debuggingBackground': status,
			'activityBar.background': getDarker(status),
		})
	}

	public showStatusMessage(message: string): vscode.Disposable {
		this.showOutputMessage(message);
		return vscode.window.setStatusBarMessage(message);
	}

	private _runCommands(commands: Array<CMD>) {
		if (!commands.length) {
			return this.showStatusMessage(Messages.TestingCompleted);
		}

		const cmd = commands.shift();
		this.showOutputMessage(Messages.ExecutingCommand(cmd!.cmd));
		this.setStatus(TestStatus.Processing)

		const childProccess = exec(cmd!.cmd, { shell: this._config.shell, cwd: vscode.workspace.rootPath });

		childProccess.addListener("close", code => this.setStatus(code === 0 ? TestStatus.Success : TestStatus.Failed))
		childProccess.addListener("error", data => this.showOutputMessage(data.message))
		childProccess.on('exit', () => this._runCommands(commands));
		childProccess.stdout.on('data', data => this.showOutputMessage(data));
		childProccess.stderr.on('data', data => this.showOutputMessage(data));
	}

	public loadConfig = (): void => {
		this._config = <DojoWatcherConfig><any>vscode.workspace.getConfiguration(Config.PROJECT_SECTION);
	}

	public activate() {
		this.isEnabled = true;
		this._statusBarItem.show()
	}

	public deactivate() {
		this.isEnabled = false;
		this._statusBarItem.hide()
		vscode.workspace.getConfiguration('workbench').update('colorCustomizations', {});
	}

}