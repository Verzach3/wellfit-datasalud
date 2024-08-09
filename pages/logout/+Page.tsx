import { useEffect } from "react";
import { navigate } from "vike/client/router";

function Logout() {
  useEffect(() => {
    (async () => {
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";

      //redirect to /
      await supabase.auth.signOut();
      console.log("Logged out");
      await navigate("/auth");
    })(); //clear cookies
  });
  return null;
}

export default Logout;
