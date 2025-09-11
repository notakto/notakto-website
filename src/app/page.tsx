'use client'
import Menu from '@/app/Menu';
import TutorialModal from '@/modals/TutorialModal';

import { useTut } from '@/services/store';

import { MenuLayout } from '@/components/ui/Containers/Menu/MenuLayout';
import { useEffect } from 'react';


export default function Home() {
  const showTut = useTut((state): boolean => state.showTut);

  return (
    <MenuLayout>
      <Menu />
      {showTut && <TutorialModal />}
    </MenuLayout>
  );
}