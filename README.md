<p align="middle" ><img src="./demo/images/logo.png" width="100%" style="max-width: 320px"/></p>

<h2 align="middle">Scene.js Timeline Editor</h2>
<p align="middle"><a href="https://www.npmjs.com/package/@scenejs/timeline" target="_blank"><img src="https://img.shields.io/npm/v/@scenejs/timeline.svg?style=flat-square&color=007acc&label=version" alt="npm version" /></a> <img src="https://img.shields.io/badge/language-typescript-blue.svg?style=flat-square"/> <a href="https://github.com/daybrush/scenejs-timeline/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/github/license/daybrush/scenejs-timeline.svg?style=flat-square&label=license&color=08CE5D"/></a>
 <a href="https://github.com/daybrush/scenejs-timeline/tree/master/packages/react-scenejs-timeline/README.md" target="_blank"><img alt="React" src="https://img.shields.io/static/v1.svg?label=&message=React&style=flat-square&color=61dafb"></a>
 <a href="https://github.com/daybrush/scenejs-timeline/tree/master/packages/preact-timeline/README.md" target="_blank"><img alt="React" src="https://img.shields.io/static/v1.svg?label=&message=Preact&style=flat-square&color=673ab8"></a>
</p>

<p align="middle"><strong>@scenejs/timeline</strong> is a component that represents the timeline of <a href="https://github.com/daybrush/scenejs"><strong>Scene.js</strong></a><br/>You can control time, properties, and items.</p>

<p align="middle"><a href="https://github.com/daybrush/scenejs"><strong>Scene.js</strong></a> &nbsp;/&nbsp; <a href="https://daybrush.com/scenejs/features.html#timeline"><strong>Example</strong></a></p>


<p align="middle" ><img src="./demo/images/timeline.png" width="100%" style="max-width: 800px"/></p>




## ⚙️ Installation
```sh
$ npm i @scenejs/timeline
```

```html
<script src="https://daybrush.com/scenejs-timeline/release/latest/dist/timeline.pkgd.min.js"></script>
```


## 🚀 How to use
```ts
import Scene from "scenejs";
import Timeline, { SelectEvent } from "@scenejs/timeline";

const scene = new Scene({
    ...
});

const timeline = new Timeline(scene, document.body, {
    keyboard: true,
});

timeline.on("select", (e: SelectEvent) => {
    console.log(e.selectedItem);
});
```

## 📦 Packages
* [**react-scenejs-timeline**](https://github.com/daybrush/scenejs-timeline/tree/master/packages/react-scenejs-timeline): A React Component that control scene.js timeline.
* [**preact-timeline**](https://github.com/daybrush/scenejs-timeline/tree/master/packages/preact-timeline): A Preact Component that control scene.js timeline.


## ⭐️ Show Your Support
Please give a ⭐️ if this project helped you!

## 👏 Contributing

If you have any questions or requests or want to contribute to `scenejs-timeline` or other packages, please write the [issue](https://github.com/daybrush/scenejs-timeline/issues) or give me a Pull Request freely.

## 🐞 Bug Report

If you find a bug, please report to us opening a new [Issue](https://github.com/daybrush/scenejs-timeline/issues) on GitHub.


## 📝 License

This project is [MIT](https://github.com/daybrush/scenejs-timeline/blob/master/LICENSE) licensed.

```
MIT License

Copyright (c) 2016 Daybrush

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
