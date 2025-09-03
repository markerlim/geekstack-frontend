import { useEffect, ReactNode, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "./useAuth";
import CardLoader from "../../components/genericComponent/CardLoader";
import { TCGTYPE } from "../../utils/constants";

interface AdvancedRouteGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  publicRoutes?: string[];
  authRoutes?: string[];
  adminRoutes?: string[];
  tcgRoutes?: string[];
}

const AdvancedRouteGuard = ({
  children,
  fallback = <CardLoader />,
  publicRoutes = ["/", "/login", "/stack"],
  authRoutes = ["/deckbuilder", "/decklib"],
  adminRoutes = ["/admin"],
  tcgRoutes = Object.values(TCGTYPE).map((type) => `/${type}`),
}: AdvancedRouteGuardProps) => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const currentPath = router.asPath;
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (loading) {
      return;
    }

    const requiresAuth = authRoutes.some((route) =>
      currentPath.startsWith(route)
    );
    const requiresAdmin = adminRoutes.some((route) =>
      currentPath.startsWith(route)
    );
    const isPublic = publicRoutes.some((route) =>
      currentPath.startsWith(route)
    );
    const isTcgRoute = tcgRoutes.some((route) => currentPath.startsWith(route));

    if (requiresAdmin && !currentUser) {
      router.push("/");
      setIsAuthorized(false);
    } else if (requiresAuth && !currentUser && !isTcgRoute) {
      setTimeout(
        () => router.push(`/login?redirect=${encodeURIComponent(currentPath)}`),
        500
      );
      setIsAuthorized(false);
    } else if (currentUser && currentPath.startsWith("/login")) {
      setTimeout(() => router.push(`/`), 500);
      setIsAuthorized(false);
    } else {
      // Authorized to view this page
      setIsAuthorized(true);
    }

    setCheckingAuth(false);
  }, [
    currentUser,
    loading,
    currentPath,
    router,
    authRoutes,
    adminRoutes,
    publicRoutes,
    tcgRoutes,
  ]);

  // Show loader while checking authentication and authorization
  if (loading || checkingAuth) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        {fallback}
      </div>
    );
  }

  // Only render children if authorized
  return isAuthorized ? (
    <>{children}</>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      {fallback}
    </div>
  );
};

export default AdvancedRouteGuard;
