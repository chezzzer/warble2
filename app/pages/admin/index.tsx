import AdminLayout from "@/components/admin/AdminLayout";
import Controls from "@/components/admin/Controls";
import DisplayMode from "@/components/admin/DisplayMode";
import LyricType from "@/components/admin/LyricType";
import Playlists from "@/components/admin/Playlists";
import Queue from "@/components/admin/Queue";
import Seeker from "@/components/admin/Seeker";
import Stats from "@/components/admin/Stats";
import Sync from "@/components/admin/Sync";
import { AdminProvider } from "@/lib/AdminContext";
import Head from "next/head";

export default function Admin() {
    return (
        <>
            <Head>
                <title>WARBLE - Admin</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta name="robots" content="noindex" />
                <meta name="googlebot" content="noindex" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <AdminProvider>
                <AdminLayout>
                    <div className="mb-3">
                        <Stats />
                    </div>
                    <Sync />
                    <div className="row mt-3">
                        <div className="col-sm-6">
                            <div className="mb-3">
                                <Queue />
                            </div>
                            <div className="mb-3">
                                <Playlists />
                            </div>
                            <div className="mb-3">
                                <LyricType />
                            </div>
                            <div className="mb-3">
                                <DisplayMode />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="mb-3">
                                <Controls />
                            </div>
                            <div className="mb-3">
                                <Seeker />
                            </div>
                        </div>
                    </div>
                </AdminLayout>
            </AdminProvider>
        </>
    );
}
