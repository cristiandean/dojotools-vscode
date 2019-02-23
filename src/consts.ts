

export namespace Config {
	export const PROJECT_SECTION = 'cristiandean.dojotools'
	export const OUTPUT_CHANNEL_NAME = 'DojoTools'
}

export namespace TimerConfig {
	export const DEFAULT_TIMER_SECONDS = 3 * 60;
}

export namespace Keys {
	export const IS_ENABLE = 'isEnabled'
	export const TIMER = 'DojotoolsTimer'
}

export namespace RE {
	export const FILENAME = /\${file}/g
	export const WORKSPACE_ROOT = /\${workspaceRoot}/g;
	export const FILE_BASE_NAME = /\${fileBasename}/g;
	export const FILE_NAME_DIR = /\${fileDirname}/g;
	export const FILE_EXT_NAME = /\${fileExtname}/g;
	export const FILE_BASENAME_NO_EXT = /\${fileBasenameNoExt}/g;
	export const CWD = /\${cwd}/g;
	export const ENV = /\${env\.([^}]+)}/g;
}

export namespace Commands {
	export const CMD_ENABLE_EXTENSION = 'extension.cristiandean.enableDojoTools'
	export const CMD_DISABLE_EXTENSION = 'extension.cristiandean.disableDojoTools'
	export const CMD_TIMER_START = 'extension.cristiandean.timerAction'
	export const CMD_TIMER_RESET = 'extension.cristiandean.timerReset'
	export const CMD_SET_TIMER = 'extension.cristiandean.setTimer'
	export const CMD_ENABLE_WATCHER = 'extension.cristiandean.enableWatcher'
	export const CMD_ENABLE_TIMER = 'extension.cristiandean.enableTimer'
	export const CMD_DISABLE_WATCHER = 'extension.cristiandean.disableWatcher'
	export const CMD_DISABLE_TIMER = 'extension.cristiandean.disableTimer'
}


export namespace Messages {
	export const SetTimer = "Set timer. e.g. 1:0:0(1 hour), 0:30:0(30 minutes)";
	export const ContinueTimerSet = "Timer is running. Do you want to reset timer and set new timer?";
	export const InvalidTimerDuration = "Timer duration must be > 0 sec";
	export const ReloadingConfig = "Reloading config";
	export const TestingCompleted = "Testing completed!";
	export const StartingDojoTools = "Starting DojoTools =D";
	export const TimesUp = "Your time is up!";
	export const TimerTooltip = "Timer Dojo";
	export const OkButton = "Ok";
	export const CancelButton = "Cancel";
	export const RunningTests = "Running Tests...";
	export const DojoWatcherText = "$(hubot)";
	export const DojoWatcherTooltip = "DojoTools Watcher";
	export const DojoToolsWatcherEnabled = `DojoTools watcher is enabled!`;
	export const ExecutingCommand = (cmd: string) => `Executing Test Command: ${cmd}`;
	export const RemainingTime = (seconds: number) => `DojoTimer: ${seconds}`;
}

export enum TestStatus {
	Processing = '#004994',
	Success = '#029400',
	Failed = '#940000',
}


export enum Colors {
	White = '#FFFFFF',
	Yellow = '#fffc98',
	Green = '#a2ffa9',
	Red = '#5d0000'
}


export enum TimerState {
	Paused,
	Running,
	Stopped
}

export interface TimeChangedEventArgs {
	remainingSeconds: number;
}

export interface TimerChangedEventArgs {
	timerSeconds: number;
}