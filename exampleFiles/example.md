This a test of all markdown possibilities:

## Headings

## h1 Heading 1

## h2 Heading 2

### h3 Heading 3

#### h4 Heading 4

h5 Heading 5

h6 Heading 6

## Horizontal Rules

## Emphasis

**This is bold text**

**This is bold text**

_This is italic text_

_This is italic text_

~Strikethrough~

## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/)

This is [an example](http://example.com/) inline link.

[This link](http://example.net/) has no title attribute.

## Blockquotes

> Blockquotes can also be nested...

> ...by using additional greater-than signs right next to each other...

> ...or with spaces between arrows.

## Indentation

indentation 1-1

indentation 1-2  
indentation 2-1

## Lists

### Unordered

*   Create a list by starting a line with +, -, or \*
*   Sub-lists are made by indenting 2 spaces:
    *   Marker character change forces new list start:
        *   Ac tristique libero volutpat at
        *   Facilisis in pretium nisl aliquet
        *   Nulla volutpat aliquam velit
*   Very easy!

### Ordered

#### Numers in sequence

1.  Lorem ipsum dolor sit amet
2.  Consectetur adipiscing elit
3.  Integer molestie lorem at massa

#### Numers not in sequence

1.  You can use sequential numbers...
2.  ...or keep all the numbers as 1.

## Images

![Minion](https://octodex.github.com/images/dinotocat.png)

  
 

![Stormtroopocat](https://octodex.github.com/images/saritocat.png)

Like links, Images also have a footnote style syntax

![Alt text](https://octodex.github.com/images/daftpunktocat-thomas.gif)

With a reference later in the document defining the URL location:

## Tables

| Option | Description |
| --- | --- |
| data | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| --- | --- |
| data | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext | extension to be used for dest files. |

## Code

Inline code

Indented code

```plaintext
// Some comments
line 1 of code
line 2 of code
line 3 of code
```

Block code "fences"

```plaintext
Sample text here...
```

Syntax highlighting

```plaintext
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
```