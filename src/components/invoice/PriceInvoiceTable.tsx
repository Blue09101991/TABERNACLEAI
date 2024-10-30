'use client';
/* eslint-disable */

import {
    Box,
    Flex,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
} from '@chakra-ui/react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

type RowObj = {
    plan: string;
    date: string | Date | Date;
    amount: string | number;
};

const columnHelper = createColumnHelper<RowObj>();

// const columns = columnsDataCheck;
export default function InvoiceTable(props: { tableData: any }) {
    const { tableData } = props;
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const textColor = useColorModeValue('navy.700', 'white');
    const textSecondaryColor = useColorModeValue('gray.500', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    let defaultData = tableData;
    const columns = [
        columnHelper.accessor('plan', {
            id: 'plan',
            header: () => (
                <Text
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: 'xs' }}
                    color={textSecondaryColor}
                >
                    PLAN
                </Text>
            ),
            cell: (info) => (
                <Text
                    color={textColor}
                    fontSize={{ base: 'sm', md: 'md' }}
                    fontWeight="700"
                >
                    {info.getValue()}
                </Text>
            ),
        }),
        columnHelper.accessor('date', {
            id: 'date',
            header: () => (
                <Text
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: 'xs' }}
                    color={textSecondaryColor}
                >
                    Credits
                </Text>
            ),
            cell: (info) => (
                <Text
                    color={textColor}
                    fontSize={{ base: 'sm', md: 'md' }}
                    fontWeight="700"
                >
                    {info.getValue().toString()}
                </Text>
            ),
        }),
        columnHelper.accessor('amount', {
            id: 'amount',
            header: () => (
                <Text
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: 'xs' }}
                    color={textSecondaryColor}
                >
                    AMOUNT
                </Text>
            ),
            cell: (info) => (
                <Text
                    color={textColor}
                    fontSize={{ base: 'sm', md: 'md' }}
                    fontWeight="700"
                >
                    {info.getValue()}
                </Text>
            ),
        }),
    ];
    const [data, setData] = React.useState(() => [...defaultData]);
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
    });
    return (
        <Flex
            direction="column"
            w="100%"
            overflowX={{ sm: 'scroll', lg: 'hidden' }}
        >
            <Box>
                <Table variant="simple" color="gray.500" mt="12px">
                    <Thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <Th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            pe="10px"
                                            borderColor={borderColor}
                                            cursor="pointer"
                                        >
                                            <Flex
                                                justifyContent="space-between"
                                                align="center"
                                                fontSize={{ sm: '10px', lg: 'xs' }}
                                                color={textSecondaryColor}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                            </Flex>
                                        </Th>
                                    );
                                })}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody>
                        {table
                            .getRowModel()
                            .rows.slice(0, 11)
                            .map((row) => {
                                return (
                                    <Tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => {
                                            return (
                                                <Td
                                                    key={cell.id}
                                                    fontSize={{ md: '14px' }}
                                                    minW={{ base: '80px', md: '200px', lg: 'auto' }}
                                                    borderColor={borderColor}
                                                    mt="20px !important"
                                                    py={{
                                                        base: '16px !important',
                                                        md: '36px !important',
                                                    }}
                                                    textAlign={{
                                                        base: 'center',
                                                        md: 'left',
                                                    }}
                                                    px={{
                                                        base: '0px !important',
                                                        md: '24px !important',
                                                    }}
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
            </Box>
        </Flex>
    );
}
