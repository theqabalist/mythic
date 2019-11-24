'use strict';

const {fromEvents} = require('kefir');
const {
  view, equals, set, not, T, F
} = require('ramda');
const {
  div, h1, i
} = require('@@hyperscript');
const cx = require('classnames/dedupe');
const {adjustClasses} = require('@@styles/classes');
const {state$, lens: {editing}, updateState} = require('@@app-state');
const {hidden, clickable} = require('@@styles');

const ListInput = require('./input');
const Content = require('./content');

const mkHoverStream = component => fromEvents(component, 'mouseover')
  .map(T)
  .merge(fromEvents(component, 'mouseout').map(F))
  .toProperty();

const edit$ = state$
  .map(view(editing));

module.exports = ({title, icon, color}) => {
  const identifier = title.toLowerCase();
  const addComponent = div('.ui.basic.segment.center.aligned', [i({className: cx('ui large add icon', color)})]);

  const editThis$ = edit$.map(equals(identifier));

  const component = div('.ui.segments', [
    div('.ui.center.aligned.basic.segment', [
      h1({className: cx('ui icon header', color)}, [
        i({className: cx(icon, 'icon')}),
        div('.content', [title])])]),
    Content({title, color}),
    addComponent,
    ListInput({title, color, editThis$})]);

  mkHoverStream(component)
    .filterBy(editThis$.map(not))
    .onValue(hover => {
      adjustClasses(component, {raised: hover, [clickable]: hover});
      adjustClasses(addComponent, color, {[hidden]: !hover});
    });

  editThis$
    .onValue(editingThis => {
      adjustClasses(component, {raised: editingThis, [clickable]: !editingThis});
      adjustClasses(addComponent, color, hidden);
    });

  fromEvents(component, 'click')
    .onValue(() => {
      updateState(set(editing, identifier));
    });

  fromEvents(document.body, 'click')
    .filterBy(editThis$)
    .filter(e => !component.contains(e.target))
    .onValue(() => {
      updateState(set(editing, null));
    });

  return component;
};
