---
title: "In testing"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedSecurity"
tags:
    - "security"
    - "test"
menu:
    SeedSecurity:
        weight: 40
---

# Users configuration

You need a security props configuration file in your test resources folder:

	[org.seedstack.seed.security.users]
	Obiwan = yodarulez, SEED.JEDI

	[org.seedstack.seed.security.roles]
	jedi = SEED.JEDI

# Connecting users

Authentication in a test requires `@RunWith` annotation (using `SeedItRunner`) as well as `@WithSecurity` and `@WithUser` annotations. 
Here is an example of how to use those annotations:

	@RunWith(SeedITRunner.class)
	@WithSecurity
	public class MyITWithSecurity {

	    @Inject
	    private SecuritySupport securitySupport;

	    @Test
	    @WithUser(id = "Obiwan", password = "yodarulez")
	    public void Obiwan_should_be_a_jedi() {
	        assertTrue(securitySupport.hasRole("jedi"));
	    }
	}

