import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styles from './../styles/ErrorPage.module.css'; // Create this CSS module

interface ErrorProps {
  statusCode?: number;
  title?: string;
}

export const runtime = 'experimental-edge';

const ErrorPage: NextPage<ErrorProps> = ({ statusCode = 404, title }) => {
  const errorMessages = {
    404: {
      title: 'Page Not Found',
      description: "Oops! The page you're looking for doesn't exist.",
    },
    500: {
      title: 'Server Error',
      description: 'Oops! Something went wrong on our end.',
    },
    default: {
      title: title || 'An Error Occurred',
      description: statusCode
        ? `A ${statusCode} error occurred`
        : 'An error occurred',
    },
  };

  const { title: errorTitle, description } = errorMessages[statusCode as keyof typeof errorMessages] || errorMessages.default;

  return (
    <>
      <Head>
        <title>{errorTitle} | Your Site Name</title>
        <meta name="description" content={description} />
      </Head>

      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.statusCode}>{statusCode}</h1>
          <h2 className={styles.title}>{errorTitle}</h2>
          <p className={styles.description}>{description}</p>
          
          <div className={styles.actions}>
            <Link href="/" className={styles.homeLink}>
              Go back home
            </Link>
            <button 
              onClick={() => window.location.reload()} 
              className={styles.refreshButton}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;