import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle2, XCircle } from 'lucide-react'

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'approved') {
    return (
      <Badge variant="success" className="gap-1 font-medium bg-emerald-100 text-emerald-800 border-emerald-200">
        <CheckCircle2 className="h-3 w-3" />
        Disetujui
      </Badge>
    )
  }

  if (status === 'rejected') {
    return (
      <Badge variant="danger" className="gap-1 font-medium bg-rose-100 text-rose-800 border-rose-200">
        <XCircle className="h-3 w-3" />
        Ditolak
      </Badge>
    )
  }

  return (
    <Badge variant="warning" className="gap-1 font-medium bg-amber-100 text-amber-800 border-amber-200">
      <Clock className="h-3 w-3" />
      Menunggu Moderasi
    </Badge>
  )
}
