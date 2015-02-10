The security must be thought since the beginning. Functions should provide to their users a way to secure all the interfaces (REST or programmatic).

SEED provides two annotations to secure methods: `@RequiresPermissions` and `@RequiresRoles`. Applications can use both, but functions must only use the first one. The intent of this restriction is to allow users to map the function permissions to their roles.

The permission naming conventions are `"PRD:PROJECT:ENTITY:ACTION"`. For instance: `"seed:i18n:locale:delete"`.

> All the API methods which change the application state should be secured.

If the function provides W20 screen, menu items, pages and actions should be secured using the `w20Security` directive and the `AuthorizationService` service.

Even if the security must be provided, users should be able to not use it, ie. you should only import the `seed-security-specs` in your pom.
