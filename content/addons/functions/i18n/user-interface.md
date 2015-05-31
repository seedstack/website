---
title: "User interface"
zones:
    - "Functions"
sections:
    - "FunctionI18n"
menu:
    FunctionI18n:
        weight: 30
---

# Manage locales

![locale view](/img/functions/i18n/locale.png)

In this view you can set the locales that will be available in your application. Use the "Add" and
"Remove" buttons for selecting those locales.

The default locale should be specified in the adjacent select box.

# Manage keys

![locale view](/img/functions/i18n/keys.png)

As it name implies this view allows you to manage your keys.

You can add keys to you application in two ways :

## Add a new key

Using the "Add new key" button which will bring up a form to add a key manually.

## Import multiple keys

Using the "Import keys" button which will bring a drop zone in which you can paste
CSV files containing your keys to upload.
* The files extension must be .csv.
* The format of your .csv file must respect a default format.

Example :

    key;en;fr
    myKeyName1;I love translating;J'adore traduire
    myKeyName2;It is important to localize your application;Il est important de localiser son application

You can also download your application keys using the export button link.

## Delete keys

The 'Delete all filtered keys' will delete all the keys that match the filters (search input and checkboxes).

## Key states

Keys are shown along with state squares which can have the following values:

* 'D': 'Done', the key is correct and ready to use
* 'M': 'Missing', the key is missing a default translation
*  'A': 'Approximate', the key translation has been marked as approximate (meaning it is a fuzzy, sloppy translation)
and need a netter formulation.
* 'O': 'Outdated', the key translations are outdated. For instance if you have translate the key in different languages
but then you have change the default translation the key will be outdated, meaning you'll need to translate again to 
match the new default translation.

# Manage Translations

This view allows you to translate the keys. Select the target language in the upper right corner.

![locale view](/img/functions/i18n/translation.png)

# Statistics

Show the number of key translated by locale.

![locale view](/img/functions/i18n/statistic.png)