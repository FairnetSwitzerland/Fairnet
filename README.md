Fairnet extension for Chrome
=================================
Fairnet is a new way to block advertisers and replacing by those that you want to support. You can disable the advertisers blocking lists and replacment rules on settings.

Fairnet extension for Chrome is a fork for the Adblock Plus project, it has similar functionalities but it has a different purpose at the end. This repository contains the source code, under GPL 3.0, from the Fairnet Google Chrome Plugin, check the see the LICENSE file for more information

# Why use Fairnet
Fairnet plugin is an open source and free software that let you block advertisers and replace by those you want to support. 

# How to use
You can download the plugin from Google Chrome Store. Just install and it's ready to go, you can check for statistics and manage everything, try it, it's easy!

# How to contribute
There are some ways to do that, instead of writing a big text there, we will put bellow some URL's that will help you with that:

* [Rob Allen's Guide to Contribute on GitHub](https://akrabat.com/the-beginners-guide-to-contributing-to-a-github-project/)
* [Matt Stauffer's Guide to Contribute on GitHub](https://mattstauffer.co/blog/how-to-contribute-to-an-open-source-github-project-using-your-own-fork)

# How to execute the plugin on development mode
In order to test the plugin in an especific branch you can clone or download the code. After that, open Google Chrome and access the Extension page writing "chrome://extensions/", Click the “Developer mode” checkbox to activate it, and then click the “Load unpacked extension” button. Navigate to the extension’s directory and select the subfolder Fairnet\build\dev.

You can do this with the existing version of Chrome you have. However, Chrome will remind you you’re using such an unpacked extension every time you launch it. This message is designed to prevent developer mode from being used for malware.

Alternatively, you can download only the versions already compiled in .crx files inside the build folder.
To install it, simply drag the file to your browser window.

# Development
## Requirements
* [git](https://git-scm.com) - To clone this repository.
* [Nodejs](https://nodejs.org/en/download/) - A JS runtime that contains npm, the largest ecosystem of open source libraries in the world.
* [Webpack](https://github.com/webpack/webpack) - Packs many modules into a few bundled assets.

## Installation:

1- Install NodeJs

2- Clone this repository:

    git clone git@github.com:FairnetSwitzerland/Fairnet.git Fairnet
    
3- Change the current directory and install the dependencies:

    cd Fairnet
    npm install

4- Make sure you have the private key 'mykey.pem' on your repository. That file is available to admins only and it is used to generate production versions.

## Build instructions:

Start a developing session (with watch), run:

    npm start

To start a unit testing session (with watch):

    npm test

To check code for linting errors:

    npm run lint

To build production code + crx:

    npm run build

To run unit tests in CI scripts:

    npm run test:ci
	
## Directory structure:

    /build             # This is where the extension (.crx) will end up
    /src               # Source code directory
        /css           # CSS files
        /html          # HTML files
        /images        # Image resources
        /js            # Entry-points for browserify, requiring node.js `modules`
            /libs      # 3rd party run-time libraries, excluded from JS-linting
            /modules   # Node.js modules
        manifest.json  # Manifest file   
    /webpack           # Webpack configuration files
    .babelrc           # Babel configuration
    .eslintrc          # Options for JS-linting
    circle.yml         # Integration with CircleCI
    mykey.pem          # Certificate file
    package.json       # Project description file

	
# Under the hood
This project is an improved version of other open source ideas:

* [Skeleton for Google Chrome extensions](https://github.com/salsita/chrome-extension-skeleton) - A good start point for a new chrome extension.
* [Ad Block Plus](https://github.com/adblockplus/adblockpluschrome) - An extension that helps users block ads.
* [EasyList](https://easylist.to/) -  Removes most adverts from international web pages, including unwanted frames, images, and objects. It is the most popular list used by many ad blockers and forms the basis of over a dozen combination and supplementary filter lists.
* [Developer Guide for Google Chrome Plugin](https://developer.chrome.com/extensions/faq) - A important resource if you planto develop chrome extensions.

# License
Copyright 2017-2018 Fairnet.

Fairnet Plugin is free and open source software, excluding the brand features and third-party portions of the program identified in the Exceptions below: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
