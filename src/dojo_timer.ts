import * as moment from "moment";
import * as vscode from "vscode";
import { Colors, Commands, Keys, Messages, TimerState, TimeChangedEventArgs, TimerChangedEventArgs } from "./consts";
import { Timer } from "./models/timer";
import { confirmBox, createStatusBarItem, inputBox } from "./util";
require("moment-duration-format");


export class DojoTimerExtension {

	private timer: Timer;
	private _extensionContext: vscode.ExtensionContext;
	private _statusBarItem: vscode.StatusBarItem;

	constructor(context: vscode.ExtensionContext) {
		this._extensionContext = context
		this._statusBarItem = createStatusBarItem(Commands.CMD_TIMER_START, "", Messages.TimerTooltip, vscode.StatusBarAlignment.Right)
		this.timer = this._createTimer()
	}

	public cmdSetTimer() {
		switch (this.timer.state) {
			case TimerState.Running:
				confirmBox(Messages.ContinueTimerSet, this._showInputTimerBox)
				break;
			default:
				this._showInputTimerBox();
				break
		}
	}

	public cmdResetTimer() {
		this.timer.reset()
	}

	public cmdStartTimer() {
		switch (this.timer.state) {
			case TimerState.Running:
				this.timer.pause();
				break;
			case TimerState.Paused:
				this.timer.start();
				break;
			case TimerState.Stopped:
				this.timer.start();
				break;
		}
	}

	private _createTimer(): Timer {
		const timer = new Timer(this._configTimerSeconds)
		timer.onTimeChanged((args)=>this._onTimeChanged(args));
		timer.onTimerEnd(()=>this._onTimeEnd());
		timer.onTimerChanged((args)=>this._onTimerChanged(args));
		return timer;
	}

	private _onTimeChanged(args: TimeChangedEventArgs) {
		this._statusBarItem.text = Messages.RemainingTime(this._formatSeconds(args.remainingSeconds));
		this._statusBarItem.color = args.remainingSeconds < 10 ? Colors.Yellow : Colors.White;
	}
	private _onTimerChanged(args: TimerChangedEventArgs) {
		this._extensionContext.globalState.update(Keys.TIMER, args.timerSeconds)
	}

	private _onTimeEnd() {
		vscode.window.showInformationMessage(Messages.TimesUp);
	}

	private _showInputTimerBox() {
		inputBox(Messages.SetTimer, (input: string) => {
			const seconds = moment.duration(input).asSeconds();
			if (seconds <= 0) {
				vscode.window.showErrorMessage(Messages.InvalidTimerDuration);
				return;
			}

			this.timer.reset();
			this.timer.setTimer(seconds);
		})
	}

	_formatSeconds(seconds: number) {
		const duration = moment.duration(seconds, "seconds") as any;
		return duration.format("mm:ss");
	}

	get _configTimerSeconds(): number | undefined {
		const timer = this._extensionContext.globalState.get<number>(Keys.TIMER);
		if (timer === undefined) {
			return undefined;
		}
		const seconds = moment.duration(timer, "seconds").asSeconds();

		return timer <= 0 ? undefined : seconds
	}

	deactivate() {
		this.timer.reset();
		this._statusBarItem.hide();
	}

	activate() {
		this._statusBarItem.show();
	}

}

