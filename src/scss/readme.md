# SCSS project rules

## Folders architecture

The folders architecture is based on [Sass Guidelines by Hugo Giraudel](https://sass-guidelin.es/#architecture).

There already are some files inside the folders with some required or frequently used code.


```
scss/
|
|– abstracts/
|   |– _variables.scss    # Sass Variables
|   |– _functions.scss    # Sass Functions
|   |– _mixins.scss       # Sass Mixins
|   |– _placeholders.scss # Sass Placeholders
|
|– base/
|   |– _reset.scss        # Reset/normalize
|   |– _typography.scss   # Typography rules
|   …                     # Etc.
|
|– components/
|   |– _buttons.scss      # Buttons
|   |– _carousel.scss     # Carousel
|   |– _cover.scss        # Cover
|   |– _dropdown.scss     # Dropdown
|   |– _forms.scss        # Forms
|   …                     # Etc.
|
|– layout/
|   |– _navigation.scss   # Navigation
|   |– _grid.scss         # Grid system
|   |– _header.scss       # Header
|   |– _footer.scss       # Footer
|   |– _sidebar.scss      # Sidebar
|   …                     # Etc.
|
|– pages/
|   |– _home.scss         # Home specific styles
|   |– _contact.scss      # Contact specific styles
|   …                     # Etc.
|
|– themes/
|   |– _theme.scss        # Default theme
|   |– _admin.scss        # Admin theme
|   …                     # Etc.
|
|– vendors/
|   |– _jquery-ui.scss    # jQuery UI
|   …                     # Etc.
|
– style.scss              # Main Sass file
```

## Sass lint: to have beautiful code

[Sass lint](https://github.com/sasstools/sass-lint) is used to normalize SCSS writing. It displayed warning in Gulp console.

Please **don't let a warning in the console**: fix it ;-)

* The rules are in the [.sass-lint.yml](../../.sass-lint.yml) file;
* We can disable a rule for an entire file (see [gulpfile.js](../../gulpfile.js));
* To disable a rule (with a good reason), use these tricks and explain the reason:
    * For a line:

        ```scss
        .class {
            // Force color for hover and focus too
            color: #FFFFFF !important; // sass-lint:disable-line no-important
        }
        ```

    * For an entire file:

        ```scss
        // Property units adapted for printing are used
        // sass-lint:disable no-important no-color-literals property-units

        @media print {
            body {
                width: auto !important;
                margin: auto !important;
                background-color: #FFFFFF !important;
                color: #000000 !important;
                font-family: serif;
                font-size: 12pt;
            }
        }
        ```

* The **SMACSS CSS properties sort order** is used. You can read more about it here: [https://smacss.com/book/formatting](https://smacss.com/book/formatting)

## Autoprefixer

There is an **autoprefixer** so you don't need to prefix CSS properties (except for CSS selectors).

You can change the supported browsers list in the [.browserslistrc](.browserslistrc) file.

## Class naming methodology

We don't use a **class naming** methodology at the moment but a class name must:

* be in English;
* be in lowercase with words separated by a dash (hyphenated);
* name the component functionnally;
* have no word related to the color of the element.

## Naming color variables

1. Name your colors according to the corporate identity or style guide given by the designer (if it exists);
1. Or name you colors with a tool to prevent `blue-1`, `blue-2`, etc. that don't make sense: [Name that Color](http://chir.ag/projects/name-that-color);
1. You don't need to prefix the name of the color with its hue (enable a color insight with your code editor);
1. You can use a suffix `darker`, `lighter`, etc. if you need it;
1. Prefix colors variables:
    1. Use a `$color-` prefix for identity colors;
    1. Use a `$bg-` prefix for background colors;
    1. Use a `$text-` prefix for text colors;
    1. Use a `$border-` prefix for border colors;
    1. Use a `$outline-` prefix for outline colors.
