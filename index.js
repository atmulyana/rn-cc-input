/**
 * https://github.com/atmulyana/rn-cc-input
 *
 * @flow strict-local
 */
import * as React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {
    extractTextStyle
} from 'rn-style-props';
import {
    emptyString,
    extendObject,
    noChange,
    noop,
} from 'javascript-common';
import {
    extRefCallback,
    setRef,
} from 'reactjs-common';

import type {
    Ref
} from 'reactjs-common';
import type {
    CardNumberVerification,
    ExpirationDateVerification,
    Verification,
} from 'card-validator';
import type {
    CreditCardType
} from 'credit-card-type';
import type {
    CCInstance,
    CCProps,
    FieldInputInstance,
    FieldInstance,
    FieldProps,
    ScrollViewInstance,
    ScrollViewProps,
    TextInputInstance,
    TextInputProps,
    TextInputStyle,
    Validate,
    Validator,
} from './types';

const validator = require("card-validator");

const ARROW_COLOR = '#ddd';
const ARROW_WIDTH = 8;
const ARROW_THICK = 4;
const ICON_HEIGHT = 24;
const ICON_WIDTH = 32;
const ARROW_LINE_LENGTH = Math.round(Math.sqrt( Math.pow(ARROW_WIDTH * 2, 2) / 2 ));  //pythagoras formula: (2 * arrow_width)^2 = arrow_line_length^2 + arrow_line_length^2

const styles = StyleSheet.create({
    arrow: {
        borderColor: ARROW_COLOR,
        borderWidth: ARROW_THICK,
        height: ARROW_LINE_LENGTH,
        transform: [{rotate: '45deg'}],
        width: ARROW_LINE_LENGTH,
    },
    arrowBox: {
        backgroundColor: '#aaa',
        justifyContent: 'center',
        paddingHorizontal: 4,
        width: 20,
    },
    arrowBoxRequired: {
        alignSelf: 'stretch',
        flex: 0,
        overflow: 'hidden',
    },
    arrowLeft: {
        alignSelf: 'flex-start',
        borderRightWidth: 0,
        borderTopWidth: 0,
    },
    arrowRight: {
        alignSelf: 'flex-end',
        borderBottomWidth: 0,
        borderLeftWidth: 0,
    },
    container: {
        alignItems:'center',
        borderColor: '#aaa',
        borderWidth: 1,
    },
    containerRequired: {
        flexDirection: 'row',
    },
    icon: {
        height: ICON_HEIGHT,
        width: ICON_WIDTH,
    },
    iconRequired: {
        flex: 0,
        resizeMode: 'contain',
    },
    scroll: {
        flex: 1,
    },
    text: {
        color: 'black',
        fontFamily: 'Arial',
        fontSize: 14,
        lineHeight: 17,
        paddingHorizontal: 2,
        paddingVertical: 4,
    },
    // textRequired: {
    //     flex: 0,
    // },
});

const icons = {
    'american-express': require('./images/cards/amex.png'),
    'diners-club': require('./images/cards/diners.png'),
    discover: require('./images/cards/discover.png'),
    elo: require('./images/cards/elo.png'),
    hiper: require('./images/cards/hiper.png'),
    hipercard: require('./images/cards/hipercard.png'),
    jcb: require('./images/cards/jcb.png'),
    maestro: require('./images/cards/maestro.png'),
    'master-card': require('./images/cards/mastercard.png'),
    mastercard: require('./images/cards/mastercard.png'),
    mir: require('./images/cards/mir.png'),
    rupay: require('./images/cards/rupay.png'),
    unionpay: require('./images/cards/unionpay.png'),
    unknown: require('./images/cards/unknown.png'),
    visa: require('./images/cards/visa.png'),
};

const unknownCard: CreditCardType = {
    niceType: 'Unknown',
    type: 'unknown',
    patterns: [],
    gaps: [4, 8, 12],
    lengths: [16],
    code: {name: 'CVC', size: 3},
};


const reNonNumbers = /\D/g;
const reZeros = /^0+/;
const reSpaces = /\s+/g;
const justNumbers = (s: string) => s.replace(reNonNumbers, emptyString);

function createField<V: Verification>(
    validator: Validator<V>,
    fnFormat: ((string, Validate<V>) => string) = justNumbers
): React.AbstractComponent<
    FieldProps<V>,
    FieldInputInstance<V>
