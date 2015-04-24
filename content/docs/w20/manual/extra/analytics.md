---
title: "Analytics"
type: "manual"
zones:
    - "W20"
sections:
    - "W20Extra"
menu:
    W20Extra:
        weight: 20
---

Analytical tools allow statistical reporting and data analysis for your web applications:

- Counting and tracking visitor's actions
- Statistics on page viewed
- Keyword searched
- E-commerce specific report
- Setting cookies for tracking visit
- Displaying comprehensive and detailed reports

Analytics providers generally requires a script inclusion in all web pages to track user actions based on the URL. However, in SPA, since the routing is done
at the front end, this integration is a bit more tricky. W20 uses [Angulartics](http://luisfarzati.github.io/angulartics/) internally to provide an easy 
integration of a wide range of providers.

# Fragment configuration

Include the **extra** fragment configuration in your fragment manifest. Proceed by including the **analytics** module.

## Analytics module configuration

- **provider (string)**: The name of the analytic provider to use. Supported providers are given below:

<div class="table-responsive">
    <table class="table table-bordered table-striped">
      <colgroup>
        <col class="col-xs-1">
        <col class="col-xs-7">
      </colgroup>
      <thead>
        <tr>
          <th>Class</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">
            <code>'adobe'</code>
          </th>
          <td> Adobe analytics</td>
        </tr>
        <tr>
          <th scope="row">
            <code>'chartbeat'</code>
          </th>
          <td>Chartbeat analytics  </td>
        </tr>
        <tr>
          <th scope="row">
            <code>'flurry'</code>
          </th>
          <td>Flurry analytics </td>
        </tr>
        <tr>
          <th scope="row">
            <code>'ga'</code>
          </th>
          <td>Google Analytics</td>
        </tr>
        <tr>
          <th scope="row">
            <code>'ga-cordova'</code>
          </th>
          <td> Google Analytics for Cordova</td>
        </tr>
        <tr>
          <th scope="row">
            <code>'gtm'</code>
          </th>
          <td> Google Tag Manager </td>
        </tr>
        <tr>
          <th scope="row">
            <code>'kissmetrics' </code>
          </th>
          <td> Kissmetrics </td>
        </tr>
        <tr>
          <th scope="row">
            <code>'mixpanel'</code>
          </th>
          <td> Mix Panel analytics </td>
        </tr>
        <tr>
          <th scope="row">
            <code>'piwik'</code>
          </th>
          <td> Piwik analytics </td>
        </tr>
        <tr>
          <th scope="row">
            <code>'segmentio'</code>
          </th>
          <td> Segment.io analytics </td>
        </tr>
        <tr>
          <th scope="row">
            <code>'splunk'</code>
          </th>
          <td> Splunk </td>
        </tr>
        <tr>
          <th scope="row">
            <code>'woopra'</code>
          </th>
          <td> Woopra </td>
        </tr>
      </tbody>
    </table>
  </div>
  
- **virtualPageViews (boolean)**: By default automatic virtual page view tracking is enabled, meaning the entire user navigation across the different routes
 of your application is tracked. You can turn it off with this property.

- **settings (object)**: If the chosen provider has a supported default configuration in W20, you can use this property to configure it.

## Default configuration

The following providers have a default configuration in W20.

### Piwik

After deploying your Piwik server, you are provided with a site id for your registered website. Set it to the `siteId` property and paste the URL to the
javascript tracker (piwik.js) into the `jsUrl` property and your Piwik PHP server address into the `trackerUrl` property. 

```
    "path/to/extra/w20-extra.w20.json": {
        "modules": {
            "analytics": {
                "provider": "piwik",
                "virtualPageViews": true,
                "settings": {
                    "jsUrl": "url/or/path/to/piwik/javascript/tracker",
                    "trackerUrl": "url/to/piwik/javascript/tracker",
                    "siteId": 1
                }
            }
        }
    }
```

Your website visits should be monitored by Piwik. The `trackPageView` and `enableLinkTracking` options of Piwik are already applied.
An angular service `PiwikService` can now be injected to configure Piwik. This service provide the following methods:

- `getAPI()`: return the [Piwik](http://developer.piwik.org/api-reference/tracking-javascript) object 
- `configure(settings)`: Called initially to configure the provider with the `settings` property configured in the manifest. It can be called programatically to 
   change these settings later.
   