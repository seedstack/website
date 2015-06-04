---
title: "Add security"
type: "guide"
zones:
    - "Guides"
sections:
    - "CreateGuides"
subsections:
    - "Web application"
menu:
    CreateApplicationGuide:
        weight: 70
---

Now we can add security to our application. Here we will use the configuration-based security realm but this can be
changed to an LDAP realm or any other realm.

In the props configuration, add the following:

    [org.seedstack.seed.security]
    realms = ConfigurationRealm
    
    [org.seedstack.seed.security.users]
    admin = password
    
    [org.seedstack.seed.security.urls]
    /** = authcBasic

{{% callout info %}}
All URLs (matching `/**` pattern) will be handled with basic authentication using the configuration-based security realm. 
{{% /callout %}}

Add any dependency required by realm. For more detail, refer to the [security documentation](/docs/seed/manual/security) 
and to the [web security documentation](/docs/seed/manual/web/security).

