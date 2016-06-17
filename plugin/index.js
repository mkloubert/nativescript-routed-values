// The MIT License (MIT)
// 
// Copyright (c) Marcel Joachim Kloubert <marcel.kloubert@gmx.net>
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.
"use strict";
var Observable = require("data/observable");
var TypeUtils = require("utils/types");
/**
 * Name of the property for a "real" / non-routed value.
 */
exports.INNER_VALUE_PROPERTY = 'innerValue';
/**
 * Name of the property for a routed value.
 */
exports.VALUE_PROPERTY = 'value';
/**
 * List of router stradegies.
 */
(function (RouterStradegy) {
    /**
     * Take the value from parent (if greater)
     */
    RouterStradegy[RouterStradegy["Ascending"] = 0] = "Ascending";
    /**
     * Take the value from parent (if smaller)
     */
    RouterStradegy[RouterStradegy["Descending"] = 1] = "Descending";
})(exports.RouterStradegy || (exports.RouterStradegy = {}));
var RouterStradegy = exports.RouterStradegy;
/**
 * List of values that represent a traffic light.
 */
(function (TraficLight) {
    /**
     * None (gray)
     **/
    TraficLight[TraficLight["None"] = 0] = "None";
    /**
     * OK (green)
     **/
    TraficLight[TraficLight["OK"] = 1] = "OK";
    /**
     * Warning (yellow)
     **/
    TraficLight[TraficLight["Warning"] = 2] = "Warning";
    /**
     * Error (red)
     **/
    TraficLight[TraficLight["Error"] = 3] = "Error";
    /**
     * Fatal error (yellow / red)
     **/
    TraficLight[TraficLight["FatalError"] = 4] = "FatalError";
})(exports.TraficLight || (exports.TraficLight = {}));
var TraficLight = exports.TraficLight;
/**
 * A routed value.
 */
