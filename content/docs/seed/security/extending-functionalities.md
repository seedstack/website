This document will explain how you can develop your own components to extend SEED security. As SEED security is based on
Shiro, the possible extensions are Shiro components. See http://shiro.apache.org for more information.

# Creating a Realm

You can easily add a realm to the existing realms. Follow these steps

1. Create a class that implements org.apache.shiro.realm.Realm or extends a Shiro realm. To create an AuthorizingRealm
that uses a RoleMapping and a RolePermissionResolver as well as manages domains, you can subclass
`com.inetpsa.seed.support.security.core.realms.AbstractDomainRealm`.

```
public class MyRealm extends AbstractDomainRealm {

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        if (!(token instanceof UsernamePasswordToken)) {
            throw new UnsupportedTokenException("MyRealm only supports UsernamePasswordToken");
        }
        UsernamePasswordToken userNamePasswordToken = (UsernamePasswordToken) token;
        String user = findUser(userNamePasswordToken.getUsername());
        if (user == null) {
            throw new UnknownAccountException("Unknown user " + userNamePasswordToken.getUsername());
        }
        if (!user.password.equals(new String(userNamePasswordToken.getPassword()))) {
            throw new IncorrectCredentialsException();
        }
        SimpleAuthenticationInfo authInfo = new SimpleAuthenticationInfo();
        authInfo.setCredentials(userNamePasswordToken.getCredentials());
        SimplePrincipalCollection principals = new SimplePrincipalCollection(userNamePasswordToken.getUsername(), this.getName());
        authInfo.setPrincipals(principals);
        return authInfo;
    }

    private String findUser(String userName){
        //You verify if the user exists
    }

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        SimpleAuthorizationInfo authInfo = new SimpleAuthorizationInfo();
        Collection<String> roles = getRoles(principals.getPrimaryPrincipal().toString());
        if (user != null) {
            for (String role : user.roles) {
                processAuthority(role, authInfo); //Method in AbstractDomainRealm
            }
        }
        return authInfo;
    }

    private Collection<String> getRoles(String user){
        //This is where you get your roles
    }

    @Inject
    public void setRoleMapping(@Nullable @Named("MyRealm-role-mapping") RoleMapping roleMapping) {
        this.roleMapping = roleMapping;
    }

    @Override
    @Inject
    public void setRolePermissionResolver(@Named("MyRealm-role-permission-resolver") RolePermissionResolver rolePermissionResolver) {
        this.rolePermissionResolver = rolePermissionResolver;
    }
}
```

2. Declare your realm in your properties. If you subclasses AbstractDomainRealm, you can add a rolePermissionResolver
and optionally a roleMapping.

    com.inetpsa.seed.security.realms = MyRealm
    com.inetpsa.seed.security.MyRealm.role-mapping = ConfigurationRoleMapping
    com.inetpsa.seed.security.MyRealm.role-permission-resolver = ConfigurationRolePermissionResolver

# Creating a RolePermissionResolver

You can create a custom RolePermissionResolver.

1. Create a class that implements org.apache.shiro.authz.permission.RolePermissionResolver. The interface is quite self explanatory.
2. For a custom Realm, make an injection point in the realm with a @Named annotation : @Named("MyRealm-role-permission-resolver").
3. Declare you want to use it on a realm in your properties.

# Creating a RoleMapping

You can also create a custom RoleMapping.

1. Create a class that implements com.inetpsa.seed.support.security.core.authorization.RoleMapping.
2. For a custom Realm, make an injection point in the realm with a @Named annotation : @Named("MyRealm-role-mapping").
3. Declare you want to use it on a realm in your properties.