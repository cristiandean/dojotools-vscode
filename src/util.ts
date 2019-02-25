import * as path from 'path';
import * as consts from './consts';
import * as vscode from 'vscode';

export function parseCommandWithParams(cmdStr: string, document: vscode.TextDocument): string {
	const extName = path.extname(document.fileName);
	cmdStr = cmdStr.replace(consts.RE.FILENAME, `${document.fileName}`);
	cmdStr = cmdStr.replace(consts.RE.WORKSPACE_ROOT, `${vscode.workspace.rootPath}`);
	cmdStr = cmdStr.replace(consts.RE.FILE_BASE_NAME, `${path.basename(document.fileName)}`);
	cmdStr = cmdStr.replace(consts.RE.FILE_NAME_DIR, `${path.dirname(document.fileName)}`);
	cmdStr = cmdStr.replace(consts.RE.FILE_EXT_NAME, `${extName}`);
	cmdStr = cmdStr.replace(consts.RE.FILE_BASENAME_NO_EXT, `${path.basename(document.fileName, extName)}`);
	cmdStr = cmdStr.replace(consts.RE.CWD, `${process.cwd()}`);
	cmdStr = cmdStr.replace(consts.RE.ENV, (_: string, envName: string): string => process.env[envName] || ``);
	return cmdStr;
}


export function setCustomColors(colors: any) {
	vscode.workspace.getConfiguration('workbench').update('colorCustomizations',
		{
			...vscode.workspace.getConfiguration('workbench').get('colorCustomizations'),
			...colors
		}
	);
}

export function confirmBox(message: string, callback: CallableFunction) {
	vscode.window.showQuickPick([consts.Messages.OkButton, consts.Messages.CancelButton], { placeHolder: message })
		.then(selection => {
			if (selection === consts.Messages.OkButton) {
				callback()
			}
		});
}

export function inputBox(message: string, callback: CallableFunction) {
	vscode.window.showInputBox({ placeHolder: message }).then(input => callback(input));
}

export function createStatusBarItem(cmd: string, text?: string, tooltip?: string, aligment?: vscode.StatusBarAlignment): vscode.StatusBarItem {
	const statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(aligment || vscode.StatusBarAlignment.Left);
	statusBarItem.tooltip = tooltip || '';
	statusBarItem.command = cmd;
	statusBarItem.text = text || '';
	return statusBarItem
}

export function getDarker(color: consts.TestStatus): string {
	switch (color) {
		case consts.TestStatus.Processing:
			return consts.Colors.DarkBlue;
		case consts.TestStatus.Failed:
			return consts.Colors.DarkRed;
		case consts.TestStatus.Success:
			return consts.Colors.DarkGreen;
	}
	return color;
}

