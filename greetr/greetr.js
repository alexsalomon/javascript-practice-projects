
(function(global) {
    "use strict";

    // Trick borrowed from the jQuery library:
    // Creates an object so that the user doesn't have to use the 'new' keyword
    const Greetr = function (firstname, lastname, defaultLanguage){
        return new Greetr.init(firstname, lastname, defaultLanguage);
    };

    // Supported languages - hidden within the scope of the IIFE and never directly accessible
    const validLanguageCodes = ['en', 'es', 'pt', 'fr'];

    // Available greetings
    const greetings = {
        'en': 'Hello, %%%name%%%! Welcome!',
        'es': '¡Hola %%%name%%%! ¡Bienvenido!',
        'pt': 'Olá, %%%name%%%! Bem-vindo!',
        'fr': 'Bonjour %%%name%%%! Bienvenue!',
    };

    // Publicly accessible library methods
    // (all in the prototype as opposed to the Greetr object so that we only have one instance of each method)
    Greetr.prototype = {
        displayGreet : function() {
            let targetElements = global.document.querySelectorAll('[data-greetr]');

            for(let i = 0; i < targetElements.length; i++) {
                let target = targetElements[i];
                let language = target.getAttribute('data-greetr') || this.language;
                target.textContent = getGreet(this.getFullName(), language);
            }

            // Returning the calling object to allow for chainable methods
            return this;
        },

        getFullName : function() {
          return this.firstname + " " + this.lastname;
        },

        isLanguageValid : function(language) {
            return isLanguageValid(language);
        }
    };

    // Utilities
    function getGreet(name, language) {
        let greet = '';

        if(isLanguageValid(language)) {
            greet = greetings[language].replace('%%%name%%%', name);
        } else {
            throw new Error(`Invalid language specified: "${language}".`);
        }

        return greet;
    }

    function isLanguageValid(language) {
        return (validLanguageCodes.indexOf(language) !== -1);
    }

    // Constructor
    Greetr.init = function(firstname = '', lastname = '', defaultLanguage = 'en') {
        this.firstname = firstname;
        this.lastname = lastname;
        this.language = defaultLanguage;
    };
    // Pointing the object prototype to the Greetr prototype methods
    Greetr.init.prototype = Greetr.prototype;

    // Attaching Greetr to the global object and offering the G$ shortcut to be used instead
    global.Greetr = global.G$ = Greetr;
})(window);