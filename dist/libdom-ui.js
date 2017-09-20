(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global['libdom-ui'] = {})));
}(this, (function (exports) { 'use strict';

var global$1$1 = typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {};

var global$1 = typeof global$1$1 !== "undefined" ? global$1$1 :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {};

var ROOT = global$1;
var browser = isBrowser();
var nodeVersions = nodeVersion(browser);
var nodejs = nodeVersions && !!nodeVersions.node;
var userAgent = getUserAgent(browser,
                             nodeVersions);
var validSignature = hasValidSignature();
var ajax = ROOT.XMLHttpRequest || null;
var indexOfSupport = typeof Array.prototype.indexOf !== "undefined";


// detect browser
function isBrowser() {
    var G = ROOT,
        win = G.document,
        doc = G,
        result = !!doc && !!win &&
                win.self === (doc.defaultView || doc.parentWindow);
    // cleanup
    G = win = doc = null;
    return result;
}

// detect nodejs info
function nodeVersion(browser) {
    var G = ROOT,
        result = browser ?
                    false :
                    ('process' in G && G.process.versions) || false;
    G = null;
    
    return result;
}

// detect userAgent
function getUserAgent(browser, nodeVersions) {
    var G = ROOT,
        result = 'Unknown',
        proc = null;
    
    if (browser) {
        result = G.navigator.userAgent;
        
    }
    else if (nodeVersions && 'process' in G) {
        proc = G.process;
        result = (['Node ',
                    nodeVersions.node,
                    '(',
                        proc.platform,
                        '; V8 ',
                        nodeVersions.v8 || 'unknown',
                        '; arch ',
                        proc.arch,
                    ')']).
                    join('');
    }
    
    G = proc = null;
    
    return result;       
    
}

function hasValidSignature() {
    var toString = Object.prototype.toString,
        objectSignature = '[object Object]';
        
    return toString.call(null) !== objectSignature ||
                        toString.call(void(0)) !== objectSignature;
}


ROOT = null;








var detect = Object.freeze({
	browser: browser,
	nodeVersions: nodeVersions,
	nodejs: nodejs,
	userAgent: userAgent,
	validSignature: validSignature,
	ajax: ajax,
	indexOfSupport: indexOfSupport
});

var OBJECT_SIGNATURE = '[object Object]';
var ARRAY_SIGNATURE = '[object Array]';
var NULL_SIGNATURE = '[object Null]';
var UNDEFINED_SIGNATURE = '[object Undefined]';
var NUMBER_SIGNATURE = '[object Number]';
var STRING_SIGNATURE = '[object String]';
var BOOLEAN_SIGNATURE = '[object Boolean]';
var METHOD_SIGNATURE = '[object Function]';
var DATE_SIGNATURE = '[object Date]';
var REGEX_SIGNATURE = '[object RegExp]';
var STRING = 'string';
var NUMBER = 'number';
var BOOLEAN = 'boolean';
var OBJECT = Object;
var O$1 = OBJECT.prototype;
var toString = O$1.toString;

/** is object **/
function w3cIsObject(subject) {
    return toString.call(subject) === OBJECT_SIGNATURE;
}

function ieIsObject(subject) {
    return subject !== null &&
            subject !== void(0) &&
            toString.call(subject) === OBJECT_SIGNATURE;
}

var object = validSignature ?
                        w3cIsObject : ieIsObject;

/** is object signature **/
function signature(subject) {
        if (subject === undefined) {
            return UNDEFINED_SIGNATURE;
        }
        
        if (subject === null ||
            (typeof subject === NUMBER && !isFinite(subject))) {
            return NULL_SIGNATURE;
        }
        
        return toString.call(subject);
    }

/** is native object **/
function nativeObject(subject) {
        var O = OBJECT;
        var constructor, result;
        
        if (signature(subject) === OBJECT_SIGNATURE) {
            constructor = subject.constructor;
            
            // check constructor
            if (O.hasOwnProperty.call(subject, 'constructor')) {
                delete subject.constructor;
                result = subject.constructor === O;
                subject.constructor = constructor;
                return result;
            }
            return constructor === O;
        }
        
        return false;
    }
    
/** is string **/
function string(subject, allowEmpty) {
        return (typeof subject === STRING ||
                O$1.toString.call(subject) === STRING_SIGNATURE) &&
    
                (allowEmpty === true || subject.length !== 0);
    }
    
/** is number **/
function number(subject) {
        return typeof subject === NUMBER && isFinite(subject);
    }
    
/** is scalar **/
function scalar(subject) {
        switch (typeof subject) {
        case NUMBER: return isFinite(subject);
        case BOOLEAN:
        case STRING: return true;
        }
        return false;
    }
    
/** is array **/
function array(subject, notEmpty) {
        return toString.call(subject) === ARRAY_SIGNATURE &&
                (notEmpty !== true || subject.length !== 0);
    }
    
/** is function **/
function method(subject) {
        return toString.call(subject) === METHOD_SIGNATURE;
    }



/** is date **/
function date(subject) {
        return toString.call(subject) === DATE_SIGNATURE;
    }

/** is regexp **/
function regex(subject) {
        return toString.call(subject) === REGEX_SIGNATURE;
    }

/** is promise or thenable **/
function thenable(subject) {
        // filter non-thenable scalar natives
        switch (subject) {
        case undefined:
        case null:
        case true:
        case false:
        case NaN: return false;
        }
        // filter scalar
        switch (signature(subject)) {
        case NUMBER_SIGNATURE:
        case STRING_SIGNATURE:
        case BOOLEAN_SIGNATURE: return false;
        }
        
        return 'then' in subject && method(subject.then);
    }
    
/** is array-like iterable **/
function iterable(subject) {
        var len;
        
        // filter non-iterable scalar natives
        switch (subject) {
        case undefined:
        case null:
        case true:
        case false:
        case NaN: return false;
        }
        
        // try signature
        switch (signature(subject)) {
        case NUMBER_SIGNATURE:
        case BOOLEAN_SIGNATURE:
            // bogus js engines provides readonly "length" property to functions
        case METHOD_SIGNATURE: return false;
    
        case STRING_SIGNATURE:
        case ARRAY_SIGNATURE: return true;
        }
    
        return 'length' in subject &&
                number(len = subject.length) &&
                len > -1;
    }
    
function type(subject, isType) {
        var len;
        switch (isType) {
        case "scalar":
            switch (signature(subject)) {
            case STRING_SIGNATURE:
            case NUMBER_SIGNATURE:
            case BOOLEAN_SIGNATURE: return true;
            }
            return false;
        
        case "regexp":
        case "regex":
            isType = "RegExp";
            break;
        
        case "method":
            isType = "Function";
            break;
        
        case "native":
        case "nativeObject":
            return nativeObject(subject);
        }
        
        if (typeof isType === STRING) {
            len = isType.length;
            if (len) {
                return signature(subject) === '[object ' +
                                            isType.charAt(0).toUpperCase() +
                                            isType.substring(1, len) +
                                            ']';
            }
        }
        return false;
    }

/**
 * @external libcore
 */

var Obj = Object;
var O = Obj.prototype;
var EACH = typeof Obj.getOwnPropertyNames === 'function' ?
                es5each : es3each;
var OHasOwn = O.hasOwnProperty;
var ARRAY_INDEX_RE = /^[1-9][0-9]*|0$/;
    

function empty() {
    
}

function isValidObject(target) {
    var signature$$1 = signature(target);
    
    switch (signature$$1) {
    case REGEX_SIGNATURE:
    case DATE_SIGNATURE:
    case ARRAY_SIGNATURE:
    case OBJECT_SIGNATURE:
    case METHOD_SIGNATURE: return signature$$1;
    }
    return false;
}

/**
 * Assign properties of source Object to target Object
 * @alias module:libcore.assign
 * @param {Object} target - the target object
 * @param {Object} source - the source object containing properties
 *                          to be assigned to target object
 * @param {Object} [defaults] - object containing default properties
 *                          which will be assigned first to
 *                          target before source.
 * @param {Boolean} [ownedOnly] - only assign properties owned by "source"
 * @returns {Object} target object from first parameter
 */


function apply(value, name) {
    /*jshint validthis:true */
    this[name] = value;
}

/**
 * Relocate and rename properties of source Object into target Object.
 * 
 * @name libcore.rehash
 * @function
 * @param {Object|Function} target - the target object
 * @param {Object|Function} source - the source object containing properties
 *                                  to be relocated.
 * @param {Object} access - the rename map object containing "renamed property"
 *                          as map object's property name, and
 *                          "source property name" as map object's
 *                          property value. (e.g. { "newname": "from source" })
 * @returns {Object} target object from first parameter
 */


function applyProperties(value, name) {
    /*jshint validthis:true */
    var target = this;
    target[0][name] = target[1][value];
    target = null;
}

function assignAll(target, source, defaults) {
    var onAssign = apply,
        eachProperty = EACH;
        
    if (defaults) {
        eachProperty(defaults, onAssign, target, false);
    }
    
    eachProperty(source, onAssign, target);
    
    return target;
}


/**
 * Iterates all iteratable property of an object calling "handler" parameter on
 *      each iteration.
 * @name libcore.each
 * @function
 * @param {Object} subject
 * @param {Function} handler - the callback of each iteration of
 *                          "subject" object's property.
 * @param {*} [scope] - "this" object to use inside the "handler" parameter
 * @param {boolean} [hasown] - performs checking to only include
 *                          source object property that is overridden
 *                          (Object.protototype.hasOwnProperty() returns true)
 *                          when this parameter is set to true.
 * @returns {Object} The subject parameter
 */
function es3each(subject, handler, scope, hasown) {
    var hasOwn = OHasOwn,
        noChecking = hasown === false;
    var name;
    
    if (!isValidObject(subject)) {
        throw new Error("Invalid [subject] parameter.");
    }
    
    if (arguments.length > 3 && typeof hasown !== 'boolean') {
        throw new Error("Invalid [hasown] hasOwnProperty parameter.");
    }
    
    if (scope === void(0)) {
        scope = null;
    }
    
    for (name in subject) {
        if ((noChecking || hasOwn.call(subject, name)) &&
            handler.call(scope, subject[name], name, subject) === false) {
            break;
        }
    }
    
    return subject;
}

function es5each(subject, handler, scope, hasown) {
    var hasOwn = OHasOwn,
        noChecking = hasown === false;
    var names, name, c, l;
    
    if (!isValidObject(subject)) {
        throw new Error("Invalid [subject] parameter.");
    }
    
    if (arguments.length > 3 && typeof hasown !== 'boolean') {
        throw new Error("Invalid [hasown] hasOwnProperty parameter.");
    }
    
    if (scope === void(0)) {
        scope = null;
    }
    
    names = Obj.getOwnPropertyNames(subject);
    for (c = -1, l = names.length; l--;) {
        name = names[++c];
        if ((noChecking || hasOwn.call(subject, name)) &&
            handler.call(scope, subject[name], name, subject) === false) {
            break;
        }
    }
    
    return subject;
}

/**
 * Checks if "subject" Object contains overridden property.
 *      The same symantics of Object.prototype.hasOwnProperty.
 *      
 * @name libcore.contains
 * @function
 * @param {Object} subject
 * @param {String} property - Property Name to inspect
 * @returns {boolean} True if subject Object contains property and dirty.
 *                      False if subject Object's property do not exist or not
 *                      dirty.
 */




/**
 * Clears Object properties. This method only deletes overridden properties and
 *      will not fill "undefined" to non-owned properties from its prototype.
 * @name libcore.clear
 * @function
 * @param {Object} subject
 * @returns {Object} subject parameter.
 */

function applyClear() {
    delete arguments[2][arguments[1]];
}

function applyFillin(value, name) {
    /* jshint validthis:true */
    var target = this;
    if (!contains(target, name)) {
        target[name] = value;
    }
    target = null;
}

/**
 * Builds instance of "Class" parameter without executing its constructor.
 * @name libcore.instantiate
 * @function
 * @param {Function} Class
 * @param {Object} overrides
 * @returns {Object} Instance created from Class without executing
 *                      its constructor.
 */


/**
 * Deep compares two scalar, array, object, regex and date objects
 * @name libcore.compare
 * @function
 * @param {*} object1
 * @param {*} object2
 * @returns {boolean} True if scalar, regex, date, object properties, or array
 *                      items of object1 is identical to object2.
 */


function compareLookback(object1, object2, references) {
    var isObject = object,
        isArray = array,
        isRegex = regex,
        isDate = date,
        onCompare = onEachCompareObject,
        each = EACH,
        me = compareLookback,
        depth = references.length;
    var len, context;
    
    switch (true) {
        
    // prioritize same object, same type comparison
    case object1 === object2: return true;
    
    // native object comparison
    case isObject(object1):
        if (!isObject(object2)) {
            return false;
        }
        
        // check if object is in references
        if (references.lastIndexOf(object1) !== -1 &&
            references.lastIndexOf(object2) !== -1) {
            return true;
        }
        
        // proceed
        references[depth] = object1;
        references[depth + 1] = object2;
        
        context = [object2, references, true];
        each(object1, onCompare, context);
        if (!context[2]) {
            return false;
        }
        
        context[0] = object1;
        each(object2, onCompare, context);
        if (!context[2]) {
            return false;
        }
        
        references.length = depth;
        
        return true;
    
    // array comparison
    case isArray(object1):
        if (!isArray(object2)) {
            return false;
        }
        
        // check references
        if (references.lastIndexOf(object1) !== -1 &&
            references.lastIndexOf(object2) !== -1) {
            return true;
        }
        
        len = object1.length;
        
        if (len !== object2.length) {
            return false;
        }
        
        // proceed
        references[depth] = object1;
        references[depth + 1] = object2;
        
        for (; len--;) {
            if (!me(object1[len], object2[len], references)) {
                return false;
            }
        }
        
        references.length = depth;
        
        return true;
        
    
    // RegExp compare
    case isRegex(object1):
        return isRegex(object2) && object1.source === object2.source;
    
    // Date compare
    case isDate(object1):
        return isDate(object2) && object1.toString() === object2.toString();
    }
    
    return false;
}

function onEachCompareObject(value, name) {
    /* jshint validthis:true */
    var context = this,
        target = context[0],
        result = name in target ?
                    compareLookback(value, target[name], context[1]) :
                    false;
    context[2] = result;
    
    return result;
}

/**
 * Clones scalar, array, object, regex or date objects
 * @name libcore.clone
 * @function
 * @param {*} data - scalar, array, object, regex or date object to clone.
 * @param {boolean} [deep] - apply deep clone to object properties or
 *                          array items.
 * @returns {*} Cloned object based from data
 */



function cloneObject(data, parents, cloned) {
    var depth = parents.length,
        recreated = {},
        context = [recreated,
                   parents,
                   cloned];
    
    parents[depth] = data;
    cloned[depth] = recreated;
    
    EACH(data, onEachClonedProperty, context);
    
    parents.length = cloned.length = depth;
    
    return recreated;
}

function cloneArray(data, parents, cloned) {
    var depth = parents.length,
        onProperty = onEachClonedProperty,
        recreated = [],
        context = [recreated,
                   parents,
                   cloned],
        c = 0,
        l = data.length;
    
    parents[depth] = data;
    cloned[depth] = recreated;
    
    for (; l--; c++) {
        onProperty.call(context,
                        data[c],
                        c,
                        data);
    }
    
    parents.length = cloned.length = depth;
    
    return recreated;
}

function onEachClonedProperty(value, name) {
    var /* jshint validthis:true */
        context = this,
        isNative = nativeObject(value),
        parents = context[1],
        cloned = context[2];
    var index;
    
    if (isNative || array(value)) {
        index = parents.lastIndexOf(value);
        value = index === -1 ?
                    (isNative ?
                        cloneObject :
                        cloneArray)(value, parents, cloned) :
                    
                    cloned[index];
    }
    else {
        value = clone(value, false);
    }
    
    context[0][name] = value;
}

function onMaxNumericIndex(value, name, context) {
    if (ARRAY_INDEX_RE.test(name)) {
        context[0] = Math.max(1 * name, context[0]);
    }
}



function assign(target, source, defaults, ownedOnly) {
        var onAssign = apply,
            is = isValidObject,
            eachProperty = EACH,
            len = arguments.length;
        
        if (!is(target)) {
            throw new Error("Invalid [target] parameter.");
        }
        
        if (!is(source)) {
            throw new Error("Invalid [source] parameter.");
        }
        
        if (typeof defaults === 'boolean') {
            ownedOnly = defaults;
            len = 2;
        }
        else {
            ownedOnly = ownedOnly !== false;
        }
        
        if (is(defaults)) {
            eachProperty(defaults, onAssign, target, ownedOnly);
        }
        else if (len > 2) {
            throw new Error("Invalid [defaults] parameter.");
        }
        
        eachProperty(source, onAssign, target, ownedOnly);
        
        return target;
    }

function rehash(target, source, access) {
        var is = isValidObject,
            context = [target, source];
            
        if (!is(target)) {
            throw new Error("Invalid [target] parameter.");
        }
        
        if (!is(source)) {
            throw new Error("Invalid [source] parameter.");
        }
        
        if (!object(access)) {
            throw new Error("Invalid [access] parameter.");
        }
        
        EACH(access, applyProperties, context);
        context = context[0] = context[1] =  null;
        return target;
    }

function contains(subject, property) {
    
        if (!string(property) && !number(property)) {
            throw new Error("Invalid [property] parameter.");
        }
        
        return OHasOwn.call(subject, property);
    }

function instantiate(Class, overrides) {
        empty.prototype = Class.prototype;
        
        if (object(overrides)) {
            return assign(new empty(), overrides);
        }
        return new empty();
    }
    
function clone(data, deep) {
        var isNative = nativeObject(data);
        
        deep = deep === true;
        
        if (isNative || array(data)) {
            return deep ?
                        
                        (isNative ? cloneObject : cloneArray)(data, [], []) :
                        
                        (isNative ? assignAll({}, data) : data.slice(0));
        }
        
        if (regex(data)) {
            return new RegExp(data.source, data.flags);
        }
        else if (date(data)) {
            return new Date(data.getFullYear(),
                        data.getMonth(),
                        data.getDate(),
                        data.getHours(),
                        data.getMinutes(),
                        data.getSeconds(),
                        data.getMilliseconds());
        }
        
        return data;
    }
    
function compare(object1, object2) {
        return compareLookback(object1, object2, []);
    }
    
function fillin(target, source, hasown) {
        if (!isValidObject(target)) {
            throw new Error("Invalid [target] parameter");
        }
        EACH(source, applyFillin, target, hasown !== false);
        return target;
    }

function clear(subject) {
        EACH(subject, applyClear, null, true);
        return subject;
    }
    
function maxObjectIndex(subject) {
        var context;
        
        if (array(subject)) {
            return subject.length - 1;
        }
        
        if (isValidObject(subject)) {
            
            context = [-1];
            EACH(subject, onMaxNumericIndex, context);
            return context[0];
        }
        return false;
    }

var CHAIN = null;

function use(chain) {
        CHAIN = chain;
    }
    
function getModule() {
        return CHAIN;
    }

var G = global$1;
var NAME_RE = /^(([^\.]+\.)*)((before|after)\:)?([a-zA-Z0-9\_\-\.]+)$/;
var POSITION_BEFORE = 1;
var POSITION_AFTER = 2;
var RUNNERS = {};
var NAMESPACES = {};
var INVALID_NAME$1 = 'Invalid [name] parameter.';
var INVALID_HANDLER = 'Invalid [handler] parameter.';
var NATIVE_SET_IMMEDIATE = !!G.setImmediate;
var setAsync = NATIVE_SET_IMMEDIATE ?
                    nativeSetImmediate : timeoutAsync;
var clearAsync = NATIVE_SET_IMMEDIATE ?
                    nativeClearImmediate : clearTimeoutAsync;
                    
function empty$1() {
}

function get(name) {
    var info = getRunners(name);
    
    if (info) {
        return info[0][info[1]];
    }
    
    return void(0);
}

function getRunners(name) {
    var list = RUNNERS,
        parsed = parseName(name);
    var access, position;
    
    if (parsed) {
        access = ':' + parsed[1];
        
        if (access in list) {
            position = parsed[0];
            return [list[access],
                    getPositionAccess(position),
                    position];
            
        }
    }
    
    return void(0);
}

function purgeRunners(name, after) {
    var info = getRunners(name);
    var runners, access;
    
    if (info) {
        access = info[1];
        
        switch (after) {
        case true:
            access = 'after';
            break;
        
        case false:
            access = 'before';
            break;
        
        case null:
        case undefined:
            access = false;
        }

        if (!access || access === 'before') {
            runners = info[0].before;
            runners.splice(0, runners.length);
        }
        
        if (!access || access === 'after') {
            runners = info[0].after;
            runners.splice(0, runners.length);
        }
        
        
    }
    
    return getModule();
}

function getPositionAccess(input) {
    return input === POSITION_BEFORE ? 'before' : 'after';
}

function parseName(name) {
    var match = string(name) && name.match(NAME_RE);
    var position, namespace;
    
    if (match) {
        namespace = match[1];
        position = match[4] === 'before' ? POSITION_BEFORE : POSITION_AFTER;
        return [position, (namespace || '') + match[5]];
        
    }
    
    return void(0);
    
}

function timeoutAsync(handler) {
    if (!method(handler)) {
        throw new Error(INVALID_HANDLER);
    }
    return G.setTimeout(handler, 1);
}

function clearTimeoutAsync(id) {
    try {
        G.clearTimeout(id);
    }
    catch (e) {}
    return getModule();
}

function nativeSetImmediate (handler) {
    if (!method(handler)) {
        throw new Error(INVALID_HANDLER);
    }
    return G.setImmediate(handler);
}

function nativeClearImmediate(id) {
    try {
        G.clearImmediate(id);
    }
    catch (e) {}
    return getModule();
}

function BaseMiddleware() {
}

BaseMiddleware.prototype = {
    constructor: BaseMiddleware,
    
    run: function (name, args, scope) {
        return run(this.access + name, args, scope);
    },
    
    register: function (name, handler) {
        register(this.access + name, handler);
        
        return this;
    },
    
    clear: function (name, after) {
        var access = this.access;
        
        if (!string(name)) {
            throw new Error(INVALID_NAME$1);
        }
        
        if (arguments.length > 1) {
            purgeRunners(access + name, after);
        }
        else {
            purgeRunners(access + name);
        }
        return this;
        
    }
};

function run(name, args, scope) {
        var c, l, runners, result;
        
        if (!string(name)) {
            throw new Error(INVALID_NAME$1);
        }
        
        runners = get(name);
        
        if (runners) {
            
            if (typeof scope === 'undefined') {
                scope = null;
            }
            
            args = iterable(args) ?
                    Array.prototype.slice.call(args, 0) : [];
            
            for (c = -1, l = runners.length; l--;) {
                result = runners[++c].apply(scope, args);
                if (result !== undefined) {
                    args = [result];
                }
            }
            
            args.splice(0, args.length);
            
            return result;
        }
        
        return undefined;
    }

function register(name, handler) {
        var list = RUNNERS;
        var access, items, parsed;
        
        if (!string(name)) {
            throw new Error(INVALID_NAME$1);
        }
        
        parsed = parseName(name);
        
        if (!method(handler)) {
            throw new Error(INVALID_HANDLER);
        }
        
        if (parsed) {
            
            name = parsed[1];
            access = ':' + name;
            if (!(access in list)) {
                
                list[access] = {
                    name: name,
                    before: [],
                    after: []
                };
            }
            
            items = list[access][getPositionAccess(parsed[0])];
            
            items[items.length] = handler;
        }
        
        return getModule();
    }
    
function clearRunner(name, after) {
        
        if (!string(name)) {
            throw new Error(INVALID_NAME$1);
        }
        
        if (arguments.length > 1) {
            purgeRunners(name, after);
        }
        else {
            purgeRunners(name);
        }
        
        return getModule();
    }

function middleware(name) {
        var list = NAMESPACES;
        var access, registered, proto;
        
        function Middleware() {
            BaseMiddleware.apply(this, arguments);
        }
        
        if (!string(name)) {
            throw new Error(INVALID_NAME$1);
        }

        access = name + '.';
        if (!(access in list)) {
            empty$1.prototype = BaseMiddleware.prototype;
            proto = new empty$1(access);
            proto.constructor = Middleware;
            proto.access = access;
            Middleware.prototype = proto;
            
            list[access] = registered = new Middleware();
            
            return registered;
        }
        
        return list[access];
    }

// motivation of set operations:
// https://www.probabilitycourse.com/chapter1/1_2_2_set_operations.php
//DETECT = require('./detect.js'),
    //OBJECT = require('./object.js'),
    //TYPE = require('./type.js'),

var INVALID_ARRAY1 = 'Invalid [array1] parameter.';
var INVALID_ARRAY2 = 'Invalid [array2] parameter.';
var A = Array.prototype;

function indexOf(subject) {
    /*jshint validthis:true */
    var array$$1 = this,
        l = array$$1.length,
        c = -1;
    
    for (; l--;) {
        if (subject === array$$1[++c]) {
            array$$1 = null;
            return c;
        }
    }
    
    return -1;
}

function lastIndexOf(subject) {
    /*jshint validthis:true */
    var array$$1 = this,
        l = array$$1.length;
        
    for (; l--;) {
        if (subject === array$$1[l]) {
            array$$1 = null;
            return l;
        }
    }
    
    return -1;
}

// apply polyfill
if (!indexOfSupport) {
    assign(A, {
        indexOf: indexOf,
        lastIndexOf: lastIndexOf
    });
}

/**
 * Creates a union of two arrays
 * @name libcore.unionList
 * @function
 * @param {Array} array1 - source array
 * @param {Array} array2 - array to merge
 * @param {boolean} [clone] - Filters array1 parameter with union of array2
 *                          if this parameter is false. It returns a new set
 *                          of array containing union of array1 and array2
 *                          otherwise.
 * @returns {Array} union of first two array parameters
 */
function unionList(array1, array2, clone$$1) {
        var isarray = array;
        var subject, l, len, total;
        
        if (!isarray(array1)) {
            throw new Error(INVALID_ARRAY1);
        }
        
        if (!isarray(array2)) {
            throw new Error(INVALID_ARRAY2);
        }
        
        array1 = clone$$1 === true ? array1.slice(0) : array1;
        
        // apply
        array1.push.apply(array1, array2);
        total = array1.length;
        
        // apply unique
        found: for (l = total; l--;) {
            subject = array1[l];
            
            // remove if not unique
            for (len = total; len--;) {
                if (l !== len && subject === array1[len]) {
                    total--;
                    array1.splice(l, 1);
                    continue found;
                }
            }
        }
        
        return array1;
    }

/**
 * Creates an intersection of two arrays
 * @name libcore.intersect
 * @function
 * @param {Array} array1 - source array 
 * @param {Array} array2 - array to intersect
 * @param {boolean} [clone] - Filters array1 parameter with intersection of
 *                          array2 if this parameter is false. It returns a
 *                          new set of array containing intersection of
 *                          array1 and array2 otherwise.
 * @returns {Array} intersection of first two array parameters
 */
function intersectList(array1, array2, clone$$1) {
        var isarray = array;
        var subject, l1, l2, total1, total2;
        
        if (!isarray(array1)) {
            throw new Error(INVALID_ARRAY1);
        }
        
        if (!isarray(array2)) {
            throw new Error(INVALID_ARRAY2);
        }
        
        total1 = array1.length;
        total2 = array2.length;
            
        // create a copy
        array1 = clone$$1 === true ? array1.slice(0) : array1;
        
        found: for (l1 = total1; l1--;) {
            subject = array1[l1];
            foundSame: for (l2 = total2; l2--;) {
                if (subject === array2[l2]) {
                    // intersect must be unique
                    for (l2 = total1; l2--;) {
                        if (l2 !== l1 && subject === array1[l2]) {
                            break foundSame;
                        }
                    }
                    continue found;
                }
            }
            array1.splice(l1, 1);
            total1--;
        }
        
        return array1;
    }


/**
 * Creates a difference of two arrays
 * @name libcore.differenceList
 * @function
 * @param {Array} array1 - source array 
 * @param {Array} array2 - array to be applied as difference of array1
 * @param {boolean} [clone] - Filters array1 parameter with difference of array2
 *                          if this parameter is false. It returns a new set
 *                          of array containing difference of
 *                          array1 and array2 otherwise.
 * @returns {Array} difference of first two array parameters
 */
function differenceList(array1, array2, clone$$1) {
        var isarray = array;
        var subject, l1, l2, total1, total2;
        
        if (!isarray(array1)) {
            throw new Error(INVALID_ARRAY1);
        }
        
        if (!isarray(array2)) {
            throw new Error(INVALID_ARRAY2);
        }
        
        total1 = array1.length;
        total2 = array2.length;
            
        // create a copy
        array1 = clone$$1 === true ? array1.slice(0) : array1;
        
        found: for (l1 = total1; l1--;) {
            subject = array1[l1];
            
            // remove if found
            for (l2 = total2; l2--;) {
                if (subject === array2[l2]) {
                    array1.splice(l1, 1);
                    total1--;
                    continue found;
                }
            }
            
            // diff must be unique
            for (l2 = total1; l2--;) {
                if (l2 !== l1 && subject === array1[l2]) {
                    array1.splice(l1, 1);
                    total1--;
                    continue found;
                }
            }
        }
        
        return array1;
    }

var HALF_BYTE = 0x80;
var SIX_BITS = 0x3f;
var ONE_BYTE = 0xff;
var fromCharCode = String.fromCharCode;
var BASE64_MAP =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var NOT_BASE64_RE = /[^a-zA-Z0-9\+\/\=]/g;
var BASE64_EXCESS_REMOVE_RE = /[^a-zA-Z0-9\+\/]/;
var CAMEL_RE = /[^a-z]+[a-z]/ig;
var UNCAMEL_RE = /\-*[A-Z]/g;
var TRIM_RE = /^\s+|\s+$/g;
var INVALID_SUBJECT = 'Invalid [subject] parameter.';

function applyCamelize(all) {
    return all.charAt(all.length - 1).toUpperCase();
}

function applyUncamelize(all) {
    return '-' + all.charAt(all.length -1).toLowerCase();
}


function camelize(subject) {
        return subject.replace(CAMEL_RE, applyCamelize);
    }
    
function uncamelize(subject) {
        return subject.replace(UNCAMEL_RE, applyUncamelize);
    }
    

function utf2bin(subject) {
        var half = HALF_BYTE,
            sixBits = SIX_BITS,
            code2char = fromCharCode,
            utf8 = [],
            ul = 0;
        var code, c, l;
        
        if (!string(subject, true)) {
            throw new Error(INVALID_SUBJECT);
        }
        
        for (c = -1, l = subject.length; l--;) {
            code = subject.charCodeAt(++c);
            
            if (code < half) {
                utf8[ul++] = code2char(code);
            }
            else if (code < 0x800) {
                utf8[ul++] = code2char(0xc0 | (code >> 6));
                utf8[ul++] = code2char(half | (code & sixBits));
            }
            else if (code < 0xd800 || code > 0xdfff) {
                utf8[ul++] = code2char(0xe0 | (code >> 12));
                utf8[ul++] = code2char(half | ((code >> 6) & sixBits));
                utf8[ul++] = code2char(half | (code  & sixBits));
            }
            else {
                l--;
                code = 0x10000 + (((code & 0x3ff)<<10)
                          | (subject.charCodeAt(++c) & 0x3ff));
                
                utf8[ul++] = code2char(0xf0 | (code >> 18));
                utf8[ul++] = code2char(half | ((code >> 12) & sixBits));
                utf8[ul++] = code2char(half | ((code >> 6) & sixBits));
                utf8[ul++] = code2char(half | (code >> sixBits));
                
            }
        }
        
        return utf8.join('');
    }


// based from https://gist.github.com/weishuaiwang/4221687
function bin2utf(subject) {
        var code2char = fromCharCode;
        var utf16, ul, c, l, code;
        
        if (!string(subject, true)) {
            throw new Error(INVALID_SUBJECT);
        }
        
        utf16 = [];
        ul = 0;
        for (c = -1, l = subject.length; l--;) {
            code = subject.charCodeAt(++c);
            switch (code >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                utf16[ul++] = subject.charAt(c);
                break;
            case 12:
            case 13:
                // 110x xxxx 10xx xxxx
                l--;
                utf16[ul++] = code2char(((code & 0x1F) << 6) |
                                        (subject.charCodeAt(++c) & 0x3F));
                break;
            case 14:
                // 1110 xxxx10xx xxxx10xx xxxx
                utf16[ul++] = code2char(((code & 0x0F) << 12) |
                                        ((subject.charCodeAt(++c) & 0x3F) << 6) |
                                        ((subject.charCodeAt(++c) & 0x3F) << 0));
                l -= 2;
                break;
            }
        }
        
        return utf16.join("");
    }

function encode64(subject) {
        var map = BASE64_MAP,
            buffer = [],
            bl = 0,
            c = -1,
            excess = false,
            pad = map.charAt(64);
        var l, total, code, flag, end, chr;
        
        if (!string(subject, true)) {
            throw new Error(INVALID_SUBJECT);
        }

        // decode to ascii
        subject = utf2bin(subject);
        l = total = subject.length;
        
        for (; l--;) {
            code = subject.charCodeAt(++c);
            flag = c % 3;
            
            switch (flag) {
            case 0:
                chr = map.charAt((code & 0xfc) >> 2);
                excess = (code & 0x03) << 4;
                break;
            case 1:
                chr = map.charAt(excess | (code & 0xf0) >> 4);
                excess = (code & 0x0f) << 2;
                break;
            case 2:
                chr = map.charAt(excess | (code & 0xc0) >> 6);
                excess = code & 0x3f;
            }
            buffer[bl++] = chr;
            
            end = !l;
            if ((end || flag === 2)) {
                buffer[bl++] = map.charAt(excess);
            }
            
            if (!l) {
                l = bl % 4;
                for (l = l && 4 - l; l--;) {
                    buffer[bl++] = pad;
                }
                break;
            }
        }
        
        return buffer.join('');
        
    }

function decode64(subject) {
        var map = BASE64_MAP,
            oneByte = ONE_BYTE,
            buffer = [],
            bl = 0,
            c = -1,
            code2str = fromCharCode;
        var l, code, excess, chr, flag;
        
        if (!string(subject, true) || NOT_BASE64_RE.test(subject)) {
            throw new Error(INVALID_SUBJECT);
        }
        
        subject = subject.replace(BASE64_EXCESS_REMOVE_RE, '');
        l = subject.length;
        
        for (; l--;) {
            code = map.indexOf(subject.charAt(++c));
            flag = c % 4;
            
            switch (flag) {
            case 0:
                chr = 0;
                break;
            case 1:
                chr = ((excess << 2) | (code >> 4)) & oneByte;
                break;
            case 2:
                chr = ((excess << 4) | (code >> 2)) & oneByte;
                break;
            case 3:
                chr = ((excess << 6) | code) & oneByte;
            }
            
            excess = code;
            
            if (!l && flag < 3 && chr < 64) {
                break;
            }
    
            if (flag) {
                buffer[bl++] = code2str(chr);
            }
        }
        
        return bin2utf(buffer.join(""));
    }

function trim(subject) {
        if (!string(subject, true)) {
            throw new Error(INVALID_SUBJECT);
        }

        return subject ? subject.replace(TRIM_RE, "") : subject;
    }

//TYPE = require("./type.js"),
//    OBJECT = require("./object.js"),


var NUMERIC_RE = /^([1-9][0-9]*|0)$/;
var ARRAY_INDEX_RE$1 = /^([1-9][0-9]*|0|)$/;
var ERROR_NATIVE_OBJECT = "Root [subject] requires native Object to accept " +
                            "non-numeric property name.";
var ERROR_PATH_INVALID = 'Invalid [path] parameter.';
var START = "start";
var START_ESCAPED = "start_escaped";
var QUEUE = "queue";
var END = "end";
var END_EMPTY = "end_empty";
var STATE = {
        "start": {
            "[": "bracket_start",
            "'": "any_sq_start",
            '"': "any_dq_start",
            "default": "any",
            "\\": "any_escape"
        },
        
        "bracket_start": {
            "]": "property_end",
            "'": "sq_start",
            '"': "dq_start",
            "default": "bracket_any"
        },
        
        "any_sq_start": {
            "'": "property_end",
            "\\": "any_sq_escape",
            "default": "any_sq"
        },
        
        "any_sq": {
            "'": "property_end",
            "\\": "any_sq_escape",
            "default": "any_sq"
        },
        
        "any_sq_escape": {
            "default": "any_sq"
        },
        
        "any_dq_start": {
            '"': "property_end",
            "\\": "any_dq_escape",
            "default": "any_dq"
        },
        
        "any_dq": {
            '"': "property_end",
            "\\": "any_dq_escape",
            "default": "any_dq"
        },
        
        "any_dq_escape": {
            "default": "any_dq"
        },
        
        "sq_start": {
            "'": "bracket_end",
            "\\": "sq_escape",
            "default": "sq"
        },
        "sq": {
            "'": "bracket_end",
            "\\": "sq_escape",
            "default": "sq"
        },
        "sq_escape": {
            "default": "sq"
        },
        "dq_start": {
            '"': "bracket_end",
            "\\": "dq_escape",
            "default": "dq"
        },
        "dq": {
            '"': "bracket_end",
            "\\": "dq_escape",
            "default": "dq"
        },
        "dq_escape": {
            "default": "dq"
        },
        
        "bracket_any": {
            "]": "property_end",
            "\\": "bracket_any_escape",
            "default": "bracket_any"
        },
        
        "bracket_any_escape": {
            "default": "bracket_any"
        },
        
        "bracket_end": {
            "]": "property_end"
        },
        
        "any": {
            ".": "start",
            "\\": "any_escape",
            "[": "bracket_start",
            "default": "any"
        },
        "any_escape": {
            "default": "any"
        },
        
        "property_end": {
            "[": "bracket_start",
            ".": "start"
        }
    };
var STATE_ACTION = {
        "start": {
            "any": START,
            "any_escape": START_ESCAPED
        },
        
        "any_sq_start": {
            "any_sq": START,
            "property_end": END_EMPTY
            
        },
        
        "any_sq": {
            "any_sq": QUEUE,
            "property_end": END
        },
        
        "any_sq_escape": {
            "any_sq": QUEUE
        },
        
        "any_dq_start": {
            "any_dq": START,
            "property_end": END_EMPTY
            
        },
        
        "any_dq": {
            "any_dq": QUEUE,
            "property_end": END
        },
        
        "any_dq_escape": {
            "any_dq": QUEUE
        },
        
        "any": {
            "any": QUEUE,
            "start": END,
            "bracket_start": END
        },
        "any_escape": {
            "any": QUEUE,
            "bracket_start": END,
            "start": START
        },
        
        "bracket_start": {
            "bracket_any": START,
            "property_end": END_EMPTY
        },
        
        "bracket_any": {
            "bracket_any": QUEUE,
            "property_end": END
        },
        
        "bracket_any_escape": {
            "bracket_any": QUEUE
        },
        
        "sq_start": {
            "sq": START,
            "bracket_end": END_EMPTY
        },
        "sq": {
            "sq": QUEUE,
            "bracket_end": END
        },
        "sq_escape": {
            "sq": QUEUE
        },
        
        "dq_start": {
            "dq": START,
            "bracket_end": END_EMPTY
        },
        "dq": {
            "dq": QUEUE,
            "bracket_end": END
        },
        "dq_escape": {
            "dq": QUEUE
        }
    };




function onParsePath(property, last, context) {
    context[context.length] = property;
}



function isAccessible(subject, item) {
    var signature$$1 = signature(subject);
    
    switch (signature$$1) {
    case NUMBER_SIGNATURE:
        return isFinite(subject) && item in Number.prototype && signature$$1;
        
    case STRING_SIGNATURE:
        return item in String.prototype && signature$$1;
    
    case BOOLEAN_SIGNATURE:
        return item in Boolean.prototype && signature$$1;
    
    case REGEX_SIGNATURE:
    case DATE_SIGNATURE:
    case ARRAY_SIGNATURE:
    case OBJECT_SIGNATURE:
    case METHOD_SIGNATURE:
        if (item in subject) {
            return signature$$1;
        }
    }
    return false;
}

function isWritable(subject) {
    var signature$$1 = signature(subject);
    
    switch (signature$$1) {
    case REGEX_SIGNATURE:
    case DATE_SIGNATURE:
    case ARRAY_SIGNATURE:
    case OBJECT_SIGNATURE:
    case METHOD_SIGNATURE:
        return signature$$1;
    }
    return false;
}

function isJSONWritable(subject) {
    var signature$$1 = signature(subject);
    
    switch (signature$$1) {
    case ARRAY_SIGNATURE:
    case OBJECT_SIGNATURE:
        return signature$$1;
    }
    return false;
}

function findCallback(item, last, operation) {
    var subject = operation[1];
    
    if (!isAccessible(subject, item)) {
        operation[0] = void(0);
        return false;
    }
    
    operation[last ? 0 : 1] = subject[item];
    return true;
}







function onPopulatePath(item, last, context) {
    var subject = context[1],
        iswritable = isWritable,
        writable = iswritable(subject),
        U = void(0),
        success = false;
        
    // populate
    if (!last) {
        // populate
        if (writable) {
            // set object
            if (!(item in subject)) {
                subject[item] = {};
                success = true;
                
            }
            // allow only when writable
            else if (iswritable(subject[item])) {
                success = true;
            }
        }
    
        context[1] = success ? subject[item] : U;
        
    }
    // end it with writable state?
    else {
        success = writable;
        context[2] = success && item;
        
    }
   
    return success;

}




function onRemovePath(item, last, context) {
    var subject = context[1],
        iswritable = isWritable,
        writable = iswritable(subject),
        U = void(0),
        success = false;
        
    // populate
    if (!last) {
        if (writable && item in subject) {
            
            // go to next
            if (iswritable(subject[item])) {
                success = true;
            }
            // still a success, nothing to remove
            else {
                context[3] = true;
            }

        }
    
        context[1] = success ? subject[item] : U;
        
    }
    // end it with writable state?
    else {
        success = writable;
        context[2] = success && item;
        context[3] = true;
    }
    
    return success;
}







function existsCallback(item, last, context) {
    var subject = context[0],
        exists = isAccessible(subject, item);
    
    if (exists) {
        context[0] = subject[item];
    }
    
    if (last) {
        context[1] = !!exists;
    }
    
    return exists;
}




function jsonParsePath(path) {
        var items = [];
        
        return jsonEach(path, onParsePath, items) && items.length ?
                    items : null;
        
    }
    
function jsonFind(path, object$$1) {
        var operation = [void(0), object$$1];
        jsonEach(path, findCallback, operation);
        operation[1] = null;
        return operation[0];
    }
    
function jsonCompare(path, object1, object2) {
        return compare(jsonFind(path, object1), object2);
    }

function jsonClone(path, object$$1, deep) {
        return clone(jsonFind(path, object$$1), deep === true);
    }
    
function jsonEach(path, callback, arg1, arg2, arg3, arg4, arg5) {
        var map = STATE,
            action = STATE_ACTION,
            start = START,
            start_escaped = START_ESCAPED,
            queue = QUEUE,
            end = END,
            end_empty = END_EMPTY,
            DEFAULT = "default";
        var c, l, chr, state, stateObject, items, len, last,
            next, actionObject, buffer, bl, buffered, pending,
            start_queue, restart;
        
        if (!string(path)) {
            throw new Error(ERROR_PATH_INVALID);
        }
        
        if (!method(callback)) {
            throw new Error("Invalid [callback] parameter");
        }
        
        buffer = bl = false;
        state = "start";
        stateObject = map.start;
        
        items = [];
        len = pending = 0;
        
        for (c = -1, l = path.length; l--;) {
            buffered = false;
            chr = path.charAt(++c);
            last = !l;
            
            // find next state
            if (chr in stateObject) {
                next = stateObject[chr];
            }
            else if (DEFAULT in stateObject) {
                next = stateObject[DEFAULT];
            }
            else {
                return null;
            }
            
            // check for actions
            if (state in action) {
                actionObject = action[state];
                if (next in actionObject) {
                    start_queue = restart = false;
                    
                    switch (actionObject[next]) {
                    
                    case start:
                        start_queue = true;
                    /* falls through */
                    case start_escaped:
                            if (buffer !== false) {
                                return false;
                            }
                            
                            if (start_queue && !last) {
                                buffer = [chr];
                                bl = 1;
                            }
                            else {
                                buffer = [];
                                bl = 0;
                            }
                            
                            // exit if not last
                            if (!last) {
                                break;
                            }
                    /* falls through */
                    case queue:
                            if (buffer === false) {
                                return false;
                            }
                            buffer[bl++] = chr;
                            // exit if not last
                            if (!last) {
                                break;
                            }
                    /* falls through */
                    case end:
                            if (buffer === false) {
                                return false;
                            }
                            items[len++] = buffer.join('');
                            buffer = bl = false;
                        break;
                    case end_empty:
                            if (buffer !== false) {
                                return false;
                            }
                            items[len++] = '';
    
                        break;
                    }
                }
            }
            
            
            state = next;
            stateObject = map[state];
            
            if (pending < len - 1) {
                if (callback(items[pending++],
                            false,
                            arg1,
                            arg2,
                            arg3,
                            arg4,
                            arg5) === false) {
                    return true;
                }
            }
            // last
            if (last) {
                l = len - pending;
                for (; l--;) {
                    if (callback(items[pending++],
                                !l,
                                arg1,
                                arg2,
                                arg3,
                                arg4,
                                arg5) === false) {
                        return true;
                    }
                }
                break;
            }
    
        }
        
        return true;
    
    }
    
function jsonSet(path, subject, value, overwrite) {
        var typeArray = ARRAY_SIGNATURE,
            apply = assign,
            writable = isWritable;
        var context, name, current, valueSignature, currentSignature,
            arrayOperation, arrayPush, canApply;
        
        if (!string(path)) {
            throw new Error(ERROR_PATH_INVALID);
        }
        
        // main subject should be accessible and native object
        context = [void(0), subject, false];
        jsonEach(path, onPopulatePath, context);
        name = context[2];
        
        if (name !== false) {
            subject = context[1];
            valueSignature = writable(value);
            arrayOperation = array(subject) && NUMERIC_RE.test(name);
            
            if (name in subject) {
                current = subject[name];
                currentSignature = writable(current);
            }
            else {
                current = undefined;
                currentSignature = null;
            }
            
            canApply = valueSignature && !!currentSignature;
            arrayPush = canApply &&
                            valueSignature === typeArray &&
                            currentSignature === typeArray;
                            
            
            // finalize overwrite type
            switch (overwrite) {
            // only available if subject is array and name is numeric index
            case 'insert':
                overwrite = !arrayOperation;
                if (arrayOperation) {
                    subject.splice(name * 1, 0, value);
                }
                break;
            
            // only available if subject canApply
            case 'apply':
                overwrite = !canApply;
                if (canApply) {
                    apply(current, value);
                }
                break;
            
            // only available if current is array and value is array
            case 'push':
                overwrite = !arrayPush;
                if (arrayPush) {
                    current.push.apply(current, value);
                }
                break;
            
            // only available if current is array and value is array
            case 'unshift':
                overwrite = !arrayPush;
                if (arrayPush) {
                    current.splice.apply(current, [0, 0].concat(value));
                }
                break;
            
            // default is no overwrite if possible
            case false:
            /* falls through */
            default:
                // can apply or push only if non-scalar current and value
                overwrite = !canApply;
                if (canApply) {
                    if (arrayPush) {
                        current.push.apply(current, value);
                    }
                    else {
                        apply(current, value);
                    }
                }
            }
            
            // plain overwrite!
            if (overwrite === true) {
                subject[name] = value;
            }
            
            return true;
        
        }
        return false;
    }
    
function jsonUnset(path, subject) {
        var context, name, returnValue;
        
        if (!string(path)) {
            throw new Error(ERROR_PATH_INVALID);
        }
        
        // main subject should be accessible and native object
        context = [void(0), subject, false, false];
        jsonEach(path, onRemovePath, context);
        
        name = context[2];
        returnValue = context[3];
        
        // found! and must be removed
        if (returnValue && name !== false) {
            
            subject = context[1];
            
            if (!(name in subject)) {
                
                returnValue = false;
            }
            else {
            
                // remove item
                if (array(subject) && NUMERIC_RE.test(name)) {
                    subject.splice(name * 1, 1);
                    
                }
                else {
                    
                    delete subject[name];
                    // check if removable
                    returnValue = !(name in subject);
                    
                }
                
            }
        }
        
        return returnValue;
    }

function jsonFill(path, subject, value) { //, overwrite) {
        var typeArray = ARRAY_SIGNATURE,
            getMax = maxObjectIndex,
            apply = assign,
            has = contains,
            arrayIndexRe = ARRAY_INDEX_RE$1,
            iswritable = isJSONWritable,
            isSubjectArray = array(subject);
            
        var parent, c, l, item, parentIndex,
            property, arrayIndex, writable;
            
        
        
        if (!string(path)) {
            throw new Error(ERROR_PATH_INVALID);
        }
        
        // root subject should be an object
        if (!object(subject) && !isSubjectArray) {
            return false;
        }
        
        // unable to create items from path
        path = jsonParsePath(path);
        if (!path || !path.length) {
            return false;
        }
        
        parent = subject;
        parentIndex = path[0];
        
        // finalize parent index
        if (!parentIndex) {
            parentIndex = getMax(parent) + 1;
        }
        
        l = path.length -1;
        
        for (c = 0; l--;) {
            item = path[++c];
            
            // only determine if arrayIndex or not,
            //      resolve this later if it will turn into parentIndex
            arrayIndex = arrayIndexRe.test(item);
            
            // finalize property
            if (has(parent, parentIndex)) {
                property = parent[parentIndex];
                writable = iswritable(property);
                
                // recreate array into object to support "named" property
                if (writable === typeArray && !arrayIndex) {
                    property = apply({}, property);
                    delete property.length;
                    
                }
                // contain current property
                else if (!writable) {
                    property = arrayIndex ?
                        [property] : {"": property};
                }
    
            }
            // error! unable to replace root object
            else if (isSubjectArray && parent === subject && !arrayIndex) {
                throw new Error(ERROR_NATIVE_OBJECT);
            }
            // populate
            else {
                property = arrayIndex ? [] : {};
            }
            
            parent = parent[parentIndex] = property;
            parentIndex = item;
            
            // resolve empty parentIndex
            if (!item) {
                parentIndex = getMax(parent) + 1;
            }
            
        }
        
        // if not overwrite, then fill-in value in array or object
        //if (overwrite !== true && has(parent, parentIndex)) {
        //    property = parent[parentIndex];
        //    
        //    // append
        //    if (T.array(property)) {
        //        parent = property;
        //        parentIndex = parent.length;
        //    }
        //    else {
        //        parent = parent[parentIndex] = [property];
        //        parentIndex = 1;
        //    }
        //}
        
        parent[parentIndex] = value;
        
        return true;
        
    }
    
function jsonExists(path, subject) {
        var operation = [subject, false];
        
        jsonEach(path, existsCallback, operation);
        operation[0] = null;
        
        return operation[1];
    }

var ERROR_NAME = 'Invalid [name] parameter.';
var ERROR_PATH = 'Invalid [path] parameter.';

function create() {
    return new Registry();
}

function isIndex(name) {
    switch (signature(name)) {
    case STRING_SIGNATURE:
    case NUMBER_SIGNATURE: return true;
    }
    return false;
}

function Registry() {
    this.data = {};
}

Registry.prototype = {
    constructor: Registry,
    
    onApply: function (value) {
        assign(this.data, value, true);
    },
    
    onSet: function (name, value) {
        this.data[name] = value;
    },
    
    get: function (name) {
        var list = this.data;
        
        if (!isIndex(name)) {
            throw new Error(ERROR_NAME);
        }
        
        if (contains(list, name)) {
            return list[name];
        }
        
        return void(0);
    },
    
    set: function (name, value) {
        switch (signature(name)) {
        case OBJECT_SIGNATURE:
        case ARRAY_SIGNATURE:
            this.onApply(name);
            break;
        
        case STRING_SIGNATURE:
        case NUMBER_SIGNATURE:
            this.onSet(name, value);
            break;
            
        default:
            throw new Error(ERROR_NAME);
        }
        
        return this;
    },
    
    unset: function (name) {
        var list = this.data;
        
        if (!isIndex(name)) {
            throw new Error(ERROR_NAME);
        }
        
        if (contains(list, name)) {
            delete list[name];
        }
        
        return this;
    },
    
    find: function (path) {
        if (!string(path)) {
            throw new Error(ERROR_PATH);
        }
        
        return jsonFind(path, this.data);
    },
    
    insert: function (path, value) {
        if (!string(path)) {
            throw new Error(ERROR_PATH);
        }
        
        jsonFill(path, this.data, value, true);
        
        return this;
    
    },
    
    remove: function (path) {
        if (!string(path)) {
            throw new Error(ERROR_PATH);
        }
        
        jsonUnset(path, this.data);
        
        return this;
    },
    
    exists: function (name) {
        if (!isIndex(name)) {
            throw new Error(ERROR_NAME);
        }
        
        return contains(this.data, name);
    },
    
    pathExists: function (path) {
        if (!string(path)) {
            throw new Error(ERROR_PATH);
        }
        
        return jsonExists(path, this.data);
    },
    
    assign: function(value) {
        switch (signature(value)) {
        case OBJECT_SIGNATURE:
        case ARRAY_SIGNATURE:
            this.onApply(value);
            return this;
        
        default:
            throw new Error("Invalid [value] parameter");
        }
        
    },
    
    clear: function () {
        clear(this.data);
        return this;
    },
    
    clone: function () {
        var list = this.data;
        return clone(list, true);
    }
    
};

var slice = Array.prototype.slice;
var G$1 = global$1;
var ERROR_ITERABLE = 'Invalid [iterable] parameter.';
var INDEX_STATUS = 0;
var INDEX_DATA = 1;
var INDEX_PENDING = 2;

function createPromise(instance) {
    var Class = Promise;
    
    if (!(instance instanceof Class)) {
        instance = instantiate(Class);
    }
    
    instance.__state = [null,
                        void(0),
                        [],
                        null,
                        null];
    return instance;
}

function resolveValue(data, callback) {
    function resolve(data) {
        try {
            callback(true, data);
        }
        catch (error) {
            callback(false, error);
        }
    }
    
    if (thenable(data)) {
        data.then(resolve,
                  function (error) {
                        callback(false, error);
                    });
    }
    else {
        resolve(data);
    }
}

function finalizeValue(promise, success, data) {
    var state = promise.__state,
        list = state[INDEX_PENDING];
        
    state[INDEX_STATUS] = success;
    state[INDEX_DATA] = data;
    
    // notify callbacks
    for (; list.length; ) {
        list[0](success, data);
        list.splice(0, 1);
    }
}

function Promise(resolver) {
    var finalized = false;
    var instance;
    
    function onFinalize(success, data) {
        finalizeValue(instance, success, data);
    }
    
    function resolve(data) {
        if (!finalized) {
            finalized = true;
            resolveValue(data, onFinalize);
        }
    }
    
    function reject(error) {
        if (!finalized) {
            finalized = true;
            onFinalize(false, error);
        }
    }
    
    if (!method(resolver)) {
        throw new Error('Promise resolver is not a function.');
    }
    
    instance = createPromise(this);
    
    try {
        resolver(resolve, reject);
    }
    catch (error) {
        reject(error);
    }
    
    return instance;
}

function resolve(data) {
    return new Promise(function (resolve) {
        resolve(data);
    });
}

function reject(reason) {
    return new Promise(function () {
        arguments[1](reason);
    });
}

function all(iterable$$1) {
    var total;
    
    function resolver(resolve, reject) {
        var list = iterable$$1,
            remaining = total,
            stopped = false,
            l = remaining,
            c = 0,
            result = [];

        function process(index, item) {
            function finalize(success, data) {
                var found = result;
                
                if (stopped) { return; }
                
                if (!success) {
                    reject(data);
                    stopped = true;
                    return;
                }
                
                found[index] = data;
                
                if (!--remaining) {
                    resolve(found);
                }
            }
            resolveValue(item, finalize);
        }
        
        for (result.length = l; l--; c++) {
            process(c, list[c]);
        }
    }
    
    if (!iterable(iterable$$1)) {
        throw new TypeError(ERROR_ITERABLE);
    }
    
    iterable$$1 = slice.call(iterable$$1, 0);
    total = iterable$$1.length;
    
    if (!total) {
        return resolve([]);
    }
    
    return new Promise(resolver);
}

function race(iterable$$1) {
    function resolver(resolve, reject) {
        var stopped = false,
            tryResolve = resolveValue,
            list = iterable$$1,
            c = -1,
            l = list.length;
        
        function onFulfill(success, data) {
            if (!stopped) {
                stopped = true;
                (success ? resolve : reject)(data);
            }
        }
        
        for (; l--;) {
            tryResolve(list[++c], onFulfill);
        }
    }
    
    if (!iterable(iterable$$1)) {
        throw new TypeError(ERROR_ITERABLE);
    }
    
    iterable$$1 = slice.call(iterable$$1, 0);
    
    return new Promise(resolver);
}

Promise.prototype = {
    constructor: Promise,
    then: function (onFulfill, onReject) {
        var me = this,
            state = me.__state,
            success = state[INDEX_STATUS],
            list = state[INDEX_PENDING],
            instance = createPromise();
            
        function run$$1(success, data) {
            var finalize = finalizeValue,
                handle = success ? onFulfill : onReject;
            
            if (method(handle)) {
                try {
                    data = handle(data);
                    resolveValue(data,
                                function (success, data) {
                                    finalize(instance,
                                             success,
                                             data);
                                });
                    return;
                }
                catch (error) {
                    data = error;
                    success = false;
                }
            }
            finalize(instance, success, data);
        }
        
        if (success === null) {
            list[list.length] = run$$1;
        }
        else {
            setAsync(function () {
                run$$1(success, state[INDEX_DATA]);
            });
        }
        
        return instance;
    },
    
    "catch": function (onReject) {
        return this.then(null, onReject);
    }
};

// static methods
assign(Promise, {
    all: all,
    race: race,
    reject: reject,
    resolve: resolve
});

// Polyfill if promise is not supported
if (!method(G$1.Promise)) {
    G$1.Promise = Promise;
}

G$1 = null;



var BUNDLE$1 = Object.freeze({
	env: detect,
	createRegistry: create,
	Promise: Promise,
	each: EACH,
	assign: assign,
	rehash: rehash,
	contains: contains,
	instantiate: instantiate,
	clone: clone,
	compare: compare,
	fillin: fillin,
	clear: clear,
	maxObjectIndex: maxObjectIndex,
	setAsync: setAsync,
	clearAsync: clearAsync,
	run: run,
	register: register,
	clearRunner: clearRunner,
	middleware: middleware,
	object: object,
	OBJECT: OBJECT_SIGNATURE,
	ARRAY: ARRAY_SIGNATURE,
	NULL: NULL_SIGNATURE,
	UNDEFINED: UNDEFINED_SIGNATURE,
	NUMBER: NUMBER_SIGNATURE,
	STRING: STRING_SIGNATURE,
	BOOLEAN: BOOLEAN_SIGNATURE,
	METHOD: METHOD_SIGNATURE,
	FUNCTION: METHOD_SIGNATURE,
	DATE: DATE_SIGNATURE,
	REGEX: REGEX_SIGNATURE,
	signature: signature,
	nativeObject: nativeObject,
	string: string,
	number: number,
	scalar: scalar,
	array: array,
	method: method,
	date: date,
	regex: regex,
	thenable: thenable,
	iterable: iterable,
	type: type,
	unionList: unionList,
	intersectList: intersectList,
	differenceList: differenceList,
	camelize: camelize,
	uncamelize: uncamelize,
	utf2bin: utf2bin,
	bin2utf: bin2utf,
	encode64: encode64,
	decode64: decode64,
	trim: trim,
	jsonParsePath: jsonParsePath,
	jsonFind: jsonFind,
	jsonCompare: jsonCompare,
	jsonClone: jsonClone,
	jsonEach: jsonEach,
	jsonSet: jsonSet,
	jsonUnset: jsonUnset,
	jsonFill: jsonFill,
	jsonExists: jsonExists
});

use(BUNDLE$1);

var INVALID_NAME = "Invalid Package [name] parameter.";
var INVALID_NAMES = "Invalid [names] Package collection parameter.";


var Package = function Package(name) {
    this.id = ':' + name;
    this.name = name;
        
    this.registered = false;
    this.requires = [];

};


var Packager = function Packager() {
        this.names = [];
        this.packages = {};
    };

    Packager.prototype.register = function register$$1 (name, dependencies) {

        var isString = string,
            names = this.names,
            list = this.packages,
            PackageClass = Package;
        var c, l, dependency, items, il, id, packageObject;
            
        if (!isString(name)) {
            throw new Error(INVALID_NAME);
        }

        id = ':' + name;

        if (id in list && list[id].registered) {
            throw new Error(("Package " + name + " already exists."));
        }

        names[names.length] = name;

        packageObject = new PackageClass(name);
            
        list[id] = packageObject;
        packageObject.registered = true;
            

        if (isString(dependencies)) {
            dependencies = [dependencies];
        }

        if (array(dependencies)) {
            items = packageObject.requires;
            il = 0;

            for (c = -1, l = dependencies.length; l--;) {
                dependency = dependencies[++c];
                if (isString(dependency)) {
                    items[il++] = dependency;
                }

            }

        }

        return this;

    };

    Packager.prototype.flatten = function flatten (names) {
        var list = this.packages,
            isString = string;
        var position, len, name, id, inserted, stack, total,
            pack, requires, resolved, rl;

        if (isString(names)) {
            names = [names];
        }

        if (array(names)) {
            total = names.length;

            // validate names
            for (len = total; len--;) {
                name = names[len];

                if (!isString(name)) {
                    throw new Error(INVALID_NAMES);
                }

                id = ':' + name;
                if (!(id in list)) {
                    throw new Error(("Package " + name + " do not exist."));
                }
                else if (!list[id].registered) {
                    throw new Error(("Package " + name + " is not registered."));
                }

            }

            inserted = {};
            stack = null;
            position = -1;
            len = total;
            resolved = [];
            rl = 0;

            for (; len--;) {
                name = names[++position];
                id = ':' + name;
                pack = list[id];

                requires = pack.requires;
                total = requires.length;
                    
                // should recurse
                if (total) {
                    stack = {
                        parent: stack,
                        ender: name,
                        c: position,
                        l: len,
                        items: names,
                        rs: resolved
                    };
                    names = requires;
                    len = total;
                    position = -1;
                    continue;
                }

                // leaf
                if (!(id in inserted)) {
                    resolved[rl++] =
                        inserted[id] = name;
                }

                // end?
                if (!len) {
                    // pop
                    for (; stack; stack = stack.parent) {
                        len = stack.l;
                        name = stack.ender;

                        // included ender
                        resolved[rl++] = 
                            inserted[':' + name] = name;

                        // break to continue
                        if (len) {
                            position = stack.c;
                            names = stack.rs;
                            names.push.apply(names, resolved);
                            resolved = names;
                            names = stack.items;
                            rl = resolved.length;
                            break;

                        }

                    }

                }


            }



        }

            

    };



var API$1 = Object.freeze({
	Packager: Packager
});

exports['default'] = API$1;
exports.Packager = Packager;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=libdom-ui.js.map
