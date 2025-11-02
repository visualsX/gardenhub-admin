import { useTranslations } from 'next-intl';

export default function Tx({ type = 'HomePage', children }) {
  const t = useTranslations(type);
  // return (<>{t(children)}</>);
  return <>{children}</>;
}
