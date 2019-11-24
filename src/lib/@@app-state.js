'use strict';

const {
  lensProp, prop, identity, applyTo
} = require('ramda');
const {fromEvents} = require('kefir');

const defaultState = {
  editing: null,
  lists: {
    locations: [],
    encounters: [],
    objects: []
  }
};

const lists = lensProp('lists');
const editing = lensProp('editing');

const state$ = fromEvents(document, 'updateState')
  .map(prop('detail'))
  .toProperty(() => identity)
  .scan(applyTo, defaultState);

module.exports = {
  state$,
  updateState: f => document.dispatchEvent(new CustomEvent('updateState', {detail: f})),
  lens: {
    lists,
    editing
  }
};
