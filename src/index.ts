/**
 * Improvement on top of React.lazy() that allows lazy rendering of named imports
 * Usage:
 *
 *  -- alternative to import { primary } from './Button'
 *  const PrimaryButton = lazier(() => import('./Button'), 'primary');
 *
 *  -- get the default import
 *  lazier(() => import('./Button'), 'default');
 *
 *  -- or
 *  lazier(() => import('./Button'));
 *
 */
// @ts-check
import * as React from 'react';
import get from 'lodash.get';

type LazyNamed = (
  thenable: () => Promise<{
    [name: string]: any;
  }>,
  name: string
) => React.LazyExoticComponent<React.ComponentType<any>>;

/**
 * @param {() => Promise<*>} thenable
 * @param {String=} name
 */
const lazier: LazyNamed = (thenable, name = 'default') =>
  React.lazy(() => thenable().then(mod => ({ default: get(mod, name) })));

export default lazier;
