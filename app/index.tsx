import { useEffect } from 'react';
import { router } from 'expo-router';
import { useSession } from '@context/UserContext';
import LoaderScreen from '@components/Shared/LoaderScreen';
import { useTranslation } from 'react-i18next';

export default function Index() {
  const { user, isLoading } = useSession();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/(navbar)');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isLoading]);

  return <LoaderScreen text={t("loading")} />;
}
