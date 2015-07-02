---
title: "Testing"
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

Testing the security model and its implementation is crucial to ensure effective security. This can be easily done with
Seed through specific integration tests. For a general overview of integration testing, please check 
[this documentation](../../testing/integration). 

# Configuration

You can choose to fully emulate your security infrastructure, for instance by using an LDAP test directory instead of the 
real one. The main benefit of this approach is that it tests the security effectiveness as closely as possible to the 
real environment. A simpler but still adequate approach is to override the security realm configuration to use a 
`ConfigurationRealm` and define test users in application configuration:

```ini
[org.seedstack.seed.security.users]
testUser1 = password, role1, role2
testUser2 = password, role1
testUser3 = password, role3
...
```
	
For more information about the Configuration realm, refer to [this documentation](../configuration#configuration-realm).
For more information on how to override the configuration for testing, refer to [this documentation](../../core/configuration#configuration-override).

# Subject authentication

To authenticate a subject before a test method is executed, use the `@WithUser` annotation:

	@RunWith(SeedITRunner.class)
	public class MyITWithSecurity {
	    @Inject
	    private SecuritySupport securitySupport;
	    
	    @Inject
	    private MySecuredService mySecuredService;
	 

	    @Test(expected = AuthorizationException)
	    @WithUser(id = "testUser1", password = "password")
	    public void unprivileged_user_cannot_access_secured_service() {
	        mySecuredService.securedMethod();
	        fail("securedMethod() shouldn't have been called");
	    }
	    
	    @Test
	    @WithUser(id = "testUser3", password = "password")
	    public void admin_user_is_allowed_to_access_secured_service() {
	        mySecuredService.securedMethod();
	    }
	}

