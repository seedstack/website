---
title: "Virtual keyboard"
type: "reference"
zones:
    - "W20"
sections:
    - "W20Touch"
menu:
    W20Touch:
        weight: 30
---

This module provides a virtual keyboard for touch interfaces.


# Configuration


     "virtualkeyboard" : {
         "available" : [ "name-of-builtin-keyboard-1", "name-of-builtin-keyboard-2", ... ]
         "custom" : {
             "name-of-the-custom-keyboard-1" : "path/to/the/custom/keyboard/1/json/definition",
             "name-of-the-custom-keyboard-2" : "path/to/the/custom/keyboard/2/json/definition",
             ...
         }
     }


# Virtual keyboard JSON definition


     {
         "layer1": [
             { value: 113 },
             { value: 119 },
             { value: 101 },
             { value: 114 },
             { value: 116 },
             { value: 121 },
             { value: 117 },
             { value: 105 },
             { value: 111 },
             { value: 112 },
             { value: "del", "isChar": "false", "onclick": "jsKeyboard.del()", "buttonClass": "kb-button kb-button-alpha-del", "keyClass": "kb-key kb-key-alpha-del" },
             {separator: "true" },


             { value: 97, "buttonClass": "kb-button kb-button-alpha-a" },
             { value: 115 },
             { value: 100 },
             { value: 102 },
             { value: 103 },
             { value: 104 },
             { value: 106 },
             { value: 107 },
             { value: 108 },
             { value: "Enter", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-enter", "onclick": "jsKeyboard.enter();", "keyClass": "kb-key kb-key-alpha-enter" },
             {separator: "true" },


             { value: "ABC", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-capitalletterleft", "onclick": "jsKeyboard.changeToLayer2();", "keyClass": "kb-key kb-key-alpha-capitalletterleft" },
             { value: 122 },
             { value: 120 },
             { value: 99 },
             { value: 118 },
             { value: 98 },
             { value: 110 },
             { value: 109 },
             { value: 44 },
             { value: 46 },
             { value: 39 },
             {separator: "true" },


             { value: "123", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-numberleft", "onclick": "jsKeyboard.changeToLayer3();", "keyClass": "kb-key kb-key-alpha-number" },
             { value: 32, "buttonClass": "kb-button kb-button-alpha-space" },
             { value: "#$@", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-symbolsright", "onclick": "jsKeyboard.changeToLayer4();", "keyClass": "kb-key kb-key-alpha-symbols" },
             { value: "Close", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-hide", "onclick": "virtualKeyboardService.close();", "keyClass": "kb-key kb-key-alpha-hide" }
         ],
         "layer2": [
             { value: 81 },
             { value: 87 },
             { value: 69 },
             { value: 82 },
             { value: 84 },
             { value: 89 },
             { value: 85 },
             { value: 73 },
             { value: 79 },
             { value: 80 },
             { value: "del", "isChar": "false", "onclick": "jsKeyboard.del()", "buttonClass": "kb-button kb-button-alpha-del", "keyClass": "kb-key kb-key-alpha-del" },
             {separator: "true" },


             { value: 65, "buttonClass": "kb-button kb-button-alpha-a" },
             { value: 83 },
             { value: 68 },
             { value: 70 },
             { value: 71 },
             { value: 72 },
             { value: 74 },
             { value: 75 },
             { value: 76 },
             { value: "Enter", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-enter", "onclick": "jsKeyboard.enter();", "keyClass": "kb-key kb-key-alpha-enter" },
             {separator: "true" },


             { value: "abc", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-smallletter", "onclick": "jsKeyboard.changeToLayer1();", "keyClass": "kb-key kb-key-alpha-smallletter" },
             { value: 90 },
             { value: 88 },
             { value: 67 },
             { value: 86 },
             { value: 66 },
             { value: 78 },
             { value: 77 },
             { value: 44 },
             { value: 46 },
             { value: 39 },
             {separator: "true" },


             { value: "123", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-numberleft", "onclick": "jsKeyboard.changeToLayer3();", "keyClass": "kb-key kb-key-alpha-number" },
             { value: 32, "buttonClass": "kb-button kb-button-alpha-space" },
             { value: "#$@", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-symbolsright", "onclick": "jsKeyboard.changeToLayer4();", "keyClass": "kb-key kb-key-alpha-symbols" },
             { value: "Close", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-hide", "onclick": "virtualKeyboardService.close();", "keyClass": "kb-key kb-key-alpha-hide" }
         ],
         "layer3": [
             { value: 49 },
             { value: 50 },
             { value: 51 },
             { value: 52 },
             { value: 53 },
             { value: 54 },
             { value: 55 },
             { value: 56 },
             { value: 57 },
             { value: 48 },
             { value: "del", "isChar": "false", "onclick": "jsKeyboard.del()", "buttonClass": "kb-button kb-button-alpha-del", "keyClass": "kb-key kb-key-alpha-del" },
             {separator: "true" },


             { value: 45, "buttonClass": "kb-button kb-button-alpha-dash" },
             { value: 47 },
             { value: 58 },
             { value: 59 },
             { value: 40 },
             { value: 41 },
             { value: 36 },
             { value: 38 },
             { value: 64 },
             { value: "Enter", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-enter", "onclick": "jsKeyboard.enter();", "keyClass": "kb-key kb-key-alpha-enter" },
             {separator: "true" },


             { value: "abc", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-smallletterleft", "onclick": "jsKeyboard.changeToLayer1()", "keyClass": "kb-key kb-key-alpha-smallletter" },
             { value: 63 },
             { value: 33 },
             { value: 34 },
             { value: 124 },
             { value: 92 },
             { value: 42 },
             { value: 61 },
             { value: 43 },
             { value: "abc", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-smallletterright", "onclick": "jsKeyboard.changeToLayer1();", "keyClass": "kb-key kb-key-alpha-smallletter" },
             {separator: "true" },


             { value: "#$@", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-symbolsleft", "onclick": "jsKeyboard.changeToLayer4();", "keyClass": "kb-key kb-key-alpha-symbols" },
             { value: 32, "buttonClass": "kb-button kb-button-alpha-space" },
             { value: "#$@", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-symbolsright", "onclick": "jsKeyboard.changeToLayer4();", "keyClass": "kb-key kb-key-alpha-symbols" },
             { value: "Close", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-hide", "onclick": "virtualKeyboardService.close();", "keyClass": "kb-key kb-key-alpha-hide" }
         ],
         "layer4": [
             { value: 91 },
             { value: 93 },
             { value: 123 },
             { value: 125 },
             { value: 35 },
             { value: 37 },
             { value: 94 },
             { value: 42 },
             { value: 43 },
             { value: 61 },
             { value: "del", "isChar": "false", "onclick": "jsKeyboard.del()", "buttonClass": "kb-button kb-button-alpha-del", "keyClass": "kb-key kb-key-alpha-del" },
             {separator: "true" },


             { value: 95, "buttonClass": "kb-button kb-button-alpha-underscore" },
             { value: 92 },
             { value: 124 },
             { value: 126 },
             { value: 60 },
             { value: 62 },
             { value: "&euro;", "isChar": "false", "onclick": "jsKeyboard.writeSpecial('&euro;');" },
             { value: 163 },
             { value: 165 },
             { value: "Enter", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-enter", "onclick": "jsKeyboard.enter();", "keyClass": "kb-key kb-key-alpha-enter" },
             {separator: "true" },


             { value: "abc", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-smallletterleft", "onclick": "jsKeyboard.changeToLayer1()", "keyClass": "kb-key kb-key-alpha-smallletter" },
             { value: 46 },
             { value: 44 },
             { value: 63 },
             { value: 33 },
             { value: 39 },
             { value: 34 },
             { value: 59 },
             { value: 92 },
             { value: "abc", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-smallletterright", "onclick": "jsKeyboard.changeToLayer1();", "keyClass": "kb-key kb-key-alpha-smallletter" },
             {separator: "true" },


             { value: "123", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-numberleft", "onclick": "jsKeyboard.changeToLayer3();", "keyClass": "kb-key kb-key-alpha-number" },
             { value: 32, "buttonClass": "kb-button kb-button-alpha-space" },
             { value: "123", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-numberright", "onclick": "jsKeyboard.changeToLayer3();", "keyClass": "kb-key kb-key-alpha-number" },
             { value: "Close", "isChar": "false", "buttonClass": "kb-button kb-button-alpha-hide", "onclick": "virtualKeyboardService.close();", "keyClass": "kb-key kb-key-alpha-hide" }
         ]
     }

     
# Virtual keyboard events


**w20.virtualkeyboard.opened**

This event is emitted after the virtual keyboard has opened.

| arguments |                                                                             |   |   |   |
|-----------|-----------------------------------------------------------------------------|---|---|---|
| Jquery    | The jQuery object of the input field that the virtual keyboard is bound to. |   |   |   |
| String    | The keyboard layout.                                                                             |   |   |   |
|           |                                                                             |   |   |   |

**w20.virtualkeyboard.closed**

This event is emitted after the virtual keyboard has closed.

# Virtual keyboard directives


**w20BindKeyboard**

Bind a specific keyboard to an input field. When the input field is focused the keyboard is automatically displayed.
Keyboard must still be hidden manually after field editing. You can bind any available keyboard type (configured in
your application). The "alpha" keyboard type is automatically resolved to the active culture keyboard layout. If no
keyboard of the specified layout is available, the default keyboard is displayed. If keyboard mode is auto, the
keyboard is opened on focused and closed on blur. If keyboard mode is manual, the keyboard is toggled when clicking
on an icon appended to the input field.

    <input type="text" data-w20-bind-keyboard="keyboard type" data-keyboard-mode="auto|manual"></input
  
                                       
Attributes:      	   

* w20BindKeyboard  **(string)**   A custom layout can be specified for the bound input field.                                           	
* keyboardMode     **(string)** 	Keyboard is automatically displayed upon input field focus, unless this attribute is set to 'manual'. 	
* keyboardScroll   **(string)** 	If this attribute is present the input field is scrolled into view if possible.                       	

**w20VirtualKeyboard**
                                   
Create the virtual keyboard inside the element. The keyboard is initially hidden and can be shown
by using the VirtualKeyboardService API or by binding a keyboard to an input field (see the w20BindKeyboard).

    <div data-w20-virtual-keyboard>
        ...
    </div>
                                                 