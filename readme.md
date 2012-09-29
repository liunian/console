Console for IE6
===============

因 IE6 没有集成 JavaScript debug 工具，只能 alert 输出，太痛苦了，故折腾这个工具出来，以使用 `console.log`。


Usage
-----

1. 下载 css、js 和 png 文件（png背景图片应和css同目录）
2. 在使用 `console.log` 前把 `console.min.js` 或 `console.js` 载进去（建议紧跟着 `<body>` 标签）
3. js 中使用 `console.log(arg1, arg2, ...)` 语句来输出

在 Chrome、FF 等内置 console 等的情况下，将会使用内置的而不会多此一举。


Todo
----

1. Error detail

    Means the source filename and line number.

2. minimize/toggle

    Minimize to an icon and recover the console-panel.

    Explore hide and show methods and implement with keyboard shortcut.

3. demo screenshot
