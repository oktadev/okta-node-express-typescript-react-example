import { useEffect, useState } from "react";

export const useAuth = (auth) => {
  const [authenticated, setAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    auth.isAuthenticated().then((isAuthenticated) => {
      if (isAuthenticated !== authenticated) {
        setAuthenticated(isAuthenticated);
      }
    });
  });

  useEffect(() => {
    if (authenticated) {
      auth.getUser().then(setUser);
      auth.getAccessToken().then((accessToken) => {
        setToken(accessToken ? `Bearer ${accessToken}` : null);
      });
    } else {
      setUser(null);
      setToken(null);
    }
  }, [authenticated]);

  return [authenticated, user, token];
};
