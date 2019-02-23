# Dojo Tools

It's a vscode extension which contains a set of tools to be used in coding dojos.

## Features

* Timer
* Test Watcher
* Visual changes depending on whether tests have passed or not

-----------------------------------------------------------------------------------------------------------

## Get Started

Add the following lines in your `.vscode/settings.json`:
```
"cristiandean.dojotools": {
		"commands": [
			{
				"notMatch": "ignored_file\\.py",
				"match": ".*\\.py",
				"cmd": "make test"
			}
		]
	},
```


## Actions
	*Dojo Tools: Enable All* - "extension.cristiandean.enableDojoTools"
	*Dojo Tools: Disable All* - "extension.cristiandean.disableDojoTools"
	*Dojo Tools: Enable Watcher* - "extension.cristiandean.enableWatcher"
	*Dojo Tools: Enable Timer* - "extension.cristiandean.enableTimer"
	*Dojo Tools: Disable Watcher* - "extension.cristiandean.disableWatcher"
	*Dojo Tools: Disable Timer* - "extension.cristiandean.disableTimer"
	*Dojo Tools: Timer Action* - "extension.cristiandean.timerAction"
	*Dojo Tools: Timer Reset* - "extension.cristiandean.timerReset"
	*Dojo Tools: Set Timer* - "extension.cristiandean.setTimer"


**Enjoy!**
