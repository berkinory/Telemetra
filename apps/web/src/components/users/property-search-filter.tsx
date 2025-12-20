'use client';

import {
  Add01Icon,
  Delete02Icon,
  FilterHorizontalIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { PropertyOperator, PropertySearchCondition } from '@phase/shared';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

type PropertySearchFilterProps = {
  value: PropertySearchCondition[];
  onChange: (value: PropertySearchCondition[]) => void;
  isLoading?: boolean;
};

const OPERATOR_OPTIONS: { value: PropertyOperator; label: string }[] = [
  { value: 'eq', label: 'equals' },
  { value: 'neq', label: 'not equals' },
  { value: 'gt', label: 'greater than' },
  { value: 'lt', label: 'less than' },
  { value: 'contains', label: 'contains' },
  { value: 'startsWith', label: 'starts with' },
  { value: 'endsWith', label: 'ends with' },
];

const MAX_CONDITIONS = 10;

export function PropertySearchFilter({
  value,
  onChange,
  isLoading = false,
}: PropertySearchFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempConditions, setTempConditions] = useState<
    PropertySearchCondition[]
  >(value.length > 0 ? value : []);

  const handleAddCondition = () => {
    if (tempConditions.length >= MAX_CONDITIONS) {
      return;
    }

    setTempConditions([
      ...tempConditions,
      { key: '', operator: 'eq', value: '' },
    ]);
  };

  const handleRemoveCondition = (index: number) => {
    setTempConditions(tempConditions.filter((_, i) => i !== index));
  };

  const handleConditionChange = (
    index: number,
    field: keyof PropertySearchCondition,
    newValue: string | PropertyOperator
  ) => {
    const updated = [...tempConditions];
    const condition = updated[index];

    if (!condition) {
      return;
    }

    if (field === 'value') {
      const stringValue = newValue as string;

      if (stringValue && !Number.isNaN(Number(stringValue))) {
        condition.value = Number(stringValue);
      } else if (stringValue === 'true' || stringValue === 'false') {
        condition.value = stringValue === 'true';
      } else if (stringValue === 'null' || stringValue === '') {
        condition.value = null;
      } else {
        condition.value = stringValue;
      }
    } else {
      condition[field] = newValue as never;
    }

    setTempConditions(updated);
  };

  const handleApply = () => {
    const validConditions = tempConditions.filter(
      (c) => c.key.trim() !== '' && c.value !== ''
    );
    onChange(validConditions);
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempConditions([]);
    onChange([]);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempConditions(value);
    setIsOpen(false);
  };

  const hasActiveFilters = value.length > 0;

  return (
    <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          className={`w-full flex-shrink-0 sm:w-auto ${hasActiveFilters ? 'shadow-[0_0_0_2px] shadow-primary/30' : ''}`}
          disabled={isLoading}
          size="sm"
          type="button"
          variant={hasActiveFilters ? 'default' : 'outline'}
        >
          <HugeiconsIcon icon={FilterHorizontalIcon} />
          Property Search
          {hasActiveFilters && (
            <span className="ml-1 rounded-full bg-primary-foreground px-1.5 py-0.5 font-semibold text-primary text-xs">
              {value.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[min(calc(100vw-2rem),400px)]"
      >
        <DropdownMenuLabel>Search by Properties</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="max-h-96 space-y-2 overflow-y-auto p-2">
          {tempConditions.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              No conditions added. Click "Add Condition" to start.
            </div>
          ) : (
            tempConditions.map((condition, index) => (
              <div
                className="flex items-start gap-2 rounded-md border p-2"
                key={`condition-${index}-${condition.key || 'empty'}`}
              >
                <div className="flex-1 space-y-2">
                  <Input
                    onChange={(e) =>
                      handleConditionChange(index, 'key', e.target.value)
                    }
                    placeholder="Key"
                    type="text"
                    value={condition.key}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="h-9 justify-start font-normal"
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          {OPERATOR_OPTIONS.find(
                            (op) => op.value === condition.operator
                          )?.label || 'equals'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {OPERATOR_OPTIONS.map((op) => (
                          <DropdownMenuItem
                            key={op.value}
                            onClick={() =>
                              handleConditionChange(index, 'operator', op.value)
                            }
                          >
                            {op.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Input
                      onChange={(e) =>
                        handleConditionChange(index, 'value', e.target.value)
                      }
                      placeholder="Value"
                      type="text"
                      value={
                        condition.value === null ? '' : String(condition.value)
                      }
                    />
                  </div>
                </div>
                <Button
                  onClick={() => handleRemoveCondition(index)}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <HugeiconsIcon icon={Delete02Icon} />
                </Button>
              </div>
            ))
          )}
        </div>

        <DropdownMenuSeparator />

        <div className="flex items-center justify-between p-2">
          <Button
            disabled={tempConditions.length >= MAX_CONDITIONS}
            onClick={handleAddCondition}
            size="sm"
            type="button"
            variant="outline"
          >
            <HugeiconsIcon icon={Add01Icon} />
            <span className="sm:hidden">Add</span>
            <span className="hidden sm:inline">Add Condition</span>
          </Button>

          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button
                onClick={handleClear}
                size="sm"
                type="button"
                variant="ghost"
              >
                Clear
              </Button>
            )}
            <Button
              onClick={handleCancel}
              size="sm"
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={handleApply} size="sm" type="button">
              Apply
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
