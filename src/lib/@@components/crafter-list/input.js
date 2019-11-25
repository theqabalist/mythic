'use strict';

const h = require('hyperscript');
const {div, select, option} = require('hyperscript-helpers')(h);
const classnames = require('classnames');
const {compose, lensProp, over, append, pipe, complement, isEmpty, ifElse, identity} = require('ramda');
const {hidden} = require('@@styles');
const {lens: {lists}, updateState} = require('@@app-state');
const {adjustClasses} = require('@@styles/classes');
const {$} = require('@@externs');
const {$$} = require('@@stream');

module.exports = ({title, color, validDefaults, validAddition, editThis$}) => {
  const identifier = title.toLowerCase();
  const listLens = compose(lists, lensProp(identifier));

  const inputComponent = select('.ui.fluid.search.selection.dropdown', {name: 'additionalItem'}, [
    option({value: ''}, [title])
  ]);

  const $inputComponent = $(inputComponent);
  const dropdown = $inputComponent.dropdown.bind($inputComponent);

  $$(inputComponent).change$
    .debounce(10, {immediate: true})
    .filter(pipe(e => e.target.value.trim(), complement(isEmpty)))
    .onValue(e => {
      const addition = e.target.value.trim();
      updateState(pipe(
        over(listLens, ifElse(validAddition(addition), append(addition), identity))
      ));
      setTimeout(() => {
        dropdown('clear');
      });
    });

  const component = div({className: classnames('ui basic segment', color, hidden)}, [inputComponent]);

  dropdown({
    values: validDefaults.map(def => ({name: def, value: def})),
    allowAdditions: true,
    forceSelection: false,
    selectOnKeydown: false,
    allowReselection: true
  });

  editThis$
    .onValue(editingThis => {
      adjustClasses(component, color, {[hidden]: !editingThis});
      if (editingThis) {
        dropdown('show').find('input')[0].focus();
      }
    });

  return component;
};
