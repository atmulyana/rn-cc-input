/**
 * Copy from Typescript declaration of "credit-card-type" package
 * https://github.com/atmulyana/rn-cc-input
 *
 * @format
 * @flow strict-local
 */
declare module 'credit-card-type' {
    declare export type CreditCardTypeCardBrandId =
        | "american-express"
        | "diners-club"
        | "discover"
        | "elo"
        | "hiper"
        | "hipercard"
        | "jcb"
        | "maestro"
        | "mastercard"
        | "mir"
        | "unionpay"
        | "visa";
    declare type CreditCardTypeCardBrandNiceType =
        | "American Express"
        | "Diners Club"
        | "Discover"
        | "Elo"
        | "Hiper"
        | "Hipercard"
        | "JCB"
        | "Maestro"
        | "Mastercard"
        | "Mir"
        | "UnionPay"
        | "Visa";
    declare type CreditCardTypeSecurityCodeLabel =
        | "CVV"
        | "CVC"
        | "CID"
        | "CVN"
        | "CVE"
        | "CVP2";
    declare export type CreditCardType = {
        niceType: string;
        type: string;
        patterns: Array<number[] | number>;
        gaps: number[];
        lengths: number[];
        code: {
            size: number;
            name: string;
        };
        matchStrength?: number;
    }
    declare export type BuiltInCreditCardType = {
        ...CreditCardType,
        niceType: CreditCardTypeCardBrandNiceType,
        type: CreditCardTypeCardBrandId,
        code: {
            size: 3 | 4,
            name: CreditCardTypeSecurityCodeLabel,
        },
    }
    declare export interface CardCollection {
        [propName: string]: CreditCardType;
    }

    declare type creditCardTypeObj = {
        getTypeInfo: (cardType: string) => CreditCardType,
        removeCard: (name: string) => void,
        addCard: (config: CreditCardType) => void,
        updateCard: (cardType: string, updates: Partial<CreditCardType>) => void,
        changeOrder: (name: string, position: number) => void,
        resetModifications: () => void,
        types: Record<string, CreditCardTypeCardBrandId>,
    }
    declare type creditCardType = ((cardNumber: string) => Array<CreditCardType>) & creditCardTypeObj;
    declare module.exports: creditCardType;
}