export const runtime = 'experimental-edge';

interface ErrorProps {
  statusCode?: number;
}

export default function ErrorPage({ statusCode = 404 }: ErrorProps) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>{statusCode}</h1>
      <p>
        {statusCode
          ? `A ${statusCode} error occurred on the server`
          : 'An error occurred on the client'}
      </p>
    </div>
  );
}
