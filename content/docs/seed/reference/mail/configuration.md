---
title: "Configuration"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedMail"
tags:
    - "configuration"
    - "mail"
menu:
    SeedMail:
        weight: 20
---

You can configure mail providers by using the following configuration:
 
    com.inetpsa.seed.mail.providers = myProvider1, myProvider2, myProvider3
    
# SMTP
    
To configure a provider as an SMTP one, use the following configuration:

    [com.inetpsa.seed.mail.provider.myProvider1.property]
    mail.transport.protocol = smtp
    mail.smtp.host = ...
    mail.smtp.port = ...
    mail.smtp.auth = ...
    mail.smtp.user = ...
    mail.smtp.password = ...
    ...
    
Any property specified here will be used to configure the corresponding JAVA mail session.

# IMAP
    
To configure a provider as an IMAP one, use the following configuration:

    [com.inetpsa.seed.mail.provider.myProvider2.property]
    mail.store.protocol = imap
    mail.imap.user = ...
    mail.imap.host = ...
    mail.imap.port = ...
    mail.imap.auth.login.disable = ...
    mail.imap.auth.plain.disable = ...
    ...
    
Any property specified here will be used to configure the corresponding JAVA mail session.

# POP3
    
To configure a provider as a POP3 one, use the following configuration:

    [com.inetpsa.seed.mail.provider.myProvider3.property]
    mail.store.protocol = pop3
    mail.pop3.user = ...
    mail.pop3.host = ...
    mail.pop3.port = ...
    ...
    
Any property specified here will be used to configure the corresponding JAVA mail session.
