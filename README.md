# SeedStack website 
[![Build status](https://travis-ci.org/seedstack/website.svg?branch=master)](https://travis-ci.org/seedstack/website)

This repository contains the sources of the SeedStack website. The site is hosted at 

* [http://seedstack.org](http://seedstack.org/) for the stable channel. 
* [http://beta.seedstack.org](http://beta.seedstack.org/) for the stable channel. 
* [http://dev.seedstack.org](http://dev.seedstack.org/) for the stable channel. 

# Usage

After clone, you must initialize all the submodules:

    git submodule update --remote --recursive --init && git submodule foreach --recursive git checkout master

This Website is built with [Hugo](http://gohugo.io/). If you have Hugo in your path you can serve it locally:

    hugo server
    
Add the `-w` flag to automatically watch the changes in content and refresh the displayed page(s) accordingly.

# Publication

The generated Website is automatically published on the corresponding channel repository after each change:

* A change on the `master` branch publishes to the [seedstack.github.io](https://github.com/seedstack/seedstack.github.io) repository. 
* A change on the `beta` branch publishes to the [beta](https://github.com/seedstack/beta) repository. 
* A change on the `dev` branch publishes to the [dev](https://github.com/seedstack/dev) repository. 

# License

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />This work by <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">the SeedStack authors</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
