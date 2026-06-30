import React from 'react';

export type HanbokType = 'traditional' | 'fusion' | 'royal' | 'child' | 'accessory';

export interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string; // Emoji or short symbol
  render: (color?: string) => React.ReactNode;
  defaultHanbokScale: number;
  defaultHanbokYOffset: number;
  // 스마트 자동맞춤용 앵커값 (캔버스 픽셀 단위, 캐릭터 컨테이너 중심 기준)
  headTopOffset: number;  // 컨테이너 중심에서 머리 꼭대기까지 오프셋 (위쪽 = 음수)
  headRadius: number;     // 머리 반지름 (캔버스 픽셀)
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
  defaultYOffset: number;
  // 한복(의상)용: 컨테이너 상단에서 목선까지 픽셀 거리
  necklineFromTop?: number;
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
