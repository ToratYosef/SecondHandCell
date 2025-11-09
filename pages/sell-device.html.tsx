import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: '/sell',
    permanent: false
  }
});

export default function LegacySellRedirect() {
  return null;
}
