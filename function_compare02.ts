/** 
 * Copyright (c) Hidekazu Kubota 
 * This source code is licensed under the Mozilla Public License Version 2.0 found in the LICENSE file in the root directory of this source tree.
 */

/* Tested with tsc 3.8.3 with strict compiler options */

export {}

/**
 * Comparing parameter type (1) 
 * Fewer parameters are OK.
 */ 
interface MyInterface03 { myMethod(x: number): void; }
class MyClass03 implements MyInterface03 {
    myMethod(): void {}
    /* OK.
     * MyInterface03.myMethod() has 1 argument and this method has no argument.
     * https://www.typescriptlang.org/docs/handbook/type-compatibility.html#comparing-two-functions
     * https://basarat.gitbook.io/typescript/type-system/type-compatibility#number-of-arguments
     */    
}
/**
 * Comparing parameter type (1b) 
 * Parameter type 'void' does not mean no argument.
 */
interface MyInterface03b { myMethod(x: number): void; }
class MyClass03b implements MyInterface03b {
    myMethod(x: void): void {}
    /** 
     * Error.
     * Use union type to allow parameter type 'void' like MyInterface03c.
     */
}
/**
 * Comparing parameter type (1c) 
 * Of course, paremeter type 'void' is assignable to a union type of 'void' and 'non-void'.
 */
interface MyInterface03c { myMethod(x: void | number): void; }
class MyClass03c implements MyInterface03c {
    myMethod(x: void): void {} /* OK. */
}


/**
 * Comparing parameter type (2)
 * Both have equal number of parameters, but different types.
 */
interface MyInterface04 { myMethod(x: void): void; } 
class MyClass04 implements MyInterface04 {
    myMethod(x: number): void {}
    /** 
     * Error.
     * Parameter type 'void' is not assignable to parameter type 'number'.
     * 
     * Note that type checker try to assign the declaration parameter type  of 'myMethod(x: void)'
     * to the implementation parameter type of 'myMethod(x: number)'
     * when check compatibility of two functions.
     * 
     * In other words, assignment flips when a parameter appears as an input to a function.
     * See https://github.com/microsoft/TypeScript/issues/38284#issuecomment-622380749
     * 
     * This is the so-called 'contravariance' in the argument type. 
     * See also https://www.stephanboyer.com/post/132/what-are-covariance-and-contravariance
     * 
     * The reason why the error message says "Type 'void' is not assignable to type 'number'" is that 
     * myMethod accepts type 'void' parameter by definition, but it does not assign to type 'number' in its implementation.
     */
}


/**
 * Comparing parameter type (3)
 * 
 * The arguments in method or constructor declarations are evaluated bivariantly
 * even though the compiler flag strictFunctionTypes is true.
 * 
 * 'The stricter checking applies to all function types, except those originating in method or constructor declarations.'
 * (https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#strict-function-types)
 *  
 * This exception is reluctantly allowed mainly for parameters of Array<T>.push() method to be bivariant.
 * See https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-function-parameters-bivariant
 */
interface Event { timestamp: number; }
interface MouseEvent extends Event { x: number; y: number }

interface MyInterface05 { myMethod(e: MouseEvent): void; }
class MyClass05 implements MyInterface05 {
    myMethod(e: Event): void { console.log(e.timestamp); } /* OK. */
}
interface MyInterface05b { myMethod(e: Event): void; }
class MyClass05b implements MyInterface05b {
    myMethod(e: MouseEvent): void { console.log(e.x); } /* This does not cause type error, but may cause runtime error. */
}
// The arguments in function (except the arguments in method or constructor declarations) are evaluated contravariantly
// only if the compiler flag strictFunctionTypes is true.
// See https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#strict-function-types
const func5: (e: MouseEvent) => void = (e: Event): void => { console.log(e.timestamp); }; /* OK. */
const func5b: (e: Event) => void = (e: MouseEvent): void => { console.log(e.x); }; /* Type error only if the compiler flag strictFunctionTypes is true. */


/**
 * Comparing parameter type (3b)
 * Construct signature that returns non-void type is assinable to the construct signature that returns void type.
 */
interface MyInterface05c { myMethod(f: { new (): Event }): void; }
class MyClass05c implements MyInterface05c {
    myMethod(f: { new (): void }): void {} /* OK. */
}
interface MyInterface05d { myMethod(f: { new (): void }): void; }
class MyClass05d implements MyInterface05d {
    myMethod(f: { new (): Event }): void { let g:Event = new f();}  /* This does not cause type error, but may cause runtime error. */
}
const func5c: (f: { new (): Event }) => void = (f: { new (): void }): void => {}; /* OK. */
const func5d: (f: { new (): void }) => void = (f: { new (): Event }): void => { console.log(new f().timestamp) }; /* Type error only if the compiler flag strictFunctionTypes is true. */


/**
 * Comparing paremeter type (3c)
 * Note that return type 'non-void' and return type 'void' are not evaluated bivariantly
 * when an argument is callback function.
 */
interface MyInterface05e { myMethod(f: () => void): void; }
class MyClass05e implements MyInterface05e {
    myMethod(f: () => number): void {} /* Type error. */
}
interface MyInterface05f { myMethod(f: () => number ): void; }
class MyClass05f implements MyInterface05f {
    myMethod(f: () => void): void {} /* OK. */
}



/**
 * Assigning non-void types to void type
 * In short:
 */

// [Return type]
//  Return type 'non-void' is assignable to return type 'void'.
const a1: () => number = (): void => {};  // Type error.
const a2: () => void = (): number => { return 7 };  // Ok.

// [Parameter type]
// Parameter type 'non-void' is not assignable to parameter type 'void' and vice versa.
const b1: (x: number) => number = (y: void) => 7;  // Type error.
const b2: (x: void) => number = (y: number) => 7; // Type error.

//  The arguments in function (except those in method or constructor declarations) are evaluated contravariantly.
//  The arguments in method or constructor are evaluated bivariantly.
const c1: (x: () => number) => number = (y: () => void) => 7;  // Ok. This is contravariant. In addition, return type 'non-void' is assignable to return type 'void'.
const c2: (x: () => void) => number = (y: () => 7) => 7; // Type error.

// Either is OK because it is not a function but a method.
interface d1           { myMethod(f: () => MouseEvent): void }
class D1 implements d1 { myMethod(f: () => Event): void {}} // OK.
interface d2           { myMethod(f: () => Event): void }
class D2 implements d2 { myMethod(f: () => MouseEvent): void {}} // This is also OK.

// e2 causes error.
interface e1           { myMethod(f: () => number): void } 
class E1 implements e1 { myMethod(f: () => void): void {}} // OK.
interface e2           { myMethod(f: () => void): void }
class E2 implements e2 { myMethod(f: () => number): void {}} // Type error.
