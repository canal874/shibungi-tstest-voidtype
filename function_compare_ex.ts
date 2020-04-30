/**
 * Verification code of 'The weird world of type-compatibility in TypeScript’
 * https://www.earthli.com/news/view_article.php?id=3391
 */

interface IB {
    name: string;
}

interface IA {
    f(action: (p: IB) => void): IA;
}

class A implements IA {
    // OK
    f = (action: (p: IB) => void): IA => {
        return this;
    }
}

class A2 implements IA {
    // Type error
    f = (action: () => IB): IA => {
        return this;
    }
}

class A3 implements IA {
    // Type error
    f = (action: (p: IB) => IA): IA => {
        return this;
    }
}

class A4 implements IA {
    // Type error    
    f = (action: () => void): IA => {
        return this;
    }
}

class A5 implements IA {
    // Ok
    f = (): IA => {
        return this;
    }
}
