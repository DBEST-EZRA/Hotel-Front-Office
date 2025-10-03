import { useEffect } from "react";
import { toast } from "react-toastify";

const useNetworkStatus = () => {
  useEffect(() => {
    let offlineToastId = null;

    const handleOffline = () => {
      if (offlineToastId) return; // don’t stack multiple toasts
      offlineToastId = toast.error("Internet connection lost!", {
        toastId: "offline-toast", // ensures unique toast
        position: "top-right",
        autoClose: false, // stays until back online
        style: {
          backgroundColor: "#dc3545", // red
          color: "white",
        },
        progressStyle: {
          background: "white",
        },
      });
    };

    const handleOnline = () => {
      if (offlineToastId) {
        toast.dismiss("offline-toast");
        offlineToastId = null;
      }
      toast.success("Back online", {
        position: "top-right",
        autoClose: 3000,
        style: {
          backgroundColor: "#88c244", // green
          color: "white",
        },
        progressStyle: {
          background: "#3c51a1", // blue
        },
      });
    };

    // Listen to browser events
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // 🔄 Fallback: Ping Google every 5s
    const interval = setInterval(async () => {
      try {
        // Using favicon.ico as it’s tiny and always available
        await fetch("https://www.google.com/favicon.ico", { mode: "no-cors" });
        if (!navigator.onLine) {
          handleOnline();
        }
      } catch {
        handleOffline();
      }
    }, 5000);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      clearInterval(interval);
    };
  }, []);
};

export default useNetworkStatus;
