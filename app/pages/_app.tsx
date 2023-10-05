import { ClientProvider } from "@/lib/ClientContext";
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from "next/app";

import { ToastContainer } from 'react-toastify';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
        <ToastContainer theme="colored" position="top-center" />
            <ClientProvider>
                <Component {...pageProps} />
            </ClientProvider>
        </>
    );
}
