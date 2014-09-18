'use strict';

var _ = require('./lib');

var ruffle = {};
ruffle.mixins = require('./mixins');
ruffle._ = _;
ruffle.utils = _;

/**
 * Public API
 */

ruffle.compose = _.reverseArgsTo(_.compose);

// Wrap up an old-style component to be used here
function wrap(fn) {
    return function contextWrapper(x) {
        fn.call(x, x);
        return x;
    };
}

// Flight-like
// TODO generalise this so it's easy to add methods to the component function
ruffle.component = function component() {
    return _.through(
        _.apply(
            ruffle.compose,
            ruffle.base,
            _.map(wrap, _.arr(arguments))
        ),
        function (component) {
            component.attachTo = function () {
                // TODO implement multi selector/node stuff
                this.apply(this, arguments);
            };
            return component;
        }
    );
};

// React-like
ruffle.createClass = function createClass(base, config) {
    if (arguments.length === 1) {
        config = base;
        base = ruffle.base;
    }
    return ruffle.compose(
        base,
        function ($) {
            $.props = $.attr;
            return Object.keys(config).reduce(function ($, k) {
                $.after(k, config[k]);
                return $;
            }, $);
        }
    );
};

ruffle.base = ruffle.compose(
    ruffle.mixins.base,
    ruffle.mixins.initialize,
    ruffle.mixins.attributes,
    ruffle.mixins.advice,
    ruffle.mixins.events
);

ruffle.attach = function ($, selector, attr) {
    return [].map.call(document.querySelectorAll(selector), function (elem) {
        return $(elem, attr);
    });
};

module.exports = ruffle;