// withFormInput.tsx
import React, { useState } from "react";
import { FieldProps, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { Tooltip, Typography } from "antd";
import { helpers } from "../../../services";
import Button from "../../button";
import { LanguageIcon } from "../../../assets/icon/components/solar-line-duotone-icons";
import notification from "../../notification";
import { InfoCircleIcon } from "../../../assets/icon/components/solar-bold-duotone-icons";

// Interface for common props to be injected by the HOC
interface WithFormInputProps extends FieldProps {
  label?: string;
  required?: boolean;
  className?: string;
  [key: string]: any; // Allow additional props
}

// HTML entity decode qilish
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    "&quot;": '"',
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&apos;": "'",
    "&#39;": "'",
    "&nbsp;": " ",
    "&#10;": ""
  };
  let result = text;
  for (const [entity, char] of Object.entries(entities)) {
    result = result.split(entity).join(char);
  }
  return result;
}

async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  try {
    // MyMemory API - bepul va CORS muammosiz
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=uz|${targetLang}`
    );
    const data = await response.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return decodeHtmlEntities(data.responseData.translatedText);
    }
    return text;
  } catch {
    console.error("Translation error");
    return text;
  }
}

function TranslateButton({ fieldName }: { fieldName: string }) {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<any>();
  const [loading, setLoading] = useState(false);

  // Field name dan prefix olish: "name_uz" -> "name_", "title_uz" -> "title_"
  const getPrefix = (name: string) => {
    const match = name.match(/^(.+_)(uz|ru|en)$/);
    return match ? match[1] : "";
  };

  const handleTranslate = async () => {
    const prefix = getPrefix(fieldName);
    if (!prefix) return;

    const sourceText = values[fieldName];
    if (!sourceText) {
      notification({
        type: "warning",
        message: t("Iltimos, avval O'zbek (lotin) tilida matn kiriting")
      });
      return;
    }

    setLoading(true);
    try {

      // Rus tiliga tarjima
      const ruText = await translateText(sourceText, "ru");
      setFieldValue(`${prefix}ru`, ruText);

      // Ingliz tiliga tarjima
      const enText = await translateText(sourceText, "en");
      setFieldValue(`${prefix}en`, enText);
    } catch {
      notification({
        type: "error",
        message: t("Tarjima qilishda xatolik yuz berdi")
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      htmlType="button"
      color={"default"}
      variant={"filled"}
      loading={loading}
      onClick={handleTranslate}
      className="mb-1 !h-7"
    >
      <LanguageIcon className={"!text-blue-500 !h-5"} />
    </Button>
  );
}


// HOC to wrap input components
const withFormInput = <P extends object>(Component: React.ComponentType<P>) => {
  const WrappedComponent: React.FC<P & WithFormInputProps> = props => {
    const {
      field: { name },
      form: { errors, touched, values },
      label,
      translate = false,
      required = false, // yulduzcha faqat aniq so'ralganda (yolg'on 'majburiy' bo'lmasin)
      className = "",
      info = '',
      ...rest
    } = props;
    const { t } = useTranslation();
    const errorValue = helpers.getNestedValue(errors, name);
    const touchedError = helpers.getNestedValue(touched, name);
    // translate={true} faqat _uz bilan tugagan fieldlar uchun ishlaydi
    const showTranslate = translate && name.endsWith("_uz");

    return (
      <div className={`w-full ${className} relative`}>
        {label ? (
          <div className={"flex justify-between gap-2"}>
            <Typography.Text>
              {t(label)}
              {required && <span className="text-red-500 font-bold">*</span>}
            </Typography.Text>
            {showTranslate && values[name] !== "" ? (
              <TranslateButton fieldName={name} />
            ) : null}
            {info ? (
              <Tooltip
                title={info}
                placement="top"
              >
                <InfoCircleIcon className="!text-blue-500 cursor-pointer" />
              </Tooltip>
            ) : null}
          </div>
        ) : null}

        <Component {...(rest as P)} field={props.field} form={props.form} label={label} />
        {errorValue && touchedError && (
          <Tooltip
            placement={"bottomLeft"}
            rootClassName={"!max-w-fit"}
            visible={errorValue instanceof Array && errorValue.length > 1}
            title={
              <>
                {errorValue instanceof Array && errorValue.length
                  ? errorValue.map((item: any, index: number) => (
                    <p
                      className={
                        "leading-3 !mb-1.5 last:!mb-0 !font-light text-xs "
                      }
                    >
                      {index + 1}. {t(item)}
                    </p>
                  ))
                  : t(errorValue)}
              </>
            }
            color={"red"}
          >
            <Typography.Text
              strong
              className="!text-xs absolute bottom-[-14px] line-clamp-1"
              type="danger"
            >
              {t(
                errorValue instanceof Array ? errorValue.join(", ") : errorValue
              )}
            </Typography.Text>
          </Tooltip>
        )}
      </div>
    );
  };

  // Set display name for debugging
  WrappedComponent.displayName = `WithFormInput(${Component.displayName ||
    Component.name ||
    "Component"})`;

  return WrappedComponent;
};

// Export all components wrapped with the HOC
export default withFormInput;
