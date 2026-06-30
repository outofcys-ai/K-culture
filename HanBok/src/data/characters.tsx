import React from 'react';
import { Character } from '../types';

export const CHARACTERS: Character[] = [
  {
    id: 'duri',
    name: '두리 (Duri)',
    description: '호기심 가득한 애교쟁이 아기 토끼',
    avatar: '🐰',
    defaultHanbokScale: 1.05,
    defaultHanbokYOffset: 25,
    render: (color = '#F8FAFC') => (
      <svg
        id="char-svg-duri"
        viewBox="0 0 400 350"
        className="w-full h-full drop-shadow-md select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="duri-character" transform="translate(0, 30)">
          {/* Long Ears */}
          <g id="duri-ears">
            {/* Left Ear */}
            <path
              d="M160,110 C130,-10 100,-10 130,110 Z"
              fill={color}
              stroke="#94A3B8"
              strokeWidth="4"
              transform="rotate(-15 145 110)"
            />
            <path
              d="M152,100 C132,10 112,10 132,100 Z"
              fill="#FCA5A5"
              opacity="0.75"
              transform="rotate(-15 145 110)"
            />

            {/* Right Ear */}
            <path
              d="M240,110 C270,-10 300,-10 270,110 Z"
              fill={color}
              stroke="#94A3B8"
              strokeWidth="4"
              transform="rotate(15 255 110)"
            />
            <path
              d="M248,100 C268,10 288,10 268,100 Z"
              fill="#FCA5A5"
              opacity="0.75"
              transform="rotate(15 255 110)"
            />
          </g>

          {/* Round Head */}
          <circle cx="200" cy="170" r="85" fill={color} stroke="#94A3B8" strokeWidth="4" />

          {/* Face layout over face */}
          <g id="duri-face">
            {/* Eyes - Big twinkling anime eyes */}
            <g id="duri-eyes">
              {/* Left Eye */}
              <circle cx="165" cy="165" r="13" fill="#1E293B" />
              <circle cx="161" cy="161" r="5" fill="#FFFFFF" />
              <circle cx="168" cy="169" r="2.5" fill="#FFFFFF" />
              {/* Eyelashes */}
              <path d="M150,158 Q158,150 168,152" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />

              {/* Right Eye */}
              <circle cx="235" cy="165" r="13" fill="#1E293B" />
              <circle cx="231" cy="161" r="5" fill="#FFFFFF" />
              <circle cx="238" cy="169" r="2.5" fill="#FFFFFF" />
              {/* Eyelashes */}
              <path d="M250,158 Q242,150 232,152" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Rosy Blushing Cheeks */}
            <ellipse cx="145" cy="190" rx="15" ry="9" fill="#FDA4AF" opacity="0.8" />
            <ellipse cx="255" cy="190" rx="15" ry="9" fill="#FDA4AF" opacity="0.8" />

            {/* Cute Little Mouth (ㅅ) and tiny nose */}
            <ellipse cx="200" cy="178" rx="4" ry="2.5" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
            <path
              d="M192,188 C196,194 200,192 200,188 C200,192 204,194 208,188"
              fill="none"
              stroke="#1E293B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    ),
  },
  {
    id: 'maro',
    name: '마로 (Maro)',
    description: '느긋하고 먹는 걸 좋아하는 둥글둥글 꿀곰',
    avatar: '🧸',
    defaultHanbokScale: 1.15,
    defaultHanbokYOffset: 12,
    render: (color = '#DDB892') => (
      <svg
        id="char-svg-maro"
        viewBox="0 0 400 350"
        className="w-full h-full drop-shadow-md select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="maro-character" transform="translate(0, 20)">
          {/* Bear Ears */}
          <g id="maro-ears">
            <circle cx="125" cy="115" r="28" fill={color} stroke="#7F5539" strokeWidth="4" />
            <circle cx="125" cy="115" r="16" fill="#F7CAD0" />

            <circle cx="275" cy="115" r="28" fill={color} stroke="#7F5539" strokeWidth="4" />
            <circle cx="275" cy="115" r="16" fill="#F7CAD0" />
          </g>

          {/* Chubby Round Head */}
          <circle cx="200" cy="180" r="82" fill={color} stroke="#7F5539" strokeWidth="4" />

          {/* Bear Face */}
          <g id="maro-face">
            {/* Cozy Sleepy Happy Eyes */}
            <path
              d="M152,170 Q165,185 178,170"
              fill="none"
              stroke="#432818"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M222,170 Q235,185 248,170"
              fill="none"
              stroke="#432818"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Big Snout */}
            <ellipse cx="200" cy="190" rx="24" ry="18" fill="#FFF1E6" stroke="#7F5539" strokeWidth="2" />
            <polygon points="192,181 208,181 200,192" fill="#432818" rx="2" />
            <path
              d="M200,192 Q200,200 194,201 M200,192 Q200,200 206,201"
              fill="none"
              stroke="#432818"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Cute Cheek Blush */}
            <circle cx="132" cy="194" r="11" fill="#FFB5A7" opacity="0.85" />
            <circle cx="268" cy="194" r="11" fill="#FFB5A7" opacity="0.85" />
          </g>
        </g>
      </svg>
    ),
  },
  {
    id: 'soli',
    name: '솔이 (Soli)',
    description: '노래하는 걸 즐기는 호기심 많은 사랑둥이 병아리',
    avatar: '🐥',
    defaultHanbokScale: 1.12,
    defaultHanbokYOffset: 5,
    render: (color = '#FDE047') => (
      <svg
        id="char-svg-soli"
        viewBox="0 0 400 350"
        className="w-full h-full drop-shadow-md select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="soli-character" transform="translate(0, -10)">
          {/* Chick Rounded Head */}
          <circle cx="200" cy="205" r="85" fill={color} stroke="#CA8A04" strokeWidth="4" />

          {/* Soli Head Details */}
          <g id="soli-face">
            {/* Sparkling curious eyes */}
            <g id="soli-eyes">
              {/* Left Eye */}
              <circle cx="155" cy="205" r="11" fill="#1F2937" />
              <circle cx="152" cy="201" r="4.5" fill="#FFFFFF" />
              <circle cx="157" cy="208" r="2" fill="#FFFFFF" />

              {/* Right Eye */}
              <circle cx="245" cy="205" r="11" fill="#1F2937" />
              <circle cx="242" cy="201" r="4.5" fill="#FFFFFF" />
              <circle cx="247" cy="208" r="2" fill="#FFFFFF" />
            </g>

            {/* Cute Orange Beak */}
            <path
              d="M200,210 L214,222 L186,222 Z"
              fill="#F97316"
              stroke="#C2410C"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M188,222 C194,229 206,229 212,222 Z"
              fill="#EA580C"
              stroke="#C2410C"
              strokeWidth="2"
            />

            {/* Bright Blushing Cheeks */}
            <ellipse cx="132" cy="230" rx="14" ry="8" fill="#F87171" opacity="0.8" />
            <ellipse cx="268" cy="230" rx="14" ry="8" fill="#F87171" opacity="0.8" />

            {/* Hair curl on top */}
            <path
              d="M200,132 C190,110 205,100 200,90 C215,100 210,110 200,132 Z"
              fill="#F97316"
              stroke="#EA580C"
              strokeWidth="1.5"
            />
          </g>
        </g>
      </svg>
    ),
  },
  {
    id: 'sohee',
    name: '소희 (Sohee)',
    description: '단아하고 밝은 미소를 가진 귀여운 소녀',
    avatar: '👧',
    defaultHanbokScale: 1.05,
    defaultHanbokYOffset: 20,
    render: (color = '#FFEAD2') => (
      <svg
        id="char-svg-sohee"
        viewBox="0 0 400 350"
        className="w-full h-full drop-shadow-md select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="sohee-character" transform="translate(0, 30)">
          {/* Hair Braid at back */}
          <g id="sohee-braid">
            <circle cx="200" cy="245" r="18" fill="#2D2327" />
            {/* Cute purple hair ribbon (댕기) */}
            <path d="M190,255 L210,255 L215,310 L185,310 Z" fill="#D946EF" stroke="#1E293B" strokeWidth="3" />
            <polygon points="190,310 210,310 200,325" fill="#FCE7F3" />
          </g>

          {/* Round Head */}
          <circle cx="200" cy="170" r="82" fill={color} stroke="#1E293B" strokeWidth="4" />

          {/* Hair Front and Side */}
          <g id="sohee-hair">
            {/* Back Hair dome */}
            <path d="M118,170 C118,100 140,88 200,88 C260,88 282,100 282,170 C282,140 260,110 200,110 C140,110 118,140 118,170 Z" fill="#2D2327" />
            {/* Side bangs */}
            <path d="M118,170 C125,120 160,120 175,145 C155,140 125,150 122,170 Z" fill="#2D2327" />
            <path d="M282,170 C275,120 240,120 225,145 C245,140 275,150 278,170 Z" fill="#2D2327" />
            {/* Hair band / Baessi Daenggi style */}
            <path d="M140,110 C160,95 240,95 260,110" fill="none" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
            <circle cx="200" cy="98" r="8" fill="#FBBF24" stroke="#1E293B" strokeWidth="2" />
          </g>

          {/* Sohee Face */}
          <g id="sohee-face">
            {/* Twinkling big eyes */}
            <g id="sohee-eyes">
              {/* Left Eye */}
              <circle cx="165" cy="172" r="11" fill="#1F2937" />
              <circle cx="161" cy="168" r="4" fill="#FFFFFF" />
              <circle cx="168" cy="175" r="2" fill="#FFFFFF" />
              {/* Right Eye */}
              <circle cx="235" cy="172" r="11" fill="#1F2937" />
              <circle cx="231" cy="168" r="4" fill="#FFFFFF" />
              <circle cx="238" cy="175" r="2" fill="#FFFFFF" />
            </g>

            {/* Rosy Cheeks */}
            <ellipse cx="148" cy="195" rx="14" ry="8" fill="#FDA4AF" opacity="0.85" />
            <ellipse cx="252" cy="195" rx="14" ry="8" fill="#FDA4AF" opacity="0.85" />

            {/* Little smile */}
            <path
              d="M192,192 C195,198 205,198 208,192"
              fill="none"
              stroke="#1E293B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    ),
  },
  {
    id: 'minjun',
    name: '민준 (Minjun)',
    description: '개구쟁이 같은 미소의 씩씩한 소년',
    avatar: '👦',
    defaultHanbokScale: 1.05,
    defaultHanbokYOffset: 20,
    render: (color = '#FFEAD2') => (
      <svg
        id="char-svg-minjun"
        viewBox="0 0 400 350"
        className="w-full h-full drop-shadow-md select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="minjun-character" transform="translate(0, 30)">
          {/* Round Head */}
          <circle cx="200" cy="170" r="82" fill={color} stroke="#1E293B" strokeWidth="4" />

          {/* Hair Topknot & Cute hair line */}
          <g id="minjun-hair">
            {/* Topknot on top of the head */}
            <rect x="185" y="65" width="30" height="25" rx="8" fill="#2D2327" stroke="#1E293B" strokeWidth="3" />
            <line x1="185" y1="80" x2="215" y2="80" stroke="#EF4444" strokeWidth="3.5" />

            {/* Back Hair dome */}
            <path d="M118,170 C118,100 140,88 200,88 C260,88 282,100 282,170 C282,145 260,120 200,120 C140,120 118,145 118,170 Z" fill="#2D2327" />
            {/* Cute sideburns */}
            <path d="M118,155 L125,185 L132,165 Z" fill="#2D2327" />
            <path d="M282,155 L275,185 L268,165 Z" fill="#2D2327" />
          </g>

          {/* Minjun Face */}
          <g id="minjun-face">
            {/* Cheerful eye combination */}
            <g id="minjun-eyes">
              {/* Left Eye - happy crescent arc */}
              <path
                d="M152,170 Q165,158 178,170"
                fill="none"
                stroke="#1F2937"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              {/* Right Eye */}
              <circle cx="235" cy="170" r="11" fill="#1F2937" />
              <circle cx="231" cy="166" r="4.2" fill="#FFFFFF" />
              <circle cx="238" cy="173" r="2.1" fill="#FFFFFF" />
            </g>

            {/* Rosy Cheeks */}
            <ellipse cx="148" cy="195" rx="14" ry="8" fill="#FDBA74" opacity="0.85" />
            <ellipse cx="252" cy="195" rx="14" ry="8" fill="#FDBA74" opacity="0.85" />

            {/* Big Wide Smile! */}
            <path
              d="M188,190 C188,206 212,206 212,190"
              fill="#FCA5A5"
              stroke="#1E293B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    ),
  },
];
