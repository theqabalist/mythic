'use strict';

const h = require('hyperscript');
const {div} = require('hyperscript-helpers')(h);
const classnames = require('classnames');
const {css} = require('emotion');
const {includes, curry} = require('ramda');
const {$$} = require('@@stream');

const CrafterList = require('@@components/crafter-list');

const Page = () => div({className: classnames('ui', 'equal', 'width', 'grid', 'container', css`padding-top: 25px !important;`)}, [
  div('.column', [
    CrafterList({
      title: 'Locations',
      icon: 'home',
      color: 'red',
      validDefaults: ['Expected', 'Random', 'Special', 'Complete'],
      validAddition: curry((addition, list) => addition !== 'Complete' || !includes(addition, list))
    })]),
  div('.column', [
    CrafterList({
      title: 'Encounters',
      icon: 'user',
      color: 'green',
      validDefaults: ['None', 'Expected', 'Random', 'Special']
    })]),
  div('.column', [
    CrafterList({
      title: 'Objects',
      icon: 'shopping bag',
      color: 'blue',
      validDefaults: ['None', 'Expected', 'Random', 'Special']
    })])
]);

$$(window).load$
  .take(1)
  .onValue(() => {
    document.body.appendChild(Page());
  });
