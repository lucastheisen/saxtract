var sax = require("sax"),
    saxhandler = require("../common/saxhandler");

exports.logging = false;
exports.preserveWhitespace = false;
exports.parse = function(xml, spec, preserveWhitespace) {
    var parser = new sax.parser(true, {'xmlns': true});
        result = {},
        handler = saxhandler.handler(spec, result, {
            'preserveWhitespace': (typeof(preserveWhitespace) === 'undefined')
                ? exports.preserveWhitespace
                : preserveWhitespace,
            'logging': exports.logging});

    exports.logging && console.log('parsing ' + xml);

    parser.onopentag = function(node) {     
        var element = node.local || node.name, 
            attrs = [],
            prefix = node.prefix, 
            uri = node.uri;
        if (attrs) {
            Object.keys(node.attributes).forEach(function(key) {
                var attr = node.attributes[key];
                if ("http://www.w3.org/2000/xmlns/" === attr.uri) {
                    return;
                }
                attrs.push([
                    attr.local || attr.name, 
                    attr.prefix,
                    attr.uri,
                    attr.value
                ]);
            });
        }
        handler.startElementNS(element, attrs, prefix, uri);
    };

    parser.onclosetag = function(element) {
        handler.endElementNS(element);
    };

    parser.oncdata = function(cdata) {
        handler.cdata(cdata);
    };

    parser.ontext = function(characters) {
        handler.characters(characters);
    };

    parser.oncomment = function(message) {
        handler.comment(message);
    };

    parser.onerror = function(message) {
        handler.error(message);
        this._parser.error = null;
        this._parser.resume();
    };

    parser.write(xml).close();
    return result;
}
