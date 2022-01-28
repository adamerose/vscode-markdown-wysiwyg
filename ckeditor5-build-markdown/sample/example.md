
## Headings
# h1 Heading
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading


## Horizontal Rule

___

---

***

## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


## Blockquotes


> Blockquotes can also be nested...
> > ...by using greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists

Unordered

+ Create a list by starting a line with `+`, `-`, or `*`
+ Sub-lists are made by indenting 2 spaces:
  - Ac tristique libero volutpat at
  - Facilisis in pretium nisl aliquet
  - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa

## Code


Indented code

    line 1 of code
    line 2 of code
    line 3 of code


Block code with backticks

```
line 1 of code
line 2 of code
line 3 of code
```

## Tables

| Option | Description                                                 |
|--------|-------------------------------------------------------------|
| foo    | Lorem ipsum dolor sit amet,                                 |
| bar    | Ut enim ad minim veniam, quis nostrud exercitation ullamco. |
| baz    | Excepteur sint occaecat cupidatat non proident.             |

## Links

[example](https://example.com)

[example link with hover](https://example.com "hover text!")


## Images

![Minion](https://octodex.github.com/images/original.png)

## Unsupported Features

### Autoconverted hyperlink 
See https://example.com

### List start numbering with offset
57. foo
58. bar

### Definition List
First Term
: This is the definition of the first term.

Second Term
: This is one definition of the second term.
: This is another definition of the second term.

### Footnotes
Footnote 1 link[^first].  
Footnote 2 link[^second].  
Duplicated footnote reference[^second].  
[^first]: Footnote 1 text  
[^second]: Footnote 2 text.  

### Subscript / Superscript
O(n<sup>2</sup>)  
H<sub>2</sub>O 

### Right aligned table columns

| Option |                                                 Description |
|-------:|------------------------------------------------------------:|
|    foo |                                 Lorem ipsum dolor sit amet, |
|    bar | Ut enim ad minim veniam, quis nostrud exercitation ullamco. |
|    baz |             Excepteur sint occaecat cupidatat non proident. |

### Syntax highlighting

```javascript
// Add two numbers
var add = function (a, b) {
  return a + b;
};
```

```python
# Add two numbers
def add(a, b):
    return a + b
```

### Inline code
Inline `code`