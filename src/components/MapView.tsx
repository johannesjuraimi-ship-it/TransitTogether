// src/components/MapView.tsx
// Platform-specific resolution will pick MapView.web.tsx on web and MapView.native.tsx on iOS/Android
export * from './MapView.native';
export { default } from './MapView.native';
