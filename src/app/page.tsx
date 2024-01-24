import dynamic from "next/dynamic";

const NoSSR = dynamic(() => import('@/components/TableGroup'), { ssr: false });

export default function Home() {
  return (
    <div>
      <NoSSR />
    </div>
  )
}
