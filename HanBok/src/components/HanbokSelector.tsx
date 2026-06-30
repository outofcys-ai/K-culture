import React, { useState } from 'react';
import { HANBOKS, ACCESSORIES } from '../data/hanboks';
import { HanbokItem, HanbokType } from '../types';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

interface HanbokSelectorProps {
  selectedHanbokId: string | null;
  selectedAccessoryId: string | null;
  onSelectHanbok: (item: HanbokItem | null) => void;
  onSelectAccessory: (item: HanbokItem | null) => void;
  dyeColor: string;
  onChangeDyeColor: (color: string) => void;
}

// Beautiful traditional colors palette
export const TRADITIONAL_COLORS = [
  { name: '진홍 (Crimson)', value: '#BE123C' },
  { name: '녹원 (Jade Green)', value: '#0F766E' },
  { name: '치자 (Sunflower)', value: '#FBBF24' },
  { name: '연두 (Pastel Lime)', value: '#A3E635' },
  { name: '담청 (Sky Blue)', value: '#60A5FA' },
  { name: '쪽빛 (Indigo)', value: '#1D4ED8' },
  { name: '자주 (Royal Purple)', value: '#8A1C7C' },
  { name: '연당 (Pastel Pink)', value: '#F472B6' },
  { name: '단목 (Lilac Violet)', value: '#C084FC' },
  { name: '은백 (Pearl Silver)', value: '#E2E8F0' },
  { name: '여우 (Coral Ginger)', value: '#F97316' },
  { name: '묵적 (Charcoal)', value: '#334155' },
];

export const HanbokSelector: React.FC<HanbokSelectorProps> = ({
  selectedHanbokId,
  selectedAccessoryId,
  onSelectHanbok,
  onSelectAccessory,
  dyeColor,
  onChangeDyeColor,
}) => {
  const [activeCategory, setActiveCategory] = useState<HanbokType | 'all'>('all');

  const categories: { label: string; value: HanbokType | 'all' }[] = [
    { label: '전체 의상', value: 'all' },
    { label: '궁중/왕실', value: 'royal' },
    { label: '전통/선비', value: 'traditional' },
    { label: '현대 퓨전', value: 'fusion' },
    { label: '어린이', value: 'child' },
    { label: '전통 장신구', value: 'accessory' },
  ];

  // Combine items to list
  const allItems = [...HANBOKS, ...ACCESSORIES];

  const filteredItems = allItems.filter((item) => {
    if (activeCategory === 'all') {
      return true;
    }
    return item.type === activeCategory;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Dynamic sorted categories tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex-none px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all ${
                isSelected
                  ? 'bg-rose-600 text-white shadow-sm font-semibold'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Primary items grid */}
      <div className="grid grid-cols-2 xs:grid-cols-3 gap-3 max-h-[200px] overflow-y-auto pr-1">
        {filteredItems.map((item) => {
          const isAccessory = item.type === 'accessory';
          const isSelected = isAccessory
            ? selectedAccessoryId === item.id
            : selectedHanbokId === item.id;

          return (
            <motion.div
              id={`hanbok-item-${item.id}`}
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (isAccessory) {
                  onSelectAccessory(isSelected ? null : item);
                } else {
                  onSelectHanbok(isSelected ? null : item);
                }
              }}
              className={`relative cursor-pointer rounded-2xl p-2.5 transition-all flex flex-col justify-between select-none ${
                isSelected
                  ? 'bg-rose-50/70 border-2 border-rose-600 shadow-md ring-2 ring-rose-100'
                  : 'bg-white border border-stone-200/80 hover:border-stone-300 shadow-sm'
              }`}
              style={{ minHeight: '150px' }}
            >
              {/* Gender and category tag */}
              <div className="absolute top-2 left-2 flex gap-1 z-10 pointer-events-none">
                <span className="px-1.5 py-0.5 rounded-md bg-stone-500/10 text-stone-600 text-[9px] font-medium scale-90 origin-top-left">
                  {item.type === 'accessory'
                    ? '장신구'
                    : item.gender === 'male'
                    ? '남성'
                    : item.gender === 'female'
                    ? '여성'
                    : '공용'}
                </span>
              </div>

              {/* Vector Thumbnail Preview */}
              <div className="w-full aspect-square flex items-center justify-center p-1 bg-stone-50/40 rounded-xl overflow-hidden mt-2">
                <div className="w-24 h-24 flex items-center justify-center">
                  {/* Accessories are rendered with fixed dye colors, hanboks can show the selected dye accent! */}
                  {item.render(0.88, isSelected ? dyeColor : undefined)}
                </div>
              </div>

              {/* Descriptive text */}
              <div className="mt-2 text-center">
                <h4 className="text-xs font-semibold text-stone-900 truncate font-sans">
                  {item.name}
                </h4>
                <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5 font-sans">
                  {item.description}
                </p>
              </div>

              {/* Heart/Check Indicator Bubble */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-rose-600 text-white rounded-full p-0.5 shadow">
                  <Heart className="w-3 h-3 fill-current" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Silk fabric dyeing color customization bar */}
      {selectedHanbokId && activeCategory !== 'accessory' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-50 border border-stone-200 rounded-2xl p-3 mt-1 shadow-inner"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-stone-800 flex items-center gap-1 font-sans">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              스커트 / 도포 천연 옷감 염색하기
            </span>
            <span className="text-[10px] text-rose-800 font-sans font-medium">실크 원단 색상 변경 가능</span>
          </div>

          {/* Color palette circles list */}
          <div className="flex flex-wrap gap-2 justify-center py-1">
            {TRADITIONAL_COLORS.map((color) => {
              const isColorDyeActive = dyeColor === color.value;
              return (
                <button
                  key={color.value}
                  onClick={() => onChangeDyeColor(color.value)}
                  title={color.name}
                  className={`w-6 h-6 rounded-full border shadow-sm transition-all relative ${
                    isColorDyeActive
                      ? 'border-stone-900 ring-2 ring-stone-400 scale-110'
                      : 'border-stone-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                >
                  {isColorDyeActive && (
                    <span className="absolute inset-1 rounded-full border border-white opacity-60" />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};
