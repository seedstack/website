---
title: "User interface"
type: "addon"
zones:
    - "Addons"
sections:
    - "AddonsFunctions"
subsections:
    - "Batch monitoring"
menu:
    AddonsFunctionsBatchMonitoring:
        weight: 30
---

# Introduction

By default, all views are loaded at once with current available data. The "Update" button allows to force a refresh data every 5 seconds when clicked (red).   

# Jobs detail

The "Jobs detail" view allows a user to inspect jobs that are known to the system (ie. monitoring data in same DB tables set):
![Jobs](/img/addons/functions/batch-monitoring/jobsDetails.png)

# Job executions detail

The "Job executions detail" view shows all jobs executions ordered by date (descending order) and a brief summary of their status (*STARTED, COMPLETED, FAILED*, etc.).

![Executions](/img/addons/functions/batch-monitoring/jobExecutions.png)

# Steps detail

The "Steps detail" view offers two kinds of feedback:

- global feedback : A list of all steps and their average time consumption (ms) across all past job executions as a bar chart. this provides a statistical feel of global performance characteristics.
	 
> For example, a developer running a job in an integration test environment might use the statistics here to compare different configurations of a job in order to optimize those (eg. commit interval in an item processing step).

- steps feedback : Upon selection of a step in the list (first step selected by default), the bottom part of the screen gives detail on this step with a progression bar and figures about read/write/commit/rollback. For more details, this section also provides **View full detail** and **View history** buttons. Corresponding views are described below.   

![Steps](/img/addons/functions/batch-monitoring/stepsDetails.png)

# Step full detail

 The "Step detail" view has the detailed meta-data for the step (status, read count, write count, commit count, skip count, etc.) as well as an extract of the stacktrace from any exception that caused a failure of the step (**statusExitDescription** value).

![Step details](/img/addons/functions/batch-monitoring/stepDetails.png)

# Step history

The "Step histoy" view shows the history of the execution of this step across all job executions (eg. max, min and average of commit/rollback/read/write counts...).

![Step history](/img/addons/functions/batch-monitoring/history.png)
