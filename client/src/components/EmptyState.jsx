export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="card text-center py-12">
      {Icon && (
        <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-text-muted" />
        </div>
      )}
      <h3 className="font-semibold text-text mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-text-secondary mb-4 max-w-sm mx-auto">{description}</p>
      )}
      {action}
    </div>
  );
}
