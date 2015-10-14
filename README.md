The idea behind saxtract is to use a combination of SAX parsing and XPath
data extraction.  This means you do not need to load the entire DOM to leverage
the simplicity of XPath.  Saxtract uses a `spec` object to define the data to 
extract during parsing.  For example:

```javascript
var spec = {
    '/root/@id': 'id'
};
```

Says to take whatever matches the xpath `/root/@id` and store it in the result
object under the key `id`.  So if you were to parse this XML:

```xml
var xml = "<root id='abc' />";
```

Thusly:

```javascript
var result = saxtract.parse(xml, spec);
```

Your result would look like this (using JSON.stringify):

```javascript
{'id':'abc'}
```

A more real world example pulled directly from the unit tests (test/saxtract_test.js) shows:

```javascript
    var saxtract = require("../saxtract"),
        assert = require("assert"),
        expected = {
            id: '5293',
            name: 'Robert Ludlum',
            link: 'http://www.goodreads.com/author/show/5293.Robert_Ludlum?utm_medium=api&utm_source=author_link'
        },
        result = saxtract.parse(
            "<?xml version='1.0' encoding='UTF-8'?>\n" +
            "<GoodreadsResponse>\n" +
            "  <Request>\n" + 
            "    <authentication>true</authentication>\n" +
            "    <key><![CDATA[API_KEY_GOES_HERE]]></key>\n" +
            "    <method><![CDATA[api_author_link]]></method>\n" +
            "  </Request>\n" +
            "  <author id='5293'>\n" +
            "    <name><![CDATA[Robert Ludlum]]></name>\n" +
            "    <link>http://www.goodreads.com/author/show/5293.Robert_Ludlum?utm_medium=api&amp;utm_source=author_link</link>\n" +
            "  </author>\n" +
            "</GoodreadsResponse>", 
            {
                '/GoodreadsResponse/author/@id': 'id',
                '/GoodreadsResponse/author/name': 'name',
                '/GoodreadsResponse/author/link': 'link',
            });
    
    console.log("*****expected*****\n" + JSON.stringify(expected, null, 2) + 
        "\n*****actual*****\n" + JSON.stringify(result, null, 2) + 
        "\n*****end*****");
    
    assert.deepEqual(expected, result);
```

I will add to this as I have time, but if you are actually interested, you can
look at test/saxtract_test.js which has the most up to date examples. 

= Logging

Logging can be turned on using:

```javascript
    var saxtract = require("saxtract");
    saxtract.logging = true;

    ...
```

= Whitespace Preservation

Whitespace preservation can be enabled globally using:

```javascript
    var saxtract = require("saxtract");
    saxtract.preserveWhitespace = true;

    ...
```

or per call to parse:

```javascript
    var saxtract = require("saxtract");
    saxtract.parse(xml, spec, preserveWhitespace);
```
