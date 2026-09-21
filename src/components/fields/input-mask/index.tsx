import { forwardRef } from "react";
import ReactInputMask from "react-input-mask";
import { helpers } from "../../../services";
import "./index.css";

const InputMask = forwardRef<HTMLInputElement>((props: any, ref) => {
  const {
    form: { setFieldValue, setFieldTouched, errors, touched },
    field: { name, value },
    mask = "",
    size = "",
    onChange = () => { },
    onBlur = () => { },
    inputClassName,
    antdProps
  } = props;
  const errorValue = helpers.getNestedValue(errors, name);
  const touchedError = helpers.getNestedValue(touched, name);
  const formatChars = {
    "#": "[0-9]",
    A: "[A-Za-z]",
    "*": "[A-Za-z0-9]"
  };
  return (
    <div className={"w-full"}>
      <ReactInputMask
        alwaysShowMask={false}
        value={value}
        formatChars={formatChars}
        maskChar={"_"}
        onBlur={e => {
          setFieldTouched(name, true);
          const numericValue = e.target.value.replace(/\D/g, "");
          onBlur(numericValue);
        }}
        status={errorValue && touchedError ? "error" : ""}
        onChange={(e: any) => {
          const numericValue = e.target.value.replace(/\D/g, "");
          setFieldTouched(name, true);
          setFieldValue(name, numericValue);
          onChange(numericValue);
        }}
        size={"large"}
        {...props}
      >
        {inputProps => (
          <input
            {...inputProps}
            disabled={props.disabled}
            //@ts-ignore
            placeholder={String(mask || "").replaceAll("#", 0)}
            name={name}
            ref={ref}
            className={`textile-mask-input textile-mask-input-outlined ${size} ${inputClassName} ${errorValue &&
              touchedError &&
              !String(value).replace(/\D/g, "").length
              ? "textile-mask-input-status-error"
              : ""
              }`}
          />
        )}
      </ReactInputMask>
      {/*{errorValue && touchedError ? (*/}
      {/*  <Typography.Text strong className={"!text-xs"} type="danger">*/}
      {/*    {errorValue}*/}
      {/*  </Typography.Text>*/}
      {/*) : null}*/}
    </div>
  );
});

InputMask.displayName = "InputMask";

export default InputMask;
