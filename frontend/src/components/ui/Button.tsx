import React from 'react'
import { Pressable, ActivityIndicator, Text, type StyleProp, type ViewStyle } from 'react-native'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: Variant
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  style?: StyleProp<ViewStyle>
}

const containerClassByVariant: Record<Variant, string> = {
  primary: 'bg-primary active:bg-primary-dark',
  secondary: 'bg-slate-800 active:bg-slate-700',
  outline: 'border border-slate-600 bg-transparent',
  ghost: 'bg-transparent',
}

const textClassByVariant: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-white',
  outline: 'text-slate-200',
  ghost: 'text-indigo-400',
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      className={[
        'rounded-xl py-3.5 px-4 items-center justify-center flex-row',
        containerClassByVariant[variant],
        isDisabled ? 'opacity-50' : '',
        fullWidth ? 'w-full' : '',
      ].join(' ')}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text className={`font-semibold text-base ${textClassByVariant[variant]}`}>{title}</Text>
      )}
    </Pressable>
  )
}