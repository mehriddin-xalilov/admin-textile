import { Navigate, Route, Routes } from "react-router-dom";
import {
  BagIcon,
  BoxIcon,
  Home1Icon,
  PaletteIcon,
  SettingsIcon,
  UsersGroupTwoRoundedIcon
} from "../assets/icon/components/solar-bold-duotone-icons";
import Layout from "../components/layout";
import Auth from "../pages/auth";
import NotFound from "../pages/not-found";

import { Spin } from "antd";
import { get } from "lodash";
import React from "react";

// ─── Katalog ─────────────────────────────────────────────────────────────────
import Categories from "../pages/catalog/categories";
import Colors from "../pages/catalog/colors";
import Sizes from "../pages/catalog/sizes";
import Cliparts from "../pages/catalog/cliparts";
import Phrases from "../pages/catalog/phrases";
import GarmentModels from "../pages/catalog/garment-models";
import Banners from "../pages/cms/banners";
import CmsPages from "../pages/cms/pages";
import Contacts from "../pages/cms/contacts";
import { GlobalIcon } from "../assets/icon/components/solar-bold-duotone-icons";
import Products from "../pages/catalog/products";
import ReadyProducts from "../pages/catalog/ready-products";
import ProductForm from "../pages/catalog/products/form";
import ProductView from "../pages/catalog/products/view";

// ─── Ombor ───────────────────────────────────────────────────────────────────
import Batches from "../pages/inventory/batches";
import BatchForm from "../pages/inventory/batches/form";
import BatchView from "../pages/inventory/batches/view";
import Stock from "../pages/inventory/stock";

// ─── Buyurtma va dizayn ──────────────────────────────────────────────────────
import Orders from "../pages/orders";
import OrderView from "../pages/orders/view";
import Designs from "../pages/designs";
import Reviews from "../pages/reviews";
import DesignView from "../pages/designs/view";

// ─── Standalone ──────────────────────────────────────────────────────────────
import Dashboard from "../pages/dashboard";
import ProfilePage from "../pages/profile";
import Settings from "../pages/settings";
import Users from "../pages/users";
import UsersForm from "../pages/users/form";
import UserView from "../pages/users/view";

import useAccess from "../hooks/useAccess";
import { helpers, storage, useStore } from "../services";
import { settingsRoutes } from "./settings";

