import { useAdmin } from "@/lib/AdminContext";
import Login from "./Login";
import styles from "@/styles/admin/Admin.module.css"

type PropsWithChildren = {
    children: React.ReactNode;
};

export default function AdminLayout({ children }: PropsWithChildren) {
    const { authenticated } = useAdmin();

    if (!authenticated) return (
        <Login/>
    )

    return (
        <>
            <div className="container py-5">
                {children}
            </div>
        </>
    )
}