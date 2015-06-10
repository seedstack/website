---
title: "Scheduling overview"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedScheduling"
tags:
    - "scheduling"
    - "api"
    - "example"
menu:
    SeedScheduling:
        weight: 10
---

Scheduling support provides a simple API to schedule task in SEED. To add the scheduling support in your project, use
the following dependency snippet:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-scheduling-support</artifactId>
    </dependency>

# Declarative API

Create a `Class` implementing `Task` and add a `@Scheduled` annotation with a cron expression.<br>
Your task will be detected and scheduled according to the annotation content at SEED startup:

    @Scheduled("0/2 * * * * ?")
    public class MyTask implements Task {

        @Override
        public void execute() throws Exception {
            return calculateSomething();
        }
    }

As shown in above snippet, the default "value" attribute of `@Scheduled` is used for cron expression. <br>
If any other attribute is required, the annotation becomes for instance :
	
	@Scheduled(value = "0/2 * * * * ?", taskName = "TASK1", exceptionPolicy = UNSCHEDULE_ALL_TRIGGERS)

`exceptionPolicy` defines the behaviour on `Task`'s exception. Refer to `@Scheduled` JavaDoc for all its attributes. 

# Programmatic API
Inject a `ScheduledTaskBuilderFactory` and programmatically define a scheduled task (not necessarily at application startup) with following DSL:

## Cron expression

    @Inject
    private ScheduledTaskBuilderFactory factory;
    ...
    ScheduledTaskBuilder scheduledTaskBuilder = factory
													.createScheduledTaskBuilder(MyTask.class)
													.withCronExpression("0/2 * * * * ?");
	scheduledTaskBuilder.schedule();	
    
Note: Above cron expression implicitly defines a `Trigger`.

## With a Trigger

When a cron expression can not define the expected triggering conditions, a (Quartz) `Trigger` can be defined.

For example:

    @Inject
    private ScheduledTaskBuilderFactory factory;
    ...
    
    Trigger trigger = TriggerBuilder
		.newTrigger()
		.withIdentity(TriggerKey.triggerKey("myTrigger", "myTriggerGroup"))
		.withSchedule(SimpleScheduleBuilder.simpleSchedule()
            .withIntervalInSeconds(1)
            .repeatForever())
		.startAt(DateBuilder.futureDate(2,DateBuilder.IntervalUnit.SECOND))
		.build();
 	
 	ScheduledTaskBuilder scheduledTaskBuilder = factory
													.createScheduledTaskBuilder(MyTask.class)
													.withTrigger(trigger)
													.withPriority(10);
    scheduledTaskBuilder.schedule();



# Listeners
Create a `Class` implementing `TaskListener` in order to listen to the `Task` execution. The `Task` is binded to the `TaskListener` by declaring the
`Task` as the `Type` parameter:

    public class MyTaskListener implements TaskListener<MyTask> {
        @Logging
        private Logger logger;

        @Override
        public void before(SchedulingContext schedulingContext) {
            logger.info("Before MyTask");
        }

        @Override
        public void after(SchedulingContext schedulingContext) {
            logger.info("After MyTask");
        }

        @Override
        public void onException(SchedulingContext schedulingContext, Exception e) {
            logger.info("Something gets wrong", e);
			
			ScheduledTaskBuilder scheduledTaskBuilder = factory
												.createScheduledTaskBuilder(MyTask.class);
												
			scheduledTaskBuilder.unschedule(sc.getTriggerName());
        }
    }

## Recommendations

* **Keep Code In Listeners Concise And Efficient.** Performing large amounts of work is discouraged, as the thread that
would be executing the job (or completing the trigger and moving on to firing another job, etc.) will be tied up
within the listener.
* **Handle Exceptions.** Every listener method should contain a try-catch block that handles all possible exceptions. If
a listener throws an exception, it may cause other listeners not to be notified and/or prevent the execution of
the job, etc.