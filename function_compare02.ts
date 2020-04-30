/** 
 * Copyright (c) Hidekazu Kubota 
 * This source code is licensed under the Mozilla Public License Version 2.0 found in the LICENSE file in the root directory of this source tree.
 */
export {}
interface MyInterface03 { myMethod(x: number): void; }
interface MyInterface04 { myMethod(x: number | void): void; }
interface MyInterface05 { myMethod(x: void): void; } // Variable of type void: https://www.typescriptlang.org/docs/handbook/basic-types.html#void

/* Comparing parameter type (1) */
class MyClassC implements MyInterface03 {
    myMethod(): void {}
    /* OK: Fewer arguments are Ok. 
     * MyInterface03.myMethod has 1 argument and this method has no argument.
     * https://www.typescriptlang.org/docs/handbook/type-compatibility.html#comparing-two-functions
     * https://basarat.gitbook.io/typescript/type-system/type-compatibility#number-of-arguments
     */    
}

/* Comparing parameter type (2) */
class MyClassD implements MyInterface03 {
    myMethod(x: void): void {}
    /** 
     * Error: Type '(x: void) => void' is not assignable to type '(x: number) => void'.
     * void parameter type does not mean no argument.
     * Use MyInterface04 to allow void parameter type.
     */
}

/* Comparing parameter type (3) */
class MyClassE implements MyInterface04 {
    myMethod(x: void): void {}
    /* Ok. */
}

/* Comparing parameter type (4) */
class MyClassF implements MyInterface05 {
    myMethod(x: number): void {}
    /** 
     * Error: Type '(x: number) => void' is not assignable to type '(x: void) => void'.
     * Return type number is assignable to return type void,
     * but not same in parameter type.
     */
}

/* Appendix */
interface Event { timestamp: number; }
interface MouseEvent extends Event { x: number; y: number }
interface MyInterface06 { myMethod(e: Event): void; }
class MyClassG implements MyInterface06 {
    myMethod(e: MouseEvent): void {}
    /** 
     * Of course, it is Ok.
     * In addtion to that, function parameters are bivariant. 
     * See: https://www.typescriptlang.org/docs/handbook/type-compatibility.html#function-parameter-bivariance
     */
}