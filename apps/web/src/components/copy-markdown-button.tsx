'use client';

import { CheckmarkSquare01Icon, Copy01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'motion/react';
import { type MouseEvent, useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CopyMarkdownButtonProps = {
  content: string;
  className?: string;
};

function CopyMarkdownButton({ content, className }: CopyMarkdownButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (isCopied) {
        return;
      }
      if (content) {
        navigator.clipboard
          .writeText(content)
          .then(() => {
            setIsCopied(true);
            setTimeout(() => {
              setIsCopied(false);
            }, 3000);
          })
          .catch((error) => {
            console.error('Error copying markdown', error);
          });
      }
    },
    [isCopied, content]
  );

  const Icon = isCopied ? CheckmarkSquare01Icon : Copy01Icon;

  return (
    <Button
      className={cn('gap-2 text-sm', className)}
      onClick={handleCopy}
      type="button"
      variant="outline"
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          exit={{ scale: 0, opacity: 0.4, filter: 'blur(4px)' }}
          initial={{ scale: 0, opacity: 0.4, filter: 'blur(4px)' }}
          key={isCopied ? 'check' : 'copy'}
          transition={{ duration: 0.25 }}
        >
          <HugeiconsIcon icon={Icon} size={16} />
        </motion.span>
      </AnimatePresence>
      {isCopied ? 'Copied!' : 'Copy as Markdown'}
    </Button>
  );
}

export { CopyMarkdownButton };
