import { Segmented, SegmentedProps } from "antd";
import useHooks from "../../hooks/useHooks.tsx";

function Index(props: SegmentedProps) {
  const { query, navigate, qs, get } = useHooks();
  const urlValue = get(query, props.name || "tab");
  return (
    <Segmented
      {...props}
      value={urlValue !== undefined ? urlValue : props.defaultValue}
      onChange={value => {
        navigate({
          search: qs.stringify({
            ...query,
            [props.name || "tab"]: value
          })
        });
      }}
    />
  );
}

export default Index;
