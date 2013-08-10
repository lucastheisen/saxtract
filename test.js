var saxtract = require("./saxtract"),
    result;

if ( false ) {
    result = saxtract.parse("<?xml version='1.0' encoding='UTF-8'?> <root xmlns='http://abc' xmlns:d='http://def' d:id='1' name='root' d:other='abc'><person id='1'>Lucas</person><d:employee id='2'>Ali</d:employee><person id='3'>Boo</person><d:employee id='4'>Dude</d:employee></root>", {
        'http://def': 'k',
        'http://abc': '',
        '/root/@k:id': 'id',
        '/root/@name': 'name',
        '/root/@k:other': 'other',
        '/root/person': {
            name: 'people',
            type: 'array',
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
    console.log("*****\n" + JSON.stringify(result, null, 2) + "\n*****");
}
if ( false ) {
    result = saxtract.parse("<?xml version='1.0' encoding='UTF-8'?> <GoodreadsResponse> <Request> <authentication>true</authentication> <key><![CDATA[QgbaC2F0Iss4f1U7Db7X5g]]></key> <method><![CDATA[api_author_link]]></method> </Request> <author id='5293'> <name><![CDATA[Robert Ludlum]]></name> <link>http://www.goodreads.com/author/show/5293.Robert_Ludlum?utm_medium=api&amp;utm_source=author_link</link> </author> </GoodreadsResponse>", {
        '/GoodreadsResponse/author/@id': 'id',
        '/GoodreadsResponse/author/name': 'name',
        '/GoodreadsResponse/author/link': 'link',
    });
    console.log("*****\n" + JSON.stringify(result, null, 2) + "\n*****");
}


result = saxtract.parse("<GoodreadsResponse> <Request> <authentication>true</authentication> <key><![CDATA[QgbaC2F0Iss4f1U7Db7X5g]]></key> <method><![CDATA[owned_books_user]]></method> </Request> <owned_books> <owned_book> <current_owner_id type='integer'>4603196</current_owner_id> <id type='integer'>16479833</id> <original_purchase_date type='datetime' nil='true'/> <original_purchase_location nil='true'/> <condition>unspecified</condition> <traded_count>0</traded_count> <link>http://www.goodreads.com/owned_books/16479833</link> <book> <id type='integer'>12605487</id> <isbn nil='true'/> <isbn13 nil='true'/> <text_reviews_count type='integer'>33</text_reviews_count> <title>Fuzzy Nation</title> <image_url>http://d202m5krfqbpi5.cloudfront.net/books/1316386163m/12605487.jpg</image_url> <small_image_url>http://d202m5krfqbpi5.cloudfront.net/books/1316386163s/12605487.jpg</small_image_url> <link>http://www.goodreads.com/book/show/12605487-fuzzy-nation</link> <num_pages>8</num_pages> <format>Audiobook</format> <edition_information>Unabridged - Audible Download</edition_information> <publisher>Audible Frontiers</publisher> <publication_day>10</publication_day> <publication_year>2011</publication_year> <publication_month>5</publication_month> <average_rating>4.04</average_rating> <ratings_count>6640</ratings_count> <description>In John Scalzi's re-imagining of H. Beam Piper's 1962 sci-fi classic Little Fuzzy, written with the full cooperation of the Piper Estate, Jack Holloway works alone for reasons he doesn't care to talk about. On the distant planet Zarathustra, Jack is content as an independent contractor for ZaraCorp, prospecting and surveying at his own pace. As for his past, that's not up for discussion.&lt;br /&gt;&lt;br /&gt;Then, in the wake of an accidental cliff collapse, Jack discovers a seam of unimaginably valuable jewels, to which he manages to lay legal claim just as ZaraCorp is cancelling their contract with him for his part in causing the collapse. Briefly in the catbird seat, legally speaking, Jack pressures ZaraCorp into recognizing his claim, and cuts them in as partners to help extract the wealth.&lt;br /&gt;&lt;br /&gt;But there's another wrinkle to ZaraCorp's relationship with the planet Zarathustra. Their entire legal right to exploit the verdant Earth-like planet, the basis of the wealth they derive from extracting its resources, is based on being able to certify to the authorities on Earth that Zarathustra is home to no sentient species. Then a small furry biped - trusting, appealing, and ridiculously cute - shows up at Jack's outback home. Followed by its family. As it dawns on Jack that despite their stature, these are people, he begins to suspect that ZaraCorp's claim to a planet's worth of wealth is very flimsy indeed and that ZaraCorp may stop at nothing to eliminate the fuzzys before their existence becomes more widely known.&lt;br /&gt;&lt;br /&gt;BONUS CONTENT: Includes the unabridged audiobook of H. Beam Piper's original Little Fuzzy, the novel that inspired Fuzzy Nation. In your Library, Part 1 will be the complete audio of Fuzzy Nation and Part 2 will be the complete Little Fuzzy.&lt;br /&gt;&lt;br /&gt;LENGTH&lt;br /&gt;13 hrs and 48 mins</description> <authors> <author> <id>4763</id> <name>John Scalzi</name> <image_url><![CDATA[http://d202m5krfqbpi5.cloudfront.net/authors/1236228326p5/4763.jpg]]></image_url> <small_image_url><![CDATA[http://d202m5krfqbpi5.cloudfront.net/authors/1236228326p2/4763.jpg]]></small_image_url> <link><![CDATA[http://www.goodreads.com/author/show/4763.John_Scalzi]]></link> <average_rating>4.00</average_rating> <ratings_count>123732</ratings_count> <text_reviews_count>13044</text_reviews_count> </author> </authors> <published>2011</published> </book> <review> <id>425922943</id> <rating>5</rating> <votes>0</votes> <spoiler_flag>false</spoiler_flag> <spoilers_state>none</spoilers_state> <shelves> <shelf name='read' /> </shelves> <recommended_for></recommended_for> <recommended_by></recommended_by> <started_at></started_at> <read_at></read_at> <date_added>Mon Oct 01 18:41:14 -0700 2012</date_added> <date_updated>Sun Aug 04 09:13:44 -0700 2013</date_updated> <read_count></read_count> <body> </body> <comments_count>review_comments_count</comments_count> <url><![CDATA[http://www.goodreads.com/review/show/425922943]]></url> <link><![CDATA[http://www.goodreads.com/review/show/425922943]]></link> <owned>1</owned> </review> </owned_book> </owned_books> </GoodreadsResponse>", {
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
            '/book/title': 'title'
        }
    }
});

console.log("*****\n" + JSON.stringify(result, null, 2) + "\n*****");
