'use strict';


var LIBCORE = require("libcore"),
    LIBDOM = require("libdom"),
    ROLE_ATTRIBUTE = 'role',
    BASE_CLASS = "base",
    COMPONENTS = LIBCORE.createRegistry(),
    EXPORTS = {
        register: register,
        roles: getRoles,
        create: instantiate
    };


function getRegisteredRoles(str) {
    var list = COMPONENTS,
        roles = str.split(' '),
        l = roles.length;
    var role;
    
    for (; l--;) {
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
    var CORE = LIBCORE,
        list = COMPONENTS;
    
    if (CORE.string(name) && CORE.object(config)) {
        list.set(name, {
            name: name,
            created: false,
            Class: null,
            properties: CORE.assign({}, config)
        });
    }
    
    return EXPORTS.chain;
}



function instantiate(name, instances, except) {
    var CORE = LIBCORE,
        contains = CORE.contains,
        me = instantiate,
        list = COMPONENTS;
        
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
    
    for (c = -1, l = requires.length; l--;) {
        item = requires[++c];
        if (!contains(except, item)) {
            me(item, instances, except);
        }
    }
    
    instances[instances.length] = instance = new Class();
    return instance;
}

function createClass(name, createList) {
    var CORE = LIBCORE,
        isString = CORE.string,
        contains = CORE.contains,
        list = COMPONENTS,
        definition = list.get(name),
        properties = definition.properties,
        Base = properties.based,
        requires = properties.requires;
    
    var Constructor, l, BasePrototype;
    
    if (!createList) {
        createList = {};
    }
    
    createList[name] = true;
    
    // superclass
    if (isString(Base)) {
        if (!list.exists(Base)) {
            throw new Error("Invalid base Class " + Base);
        }
        if (contains(createList, Base)) {
            throw new Error(
                "Cyclic inheritance of " + Base + " and " + name + " found.");
        }
        Base = list.get(Base);
    }
    else {
        
        Base = list.get(BASE_CLASS);
        
    }
    
    Base = !Base.created ?
                    createClass(Base.name, createList) :
                    Base.Class;
    
    Constructor = contains(properties, 'constructor') ?
                        properties.constructor : createConstructor(Base);
    
    properties = CORE.assign(CORE.instantiate(Base), properties);
    properties.constructor = Constructor;
    Constructor.prototype = properties;
    
    BasePrototype = Base.prototype;
    
    // validate mixin requires
    if (CORE.array(requires)) {
        requires = BasePrototype.requires.concat(requires);
                                                     
        for (l = requires.length; l--;) {
            if (!isString(requires[l])) {
                requires.splice(l, 1);
            }
        }
    }
    else {
        requires = BasePrototype.requires.slice(0);
    }
    
    properties.requires = Base.prototype.requires.concat(requires);
        
    // update definition
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

// manual register
COMPONENTS.set(BASE_CLASS, {
    name: BASE_CLASS,
    created: true,
    Class: require("./component/base.js"),
    requires: [],
    properties: {}
});

