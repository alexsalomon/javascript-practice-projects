Greetr 
====

A greeting library structured similarly to jQuery.

Developed to practice my Javascript skills.

How to Use:
----

In your HTML file, add the data-greetr attribute containing the desired language code to any element:
```
<h1 data-greetr="en"></h1>
```

Valid language codes include:
* 'en': English
* 'es': Spanish
* 'pt': Portuguese
* 'fr': French


In your Javascript file:
```
// Create a Greetr object with your first name, last name and, optionally, the default language 
let greetr = G$('firstName', 'lastName');

// Add a greeting to all elements containing the data-greetr attribute 
greetr.displayGreet();

// Check if a language is supported:
greetr.isLanguageValid('en'); // Output: true
greetr.isLanguageValid('invalidcode'); // Output: false

// Get the full name displayed in the greeting
greetr.getFullName() // Output: firstname lastname
``` 