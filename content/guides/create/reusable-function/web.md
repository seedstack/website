---
title: "Web"
type: "home"
zones:
    - "Guides"
sections:
    - "CreateFunctionGuide"
menu:
    CreateFunctionGuide:
        weight: 60
---

The Web module is only required by functions with UI, eg. the SEED i18n function. Functions don't always need UI, eg. the SEED IO function.

Functions with UI must use the [SEED Business Framework](#!/business-doc) and [W20](#!/w20-doc). Their fragment must be auto discoverable by adding your w20 files in the `META-INF/resources/resources`. 

W20 recommendations:

  * Avoid absolute paths and hard-coded prefixes
  * Avoid specific styling to maximize compatibility between themes
  * Map security to UI (routes, graphical components, ...)

> IMPORTANT: the web module must not be package as WAR (so no WEB-INF and no web.xml) !
