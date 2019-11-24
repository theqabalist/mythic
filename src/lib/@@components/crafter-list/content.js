'use strict';

const cx = require('classnames');
const {div} = require('@@hyperscript');
const {
  view, length, compose, lensProp, equals, lensIndex
} = require('ramda');
const {state$, lens: {lists}} = require('@@app-state');
const {hidden} = require('@@styles');

const ListItem = ({lens}) => {
  const component = div('.item');

  state$
    .map(view(lens))
    .onValue(content => {
      component.innerHTML = content;
    });

  return component;
};

const componentClass = cx('ui basic segment left aligned');

module.exports = ({title, color}) => {
  const identifier = title.toLowerCase();
  const lens = compose(lists, lensProp(identifier));
  const containerComponent = div('.ui.ordered.list');
  const component = div({className: cx(componentClass, color)}, [containerComponent]);

  const listLength$ = state$
    .map(view(lens))
    .map(length);

  listLength$
    .onValue(size => {
      let capacity = containerComponent.children.length;
      while (capacity > size) {
        containerComponent.removeChild(containerComponent.lastChild);
        capacity -= 1;
      }

      while (capacity < size) {
        containerComponent.appendChild(ListItem({lens: compose(lens, lensIndex(capacity))}));
        capacity += 1;
      }
    });

  listLength$
    .map(equals(0))
    .onValue(hasNoItems => {
      component.className = cx(componentClass, color, {[hidden]: hasNoItems});
    });

  return component;
};
