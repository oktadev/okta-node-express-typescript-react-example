import { useEffect, useState } from "react";
import { useOktaAuth } from "@okta/okta-react";

export const useAuth = () => {
  const { authService, authState } = useOktaAuth();
  const [authenticated, setAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setAuthenticated(authState.isAuthenticated)
  });

  useEffect(() => {
    if (authenticated) {
      authService.getUser().then(setUser);
      setToken(authState.accessToken ? `Bearer ${authState.accessToken}` : null);
    } else {
      setUser(null);
      setToken(null);
    }
  }, [authenticated]);

  return [authenticated, user, token];
};

