---
title: "Storage"
guide: "Make a configurable application"
author: "SeedStack"
menu:
    ConfigurationGuide:
        weight: 50
---

Seed defines a default local directory that can be used by applications for persistent file storage without bothering
about its location. It helps keeping application files under one parent directory that can be reconfigured at will. The
contents of this directory depends on the enabled Seed supports (some supports are using this folder internally) and
of the application usage.

# Seed usage

## Shell support

If the shell support is configured to auto-generate an SSH key on first connection (as it is by default), it will store 
its auto-generated SSH key in the `shell` sub-directory of the application storage.

# Application usage

Applications can request a subdirectory inside the Seed storage directory for any purpose. It is the responsibility
of the application to manage this subdirectory and its contents. 

# Location

Default location of the Seed storage directory is in the home directory of the user used to start the application:

    (home)
        |-.seed
            |-appId         <-- this directory is named after the application identifier
 
 
This is a quite usual location in UNIX and Windows systems and is adequate for light storage needs. To accommodate 
heavier needs or for any other reason, this location can be changed to any local directory by setting the 
`org.seedstack.seed.core.storage` configuration property:	

	[org.seedstack.seed]
	core.application-id = prd00
	core.storage= /users/prd00/data/seed
	
	
{{% callout info %}}
If you have multiple Seed applications running on the same server, be sure to have set a unique identifier for each. It
will avoid any storage directory collision if you uses the default location. If you specify the location manually be
sure to specify a different location for each application (storage directories cannot be shared between Seed instances).
In all cases, each application MUST have a different identifier.
{{% /callout %}}

{{% callout info %}}
Note that this value can be externalised as any configuration value (see [this page](../props) 
for more details).
{{% /callout %}}