> {
    function forwardRef(
        {
            maxLength,
            nextInput = noop,
            onChangeText = noop,
            prevInput = noop,
            ...props
        }: FieldProps<V>,
        $ref: Ref<FieldInputInstance<V>>
    ) {
        const [text, setText] = React.useState(emptyString);
        
        const {current: $} = React.useRef<{
            prevTextLength: number,
            validatorParams: $ReadOnlyArray<mixed>,
            validity?: V,
            value: string,
        }>({
            prevTextLength: 0,
            validatorParams: [],
            value: text,
        });
        $.value = text; //updates in every render
        
        const {current: ref} = React.useRef<FieldInstance<V>>({
            get isValid() {
                return $.validity?.isValid ?? false;
            },
    
            get validatorParams() {
                return $.validatorParams;
            },

            set validatorParams(val: mixed) {
                $.validatorParams = Array.isArray(val) ? val : [val];
            },
    
            get validity() {
                return $.validity;
            },
    
            get value() {
                return $.value;
            },
        });

        const $onChangeText = React.useCallback((txt: string) => {
            let isNotValidated = true;
            const validate = (pText?: string) => {
                $.validity = validator(pText ?? txt, ...$.validatorParams);
                isNotValidated = false;
                return $.validity;
            };
            const sText = fnFormat(txt, validate);
            if (isNotValidated) validate();
            $.prevTextLength = $.value.length;
            setText(sText);
            onChangeText($.validity);
        });

        const $onKeyPress = React.useCallback<$NonMaybeType<TextInputProps['onKeyPress']>>(({ nativeEvent: { key} }) => {
            if ($.value == emptyString && key == 'Backspace') prevInput()?.focus();
        });

        const $onSelectionChange = React.useCallback<$NonMaybeType<TextInputProps['onSelectionChange']>>(({ nativeEvent: { selection: { start:pos } } }) => {
            let endPos = maxLength,
                endPos2 = $.value.length;
            if ($.prevTextLength < endPos2 && pos == endPos && endPos == endPos2) nextInput()?.focus();
            //else if (ref.isValid && $.prevTextLength < endPos2 && pos == endPos2) nextInput()?.focus();
        }, [maxLength]);

        const $refCallback = React.useCallback(
            extRefCallback($ref, ref),
            [$ref]
        );

        return <TextInput
            keyboardType="number-pad"
            {...props}
            maxLength={maxLength}
            onChangeText={$onChangeText}
            onKeyPress={$onKeyPress}
            onSelectionChange={$onSelectionChange}
            ref={$refCallback}
            value={text}
        />;
    }
    forwardRef.displayName = `CreaditCard[${validator.name}]`;
    
    return React.forwardRef(forwardRef);
}

const CardNumber = createField(validator.number, (text, validate) => {
    const txt = justNumbers(text);
    const card = validate(txt).card ?? unknownCard;
    let subNumbers = [], i = 0;
    for (let j of card.gaps) {
        subNumbers.push(txt.substring(i, j));
        i = j;
        if (i >= txt.length) break;
    }
    if (i < txt.length) subNumbers.push(txt.substring(i));
    return subNumbers.join(' ');
});

const CardExpiry = createField(validator.expirationDate, text => {
    let txt = justNumbers(text).replace(reZeros, '0');
    if (txt[0] > '1' || txt[0] == '1' && txt[1] > '2') txt = '0' + txt;
    txt = txt.substring(0, 4);
    if (txt.length > 2) return `${txt.substring(0, 2)}/${txt.substring(2)}`;
    return txt;
});

const CardCVC = createField(validator.cvv);
const CardHolder = createField(validator.cardholderName, noChange);
const CardZIP = createField(validator.postalCode);


