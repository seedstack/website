---
title: "Quickstart"
type: "addon"
zones:
    - "Addons"
sections:
    - "AddonsFunctions"
addons:
    - "W20 bridge"
menu:
    AddonsFunctionsW20:
        weight: 20
---

# Quickstart

## From scratch

If you don't have any existing W20 frontend in your current application or if you start a new application from scratch, you just need to follow these steps:

* Be sure to have added the seed-w20-web dependency in the web module of your application. See the overview for the correct dependency.
* The function comes by default with the w20-core, w20-ui and w20-test fragments as dependencies and will detect and activate them automatically. If you want to add other fragments such as a graphic theme, please add them as a dependency of your web module, they will be detected and activated automatically.
* If you want to customize the W20 configuration with an explicit file, you need to name it `w20.app.json` and place it under the `META-INF/configuration` directoryof your application resources. Please see the configuration page of this documentation more details about the files content. 


## Coming from an existing W20 application


If you have an existing standalone W20 application, you need to take several steps to transform it into a SEED-managed W20 application:

* Be sure to have added the seed-w20-web dependency in the web module of your application. See the overview for the correct dependency.
* You need to remove your masterpage HTML file (probably named `index.html` in your docroot) as the W20 function will provide its own. See the configuration page of this documentation for more details about how to customize the masterpage.
* You need to move your `w20.app.json` file to the `META-INF/configuration` directory of you application resources. The function will merge its contents with its own managed configuration.
* Open your just moved `w20.app.json` file and make the following changes:
  * When a fragment is located under the `META-INF/resources` directory of your classpath, the W20 function will detect it automatically. You must therefore reference it by it's identifier instead of its url path in your configuration file. As an example, instead of referencing the `w20-core` fragment by `resources/w20-core/w20-core.w20.json`, you should just reference it by `w20-core`. The configuration body of the fragment itself doesn't need to be changed though (except when some aspects are managed by the function in case you should remove explicit configuration, see below).
  * When a fragment is included from another server (via absolute URL) or served from the docroot of your application, it cannot be detected and configured automatically by the function. You should therefore, leave it's reference as is (the URL pointing to the manifest JSON file).
  * Remove the `id` attribute from the `w20-core/application` module. It will be automatically set by the function (as the concatenation of the SEED application identifier and the instance identifier).
  * Any managed module left without configuration can be completely removed since it will be automatically loaded by the function.
  * Any managed fragment left without configuration can be completely removed since it will be automatically loaded by the function.


### Example

Starting from this W20 configuration file:

    {
        "resources/w20-core/w20-core.w20.json": {
            "modules": {
                "application": {
                    "id": "my-application"
                },
                
                "culture": {
                    "available": [ "en-US", "fr-FR" ],
                    "default": "fr-FR"
                },
            
                "security": {
                    "autologin": true
                }
            }
        },
    
        "resources/w20-ui/w20-ui.w20.json": {
            "modules": {
                "datetime": {},
                "grid": {},
                "menu": {
                    "autoClose": true
                }
            }
        },
        
        "resources/w20-simple-theme/w20-simple-theme.w20.json": {},
        
        "fragments/my-fragment.w20.json": {
            "modules": {
                "myModule": {}
            }
        },
        
        "http://third-party-server.com/third-party-fragment.w20.json": {}
    }
    
You ends with the following managed configuration file:

    {
        "w20-core": {
            "modules": {
                "security": {
                    "autologin": true
                }
            }
        },
    
        "w20-ui": {
            "modules": {
                "datetime": {},
                "grid": {},
                "menu": {
                    "autoClose": true
                }
            }
        },
        
        "fragments/my-fragment.w20.json": {
            "modules": {
                "myModule": {}
            }
        },
        
        "http://third-party-server.com/third-party-fragment.w20.json": {}
    }