

import { get } from "lodash";
import { useMemo, useRef, useEffect, useState } from "react";
import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";
import { api, helpers, queryBuilder, useStore } from "../../../services";
import { GroupBase, StylesConfig, components } from "react-select";
import { FieldProps } from "formik";
import { useTranslation } from "react-i18next";
import { Drawer } from "antd";
import Button from "../../button";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { CloseCircleIcon } from "../../../assets/icon/components/solar-bold-duotone-icons";

interface AsyncSelectProps<T> extends FieldProps {
  url: string;
  loadOptionsParams: any;
  loadOptionsKey?: string | ((data: any) => T[]);
  onChange?: (value: T | null) => void;
  extraOptions?: T[];
  isSearchable?: boolean;
  closeMenuOnSelect?: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
  disabled?: boolean;
  noOptionsMessage?: any
  placeholder?: string;
  optionLabel: keyof T | ((option: T) => string);
  optionValue: keyof T | ((option: T) => string);
  label?: string;
  className?: string;
  options?: T[];
  isMulti?: boolean;
  menuPlacement?: "auto" | "bottom" | "top";
  onAdd?: () => void;
  addLabel?: string;
}

const AsyncSelect = <T extends Record<string, any>>({
  url,
  loadOptionsParams = () => { },
  loadOptionsKey = "data",
  onChange = () => { },
  extraOptions = [],
  isSearchable = true,
  isClearable = true,
  closeMenuOnSelect = true,
  placeholder = "Tanlang...",
  disabled = false,
  optionLabel,
  optionValue,
  noOptionsMessage = () => "Hech nima topilmadi",
  label,
  className = "",
  options = [],
  isMulti = false,
  menuPlacement,
  field: { name, value },
  form: { errors, setFieldValue, setFieldTouched, touched },
  onAdd,
  addLabel = "+ Qo'shish"
}: AsyncSelectProps<T>) => {
  const { theme } = useStore();
  const { t } = useTranslation();
  const { isMobile, isTablet } = useWindowSize();
  const isSmallScreen = isMobile || isTablet;
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);

  const loadOptionsParamsRef = useRef(loadOptionsParams);
  const loadOptionsKeyRef = useRef(loadOptionsKey);
  const extraOptionsRef = useRef(extraOptions);
  const errorValue = helpers.getNestedValue(errors, name);
  const touchedError = helpers.getNestedValue(touched, name);
  useEffect(() => {
    loadOptionsParamsRef.current = loadOptionsParams;
    loadOptionsKeyRef.current = loadOptionsKey;
    extraOptionsRef.current = extraOptions;
  }, [loadOptionsParams, loadOptionsKey, extraOptions]);

  const loadOptions: LoadOptions<T, any, any> = useMemo(
    () => async (searchQuery, _, { page }) => {
      const { data } = await api.get(
        queryBuilder(url, {
          page,
          ...loadOptionsParamsRef.current(searchQuery)
        })
      );

      const paramsKey = loadOptionsKeyRef.current;
      const extra = extraOptionsRef.current;
        console.log(data)
      const newOptions: T[] =
        typeof paramsKey === "function"
          ? [...extra, ...paramsKey(data)]
          : [...extra, ...get(data, paramsKey, [])];

      return {
        options: newOptions,
        hasMore:
          get(data, "current_page", 1) <
          get(data, "last_page", 1),
        additional: {
          page: get(data, "current_page", 1) + 1
        }
      };
    },
    [url]
  );

  const customStyles: StylesConfig<T, boolean, GroupBase<T>> = {
    container: base => ({
      ...base,
      width: "100%"
    }),

    control: (base, { isFocused }) => ({
      ...base,
      height: isMulti ? 'auto' : "40px",
      minHeight: "100%",
      minWidth: 100,
      borderWidth: 1,
      borderStyle: "solid",
      borderRadius: 8,
      backgroundColor: disabled
        ? theme === "light" ? "#0000000a" : "#ffffff0a"
        : theme === "light" ? "#fff" : "#151515",
      borderColor:
        touchedError && errorValue
          ? "red"
          : isFocused
            ? "#1e50e7"
            : theme === "light"
              ? "#d9d9d9"
              : "#303030",
      boxShadow:
        touchedError && errorValue
          ? "none"
          : isFocused
            ? "0 0 0 2px rgba(5, 145, 255, 0.1)"
            : "none",
      "&:hover": {
        borderColor: "#1668dc"
      }
    }),
    placeholder: base => ({
      ...base,
      color: "#ccc",
      fontWeight: 400,
      fontFamily: "GT Walsheim Pro !important",
      fontSize: 16,
      overflow: "hidden",
      display: "-webkit-box",
      "-webkit-box-orient": "vertical",
      "-webkit-line-clamp": "1"
    }),
    singleValue: base => ({
      ...base,
      fontWeight: 400,
      color: theme === "light" ? "#000000" : "#ffffff"
    }),
    input: base => ({
      ...base,
      color: theme === "light" ? "#000000" : "#ffffff"
    }),
    option: (base, { isSelected }) => ({
      ...base,
      fontWeight: 400,
      color:
        theme === "light" && isSelected
          ? "#ffffff"
          : theme === "light"
            ? "#000000"
            : "#ffffff",
      backgroundColor: isSelected ? "rgb(32,107,255)" : "transparent",
      borderRadius: 4,
      "&:hover": {
        backgroundColor: isSelected
          ? "rgb(32,107,255)"
          : theme === "light"
            ? "rgb(215,230,255)"
            : "#181818"
      }
    }),
    menu: base => ({
      ...base,
      padding: 4,
      zIndex: 10000,
      overflow: "hidden",
      backgroundColor: theme === "light" ? "#ffffff" : "#373737",
      "@media(min-width: 768px)": {
        display: "-webkit-box",
        "-webkit-box-orient": "vertical",
        "-webkit-line-clamp": "1"
      }
    }),

    menuList: base => ({
      ...base,
      overflowY: "scroll",
      borderRadius: 4,
      "::-webkit-scrollbar": {
        display: "none"
      }
    }),
    menuPortal: base => ({
      ...base,
      zIndex: 9999
    }),
    multiValue: base => ({
      ...base,
      backgroundColor:
        theme === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(255,255,255,0.12)",
      height: 30,
      display: "flex",
      alignItems: "center",
      borderRadius: 4,
      color: theme === "light" ? "#000000 !important" : "#ffffff !important",
      svg: {
        width: 16,
        height: 16,
        fontWeight: 100,
        color: theme === "light" ? "#000000" : "#ffffff"
      },
      "*": {
        fontSize: 14,
        color: theme === "light" ? "#000000 !important" : "#ffffff !important",
      }
    })
  };

  const CustomMenu = (props: any) => {
    return (
      <components.Menu {...props}>
        {props.children}

        {onAdd && (
          <Button
            type="link"
            htmlType="button"
            className="mx-auto w-full"
            variant="filled"
            color="blue"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAdd(); // 🔥 tashqaridagi request shu yerda ishlaydi
              if (isSmallScreen) {
                setOpenMobileDrawer(false);
              }
            }}
          >
            {t(addLabel)}
          </Button>
        )}
      </components.Menu>
    );
  };

  const mobileStyles: StylesConfig<T, boolean, GroupBase<T>> = {
    ...customStyles,
    menu: base => ({
      ...base,
      position: "relative",
      boxShadow: "none",
      border: "none",
      backgroundColor: "transparent",
      height: 'auto !important',
      padding: 0,
      marginTop: 8
    }),
    menuList: base => ({
      ...base,
      overflowY: "auto",
      paddingBottom: 20,
      maxHeight: 'calc(100vh - 200px) !important'
    }),

    control: (base, state) => ({
      backgroundColor: theme === "light" ? "#f5f5f5" : "#151515",
      ...customStyles.control!(base, state),
    }),

  };

  return (
    <div className={`w-full ${className}`}>
      {isSmallScreen ? (
        <>
          <div
            onClick={() => { if (!disabled) setOpenMobileDrawer(true); setFieldTouched(name, true); }}
            className={`flex items-center justify-between w-full min-h-[40px] px-3 border border-solid rounded-lg transition-all ${disabled ? 'bg-[#0000000a] dark:bg-[#ffffff0a] text-[#ccc]' : 'bg-white dark:bg-[#151515] hover:border-blue-500 cursor-pointer text-gray-800 dark:text-gray-200'} ${touchedError && errorValue ? 'border-red-500' : 'border-[#d9d9d9] dark:border-[#303030]'}`}
          >
            <span className={`text-[15px] truncate max-w-[90%] ${!value && 'text-gray-400 font-normal'}`}>
              {value
                ? (isMulti ? value.length + " " + t("ta tanlandi") : (typeof optionLabel === "function" ? optionLabel(value) : value[optionLabel as string]))
                : t(placeholder)}
            </span>
            <div className={`w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-gray-400 ${disabled && 'opacity-50'}`} />
          </div>

          <Drawer
            title={label ? t(label) : t("Tanlang...")}
            placement="bottom"
            height="95vh"
            open={openMobileDrawer}
            rootClassName="[&_.textile-drawer-content-wrapper]:!overflow-hidden [&_.textile-drawer-content-wrapper]:!m-1 [&_.textile-drawer-content-wrapper]:!rounded-xl"

            onClose={() => setOpenMobileDrawer(false)}
            closeIcon={<CloseCircleIcon width={24} height={24} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />}
            className="dark:bg-[#151515] dark:text-gray-200"
            styles={{ body: { padding: '16px 12px', overflow: 'hidden' } }}
          >
            <AsyncPaginate
              name={name}
              value={value}
              components={{ Menu: CustomMenu }}
              loadOptions={loadOptions}
              debounceTimeout={300}
              styles={mobileStyles}
              getOptionLabel={(option: any) =>
                typeof optionLabel === "function"
                  ? optionLabel(option)
                  : (option[optionLabel] as string)
              }
              getOptionValue={(option: any) =>
                typeof optionValue === "function"
                  ? optionValue(option)
                  : (option[optionValue] as string)
              }
              onChange={(option: any) => {
                setFieldValue(name, option);
                onChange(option);
                if (!option || (isMulti && !option.length)) {
                  setFieldValue(name, "");
                }
                if (!isMulti) {
                  setOpenMobileDrawer(false);
                }
              }}

              noOptionsMessage={noOptionsMessage}
              isSearchable={isSearchable}
              menuIsOpen={true}
              autoFocus={true}
              closeMenuOnSelect={closeMenuOnSelect}
              isClearable={isClearable}
              isDisabled={disabled}
              placeholder={t("Qidirish...")}
              additional={{ page: 1 }}
              isMulti={isMulti}
              options={options}
              menuPlacement="auto"
            />
          </Drawer>
        </>
      ) : (
        <AsyncPaginate
          name={name}
          value={value}
          components={{ Menu: CustomMenu }}
          loadOptions={loadOptions}
          debounceTimeout={100}
          onMenuOpen={() => {
          }}
          styles={customStyles}
          onBlur={() => setFieldTouched(name, true)}
          getOptionLabel={(option: any) =>
            typeof optionLabel === "function"
              ? optionLabel(option)
              : (option[optionLabel] as string)
          }
          getOptionValue={(option: any) =>
            typeof optionValue === "function"
              ? optionValue(option)
              : (option[optionValue] as string)
          }
          onChange={(option: any) => {
            setFieldValue(name, option);
            onChange(option);
            if (!option || (isMulti && !option.length)) {
              setFieldTouched(name, true);
              setFieldValue(name, "");
            }
          }}
          noOptionsMessage={noOptionsMessage}
          isSearchable={isSearchable}
          closeMenuOnSelect={closeMenuOnSelect}
          isClearable={isClearable}
          isDisabled={disabled}
          placeholder={t(placeholder)}
          additional={{ page: 1 }}
          isMulti={isMulti}
          options={options}
          menuPlacement={menuPlacement}
        />
      )}
    </div>
  );
};

export default AsyncSelect;

