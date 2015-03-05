---
title: "Testing"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedMail"
tags:
    - "mail"
    - "test"
    - "maven"
menu:
    SeedMail:
        weight: 30
---

Mail support provides testing fixtures which enable to emulate an SMTP server and easily assert that your sent mails
are valid. To use this support use the following dependency snippet:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-mail-support-test</artifactId>
        <scope>test</scope>
    </dependency>
    
You can then use the `@WithMailServer` annotation and the `MessageRetriever` in your tests:

    @WithMailServer(host = "localhost", port = 6457)
    public class SmtpIT extends AbstractSeedIT {
        @Inject
        @Named("smtp-test")
        Session smtpSession;
    
        @Inject
        MessageRetriever retriever;
    
        @Test
        public void test_send() throws MessagingException {
            Transport transport = null;
            try {
                Message message = new MimeMessage(smtpSession);
                message.setRecipient(Message.RecipientType.TO, new InternetAddress("..."));
                message.setFrom(new InternetAddress("..."));
                message.setSubject("...");
                message.setText("...");
                message.setSentDate(new Date());

                transport = smtpSession.getTransport();
                transport.connect();
                transport.sendMessage(message, message.getAllRecipients());
            } finally {
                if (transport != null) {
                    transport.close();
                }
            }
            
            for (Message message : retriever.getSentMessages()) {
                MockMailServerAssertions.assertThat(message).hasRecipients(Message.RecipientType.TO);
                MockMailServerAssertions.assertThat(message).recipientEqualsTo(Message.RecipientType.TO, InternetAddress.parse(TestConstantsValues.DEFAULT_RECIPIENT));
            }
        }
    }

The following configuration is needed to define the `smtp-test` session to the corresponding mock mail server:

    [com.inetpsa.seed]
    mail.providers= smtp-test
    
    [com.inetpsa.seed.mail.provider.smtp-test.property]
    mail.transport.protocol = smtp
    mail.smtp.host = localhost
    mail.smtp.port = 6457
