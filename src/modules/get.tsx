import { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useGet } from "../hooks";
import { get } from "lodash";
import { FC, ReactElement } from "react";
import { TMeta, TParams } from "../services/types";

interface IContainer {
  children: (
    data: {
      items: object[];
      meta: TMeta;
      queryOption: UseQueryResult;
      isDataLoading: boolean;
      isDataEmpty: boolean;
      isDataSuccess: boolean;
    } & UseQueryResult
  ) => ReactElement<any, any> | null;
  name: string;
  url: string;
  dataKey?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  queryOptions?: UseQueryOptions<any, Error>;
  params?: TParams | undefined;
}

const Get: FC<IContainer> = ({
  children,
  name,
  url,
  onSuccess,
  onError,
  dataKey = "data",
  queryOptions,
  params
}) => {
  const data = useGet({
    name,
    url,
    onSuccess,
    onError,
    queryOptions,
    params
  });
  const dataPayload = get(data, "data");
  const items = Array.isArray(dataPayload) ? dataPayload : get(dataPayload, dataKey, []);

  const newData: { items: any; meta: TMeta } = {
    items,
    meta: {
      current_page: get(data, "data.current_page", 0),
      count: get(data, "data.to", 0),
      per_page: get(data, "data.per_page", 0),
      page: Math.ceil(
        get(data, "data.total", 0) / get(data, "data.per_page", 0)
      ) || 0,
      total: get(data, "data.total", 0)
    }
  };
  return children({
    items: get(newData, "items", []),
    meta: get(newData, "meta"),
    isDataLoading: get(data, "isLoading") && !get(newData, "items"),
    isDataEmpty: !get(data, "isLoading") && !get(newData, "items"),
    isDataSuccess: !get(data, "isLoading") && get(newData, "items"),
    queryOption: data,
    ...data
  });
};

export default Get;
