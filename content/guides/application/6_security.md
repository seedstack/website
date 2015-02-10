Now we can add security to our application. The LDAP authentication is handled by SEED through:

- the following properties (props file):

```
com.inetpsa.seed.security.realms = LdapRealm
[com.inetpsa.seed.security.urls]
/** = authcBasic
```

> All URLs (matching ** pattern) will be handled with basic authentication by security support using ldapRealm 

- an "ldap.properies" file at the root of a classpath folder.

For more detail, refer to the security support [core documentation](#!/seed-doc/security) and [web documentation](#!/seed-doc/web/security#security-filters).

