// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2013 M-Way Solutions GmbH. All rights reserved.
//            (c) 2013 panacoda GmbH. All rights reserved.
// Creator:   Frank
// Date:      13.04.2013
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

M.DataEntity = M.Object.extend(/** @scope M.DataEntity.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    _type: 'M.DataEntity',

    name:   '',

    key:    '',

    model:  null,

    _fields: {},

    create: function(obj) {
        var name = obj.name;
        if (!name && obj.model && _.isFunction(obj.model.getName)) {
            name = obj.model.getName();
        }
        var key  = obj.key;
        if (!key && obj.model && _.isFunction(obj.model.getKey)) {
            key = obj.model.getKey();
        }
        if (name) {
            entity = this.extend({
                name:   name,
                key:    key,
                model:  obj.model,
                _fields: {}
            });

            if (entity.model) {
                // entity._mergeFields(obj.model.getFields());
            }

            if (obj.fields) {
//                var fields = {};
//                _.each(obj.fields, function(def, name) {
//                    fields[name] = M.DataField.extend(def);
//                });
                entity._mergeFields(obj.fields);
            }

            if (!obj.model) {
                // create dynamic model
                entity.model = M.Model.extend({
                    idAttribute: key,
                    getName: function() { return name; }
                });
            }
            entity._updateFields(obj.typeMap);
        }
        return entity;
    },

    getFields: function() {
        return this._fields;
    },

    getField: function(fieldKey) {
        return this._fields[fieldKey];
    },

    getFieldName: function(fieldKey) {
        var field = this.getField(fieldKey);
        return field && field.name ? field.name : fieldKey;
    },

    getKey: function() {
        return this.key;
    },

    getKeys: function() {
        return this.splitKey(this.key);
    },

    /**
      * Splits a comma separated list of keys to a key array
      *
      * @returns {Array} array of keys
      */
     splitKey: function(key) {
         var keys = [];
         if( _.isString(key) ) {
             _.each(key.split(","), function(key) {
                 var k = key.trim();
                 if( k ) {
                     keys.push(k);
                 }
             });
         }
         return keys;
     },

    getModel: function() {
        return this.model;
    },

    _mergeFields: function(newFields) {
        if (!_.isObject(this._fields)) {
            this._fields = {};
        }
        var that = this;
        if (newFields) {
            _.each(newFields, function(value, key) {
                if (!that._fields[key]) {
                    that._fields[key] = M.DataField.create(value);
                } else {
                    that._fields[key].merge(value);
                }
            });
        }
    },

    _updateFields: function(typeMap) {
        var that = this;
        _.each(this._fields, function(value, key) {
            // remove unused properties
            if (value.persistent === NO) {
                delete that._fields[key];
            } else {
                // add missing names
                if (!value.name) {
                    value.name = key;
                }
                // apply default type conversions
                if (typeMap && typeMap[value.type]) {
                    value.type = typeMap[value.type];
                }
            }
        });
    },

    toRecord: function(data) {
        if (data && this.model && this._fields) {
            // map field names
            var attributes = {};
            _.each(this._fields, function(field, key) {
                attributes[key] = data[field.name];
            });
            return this.model.create(attributes);
        }
    },

    fromRecord: function(record) {
        var that = this;
        var data = {};
        if (record && this._fields) {
//            var rec  = _.isFunction(record.getData) ? record.getData() : record;
            _.each(this._fields, function(field, key) {
                var value = _.isFunction(record.get) ? record.get(key) : record[key];
                value = field.transform(value);
                if( !_.isUndefined(value) ) {
                    data[field.name] = value;
                }
            });
        }
        return data;
    }


});