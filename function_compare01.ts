/** 
 * Copyright (c) Hidekazu Kubota 
 * This source code is licensed under the Mozilla Public License Version 2.0 found in the LICENSE file in the root directory of this source tree.
 */
export {}
interface MyInterface01 { myMethod(): void; }
interface MyInterface02 { myMethod(): number; }

/* Comparing return type (1) */
class MyClassA implements MyInterface01 {
    myMethod(): number { return 100; }
    /**
     * OK: Return type 'number' is assignable to return type 'void'.
     * Covariant assignment is Ok. In other words, assigning a wider return type to a narrower return type is Ok.
     * See https://www.typescriptlang.org/docs/handbook/type-compatibility.html#comparing-two-functions
     */
}

/* Comparing return type (2) */
class MyClassB implements MyInterface02 {
    myMethod(): void {}
    /**
     * Error: Type '() => void' is not assignable to type '() => number'.
     * The return type 'void' does not contain enough data for type 'number'.
     */
}