export const useRoutes = () => {
  const { sidebarImage, sidebarGradient } = useStore((state) => state);
  const isCustomBg = sidebarImage !== 'none' || sidebarGradient !== 'none';
  const ic = (cls: string) => isCustomBg ? '!text-white' : cls;

  const sidebarRoutes = [
    { path: '/', title: "Bosh sahifa", icon: <Home1Icon className={ic("!text-blue-500")} />, permissions: ['dashboard.view'] },
    {
      title: "Buyurtmalar",
      icon: <BagIcon className={ic("!text-emerald-500")} />,
      children: [
        { path: '/orders', title: "Buyurtmalar", permissions: ['orders.list'] },
        { path: '/designs', title: "Dizaynlar", permissions: ['designs.list'] },
        { path: '/ready-products', title: "Tayyor mahsulotlar", permissions: ['ready-products.list'] },
        { path: '/reviews', title: "Sharhlar", permissions: ['reviews.list'] },
      ]
    },
    {
      title: "Katalog",
      icon: <PaletteIcon className={ic("!text-violet-500")} />,
      children: [
        { path: '/products', title: "Mahsulotlar", permissions: ['products.list'] },
        { path: '/categories', title: "Kategoriyalar", permissions: ['categories.list'] },
        { path: '/colors', title: "Ranglar", permissions: ['colors.list'] },
        { path: '/sizes', title: "Razmerlar", permissions: ['sizes.list'] },
        { path: '/cliparts', title: "Tayyor logolar", permissions: ['cliparts.list'] },
        { path: '/phrases', title: "Trend so'zlar", permissions: ['phrases.list'] },
        { path: '/garment-models', title: "3D modellar", permissions: ['garment-models.list'] },
      ]
    },
    {
      title: "Ombor",
      icon: <BoxIcon className={ic("!text-orange-500")} />,
      children: [
        { path: '/inventory/batches', title: "Kelgan partiyalar", permissions: ['inventory-batches.list'] },
        { path: '/inventory/stock', title: "Qoldiqlar", permissions: ['inventory.list'] },
      ]
    },
    {
      title: "Sayt",
      icon: <GlobalIcon className={ic("!text-cyan-500")} />,
      children: [
        { path: '/cms/banners', title: "Bannerlar", permissions: ['banners.list'] },
        { path: '/cms/pages', title: "Sahifalar", permissions: ['pages.list'] },
        { path: '/cms/contacts', title: "Aloqa ma'lumotlari", permissions: ['settings.update'] },
      ]
    },
    { path: '/users', title: "Foydalanuvchilar", icon: <UsersGroupTwoRoundedIcon className={ic("!text-blue-500")} />, permissions: ['users.list'] },
    { path: '/settings', title: "Sozlamalar", icon: <SettingsIcon className={ic("!text-gray-500")} />, permissions: ['settings.list'] },
  ];

  const routes: any[] = [
    { path: "/", element: <Dashboard />, permissions: ['dashboard.view'] },
    ...settingsRoutes,

    { path: "/orders", element: <Orders />, permissions: ['orders.list'] },
    { path: "/orders/view/:id", element: <OrderView />, permissions: ['orders.view'] },
    { path: "/designs", element: <Designs />, permissions: ['designs.list'] },
    { path: "/ready-products", element: <ReadyProducts />, permissions: ['ready-products.list'] },
    { path: "/reviews", element: <Reviews />, permissions: ['reviews.list'] },
    { path: "/designs/view/:id", element: <DesignView />, permissions: ['designs.view'] },

    { path: "/products", element: <Products />, permissions: ['products.list'] },
    { path: "/products/create", element: <ProductForm />, permissions: ['products.create'] },
    { path: "/products/update/:id", element: <ProductForm />, permissions: ['products.update'] },
    { path: "/products/view/:id", element: <ProductView />, permissions: ['products.view'] },
    { path: "/categories", element: <Categories />, permissions: ['categories.list'] },
    { path: "/colors", element: <Colors />, permissions: ['colors.list'] },
    { path: "/sizes", element: <Sizes />, permissions: ['sizes.list'] },
    { path: "/cliparts", element: <Cliparts />, permissions: ['cliparts.list'] },
    { path: "/phrases", element: <Phrases />, permissions: ['phrases.list'] },
    { path: "/garment-models", element: <GarmentModels />, permissions: ['garment-models.list'] },
    { path: "/cms/banners", element: <Banners />, permissions: ['banners.list'] },
    { path: "/cms/pages", element: <CmsPages />, permissions: ['pages.list'] },
    { path: "/cms/contacts", element: <Contacts />, permissions: ['settings.update'] },

    { path: "/inventory/batches", element: <Batches />, permissions: ['inventory-batches.list'] },
    { path: "/inventory/batches/create", element: <BatchForm />, permissions: ['inventory-batches.create'] },
    { path: "/inventory/batches/update/:id", element: <BatchForm />, permissions: ['inventory-batches.update'] },
    { path: "/inventory/batches/view/:id", element: <BatchView />, permissions: ['inventory-batches.view'] },
    { path: "/inventory/stock", element: <Stock />, permissions: ['inventory.list'] },

    { path: "/users", element: <Users />, permissions: ['users.list'] },
    { path: "/users/view/:id", element: <UserView />, permissions: ['users.view'] },
    { path: "/users/create", element: <UsersForm />, permissions: ['users.create'] },
    { path: "/users/update/:id", element: <UsersForm />, permissions: ['users.update'] },
    { path: "/settings", element: <Settings />, permissions: ['settings.list'] },
    { path: "/profile", element: <ProfilePage /> },
  ];

  return { routes, sidebarRoutes };
};

const RouteProvider: React.FC = () => {
  const { user, getMeLoading } = useStore();
  const { routes } = useRoutes();
  const { permissions } = useAccess();

  const hasToken = Boolean(storage.get("token"));
  const isUserLoaded = Boolean(get(user, "data.id"));
  const isBooting = getMeLoading || (hasToken && !isUserLoaded);

  const filteredRoutes = helpers.filterRoutesByPermissions(routes, permissions);

  if (isBooting) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin spinning size="large" />
      </div>
    );
  }

  if (!hasToken) {
    return (
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        {filteredRoutes.map((route: any, index: number) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/login" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default RouteProvider;
