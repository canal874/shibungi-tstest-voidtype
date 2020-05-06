/** 
 * Copyright (c) Hidekazu Kubota 
 * This source code is licensed under the Mozilla Public License Version 2.0 found in the LICENSE file in the root directory of this source tree.
 */

/* Tested with tsc 3.8.3 */

export {}

/**
 * Comparing return type (1)
 * Return type 'non-void' is assignable to return type 'void'.
 */
interface MyInterface01 { myMethod(): void; }
class MyClass01 implements MyInterface01 {
    myMethod(): number { return 100; }
    /**
     * OK.
     * Return type 'number' is assignable to return type 'void'.
     * 
     * "substitutability" primer
     *  -- the fact that MyClass01.myMethod() returns "more" information than MyInterface01.myMethod() is expecting
     *     is a valid substitution.
     * See https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-functions-returning-non-void-assignable-to-function-returning-void
     * 
     * From another perspective, 
     * https://github.com/Microsoft/TypeScript/issues/4544#issuecomment-145615015
     * explains it by using 'Assignment Compatibility' from TypeScript Language Specification.
     * (Spec https://github.com/microsoft/TypeScript/blob/master/doc/spec.md#3114-assignment-compatibility)
     * But, note that the specification is outdated (version 1.8, January, 2016).
     * 
     * And try to use never when you would like to define it never returns a value.
     * See https://github.com/Microsoft/TypeScript/issues/9603#issuecomment-231654924
     */
}

/**
 * Comparing return type (1b)
 * Return type 'void' is not same as return type 'never'.
 */
interface MyInterface01b { myMethod(): never; myMethod2(): never; }
class MyClass01b implements MyInterface01b {
    myMethod(): number { return 100; } /* Type error. The result differs from MyClass01. */
    myMethod2(): never { while( true ); } /* Ok. See https://github.com/Microsoft/TypeScript/issues/9603#issuecomment-231654924 */
}

/**
 * Comparing return type (2)
 * Return type '() => void' is not assignable to return type '() => non-void'.
 */
interface MyInterface02 { myMethod(): number; }
class MyClassB implements MyInterface02 {
    myMethod(): void {}
    /**
     * Type Error. Type '() => void' is not assignable to type '() => number'.
     * The return type 'void' does not contain enough data for type 'number'.
     */
}

