import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler';
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="font-semibold text-4xl">Hello World</p>
      <ThemeTogglerButton />
    </div>
  );
}
