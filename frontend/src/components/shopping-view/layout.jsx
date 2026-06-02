import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

import ShoppingFooter from "./footer";

function ShoppingLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full flex-grow relative z-10">
        <Outlet />
      </main>
      <ShoppingFooter />
    </div>
  );
}

export default ShoppingLayout;
