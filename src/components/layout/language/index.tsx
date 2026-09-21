import { useStore } from "../../../services/index.ts";
import { Popover } from "antd";
import config from "../../../../config.ts";

const Language = ({ openLanguage, setOpenLanguage }: any) => {
  const { language, setLanguage } = useStore(state => state);

  const currentLang = config.API_LANGUAGES.find((l: any) => l.code === language)

  return (
    <Popover
      classNames={{
        body: "!p-1"
      }}
      open={openLanguage}
      onOpenChange={() => setOpenLanguage(false)}
      content={
        <div>
          {config.API_LANGUAGES.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className={`flex items-center gap-2 cursor-pointer py-1 px-2 transition-all rounded-lg   ${language === item.code
                  ? "bg-[#1668dc] text-white"
                  : "hover:text-[#1668dc]"
                  }`}
                onClick={() => {
                  setLanguage(item.code);
                  setOpenLanguage(false);
                }}
              >
                <img className={"w-4 h-4"} src={item.icon} alt={item.name} />
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
      }
      trigger={"click"}
    >
      <div
        className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={() => setOpenLanguage(true)}
      >
        {currentLang ? (
          <img className="w-5 h-5 rounded-sm" src={currentLang.icon} alt={currentLang.name} />
        ) : (
          <span className="text-xs font-bold uppercase">{language}</span>
        )}
      </div>
    </Popover>
  );
};

export default Language;
