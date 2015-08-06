---
title: "Introduction"
type: "guide"
zones:
    - "Guides"
sections:
    - "GuidesTasks"
subsections:
    - "Create a Web application"
menu:
    CreateApplicationGuide:
        weight: 10
---

Welcome to the SEED tutorial ! You will learn how to build a full SEED application from scratch. It includes:

* Project creation,
* Configuration,
* Business domain coding,
* JPA persistence,
* Web UI,
* Security,
* Testing.

# Project creation

To scaffold a new project:

1. Go to your workspace and create a new directory for your project.
2. Open a terminal in your workspace folder and execute the following command:
  <br/> <pre>mvn org.seedstack.tools:seed-maven-plugin:scaffold-project -Dtype=web</pre>
3. Answer to the questions: you may use any group id, artifact id and version you want.
4. Import the created project in you favorite IDE.