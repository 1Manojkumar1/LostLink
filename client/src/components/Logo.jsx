import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', className = '' }) {
  const sizes = {
    sm: { box: 'w-7 h-7', text: 'text-xs', word: 'text-base' },
    md: { box: 'w-8 h-8', text: 'text-sm', word: 'text-lg' },
    lg: { box: 'w-10 h-10', text: 'text-base', word: 'text-xl' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className={`${s.box} bg-primary rounded-lg flex items-center justify-center`}>
        <span className={`text-bg font-bold ${s.text}`}>L</span>
      </div>
      <span className={`font-semibold text-text ${s.word} tracking-tight`}>LostLink</span>
    </Link>
  );
}
