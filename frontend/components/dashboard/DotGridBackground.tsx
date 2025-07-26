// frontend/components/dashboard/DotGridBackground.tsx
export default function DotGridBackground() {
  return (
    <div 
      className="absolute top-0 left-0 w-full h-full -z-10"
      style={{
        backgroundColor: '#F8F9FC',
        backgroundImage: 'radial-gradient(#E0E6F8 1px, transparent 1px)',
        backgroundSize: '25px 25px',
      }}
    />
  );
}
