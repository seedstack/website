# Version 1.1.2
- [fix] Specified a join table name SEED_I18N_KEY_TRANS to avoid too long name error in Oracle.
- [fix] Rename the comment field in the Key table to avoid naming conflict in Oracle.

# Version 1.1.1
- [fix] Normalized i18n table names with the prefix "SEED_I18N_" to avoid naming conflicts.

# Version 1.1.0
- [new] Added statistic information on translated keys.
- [new] Added default roles (`seed-i18n.translator` and `seed-i18n.reader`) to facilitate the security configuration.
- [chg] Based on SEED Java framework 1.4.0.

# Version 1.0.3
- [chg] Based on SEED Java framework 1.3.0.

# Version 1.0.2
- [new] Added fallback to parent locale, when a translation is missing. 

# Version 1.0.1
- [fix] Embedded angular-sanitize and notification to reduce required dependencies.

# Version 1.0.0
- [new] Initial version.
