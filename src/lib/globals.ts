// ─── Globals bootstrap ───
// The original site shipped three browser scripts that communicated through
// `window`: a tokens script set window.SENTINEL / window.SENTINEL_LINKS, an
// unpacker set window.__resources (asset URLs), and the three component files
// hung their shared components/hooks (atomStyles, ChipDark, SentinelMark,
// useIsMobile, every section) on `window` so later files could read them.
//
// To keep the ported components byte-for-byte faithful — they still say
// `window.SENTINEL`, `window.__resources.heroVideo`, `window.SentinelMark` —
// we reproduce that contract on `globalThis`. On the server `window` is
// undefined, so we alias it to `globalThis`; the components then resolve the
// same names whether they render on the server or hydrate in the browser.
//
// Import this module for its side effects BEFORE the component modules.

import * as React from 'react';
import { SENTINEL, SENTINEL_LINKS } from './sentinel';
import { RESOURCES } from './resources';

const g = globalThis as unknown as Record<string, unknown>;

// On the server there is no `window`; make it the global object so the
// components' `window.*` lookups resolve. In the browser `window` already
// exists and === globalThis, so this is a no-op there.
if (typeof (g as { window?: unknown }).window === 'undefined') {
  (g as { window?: unknown }).window = g;
}

// React is referenced as a bare global (`const { useState } = React`) inside
// the ported component files, mirroring the UMD <script> the bundle loaded.
g.React = React;

// Token + link contract.
g.SENTINEL = SENTINEL;
g.SENTINEL_LINKS = SENTINEL_LINKS;

// Asset URL map (was window.__resources, populated by the unpacker).
g.__resources = RESOURCES;

export {};
