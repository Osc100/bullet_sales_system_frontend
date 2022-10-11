import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { IoPersonCircle } from "react-icons/io5";
interface NavBarProps {}

const navBarLinks = [
  { name: "Inventario", href: "/inventario" },
  { name: "Lotes", href: "/lotes" },
  { name: "Ventas", href: "/ventas" },
  { name: "Registar Usuario", href: "/registro" },
];

const NavBar: FC<NavBarProps> = () => {
  const [profileName, setProfileName] = useState<string>("");
  const router = useRouter();

  const logout = () => {
    sessionStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    setProfileName(sessionStorage.getItem("user"));
  }, []);

  return (
    <div className="fixed navbar bg-base-200">
      <div className="navbar-start ml-[7%]">
        <ul>
          {navBarLinks.map((obj, index) => (
            <li
              key={"navlink " + index}
              className={`cursor-pointer mx-2 p-0 btn ${
                obj.href === router.pathname
                  ? "btn-success btn-outline "
                  : "btn-ghost"
              }`}
            >
              <Link href={obj.href}>
                <a className="h-full px-8 py-4">{obj.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="font-semibold navbar-center font-2xl">
        <p>Bullet Sales System</p>
      </div>

      <div className="navbar-end mr-[9%]">
        <p className="mr-4">{profileName}</p>

        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost rounded-btn">
            <IoPersonCircle size={32} />
          </label>
          <ul
            tabIndex={0}
            className="p-2 mt-4 shadow menu dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a
                className="btn btn-outline btn-success"
                onClick={() => logout()}
              >
                Cerrar Sesión
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
