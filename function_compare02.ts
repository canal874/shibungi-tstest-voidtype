/** 
 * Copyright (c) Hidekazu Kubota 
 * This source code is licensed under the Mozilla Public License Version 2.0 found in the LICENSE file in the root directory of this source tree.
 */
export {}

interface MyInterface03 { myMethod(x: number): void; }
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
interface MyInterface04 { myMethod(x: number | void): void; }
/* Comparing parameter type (3) */
class MyClassE implements MyInterface04 {
    myMethod(x: void): void {}
    /* Ok. */
}


interface MyInterface05 { myMethod(x: void): void; } // Variable of type void: https://www.typescriptlang.org/docs/handbook/basic-types.html#void
/* Comparing parameter type (4) */
class MyClassF implements MyInterface05 {
    myMethod(x: number): void {}
    /** 
     * Error: Type '(x: number) => void' is not assignable to type '(x: void) => void'.
     * Return type number is assignable to return type void,
     * but not same in parameter type.
     */
}

/* Comparing higher-order functions */
interface MyInterface06 { myMethod(f: () => void): void; }
class MyClassG implements MyInterface06 {
    myMethod(f: () => number): void {}
    /** 
     * Error: Type '() => number' is not compatible to type '() => void'.
     * Return type number is assignable to return type void,
     * but not same in higher-order function.
     * 
     * Maybe this is answer. https://github.com/Microsoft/TypeScript/issues/4544#issuecomment-145615015
     * 
     * But then, the following example (MyClassJ, MyClassK) shows that 
     * return SuperType is assinable to return type SubType, and vice versa.
     */
}


interface MyInterface06_ { myMethod(f: () => number): void; }
class MyClassG_ implements MyInterface06_ {
    myMethod(f: () => void): void {}
    /** 
     * Ok.
     * 
     * Why?
     * これが関係しそう。
     * https://github.com/microsoft/TypeScript/issues/21674#issuecomment-363517206
     * 
     * むしろこちらか。  Maybe this is answer. https://github.com/Microsoft/TypeScript/issues/4544#issuecomment-145615015
     */
}


interface Event { timestamp: number; }
/* Comparing construct signatures (1) */
interface MyInterface07 { myMethod(f: { new (): void }): void; }
class MyClassH implements MyInterface07 {
    myMethod(f: { new (): Event }): void { let g:Event = new f();}
    /** 
     * Ok.
     * 
     * construct signature 'new (): number' is assignable to 'new (): void'.
     * ... Why?
     * In MyClassH.myMethod, new f() returns number.
     * In MyInterface07.myMethod, new f() returns undefined.
     * 
     * =>
     * Assignment Compatibility を読むこと。
     * https://github.com/microsoft/TypeScript/blob/master/doc/spec.md#3114-assignment-compatibility
     * ここにずばり書いてある。
     *
     * S is assignable to a type T is :
     *
     * S is an object type, an intersection type, an enum type, or the Number, Boolean, or String primitive type, 
     * T is an object type, and for each member M in T, one of the following is true:
     * という条件に対して、
     *
     *　・M is a non-specialized call or construct signature and S has an apparent call or construct signature N where, when M and N are instantiated using type Any as the type argument for all type parameters declared by M and N (if any),
　の場合で、
     *   　・the result type of M is Void, or the result type of N is assignable to that of M.
     */
}

/* Comparing construct signatures (2) */
interface MyInterface08 { myMethod(f: { new (): string }): void; }
class MyClassI implements MyInterface08 {
    myMethod(f: { new (): Event }): void {}
    /** 
     * Error.
     * 
     * ... Why?
     * 
     * =>
     * Assignment Compatibility を読むこと。上と同じ。
     * https://github.com/microsoft/TypeScript/blob/master/doc/spec.md#3114-assignment-compatibility
     * ここにずばり書いてある。
     * S is an object type, an intersection type, an enum type, or the Number, Boolean, or String primitive type, T is an object type, and for each member M in T, one of the following is true:
という条件について、
     *　・M is a non-specialized call or construct signature and S has an apparent call or construct signature N where, when M and N are instantiated using type Any as the type argument for all type parameters declared by M and N (if any),
　の場合で、
     *   　・the result type of M is Void, or the result type of N is assignable to that of M.* 
     */
}


/* Appendix */
interface MouseEvent extends Event { x: number; y: number }

interface MyInterface09 { myMethod(e: MouseEvent): void; }
class MyClassJ implements MyInterface09 {
    myMethod(e: Event): void { console.log(e.timestamp); }
    /** 
     * Of course, it is Ok.
     * In addtion to that, function parameters are bivariant. 
     * See: https://www.typescriptlang.org/docs/handbook/type-compatibility.html#function-parameter-bivariance
     */
}

interface MyInterface10 { myMethod(f: () => Event): void; }
class MyClassK implements MyInterface10 {
    myMethod(f: () => MouseEvent): void { console.log(f().timestamp); }
    /** 
     * It is also Ok.
     */
}

