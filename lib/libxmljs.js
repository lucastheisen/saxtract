var libxml = require("libxmljs"),
    saxhandler = require("../common/saxhandler");

exports.logging = false;
exports.preserveWhitespace = false;
exports.parse = function(xml, spec, preserveWhitespace) {
    var parser = new libxml.SaxParser(),
        result = {},
        handler = saxhandler.handler(spec, result, {
            'preserveWhitespace': (typeof(preserveWhitespace) === 'undefined')
                ? exports.preserveWhitespace
                : preserveWhitespace,
            'logging': exports.logging});

    exports.logging && console.log('parsing ' + xml);

    parser.on('startElementNS', handler.startElementNS);
    parser.on('endElementNS', handler.endElementNS);
    parser.on('cdata', handler.cdata);
    parser.on('characters', handler.characters);
    parser.on('comment', handler.comment);
    parser.on('warning', handler.warning);
    parser.on('error', handler.error);

    parser.parseString(xml);
    return result;
}
