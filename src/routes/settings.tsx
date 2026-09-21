import { KeyIcon, ShieldKeyholeIcon } from "../assets/icon/components/solar-bold-duotone-icons";
import Roles from "../pages/settings/roles";
import RolesForm from "../pages/settings/roles/form";
import Permissions from "../pages/settings/permissions";

export const settingsRoutes = [
  {
    path: "/settings/roles",
    title: "Rollar",
    icon: <ShieldKeyholeIcon className="!text-[#1890FF]" />,
    color: "#1890FF",
    element: <Roles />,
    permissions: ['roles.list']
  },
  { path: "/settings/roles/create", element: <RolesForm />, permissions: ['roles.create'] },
  { path: "/settings/roles/update/:id", element: <RolesForm />, permissions: ['roles.update'] },
  {
    path: "/settings/permissions",
    title: "Ruxsatlar",
    icon: <KeyIcon className="!text-[#52C41A]" />,
    color: "#52C41A",
    element: <Permissions />,
    permissions: ['permissions.list']
  },
];
