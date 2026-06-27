import { lifecycleFunctions } from './lifecycle.js';
import { notificationFunctions } from './notifications.js';

export const functions = [...lifecycleFunctions, ...notificationFunctions];
