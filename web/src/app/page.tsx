'use client';

import {
  Add01Icon,
  Delete02Icon,
  Settings02Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { ThemeTogglerButton } from '@/components/theme-toggler';
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CopyButton } from '@/components/ui/copy-button';
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import {
  Menu,
  MenuCheckboxItem,
  MenuItem,
  MenuPanel,
  MenuPortal,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from '@/components/ui/menu';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Tabs,
  TabsList,
  TabsPanel,
  TabsPanels,
  TabsTab,
} from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { Tooltip, TooltipPanel, TooltipTrigger } from '@/components/ui/tooltip';

export default function Home() {
  const [checked, setChecked] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');

  return (
    <div className="min-h-screen bg-neutral-50 p-8 dark:bg-neutral-950">
      <div className="fixed top-6 right-6 z-50">
        <ThemeTogglerButton size="lg" />
      </div>

      <div className="mx-auto max-w-7xl space-y-16 pt-8">
        <header className="space-y-4">
          <h1 className="font-bold text-5xl">Component Showcase</h1>
          <p className="text-neutral-600 text-xl dark:text-neutral-400">
            Comprehensive UI component library with all variants
          </p>
        </header>

        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-3xl">Button Components</h2>
            <Separator className="mb-6" />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-xl">Standard Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Default</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-xl">Button Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <HugeiconsIcon icon={Add01Icon} />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-xl">
              Icon Buttons (with particles)
            </h3>
            <div className="flex flex-wrap gap-4">
              <IconButton variant="default">
                <HugeiconsIcon icon={Settings02Icon} />
              </IconButton>
              <IconButton variant="accent">
                <HugeiconsIcon icon={Add01Icon} />
              </IconButton>
              <IconButton variant="destructive">
                <HugeiconsIcon icon={Delete02Icon} />
              </IconButton>
              <IconButton variant="outline">
                <HugeiconsIcon icon={UserIcon} />
              </IconButton>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-xl">Copy Button</h3>
            <div className="flex flex-wrap gap-4">
              <CopyButton content="Hello, World!" />
              <CopyButton content="npm install package" variant="accent" />
              <CopyButton content="Copied text" size="lg" variant="outline" />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-3xl">Form Components</h2>
            <Separator className="mb-6" />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-xl">Input</h3>
            <div className="flex flex-wrap gap-4">
              <Input placeholder="Enter your name..." />
              <Input placeholder="Email address..." type="email" />
              <Input disabled placeholder="Disabled input" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-xl">Checkbox</h3>
            <div className="flex flex-wrap gap-6">
              <Checkbox checked={checked} onCheckedChange={setChecked} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-xl">Switch</h3>
            <div className="flex flex-wrap gap-6">
              <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-3xl">Card Components</h2>
            <Separator className="mb-6" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card variant="default">
              <div className="p-6">
                <h3 className="mb-2 font-semibold text-lg">Default Card</h3>
                <p className="text-neutral-600 text-sm dark:text-neutral-400">
                  Basic card with border
                </p>
              </div>
            </Card>

            <Card variant="animated-border">
              <div className="p-6">
                <h3 className="mb-2 font-semibold text-lg">Animated Border</h3>
                <p className="text-neutral-600 text-sm dark:text-neutral-400">
                  Gradient animation
                </p>
              </div>
            </Card>

            <Card variant="shine">
              <div className="p-6">
                <h3 className="mb-2 font-semibold text-lg">Shine Effect</h3>
                <p className="text-neutral-600 text-sm dark:text-neutral-400">
                  Shimmer animation
                </p>
              </div>
            </Card>

            <Card variant="revealed-pointer">
              <div className="p-6">
                <h3 className="mb-2 font-semibold text-lg">Revealed Pointer</h3>
                <p className="text-neutral-600 text-sm dark:text-neutral-400">
                  Mouse tracking effect
                </p>
              </div>
            </Card>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-3xl">Badge Components</h2>
            <Separator className="mb-6" />
          </div>

          <div className="flex flex-wrap gap-4">
            <Badge variant="default">Default</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="shine">Shine</Badge>
            <Badge variant="animated-border">Animated Border</Badge>
            <Badge variant="rotate-border">Rotate Border</Badge>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-3xl">Text Animations</h2>
            <Separator className="mb-6" />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 font-semibold text-xl">Shine Effect</h3>
              <Text className="text-4xl" variant="shine">
                Shimmering Text
              </Text>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-xl">Glitch Effect</h3>
              <Text className="text-4xl" variant="glitch">
                Hover for Glitch
              </Text>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-xl">Shake Effect</h3>
              <Text className="text-4xl" variant="shake">
                Hover to Shake
              </Text>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-xl">Hover Enter</h3>
              <Text className="text-4xl" variant="hover-enter">
                Staggered Animation
              </Text>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-xl">Hover Decoration</h3>
              <Text className="text-4xl" variant="hover-decoration">
                Animated Underline
              </Text>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-3xl">Accordion</h2>
            <Separator className="mb-6" />
          </div>

          <Accordion className="max-w-2xl">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Telemetra?</AccordionTrigger>
              <AccordionPanel>
                Telemetra is a comprehensive component library with beautiful
                animations and variants.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How do I install it?</AccordionTrigger>
              <AccordionPanel>
                You can install Telemetra using bun or npm with the package
                manager of your choice.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionPanel>
                Yes! All components follow ARIA guidelines and keyboard
                navigation standards.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-3xl">Tabs</h2>
            <Separator className="mb-6" />
          </div>

          <Tabs className="max-w-2xl" defaultValue="tab1">
            <TabsList>
              <TabsTab value="tab1">Overview</TabsTab>
              <TabsTab value="tab2">Features</TabsTab>
              <TabsTab value="tab3">Documentation</TabsTab>
            </TabsList>

            <TabsPanels>
              <TabsPanel value="tab1">
                <div className="space-y-4 p-6">
                  <h3 className="font-semibold text-lg">Overview</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    This is the overview tab content with detailed information
                    about the component library.
                  </p>
                </div>
              </TabsPanel>

              <TabsPanel value="tab2">
                <div className="space-y-4 p-6">
                  <h3 className="font-semibold text-lg">Features</h3>
                  <ul className="list-inside list-disc space-y-2 text-neutral-600 dark:text-neutral-400">
                    <li>Beautiful animations</li>
                    <li>Dark mode support</li>
                    <li>Accessible components</li>
                    <li>TypeScript support</li>
                  </ul>
                </div>
              </TabsPanel>

              <TabsPanel value="tab3">
                <div className="space-y-4 p-6">
                  <h3 className="font-semibold text-lg">Documentation</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Comprehensive documentation for all components and their
                    variants.
                  </p>
                </div>
              </TabsPanel>
            </TabsPanels>
          </Tabs>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-3xl">Dialog</h2>
            <Separator className="mb-6" />
          </div>

          <Dialog>
            <Button asChild>
              <DialogTrigger>Open Dialog</DialogTrigger>
            </Button>
            <DialogBackdrop />
            <DialogPopup>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>
                  This is a dialog with a description. You can put any content
                  here.
                </DialogDescription>
              </DialogHeader>

              <div className="py-6">
                <p className="text-neutral-600 dark:text-neutral-400">
                  Dialog content goes here. You can add forms, text, or any
                  other components.
                </p>
              </div>

              <DialogFooter>
                <Button asChild variant="outline">
                  <DialogClose>Cancel</DialogClose>
                </Button>
                <Button asChild>
                  <DialogClose>Confirm</DialogClose>
                </Button>
              </DialogFooter>
            </DialogPopup>
          </Dialog>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-3xl">Dropdown Menu</h2>
            <Separator className="mb-6" />
          </div>

          <Menu onOpenChange={setShowMenu} open={showMenu}>
            <Button asChild variant="outline">
              <MenuTrigger>
                <HugeiconsIcon icon={Settings02Icon} />
                Open Menu
              </MenuTrigger>
            </Button>
            <MenuPortal>
              <MenuPanel>
                <MenuItem>Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuItem>Team</MenuItem>
                <MenuSeparator />
                <MenuCheckboxItem checked>Show Sidebar</MenuCheckboxItem>
                <MenuCheckboxItem>Show Toolbar</MenuCheckboxItem>
                <MenuSeparator />
                <MenuRadioGroup
                  onValueChange={setRadioValue}
                  value={radioValue}
                >
                  <MenuRadioItem value="option1">Option 1</MenuRadioItem>
                  <MenuRadioItem value="option2">Option 2</MenuRadioItem>
                  <MenuRadioItem value="option3">Option 3</MenuRadioItem>
                </MenuRadioGroup>
                <MenuSeparator />
                <MenuItem variant="destructive">Delete</MenuItem>
              </MenuPanel>
            </MenuPortal>
          </Menu>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-3xl">Tooltip</h2>
            <Separator className="mb-6" />
          </div>

          <div className="flex gap-4">
            <Tooltip>
              <Button asChild variant="outline">
                <TooltipTrigger>Hover me</TooltipTrigger>
              </Button>
              <TooltipPanel>This is a helpful tooltip</TooltipPanel>
            </Tooltip>

            <Tooltip>
              <Button asChild size="icon" variant="accent">
                <TooltipTrigger>
                  <HugeiconsIcon icon={Add01Icon} />
                </TooltipTrigger>
              </Button>
              <TooltipPanel>Add new item</TooltipPanel>
            </Tooltip>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-3xl">Utility Components</h2>
            <Separator className="mb-6" />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-xl">Separator</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <p>Horizontal separator</p>
                <Separator />
                <p>More content below</p>
              </div>

              <div className="flex h-20 items-center gap-4">
                <p>Vertical</p>
                <Separator orientation="vertical" />
                <p>Separator</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-xl">Skeleton</h3>
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
            </div>
          </div>
        </section>

        <div className="h-24" />
      </div>
    </div>
  );
}
