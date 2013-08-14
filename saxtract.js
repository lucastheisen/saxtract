var libxml = require("libxmljs");

function addValue(obj, spec, value) {
    var type = typeof(spec),
        name,
        key;

    if ( type === 'string' ) {
        obj[spec] = value;
    }
    else if ( type === 'function' ) {
        spec( obj, value );
    }
    else {
        name = spec['name'];
        if ( spec['type'] === 'array' ) {
            if ( typeof(obj[name]) === 'undefined' ) {
                obj[name] = [];
            }
            obj[name].push( value );
        }
        else if ( spec['type'] === 'map' ) {
console.log("REMOVE ME: value: " + JSON.stringify(value));
            key = spec['key']; 
            if ( typeof(obj[name]) === 'undefined' ) {
                obj[name] = {};
            }
            obj[name][value[key]] = value;
        }
        else if ( spec['type'] === 'first' ) {
            if ( typeof(obj[name]) === 'undefined' ) {
                obj[name] = value;
            }
        }
        else { // last
            obj[name] = value;
        }
    }
}

exports.parse = function(xml, spec) {
    console.log('parsing ' + xml);
    var parser = new libxml.SaxParser(),
        result = {};
        elementStack = [{spec:spec,specPath:'',result:result}],
        buffer = null,
        skip = 0;

    parser.on('startElementNS', function(element, attrs, prefix, uri, namespaces) {
        if ( skip > 0 ) {
            skip++;
            return;
        }

        var stackTop = elementStack[elementStack.length-1],
            qualifiedElement,
            specPrefix,
            spec = stackTop.spec,
            result = stackTop.result;

        if ( uri ) {
            specPrefix = spec[uri];
            if ( typeof(specPrefix) === 'undefined' ) {
                // uri not in spec, so nothing could possibly match
                skip = 1;
                return;
            }
            else if ( specPrefix === '' ) {
                qualifiedElement = element;
            }
            else {
                qualifiedElement = specPrefix + ':' + element;
            }
        }
        else {
            qualifiedElement = element;
        }

        specPath = stackTop.specPath +  "/" + qualifiedElement;
        if ( spec[specPath] && typeof(spec[specPath]) === 'object' && spec[specPath].spec ) {
            spec = spec[specPath].spec;
            specPath = '';
            result = {};
        }

        elementStack.push({
            name: qualifiedElement,
            attrs: attrs,
            spec: spec,
            specPath: specPath,
            result: result
        });
    });
    parser.on('endElementNS', function(element, prefix, uri) {
        if ( skip > 0 ) {
            skip--;
            return;
        }

        var stackElement = elementStack.pop(),
            name = stackElement.name,
            attrs = stackElement.attrs,
            spec = stackElement.spec,
            path = stackElement.specPath,
            result = stackElement.result;
        

        if ( spec[path] && buffer !== null ) {
            addValue(result, spec[path], buffer.trim());
        }
        attrs.forEach(function(attribute) {
            var name = attribute[0];
                prefix = attribute[1],
                namespaceUri = attribute[2],
                value = attribute[3],
                attributePath = path + 
                    '/@' + 
                    (namespaceUri !== '' && spec[namespaceUri] ? spec[namespaceUri] + ':' : '') + 
                    name;
            
            if ( spec[attributePath] ) {
                addValue(result, spec[attributePath], value);
            }
        });
        if ( path === '' && elementStack.length > 0 ) {
            var parentElement = elementStack[elementStack.length-1],
                pathInParent = parentElement.specPath + "/" + name;
            addValue(parentElement.result, parentElement.spec[pathInParent], result);
        }
        buffer = null;
    });
    parser.on('cdata', function(cdata) {
        if ( skip > 0 ) return;
        if ( typeof(cdata) !== 'undefined' ) {
            if ( buffer === null ) {
                buffer = cdata;
            }
            else {
                buffer += cdata; 
            }
        }
    });
    parser.on('characters', function(characters) {
        if ( skip > 0 ) return;
        if ( typeof(characters) !== 'undefined' ) {
            if ( buffer === null ) {
                buffer = characters;
            }
            else {
                buffer += characters; 
            }
        }
    });
    parser.on('comment', function(message) {
        console.log(message);
    });
    parser.on('warning', function(message) {
        console.log(message);
    });
    parser.on('error', function(message) {
        console.log(message);
    });

    parser.parseString(xml);
    return result;
}
