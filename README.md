I will add to this as I have time, but if you are actually interested, you can
look at test/saxtract_test.js. It shows a simple example of how to use 
saxtract. Here is a simple example:


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
