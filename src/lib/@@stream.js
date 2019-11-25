'use strict';

const {fromEvents} = require('kefir');
const {last} = require('ramda');

const mk$ = emitter => new Proxy(emitter, {
  get(target, prop) {
    return last(prop) === '$' ? fromEvents(emitter, prop.slice(0, -1)) : emitter[prop];
  }
});

module.exports = {mk$};
