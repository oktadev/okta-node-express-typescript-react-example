import { useEffect, useState } from "react";
import { useOktaAuth } from "@okta/okta-react";

export const useAuth = () => {
  const { authService, authState } = useOktaAuth();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (authState.isAuthenticated) {
      if (!user) {
        authService.getUser().then(setUser);
      }
      setToken(`Bearer ${authState.accessToken}`);
    } else {
      setUser(null);
      setToken(null);
    }
  });

  return [user, token];
};

