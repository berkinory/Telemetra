import { ThemeTogglerButton } from '@/components/theme-toggler';

export default function Page() {
  return (
    <div className="min-h-screen bg-main-background p-8">
      <div className="mx-auto max-w-7xl space-y-16">
        <ThemeTogglerButton />
      </div>
    </div>
  );
}
