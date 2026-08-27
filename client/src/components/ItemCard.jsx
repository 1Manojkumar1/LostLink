import { Link } from 'react-router-dom';
import { MapPin, Calendar, Package } from 'lucide-react';
import { formatDate } from '../utils/formatDate';
import StatusBadge from './StatusBadge';

export default function ItemCard({ item }) {
  return (
    <Link to={`/items/${item.id}`} className="card card-hover block">
      <div className="aspect-video bg-surface-elevated rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <Package className="w-10 h-10 text-text-muted" />
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <StatusBadge status={item.type} size="xs" />
        {item.status !== 'ACTIVE' && (
          <StatusBadge status={item.status} size="xs" />
        )}
      </div>

      <h3 className="font-semibold text-text mb-1.5 line-clamp-1">{item.title}</h3>
      <p className="text-sm text-text-secondary mb-3 line-clamp-2">{item.description}</p>

      <div className="flex items-center gap-4 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span className="truncate max-w-[120px]">{item.location}</span>
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDate(item.date)}
        </span>
      </div>
    </Link>
  );
}
