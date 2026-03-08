interface ErrorDisplayProps {
  message: string;
}

export function ErrorDisplay({ message }: ErrorDisplayProps) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
      {message}
    </div>
  );
}
