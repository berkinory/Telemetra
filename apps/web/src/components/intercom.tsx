'use client';

import Intercom from '@intercom/messenger-js-sdk';
import { useEffect } from 'react';

export const IntercomMessenger = () => {
  useEffect(() => {
    Intercom({
      app_id: 'las9xhwc',
    });
  }, []);

  return null;
};
