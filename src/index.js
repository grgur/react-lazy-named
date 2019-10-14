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
import { lazy } from 'react';
import get from 'lodash.get';

/**
 * @param {() => Promise<*>} thenable
 * @param {String} name
 */
const lazier = (thenable, name = 'default') =>
  lazy(() => thenable().then(mod => ({ default: get(mod, name) })));

export default lazier;
