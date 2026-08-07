import React, { forwardRef } from 'react'
import { TextInput, View, type TextInputProps, type StyleProp, type ViewStyle } from 'react-native'
import { Typography } from './Typography'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  containerStyle?: StyleProp<ViewStyle>
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, containerStyle, ...props },
  ref,
) {
  return (
    <View style={containerStyle}>
      {label ? (
        <Typography variant="label" style={{ marginBottom: 8 }}>{label}</Typography>
      ) : null}
      <TextInput
        ref={ref}
        placeholderTextColor="#64748b"
        className={[
          'rounded-xl bg-slate-800 border px-4 py-3.5 text-white text-base',
          error ? 'border-red-500' : 'border-slate-700',
        ].join(' ')}
        {...props}
      />
      {error ? (
        <Typography variant="caption" style={{ marginTop: 4, color: '#f87171' }}>
          {error}
        </Typography>
      ) : null}
    </View>
  )
})