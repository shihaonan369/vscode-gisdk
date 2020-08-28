# vscode-gisdk README

This is an extension for gisdk which is a language designed by Calliper.

## Features

- Compile .rsc, .model, .lst, .scenarios files.
- Show compile perblems.

## Requirements

Please provide your rscc compiler by creating a rscc task and set compilerPath to location of compiler if you have not install any of softwares from Caliper.

## Extension Settings


## Known Issues

- The compiler quick pick is not auto focus on current compiler now.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

1. Provide a compiler selection bar.
2. Provide a built-in task to compiler active file.
3. Provide a rscc task type allow you to custom your build.

### 1.0.1

1. Fix a bug that cause task warning if there's no gisdk file opend.

### 1.0.2
1. Fix a bug which is powershell build failure.

-----------------------------------------------------------------------------------------------------------

## Working with GISDK

* Select Compiler: Click GISDK(...) on statu bar.
* Compile This File: Active a supported file suck as .rsc, `CTRL + SHIFT + P` then select `Tasks: Run Task` -> rscc -> rscc: compile this file.
* Custom Compile:
    ```
    // tasks.json
    {
        // See https://go.microsoft.com/fwlink/?LinkId=733558
        // for the documentation about the tasks.json format
        "version": "2.0.0",
        "tasks": [
            {
                "type": "rscc",
                "group": "build",
                "label": "compile",
                "args": [
                    "-c",
                    "-u",
                    "output/test.dbd",
                    "src/test.lst"
                ]
            }
        ]
    }
    ```


### For more information

* [GISDK Online Help](https://www.caliper.com/)

**Enjoy!**
