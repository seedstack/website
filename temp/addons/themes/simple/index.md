---
title: "Simple theme"
type: "addon"
zones:
    - "Addons"
sections:
    - "AddonsThemes"
subsections:
    - "Simple theme"
menu:
    AddonsThemesSimple:
        weight: 10
---

There are two ways of adding this theme to your application, depending how your W20 frontend is handled.

# Separate frontend

In the case of a separate frontend (not served from resource JARs), you need to add the `w20-simple-theme` to your 
`bower.json` file. Check for the latest release [here](https://github.com/seedstack/w20-simple-theme/releases).

# JAR-served frontend

If the frontend files are served from resource JARs, the W20 function packages this theme under the following artifact:
 
    <dependency>
        <groupId>org.seedstack.functions.w20</groupId>
        <artifactId>w20-function-web-simple-theme</artifactId>
    </dependency>

Simply add it to the Web module of your project.