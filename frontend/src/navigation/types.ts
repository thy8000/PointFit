import type { NavigatorScreenParams } from '@react-navigation/native'

export type AuthStackParamList = {
  Login: undefined
  Register: undefined
}

export type AppTabParamList = {
  Home: undefined
  Exercises: undefined
  Profile: undefined
}

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined
  App: NavigatorScreenParams<AppTabParamList> | undefined
}