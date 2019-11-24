'use strict';

const {fromEvents} = require('kefir');
const h = require('hyperscript');
const {
  div
} = require('hyperscript-helpers')(h);
const classnames = require('classnames');
const {css} = require('emotion');

const CrafterList = require('@@components/crafter-list');

const Page = () => div({className: classnames('ui', 'equal', 'width', 'grid', 'container', css`padding-top: 25px !important;`)}, [
  div('.column', [CrafterList({title: 'Locations', icon: 'home', color: 'red'})]),
  div('.column', [CrafterList({title: 'Encounters', icon: 'user', color: 'green'})]),
  div('.column', [CrafterList({title: 'Objects', icon: 'shopping bag', color: 'blue'})])
]);

fromEvents(window, 'load')
  .take(1)
  .onValue(() => {
    document.body.appendChild(Page());
  });
