import { NextPageContext } from 'next';

export const runtime = 'experimental-edge';

interface ErrorProps {
  statusCode?: number;
}

function ErrorPage({ statusCode }: ErrorProps) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>{statusCode || 'An error occurred'}</h1>
      <p>
        {statusCode
          ? `A ${statusCode} error occurred on the server`
          : 'An error occurred on the client'}
      </p>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode || err?.statusCode || 404;
  return { statusCode };
};

export default ErrorPage;
