/** 
 * Copyright (c) Hidekazu Kubota 
 * This source code is licensed under the Mozilla Public License Version 2.0 found in the LICENSE file in the root directory of this source tree.
 */

/* Tested with tsc 3.8.3 */

export {}

/**
 * Posted this issue to TypeScript Git
 * https://github.com/microsoft/TypeScript/issues/38284
 */

const a: () => number = (): void => {};  // Type error. It is expected.
const b: () => void = (): number => { return 7 };  // Ok. It is expected.

/**
 Compatibility error when callback has void return type

 a and b are expected behaviors which have been discussed many times, see https://github.com/microsoft/TypeScript/issues/21674#issuecomment-363537054 
 But the following examples are different.
 */

const f: (x: () => number) => number = (y: () => void) => 7;  // Ok. It is expected.
const g: (x: () => void) => number = (y: () => 7) => 7; // Type error. It is not expected. It should be Ok.

/**
According to the Assignment Compatibility,

f is also expected behavior, that is to say,
type '(() => void) => number' is assignable to '(() => number) => number'
because both types are object (function) type
and the parameter type in '(() => void) => number' is assignable to or from the corresponding parameter type in '(() => number) => number'.

Here, parameter type '() => void' is assignable from type '() => number'.

g is expected to be ok because parameter type '() => number' is assignable to type '() => void',
according to Assignment Compatibility which says that 'each parameter type in N is assignable to or from the corresponding parameter type in M'.


Expected behavior:

Assignment Compatibility document may be wrong or its implementation may be wrong.
I assume that both may be wrong, f should be type error and g should be Ok in the same way as a and b.

*/