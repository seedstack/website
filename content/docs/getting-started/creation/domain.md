---
title: "Create a reusable domain"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedCreation"
menu:
    GettingStartedCreation:
        weight: 40
---

If you are using the [business framework](/docs/business) you can choose to write your domain in its own module for 
reuse and modularity purposes. In that case, each domain (e.g. each business context) should go in its own project.

# Creation

...

# Result

If the creation process is successful, you should see a unique module like the following:

```plain
- mydomain-domain

    Contains a domain layer on its own. No application logic nor any infrastructure 
    should be placed here.
```
