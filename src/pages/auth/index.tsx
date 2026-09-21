import LogoLight from "../../assets/images/logo-light.svg";
import LogoDark from "../../assets/images/logo-dark.svg";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Fields, notification } from "../../components/index.tsx";
import Form from "../../modules/form.tsx";
import { Field } from "formik";
import { useStore } from "../../services/index.ts";
import { get } from "lodash";
import { Checkbox } from "antd";

type LoginType = "phone" | "email";

const INPUT_CLASS =
  "h-14 sm:h-16 text-[16px] rounded-xl bg-gray-50 dark:bg-[#1f1f1f] border-gray-200 dark:border-gray-800 hover:border-blue-500 focus:border-blue-500 transition-colors shadow-sm";

// ─── LoginTypeToggle ──────────────────────────────────────────────────────────

const LoginTypeToggle: React.FC<{
  loginType: LoginType;
  onSwitch: (type: LoginType) => void;
}> = ({ loginType, onSwitch }) => {
  const { t } = useTranslation();
  return (
    <div className="flex bg-gray-100 dark:bg-[#1a1a2e] rounded-xl p-1 border border-gray-200 dark:border-white/10">
      {(["phone", "email"] as LoginType[]).map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onSwitch(type)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            loginType === type
              ? "bg-white dark:bg-[#1f1f3a] text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-blue-500/30"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          {type === "phone" ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {t("Telefon")}
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {t("Email")}
            </>
          )}
        </button>
      ))}
    </div>
  );
};

// ─── LoginField ───────────────────────────────────────────────────────────────

const LoginField: React.FC<{ loginType: LoginType }> = ({ loginType }) => {
  const { t } = useTranslation();
  if (loginType === "phone") {
    return (
      <Field
        component={Fields.InputMask}
        size="large"
        mask="+998 ## ### ## ##"
        name="login"
        label={t("Telefon raqam")}
        antdProps={{ className: INPUT_CLASS, placeholder: "+998 90 123 45 67" }}
      />
    );
  }
  return (
    <Field
      component={Fields.Input}
      size="large"
      name="login"
      label={t("Email manzil")}
      antdProps={{ className: INPUT_CLASS, placeholder: "example@email.com", type: "email" }}
    />
  );
};

// ─── LoginForm ────────────────────────────────────────────────────────────────

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = useStore();
  const [loginType, setLoginType] = useState<LoginType>("phone");

  return (
    <Form
      url="/auth/login"
      method="post"
      name="login"
      fields={[
        { 
          name: "login", 
          required: true,
          onSubmitValue: (val) => loginType === "phone" && val ? val.replace(/\s+/g, "") : val
        },
        { name: "password", required: true },
      ]}
      onSuccess={(data) => {
        notification({ type: "success", message: t("Muvaffaqiyatli xush kelibsiz!") });
        setUser({
          data: get(data, "data.data.user"),
          token: get(data, "data.data.token"),
          refreshToken: get(data, "data.data.refresh_token"),
          isAuth: true,
        });
        navigate("/");
      }}
    >
      {({ isLoading, setFieldValue }) => (
        <div className="flex flex-col gap-5">
          <LoginTypeToggle
            loginType={loginType}
            onSwitch={(type) => {
              setLoginType(type);
              setFieldValue("login", "");
            }}
          />

          <LoginField loginType={loginType} />

          <Field
            component={Fields.Password}
            size="large"
            name="password"
            label={t("Parol")}
            antdProps={{ className: INPUT_CLASS, placeholder: "••••••••" }}
          />

          <div className="flex items-center justify-between -mt-2">
            <Checkbox className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("Eslab qolish")}
            </Checkbox>
            <a
              href="#"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors hover:underline"
            >
              {t("Parolni unutdingizmi?")}
            </a>
          </div>

          <Button
            className="!h-14 sm:!h-16 !rounded-xl !text-base !font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5"
            type="primary"
            htmlType="submit"
            loading={isLoading}
          >
            {t("Tizimga kirish")}
          </Button>
        </div>
      )}
    </Form>
  );
};

// ─── AuthPage ─────────────────────────────────────────────────────────────────

const AuthPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#0f111a] flex items-center justify-center font-sans">

      {/* Animated background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/30 blur-[120px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/20 blur-[150px] animate-pulse" style={{ animationDuration: "10s", animationDelay: "2s" }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-600/20 blur-[100px] animate-pulse" style={{ animationDuration: "7s", animationDelay: "4s" }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-[1060px] bg-white/5 dark:bg-[#15151540] backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/10 dark:border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex flex-col lg:flex-row">

          {/* ── Left branding panel ──────────────────────────────────── */}
          <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-r border-white/5">
            <div className="absolute inset-0 z-0">
              <div className="w-full h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent opacity-80" />
            </div>

            {/* Logo */}
            <div className="relative z-10">
              <img src={LogoLight} alt="Textile" className="h-10 object-contain" onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = "none";
                const fallback = el.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }} />
              <div className="hidden items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="text-white font-bold text-lg">TX</span>
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">LOGO</span>
              </div>
            </div>

            {/* Stats */}
            <div className="relative z-10 flex gap-8 my-8">
              {[
                { value: "100%", label: t("Sifatli mato") },
                { value: "CN · TR", label: t("Import") },
                { value: "24h", label: t("Ishlab chiqarish") },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
                {t("Logosiz kiyim,")}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  {t("sizning logotipingiz")}
                </span>
              </h2>
              <p className="text-gray-300 text-base max-w-md font-light leading-relaxed">
                {t("Buyurtmalar, ombor va ishlab chiqarishni bitta joydan boshqaring.")}
              </p>
            </div>
          </div>

          {/* ── Right form panel ─────────────────────────────────────── */}
          <div className="w-full lg:w-[48%] bg-white dark:bg-[#15151580] overflow-y-auto">
            <div className="p-8 sm:p-10 lg:p-12">

              {/* Logo */}
              <div className="flex justify-center lg:justify-start mb-7">
                <img
                  src={LogoDark}
                  alt="Textile"
                  className="h-9 object-contain dark:hidden"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
                <img
                  src={LogoLight}
                  alt="Textile"
                  className="h-9 object-contain hidden dark:block"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              </div>

              {/* Heading */}
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {t("Xush kelibsiz!")}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5">
                  {t("Tizimga kirish uchun ma'lumotlaringizni kiriting")}
                </p>
              </div>

              <LoginForm />

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
