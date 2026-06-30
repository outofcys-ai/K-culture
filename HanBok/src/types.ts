import React from 'react';

export type HanbokType = 'traditional' | 'fusion' | 'royal' | 'child' | 'accessory';

export interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string; // Emoji or short symbol
  render: (color?: string) => React.ReactNode;
  defaultHanbokScale: number;
  defaultHanbokYOffset: number; // Pivot offset parameter
}

export interface HanbokItem {
  id: string;
  name: string;
  description: string;
  type: HanbokType;
  gender: 'male' | 'female' | 'unisex';
  // We can render this as React element
  render: (scale: number, colorAccent?: string) => React.ReactNode;
  defaultScale: number;
  defaultYOffset: number; // default vertical positioning offset relative to character/photo
}

export interface TransformState {
  x: number;
  y: number;
  scale: number;
  rotation: number; // in degrees
  flipX: boolean;
  opacity: number;
}

export type ActiveTab = 'character' | 'myphoto';
