import { useEffect } from "react"

// Extend the Window interface to include fbAsyncInit
declare global {
  interface Window {
    fbAsyncInit: () => void
    FB: any
  }

  const FB: any
}

export function useFacebookSDK(appId: string) {
  useEffect(() => {
    if (typeof window === "undefined") return

    window.fbAsyncInit = function () {
      FB.init({
        appId,
        cookie: true,
        xfbml: true,
        version: "v19.0",
      })
    }

    if (!document.getElementById("facebook-jssdk")) {
      const js = document.createElement("script")
      js.id = "facebook-jssdk"
      js.src = "https://connect.facebook.net/en_US/sdk.js"
      document.body.appendChild(js)
    }
  }, [appId])
}