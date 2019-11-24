'use strict';

const cx = require('classnames/dedupe');

module.exports = {
  adjustClasses: (node, ...classes) => {
    node.className = cx(node.className, ...classes); // eslint-disable-line no-param-reassign
  }
};
