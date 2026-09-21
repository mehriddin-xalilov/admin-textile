import { Fields } from "../../../components";
import useHooks from "../../../hooks/useHooks";
import Dictionary from "../../../modules/dictionary";

const Sizes = () => {
  const { t } = useHooks();
  return (
    <Dictionary
      resource="sizes"
      title={t("Razmerlar")}
      translatable={false}
      fields={[{ name: "name", label: t("Razmer"), required: true, component: Fields.Input, props: { antdProps: { placeholder: "XL" } } }]}
      columns={[{ title: t("Razmer"), dataIndex: "name" }]}
    />
  );
};

export default Sizes;
