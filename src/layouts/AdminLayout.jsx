import { Outlet, Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import AdminNavbar from "../components/AdminNavbar"

const AdminLayout = () => {

  const { auth, loading } = useAuth()
  console.log(auth.id)

  //TODO: Crear un componente <Loading />
  if (loading) {
    return 'Loading...'
  }

  return (
    <div className="bg-slate-100 dark:bg-zinc-900">
      {auth.id ? (
        <div className="flex flex-col min-h-screen">
          <main className="w-full max-h-screen overflow-auto dark:text-white">
            <Outlet />
          </main>
          <AdminNavbar />
        </div>
      ) : (
        <Navigate to='/' />
      )}
    </div>
  )
}

export default AdminLayout

// dark:bg-zinc-900