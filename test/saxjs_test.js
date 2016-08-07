'use strict';

var saxtract = require("../").saxjs,
    assert = require("assert"),
    result;

saxtract.logging = true;

describe('saxtract', function() {
    describe('#parse(xml, spec)', function() {
        it('should parse basic text value', function() {
            var result = saxtract.parse("<?xml version='1.0' encoding='UTF-8'?><root>value</root>", {
                '/root': 'rootValue'
            });
            assert.strictEqual('value', result['rootValue']);
        });

        it('should parse basic attribute value', function() {
            var result = saxtract.parse("<?xml version='1.0' encoding='UTF-8'?><root id='root' />", {
                '/root/@id': 'rootId'
            });
            assert.strictEqual('root', result['rootId']);
        });

        it('should parse basic text and attribute values', function() {
            var result = saxtract.parse("<?xml version='1.0' encoding='UTF-8'?><root id='root'>value</root>", {
                '/root': 'rootValue',
                '/root/@id': 'rootId'
            });
            assert.strictEqual('value', result['rootValue']);
            assert.strictEqual('root', result['rootId']);
        });

        it('should parse namespace text value', function() {
            var result = saxtract.parse("<?xml version='1.0' encoding='UTF-8'?><root xmlns='http://abc'>value</root>", {
                'http://abc': 'abc',
                '/root': 'rootValue',
                '/abc:root': 'abcRootValue'
            });
            assert.ok(!result.hasOwnProperty('rootValue'));
            assert.strictEqual('value', result['abcRootValue']);
        });

        it('should parse using function', function() {
            var result = saxtract.parse("<?xml version='1.0' encoding='UTF-8'?><root xmlns='http://abc'>value</root>", {
                'http://abc': 'abc',
                '/root': 'rootValue',
                '/abc:root': function(obj, value) {
                    obj.abcRootValue = value
                    obj.computedValue = "computed_" + value;
                }
            });
            assert.ok(!result.hasOwnProperty('rootValue'));
            assert.strictEqual('value', result['abcRootValue']);
            assert.strictEqual('computed_value', result['computedValue']);
        });

        // notice the namespace prefix's dont have to match between the xml 
        // and the spec
        it('should parse namespace attribute value', function() {
            var result = saxtract.parse("<?xml version='1.0' encoding='UTF-8'?><root xmlns:n='http://abc' n:id='root' />", {
                'http://abc': 'abc',
                '/root/id': 'rootId',
                '/root/@abc:id': 'abcRootId'
            });
            assert.ok(!result.hasOwnProperty('rootId'));
            assert.strictEqual('root', result['abcRootId']);
        });

        it('should parse a relatively complex xml', function() {
            var expected = {
                    id: '1',
                    name: 'root',
                    other: 'abc',
                    people: {
                        'Lucas': {
                            name: 'Lucas',
                            id: '1'
                        },
                        'Boo': {
                            name: 'Boo',
                            id: '3'
                        }
                    },
                    firstEmployee: {
                        name: 'Ali',
                        id: '2'
                    }
                },
                result = saxtract.parse(
                    "<?xml version='1.0' encoding='UTF-8'?>\n" +
                    "<root xmlns='http://abc' xmlns:d='http://def' d:id='1' name='root' d:other='abc'>\n" +
                    "  <person id='1'>Lucas</person>\n" +
                    "  <d:employee id='2'>Ali</d:employee>\n" +
                    "  <person id='3'>Boo</person>\n" +
                    "  <d:employee id='4'>Dude</d:employee>\n" +
                    "</root>\n", 
                    {
                        'http://def': 'k',
                        'http://abc': '',
                        '/root/@k:id': 'id',
                        '/root/@name': 'name',
                        '/root/@k:other': 'other',
                        '/root/person': {
                            name: 'people',
                            type: 'map',
                            key: 'name',
                            spec: {
                                '': 'name',
                                '/@id': 'id'
                            }
                        },
                        '/root/k:employee': {
                            name: 'firstEmployee',
                            type: 'first',
                            spec: {
                                '': 'name',
                                '/@id': 'id'
                            }
                        }
                    });
            assert.deepEqual(expected, result);
        });

        it('should parse a relatively complex real world xml', function() {
            var expected = {
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
            //console.log("*****expected*****\n" + JSON.stringify(expected, null, 2) + 
            //    "\n*****actual*****\n" + JSON.stringify(result, null, 2) + 
            //    "\n*****end*****");
            assert.deepEqual(expected, result);
        });

        it('should parse a complex real world xml', function() {
            var expected = 
                {
                    "books": [
                        {
                            "ownedBookId": "16479833",
                            "id": "12605487",
                            "imageUrl": "http://d202m5krfqbpi5.cloudfront.net/books/1316386163m/12605487.jpg",
                            "smallImageUrl": "http://d202m5krfqbpi5.cloudfront.net/books/1316386163s/12605487.jpg",
                            "link": "http://www.goodreads.com/book/show/12605487-fuzzy-nation",
                            "format": "Audiobook",
                            "description": [
                                "In John Scalzi's re-imagining of H. Beam Piper's 1962 sci-fi classic Little Fuzzy, written with the full cooperation of the Piper Estate, Jack Holloway works alone for reasons he doesn't care to talk about. On the distant planet Zarathustra, Jack is content as an independent contractor for ZaraCorp, prospecting and surveying at his own pace. As for his past, that's not up for discussion.",
                                "Then, in the wake of an accidental cliff collapse, Jack discovers a seam of unimaginably valuable jewels, to which he manages to lay legal claim just as ZaraCorp is cancelling their contract with him for his part in causing the collapse. Briefly in the catbird seat, legally speaking, Jack pressures ZaraCorp into recognizing his claim, and cuts them in as partners to help extract the wealth.",
                                "But there's another wrinkle to ZaraCorp's relationship with the planet Zarathustra. Their entire legal right to exploit the verdant Earth-like planet, the basis of the wealth they derive from extracting its resources, is based on being able to certify to the authorities on Earth that Zarathustra is home to no sentient species. Then a small furry biped - trusting, appealing, and ridiculously cute - shows up at Jack's outback home. Followed by its family. As it dawns on Jack that despite their stature, these are people, he begins to suspect that ZaraCorp's claim to a planet's worth of wealth is very flimsy indeed and that ZaraCorp may stop at nothing to eliminate the fuzzys before their existence becomes more widely known.",
                                "BONUS CONTENT: Includes the unabridged audiobook of H. Beam Piper's original Little Fuzzy, the novel that inspired Fuzzy Nation. In your Library, Part 1 will be the complete audio of Fuzzy Nation and Part 2 will be the complete Little Fuzzy.",
                                "LENGTH",
                                "13 hrs and 48 mins"
                            ],
                            "authors": [
                                {
                                    "id": "4763",
                                    "name": "John Scalzi",
                                    "link": "http://www.goodreads.com/author/show/4763.John_Scalzi"
                                }
                            ]
                        }
                    ]
                },
                result = saxtract.parse( 
                    "<?xml version='1.0' encoding='UTF-8'?>\n" +
                    "<GoodreadsResponse>\n" +
                    "  <Request>\n" +
                    "    <authentication>true</authentication>\n" +
                    "    <key><![CDATA[API_KEY_GOES_HERE]]></key>\n" +
                    "    <method><![CDATA[owned_books_user]]></method>\n" + 
                    "  </Request>\n" +
                    "  <owned_books>\n" +
                    "    <owned_book>\n" + 
                    "      <current_owner_id type='integer'>4603196</current_owner_id>\n" +
                    "      <id type='integer'>16479833</id>\n" +
                    "      <original_purchase_date type='datetime' nil='true'/>\n" +
                    "      <original_purchase_location nil='true'/>\n" +
                    "      <condition>unspecified</condition>\n" +
                    "      <traded_count>0</traded_count>\n" +
                    "      <link>http://www.goodreads.com/owned_books/16479833</link>\n" +
                    "      <book>\n" +
                    "        <id type='integer'>12605487</id>\n" +
                    "        <isbn nil='true'/>\n" + 
                    "        <isbn13 nil='true'/>\n" +
                    "        <text_reviews_count type='integer'>33</text_reviews_count>\n" +
                    "        <title>Fuzzy Nation</title>\n" +
                    "        <image_url>http://d202m5krfqbpi5.cloudfront.net/books/1316386163m/12605487.jpg</image_url>\n" +
                    "        <small_image_url>http://d202m5krfqbpi5.cloudfront.net/books/1316386163s/12605487.jpg</small_image_url>\n" +
                    "        <link>http://www.goodreads.com/book/show/12605487-fuzzy-nation</link>\n" +
                    "        <num_pages>8</num_pages>\n" +
                    "        <format>Audiobook</format>\n" +
                    "        <edition_information>Unabridged - Audible Download</edition_information>\n" + 
                    "        <publisher>Audible Frontiers</publisher>\n" +
                    "        <publication_day>10</publication_day>\n" +
                    "        <publication_year>2011</publication_year>\n" +
                    "        <publication_month>5</publication_month>\n" + 
                    "        <average_rating>4.04</average_rating>\n" + 
                    "        <ratings_count>6640</ratings_count>\n" + 
                    "        <description>In John Scalzi's re-imagining of H. Beam Piper's 1962 sci-fi classic Little Fuzzy, written with the full cooperation of the Piper Estate, Jack Holloway works alone for reasons he doesn't care to talk about. On the distant planet Zarathustra, Jack is content as an independent contractor for ZaraCorp, prospecting and surveying at his own pace. As for his past, that's not up for discussion.&lt;br /&gt;&lt;br /&gt;Then, in the wake of an accidental cliff collapse, Jack discovers a seam of unimaginably valuable jewels, to which he manages to lay legal claim just as ZaraCorp is cancelling their contract with him for his part in causing the collapse. Briefly in the catbird seat, legally speaking, Jack pressures ZaraCorp into recognizing his claim, and cuts them in as partners to help extract the wealth.&lt;br /&gt;&lt;br /&gt;But there's another wrinkle to ZaraCorp's relationship with the planet Zarathustra. Their entire legal right to exploit the verdant Earth-like planet, the basis of the wealth they derive from extracting its resources, is based on being able to certify to the authorities on Earth that Zarathustra is home to no sentient species. Then a small furry biped - trusting, appealing, and ridiculously cute - shows up at Jack's outback home. Followed by its family. As it dawns on Jack that despite their stature, these are people, he begins to suspect that ZaraCorp's claim to a planet's worth of wealth is very flimsy indeed and that ZaraCorp may stop at nothing to eliminate the fuzzys before their existence becomes more widely known.&lt;br /&gt;&lt;br /&gt;BONUS CONTENT: Includes the unabridged audiobook of H. Beam Piper's original Little Fuzzy, the novel that inspired Fuzzy Nation. In your Library, Part 1 will be the complete audio of Fuzzy Nation and Part 2 will be the complete Little Fuzzy.&lt;br /&gt;&lt;br /&gt;LENGTH&lt;br /&gt;13 hrs and 48 mins</description>\n" +
                    "        <authors>\n" +
                    "          <author>\n" +
                    "            <id>4763</id>\n" +
                    "            <name>John Scalzi</name>\n" +
                    "            <image_url><![CDATA[http://d202m5krfqbpi5.cloudfront.net/authors/1236228326p5/4763.jpg]]></image_url>\n" +
                    "            <small_image_url><![CDATA[http://d202m5krfqbpi5.cloudfront.net/authors/1236228326p2/4763.jpg]]></small_image_url>\n" +
                    "            <link><![CDATA[http://www.goodreads.com/author/show/4763.John_Scalzi]]></link>\n" +
                    "            <average_rating>4.00</average_rating>\n" +
                    "            <ratings_count>123732</ratings_count>\n" +
                    "            <text_reviews_count>13044</text_reviews_count>\n" +
                    "          </author>\n" +
                    "        </authors>\n" +
                    "        <published>2011</published>\n" +
                    "      </book>\n" +
                    "      <review>\n" +
                    "        <id>425922943</id>\n" +
                    "        <rating>5</rating>\n" +
                    "        <votes>0</votes>\n" +
                    "        <spoiler_flag>false</spoiler_flag>\n" +
                    "        <spoilers_state>none</spoilers_state>\n" +
                    "        <shelves>\n" +
                    "          <shelf name='read' />\n" +
                    "        </shelves>\n" +
                    "        <recommended_for></recommended_for>\n" +
                    "        <recommended_by></recommended_by>\n" +
                    "        <started_at></started_at>\n" +
                    "        <read_at></read_at>\n" +
                    "        <date_added>Mon Oct 01 18:41:14 -0700 2012</date_added>\n" +
                    "        <date_updated>Sun Aug 04 09:13:44 -0700 2013</date_updated>\n" +
                    "        <read_count></read_count>\n" +
                    "        <body> </body>\n" +
                    "        <comments_count>review_comments_count</comments_count>\n" +
                    "        <url><![CDATA[http://www.goodreads.com/review/show/425922943]]></url>\n" +
                    "        <link><![CDATA[http://www.goodreads.com/review/show/425922943]]></link>\n" +
                    "        <owned>1</owned>\n" +
                    "      </review>\n" +
                    "    </owned_book>\n" +
                    "  </owned_books>\n" +
                    "</GoodreadsResponse>",
                    {
                        '/GoodreadsResponse/owned_books/owned_book': {
                            name: 'books',
                            type: 'array',
                            spec: {
                                '/book/authors/author': {
                                    name: 'authors',
                                    type: 'array',
                                    spec: {
                                        '/id': 'id',
                                        '/link': 'link',
                                        '/name': 'name'
                                    }
                                },
                                '/book/description': function(obj, value) {
                                    obj.description = value.split( /(?:<br\s*\/>)+/ );
                                },
                                '/book/format': 'format',
                                '/book/id': 'id',
                                '/book/image_url': 'imageUrl',
                                '/book/link': 'link',
                                '/id': 'ownedBookId',
                                '/book/small_image_url': 'smallImageUrl',
                            }
                        }
                    });
            //console.log("*****real world complex xml expected*****\n" + JSON.stringify(expected, null, 2) + 
            //    "\n*****actual*****\n" + JSON.stringify(result, null, 2) + 
            //    "\n*****end*****");
            assert.deepEqual(expected, result);
        });

        it('should preserve whitespace in element content using global setting', function() {
            var before = saxtract.preserveWhitespace;
            try {
                saxtract.preserveWhitespace = true;
                var result = saxtract.parse("<?xml version='1.0' encoding='UTF-8'?><root>foo </root>", {
                    '/root': 'rootValue'
                });
                assert.strictEqual('foo ', result['rootValue']);
            }
            finally {
                saxtract.preserveWhitespace = before;
            }
        });

        it('should preserve whitespace in element content using parse argument', function() {
            var result = saxtract.parse("<?xml version='1.0' encoding='UTF-8'?><root>foo </root>", {
                '/root': 'rootValue'
            },
            true);
            assert.strictEqual('foo ', result['rootValue']);
        });

        it('should preserve whitespace in option value', function() {
            var result = saxtract.parse("<?xml version='1.0' encoding='UTF-8'?><root value='foo ' />", {
                '/root/@value': 'rootOptionValue'
            });
            assert.strictEqual('foo ', result['rootOptionValue']);
        });
    });
});
