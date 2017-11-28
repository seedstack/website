---
title: "Tutorial"
type: "home"
zones:
    - "Docs"
tags:
    - domain-driven design
    - tutorial
menu:
    docs:
        parent: "business"
        weight: 2
---

This tutorial will guide you step-by-step in building a full application with SeedStack business framework.<!--more-->

To use it, the following dependency must be present in your POM:

{{< dependency g="org.seedstack.business" a="business-core" >}}

## The domain: software project management

For the sake of the tutorial, let's pretend that we have to solve the problem of managing software projects.

* Projects are created 
* A project is picked according to some business criteria,
* A project is assigned a project manager,
* The project manager organizes the team,
* The project manager organizes the sprints. 

## Step 1: the domain model

We are not going into the details of how to elaborate a great domain model because it needs business insight and an
iterative process. Here is a simplistic model for this domain:

![Domain model](../img/domain-model.png)

In this model we can note that:

* Object state can only be changed through business-meaningful methods.
* Immutable [value objects]({{< ref "docs/business/value-objects.md" >}}) (in violet) are extensively used,
* Those value objects and [entities]({{< ref "docs/business/entities.md" >}}) are grouped into 
[aggregates]({{< ref "docs/business/aggregates.md" >}}) that share a common lifecycle. 
* A [domain event]({{< ref "docs/business/domain-events.md" >}}) (in green) is defined.

### The user aggregate

In the `domain.model` package, create a subpackage named `user`. Inside this package create a `UserType` enum:

```java
package org.generated.project.domain.model.user;

public enum UserType {
    EMPLOYEE,
    CONTRACTOR    
}
```

Then create the `UserId` value object:

```java
package org.generated.project.domain.model.user;

import org.seedstack.business.domain.BaseValueObject;

public class UserId extends BaseValueObject {
    private final UserType type; 
    private final String code;
    
    public UserId(UserType type, String code) {
        this.type = type;
        this.code = code;
    }
    
    public String asString() {
        return (type == UserType.EMPLOYEE ? "E" : "C") + code;
    }
}
```

And finish the aggregate with the `User` aggregate root:

```java
package org.generated.project.domain.model.project;

import org.seedstack.business.domain.BaseAggregateRoot;

public class User extends BaseAggregateRoot<UserId> {
    private final UserId id;
    private final String firstName;
    private final String lastName;
    
    public User(UserId id, String firstName, String lastName) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
}
```

### The project aggregate

In the `domain.model` package, create a subpackage named `project`. Inside this package create a `ProjectId` value object:

```java
package org.generated.project.domain.model.project;

import org.seedstack.business.domain.BaseValueObject;

public class ProjectId extends BaseValueObject {
    private final String code;
    
    public ProjectId(String code) {
        this.code = code;
    }
    
    public String getCode() {
        return this.code;
    }
}
```

Then create the `Task` entity:

```java
package org.generated.project.domain.model.project;

import org.seedstack.business.domain.BaseEntity;

public class Task extends BaseEntity<Integer> {
    private final Integer id;
    private final String title;
    private boolean completed;

    public Task(int id, String title) {
        this.id = id;
        this.title = title;
    }

    public boolean isCompleted() {
        return this.completed;
    }

    void markCompleted() {
        this.completed = true;
    }
}
```

Now, let's create the `ProjectCompleted` domain event:

```java
package org.generated.project.domain.model.project;

import org.seedstack.business.domain.BaseDomainEvent;

public class ProjectCompleted extends BaseDomainEvent {
    private final ProjectId projectId;
    private final int taskCount;

    public ProjectCompleted(ProjectId projectId, int taskCount) {
        this.projectId = projectId;
        this.taskCount = taskCount;
    }

    public ProjectId getProjectId() {
        return projectId;
    }

    public int getTaskCount() {
        return taskCount;
    }
}
```

And finish the aggregate with the `Project` aggregate root:

```java
package org.generated.project.domain.model.project;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import org.generated.project.domain.model.user.UserId;
import org.seedstack.business.domain.BaseAggregateRoot;

public class Project extends BaseAggregateRoot<ProjectId> {
    private final ProjectId id;
    private UserId managerId;
    private Set<UserId> members = new HashSet<>();
    private Map<Integer, Task> tasks = new HashMap<>();
    private int maxTaskId = 0;

    public Project(ProjectId id) {
        this.id = id;
    }

    public void addMember(UserId memberId) {
        members.add(memberId);
    }

    public UserId getManager() {
        return managerId;
    }

    public void changeManager(UserId managerId) {
        // We ensure that the manager is always a member of the project
        if (!members.contains(managerId)) {
            members.add(managerId);
        }
        this.managerId = managerId;
    }

    public Task createTask(String title) {
        // This factory method generate an identity for the new task
        Task task = new Task(++maxTaskId, title);
        tasks.put(task.getId(), task);
        return task;
    }

    public Optional<ProjectCompleted> completeTask(int taskId) {
        Task task = tasks.get(taskId);
        if (task == null) {
            throw new IllegalArgumentException("Unable to find task number " + taskId);
        }
        // The package-private method is not accessible outside the aggregate
        task.markCompleted();
        if (tasks.values().stream().allMatch(Task::isCompleted)) {
            return Optional.of(new ProjectCompleted(id, tasks.size()));
        } else {
            return Optional.empty();
        }
    }
}

```
