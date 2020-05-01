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
    /* OK: MyInterface03.myMethod has 1 argument and this method has no argument.
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
     * Error: Type '(x: void) => void' is not assignable to type '(x: number) => void'.
     * Use union type to allow parameter type 'void' like MyInterface03c.
     */
}
/**
 * Comparing parameter type (1c) 
 * Of course, paremeter type 'void' is assignable to a union type of 'void' and 'non-void'.
 */
interface MyInterface03c { myMethod(x: void | number): void; }
class MyClass03c implements MyInterface03c {
    myMethod(x: void): void {} /* Ok. */
}


/**
 * Comparing parameter type (2)
 * Both have equal number of parameters, but different types.
 */
interface MyInterface04 { myMethod(x: void): void; } 
class MyClass04 implements MyInterface04 {
    myMethod(x: number): void {}
    /** 
     * Error: Type 'void' is not assignable to type 'number'.
     * 
     * Note that type checker try to assign a parameter type of the declaration 'myMethod(x: void): void'
     * to a parameter type of its implementation 'myMethod(x: number): void {}'
     * when check compatibility of two functions.
     * The reason is currently unknown. https://github.com/microsoft/TypeScript/issues/38284
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
     * It is also Error. Type 'number' is not assignable to type 'void'.
     */
}

/**
 * Comparing paremeter type (3)
 * In case of parameter type is callback function
 */
interface MyInterface05 { myMethod(f: () => void ): void; }
class MyClass05 implements MyInterface05 {
    myMethod(f: () => number): void {}
    /** 
     * Error: 
     * Return type 'number' is assignable to return type 'void' (See MyClass01),
     * but not same in higher-order function.
     * 
     * The type checker try to assign a parameter type of the declaration 'myMethod(f: () => void): void'
     * to a parameter type of its implementation 'myMethod(f: () => number): void {}'
     * when check compatibility of two functions.
     * The reason is currently unknown. https://github.com/microsoft/TypeScript/issues/38284
     *
     * So the reason of this type error is that return type 'void' is not assignable to return type 'number'.
     */
}

/**
 * Comparing paremeter type (3b)
 * In case of parameter type is callback function
 */
interface MyInterface05b { myMethod(f: () => number ): void; }
class MyClass05b implements MyInterface05b {
    myMethod(f: () => void): void {}
    /* OK: Return type 'number' is assignable to return type 'void'. */
}

/**
 * Comparing return type and comparing parameter type (3c)
 * In short:
 */

 // Return type:
 // Type checker tries to assign right return type to left return type
const a: () => number = (): void => {};  // Type error.
const b: () => void = (): number => { return 7 };  // Ok.

// Parameter type:
// Type checker tries to assign left parameter type to right parameter type
const f: (x: () => number) => number = (y: () => void) => 7;  // Ok.
const g: (x: () => void) => number = (y: () => 7) => 7; // Type error.


/**
 * Comparing construct signatures (1) 
 * Constructor that returns void type is assinable to the constructor that returns non-void type.
 */
interface Event { timestamp: number; }
interface MyInterface06 { myMethod(f: { new (): void }): void; }
class MyClass06 implements MyInterface06 {
    myMethod(f: { new (): Event }): void { let g:Event = new f();}
    /** 
     * Ok.
     * It seemes that return type 'Event' is assignable to return type 'void' in construct signatures.
     * 
     * This behavior is reverse of the behavior of the above case of callback function.
     * The reason is currently unknown. Can anyone explain why?
     */
}

/**
 *  Comparing construct signatures (1b)
 *  Constructor that returns non-void type is assinable to the constructor that returns void type.
 */
interface MyInterface06b { myMethod(f: { new (): Event }): void; }
class MyClass06b implements MyInterface06b {
    myMethod(f: { new (): void }): void {}
    /** 
     * It is also Ok.
     */
}

/**
 * Comparing construct signatures (1c) 
 * Constructor that returns non-void type is not assinable to the constructor that returns another non-void type.
 */
interface Event { timestamp: number; }
interface MyInterface06c { myMethod(f: { new (): string }): void; }
class MyClass06c implements MyInterface06c {
    myMethod(f: { new (): Event }): void { let g:Event = new f();}
    /** 
     * Error. Type 'string' is not assignable to type 'Event'.
     */
}


/**
 * Appendix
 * Comparing super type and sub type
 */
interface MouseEvent extends Event { x: number; y: number }
interface MyInterface07 { myMethod(e: MouseEvent): void; }
class MyClass07 implements MyInterface07 {
    myMethod(e: Event): void { console.log(e.timestamp); }
    /** 
     * Of course, it is Ok.
     * 
     * SuperType is assinable to return type SubType, and vice versa (bivariant).
     * See: https://www.typescriptlang.org/docs/handbook/type-compatibility.html#function-parameter-bivariance
     */
}

interface MyInterface07b { myMethod(f: () => Event): void; }
class MyClass07b implements MyInterface07b {
    myMethod(f: () => MouseEvent): void { console.log(f().timestamp); }
    /** 
     * It is also Ok.
     */
}

