/**
 * https://github.com/atmulyana/rn-cc-input
 *
 * @flow
 */
import * as React from 'react';
import typeof {
    Image as ImageType,
    ScrollView as ScrollViewType,
    TextInput as TextInputType,
    View as ViewType,
} from 'react-native';
import type {
    Verification,
} from 'card-validator';
import type {
    ExtractComponentPropsInstance
} from 'reactjs-common';

type TextInputPropsInstance = $Call<ExtractComponentPropsInstance, TextInputType>;
export type TextInputProps = TextInputPropsInstance['props'];
export type TextInputInstance = TextInputPropsInstance['instance'];
export type TextInputStyle = $NonMaybeType<TextInputProps['style']>;
type ColorValue = TextInputProps['placeholderTextColor'];

type ViewProps = $Call<ExtractComponentPropsInstance, ViewType>['props'];
type ViewStyle = $NonMaybeType<ViewProps['style']>;

type ImageProps = $Call<ExtractComponentPropsInstance, ImageType>['props'];
type ImageStyle = $NonMaybeType<ImageProps['style']>;

type ScrollViewPropsInstance = $Call<ExtractComponentPropsInstance, ScrollViewType>;
export type ScrollViewInstance = ScrollViewPropsInstance['instance'];
export type ScrollViewProps = ScrollViewPropsInstance['props'];

export type FieldInstance<V: Verification> = {
    +isValid: boolean,
    validatorParams: $ReadOnlyArray<mixed>,
    +validity: ?V,
    +value: string,
};
export type FieldInputInstance<V> = { ...TextInputInstance, ...FieldInstance<V>};

export type FieldProps<V: Verification> = {
    ...TextInputProps,
    nextInput?: () => ?{...TextInputInstance, ...},
    onChangeText: ?V => void,
    prevInput?: () => ?{...TextInputInstance, ...},
};

export type Validator<V: Verification> = (...args: $ReadOnlyArray<any>) => V;
export type Validate<V: Verification> = (text?: string) => V;

export type CCInstance = {
    +isValid: boolean,
    setValidationError: boolean => mixed,
    +value: ?{
        number: ?string,
        expired: {
            month: number,
            year: number,
        },
        cvc: ?string,
        cardHolder: ?string,
        postalCode: ?string,
    },
};

export type CCProps = {
    cardHolderText?: string,
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