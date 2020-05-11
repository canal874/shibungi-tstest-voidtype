/** 
 * Copyright (c) Hidekazu Kubota 
 * This source code is licensed under the Mozilla Public License Version 2.0 found in the LICENSE file in the root directory of this source tree.
 */

/* Tested with tsc 3.8.3 with strict compiler options */

export {}

/*
 * Appendix: TypeScript function types are just special cases of TypeScript object types.
 *
 * https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#13-object-types
 * https://microsoft.github.io/TypeScript-New-Handbook/everything/#call-signatures
 * 
 * The bare signature indicates that instances of the interface are callable. 
 * This example illustrates that TypeScript function types are just special cases of TypeScript object types.
 * Specifically, function types are object types that contain one or more call signatures. 
 * For this reason we can write any function type as an object type literal. 
 * The following example uses both forms to describe the same type.
 */

interface MyFunc {
    (): number;
}
const myFunc: MyFunc = ():number => { return 7 };

var f: { (): string; };
var sameType: () => string = f;     // Ok  
var nope: () => number = sameType;  // Error: type mismatch

