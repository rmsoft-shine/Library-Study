'use client'

import dynamic from "next/dynamic";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const NoSSR = dynamic(() => import('@/components/ShadTable'), { ssr: false });

export default function Home() {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <NoSSR />
      </DndProvider>
    </div>
  )
}
