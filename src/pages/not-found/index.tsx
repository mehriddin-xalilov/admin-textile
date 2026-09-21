import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../services";
import { Home2Icon, AltArrowLeftIcon } from "../../assets/icon/components/solar-bold-duotone-icons";

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { primaryColor } = useStore();

  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 dark:bg-[#0f1117] px-4 rounded-2xl">
      <div className="w-full max-w-2xl flex flex-col items-center text-center gap-8">

        {/* 404 big number */}
        <div className="relative select-none">
          <span
            className="text-[160px] sm:text-[200px] font-black leading-none tracking-tighter"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}22 0%, ${primaryColor}66 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </span>

          {/* floating dot decorations */}
          <span
            className="absolute top-8 right-0 w-5 h-5 rounded-full opacity-40 animate-bounce"
            style={{ background: primaryColor, animationDelay: "0ms" }}
          />
          <span
            className="absolute bottom-8 left-4 w-3 h-3 rounded-full opacity-30 animate-bounce"
            style={{ background: primaryColor, animationDelay: "300ms" }}
          />
          <span
            className="absolute top-1/2 left-0 w-2 h-2 rounded-full opacity-20 animate-bounce"
            style={{ background: primaryColor, animationDelay: "600ms" }}
          />
        </div>

        {/* divider line */}
        <div
          className="w-16 h-1 rounded-full"
          style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}44)` }}
        />

        {/* text block */}
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            {t("Sahifa topilmadi")}
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            {t("Kechirasiz, siz izlayotgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin.")}
          </p>
        </div>

        {/* action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm font-medium"
          >
            <AltArrowLeftIcon width={18} height={18} />
            {t("Orqaga qaytish")}
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg transition-all hover:opacity-90 active:scale-95"
            style={{
              background: primaryColor,
              boxShadow: `0 8px 24px ${primaryColor}44`,
            }}
          >
            <Home2Icon width={18} height={18} />
            {t("Bosh sahifaga")}
          </button>
        </div>



      </div>
    </div>
  );
};

export default NotFound;
