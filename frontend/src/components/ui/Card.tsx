import React from 'react'
import { View, type ViewProps, type StyleProp, type ViewStyle } from 'react-native'

interface CardProps extends ViewProps {
  style?: StyleProp<ViewStyle>
}

export function Card({ style, children, ...props }: CardProps) {
  return (
    <View {...props} className="bg-surface rounded-2xl p-4" style={style}>
      {children}
    </View>
  )
}