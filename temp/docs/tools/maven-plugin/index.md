---
title: "Maven plugin"
type: "home"
zones:
    - "Tools"
sections:
    - "ToolsMavenPlugin"
tags:
    - "maven"
    - "plugin"
menu:
    ToolsMavenPlugin:
        weight: 10
---

The SeedStack Maven plugin provides goals to manage SeedStack-based artifacts. To invoke the plugin, use the following 
command line:

    mvn org.seedstack:seedstack-maven-plugin:<goal>

{{% callout info %}}
**Tip:** If you add (or already have) the groupId `org.seedstack` in the `<pluginGroups>` list of 
your maven `settings.xml` file, you can use a shorter command:
 
    mvn seedstack:<goal>
                
More information about Maven plugin prefix mapping [here](http://maven.apache.org/guides/introduction/introduction-to-plugin-prefix-mapping.html).        
{{% /callout %}}
