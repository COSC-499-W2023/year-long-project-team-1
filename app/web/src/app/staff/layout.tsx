/*
 * Created on Sun Dec 03 2023
 * Author: Connor Doman
 */

interface StaffAreaLayoutProps {
    children?: React.ReactNode;
}

export default async function StaffAreaLayout({ children }: StaffAreaLayoutProps) {
    return <main aria-label="Staff-only page">{children}</main>;
}