const CCInput = React.memo(({
    cardHolderText = "Card holder name",
    numberText = "Card number",
    placeholderTextColor,
    placeholderTextColorError,
    postalCodeText = "Postal code",
    $ref,
    showCardHolder = false,
    showPostalCode = false,
    style,
    styleArrow,
    styleArrowError,
    styleError,
    styleField,
    styleFieldError,
    styleIcon,
    validator
}: {...CCProps, $ref: Ref<CCInstance>}) => {
    const $number = React.useRef<?FieldInputInstance<CardNumberVerification>>(null);
    const $expiry = React.useRef<?FieldInputInstance<ExpirationDateVerification>>(null);
    const $cvc = React.useRef<?FieldInputInstance<Verification>>(null);
    const $cardHolder = React.useRef<?FieldInputInstance<Verification>>(null);
    const $zip = React.useRef<?FieldInputInstance<Verification>>(null);
    const $scroller = React.useRef<?ScrollViewInstance>(null);
    const {current: $scroll} = React.useRef({
        pos: 0,
        step: 0,
        width: -1,
        contentWidth: -1,
    });
    const {current: $props} = React.useRef<CCProps>({});
    $props.showCardHolder = showCardHolder;

    const [isValidationError, setValidationError] = React.useState(false);
    const [card, setCard] = React.useState<CreditCardType>(unknownCard);
    const [scrollStat, setScrollStat] = React.useState<0 | 1 | 2 | 3>(1); /*1: at the beginning, 0: at the middle, 2: at the end,
                                                                3: at the beginning and the end (ScrollView is large enought to show all content)*/
    
    const ref = React.useRef<CCInstance>({
        get isValid() {
            return (
                $number.current?.isValid
                && ($expiry.current?.isValid)
                && $cvc.current?.isValid
                && (!$props.showCardHolder || $cardHolder.current?.isValid)
                && (!$zip.current?.value || $zip.current?.isValid)
            ) ? true : false;
        },

        get setValidationError() {
            return setValidationError;
        },
    
        get value() {
            const val = {
                number: $number.current?.value.replace(reSpaces, emptyString),
                expired: {
                    month: parseInt($expiry.current?.validity?.month) || 0,
                    year: parseInt($expiry.current?.validity?.year) || 0,
                },
                cvc: $cvc.current?.value,
                cardHolder: $cardHolder.current?.value,
                postalCode: $zip.current?.value,
            };
            if (!val.number) return null;
            return val;
        },
    });
    setRef($ref, ref.current);

    const {current: $relInput} = React.useRef<{[string]: () => ?{...TextInputInstance, ...}}>({
        numberNext: () => $expiry.current,
        expiryNext: () => $cvc.current,
        expiryPrev: () => $number.current,
        cvcNext: () => $cardHolder.current ?? $zip.current,
        cvcPrev: ()  => $expiry.current,
        holderNext: () => $zip.current,
        holderPrev: () => $cvc.current,
        zipPrev: () => $cardHolder.current ?? $cvc.current,
    });
    
    const $handleChangeCardNumber = React.useCallback<?CardNumberVerification => void>(validity => {
        let newCard = validity?.card ?? unknownCard;
        if (newCard.type != card.type) {
            if ($cvc.current) $cvc.current.validatorParams = [newCard.code.size];
            setCard(newCard);
        }
        $handleChangeText();
    });

    const $handleChangeText = React.useCallback(() => {
        if (isValidationError) $handleFocus();
    });

    const $handleFocus = React.useCallback(() => {
        setValidationError(false);
        typeof(validator) == 'function' && validator()?.clearValidation();
    });

    const scroll = React.useCallback((dir: -1 | 1) => {
        //Blur all inputs because if an input having focus will disappear because of scrolling then it will resist the scrolling
        $number.current?.blur();
        $expiry.current?.blur();
        $cvc.current?.blur();
        $cardHolder.current?.blur();
        $zip.current?.blur();
        $scroller.current?.scrollTo({x: $scroll.pos + dir * $scroll.step});
    });

    const set$Scroll = React.useCallback((width: number, contentWidth: number) => {
        if (width >= 0) $scroll.width = width;
        if (contentWidth >= 0) $scroll.contentWidth = contentWidth;
        if ($scroll.width >= 0 && $scroll.contentWidth >= 0) {
            let scrollStat = 0;
            if ($scroll.pos <= 0) scrollStat |= 1;
            if ($scroll.width + $scroll.pos >= $scroll.contentWidth) scrollStat |= 2;
            setScrollStat(scrollStat);
        }
    });

    const $crollOnLayout = React.useCallback<$NonMaybeType<ScrollViewProps['onLayout']>>( ({nativeEvent: {layout: {width}}}) => {
        $scroll.step = Math.round(width / 2);
        set$Scroll(width, -1);
    });

    const $onContentSizeChange = React.useCallback<$NonMaybeType<ScrollViewProps['onContentSizeChange']>>(contentWidth => {
        set$Scroll(-1, contentWidth);
    });

    const $onScroll  = React.useCallback<$NonMaybeType<ScrollViewProps['onScroll']>>( ({nativeEvent: {layoutMeasurement, contentOffset, contentSize}}) => {
        $scroll.pos = contentOffset.x;
        set$Scroll(layoutMeasurement.width, contentSize.width);
    });

    const $tyle = extractTextStyle(style, true),
          $tyleError = extractTextStyle(styleError, true),
          //$FlowIgnore[underconstrained-implicit-instantiation]
          $tyleField = StyleSheet.flatten(styleField),
          //$FlowIgnore[underconstrained-implicit-instantiation]
          $tyleFieldError = StyleSheet.flatten(styleFieldError),
          //$FlowIgnore[underconstrained-implicit-instantiation]
          $tyleArrow = StyleSheet.flatten(styleArrow),
          //$FlowIgnore[underconstrained-implicit-instantiation]
          $tyleArrowError = StyleSheet.flatten(styleArrowError),
          icon = icons[card.type] ?? icons[unknownCard.type],
          //$FlowIgnore[prop-missing]
          oneWidth = parseInt($tyle.text.fontSize ?? $tyleField?.fontSize) || styles.text.fontSize,
          arrowColor = isValidationError ? ($tyleArrowError?.color ?? $tyleArrow?.color) : $tyleArrow?.color,
          arrowColorStyle = arrowColor !== undefined ? {borderColor: arrowColor} : null,
          placeholderColor = (isValid: ?boolean) => isValid || !isValidationError
                ? (placeholderTextColor ?? undefined)
                : (
                    placeholderTextColorError
                    ?? $tyleFieldError?.color
                    //$FlowIgnore[prop-missing]
                    ?? $tyleError.text.color
                    ?? placeholderTextColor
                    ?? undefined
                ),
          inputStyle = (isValid: ?boolean, widthScale: number) => {
                return [
                    styles.text,
                    $tyleField,
                    isValid || !isValidationError ? null : [$tyleError.text, $tyleFieldError],
                    {width: oneWidth * widthScale},
                ];
            };

    return <View style={[
        styles.container,
        $tyle.view,
        isValidationError ? $tyleError.view : null,
        styles.containerRequired,
    ]}>
        <Image
            source={icon}
            style={[
                styles.icon,
                styleIcon,
                styles.iconRequired
            ]}
        />
        <TouchableOpacity 
            onPress={() => scroll(-1)}
            style={[
                styles.arrowBox,
                $tyleArrow,
                isValidationError ? $tyleArrowError : null,
                styles.arrowBoxRequired,
                {display: (scrollStat & 1) != 0 ? 'none' : 'flex'}
            ]}
        >
            <View
                style={[
                    styles.arrow,
                    styles.arrowLeft,
                    arrowColorStyle,
                ]}
            />
        </TouchableOpacity>
        <ScrollView
            horizontal={true}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="never"
            ref={$scroller}
            scrollEnabled={true}
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={styles.scroll}
            onContentSizeChange={$onContentSizeChange}
            onLayout={$crollOnLayout}
            onScroll={$onScroll}
        >
            <CardNumber
                maxLength={Math.max(...card.lengths) + card.gaps.length}
                nextInput={$relInput.numberNext}
                onFocus={$handleFocus}
                onChangeText={$handleChangeCardNumber}
                placeholder={numberText}
                placeholderTextColor={placeholderColor($number.current?.isValid)}
                ref={$number}
                style={inputStyle($number.current?.isValid, 16)}
            />
            <CardExpiry
                maxLength={5}
                nextInput={$relInput.expiryNext}
                onChangeText={$handleChangeText}
                onFocus={$handleFocus}
                placeholder="MM/YY"
                placeholderTextColor={placeholderColor($expiry.current?.isValid)}
                prevInput={$relInput.expiryPrev}
                ref={$expiry}
                style={inputStyle($expiry.current?.isValid, 4)}
            />
            <CardCVC
                maxLength={card.code.size}
                nextInput={$relInput.cvcNext}
                onChangeText={$handleChangeText}
                onFocus={$handleFocus}
                placeholder={card.code.name}
                placeholderTextColor={placeholderColor($cvc.current?.isValid)}
                prevInput={$relInput.cvcPrev}
                ref={$cvc}
                style={inputStyle($cvc.current?.isValid, 3)}
            />
            {showCardHolder && <CardHolder
                keyboardType="default"
                maxLength={255}
                nextInput={$relInput.holderNext}
                onChangeText={$handleChangeText}
                onFocus={$handleFocus}
                placeholder={cardHolderText}
                placeholderTextColor={placeholderColor($cardHolder.current?.isValid)}
                prevInput={$relInput.holderPrev}
                ref={$cardHolder}
                style={inputStyle($cardHolder.current?.isValid, 20)}
            />}
            {showPostalCode && <CardZIP
                maxLength={6}
                onChangeText={$handleChangeText}
                onFocus={$handleFocus}
                placeholder={postalCodeText}
                placeholderTextColor={placeholderColor(!$zip.current?.value || $zip.current?.isValid)}
                prevInput={$relInput.zipPrev}
                ref={$zip}
                style={inputStyle($zip.current?.isValid, 6)}
            />}
        </ScrollView>
        <TouchableOpacity 
            onPress={() => scroll(1)}
            style={[
                styles.arrowBox,
                $tyleArrow,
                isValidationError ? $tyleArrowError : null,
                styles.arrowBoxRequired,
                {display: (scrollStat & 2) != 0 ? 'none' : 'flex'}
            ]}
        >
            <View
                style={[
                    styles.arrow,
                    styles.arrowRight,
                    arrowColorStyle,
                ]}
            />
        </TouchableOpacity>
    </View>;
});

const CreditCard: React.AbstractComponent<CCProps, CCInstance> = React.forwardRef<CCProps, CCInstance>(function CreditCard(props, ref) {
    return <CCInput {...props} $ref={ref} />
});
export default CreditCard;