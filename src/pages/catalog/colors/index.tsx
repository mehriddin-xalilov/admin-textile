import { Fields } from "../../../components";
import useHooks from "../../../hooks/useHooks";
import Dictionary from "../../../modules/dictionary";

const Colors = () => {
  const { t } = useHooks();
  return (
    <Dictionary
      resource="colors"
      title={t("Ranglar")}
      fields={[{ name: "hex", label: t("Rang (HEX)"), required: true, component: Fields.Input, props: { antdProps: { placeholder: "#FFFFFF" } } }]}
      columns={[{ title: t("Rang"), dataIndex: "hex", width: 110, render: (v: string) => <span className="inline-flex items-center gap-2"><span className="w-5 h-5 rounded-full border border-gray-300 inline-block" style={{ background: v }} />{v}</span> }]}
    />
  );
};

export default Colors;
