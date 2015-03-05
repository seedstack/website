---
title: "Exception handling"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedScheduling"
tags:
    - "scheduling"
    - "error"
    - "example"
menu:
    SeedScheduling:
        weight: 20
---

When exception occurs during the task execution, you can choose to unschedule the Task or refire it immediately. You just
have add an ExceptionPolicy to the Scheduled annotation.

    @Scheduled(value = "0/2 * * * * ?", exceptionPolicy = UNSCHEDULE_ALL_TRIGGERS)

ExceptionPolicy can take the following values:

- `REFIRE_IMMEDIATELY`: Immediately re-execute the task. This option **SHOULD BE USED VERY CAREFULLY** as the `Task` will be fired indefinitely until successfull or the application crashes.

- `UNSCHEDULE_FIRING_TRIGGER`: Unschedule the `Trigger` firing the `Task`. This option is convenient when a `Task` fails due
to a specific trigger.

- `UNSCHEDULE_ALL_TRIGGERS`: Unschedule all triggers associated to the `Task`.

- `NONE`: Do nothing. Default value.

You can also choose to handle exception by yourself with a TaskListener. It will be possible to use the
UNSCHEDULE_ALL_TRIGGERS option and then reschedule the Task

    public class MyTaskListener implements TaskListener<MyTask> {

        @Inject
        private ScheduledTaskBuilderFactory factory;

        ...

        @Override
        public void onException(SchedulingContext schedulingContext, Exception e) {
            logger.info("Something gets wrong");
            try {
                // Repair then reschedule
                ScheduledTaskBuilder scheduledTaskBuilder = factory.createScheduledTaskBuilder(TimedTask.class);
                scheduledTaskBuilder.reschedule(sc.getTriggerName());
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
        }
    }

Note : `Exception` handling in a `TaskListener` is called asynchronously in order to be sure to apply the `Task`'s exception policy. 
Be careful in your implementation as it is impossible to know whether the `Task`'s `exceptionPolicy` or `TaskListener`'s `onException()` method is called first.
