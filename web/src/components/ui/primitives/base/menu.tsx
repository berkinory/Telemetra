'use client';

import { Menu as MenuPrimitive } from '@base-ui-components/react/menu';
import { AnimatePresence, type HTMLMotionProps, motion } from 'motion/react';
import { type ComponentProps, useState } from 'react';

import {
  Highlight,
  HighlightItem,
  type HighlightItemProps,
  type HighlightProps,
} from '@/components/ui/primitives/effects/highlight';
import { useControlledState } from '@/hooks/use-controlled-state';
import { useDataState } from '@/hooks/use-data-state';
import { getStrictContext } from '@/lib/get-strict-context';

type MenuActiveValueContextType = {
  highlightedValue: string | null;
  setHighlightedValue: (value: string | null) => void;
};

type MenuContextType = {
  isOpen: boolean;
  setIsOpen: MenuProps['onOpenChange'];
};

const [MenuActiveValueProvider, useMenuActiveValue] =
  getStrictContext<MenuActiveValueContextType>('MenuActiveValueContext');
const [MenuProvider, useMenu] =
  getStrictContext<MenuContextType>('MenuContext');

type MenuProps = ComponentProps<typeof MenuPrimitive.Root>;

function Menu(props: MenuProps) {
  const [isOpen, setIsOpen] = useControlledState({
    value: props?.open,
    defaultValue: props?.defaultOpen,
    onChange: props?.onOpenChange,
  });
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null);

  return (
    <MenuActiveValueProvider value={{ highlightedValue, setHighlightedValue }}>
      <MenuProvider value={{ isOpen, setIsOpen }}>
        <MenuPrimitive.Root
          data-slot="menu"
          {...props}
          onOpenChange={setIsOpen}
        />
      </MenuProvider>
    </MenuActiveValueProvider>
  );
}

type MenuTriggerProps = ComponentProps<typeof MenuPrimitive.Trigger>;

function MenuTrigger(props: MenuTriggerProps) {
  return <MenuPrimitive.Trigger data-slot="menu-trigger" {...props} />;
}

type MenuPortalProps = Omit<
  ComponentProps<typeof MenuPrimitive.Portal>,
  'keepMounted'
>;

function MenuPortal(props: MenuPortalProps) {
  const { isOpen } = useMenu();

  return (
    <AnimatePresence>
      {isOpen && (
        <MenuPrimitive.Portal data-slot="menu-portal" keepMounted {...props} />
      )}
    </AnimatePresence>
  );
}

type MenuGroupProps = ComponentProps<typeof MenuPrimitive.Group>;

function MenuGroup(props: MenuGroupProps) {
  return <MenuPrimitive.Group data-slot="menu-group" {...props} />;
}

type MenuGroupLabelProps = ComponentProps<typeof MenuPrimitive.GroupLabel>;

function MenuGroupLabel(props: MenuGroupLabelProps) {
  return <MenuPrimitive.GroupLabel data-slot="menu-group-label" {...props} />;
}

type MenuSubmenuProps = ComponentProps<typeof MenuPrimitive.SubmenuRoot>;

function MenuSubmenu(props: MenuSubmenuProps) {
  const [isOpen, setIsOpen] = useControlledState({
    value: props?.open,
    defaultValue: props?.defaultOpen,
    onChange: props?.onOpenChange,
  });

  return (
    <MenuProvider value={{ isOpen, setIsOpen }}>
      <MenuPrimitive.SubmenuRoot
        data-slot="menu-submenu"
        {...props}
        onOpenChange={setIsOpen}
      />
    </MenuProvider>
  );
}

type MenuSubmenuTriggerProps = Omit<
  ComponentProps<typeof MenuPrimitive.SubmenuTrigger>,
  'render'
> &
  HTMLMotionProps<'div'> & {
    disabled?: boolean;
  };

function MenuSubmenuTrigger({
  label,
  id,
  nativeButton,
  ...props
}: MenuSubmenuTriggerProps) {
  const { setHighlightedValue } = useMenuActiveValue();
  const [, highlightedRef] = useDataState<HTMLDivElement>(
    'highlighted',
    undefined,
    (value) => {
      if (value === true) {
        const el = highlightedRef.current;
        const v = el?.dataset.value || el?.id || null;
        if (v) {
          setHighlightedValue(v);
        }
      }
    }
  );

  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="menu-submenu-trigger"
      id={id}
      label={label}
      nativeButton={nativeButton}
      ref={highlightedRef}
      {...props}
    />
  );
}

