'use strict';

const h = require('hyperscript');
const {
  div, input
} = require('hyperscript-helpers')(h);
const classnames = require('classnames');
const {
  compose, lensProp, over, append, pipe
} = require('ramda');
const {hidden} = require('@@styles');
const {lens: {lists}, updateState} = require('@@app-state');
const {fromEvents} = require('kefir');
const {adjustClasses} = require('@@styles/classes');

const enterKey = 13;

module.exports = ({title, color, editThis$}) => {
  const identifier = title.toLowerCase();
  const listLens = compose(lists, lensProp(identifier));

  const inputComponent = input({type: 'text', placeholder: title});

  fromEvents(inputComponent, 'keydown')
    .filter(e => e.keyCode === enterKey)
    .onValue(e => {
      updateState(pipe(
        over(listLens, append(e.target.value.trim()))
      ));
      e.target.value = '';
    });

  const component = div({className: classnames('ui basic segment', color, hidden)}, [
    div('.ui.fluid.input', [
      inputComponent])]);

  editThis$
    .onValue(editingThis => {
      adjustClasses(component, color, {[hidden]: !editingThis});
      inputComponent.focus();
    });

  return component;
};
