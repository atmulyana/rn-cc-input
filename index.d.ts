/**
 * https://github.com/atmulyana/rn-cc-input
 */
import React from 'react';

type Maybe<T> = T | null | undefined;

export type CCInstance = {
    readonly isValid: boolean,
    setValidationError: (isError: boolean) => any,
    readonly value: Maybe<{
        number: Maybe<string>,
        expired: {
            month: number,
            year: number,
        },
        cvc: Maybe<string>,
        cardHolder: Maybe<string>,
        postalCode: Maybe<string>,
    }>,
};

export type CCProps = {
    cardHolderText?: string,
    ifValidNumberNext?: boolean,
    numberText?: string,
    placeholderTextColor?: ColorValue,
    placeholderTextColorError?: ColorValue,
    postalCodeText?: string,
    showCardHolder?: boolean,
    showPostalCode?: boolean,
    style?: TextInputStyle,
    styleArrow?: ViewStyle,
    styleArrowError?: ViewStyle,
    styleError?: TextInputStyle,
    styleField?: TextInputStyle,
    styleFieldError?: TextInputStyle,
    styleIcon?: ImageStyle,
    validator?: () => {clearValidation: () => void},
};

declare var CreditCard: ReturnType<typeof React.forwardRef<CCInstance, CCProps>>; //Generic arguments are in reverse order if compared to Flow React.forwardRef
export default CreditCard;