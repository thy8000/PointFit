import React from 'react'
import { Text, type TextProps, type TextStyle, type StyleProp } from 'react-native'

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'label' | 'caption'

interface TypographyProps extends TextProps {
  variant?: Variant
}

const classNameByVariant: Record<Variant, string> = {
  h1: 'text-3xl font-bold text-white',
  h2: 'text-2xl font-bold text-white',
  h3: 'text-lg font-semibold text-white',
  body: 'text-base text-slate-200',
  label: 'text-sm font-medium text-slate-300',
  caption: 'text-xs text-slate-400',
}

export function Typography({ variant = 'body', style, ...props }: TypographyProps) {
  const className = classNameByVariant[variant]
  return <Text {...props} className={className} style={style as StyleProp<TextStyle>} />
}