/** 
 * Copyright (c) Hidekazu Kubota 
 * This source code is licensed under the Mozilla Public License Version 2.0 found in the LICENSE file in the root directory of this source tree.
 */

/* Tested with tsc 3.8.3 */

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
     * Type '(x: void) => void' is not assignable to type '(x: number) => void'.
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
     * The reason why the error message says "Type 'void' is not assignable to type 'number'" is that 
     * myMethod accepts type 'void' parameter by definition, but it does not assign to type 'number' in its implementation.
     */
}

/**
 * Comparing parameter type (2b)
 * Both have equal number of parameters, but different types.
 */
interface MyInterface04b { myMethod(x: number): void; } 
class MyClass04b implements MyInterface04b {
    myMethod(x: void): void {}
    /** 
     * It is also Error. Parameter type 'number' is not assignable to parameter type 'void'.
     */
}

/**
 * Comparing paremeter type (2c)
 * In case of parameter type is callback function
 */
interface MyInterface04c { myMethod(f: () => void ): void; }
class MyClass04c implements MyInterface04c {
    myMethod(f: () => number): void {}
    /** 
     * Error.
     * Return type 'void' is not assignable to return type 'number'.
     */
}

/**
 * Comparing paremeter type (4d)
 * In case of parameter type is callback function
 */
interface MyInterface04d { myMethod(f: () => number ): void; }
class MyClass04d implements MyInterface04d {
    myMethod(f: () => void): void {}
    /* OK.
     * Return type 'number' is assignable to return type 'void'. 
     */
}


/**
 * Comparing construct signatures
 * Constructor that returns non-void type is assinable to the constructor that returns void type.
 * And it seems that type compatibility between construct signatures is bivariant
 * even though the compiler flag strictFunctionTypes is true.
 * 
 * The reason of bivariant is currently unknown. Can anyone explain why?
 * I assume that bivariant is default
 * (See https://www.typescriptlang.org/docs/handbook/type-compatibility.html#function-parameter-bivariance )
 * and strictFunctionTypes flag does not care about interface.
 * 
 */
interface Event { timestamp: number; }
interface MouseEvent extends Event { x: number; y: number }

interface MyInterface05 { myMethod(f: { new (): void }): void; }
class MyClass05 implements MyInterface05 {
    myMethod(f: { new (): Event }): void { let g:Event = new f();}  /* OK. */
}
interface MyInterface05b { myMethod(f: { new (): Event }): void; }
class MyClass05b implements MyInterface05b {
    myMethod(f: { new (): void }): void {} /* It is also OK. */
}
interface MyInterface05c { myMethod(f: { new (): string }): void; }
class MyClass05c implements MyInterface05c {
    myMethod(f: { new (): Event }): void { let g:Event = new f();} /* Type error. Type 'string' is not assignable to type 'Event'. */
}

/**
 * Appendix: Comparing supertype and subtype
 * It seems that type compatibility between supertype and subtype is bivariant
 * even though the compiler flag strictFunctionTypes is true.
 * 
 * The reason of bivariant is currently unknown. Can anyone explain why?
 * I assume that bivariant is default
 * (See https://www.typescriptlang.org/docs/handbook/type-compatibility.html#function-parameter-bivariance )
 * and strictFunctionTypes flag does not care about interface.
 * 
 */
interface MyInterface05d { myMethod(e: MouseEvent): void; }
class MyClass05d implements MyInterface05d {
    myMethod(e: Event): void { console.log(e.timestamp); } /* OK. */
}
interface MyInterface05e { myMethod(f: () => Event): void; }
class MyClass05e implements MyInterface05e {
    myMethod(f: () => MouseEvent): void { console.log(f().timestamp); } /* It is also OK. It differs from the case in func02 below. */
}
const func01: (x: MouseEvent) => number = (y: Event) => 7; // OK.
const func02: (x: Event) => number = (y: MouseEvent) => 7; // This raises type error only if the compiler flag strictFunctionTypes is true. 
                                                      // See https://www.typescriptlang.org/docs/handbook/type-compatibility.html#function-parameter-bivariance


/**
 * Assigning non-void types to void type
 * In short:
 */

// [Return type]
//  Return type 'non-void' is assignable to return type 'void'.
//  See https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-functions-returning-non-void-assignable-to-function-returning-void
const a1: () => number = (): void => {};  // Type error.
const a2: () => void = (): number => { return 7 };  // Ok.

// [Parameter type]
//  Note that type checker tries to assign a left parameter type to a right parameter type
//  when a parameter appears as an input to a function.
//  See https://github.com/microsoft/TypeScript/issues/38284#issuecomment-622380749
const b1: (x: number) => number = (y: void) => 7;  // Type error.
const b2: (x: void) => number = (y: number) => 7; // Type error.

const c1: (x: () => number) => number = (y: () => void) => 7;  // Ok.
const c2: (x: () => void) => number = (y: () => 7) => 7; // Type error.