type MenuHighlightProps = Omit<
  HighlightProps,
  'controlledItems' | 'enabled' | 'hover'
> & {
  animateOnHover?: boolean;
};

function MenuHighlight({
  transition = { duration: 0.1, ease: [0.25, 0.1, 0.25, 1] },
  ...props
}: MenuHighlightProps) {
  const { highlightedValue } = useMenuActiveValue();

  return (
    <Highlight
      click={false}
      controlledItems
      data-slot="menu-highlight"
      transition={transition}
      value={highlightedValue}
      {...props}
    />
  );
}

type MenuHighlightItemProps = HighlightItemProps;

function MenuHighlightItem(props: MenuHighlightItemProps) {
  return <HighlightItem data-slot="menu-highlight-item" {...props} />;
}

type MenuPositionerProps = ComponentProps<typeof MenuPrimitive.Positioner>;

function MenuPositioner(props: MenuPositionerProps) {
  return <MenuPrimitive.Positioner data-slot="menu-positioner" {...props} />;
}

type MenuPopupProps = Omit<
  ComponentProps<typeof MenuPrimitive.Popup>,
  'render'
> &
  HTMLMotionProps<'div'>;

function MenuPopup({
  finalFocus,
  id,
  transition = { duration: 0.2 },
  style,
  ...props
}: MenuPopupProps) {
  return (
    <MenuPrimitive.Popup
      finalFocus={finalFocus}
      id={id}
      render={
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          data-slot="menu-popup"
          exit={{ opacity: 0, scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.95 }}
          key="menu-popup"
          style={{ willChange: 'opacity, transform', ...style }}
          transition={transition}
          {...props}
        />
      }
    />
  );
}

type MenuItemProps = Omit<ComponentProps<typeof MenuPrimitive.Item>, 'render'> &
  HTMLMotionProps<'div'>;

function MenuItem({
  disabled,
  label,
  closeOnClick,
  nativeButton,
  id,
  ...props
}: MenuItemProps) {
  const { setHighlightedValue } = useMenuActiveValue();
  const [, highlightedRef] = useDataState<HTMLDivElement>(
    'highlighted',
    undefined,
    (value) => {
      if (value === true) {
        const el = highlightedRef.current;
        const v = el?.dataset.value || el?.id || null;
        if (v) {
          setHighlightedValue(v);
        }
      }
    }
  );

  return (
    <MenuPrimitive.Item
      closeOnClick={closeOnClick}
      data-slot="menu-item"
      disabled={disabled}
      id={id}
      label={label}
      nativeButton={nativeButton}
      ref={highlightedRef}
      {...props}
    />
  );
}

type MenuCheckboxItemProps = Omit<
  ComponentProps<typeof MenuPrimitive.CheckboxItem>,
  'render'
>;

function MenuCheckboxItem({
  label,
  defaultChecked,
  checked,
  onCheckedChange,
  disabled,
  closeOnClick,
  nativeButton,
  id,
  ...props
}: MenuCheckboxItemProps) {
  const { setHighlightedValue } = useMenuActiveValue();
  const [, highlightedRef] = useDataState<HTMLDivElement>(
    'highlighted',
    undefined,
    (value) => {
      if (value === true) {
        const el = highlightedRef.current;
        const v = el?.dataset.value || el?.id || null;
        if (v) {
          setHighlightedValue(v);
        }
      }
    }
  );
  return (
    <MenuPrimitive.CheckboxItem
      checked={checked}
      closeOnClick={closeOnClick}
      data-slot="menu-checkbox-item"
      defaultChecked={defaultChecked}
      disabled={disabled}
      id={id}
      label={label}
      nativeButton={nativeButton}
      onCheckedChange={onCheckedChange}
      ref={highlightedRef}
      {...props}
    />
  );
}

type MenuCheckboxItemIndicatorProps = Omit<
  ComponentProps<typeof MenuPrimitive.CheckboxItemIndicator>,
  'render'
