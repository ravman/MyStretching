import {useEffect, useRef} from 'react';
import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native';
import {Alarm, ZONE_LABELS} from '../data/types';

export function setupNotifications() {
  PushNotification.configure({
    onRegister: () => {},
    onNotification: () => {},
    permissions: {alert: true, badge: true, sound: true},
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
  });

  PushNotification.createChannel(
    {
      channelId: 'stretching-alarms',
      channelName: 'Stretching Alarms',
      channelDescription: 'Daily stretching reminders',
      soundName: 'default',
      importance: 4,
      vibrate: true,
    },
    () => {},
  );
}

export function scheduleAlarms(alarms: Alarm[]) {
  // Cancel all existing
  PushNotification.cancelAllLocalNotifications();

  alarms
    .filter(a => a.enabled)
    .forEach(alarm => {
      const [hours, minutes] = alarm.time.split(':').map(Number);
      const now = new Date();
      const fire = new Date();
      fire.setHours(hours, minutes, 0, 0);
      if (fire <= now) {
        // Schedule for tomorrow if time has passed
        fire.setDate(fire.getDate() + 1);
      }
      const zoneName =
        alarm.zone === 'all' ? 'Full Body' : ZONE_LABELS[alarm.zone] ?? alarm.zone;

      PushNotification.localNotificationSchedule({
        channelId: 'stretching-alarms',
        id: alarm.id,
        title: '🌅 Time to Stretch!',
        message: `${alarm.label} — ${zoneName} routine`,
        date: fire,
        repeatType: 'day',
        allowWhileIdle: true,
        soundName: 'default',
        vibrate: true,
      });
    });
}

// Fallback in-app alarm polling (when app is foregrounded)
export function useAlarmPolling(
  alarms: Alarm[],
  onFire: (alarm: Alarm) => void,
) {
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const check = setInterval(() => {
      const now = new Date();
      const cur = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes(),
      ).padStart(2, '0')}`;

      alarms
        .filter(a => a.enabled && a.time === cur)
        .forEach(a => {
          const key = `${a.id}-${cur}`;
          if (!firedRef.current.has(key)) {
            firedRef.current.add(key);
            onFire(a);
            // Clear after 90s so it doesn't re-fire
            setTimeout(() => firedRef.current.delete(key), 90_000);
          }
        });
    }, 15_000);

    return () => clearInterval(check);
  }, [alarms, onFire]);
}
