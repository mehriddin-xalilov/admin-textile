import RouteProvider from "./routes/index.tsx";
import AntdProvider from "./providers/antd/index.tsx";
import { BrowserRouter } from "react-router-dom";
import I18Provider from "./providers/i18n/index.tsx";

import { IconProvider } from "./assets/icon/components/IconContext.tsx";
import ApiProvider from "./providers/api/index.tsx";
import ReactQueryProvider from "./providers/react-query/index.tsx";

function App() {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <I18Provider>
          <AntdProvider>
            <ApiProvider />

            <IconProvider
              className={"text-[#1C274C] dark:text-white w-6  h-6 "}
            >
              <RouteProvider />
              {/* <div className="fixed top-0 right-0 z-50 bg-pink-500 text-white shadow-md px-2 rounded-bl font-mono">
                <span className="sm:hidden">default</span>
                <span className="hidden sm:inline md:hidden">sm</span>
                <span className="hidden md:inline lg:hidden">md</span>
                <span className="hidden lg:inline xl:hidden">lg</span>
                <span className="hidden xl:inline 2xl:hidden">xl</span>
                <span className="hidden 2xl:inline 3xl:hidden">2xl</span>
                <span className="hidden 3xl:inline 4xl:hidden">3xl</span>
                <span className="hidden 4xl:inline 5xl:hidden">4xl</span>
                <span className="hidden 5xl:inline 6xl:hidden">5xl</span>
                <span className="hidden 6xl:inline 7xl:hidden">6xl</span>
              </div> */}
            </IconProvider>
          </AntdProvider>
        </I18Provider>
      </BrowserRouter>
    </ReactQueryProvider>
  );
}

export default App;
