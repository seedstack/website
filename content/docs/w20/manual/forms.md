---
title: "Forms"
type: "home"
zones:
    - "W20"
sections:
    - "W20Manual"
menu:
    W20Manual:
        weight: 50
---



Forms are one of the most common element in a web application. The web framework provides support for 
forms building through programmatic configuration. Internally it relies on [Angular Formly](http://docs.angular-formly.com/), 
an advanced library for managing forms with AngularJS. This approach reduces the amount of HTML in favor
of JavaScript to provide flexibility, reusability, maintainability and simplicity.

# Forms

## Overview

To display a form, we declare a `form` element with a unique child. The child element will itself declare:

* the `w20Form` directive.
* the `model` attribute which binds the form data to its value on the scope.
* the `fields` attribute which reads the configuration object for the form fields on the scope.

```
<form data-ng-submit="form.submit()" name="form">
    <span data-w20-form data-model="form.model" data-fields="form.fields">
        <button class="btn btn-primary" type="submit">Submit</button>
    </span>
</form>
```

The `w20Form` directive transcludes. Its child elements get appended to the end of the form. This allow to declare the submit button inside
the directive element.

In the JavaScript we can configure the form elements:

```
$scope.form = {
    model: {},
    fields: [{ key: 'name', type: 'text', templateOptions: { label: 'Name' }}],
    submit: function () { ... }
}
```

The end result is an input element with a binding to $scope.model.name (`key`), a type 'text' (`type`) and a label 'Name' (`label`).

## Benefits

Using this approach offer several benefits such as:

* Simpler declaration.
* CSS agnostic (no Bootstrap classes tightly linked to the form for instance).
* Automatic validation.
* Easier to declare conditional logic.
* Creation of custom element types.
* i18n capability.

# Configuration

## Fragment declaration


To include the form support in your application, declare the form module in your w20-components addon fragment configuration 
of the application manifest.

```
"bower_components/w20-components/w20-components.w20.json": {
    "forms": {}
}
```

## Fields

A field is an object which can accept theses properties:

* `template`: (String) or `templateUrl` (String) An HTML template or an URL to one. This is useful to declare a title in the middle of the form for instance.

```
{
    template: '<h1> Title </h1>'
}
```

* `key`: (String) The name of the property of the model to which this field NgModel will be binded.
* `className`: (String) The name of a css class to apply to the field. Useful for layout.,
* `type`: (String) The type of the field. By default, several types are available:
    * text
    * email
    * password
    * date
    * number
    * url
    * datetime-local
    * tel
    * search
    * color
    * time
    * week
    * month
    * checkbox
    * radio
    * textarea
    * select
    
* `templateOptions`: (Object) This property allow setting different options on the field element template.
    * `label`: (String) The label of the field.
    * `placeholder`: (String) The placeholder of the field.
    
    **Any additional template options are set as attributes on the field element**. This allow the registration of validation
    properties such as:
    
    * `required`: (Boolean) Specify if the field is mandatory.
    * `minlength`: (Number) Specify the field minimum length input.
    * `min`: (Number) Specify the field minimum value.
    * `maxlength`: (Number) Specify the field maximum length input.
    * `max`: (Number) Specify the field maximum value.
    * `pattern`: (String) A regular expression to which the input needs to validate against.
    
    Some properties of the `templateOptions` only make sense for certain field type:
    
    * Select:
        * `options`: (Array of Object with properties { name: 'string', value: 'value', group: 'group' }) The list of options for the select element.      
    * Textarea
        * `rows`: (Number) Number of rows.
        * `cols`: (Number) Number of columns.

### Field group

A field group is a way to group fields together, which is useful for advanced layout. It can also be used to group fields that are associated 
with the same model.

```
{
    key: 'person',
    fieldGroup: [
        {
            key: 'sex',
            type: 'radio',
            className: 'col-md-4',
            templateOptions: {
                name: 'radioGroup',
                label: 'Male',
                value: 'M'
            }
        },
        {
            key: 'sex',
            type: 'radio',
            className: 'col-md-4',
            templateOptions: {
                name: 'radioGroup',
                label: 'Female',
                value: 'F'
            }
        },
        {
            key: 'married',
            type: 'checkbox',
            className: 'col-md-4',
            templateOptions: {
                label: 'Married (y/n)'
            }
        }
    ]
}
```

In the above example the model will look something like this:

```
{
    person: {
        sex: 'M',
        married: true
    }
}
```

### Internationalization

Strings used for label, placeholder, etc. can be replaced by i18n key. They are automatically localized.

```
templateOptions: {
    label: 'application.w20.label.to.localize'
}
```

### Expression properties

Expression properties can be used to evaluate property on the field dynamically. For instance:

```
{
    key: 'myThing',
    type: 'someType',
    templateOptions: {
        label: 'Label'
    }
    expressionProperties: {
        // this would make the label change to what the user has typed
      'templateOptions.label': '$viewValue', 
       // This sets data.someProp to be true or false
      'data.someProp': 'model.myThing.length > 5'
    }
}
```

### Hide expression

The `hideExpression` property is similar to the `expressionProperties`, although it accepts both a string or a function. It allows to show/hide the
corresponding field.

```
hideExpression: function($viewValue, $modelValue, scope) {
      return scope.model.baz === 'foobar';
}
```

## Validation

### Validators

Form validation is an important part of the user experience while completing the form. You can add validation rule easily with the
`validators` property:

```
{
    type: 'text',
    key: 'ip',
    templateOptions: {
        required: true, 
        label: 'IP Address'
    },
    validators: {
          notLocalHost: '$viewValue !== "127.0.0.1"',
          ipAddress: {
            expression: function ($viewValue, $modelValue, scope) {
              var value = $modelValue || $viewValue;
              return /(\d{1,3}\.){3}\d{1,3}/.test(value);
            },
            message: '$viewValue + " is not a valid IP Address"'
          }         
        }
    }
}
```

In the above example we register two validators: `notLocalHost` and `ipAddress`. The first one will validate the field if and only if
the `$viewValue` (that is the value the user entered in the field) is different from the localhost ip address. The second validator demonstrate
another way of declaring validators with more options. Here we test against an IP regex and register a validation message to be displayed if the field
does not validate.


### Validation

We already saw how to register a message alongside a validator but you can also register messages for any property. For this you 
can use the `validation` option.

```
{
    key: 'id',
    type: 'text',
    templateOptions: {
        label: 'Id',
        placeholder: 'Id',
        required: true,
        minlength: 6
    },
    validation: {
        messages: {
            required: "options.templateOptions.label + ' is mandatory'",
            minlength: "'Minimum length allowed is ' + options.templateOptions.minlength"
        }
    }
}
```

In the above example, leaving the field empty will show "Id is mandatory" while providing an id with a length inferior to 6 will show "Minimum length
allowed is 6". The `options.templateOptions` refer to the field templateOptions. You can also use a shortcut syntax: `to` for `options.templateOptions`.

```
validation: {
    messages: {
        required: "to.label + ' is mandatory'",
        minlength: "'Minimum length allowed is ' + to.minlength"
    }
}
```

### Disabling validation

Default validation messages appear by the use of a wrapper around template. You can completely disable the wrapper with the `wrapper`property or
provide your own wrapper (see Registering wrapper below).

```
{
    key: 'id',
    type: 'text',
    wrapper: null,
    ...
}
```

{{% callout warning %}}
Please note that messages are strings which means they need to be between quotes. For instance, if you use an i18n key for the message, it needs to be
declared as `"'application.i18n.key'"`, not just `"application.i18n.key"`.
{{% /callout %}}

{{% callout info %}}
There are common default validation messages already registered for the en and fr locales. 
{{% /callout %}}


{{% callout info %}}
See [Angular-formly field configuration object](http://docs.angular-formly.com/docs/field-configuration-object) for an exhaustive description of all options available.
{{% /callout %}}

# Customization

## FormsService

The `FormsService` main goals are the registration of global validation messages, custom template types and custom wrappers.

### Global validation messages

Although you can register a validation message for each field as we saw previously, most of the time you will like to register 
a message for a certain validation that apply to all fields that declare this validation rule. You can proceed in several ways:

* Register a string message with `validation.addStringMessage(name, string)`:

```
formsService.validation.addStringMessage('required', 'This field is required');
// You can also pass an i18n key
formsService.validation.addStringMessage('maxlength', 'application.form.validation.maxlength');
```

* Register a template option value message: sometime a string message is not enough because you need to display a variable
value in the message. To accomplish this you can use the `validation.addTemplateOptionValueMessage(name, property, prefix, suffix, alternate)`.
This is easy to understand with an example:

```
$scope.form.fields = {
    {
        key: 'id',
        type: 'text',
        templateOptions: {
            label: 'Id',
            minlength: 6,
            minlengthstring: 'six'
        }
    },
     {
        key: 'other',
        type: 'text',
        templateOptions: {
            label: 'Other',
            minlength: 6
        }
     }
}

formsService.validation.addTemplateOptionValueMessage('minlength', 'minlengthstring', 'Minimum length is  ', ' characters', 'Too short');

```

In the example above we register a validation message for the `minlength` attribute (first parameter). The message displayed if the validation fail will be:

* "Minimum length is six characters" i.e prefix + property + suffix for the id field.
* "Too short" for the other field because it uses the alternate message if the property does not exist. 


### Registering type

The forms module provide default template type listed in the Fields section of this page. However you can create your own type for maximum flexibility.

```
formsService.config.setType({
    name: 'customTitle',
    // 'to' is a shortcut for 'options.templateOptions'
    template: '<h1> Custom title - {{ to.customSetting }} </h1>'
});

$scope.form.fields = {
    {
        key: 'id',
        type: 'customTitle',
        templateOptions: {
            customSetting: 'Some value',
        }
    }
}
```

### Registering wrapper

To set a wrapper use the `config.setWrapper(wrapper)` method.

```
formsService.config.setWrapper({template: validationTemplate});
```

The validation template need to declare the `<formly-transclude></formly-transclude>` element at the position where you want your field
to be inserted inside the wrapper. For instance, this wrapper will add a `<hr />` above every field.

```
<div>
    <hr />
    <formly-transclude></formly-transclude>
</div>
```

## Layout and styling

### Layout

When using a grid framework like Bootstrap you can achieve the desired layout using the `className` property of fields. You can also
combine this with the `fieldGroup` property for inner layout.

### Style

The default validation wrapper have these CSS classes for the label, messages wrapper and message element.

* `w20-form-error-label` for the form element label.
* `w20-form-error-messages` for the ng-messages div that wrap all the validation messages.
* `w20-form-error-message` for each validation message.





