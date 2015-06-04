---
title: "Overview"
type: "addon"
zones:
    - "Addons"
sections:
    - "AddonsFunctions"
subsections:
    - "Internationalization"
menu:
    AddonsFunctionsI18n:
        weight: 10
---

The i18n function provides backend services and a Web UI to manage application locales and translations. To add the
i18n function to your project, add the following dependency to your Web module pom:

    <dependency>
        <groupId>org.seedstack.functions.i18n</groupId>
        <artifactId>seed-i18n-function-web</artifactId>
    </dependency>

# Locales

The i18n function stores application available locales and default locale. Available locales are the locales in which
the application is translated, i.e. available to users. The default locale is the "native language" of the application.
This locale will be used as starting locale for translations.

Locales can be managed with i18n administration interface or programmatically with the `LocaleService`.

# Localization

Localization is provided by the `LocalizationService` which allows to localize date, number, string and currency.
The string localization return the translation for a key in a given locale. When the translation is not present 
for the given locale, the service will fallback to the parent locale.

For instance:

    @Inject
    private LocalizationService localizationService;

    // When Both fr and fr-BE locales are available.
    
    // Case 1: fr-BE translation is present
    localizationService.localize("fr-BE", "key1"); // -> "translation fr-BE"
    
    // Case 2: fr-BE translation is NOT present, but fr translation is present
    localizationService.localize("fr-BE", "key1"); // -> "translation fr"
    
    // Case 2: no translation present
    localizationService.localize("fr-BE", "key1"); // -> "[key]"













