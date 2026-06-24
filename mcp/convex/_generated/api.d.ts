/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as _auth from "../_auth.js";
import type * as _shared from "../_shared.js";
import type * as activity from "../activity.js";
import type * as adminDashboard from "../adminDashboard.js";
import type * as aiJobs from "../aiJobs.js";
import type * as applications from "../applications.js";
import type * as devSeed from "../devSeed.js";
import type * as interactions from "../interactions.js";
import type * as listings from "../listings.js";
import type * as media from "../media.js";
import type * as payments from "../payments.js";
import type * as verificationDocuments from "../verificationDocuments.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  _auth: typeof _auth;
  _shared: typeof _shared;
  activity: typeof activity;
  adminDashboard: typeof adminDashboard;
  aiJobs: typeof aiJobs;
  applications: typeof applications;
  devSeed: typeof devSeed;
  interactions: typeof interactions;
  listings: typeof listings;
  media: typeof media;
  payments: typeof payments;
  verificationDocuments: typeof verificationDocuments;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
