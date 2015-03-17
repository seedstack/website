---
title: "Generate empty project"
type: "home"
zones:
    - "Guides"
sections:
    - "CreateApplicationGuide"
menu:
    CreateApplicationGuide:
        weight: 20
---

Generate a scaffold project:

1. Go to your workspace and create a new directory for your project.

2. Open a terminal in your workspace folder and execute the following command:
  <br/> <pre>mvn3 com.inetpsa.fnd.tools:seed-maven-plugin:scaffold-project -DgroupId=com.inetpsa.tut -DartifactId=tut-app -Dtype=web -Dprd=prd</pre>
3. Import the projects in eclipse using the wizard maven => existing maven project

![import wizard]({dev-guide}/application/img/importWizard.jpg)

Your projects are now ready to be used in Eclipse !

![imported projects]({dev-guide}/application/img/importedProjects.jpg)
