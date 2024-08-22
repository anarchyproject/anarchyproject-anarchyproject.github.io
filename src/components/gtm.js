import Script from "next/script";


export const GTM = () => {
  return (
    <>
    <Script src="https://www.googletagmanager.com/gtag/js?id=G-57D0MRREGC" />
      <Script id="gtm-script" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-57D0MRREGC');
       `}
      </Script>
    </>
  );
}