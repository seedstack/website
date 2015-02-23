---
title: "Getting started"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedTest"
menu:
    SeedTest:
        weight: 20
---

The goal of this chapter is to create your first batch in order to make clear Spring Batch classes and
interfaces usage as clear as possible with a simple job example. This one step job will just print “My Simple Job”.

# Add Maven dependencies

This example requires `seed-business-function-core`:

 		<dependency>
            <groupId>org.seedstack.seed</groupId>
            <artifactId>seed-batch-support-springbatch2</artifactId>
        </dependency>
        <dependency>
           <groupId>org.seedstack</groupId>
           <artifactId>seed-business-function-core</artifactId>
       </dependency>


# Create the application context

We need to set up a Spring Batch environment. Spring files have to be in **resources/META-INF/spring** directory.

application-context.xml:

```
<beans xmlns="http://www.springframework.org/schema/beans"
	   xmlns:batch="http://www.springframework.org/schema/batch"
	   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	   xmlns:seed="http://seed.inetpsa.com/schema/spring-support"
	   xsi:schemaLocation="http://www.springframework.org/schema/batch
		http://www.springframework.org/schema/batch/spring-batch-2.2.xsd
		http://www.springframework.org/schema/beans
		http://www.springframework.org/schema/beans/spring-beans-3.2.xsd
		http://seed.inetpsa.com/schema/spring-support
	    http://seed.inetpsa.com/schema/spring-support-1.0.xsd">
 
	<bean id="jobRepository" class="org.springframework.batch.core.repository.support.MapJobRepositoryFactoryBean">
		<property name="transactionManager" ref="transactionManager" />
	</bean>

	<bean id="transactionManager" class="org.springframework.batch.support.transaction.ResourcelessTransactionManager" />

	<bean id="jobLauncher" class="org.springframework.batch.core.launch.support.SimpleJobLauncher">
		<property name="jobRepository" ref="jobRepository" />
	</bean>
	
   </beans>
```

Description of the beans:

- `JobRepository` : responsible for persistence of batch meta-data information.
- `JobLauncher` : responsible for launching the batch job.
- `TransactionManager` : As this example won’t be dealing with transactional data, we are using `ResourcelessTransactionManager` which is mainly used for testing purpose.

# Create the service

Create a SEED-managed service to illustrate a SEED service injection inside a Spring bean with Interface :

    package com.inetpsa.seed.service;

    import com.inetpsa.seed.business.api.application.annotations.ApplicationService;

    @ApplicationService
    public interface MessageService {
        public String getMessage();
    }

and implementation :

    package com.inetpsa.seed.service.impl;

    import com.inetpsa.seed.service.MessageService;

    public class MessageServiceImpl implements MessageService {

        public String getMessage() {
            return "--- My Simple Job ----";
        }

    }

# Create the Tasklet

A tasklet is a Class containing custom logic to be ran as a part of a job. `PrintTasklet` is our custom tasklet which
implements `Tasklet` interface and overrides the `execute()` method which prints the message from `MessageService`.

```
package com.inetpsa.seed.batch.tasklet;

import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;

import com.inetpsa.seed.service.MessageService;

public class PrintTasklet implements Tasklet {

    private MessageService messageService;
	private Logger logger = LoggerFactory.getLogger(PrintTasklet.class);

	public RepeatStatus execute(StepContribution contribution,
			ChunkContext chunkContext) throws Exception {
		logger.info(messageService.getMessage());
		return RepeatStatus.FINISHED;
	}

	public MessageService getMessageService() {
		return messageService;
	}

	public void setMessageService(MessageService messageService) {
		this.messageService = messageService;
	}
	
}
```

# Define the job Configuration

In this section we will configure the Spring Batch job context to use our Tasklet and inject SEED managed `MessageService`.

job-context.xml
```
<beans xmlns="http://www.springframework.org/schema/beans"
	   xmlns:batch="http://www.springframework.org/schema/batch"
	   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	   xmlns:seed="http://seed.inetpsa.com/schema/spring-support"
	   xsi:schemaLocation="http://www.springframework.org/schema/batch
		http://www.springframework.org/schema/batch/spring-batch-2.2.xsd
		http://www.springframework.org/schema/beans
		http://www.springframework.org/schema/beans/spring-beans-3.2.xsd
		http://seed.inetpsa.com/schema/spring-support
	    http://seed.inetpsa.com/schema/spring-support-1.0.xsd">
 
  <import resource="application-context.xml"/>
 
  <batch:job id="mySimpleJob">

        <batch:step id="printStep" >
			<batch:tasklet>
				<bean class="com.inetpsa.seed.batch.tasklet.PrintTasklet">
				<property name="messageService">
					<seed:instance class="com.inetpsa.seed.service.MessageService"/>
				</property>
			</bean>
			</batch:tasklet>
		</batch:step>

	</batch:job>

   </beans>
```

Above example illustrates the basic structure of a job. A job (`<batch:jobProperty>` tag) is made of steps (`<batch:step>` tag) 
with a Tasklet (`<batch:tasklet>` tag) and related beans to be injected. Steps are executed one by one following their declarative order. 
More detail on [Spring Batch documentation](http://docs.spring.io/spring-batch/reference/html/index.html).