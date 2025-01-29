import { ConnectButton } from '@/components/ui/ConnectButton'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Property Management DApp</h1>
      <ConnectButton />
    </main>
  )
}

