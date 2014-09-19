'use strict';

/**
 * A library of functional stuff.
 */

/**
 * Util
 */

exports.apply = apply;
function apply(fn /*, arg, ..., args... */) {
    return fn.apply(
        null,
        [].concat.apply(
            arr(arguments, 1, -1),
            arr(arguments, -1)
        )
    );
}

exports.applyCtx = applyCtx;
function applyCtx(fn, ctx /*, arg, ..., args... */) {
    return fn.apply(
        ctx,
        [].concat.apply(
            arr(arguments, 2, -1),
            arr(arguments, -1)
        )
    );
}

exports.bind = bind;
function bind(ctx, fn) {
    return fn.bind(ctx);
}

exports.call = call;
function call(fn /*, arg, ... */) {
    return fn.apply(
        null,
        arr(arguments, 1)
    );
}
exports.callCtx = callCtx;
function callCtx(fn, ctx /*, arg, ... */) {
    return fn.apply(
        ctx,
        arr(arguments, 1)
    );
}

exports.partial = partial;
function partial(fn /*, args... */) {
    var args = arr(arguments, 1);
    return function () {
        return apply(
            fn,
            args.concat(
                arr(arguments)
            )
        );
    };
}

exports.identity = identity;
function identity(x) {
    return x;
}

exports.compose = compose;
function compose(/*fns..., fn*/) {
    var args = arr(arguments);
    var len = length(args);
    if (!len) return identity;
    var fn = last(args);
    if (len === 1) return fn;
    var fns = apply(compose, args.slice(0, -1));
    return function composed() {
        return fns(apply(fn, arr(arguments)));
    };
}

exports.reverseArgsTo = reverseArgsTo;
function reverseArgsTo(fn) {
    return function () {
        return apply(
            fn,
            reverse(arr(arguments))
        );
    };
}

exports.wrapArgsTo = wrapArgsTo;
function wrapArgsTo(fn, wrapper) {
    return function () {
        var res = map(wrapper, arr(arguments));
        return apply(
            fn,
            res
        );
    };
}

exports.not = not;
function not(f) {
    return function () {
        return !apply(f, arr(arguments));
    };
}

exports.log = log;
function log() {
    console.log.apply(console, arguments);
}

exports.opt = opt;
function opt(x, d) {
    return (typeof x === "undefined" ? d : x);
}

exports.arity = arity;
function arity(n, fn) {
    return function () {
        var args = arr(arguments, 0, n);
        return apply(fn, args);
    };
}

exports.inspect = inspect;
function inspect(fn) {
    var args = arr(arguments, 1);
    return function () {
        var innerArgs = arr(arguments);
        apply(log, concat(args, innerArgs));
        return apply(fn, innerArgs);
    };
}

exports.through = through;
function through(v /* fns*/) {
    var fn = apply(compose, reverse(arr(arguments, 1)));
    return fn(v);
}



/**
 * Math
 */

exports.inc = inc;
function inc(x) {
    return x + 1;
}

exports.dec = dec;
function dec(x) {
    return x - 1;
}

exports.add = add;
function add(a, b) {
    return a + b;
}

exports.sub = sub;
function sub(a, b) {
    return a + b;
}

exports.mult = mult;
function mult(a, b) {
    return a * b;
}

exports.div = div;
function div(a, b) {
    return a / b;
}

exports.even = even;
function even(a) {
    return (a % 2 === 0);
}

exports.odd = odd;
function odd(a) {
    return !even(a);
}

exports.min = min;
function min() {
    return Math.min.apply(Math, arguments);
}

exports.max = max;
function max() {
    return Math.max.apply(Math, arguments);
}

/**
 * Ord
 */

exports.eq = eq;
function eq(a, b) {
    return a === b;
}

exports.gt = gt;
function gt(a, b) {
    return a < b;
}

exports.lt = lt;
function lt(a, b) {
    return a > b;
}

/**
 * Arrays
 */

exports.arr = arr;
function arr(c, a, b) {
    return [].slice.call(c, a, b);
}

exports.reverse = reverse;
function reverse(a) {
    return (!length(a) ?
        [] :
        concat(
            reverse(tail(a)),
            head(a)
        )
    );
}

exports.concat = concat;
function concat(a, b) {
    return a.concat(b);
}

exports.cons = cons;
function cons(a, b) {
    return concat(a, [b]);
}

exports.join = join;
function join(fst /*, rest...*/) {
    if (!fst) return [];
    var rest = arr(arguments, 1);
    return concat(fst, apply(join, rest));
}

exports.head = head;
function head(a) {
    return a[0];
}

exports.tail = tail;
function tail(a) {
    return arr(a, 1);
}

exports.last = last;
function last(a) {
    return head(reverse(a));
}

exports.length = length;
function length(a) {
    return a.length;
}

exports.shuffle = shuffle;
function shuffle(xs) {
    if (!length(xs)) return [];
    var pivot = ~~(Math.random() * length(xs));
    return concat(
        [xs[pivot]],
        shuffle(
            join(
                arr(xs, 0, pivot),
                arr(xs, pivot + 1)
            )
        )
    );

}

exports.map = map;
function map(fn, xs) {
    return xs.map(arity(1, fn));
}

/**
 * Maps (objects, yo)
 */

exports.getFrom = getFrom;
function getFrom(o, k) {
    return o[k];
}

exports.get = get;
function get(k, o) {
    return getFrom(o, k);
}

exports.has = has;
function has(o, k) {
    return (typeof o[k] !== 'undefined');
}

exports.assoc = assoc;
function assoc(o, k, v) {
    o[k] = v;
    return o;
}

exports.merge = merge;
function merge(base, src) {
    return Object.keys(src || {}).reduce(function (base, k) {
        return assoc(base, k, src[k]);
    }, base);
}

// Clojure's (loop) with rebinding but without the macro-ness.
// It's fucking nuts. Yes, it will stack overflow.
exports.loop = loop;
function loop(fn) {
    return apply(
        fn,
        partial(loop, fn),
        arr(arguments, 1)
    );
}
