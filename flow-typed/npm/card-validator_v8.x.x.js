// flow-typed signature: 7db772e720549335d6ed878ee91d11c1
// flow-typed version: <<STUB>>/card-validator_v^8.1.1/flow_v0.212.0
/**
* Copy from Typescript declaration of "credit-card-type" package
* https://github.com/atmulyana/rn-cc-input
*
* @format
* @flow strict-local
*/

declare module 'card-validator' {
    import typeof creditCardType from "credit-card-type";
    import type {CreditCardType} from "credit-card-type";
    
    declare export interface Verification {
        isValid: boolean;
        isPotentiallyValid: boolean;
    }

    declare function cardholderName(value: string | mixed): Verification;

    // declare type CreditCardType = {
    //     niceType: string;
    //     type: string;
    //     patterns: Array<number[] | number>;
    //     gaps: number[];
    //     lengths: number[];
    //     code: {
    //         name: string;
    //         size: number;
    //     };
    // };
    declare export interface CardNumberVerification extends Verification {
        card: CreditCardType | null;
    }
    declare type CardNumberOptions = {
        maxLength?: number;
        luhnValidateUnionPay?: boolean;
    };
    declare function cardNumber(value: string | mixed, options?: CardNumberOptions): CardNumberVerification;

    declare export interface ExpirationDateVerification extends Verification {
        month: string | null;
        year: string | null;
    }
    declare function expirationDate(value: string | Record<string, string | number> | mixed, maxElapsedYear?: number): ExpirationDateVerification;

    declare export interface ExpirationMonthVerification extends Verification {
        isValidForThisYear: boolean;
    }
    declare function expirationMonth(value: string | mixed): ExpirationMonthVerification;

    declare export interface ExpirationYearVerification extends Verification {
        isCurrentYear: boolean;
    }
    declare function expirationYear(value: string | mixed, maxElapsedYear?: number): ExpirationYearVerification;

    declare function cvv(value: string | mixed, maxLength?: number | number[]): Verification;

    declare type PostalCodeOptions = {
        minLength?: number;
    };
    declare function postalCode(value: string | mixed, options?: PostalCodeOptions): Verification;

    declare module.exports: {
        creditCardType: creditCardType;
        cardholderName: typeof cardholderName;
        number: typeof cardNumber;
        expirationDate: typeof expirationDate;
        expirationMonth: typeof expirationMonth;
        expirationYear: typeof expirationYear;
        cvv: typeof cvv;
        postalCode: typeof postalCode;
    };
}
