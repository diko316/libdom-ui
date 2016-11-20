(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === "object" && typeof module === "object") module.exports = factory(require(undefined), require(undefined)); else if (typeof define === "function" && define.amd) define("libdom-ui", [ ,  ], factory); else if (typeof exports === "object") exports["libdom-ui"] = factory(require(undefined), require(undefined)); else root["libdom-ui"] = factory(root[undefined], root[undefined]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_16__, __WEBPACK_EXTERNAL_MODULE_29__) {
    return function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                exports: {},
                id: moduleId,
                loaded: false
            };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.loaded = true;
            return module.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.p = "/assets/";
        return __webpack_require__(0);
    }([ function(module, exports, __webpack_require__) {
        module.exports = __webpack_require__(2);
    }, , function(module, exports, __webpack_require__) {
        (function(global) {
            "use strict";
            var CORE = __webpack_require__(3), COMPONENTS = __webpack_require__(15), register = COMPONENTS.register, rehash = CORE.rehash, EXPORTS = {};
            var DOM;
            if (!global.libdom) {
                throw new Error("libdom package not found. Unable to load libdom-ui.");
            }
            DOM = __webpack_require__(16);
            if (DOM.env.browser) {
                DOM.ui = EXPORTS;
                try {
                    __webpack_require__(18);
                } catch (e) {}
                rehash(EXPORTS, __webpack_require__(22), {
                    createBus: "create",
                    bus: "bus"
                });
                rehash(EXPORTS, __webpack_require__(23), {
                    bind: "bind"
                });
            }
            module.exports = EXPORTS["default"] = EXPORTS;
            DOM.ui = EXPORTS;
            register("lib-dom", __webpack_require__(26));
            register("lib-template", __webpack_require__(27));
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        "use strict";
        module.exports = __webpack_require__(4);
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var DETECT = __webpack_require__(5), OBJECT = __webpack_require__(7), PROCESSOR = __webpack_require__(10), EXPORTS = {
            env: DETECT
        };
        OBJECT.assign(EXPORTS, __webpack_require__(8));
        OBJECT.assign(EXPORTS, OBJECT);
        OBJECT.assign(EXPORTS, __webpack_require__(11));
        OBJECT.assign(EXPORTS, __webpack_require__(9));
        OBJECT.assign(EXPORTS, PROCESSOR);
        OBJECT.assign(EXPORTS, __webpack_require__(12));
        OBJECT.assign(EXPORTS, __webpack_require__(13));
        PROCESSOR.chain = EXPORTS;
        EXPORTS.Promise = __webpack_require__(14);
        module.exports = EXPORTS["default"] = EXPORTS;
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            "use strict";
            var ROOT = global, doc = ROOT.document, win = ROOT.window, toString = Object.prototype.toString, objectSignature = "[object Object]", BROWSER = !!doc && !!win && win.self === (doc.defaultView || doc.parentWindow), NODEVERSIONS = BROWSER ? false : function() {
                return __webpack_require__(6).versions || false;
            }(), CONSOLE = {}, CONSOLE_NAMES = [ "log", "info", "warn", "error", "assert" ], EXPORTS = {
                browser: BROWSER,
                nodejs: NODEVERSIONS && !!NODEVERSIONS.node,
                userAgent: BROWSER ? ROOT.navigator.userAgent : NODEVERSIONS ? nodeUserAgent() : "Unknown",
                validSignature: toString.call(null) !== objectSignature || toString.call(void 0) !== objectSignature,
                ajax: ROOT.XMLHttpRequest,
                indexOfSupport: "indexOf" in Array.prototype
            };
            var c, l;
            function nodeUserAgent() {
                var PROCESS = __webpack_require__(6), VERSIONS = NODEVERSIONS, str = [ "Node ", VERSIONS.node, "(", PROCESS.platform, "; V8 ", VERSIONS.v8 || "unknown", "; arch ", PROCESS.arch, ")" ];
                return str.join("");
            }
            function empty() {}
            if (!ROOT.console) {
                for (c = 0, l = CONSOLE_NAMES.length; l--; c++) {
                    CONSOLE[CONSOLE_NAMES[c]] = empty;
                }
            }
            module.exports = EXPORTS;
            ROOT = win = doc = null;
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports) {
        var process = module.exports = {};
        var cachedSetTimeout;
        var cachedClearTimeout;
        function defaultSetTimout() {
            throw new Error("setTimeout has not been defined");
        }
        function defaultClearTimeout() {
            throw new Error("clearTimeout has not been defined");
        }
        (function() {
            try {
                if (typeof setTimeout === "function") {
                    cachedSetTimeout = setTimeout;
                } else {
                    cachedSetTimeout = defaultSetTimout;
                }
            } catch (e) {
                cachedSetTimeout = defaultSetTimout;
            }
            try {
                if (typeof clearTimeout === "function") {
                    cachedClearTimeout = clearTimeout;
                } else {
                    cachedClearTimeout = defaultClearTimeout;
                }
            } catch (e) {
                cachedClearTimeout = defaultClearTimeout;
            }
        })();
        function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) {
                return setTimeout(fun, 0);
            }
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                cachedSetTimeout = setTimeout;
                return setTimeout(fun, 0);
            }
            try {
                return cachedSetTimeout(fun, 0);
            } catch (e) {
                try {
                    return cachedSetTimeout.call(null, fun, 0);
                } catch (e) {
                    return cachedSetTimeout.call(this, fun, 0);
                }
            }
        }
        function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) {
                return clearTimeout(marker);
            }
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                cachedClearTimeout = clearTimeout;
                return clearTimeout(marker);
            }
            try {
                return cachedClearTimeout(marker);
            } catch (e) {
                try {
                    return cachedClearTimeout.call(null, marker);
                } catch (e) {
                    return cachedClearTimeout.call(this, marker);
                }
            }
        }
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;
        function cleanUpNextTick() {
            if (!draining || !currentQueue) {
                return;
            }
            draining = false;
            if (currentQueue.length) {
                queue = currentQueue.concat(queue);
            } else {
                queueIndex = -1;
            }
            if (queue.length) {
                drainQueue();
            }
        }
        function drainQueue() {
            if (draining) {
                return;
            }
            var timeout = runTimeout(cleanUpNextTick);
            draining = true;
            var len = queue.length;
            while (len) {
                currentQueue = queue;
                queue = [];
                while (++queueIndex < len) {
                    if (currentQueue) {
                        currentQueue[queueIndex].run();
                    }
                }
                queueIndex = -1;
                len = queue.length;
            }
            currentQueue = null;
            draining = false;
            runClearTimeout(timeout);
        }
        process.nextTick = function(fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    args[i - 1] = arguments[i];
                }
            }
            queue.push(new Item(fun, args));
            if (queue.length === 1 && !draining) {
                runTimeout(drainQueue);
            }
        };
        function Item(fun, array) {
            this.fun = fun;
            this.array = array;
        }
        Item.prototype.run = function() {
            this.fun.apply(null, this.array);
        };
        process.title = "browser";
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = "";
        process.versions = {};
        function noop() {}
        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.binding = function(name) {
            throw new Error("process.binding is not supported");
        };
        process.cwd = function() {
            return "/";
        };
        process.chdir = function(dir) {
            throw new Error("process.chdir is not supported");
        };
        process.umask = function() {
            return 0;
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var O = Object.prototype, TYPE = __webpack_require__(8), STRING = __webpack_require__(9), OHasOwn = O.hasOwnProperty, NUMERIC_RE = /^[0-9]*$/;
        function empty() {}
        function assign(target, source, defaults) {
            var onAssign = apply, eachProperty = each;
            if (defaults) {
                eachProperty(defaults, onAssign, target);
            }
            eachProperty(source, onAssign, target);
            return target;
        }
        function apply(value, name) {
            this[name] = value;
        }
        function assignProperties(target, source, access) {
            var context = [ target, source ];
            each(access, applyProperties, context);
            context = context[0] = context[1] = null;
            return target;
        }
        function applyProperties(value, name) {
            var target = this;
            target[0][name] = target[1][value];
            target = null;
        }
        function assignAll(target, source, defaults) {
            var onAssign = apply, eachProperty = each;
            if (defaults) {
                eachProperty(defaults, onAssign, target, false);
            }
            eachProperty(source, onAssign, target);
            return target;
        }
        function each(subject, handler, scope, hasown) {
            var hasOwn = OHasOwn, noChecking = hasown === false;
            var name;
            if (scope === void 0) {
                scope = null;
            }
            for (name in subject) {
                if (noChecking || hasOwn.call(subject, name)) {
                    if (handler.call(scope, subject[name], name, subject) === false) {
                        break;
                    }
                }
            }
            return subject;
        }
        function contains(subject, property) {
            return OHasOwn.call(subject, property);
        }
        function clear(subject) {
            each(subject, applyClear, null, true);
            return subject;
        }
        function applyClear() {
            delete arguments[2][arguments[1]];
        }
        function fillin(target, source, hasown) {
            each(source, applyFillin, target, hasown);
            return target;
        }
        function applyFillin(value, name) {
            var target = this;
            if (!contains(target, name)) {
                target[name] = value;
            }
            target = null;
        }
        function jsonFill(root, path, value, overwrite) {
            var dimensions = STRING.jsonPath(path), type = TYPE, object = type.object, array = type.array, has = contains, apply = assign, numericRe = NUMERIC_RE, parent = root, name = path;
            var numeric, item, c, l, property, temp, isArray;
            if (dimensions) {
                name = dimensions[0];
                dimensions.splice(0, 1);
                for (c = -1, l = dimensions.length; l--; ) {
                    item = dimensions[++c];
                    numeric = numericRe.test(item);
                    if (has(parent, name)) {
                        property = parent[name];
                        isArray = array(property);
                        if (!isArray && !object(property)) {
                            if (numeric) {
                                property = [ property ];
                            } else {
                                temp = property;
                                property = {};
                                property[""] = temp;
                            }
                        } else if (isArray && !numeric) {
                            property = apply({}, property);
                            delete property.length;
                        }
                    } else {
                        property = numeric ? [] : {};
                    }
                    parent = parent[name] = property;
                    if (!item) {
                        if (array(parent)) {
                            item = parent.length;
                        } else if (0 in parent) {
                            item = "0";
                        }
                    }
                    name = item;
                }
            }
            if (overwrite !== true && has(parent, name)) {
                property = parent[name];
                if (array(property)) {
                    parent = property;
                    name = parent.length;
                } else {
                    parent = parent[name] = [ property ];
                    name = 1;
                }
            }
            parent[name] = value;
            parent = value = property = temp = null;
            return root;
        }
        function buildInstance(Class, overrides) {
            empty.prototype = Class.prototype;
            if (TYPE.object(overrides)) {
                return assign(new empty(), overrides);
            }
            return new empty();
        }
        function compare(object1, object2) {
            return compareLookback(object1, object2, []);
        }
        function compareLookback(object1, object2, references) {
            var T = TYPE, isObject = T.object, isArray = T.array, isRegex = T.regex, isDate = T.date, me = compareLookback, depth = references.length;
            var name, len;
            switch (true) {
              case object1 === object2:
                return true;

              case isObject(object1):
                if (!isObject(object2)) {
                    return false;
                }
                if (references.lastIndexOf(object1) !== -1 && references.lastIndexOf(object2) !== -1) {
                    return true;
                }
                references[depth] = object1;
                references[depth + 1] = object2;
                for (name in object1) {
                    if (!(name in object2) || !me(object1[name], object2[name], references)) {
                        return false;
                    }
                }
                for (name in object2) {
                    if (!(name in object1) || !me(object1[name], object2[name], references)) {
                        return false;
                    }
                }
                references.length = depth;
                return true;

              case isArray(object1):
                if (!isArray(object2)) {
                    return false;
                }
                if (references.lastIndexOf(object1) !== -1 && references.lastIndexOf(object2) !== -1) {
                    return true;
                }
                len = object1.length;
                if (len !== object2.length) {
                    return false;
                }
                references[depth] = object1;
                references[depth + 1] = object2;
                for (;len--; ) {
                    if (!me(object1[len], object2[len], references)) {
                        return false;
                    }
                }
                references.length = depth;
                return true;

              case isRegex(object1):
                return isRegex(object2) && object1.source === object2.source;

              case isDate(object1):
                return isDate(object2) && object1.toString() === object2.toString();
            }
            return false;
        }
        function clone(data, deep) {
            var T = TYPE, isNative = T.nativeObject(data);
            deep = deep === true;
            if (isNative || T.array(data)) {
                return deep ? (isNative ? cloneObject : cloneArray)(data, [], []) : isNative ? assignAll({}, data) : data.slice(0);
            }
            if (T.regex(data)) {
                return new RegExp(data.source, data.flags);
            } else if (T.date(data)) {
                return new Date(data.getFullYear(), data.getMonth(), data.getDate(), data.getHours(), data.getMinutes(), data.getSeconds(), data.getMilliseconds());
            }
            return data;
        }
        function cloneObject(data, parents, cloned) {
            var depth = parents.length, T = TYPE, isNativeObject = T.nativeObject, isArray = T.array, ca = cloneArray, co = cloneObject, recreated = {};
            var name, value, index, isNative;
            parents[depth] = data;
            cloned[depth] = recreated;
            for (name in data) {
                value = data[name];
                isNative = isNativeObject(value);
                if (isNative || isArray(value)) {
                    index = parents.lastIndexOf(value);
                    value = index === -1 ? (isNative ? co : ca)(value, parents, cloned) : cloned[index];
                } else {
                    value = clone(value, false);
                }
                recreated[name] = value;
            }
            parents.length = cloned.length = depth;
            return recreated;
        }
        function cloneArray(data, parents, cloned) {
            var depth = parents.length, T = TYPE, isNativeObject = T.nativeObject, isArray = T.array, ca = cloneArray, co = cloneObject, recreated = [], c = 0, l = data.length;
            var value, index, isNative;
            parents[depth] = data;
            cloned[depth] = recreated;
            for (;l--; c++) {
                value = data[c];
                isNative = isNativeObject(value);
                if (isNative || isArray(value)) {
                    index = parents.lastIndexOf(value);
                    value = index === -1 ? (isNative ? co : ca)(value, parents, cloned) : cloned[index];
                } else {
                    value = clone(value, false);
                }
                recreated[c] = value;
            }
            parents.length = cloned.length = depth;
            return recreated;
        }
        module.exports = {
            each: each,
            assign: assign,
            rehash: assignProperties,
            contains: contains,
            instantiate: buildInstance,
            clone: clone,
            compare: compare,
            fillin: fillin,
            urlFill: jsonFill,
            clear: clear
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var DETECTED = __webpack_require__(5), validSignature = DETECTED.validSignature, OBJECT_SIGNATURE = "[object Object]", OBJECT = Object, O = OBJECT.prototype, toString = O.toString, isSignature = validSignature ? objectSignature : ieObjectSignature;
        function objectSignature(subject) {
            return toString.call(subject);
        }
        function ieObjectSignature(subject) {
            if (subject === null) {
                return "[object Null]";
            } else if (subject === void 0) {
                return "[object Undefined]";
            }
            return toString.call(subject);
        }
        function isType(subject, type) {
            return isSignature(subject) === type;
        }
        function isObject(subject) {
            return toString.call(subject) === OBJECT_SIGNATURE;
        }
        function ieIsObject(subject) {
            return subject !== null && subject !== void 0 && toString.call(subject) === OBJECT_SIGNATURE;
        }
        function isNativeObject(subject) {
            var O = OBJECT;
            var constructor, result;
            if (isSignature(subject) === OBJECT_SIGNATURE) {
                constructor = subject.constructor;
                if (O.hasOwnProperty.call(subject, "constructor")) {
                    delete subject.constructor;
                    result = subject.constructor === O;
                    subject.constructor = constructor;
                    return result;
                }
                return constructor === O;
            }
            return false;
        }
        function isString(subject, allowEmpty) {
            return typeof subject === "string" && (allowEmpty === true || subject.length !== 0);
        }
        function isNumber(subject) {
            return typeof subject === "number" && isFinite(subject);
        }
        function isScalar(subject) {
            switch (typeof subject) {
              case "number":
                return isFinite(subject);

              case "boolean":
              case "string":
                return true;
            }
            return false;
        }
        function isFunction(subject) {
            return toString.call(subject) === "[object Function]";
        }
        function isArray(subject) {
            return toString.call(subject) === "[object Array]";
        }
        function isDate(subject) {
            return toString.call(subject) === "[object Date]";
        }
        function isRegExp(subject) {
            return toString.call(subject) === "[object RegExp]";
        }
        module.exports = {
            signature: isSignature,
            object: validSignature ? isObject : ieIsObject,
            nativeObject: isNativeObject,
            string: isString,
            number: isNumber,
            scalar: isScalar,
            array: isArray,
            method: isFunction,
            date: isDate,
            regex: isRegExp,
            type: isType
        };
    }, function(module, exports) {
        "use strict";
        var HALF_BYTE = 128, SIX_BITS = 63, ONE_BYTE = 255, fromCharCode = String.fromCharCode, BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", BASE64_EXCESS_REMOVE_RE = /[^a-zA-Z0-9\+\/]/, CAMEL_RE = /[^a-z]+[a-z]/gi, UNCAMEL_RE = /\-*[A-Z]/g;
        function base64Encode(str) {
            var map = BASE64_MAP, buffer = [], bl = 0, c = -1, excess = false, pad = map.charAt(64);
            var l, total, code, flag, end, chr;
            str = utf16ToUtf8(str);
            l = total = str.length;
            for (;l--; ) {
                code = str.charCodeAt(++c);
                flag = c % 3;
                switch (flag) {
                  case 0:
                    chr = map.charAt((code & 252) >> 2);
                    excess = (code & 3) << 4;
                    break;

                  case 1:
                    chr = map.charAt(excess | (code & 240) >> 4);
                    excess = (code & 15) << 2;
                    break;

                  case 2:
                    chr = map.charAt(excess | (code & 192) >> 6);
                    excess = code & 63;
                }
                buffer[bl++] = chr;
                end = !l;
                if (end || flag === 2) {
                    buffer[bl++] = map.charAt(excess);
                }
                if (!l) {
                    l = bl % 4;
                    for (l = l && 4 - l; l--; ) {
                        buffer[bl++] = pad;
                    }
                    break;
                }
            }
            return buffer.join("");
        }
        function base64Decode(str) {
            var map = BASE64_MAP, oneByte = ONE_BYTE, buffer = [], bl = 0, c = -1, code2str = fromCharCode;
            var l, code, excess, chr, flag;
            str = str.replace(BASE64_EXCESS_REMOVE_RE, "");
            l = str.length;
            for (;l--; ) {
                code = map.indexOf(str.charAt(++c));
                flag = c % 4;
                switch (flag) {
                  case 0:
                    chr = 0;
                    break;

                  case 1:
                    chr = (excess << 2 | code >> 4) & oneByte;
                    break;

                  case 2:
                    chr = (excess << 4 | code >> 2) & oneByte;
                    break;

                  case 3:
                    chr = (excess << 6 | code) & oneByte;
                }
                excess = code;
                if (!l && flag < 3 && chr < 64) {
                    break;
                }
                if (flag) {
                    buffer[bl++] = code2str(chr);
                }
            }
            return utf8ToUtf16(buffer.join(""));
        }
        function utf16ToUtf8(str) {
            var half = HALF_BYTE, sixBits = SIX_BITS, code2char = fromCharCode, utf8 = [], ul = 0, c = -1, l = str.length;
            var code;
            for (;l--; ) {
                code = str.charCodeAt(++c);
                if (code < half) {
                    utf8[ul++] = code2char(code);
                } else if (code < 2048) {
                    utf8[ul++] = code2char(192 | code >> 6);
                    utf8[ul++] = code2char(half | code & sixBits);
                } else if (code < 55296 || code > 57343) {
                    utf8[ul++] = code2char(224 | code >> 12);
                    utf8[ul++] = code2char(half | code >> 6 & sixBits);
                    utf8[ul++] = code2char(half | code & sixBits);
                } else {
                    l--;
                    code = 65536 + ((code & 1023) << 10 | str.charCodeAt(++c) & 1023);
                    utf8[ul++] = code2char(240 | code >> 18);
                    utf8[ul++] = code2char(half | code >> 12 & sixBits);
                    utf8[ul++] = code2char(half | code >> 6 & sixBits);
                    utf8[ul++] = code2char(half | code >> sixBits);
                }
            }
            return utf8.join("");
        }
        function utf8ToUtf16(str) {
            var half = HALF_BYTE, sixBits = SIX_BITS, code2char = fromCharCode, utf16 = [], M = Math, min = M.min, max = M.max, ul = 0, l = str.length, c = -1;
            var code, whatsLeft;
            for (;l--; ) {
                code = str.charCodeAt(++c);
                if (code < half) {
                    utf16[ul++] = code2char(code);
                } else if (code > 191 && code < 224) {
                    utf16[ul++] = code2char((code & 31) << 6 | str.charCodeAt(c + 1) & sixBits);
                    whatsLeft = max(min(l - 1, 1), 0);
                    c += whatsLeft;
                    l -= whatsLeft;
                } else if (code > 223 && code < 240) {
                    utf16[ul++] = code2char((code & 15) << 12 | (str.charCodeAt(c + 1) & sixBits) << 6 | str.charCodeAt(c + 2) & sixBits);
                    whatsLeft = max(min(l - 2, 2), 0);
                    c += whatsLeft;
                    l -= whatsLeft;
                } else {
                    code = ((code & 7) << 18 | (str.charCodeAt(c + 1) & sixBits) << 12 | (str.charCodeAt(c + 2) & sixBits) << 6 | str.charCodeAt(c + 3) & sixBits) - 65536;
                    utf16[ul++] = code2char(code >> 10 | 55296, code & 1023 | 56320);
                    whatsLeft = max(min(l - 3, 3), 0);
                    c += whatsLeft;
                    l -= whatsLeft;
                }
            }
            return utf16.join("");
        }
        function parseJsonPath(path) {
            var dimensions = [], dl = 0, buffer = [], bl = dl, TRUE = true, FALSE = false, started = FALSE, merge = FALSE;
            var c, l, item, last;
            for (c = -1, l = path.length; l--; ) {
                item = path.charAt(++c);
                last = !l;
                if (item === "[") {
                    if (started) {
                        break;
                    }
                    started = TRUE;
                    if (bl) {
                        merge = TRUE;
                    }
                } else if (item === "]") {
                    if (!started) {
                        break;
                    }
                    started = FALSE;
                    merge = TRUE;
                } else {
                    buffer[bl++] = item;
                    if (last) {
                        merge = TRUE;
                    }
                }
                if (merge) {
                    dimensions[dl++] = buffer.join("");
                    buffer.length = bl = 0;
                    merge = FALSE;
                }
                if (last) {
                    if (started || dl < 1) {
                        break;
                    }
                    return dimensions;
                }
            }
            return null;
        }
        function camelize(str) {
            return str.replace(CAMEL_RE, applyCamelize);
        }
        function applyCamelize(all) {
            return all.charAt(all.length - 1).toUpperCase();
        }
        function uncamelize(str) {
            return str.replace(UNCAMEL_RE, applyUncamelize);
        }
        function applyUncamelize(all) {
            return "-" + all.charAt(all.length - 1).toLowerCase();
        }
        module.exports = {
            encode64: base64Encode,
            decode64: base64Decode,
            utf2bin: utf16ToUtf8,
            bin2utf: utf8ToUtf16,
            jsonPath: parseJsonPath,
            camelize: camelize,
            uncamelize: uncamelize
        };
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            "use strict";
            var TYPE = __webpack_require__(8), G = global, NAME_RE = /^(([^\.]+\.)*)((before|after)\:)?([a-zA-Z0-9\_\-\.]+)$/, POSITION_BEFORE = 1, POSITION_AFTER = 2, RUNNERS = {}, NAMESPACES = {}, EXPORTS = {
                register: set,
                run: run,
                middleware: middlewareNamespace,
                setAsync: G.setImmediate,
                clearAsync: G.clearImmediate
            };
            function set(name, handler) {
                var parsed = parseName(name), list = RUNNERS;
                var access, items;
                if (parsed && handler instanceof Function) {
                    name = parsed[1];
                    access = ":" + name;
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
                return EXPORTS.chain;
            }
            function run(name, args, scope) {
                var runners = get(name);
                var c, l;
                if (runners) {
                    if (typeof scope === "undefined") {
                        scope = null;
                    }
                    if (!(args instanceof Array)) {
                        args = [];
                    }
                    for (c = -1, l = runners.length; l--; ) {
                        runners[++c].apply(scope, args);
                    }
                }
                return EXPORTS.chain;
            }
            function get(name) {
                var list = RUNNERS, parsed = parseName(name);
                var access;
                if (parsed) {
                    access = ":" + parsed[1];
                    if (access in list) {
                        return list[access][getPositionAccess(parsed[0])];
                    }
                }
                return void 0;
            }
            function getPositionAccess(input) {
                return input === POSITION_BEFORE ? "before" : "after";
            }
            function parseName(name) {
                var match = TYPE.string(name) && name.match(NAME_RE);
                var position, namespace;
                if (match) {
                    namespace = match[1];
                    position = match[4] === "before" ? POSITION_BEFORE : POSITION_AFTER;
                    return [ position, (namespace || "") + match[5] ];
                }
                return void 0;
            }
            function middlewareNamespace(name) {
                var list = NAMESPACES;
                var access, register, run;
                if (TYPE.string(name)) {
                    access = name + ".";
                    if (!(access in list)) {
                        run = createRunInNamespace(access);
                        register = createRegisterInNamespace(access);
                        list[access] = register.chain = run.chain = {
                            run: run,
                            register: register
                        };
                    }
                    return list[access];
                }
                return void 0;
            }
            function createRunInNamespace(ns) {
                function nsRun(name, args, scope) {
                    run(ns + name, args, scope);
                    return nsRun.chain;
                }
                return nsRun;
            }
            function createRegisterInNamespace(ns) {
                function nsRegister(name, handler) {
                    set(ns + name, handler);
                    return nsRegister.chain;
                }
                return nsRegister;
            }
            function timeoutAsync(handler) {
                return setTimeout(handler, 1);
            }
            function clearTimeoutAsync(id) {
                return clearTimeout(id);
            }
            if (!(G.setImmediate instanceof Function)) {
                EXPORTS.setAsync = timeoutAsync;
                EXPORTS.clearAsync = clearTimeoutAsync;
            }
            module.exports = EXPORTS.chain = EXPORTS;
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var DETECT = __webpack_require__(5), OBJECT = __webpack_require__(7), A = Array.prototype;
        function indexOf(subject) {
            var array = this, l = array.length, c = -1;
            for (;l--; ) {
                if (subject === array[++c]) {
                    array = null;
                    return c;
                }
            }
            return -1;
        }
        function lastIndexOf(subject) {
            var array = this, l = array.length;
            for (;l--; ) {
                if (subject === array[l]) {
                    array = null;
                    return l;
                }
            }
            return -1;
        }
        function union(array, array2, clone) {
            var subject, l, len, total;
            array = clone !== false ? array : array.slice(0);
            array.push.apply(array, array2);
            total = array.length;
            found: for (l = total; l--; ) {
                subject = array[l];
                for (len = total; len--; ) {
                    if (l !== len && subject === array[len]) {
                        total--;
                        array.splice(l, 1);
                        continue found;
                    }
                }
            }
            return array;
        }
        function intersect(array1, array2, clone) {
            var total1 = array1.length, total2 = array2.length;
            var subject, l1, l2;
            array1 = clone !== false ? array1 : array1.slice(0);
            found: for (l1 = total1; l1--; ) {
                subject = array1[l1];
                foundSame: for (l2 = total2; l2--; ) {
                    if (subject === array2[l2]) {
                        for (l2 = total1; l2--; ) {
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
        function difference(array1, array2, clone) {
            var total1 = array1.length, total2 = array2.length;
            var subject, l1, l2;
            array1 = clone !== false ? array1 : array1.slice(0);
            found: for (l1 = total1; l1--; ) {
                subject = array1[l1];
                for (l2 = total2; l2--; ) {
                    if (subject === array2[l2]) {
                        array1.splice(l1, 1);
                        total1--;
                        continue found;
                    }
                }
                for (l2 = total1; l2--; ) {
                    if (l2 !== l1 && subject === array1[l2]) {
                        array1.splice(l1, 1);
                        total1--;
                        continue found;
                    }
                }
            }
            return array1;
        }
        if (!DETECT.indexOfSupport) {
            OBJECT.assign(A, {
                indexOf: indexOf,
                lastIndexOf: lastIndexOf
            });
        }
        module.exports = {
            unionList: union,
            intersectList: intersect,
            differenceList: difference
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var TYPE = __webpack_require__(8), OBJECT = __webpack_require__(7);
        function create() {
            return new Registry();
        }
        function Registry() {
            this.data = {};
        }
        Registry.prototype = {
            constructor: Registry,
            get: function(name) {
                var list = this.data;
                if (OBJECT.contains(list, name)) {
                    return list[name];
                }
                return void 0;
            },
            set: function(name, value) {
                var list = this.data;
                if (TYPE.string(name) || TYPE.number(name)) {
                    list[name] = value;
                }
                return this;
            },
            unset: function(name) {
                var list = this.data;
                if (OBJECT.contains(list, name)) {
                    delete list[name];
                }
                return this;
            },
            exists: function(name) {
                return OBJECT.contains(this.data, name);
            },
            clear: function() {
                OBJECT.clear(this.data);
                return this;
            },
            clone: function() {
                var list = this.data;
                return OBJECT.clone(list, true);
            }
        };
        module.exports = {
            createRegistry: create
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var TYPE = __webpack_require__(8), OBJECT = __webpack_require__(7), NUMERIC_RE = /^([1-9][0-9]*|0)$/;
        function eachPath(path, callback, arg1, arg2, arg3, arg4) {
            var escape = "\\", dot = ".", buffer = [], bl = 0;
            var c, l, chr, apply, last;
            for (c = -1, l = path.length; l--; ) {
                chr = path.charAt(++c);
                apply = false;
                last = !l;
                switch (chr) {
                  case escape:
                    chr = "";
                    if (l) {
                        chr = path.charAt(++c);
                        l--;
                    }
                    break;

                  case dot:
                    chr = "";
                    apply = true;
                    break;
                }
                if (chr) {
                    buffer[bl++] = chr;
                }
                if (last || apply) {
                    if (bl) {
                        if (callback(buffer.join(""), last, arg1, arg2, arg3, arg4) === false) {
                            return;
                        }
                        buffer.length = bl = 0;
                    }
                }
            }
        }
        function isAccessible(subject, item) {
            var type = TYPE;
            switch (true) {
              case type.object(subject):
              case type.array(subject) && (!NUMERIC_RE.test(item) || item !== "length"):
                if (!OBJECT.contains(subject, item)) {
                    return false;
                }
            }
            return true;
        }
        function findCallback(item, last, operation) {
            var subject = operation[1];
            if (!isAccessible(subject, item)) {
                operation[0] = void 0;
                return false;
            }
            operation[last ? 0 : 1] = subject[item];
            return true;
        }
        function find(path, object) {
            var operation = [ void 0, object ];
            eachPath(path, findCallback, operation);
            operation[1] = null;
            return operation[0];
        }
        function clone(path, object, deep) {
            return OBJECT.clone(find(path, object), deep);
        }
        function getItemsCallback(item, last, operation) {
            operation[operation.length] = item;
        }
        function assign(path, subject, value, overwrite) {
            var type = TYPE, has = OBJECT.contains, array = type.array, object = type.object, apply = type.assign, parent = subject, numericRe = NUMERIC_RE;
            var items, c, l, item, name, numeric, property, isArray, temp;
            if (object(parent) || array(parent)) {
                eachPath(path, getItemsCallback, items = []);
                if (items.length) {
                    name = items[0];
                    items.splice(0, 1);
                    for (c = -1, l = items.length; l--; ) {
                        item = items[++c];
                        numeric = numericRe.test(item);
                        if (has(parent, name)) {
                            property = parent[name];
                            isArray = array(property);
                            if (!isArray && !object(property)) {
                                if (numeric) {
                                    property = [ property ];
                                } else {
                                    temp = property;
                                    property = {};
                                    property[""] = temp;
                                }
                            } else if (isArray && !numeric) {
                                property = apply({}, property);
                                delete property.length;
                            }
                        } else {
                            property = numeric ? [] : {};
                        }
                        parent = parent[name] = property;
                        name = item;
                    }
                    if (overwrite !== true && has(parent, name)) {
                        property = parent[name];
                        if (array(property)) {
                            parent = property;
                            name = parent.length;
                        } else {
                            parent = parent[name] = [ property ];
                            name = 1;
                        }
                    }
                    parent[name] = value;
                    parent = value = property = temp = null;
                    return true;
                }
            }
            return false;
        }
        function removeCallback(item, last, operation) {
            var subject = operation[0];
            var isLength;
            if (!isAccessible(subject, item)) {
                return false;
            }
            if (last) {
                if (TYPE.array(subject)) {
                    isLength = item === "length";
                    subject.splice(isLength ? 0 : item.toString(10), isLength ? subject.length : 1);
                } else {
                    delete subject[item];
                }
                operation[1] = true;
            } else {
                operation[0] = subject[item];
            }
        }
        function remove(path, object) {
            var operation = [ object, false ];
            eachPath(path, removeCallback, operation);
            operation[0] = null;
            return operation[1];
        }
        function compare(path, object1, object2) {
            return OBJECT.compare(find(path, object1), object1, object2);
        }
        module.exports = {
            jsonFind: find,
            jsonCompare: compare,
            jsonClone: clone,
            jsonEach: eachPath,
            jsonSet: assign,
            jsonUnset: remove
        };
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            "use strict";
            var TYPE = __webpack_require__(8), OBJECT = __webpack_require__(7), PROCESSOR = __webpack_require__(10), slice = Array.prototype.slice, G = global, INDEX_STATUS = 0, INDEX_DATA = 1, INDEX_PENDING = 2;
            function isPromise(object) {
                var T = TYPE;
                return T.object(object) && T.method(object.then);
            }
            function createPromise(instance) {
                var Class = Promise;
                if (!(instance instanceof Class)) {
                    instance = OBJECT.instantiate(Class);
                }
                instance.__state = [ null, void 0, [], null, null ];
                return instance;
            }
            function resolveValue(data, callback) {
                function resolve(data) {
                    try {
                        callback(true, data);
                    } catch (error) {
                        callback(false, error);
                    }
                }
                if (isPromise(data)) {
                    data.then(resolve, function(error) {
                        callback(false, error);
                    });
                } else {
                    resolve(data);
                }
            }
            function finalizeValue(promise, success, data) {
                var state = promise.__state, list = state[INDEX_PENDING];
                state[INDEX_STATUS] = success;
                state[INDEX_DATA] = data;
                for (;list.length; ) {
                    list[0](success, data);
                    list.splice(0, 1);
                }
            }
            function Promise(tryout) {
                var instance = createPromise(this), finalized = false;
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
                try {
                    tryout(resolve, reject);
                } catch (error) {
                    reject(error);
                }
                return instance;
            }
            function resolve(data) {
                return new Promise(function(resolve) {
                    resolve(data);
                });
            }
            function reject(reason) {
                return new Promise(function() {
                    arguments[1](reason);
                });
            }
            function all(promises) {
                var total;
                promises = slice.call(promises, 0);
                total = promises.length;
                if (!total) {
                    return resolve([]);
                }
                return new Promise(function(resolve, reject) {
                    var list = promises, remaining = total, stopped = false, l = remaining, c = 0, result = [];
                    function process(index, item) {
                        function finalize(success, data) {
                            var found = result;
                            if (stopped) {
                                return;
                            }
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
                });
            }
            function race(promises) {
                promises = slice.call(promises, 0);
                return new Promise(function(resolve, reject) {
                    var stopped = false, tryResolve = resolveValue, list = promises, c = -1, l = list.length;
                    function onFulfill(success, data) {
                        if (!stopped) {
                            stopped = true;
                            (success ? resolve : reject)(data);
                        }
                    }
                    for (;l--; ) {
                        tryResolve(list[++c], onFulfill);
                    }
                });
            }
            Promise.prototype = {
                constructor: Promise,
                then: function(onFulfill, onReject) {
                    var me = this, state = me.__state, success = state[INDEX_STATUS], list = state[INDEX_PENDING], instance = createPromise();
                    function run(success, data) {
                        var handle = success ? onFulfill : onReject;
                        if (TYPE.method(handle)) {
                            try {
                                data = handle(data);
                                resolveValue(data, function(success, data) {
                                    finalizeValue(instance, success, data);
                                });
                                return;
                            } catch (error) {
                                data = error;
                                success = false;
                            }
                        }
                        finalizeValue(instance, success, data);
                    }
                    if (success === null) {
                        list[list.length] = run;
                    } else {
                        PROCESSOR.setAsync(function() {
                            run(success, state[INDEX_DATA]);
                        });
                    }
                    return instance;
                },
                catch: function(onReject) {
                    return this.then(null, onReject);
                }
            };
            OBJECT.assign(Promise, {
                all: all,
                race: race,
                reject: reject,
                resolve: resolve
            });
            if (!TYPE.method(G.Promise)) {
                G.Promise = Promise;
            }
            module.exports = Promise;
            G = null;
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var LIBCORE = __webpack_require__(3), LIBDOM = __webpack_require__(16), ROLE_ATTRIBUTE = "role", BASE_CLASS = "base", BASE_COMPONENT = __webpack_require__(17), COMPONENTS = LIBCORE.createRegistry(), EXPORTS = {
            register: register,
            roles: getRoles,
            validRoles: getRegisteredRoles,
            create: instantiate,
            registered: isRegistered
        };
        function isRegistered(str) {
            return LIBCORE.string(str) && COMPONENTS.exists(str);
        }
        function getRegisteredRoles(str) {
            var list = COMPONENTS, roles = str.split(" "), l = roles.length;
            var role;
            for (;l--; ) {
                role = roles[l];
                if (!list.exists(role)) {
                    roles.splice(l, 1);
                }
            }
            return roles.length ? roles : null;
        }
        function getRoles(element) {
            var roles;
            if (LIBDOM.is(element, 1)) {
                roles = element.getAttribute(ROLE_ATTRIBUTE);
                if (LIBCORE.string(roles)) {
                    return getRegisteredRoles(roles);
                }
            }
            return null;
        }
        function register(name, config) {
            var CORE = LIBCORE, list = COMPONENTS, Base = BASE_COMPONENT;
            var isObject, Prototype;
            if (!CORE.string(name)) {
                throw new Error("Invalid [name] parameter.");
            }
            isObject = CORE.object(config);
            if (!isObject && !CORE.method(config)) {
                throw new Error("Invalid [config] parameter.");
            }
            if (!isObject) {
                Prototype = config.prototype;
                Prototype.name = name;
                if (!(Prototype instanceof Base) && Prototype !== Base.prototype) {
                    throw new Error("[config] Class must be a subclass of Base Component.");
                }
            }
            list.set(name, {
                name: name,
                created: !isObject,
                Class: isObject ? null : config,
                properties: isObject ? CORE.assign({}, config) : Prototype
            });
            return EXPORTS.chain;
        }
        function instantiate(name, instances, except) {
            var CORE = LIBCORE, contains = CORE.contains, me = instantiate, list = COMPONENTS;
            var definition, requires, c, l, item, Class, instance;
            if (!list.exists(name)) {
                throw new Error("Component do not exist " + name);
            }
            if (!CORE.object(except)) {
                except = {};
            }
            if (!CORE.array(instances)) {
                instances = [];
            }
            except[name] = true;
            definition = list.get(name);
            if (!definition.created) {
                createClass(name);
            }
            Class = definition.Class;
            requires = Class.prototype.requires;
            for (c = -1, l = requires.length; l--; ) {
                item = requires[++c];
                if (!contains(except, item)) {
                    me(item, instances, except);
                }
            }
            instances[instances.length] = instance = new Class();
            return instance;
        }
        function createClass(name, createList) {
            var CORE = LIBCORE, isString = CORE.string, contains = CORE.contains, list = COMPONENTS, definition = list.get(name), properties = definition.properties, Base = properties.based, requires = properties.requires;
            var Constructor, l, BasePrototype, Prototype;
            if (!createList) {
                createList = {};
            }
            createList[name] = true;
            if (isString(Base)) {
                if (!list.exists(Base)) {
                    throw new Error("Invalid base Class " + Base);
                }
                if (contains(createList, Base)) {
                    throw new Error("Cyclic inheritance of " + Base + " and " + name + " found.");
                }
                Base = list.get(Base);
            } else {
                Base = list.get(BASE_CLASS);
            }
            Base = !Base.created ? createClass(Base.name, createList) : Base.Class;
            BasePrototype = Base.prototype;
            Constructor = contains(properties, "constructor") ? properties.constructor : createConstructor(Base);
            Prototype = CORE.assign(CORE.instantiate(Base), properties);
            Prototype.constructor = Constructor;
            Constructor.prototype = Prototype;
            if (CORE.array(requires)) {
                requires = BasePrototype.requires.concat(requires);
                for (l = requires.length; l--; ) {
                    if (!isString(requires[l])) {
                        requires.splice(l, 1);
                    }
                }
            } else {
                requires = BasePrototype.requires.slice(0);
            }
            Prototype.name = name;
            Prototype.requires = Base.prototype.requires.concat(requires);
            definition.Class = Constructor;
            definition.created = true;
            return Constructor;
        }
        function createConstructor(Base) {
            function Component() {
                return Base.apply(this, arguments);
            }
            return Component;
        }
        module.exports = EXPORTS.chain = EXPORTS;
        register(BASE_CLASS, BASE_COMPONENT);
    }, function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_16__;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var LIBCORE = __webpack_require__(3);
        function Base() {}
        Base.prototype = {
            requires: [],
            constructor: Base,
            set: function(path, value, overwrite) {
                var me = this, node = me.node;
                if (node) {
                    LIBCORE.jsonSet(path, node.data, value, overwrite !== false);
                }
                return me;
            },
            unset: function(path) {
                var me = this, node = me.node;
                if (node) {
                    LIBCORE.jsonUnset(path, node.data);
                }
                return me;
            },
            component: function(component) {
                var node = this.node;
                return node ? node.component(component) : null;
            },
            call: function(component, args) {
                var node = this.node;
                if (node) {
                    component = node.component(component);
                    if (component) {
                        return component.apply(component, args || []);
                    }
                }
                return void 0;
            },
            dispatch: function(event, message) {
                var node = this.node;
                if (node && !node.destroyed) {
                    return node.dispatch(event, message);
                }
                return Promise.reject("Node control is currently not available");
            }
        };
        module.exports = Base;
    }, function(module, exports) {}, , , , function(module, exports, __webpack_require__) {
        (function(global) {
            "use strict";
            var LIBDOM = __webpack_require__(16), LIBCORE = __webpack_require__(3), EVENT_NAME = "buspublish";
            function create() {
                return new EventBus();
            }
            function createStringFilter(bus, string, handler) {
                function onEvent(event) {
                    var message = event.busmessage;
                    if (message[0] === bus && message[1] === string) {
                        handler(message[1], message[2]);
                    }
                }
                return onEvent;
            }
            function createRegExpFilter(bus, regex, handler) {
                function onEvent(event) {
                    var message = event.busmessage;
                    if (message[0] === bus && regex.test(message[1])) {
                        handler(message[1], message[2]);
                    }
                }
                return onEvent;
            }
            function setListener(bus, listener, unsubscribe) {
                listener.item = unsubscribe;
                listener.before = null;
                listener.next = bus.subscriptions;
                bus.subscriptions = listener;
            }
            function unsetListener(bus, listener) {
                var current = bus.subscriptions, before = listener.before, after = listener.next;
                if (before) {
                    before.next = after;
                }
                if (after) {
                    after.before = before;
                }
                if (current === listener) {
                    bus.subscriptions = before || after;
                }
                delete listener.item;
                delete listener.next;
                delete listener.before;
            }
            function EventBus() {
                this.queue = [];
            }
            EventBus.prototype = {
                subscriptions: null,
                queue: void 0,
                publishing: false,
                publish: function(event, message) {
                    var me = this, CORE = LIBCORE, DOM = LIBDOM;
                    var list, item, dispatch, target, eventName;
                    if (CORE.string(event) && CORE.object(message)) {
                        target = global.document;
                        eventName = EVENT_NAME;
                        list = me.queue;
                        list[list.length] = [ me, event, message ];
                        if (!me.publishing) {
                            me.publishing = true;
                            dispatch = DOM.dispatch;
                            for (;list.length; ) {
                                item = list[0];
                                list.splice(0, 1);
                                dispatch(target, eventName, {
                                    busmessage: item,
                                    bubbles: false
                                });
                            }
                            me.publishing = false;
                        }
                        target = dispatch = list = item = null;
                    }
                    return me;
                },
                subscribe: function(filter, handler) {
                    var me = this, CORE = LIBCORE, DOM = LIBDOM, G = global, eventName = EVENT_NAME, isString = CORE.string(filter), listener = null;
                    function unsubscribe() {
                        if (listener) {
                            DOM.un(G.document, eventName, listener);
                            unsetListener(me, listener);
                            listener = null;
                        }
                    }
                    if (filter instanceof RegExp || isString) {
                        DOM.on(G.document, eventName, listener = isString ? createStringFilter(me, filter, handler) : createRegExpFilter(me, filter, handler));
                        setListener(me, listener, unsubscribe);
                    }
                    return unsubscribe;
                },
                clear: function() {
                    var me = this, current = me.subscriptions;
                    var next;
                    for (;current; current = next) {
                        next = current.next;
                        current.item();
                    }
                    return this;
                }
            };
            module.exports = {
                create: create,
                bus: create()
            };
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            "use strict";
            var LIBCORE = __webpack_require__(3), LIBDOM = __webpack_require__(16), EVENT = __webpack_require__(24), COMPONENT = __webpack_require__(15), ROLE_ATTRIBUTE = "role", ROOT_ROLE = "app-root", REGISTERED_NODE_ATTRIBUTE = "data-ui-node", NODE_STATE_RE = /^(uninitialized|interactive|detached)$/, STAT_INVALID_DOM = 0, STAT_CAN_BIND = 1, STAT_BINDED = 2, STAT_ELEMENT = 3, EXPORTS = {
                bind: bind,
                destroy: destroy
            };
            function empty() {}
            function stat(dom) {
                var type = dom.nodeType, isString = LIBCORE.string;
                var roles, state;
                if (type === 1) {
                    state = dom.getAttribute(REGISTERED_NODE_ATTRIBUTE);
                    if (isString(state) && NODE_STATE_RE.test(state)) {
                        return STAT_BINDED;
                    }
                    roles = dom.getAttribute(ROLE_ATTRIBUTE);
                    if (isString(roles)) {
                        roles = COMPONENT.validRoles(roles);
                        if (roles) {
                            return STAT_CAN_BIND;
                        }
                    }
                    return STAT_ELEMENT;
                }
                return STAT_INVALID_DOM;
            }
            function bind(dom, parent) {
                var Class = Node;
                var node;
                switch (stat(dom)) {
                  case STAT_CAN_BIND:
                    if (parent) {
                        empty.prototype = parent;
                        node = new empty();
                        Class.call(node, dom, parent);
                    } else {
                        node = new Class(dom, parent);
                    }
                    return node;

                  case STAT_BINDED:
                    return true;

                  default:
                    return false;
                }
            }
            function bindDescendants(element, parent, includeCurrent) {
                var depth = 0, dom = element, localBind = bind;
                var current;
                if (includeCurrent !== false) {
                    localBind(dom);
                }
                dom = dom.firstChild;
                for (current = dom; current; ) {
                    if (!localBind(dom, parent)) {
                        dom = current.firstChild;
                        if (dom) {
                            depth++;
                            current = dom;
                            continue;
                        }
                    }
                    dom = current.nextSibling;
                    for (;!dom && depth-- && current; ) {
                        current = current.parentNode;
                        dom = current.nextSibling;
                    }
                    current = dom;
                }
                dom = current = null;
            }
            function destroy(element) {
                if (stat(element) === STAT_BINDED) {
                    LIBDOM.dispatch(element, "node-destroy", {
                        bubbles: false
                    });
                    return true;
                }
                return false;
            }
            function eachChildren(element, callback, arg1, arg2, arg3, arg4, arg5) {
                var depth = 0, dom = element, bindedStat = STAT_BINDED, getStat = stat;
                var current;
                dom = dom.firstChild;
                for (current = dom; current; ) {
                    if (getStat(element) !== bindedStat || callback(element, arg1, arg2, arg3, arg4, arg5) === false) {
                        dom = current.firstChild;
                        if (dom) {
                            depth++;
                            current = dom;
                            continue;
                        }
                    }
                    dom = current.nextSibling;
                    for (;!dom && depth-- && current; ) {
                        current = current.parentNode;
                        dom = current.nextSibling;
                    }
                    current = dom;
                }
                dom = current = null;
            }
            function destroyChildren(element) {
                eachChildren(element, destroy);
            }
            function onListenComponentListener(event, methodName, method, component) {
                var node = this;
                function boundToEvent(event) {
                    var promises = event.promises, notNodeEvent = !event.isNodeEvent;
                    var result;
                    if (!LIBCORE.array(promises)) {
                        promises = [];
                    }
                    if (notNodeEvent || !event.monitored) {
                        if (!notNodeEvent) {
                            event.monitored = true;
                        }
                        node.onBeforeEvent(event);
                    }
                    result = method.call(component, event, node, promises);
                    if (notNodeEvent) {
                        asyncAfterNodeEvent(node, event, promises.length ? Promise.all(promises) : null);
                    }
                    return result;
                }
                component[methodName] = boundToEvent;
                node.listened[event] = true;
                LIBDOM.on(node.dom, event, boundToEvent, component);
            }
            function onUnlistenComponentListener(event, methodName, method, component) {
                var node = this;
                LIBDOM.un(node.dom, event, method, component);
                node = null;
            }
            function initializeAndBindNodeDescendants(node) {
                node.dispatch("initialize").then(function() {
                    var current = node;
                    current.bindChildren();
                    if (!current.destroyed) {
                        current.dom.setAttribute(REGISTERED_NODE_ATTRIBUTE, "interactive");
                    }
                    current = null;
                });
            }
            function kickstart() {
                var G = global, component = COMPONENT, rootRole = ROOT_ROLE, root = G.document.documentElement;
                LIBDOM.un(G.window, "load", kickstart);
                G = null;
                if (!component.registered(rootRole)) {
                    component.register(rootRole, __webpack_require__(25));
                }
                switch (stat(root)) {
                  case STAT_ELEMENT:
                    root.setAttribute("role", rootRole);

                  case STAT_CAN_BIND:
                    bind(root, null);
                }
            }
            function asyncAfterNodeEvent(node, event, promise) {
                var P = Promise;
                function onAfterNodeEvent() {
                    if (!node.destroyed) {
                        node.onAfterEvent(event);
                    }
                    return event;
                }
                function onReject(e) {
                    onAfterNodeEvent();
                    return P.reject(e);
                }
                return (promise || Promise.resolve(event)).then(onAfterNodeEvent, onReject);
            }
            function Node(dom, parent) {
                var me = this, component = COMPONENT, create = component.create, names = component.roles(dom), each = EVENT.eachListener, listen = onListenComponentListener, components = [], except = {};
                var c, l, item;
                me.destroyed = false;
                me.dom = dom;
                me.data = {};
                me.listened = {};
                if (parent) {
                    me.parent = parent;
                    item = parent.lastChild;
                    if (item) {
                        item.nextSibling = me;
                        me.previousSibling = item;
                    } else {
                        parent.firstChild = me;
                    }
                    parent.lastChild = me;
                }
                me.components = components;
                dom.setAttribute(REGISTERED_NODE_ATTRIBUTE, "uninitialized");
                for (c = -1, l = names.length; l--; ) {
                    create(names[++c], components, except);
                }
                for (c = -1, l = components.length; l--; ) {
                    item = components[++c];
                    item.node = me;
                    each(item, listen, me);
                }
                item = null;
                LIBDOM.on(dom, "node-destroy", me.destroy, me);
                initializeAndBindNodeDescendants(me);
            }
            Node.prototype = {
                dom: null,
                stateChangeEvent: "state-change",
                parentStateChangeEvent: "parent-state-change",
                pendingEvents: 0,
                parent: null,
                firstChild: null,
                lastChild: null,
                previousSibling: null,
                nextSibing: null,
                data: null,
                cache: null,
                destroyed: true,
                constructor: Node,
                component: function(name) {
                    var me = this, components = me.components;
                    var l, component;
                    if (components && !me.destroyed) {
                        for (l = components.length; l--; ) {
                            component = components[l];
                            if (component.name === name) {
                                return component;
                            }
                        }
                    }
                    return null;
                },
                onBeforeEvent: function(event) {
                    var me = this;
                    if (!me.destroyed && event.type !== me.stateChangeEvent && 0 === me.pendingEvents++) {
                        me.cache = LIBCORE.clone(me.data, true);
                    }
                },
                onAfterEvent: function(event) {
                    var me = this, data = me.data, cache = me.cache, stateChangeEvent = me.stateChangeEvent, parentStateChangeEvent = me.parentStateChangeEvent;
                    var node, message;
                    if (!me.destroyed && event.type !== stateChangeEvent && 0 === --me.pendingEvents && !LIBCORE.compare(data, cache)) {
                        delete me.cache;
                        message = {
                            bubbles: false,
                            data: data,
                            cached: cache
                        };
                        me.dispatch(stateChangeEvent, message);
                        for (node = me.firstChild; node; node = node.nextSibling) {
                            me.dispatch(parentStateChangeEvent, message);
                        }
                        cache = null;
                    }
                },
                dispatch: function(event, message) {
                    var me = this, CORE = LIBCORE, P = Promise, async = asyncAfterNodeEvent;
                    var promises, listened, promise;
                    if (CORE.string(event)) {
                        listened = CORE.contains(me.listened, event);
                        message = CORE.object(message) ? CORE.assign({}, message) : {};
                        message.promises = promises = [];
                        message.isNodeEvent = true;
                        event = LIBDOM.dispatch(me.dom, event, message);
                        message.promises = null;
                        if (promises.length) {
                            promise = P.all(promises).then(function() {
                                promises.splice(0, promises.length);
                                event.promises = promises = null;
                                return event;
                            });
                        } else {
                            event.promises = promises = null;
                            promise = P.resolve(event);
                        }
                        return listened ? async(me, event, promise) : promise;
                    }
                    return P.reject("Invalid [event] parameter.");
                },
                bindChildren: function() {
                    var me = this, dom = me.dom;
                    if (!me.destroyed) {
                        bindDescendants(dom, me, false);
                    }
                    dom = null;
                    return me;
                },
                destroyChildren: function() {
                    var me = this, dom = me.dom;
                    if (dom) {
                        destroyChildren(dom);
                    }
                    dom = null;
                    return me;
                },
                destroy: function() {
                    var me = this, libdom = LIBDOM, each = EVENT.eachListener, unlisten = onUnlistenComponentListener;
                    var components, l, parent, previous, next, dom;
                    if (!me.destroyed) {
                        delete me.destroyed;
                        dom = me.dom;
                        if (dom) {
                            libdom.un(dom, "node-destroy", me.destroy, me);
                        }
                        me.destroyChildren();
                        if (dom) {
                            libdom.dispatch(me.dom, "destroy", {
                                bubbles: false
                            });
                        }
                        components = me.components;
                        if (components) {
                            for (l = components.length; l--; ) {
                                each(components[l], unlisten, me);
                            }
                            components.length = 0;
                        }
                        delete me.components;
                        parent = me.parent;
                        if (parent) {
                            previous = me.previousSibling;
                            next = me.nextSibling;
                            if (previous) {
                                previous.nextSibling = next;
                            }
                            if (next) {
                                next.previousSibling = previous;
                            }
                            if (parent.firstChild === me) {
                                parent.firstChild = previous || next;
                            }
                            if (parent.lastChild === me) {
                                parent.lastChild = next || previous;
                            }
                        }
                        dom = null;
                        LIBCORE.clear(me);
                    }
                    return me;
                }
            };
            module.exports = EXPORTS;
            LIBDOM.on(global.window, "load", kickstart);
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var LIBCORE = __webpack_require__(3), LISTENER_RE = /^on([a-zA-Z].*)$/;
        function methodToEventName(name) {
            var match = name.match(LISTENER_RE);
            var raw;
            if (match) {
                raw = match[1];
                return LIBCORE.uncamelize(raw.charAt(0).toLowerCase() + raw.substring(1, raw.length));
            }
            return null;
        }
        function eventNameToMethod(name) {
            return LIBCORE.camelize(name.charAt(0).toUpperCase() + name.substring(1, name.length));
        }
        function eachListener(instance, callback, scope) {
            var param = [ callback, scope ];
            LIBCORE.each(instance, eachListenerCallback, param, false);
        }
        function eachListenerCallback(value, name, instance) {
            var param = this, eventName = methodToEventName(name);
            if (eventName && LIBCORE.method(value)) {
                return param[0].call(param[1], eventName, name, value, instance);
            }
            return true;
        }
        function bindMethod(instance, name) {
            var original = instance[name];
            function boundToEvent() {
                return original.apply(instance, arguments);
            }
            instance[name] = boundToEvent;
        }
        module.exports = {
            bind: bindMethod,
            eachListener: eachListener,
            method2name: methodToEventName,
            name2method: eventNameToMethod
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var LIBCORE = __webpack_require__(3), Base = __webpack_require__(17);
        function Main() {
            Base.apply(this, arguments);
        }
        Main.prototype = LIBCORE.instantiate(Base, {
            requires: [ "lib-dom" ],
            constructor: Main
        });
        module.exports = Main;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var LIBCORE = __webpack_require__(3), BASE = __webpack_require__(17);
        function getAttribute(dom, name) {
            switch (name) {
              case "for":
                return dom.htmlFor;

              case "class":
              case "className":
                return dom.className;

              case "css":
              case "style":
                return dom.style.cssText;
            }
            return dom.getAttribute(name);
        }
        function setAttribute(dom, name, value) {
            switch (name) {
              case "for":
                dom.htmlFor = value;
                break;

              case "class":
              case "className":
                dom.className = value;
                break;

              case "css":
              case "style":
                dom.style.cssText = value;
                break;
            }
            console.log("get attribute", name, dom.getAttribute(name));
            return dom.getAttribute(name);
        }
        function Dom() {}
        Dom.prototype = LIBCORE.instantiate(BASE, {
            constructor: Dom,
            dom: function() {
                var node = this.node;
                return node ? node.dom : null;
            },
            attribute: function(name, value) {
                var me = this, CORE = LIBCORE, isString = CORE.string, dom = me.dom(), valid = dom && isString(name);
                if (arguments.length > 1) {
                    if (CORE.number(value)) {
                        value = value.toString();
                    }
                    if (valid && isString(value)) {
                        setAttribute(dom, name, value);
                    }
                    dom = me;
                } else {
                    dom = valid ? getAttribute(dom, name) : "";
                }
                return dom;
            }
        });
        module.exports = Dom;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var LIBCORE = __webpack_require__(3), TEMPLATE = __webpack_require__(28), BASE = __webpack_require__(17);
        function Template() {}
        Template.prototype = LIBCORE.instantiate(BASE, {
            requires: [ "lib-dom" ],
            templateAttr: "data-template",
            constructor: Template,
            onInitialize: function() {
                var me = this, promises = arguments[2], template = me.component("lib-dom").attribute(me.templateAttr);
                if (LIBCORE.string(template)) {
                    me.set("template.url", template);
                    promises[promises.length] = TEMPLATE.get(template).then(function(data) {
                        me.applyTemplate(data);
                    });
                }
            },
            applyTemplate: function(data) {
                var dom = this.component("lib-dom").dom();
                if (dom) {
                    this.node.destroyChildren(dom);
                    dom.innerHTML = data;
                }
            },
            onStateChange: function(event) {
                console.log("state change! ", event.data);
            }
        });
        module.exports = Template;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var LIBCORE = __webpack_require__(3), HTTP = __webpack_require__(29), TEMPLATES = LIBCORE.createRegistry(), EXPORTS = {
            add: add,
            get: get
        };
        function add(url, template) {
            var CORE = LIBCORE, isString = CORE.string;
            var loaded, obj;
            if (isString(url)) {
                loaded = true;
                if (CORE.array(template)) {
                    template = template.join("\n");
                }
                if (!isString(template)) {
                    template = "";
                    loaded = false;
                }
                obj = {
                    loaded: loaded,
                    data: template
                };
                TEMPLATES.set(url, obj);
                return obj;
            }
            return null;
        }
        function get(url) {
            var P = Promise, templates = TEMPLATES;
            var obj;
            if (!LIBCORE.string(url)) {
                return P.reject("Invalid [url] parameter.");
            }
            obj = templates.get(url);
            if (!obj) {
                obj = add(url);
            }
            if (!obj.loaded) {
                return HTTP(url).then(function(response) {
                    return setupTemplate(url, response);
                });
            }
            return P.resolve(obj.data);
        }
        function setupTemplate(url, response) {
            var obj = TEMPLATES.get(url), data = response.data;
            obj.loaded = true;
            if (LIBCORE.string(data)) {
                obj.template = data;
                return data;
            }
            return Promise.reject("Invalid template data");
        }
        module.exports = EXPORTS;
    }, function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_29__;
    } ]);
});

