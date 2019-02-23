import * as vscode from "vscode";
import { TimeChangedEventArgs, TimerChangedEventArgs, TimerConfig, TimerState } from "../consts";

export class Timer {
	private _timeChangedEventEmitter = new vscode.EventEmitter<TimeChangedEventArgs>();
	private _timerEndEventEmitter = new vscode.EventEmitter<void>();
	private _timerChangedEventEmitter = new vscode.EventEmitter<TimerChangedEventArgs>();

	private _elapsedSeconds: number;
	private _timerSeconds: number;
	private _interval: NodeJS.Timer | undefined;
	private _state: TimerState;

	constructor(timerSeconds = TimerConfig.DEFAULT_TIMER_SECONDS) {
		this._timerSeconds = timerSeconds;
		this._state = TimerState.Stopped;
		this._elapsedSeconds = 0;
		setTimeout(() => this.reset(), 100);
	}

	get onTimeChanged(): vscode.Event<TimeChangedEventArgs> {
		return this._timeChangedEventEmitter.event;
	}

	get onTimerEnd(): vscode.Event<void> {
		return this._timerEndEventEmitter.event;
	}

	get onTimerChanged(): vscode.Event<TimerChangedEventArgs> {
		return this._timerChangedEventEmitter.event;
	}

	get state(): TimerState {
		return this._state;
	}

	public get remainingSeconds() {
		return Math.max(this._timerSeconds - this._elapsedSeconds, 0);
	}

	start() {
		this._state = TimerState.Running;
		this._interval = setInterval(() => this.tick(), 1000);
	}

	pause() {
		this._state = TimerState.Paused;
		this.clearTimerLoop();
	}

	reset() {
		this._state = TimerState.Stopped;
		this.clearTimerLoop();
		this._elapsedSeconds = 0;

		this.fireTimeChangedEvent(this.remainingSeconds);
	}

	setTimer(seconds: number) {
		if (seconds <= 0) throw new Error();

		this._timerSeconds = seconds;
		this.fireTimeChangedEvent(this.remainingSeconds);
		this._timerChangedEventEmitter.fire({ timerSeconds: seconds });
	}

	private clearTimerLoop() {
		if (this._interval) {
			clearInterval(this._interval);
		}
	}

	private fireTimeChangedEvent(remainingSeconds: number): void {
		this._timeChangedEventEmitter.fire({ remainingSeconds: remainingSeconds });
	}

	private tick() {
		this._elapsedSeconds += 1;

		const remainingSeconds = this.remainingSeconds;
		if (remainingSeconds > 0) {
			return this.fireTimeChangedEvent(remainingSeconds);
		}

		this._elapsedSeconds = this._timerSeconds;
		this._timerEndEventEmitter.fire();
		this.reset();
		this.clearTimerLoop();
	}
}
