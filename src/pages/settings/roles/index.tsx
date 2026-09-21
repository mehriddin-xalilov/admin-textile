
import config from "../../../../config.ts";
import { Pagination, Panel, Table } from "../../../components";
import useHooks from "../../../hooks/useHooks.tsx";
import Get from "../../../modules/get.tsx";

function Index() {
  const { t, get, query, navigate } = useHooks();


  return (

    <Get
      name={"roles"}
      url={"/roles"}
      params={{
        page: get(query, "page", 1),
        limit: get(query, "limit", 50)
      }}
    >
      {({ items, isLoading, meta }) => {
        return (
          <Panel meta={meta} onClick={() => {
            navigate(`/settings/roles/create`);
          }} title="Rollar">
            <>
              <Table
                url={"/roles"}
                items={items}
                name={"roles"}
                isLoading={isLoading}
                size={"small"}

                onRow={(record) => {
                  return {
                    onClick: () => {
                      navigate(`/settings/roles/update/${get(record, 'id')}`)
                    },
                    className: "cursor-pointer"
                  }
                }}

                columns={[
                  {
                    title: t("ID"),
                    dataIndex: "id",
                    key: "id"
                  },
                  ...config.API_LANGUAGES.map((item) => ({
                    title: t(`Nomi ({{code}})`, { code: item.shortName }),
                    dataIndex: `name_${item.code}`
                  })),
                  {
                    type: "switch",
                    title: t("Holati"),
                    dataIndex: "status"
                  }
                ]}
              />
              <Pagination meta={meta} rootClassName={"!mt-4"} align={"end"} />
            </>
          </Panel>
        );
      }}
    </Get>
  );
}

export default Index;
