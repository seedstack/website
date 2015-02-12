---
title: "Auditing"
zones:
    - "Business"
sections:
    - "BusinessApplicationLayer"
menu:
    BusinessApplicationLayer:
        weight: 40
---


The SEED Business Audit provides the ability to trace who does what in your application.

# Maven dependencies

You can add the audit module of the seed business framework by adding the following dependency in you app project.

    <dependency>
        <groupId>org.seedstack.business</groupId>
        <artifactId>seed-business-audit</artifactId>
    </dependency>

If you want to use the audit writer provided by seed based on Logback, replace the dependency by the following 
(see chapter on LogbackTrailWriter).

    <dependency>
        <groupId>org.seedstack.business</groupId>
        <artifactId>seed-business-audit-logback</artifactId>
    </dependency>

# Concepts

The Audit allows you to trace somewhere (log file for example) each time a user executes a portion of code. You can 
record a message and get access to information like the date,  the connected user or the application concerned. 
</br>Following is the model of what is given to the object in charge of writing the audit:

![audit model]({business-doc}/images/audit-model.png)

 - AuditEvent: Main object passed to the trail writer. It contains the date of the audit and the accompanying message. 
 It also has the trail
 - Trail: A trail represents several events occurring in the same execution. All events of a trail have the same 
 Initiator and are requested on the same Host.
 - Initiator: Represents the user triggering the audit. It contains his id and his name as well has his Address.
 - Host: represents the application on which the audit is made. It contains the name and id of the application as 
 well as its address.
 - Address: Contains Network information if available: ip address and dns name.

# API

## The @Audited Annotation

You can mark a method with the annotation *@Audited* so the framework will automatically audit this the execution of 
the method:

    @Audited(
        messageBefore = "Doing critical work with parameter ${args[0]}...", 
        messageAfter = "Done critical work with result: ${result}", 
        messageOnException = "Error doing critical work !")
    public String doCriticalWork(String someString) {
        return "result: " + someString;
    }


There are 3 attributes you can define, the first being mandatory :

* **messageAfter**: the message to trace when the method has been executed. Can be an EL expression with properties 
"args" for the method arguments and "result" for the return. For example: 
`messageAfter = "the argument is \${args[0].someMethod()} and the result says \${result.say()}"`
* **messageBefore**: optionally, you can define a message to be traced just before executing the method. 
Can be an EL expression but only arguments are available.
* **messageOnException**: define a generic message when an unhandled exception occurs in the execution of the method. 
If a handler handles the exception, this message is ignored. Can be an EL expression, the exception is available via 
property "exception". For instance: `messageOnException = "kaboom : \${exception.getMessage()}"`

## AuditService
You can programmatically write a trail by injecting the AuditService. First create a new Trail that you can reuse later. 
It will be initialized automatically with the current Host and Initiator. Then trail as many messages as required with 
the given Trail.

    @Inject
    AuditService auditService
    ...
    
    Trail trail = auditService.createTrail();
    String message = "dummy"
    auditService.trail(message, trail);
    ...
    
## TrailWriter
A trail writer effectively writes each message and its trail (an AuditEvent). The framework brings a writer based on 
Logback that can write on a file, in the console... named LogbackTrailWriter

You can implement your own TrailWriter. For example :
    public class SysoutTrailWriter implements TrailWriter{
    
        public void writeEvent(AuditEvent auditEvent) {
            System.out.println(auditEvent.getDate() + " " + auditEvent.getMessage() 
                + " [" + auditEvent.getTrail().getInitiator().getId + "]");        
        }
    }
    
## TrailExceptionHandler
A TrailExceptionHandler is used in conjunction with the @Audited annotation. When the annotated method throws an exception, 
if a handler is able to handle the exception, it will create a String describing it, being the message that will be trailed. 
The framework brings an exception handler for AuthorizationException.
You can implement your own handler

    public void BusinessTrailExceptionHandler implements TrailExceptionHandler<MyBusinessException> {
    
        public String describeException(MyBusinessException e){
            return "My business description to trail";
        }
    }

# Configuration
Several things can be configured via the props file

## The TrailWriters
You can choose which TrailWriter(s) to use : fill in the property *org.seedstack.business.audit.writers* with the name
or simple name of the class of the TrailWriters to use.
This property is optional: if empty, no writer will be used.

## The TrailExceptionHandlers
You can choose which TrailExceptionHandler(s) to use : fill in the property `org.seedstack.business.audit.exceptionHandlers`
with the name or simple name of the class of the TrailExceptionHandler to use.
This property is optional: if empty, every TrailExceptionHandler found on the classpath will be used.

## The LogbackTrailWriter
If you choose to use the LogbackTrailWriter, you must fill the property `org.seedstack.business.audit.logPattern`.
It is the pattern that will be used when writing each message. It can be an EL expression, with the following properties available

 - event : the AuditEvent
 - trail : the trail. Could also be accessed via `event.getTrail()`
 - initiator : the initiator. Could also be accessed via `event.getTrail().getInitiator()`
 - host : the application host. Could also be accessed via `event.getTrail().getHost()`
 
Here is an example of pattern you could use:

    [org.seedstack.business.audit]
    logPattern = At ${event.getFormattedDate("yyyy/MM/dd HH:mm:ss.SSS")} user ${initiator.getName()} - ${initiator.getId()} requested application ${host.getName()} : ${event.getMessage()}
    
You must also configure logback to add the appender and logger in the file *logback.xml*

    <?xml version="1.0"?>
    <configuration>
      ...
      <appender name="AUDIT_APPENDER" class="ch.qos.logback.core.ConsoleAppender">
          <encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
            <layout class="org.seedstack.business.audit.infrastructure.logback.AuditLogbackLayout" />
          </encoder>
        </appender>
    
      <logger name="AUDIT_LOGGER" additivity="false">
        <appender-ref ref="AUDIT_APPENDER" />
      </logger>
      ...
    </configuration>
    
Note that you can choose any appender that holds an encoder (ConsoleAppender, FileAppender...) as long as you define 
the right layout class.