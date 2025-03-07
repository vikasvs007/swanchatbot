export default function Health() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  }
}

export const dynamic = 'force-dynamic' 