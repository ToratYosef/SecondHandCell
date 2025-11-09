import GlassCard from '../GlassCard';

export default function GlassCardExample() {
  return (
    <div className="p-8 bg-gradient-to-br from-blue-600 to-purple-600 min-h-[400px] flex items-center justify-center gap-6">
      <GlassCard>
        <div className="p-8">
          <h3 className="text-white text-xl font-semibold mb-2">Primary Glass Card</h3>
          <p className="text-white/80">This is a glassmorphism card with backdrop blur</p>
        </div>
      </GlassCard>
      <GlassCard variant="secondary">
        <div className="p-8">
          <h3 className="text-white text-xl font-semibold mb-2">Secondary Glass Card</h3>
          <p className="text-white/80">Lighter blur effect</p>
        </div>
      </GlassCard>
    </div>
  );
}
