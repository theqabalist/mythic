'use strict';

const cx = require('classnames');
const {div, i} = require('@@hyperscript');
const {view, length, compose, lensProp, equals, lensIndex, over, remove} = require('ramda');
const {state$, lens: {lists}, updateState} = require('@@app-state');
const {hidden, clickable} = require('@@styles');
const {$} = require('@@externs');
const {css} = require('emotion');
const {fromEvents} = require('kefir');
const uuid = require('uuid/v4');

const hiddenDrag = css`
  .drag-handle, .remove {
    display: none;
    ${clickable};
    margin-left: 0 !important;
  }

  .editing &:hover {
    .drag-handle, .remove {
      display: block;
    }
  }
`;

const ListItem = ({lens, removeItem}) => {
  const contentComponent = div('.middle.aligned.content');
  const removeComponent = i('.red.remove.icon');
  const component = div(`#${uuid()}`, {className: cx('item', hiddenDrag)}, [
    div('.right.floated.content.remove', [removeComponent]),
    div('.right.floated.content.drag-handle', [i('.middle.aligned.sort.icon')]),
    contentComponent
  ]);

  fromEvents(removeComponent, 'click')
    .map(e => {
      e.stopPropagation();
      return null;
    })
    .onValue(removeItem);

  state$
    .map(view(lens))
    .onValue(content => {
      contentComponent.innerHTML = content;
    });

  return component;
};

const componentClass = cx('ui basic segment left aligned');

module.exports = ({title, color}) => {
  const identifier = title.toLowerCase();
  const lens = compose(lists, lensProp(identifier));
  const containerComponent = div('.ui.large.ordered.list');

  const $sortable = $(containerComponent).sortable({handle: '.drag-handle'});
  const sortStart$ = fromEvents($sortable, 'sortstart');
  const sortEnd$ = fromEvents($sortable, 'sortend');

  const removeItem = idx => () => {
    updateState(over(lens, remove(idx, 1)));
  };

  sortStart$
    .map(() => $sortable.sortable('toArray'))
    .zip(sortEnd$.map(() => $sortable.sortable('toArray')))
    .map(([oldOrder, newOrder]) => newOrder.map(item => oldOrder.indexOf(item)))
    .onValue(reIndex => {
      updateState(over(lens, list => reIndex.map(idx => list[idx])));
      Array.from(containerComponent.children).forEach((child, idx) => {
        containerComponent.replaceChild(ListItem({lens: compose(lens, lensIndex(idx)), removeItem: removeItem(idx)}), child);
      });
    });

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
        containerComponent.appendChild(ListItem({lens: compose(lens, lensIndex(capacity)), removeItem: removeItem(capacity)}));
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
