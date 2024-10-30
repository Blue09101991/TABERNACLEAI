'use client';
/* eslint-disable */

import {
  Badge,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Icon,
  Stack,
  Checkbox,
} from '@chakra-ui/react';
import Card from '@/components/card/Card';
import { MdChevronRight, MdChevronLeft } from 'react-icons/md';
import * as React from 'react';
import { SearchBar } from '@/components/search';

import {
  PaginationState,
  createColumnHelper,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import router from 'next/router';
import { useParams } from 'react-router-dom';
import { useRouter } from 'next/router';

type RowObj = {
  template: string;
  prompt: string;
  date: string | Date;
  words: number;
  edit: string;
  [x: string]: any;
};

export default function SearchTableOrders(props: { tableData: RowObj[] }) {
  const { tableData } = props;
  const textColor = useColorModeValue('navy.700', 'white');
  const textSecondaryColor = useColorModeValue('gray.500', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const brandColor = useColorModeValue('brand.500', 'brand.400');

  const router = useRouter();

  // const { id } = useParams();

  // Use this function to handle the click event
  // const handleEditPromptClick = (url: any, documentId: any, title: any) => {
  //   router.push(`/${url}?id=${documentId}`);
  // };
  const handleEditPromptClick = (url: any, documentId: any, title: any) => {
    router.push(`/${url}?id=${documentId}&title=${encodeURIComponent(title)}`);
  };

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  let defaultData = tableData;
  const [globalFilter, setGlobalFilter] = React.useState('');
  const columnHelper = createColumnHelper<RowObj>();
  const columns = [
    columnHelper.accessor('', {
      id: 'name',
      header: () => <Checkbox colorScheme="brandScheme" me="10px" />,
      cell: (info: any) => (
        <Flex align="center">
          <Checkbox colorScheme="brandScheme" me="10px" />
        </Flex>
      ),
    }),
    columnHelper.accessor('template', {
      id: 'template',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize="xs"
          fontWeight="500"
          color={textSecondaryColor}
        >
          TEMPLATE
        </Text>
      ),
      cell: (info: any) => (
        <Text color={textColor} fontSize="md" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('prompt', {
      id: 'prompt',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize="xs"
          fontWeight="500"
          color={textSecondaryColor}
        >
          PROMPT
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="md" fontWeight="500">
          {info.getValue().length < 31
            ? info.getValue().concat('...')
            : info.getValue().slice(0, 30).concat('...')}
        </Text>
      ),
    }),
    columnHelper.accessor('date', {
      id: 'date',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize="xs"
          fontWeight="500"
          color={textSecondaryColor}
        >
          DATE
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="md" fontWeight="500">
          {info.getValue().toString()}
        </Text>
      ),
    }),
    columnHelper.accessor('words', {
      id: 'words',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize="xs"
          fontWeight="500"
          color={textSecondaryColor}
        >
          WORDS
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="md" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('edit', {
      id: 'edit',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize="xs"
          fontWeight="500"
          color={textSecondaryColor}
        >
          EDIT PROMPT
        </Text>
      ),
      cell: (info) => (
        <Text
          cursor="pointer"
          color={brandColor}
          textDecoration="underline"
          fontSize="md"
          fontWeight="500"
          id={info.getValue()}
          onClick={() => handleEditPromptClick(info.row.original.url, info.row.original.id, info.row.original.title)}
        >
          Edit prompt
        </Text>
      ),
    }),
  ];
  const [data, setData] = React.useState(() => [...props.tableData]);

  React.useEffect(() => {
    setData([...props.tableData]);
  }, [props.tableData]);

  const [{ pageIndex, pageSize }, setPagination] = React.useState<
    PaginationState
  >({
    pageIndex: 0,
    pageSize: 6,
  });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );
  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
      pagination,
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });
  const createPages = (count: number) => {
    let arrPageCount = [];

    for (let i = 1; i <= count; i++) {
      arrPageCount.push(i);
    }

    return arrPageCount;
  };

  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }]);
      }
    }
  }, [table.getState().columnFilters[0]?.id]);

  return (

    <Card flexDirection="column" w="100%" px="0px">
      <Flex
        align={{ sm: 'flex-start', lg: 'flex-start' }}
        justify={{ sm: 'flex-start', lg: 'flex-start' }}
        w="100%"
        px="20px"
      >
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(String(value))}
          placeholder="Search prompt"
        />
        <Button
          variant="primary"
          py="20px"
          px="16px"
          fontSize="sm"
          borderRadius="45px"
          w={{ base: '100%', md: '140px' }}
          h="44px"
        >
          Search
        </Button>
      </Flex>
      <Flex maxW="100%" overflowX={{ base: 'scroll', lg: 'hidden' }}>
        <Table maxW="100%" variant="simple" color="gray.500" mb="24px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      pe="10px"
                      py="22px"
                      borderColor={borderColor}
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : (
                        <Flex
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                          justify="space-between"
                          align="center"
                          fontSize="xs"
                          fontWeight="500"
                          color={textSecondaryColor}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: '',
                            desc: '',
                          }[header.column.getIsSorted() as string] ?? null}
                        </Flex>
                      )}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <Tr px="20px" key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Td
                        key={cell.id}
                        fontSize={{ sm: '14px' }}
                        minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                        borderColor={borderColor}
                        py="57px"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Flex>
      <Flex w="100%" justify="space-between" px="20px" pt="10px" pb="5px">
        {/* SET ROW NUMBER */}
        <Text
          fontSize="sm"
          color="gray.500"
          fontWeight="normal"
          mb={{ sm: '24px', md: '0px' }}
        >
          Showing {pageSize * pageIndex + 1} to{' '}
          {pageSize * (pageIndex + 1) <= tableData.length
            ? pageSize * (pageIndex + 1)
            : tableData.length}{' '}
          of {tableData.length} entries
        </Text>
        {/* PAGINATION BUTTONS */}
        <div className="flex items-center gap-2">
          <Stack direction="row" alignSelf="flex-end" spacing="4px" ms="auto">
            <Button
              variant="no-effects"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              transition="all .5s ease"
              w="40px"
              h="40px"
              borderRadius="50%"
              bg="transparent"
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'white')}
              display={
                pageSize === 5
                  ? 'none'
                  : table.getCanPreviousPage()
                    ? 'flex'
                    : 'none'
              }
              _hover={{
                bg: 'whiteAlpha.100',
                opacity: '0.7',
              }}
            >
              <Icon as={MdChevronLeft} w="16px" h="16px" color={textColor} />
            </Button>
            {createPages(table.getPageCount()).map((pageNumber, index) => {
              return (
                <Button
                  variant="no-effects"
                  transition="all .5s ease"
                  onClick={() => table.setPageIndex(pageNumber - 1)}
                  w="40px"
                  h="40px"
                  borderRadius="50%"
                  bg={pageNumber === pageIndex + 1 ? brandColor : 'transparent'}
                  border={
                    pageNumber === pageIndex + 1
                      ? 'none'
                      : '1px solid lightgray'
                  }
                  _hover={
                    pageNumber === pageIndex + 1
                      ? {
                        opacity: '0.7',
                      }
                      : {
                        bg: 'whiteAlpha.100',
                      }
                  }
                  key={index}
                >
                  <Text
                    fontSize="sm"
                    color={pageNumber === pageIndex + 1 ? '#fff' : textColor}
                  >
                    {pageNumber}
                  </Text>
                </Button>
              );
            })}
            <Button
              variant="no-effects"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              transition="all .5s ease"
              w="40px"
              h="40px"
              borderRadius="50%"
              bg="transparent"
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'white')}
              display={
                pageSize === 5
                  ? 'none'
                  : table.getCanNextPage()
                    ? 'flex'
                    : 'none'
              }
              _hover={{
                bg: 'whiteAlpha.100',
                opacity: '0.7',
              }}
            >
              <Icon as={MdChevronRight} w="16px" h="16px" color={textColor} />
            </Button>
          </Stack>
        </div>
      </Flex>
    </Card>
  );
}
// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <SearchBar
      value={value}
      me="10px"
      onChange={(e: any) => setValue(e.target.value)}
      h="44px"
      w={{ lg: '390px' }}
      borderRadius="40px !important"
      placeholder="Search prompt"
    />
  );
}