var RoutedValue = (function (_super) {
    __extends(RoutedValue, _super);
    /**
     * Initializes a new instance of that class.
     *
     * @param {RouterStradegy} [stradegy] The router stradegy.
     * @param {Function} [comparer] The comparer for the values.
     */
    function RoutedValue(stradegy, comparer) {
        if (stradegy === void 0) { stradegy = RouterStradegy.Ascending; }
        _super.call(this);
        /**
         * Stores the children.
         */
        this._children = [];
        /**
         * Stores the parents.
         */
        this._parents = [];
        this._stradegy = stradegy;
        this._comparer = comparer;
        if (TypeUtils.isNullOrUndefined(this._comparer)) {
            this._comparer = function (x, y) {
                if (x < y) {
                    return -1;
                }
                if (x > y) {
                    return 1;
                }
                return 0;
            };
        }
    }
    /**
     * Adds a list of children.
     *
     * @chainable
     *
     * @param {RoutedState} ...children One or more child to add.
     */
    RoutedValue.prototype.addChildren = function () {
        var children = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            children[_i - 0] = arguments[_i];
        }
        return this.addChildArray(children);
    };
    /**
     * Adds a list of children.
     *
     * @chainable
     *
     * @param {Array} children The children to add.
     */
    RoutedValue.prototype.addChildArray = function (children) {
        if (TypeUtils.isNullOrUndefined(children)) {
            return this;
        }
        for (var i = 0; i < children.length; i++) {
            var c = children[i];
            if (TypeUtils.isNullOrUndefined(c)) {
                continue;
            }
            for (var ii = 0; ii < this._parents.length; ii++) {
                var p = this._children[ii];
                if (p === c) {
                    throw "Child object is already a parent!";
                }
            }
            this._children.push(c);
            c.addParentItem(this, false);
        }
        return this;
    };
    /**
     * Adds a parent item.
     *
     * @param {RoutedValue} parent The parent item to add.
     * @param {Boolean} addChild Also add that instance as child item for 'parent' or not.
     */
    RoutedValue.prototype.addParentItem = function (parent, addChild) {
        var me = this;
        for (var i = 0; i < this._children.length; i++) {
            var c = this._children[i];
            if (c === parent) {
                throw "Parent object is already a child!";
            }
        }
        if (addChild) {
            parent.addChildren(this);
        }
        parent.on(Observable.Observable.propertyChangeEvent, function (e) {
            var sender = e.object;
            switch (e.propertyName) {
                case exports.VALUE_PROPERTY:
                    if (me.shouldTakeParentValue(sender.value)) {
                        me.raiseValueChanged();
                    }
                    break;
            }
        });
        var oldValue = this.value;
        this._parents.push(parent);
        if (this.shouldTakeParentValue(parent.value, oldValue)) {
            this.raiseValueChanged();
        }
    };
    /**
     * Adds a list of parents.
     *
     * @chainable
     *
     * @param {RoutedState} ...parents One or more parent to add.
     */
    RoutedValue.prototype.addParents = function () {
        var parents = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parents[_i - 0] = arguments[_i];
        }
        return this.addParentArray(parents);
    };
    /**
     * Adds a list of parents.
     *
     * @chainable
     *
     * @param {Array} parents The parents to add.
     */
    RoutedValue.prototype.addParentArray = function (parents) {
        if (TypeUtils.isNullOrUndefined(parents)) {
            return this;
        }
        for (var i = 0; i < parents.length; i++) {
            var p = parents[i];
            if (TypeUtils.isNullOrUndefined(p)) {
                continue;
            }
            this.addParentItem(p, true);
        }
        return this;
    };
    Object.defineProperty(RoutedValue.prototype, "innerValue", {
        /**
         * Gets or sets the "real" (not routed) value of that instance.
         */
        get: function () {
            return this._innerValue;
        },
        set: function (newValue) {
            var oldInnerValue = this._innerValue;
            var oldValue = this.value;
            this._innerValue = newValue;
            if (oldInnerValue !== newValue) {
                this.notifyPropertyChange(exports.INNER_VALUE_PROPERTY, newValue);
            }
            if (oldValue !== this.value) {
                this.raiseValueChanged();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Raises the property change event for the value property.
     */
    RoutedValue.prototype.raiseValueChanged = function () {
        this.notifyPropertyChange(exports.VALUE_PROPERTY, this.value);
        for (var i = 0; i < this._children.length; i++) {
            this._children[i]
                .raiseValueChanged();
        }
    };
    /**
     * Checks if a parent value should be taken instead of the own one.
     * This depends on the value comparer function that is used by that instance.
     *
     * @param {T} parentValue The "parent" value.
     * @param {T} [thisValue] The custom value to take that is handled as "own" value.
     *
     * @return {Boolean} 'parentValue' should be taken or now.
     */
    RoutedValue.prototype.shouldTakeParentValue = function (parentValue, thisValue) {
        if (arguments.length < 2) {
            thisValue = this._innerValue;
        }
        var compVal = this._comparer(thisValue, parentValue);
        switch (this.stradegy) {
            case RouterStradegy.Ascending:
                return compVal < 0; // parent is greater
            case RouterStradegy.Descending:
                return compVal > 0; // "own" value is greater
        }
    };
    Object.defineProperty(RoutedValue.prototype, "stradegy", {
        /**
         * Gets the router stradegy.
         */
        get: function () {
            return this._stradegy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoutedValue.prototype, "value", {
        /**
         * Gets the routed value.
         */
        get: function () {
            var result = this._innerValue;
            // check parents
            for (var i = 0; i < this._parents.length; i++) {
                var p = this._parents[i];
                var pVal = p.value;
                if (this.shouldTakeParentValue(pVal, result)) {
                    result = pVal;
                }
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    return RoutedValue;
}(Observable.Observable));
exports.RoutedValue = RoutedValue;
/**
 * A routed number.
 */
var RoutedNumber = (function (_super) {
    __extends(RoutedNumber, _super);
    function RoutedNumber() {
        _super.call(this);
        this._innerValue = 0;
    }
    return RoutedNumber;
}(RoutedValue));
exports.RoutedNumber = RoutedNumber;
/**
 * A routed traffic light.
 */
var TrafficState = (function (_super) {
    __extends(TrafficState, _super);
    function TrafficState() {
        _super.apply(this, arguments);
    }
    return TrafficState;
}(RoutedValue));
exports.TrafficState = TrafficState;
//# sourceMappingURL=index.js.map