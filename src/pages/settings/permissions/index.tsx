
import React from "react";
import config from "../../../../config.ts";
import { Pagination, Panel, Table } from "../../../components";
import useHooks from "../../../hooks/useHooks.tsx";
import Get from "../../../modules/get.tsx";
import ModalData from "./form.tsx";

function Index() {
  const { t, get, query } = useHooks();

  const [modalData, setModalData] = React.useState({
    isOpen: false,
    data: null
  });

  return (


    <>
      <Get
        name={"permissions"}
        url={"permissions"}
        params={{
          page: get(query, "page", 1),
          limit: get(query, "limit", 50)
        }}
      >
        {({ items, isLoading, meta }) => {
          return (
            <>
              <Panel
                onClick={() =>
                  setModalData({
                    isOpen: true,
                    data: null
                  })
                }
                title={t("Ruxsatlar")}
                meta={meta}
              >
                <Table
                  url={"permissions"}
                  items={items}
                  name={"permissions"}
                  isLoading={isLoading}
                  size={"small"}
                  editAction={(item) => {
                    setModalData({
                      isOpen: true,
                      data: item
                    });
                  }}
                  hasSwitch={true}
                  hasDelete={true}
                  hasEdit={true}
                  columns={[
                    {
                      title: "No",
                      render: (_, __, index) => index + 1
                    },
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
                      title: 'Slug',
                      dataIndex: 'name'
                    },
                    {
                      type: "switch",
                      title: t("Holati"),
                      dataIndex: "status"
                    }
                  ]}
                />
                <Pagination meta={meta} rootClassName={"!mt-4"} align={"end"} />

              </Panel>
            </>
          );
        }}
      </Get>
      <ModalData modalData={modalData} setModalData={setModalData} />

    </>
  );
}

export default Index;
