import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle2, XCircle } from 'lucide-react'

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'approved') {
    return (
      <Badge variant="success" className="gap-1 font-medium px-2 py-0.5 text-[11px]">
        <CheckCircle2 className="h-3 w-3" />
        Disetujui
      </Badge>
    )
  }

  if (status === 'rejected') {
    return (
      <Badge variant="danger" className="gap-1 font-medium px-2 py-0.5 text-[11px]">
        <XCircle className="h-3 w-3" />
        Ditolak
      </Badge>
    )
  }

  return (
    <Badge variant="warning" className="gap-1 font-medium px-2 py-0.5 text-[11px]">
      <Clock className="h-3 w-3" />
      Menunggu Moderasi
    </Badge>
  )
}
