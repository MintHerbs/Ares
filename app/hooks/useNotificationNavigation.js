// app/hooks/useNotificationNavigation.js
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export function useNotificationNavigation() {
  const nav = useNavigation();

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((res) => {
      const links = res.notification.request.content.data?.links ?? [];
      nav.navigate('NewsScraper', { links });
    });

    (async () => {
      const last = await Notifications.getLastNotificationResponseAsync();
      if (last) {
        const links = last.notification.request.content.data?.links ?? [];
        nav.navigate('NewsScraper', { links });
      }
    })();

    return () => sub.remove();
  }, [nav]);
}