> &
  HTMLMotionProps<'div'>;

function MenuCheckboxItemIndicator({
  keepMounted,
  ...props
}: MenuCheckboxItemIndicatorProps) {
  return (
    <MenuPrimitive.CheckboxItemIndicator
      data-slot="menu-checkbox-item-indicator"
      keepMounted={keepMounted}
      render={
        <motion.div data-slot="menu-checkbox-item-indicator" {...props} />
      }
    />
  );
}

type MenuRadioGroupProps = ComponentProps<typeof MenuPrimitive.RadioGroup>;

function MenuRadioGroup(props: MenuRadioGroupProps) {
  return <MenuPrimitive.RadioGroup data-slot="menu-radio-group" {...props} />;
}

type MenuRadioItemProps = Omit<
  ComponentProps<typeof MenuPrimitive.RadioItem>,
  'render'
>;

function MenuRadioItem({
  value,
  disabled,
  label,
  closeOnClick,
  nativeButton,
  id,
  ...props
}: MenuRadioItemProps) {
  const { setHighlightedValue } = useMenuActiveValue();
  const [, highlightedRef] = useDataState<HTMLDivElement>(
    'highlighted',
    undefined,
    (isHighlighted) => {
      if (isHighlighted === true) {
        const el = highlightedRef.current;
        const v = el?.dataset.value || el?.id || null;
        if (v) {
          setHighlightedValue(v);
        }
      }
    }
  );
  return (
    <MenuPrimitive.RadioItem
      closeOnClick={closeOnClick}
      data-slot="menu-radio-item"
      disabled={disabled}
      id={id}
      label={label}
      nativeButton={nativeButton}
      ref={highlightedRef}
      value={value}
      {...props}
    />
  );
}

type MenuRadioItemIndicatorProps = Omit<
  ComponentProps<typeof MenuPrimitive.RadioItemIndicator>,
  'render'
> &
  HTMLMotionProps<'div'>;

function MenuRadioItemIndicator({
  keepMounted,
  ...props
}: MenuRadioItemIndicatorProps) {
  return (
    <MenuPrimitive.RadioItemIndicator
      data-slot="menu-radio-item-indicator"
      keepMounted={keepMounted}
      render={<motion.div data-slot="menu-radio-item-indicator" {...props} />}
    />
  );
}

type MenuShortcutProps = ComponentProps<'span'>;

function MenuShortcut(props: MenuShortcutProps) {
  return <span data-slot="menu-shortcut" {...props} />;
}

type MenuArrowProps = ComponentProps<typeof MenuPrimitive.Arrow>;

function MenuArrow(props: MenuArrowProps) {
  return <MenuPrimitive.Arrow data-slot="menu-arrow" {...props} />;
}

type MenuSeparatorProps = ComponentProps<typeof MenuPrimitive.Separator>;

function MenuSeparator(props: MenuSeparatorProps) {
  return <MenuPrimitive.Separator data-slot="menu-separator" {...props} />;
}

export {
  Menu,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuPopup,
  MenuArrow,
  MenuItem,
  MenuCheckboxItem,
  MenuCheckboxItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRadioItemIndicator,
  MenuGroup,
  MenuGroupLabel,
  MenuSeparator,
  MenuShortcut,
  MenuHighlight,
  MenuHighlightItem,
  MenuSubmenu,
  MenuSubmenuTrigger,
  useMenuActiveValue,
  useMenu,
  type MenuProps,
  type MenuTriggerProps,
  type MenuPortalProps,
  type MenuPositionerProps,
  type MenuPopupProps,
  type MenuArrowProps,
  type MenuItemProps,
  type MenuCheckboxItemProps,
  type MenuCheckboxItemIndicatorProps,
  type MenuRadioItemProps,
  type MenuRadioItemIndicatorProps,
  type MenuRadioGroupProps,
  type MenuGroupProps,
  type MenuGroupLabelProps,
  type MenuSeparatorProps,
  type MenuShortcutProps,
  type MenuHighlightProps,
  type MenuHighlightItemProps,
  type MenuSubmenuProps,
  type MenuSubmenuTriggerProps,
  type MenuActiveValueContextType,
  type MenuContextType,
};
