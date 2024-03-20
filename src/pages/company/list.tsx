import { CustomAvatar } from "@/components/custom-avatar";
import { Text } from "@/components/text";
import { COMPANIES_LIST_QUERY } from "@/graphql/queries";
import { Company } from "@/graphql/schema.types";
import { CompaniesListQuery } from "@/graphql/types";
import { currencyNumber } from "@/utilities";
import { SearchOutlined } from "@ant-design/icons";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  FilterDropdown,
  List,
  useTable,
} from "@refinedev/antd";
import { HttpError, getDefaultFilter, useGo } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { Input, Space, Table } from "antd";

export const CompanyList = ({ children }: React.PropsWithChildren) => {
  const go = useGo();
  const { tableProps, filters } = useTable<
    GetFieldsFromList<CompaniesListQuery>,
    HttpError,
    GetFieldsFromList<CompaniesListQuery>
  >({
    resource: "companies",
    onSearch: (values) => {
      return [
        {
          field: "name",
          operator: "contains",
          value: values.name,
        },
      ];
    },
    pagination: {
      pageSize: 12,
    },
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "name",
          operator: "contains",
          value: undefined,
        },
      ],
    },
    meta: {
      gqlQuery: COMPANIES_LIST_QUERY,
    },
  });
  return (
    <>
      <List
        breadcrumb={false}
        headerButtons={() => {
          return (
            <CreateButton
              onClick={() => {
                // modal is a opening from the url (/companies/new)
                // to open modal we need to navigate to the create page (/companies/new)
                // we are using `go` function because we want to keep the query params
                go({
                  to: {
                    resource: "companies",
                    action: "create",
                  },
                  options: {
                    keepQuery: true,
                  },
                  type: "replace",
                });
              }}
            />
          );
        }}
      >
        <Table
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
          }}
        >
          <Table.Column<Company>
            dataIndex="name"
            title="Company Title"
            defaultFilteredValue={getDefaultFilter("id", filters)}
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Company" />
              </FilterDropdown>
            )}
            render={(value, record) => (
              <Space>
                <CustomAvatar
                  shape="square"
                  name={record.name}
                  src={record.avatarUrl}
                />
                <Text
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {record.name}
                </Text>
              </Space>
            )}
          />
          <Table.Column<Company>
            dataIndex="totalRevenue"
            title="Open Deals amount"
            render={(value, comapny) => (
              <Text>
                {currencyNumber(comapny?.dealsAggregate?.[0].sum?.value || 0)}
              </Text>
            )}
          />
          <Table.Column<Company>
            dataIndex="id"
            title="Actions"
            fixed="right"
            render={(value) => (
              <Space>
                <EditButton hideText size="small" recordItemId={value} />
                <DeleteButton hideText size="small" recordItemId={value} />
              </Space>
            )}
          />
        </Table>
      </List>
      {children}
    </>
  );
};
