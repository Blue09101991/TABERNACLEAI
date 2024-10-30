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
  Input,
} from '@chakra-ui/react';
import Card from '@/components/card/Card';
import { MdChevronRight, MdChevronLeft } from 'react-icons/md';
// import * as React from 'react';
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

import React, { useEffect, useState } from 'react';

import { RiDeleteBinLine } from "react-icons/ri";
import { auth, db } from '../../../config/firebase';
import { getFirestore, doc, deleteDoc, setDoc, serverTimestamp, collection, getDocs, query, where } from "firebase/firestore";


export type RowObj = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  checked?: boolean;
};

export default function SearchTableOrders(props: { tableData: RowObj[] }) {
  const { tableData } = props;
  const textColor = useColorModeValue('navy.700', 'white');
  const textSecondaryColor = useColorModeValue('gray.500', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const brandColor = useColorModeValue('brand.500', 'brand.400');

  const [globalFilter, setGlobalFilter] = React.useState('');
  const [data, setData] = React.useState(tableData);

  // Filtering function after globalFilter initialization
  const filteredData = tableData.filter((row) => {
    return row.username.includes(globalFilter) ||
      row.firstName.includes(globalFilter) ||
      row.lastName.includes(globalFilter) ||
      row.email.includes(globalFilter);
  });

  // Filtering function inside a useEffect
  React.useEffect(() => {
    const filtered = tableData.filter((row) => {
      return (
        row.username.includes(globalFilter) ||
        row.firstName.includes(globalFilter) ||
        row.lastName.includes(globalFilter) ||
        row.email.includes(globalFilter)
      );
    });
    setData(filtered);
  }, [globalFilter, tableData]);

  const columnHelper = createColumnHelper<RowObj>();

  const deleteUser = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);
      console.log("User deleted successfully");

      // Update the state to remove the deleted user
      setData((prevData) => prevData.filter((user) => user.id !== userId));

    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCheckChange = async (e: React.ChangeEvent<HTMLInputElement>, userId: string, userEmail: string) => {
    const isChecked = e.target.checked;
    const currentUserEmail = auth.currentUser?.email;
  
    if (!currentUserEmail) {
      console.error("No authenticated user found.");
      return;
    }
  
    // Sanitize the email to use as a document ID
    // const sanitizedEmail = currentUserEmail.replace(/\./g, '_');
  
    // Assuming a simplified scenario where each userId maps to a single document
    const docId = userId; // Use the userId directly for simplicity
  
    if (isChecked) {
      // Path for creating or updating the document
      const docRef = doc(db, `admin`, docId);
      try {
        await setDoc(docRef, {
          userEmail: userEmail, // Email of the user being checked
          timestamp: serverTimestamp() // Current timestamp
        });
        console.log("Check info saved to Firestore successfully.");
      } catch (error) {
        console.error("Error saving check info to Firestore:", error);
      }
    } else {
      // Path for deleting the document
      try {
        await deleteDoc(doc(db, `admin`, docId));
        console.log("Check info removed from Firestore successfully.");
      } catch (error) {
        console.error("Error removing check info from Firestore:", error);
      }
    }

    window.location.reload();

  };

  useEffect(() => {
    const fetchCheckedStatuses = async () => {
      const currentUserEmail = auth.currentUser?.email;
      if (!currentUserEmail) {
        console.error("No authenticated user found.");
        return;
      }
  
      const checksCollectionRef = collection(db, `admin`);
  
      try {
        const querySnapshot = await getDocs(checksCollectionRef);
        const checkedIds = new Set();
        querySnapshot.forEach((docSnap) => {
          checkedIds.add(docSnap.id);
          console.log(`Document found: ${docSnap.id}`); // Debugging
        });
  
        console.log("Checked IDs:", Array.from(checkedIds)); // Debugging
  
        // Update the 'checked' state for each row based on the fetched data
        const updatedData = tableData.map((item) => ({
          ...item,
          checked: checkedIds.has(item.id),
        }));
    
        setData(updatedData);
      } catch (error) {
        console.error("Error fetching checked statuses:", error);
      }
    };
  
    fetchCheckedStatuses();
  }, [tableData]); // Ensure dependencies are correct
  

  const columns = [
    {
      id: 'checkbox',
      header: () => 
          // <Checkbox colorScheme="brandScheme" me="10px" />,
      (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize="xs"
          fontWeight="500"
          color={textSecondaryColor}
        >
          Admin
        </Text>
      ),
      cell: (info: any) => (
        <Flex align="center">
          {/* <Checkbox colorScheme="brandScheme" me="10px" /> */}
          <Checkbox
            colorScheme="brandScheme"
            me="10px"
            isChecked={info.row.original.checked}
            onChange={(e) => handleCheckChange(e, info.row.original.id, info.row.original.email)}
          />
        </Flex>
      ),
    },
    columnHelper.accessor('username', {
      id: 'username',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize="xs"
          fontWeight="500"
          color={textSecondaryColor}
        >
          USERNAME
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="md" fontWeight="500">
          {info.row.original.username}
        </Text>
      ),
    }),
    {
      id: 'fullName',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize="xs"
          fontWeight="500"
          color={textSecondaryColor}
        >
          FULL NAME
        </Text>
      ),
      cell: (info: any) => (
        <Text color={textColor} fontSize="md" fontWeight="500">
          {`${info.row.original.firstName} ${info.row.original.lastName}`}
        </Text>
      ),
    },
    columnHelper.accessor('email', {
      id: 'email',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize="xs"
          fontWeight="500"
          color={textSecondaryColor}
        >
          EMAIL
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="md" fontWeight="500">
          {info.row.original.email}
        </Text>
      ),
    }),

    {
      id: "delete",
      header: () => <Text>DELETE</Text>,
      cell: (info: any) => (
        <Button onClick={() => deleteUser(info.row.original.id)}>
          <RiDeleteBinLine />
        </Button>
      ),
    },

  ];

  // const [data, setData] = React.useState(() => [...filteredData]);

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
      pagination,
    },
    onPaginationChange: setPagination,
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

  return (
    <Card flexDirection="column" w="100%" px="0px">
      <Flex
        align={{ sm: 'flex-start', lg: 'flex-start' }}
        justify={{ sm: 'flex-start', lg: 'flex-start' }}
        w="100%"
        px="20px"
      >
        <Input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search prompt"
          h="44px"
          w={{ lg: '390px' }}
          borderRadius="40px"
          me="10px"
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
                {headerGroup.headers.map((header) => (
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
                      </Flex>
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr px="20px" key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td
                    key={cell.id}
                    fontSize={{ sm: '14px' }}
                    minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                    borderColor={borderColor}
                    py="57px"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Flex>
      <Flex w="100%" justify="space-between" px="20px" pt="10px" pb="5px">
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
            display={table.getCanPreviousPage() ? 'flex' : 'none'}
            _hover={{
              bg: 'whiteAlpha.100',
              opacity: '0.7',
            }}
          >
            <Icon as={MdChevronLeft} w="16px" h="16px" color={textColor} />
          </Button>
          {createPages(table.getPageCount()).map((pageNumber, index) => (
            <Button
              variant="no-effects"
              transition="all .5s ease"
              onClick={() => table.setPageIndex(pageNumber - 1)}
              w="40px"
              h="40px"
              borderRadius="50%"
              bg={pageNumber === pageIndex + 1 ? brandColor : 'transparent'}
              border={
                pageNumber === pageIndex + 1 ? 'none' : '1px solid lightgray'
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
          ))}
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
            display={table.getCanNextPage() ? 'flex' : 'none'}
            _hover={{
              bg: 'whiteAlpha.100',
              opacity: '0.7',
            }}
          >
            <Icon as={MdChevronRight} w="16px" h="16px" color={textColor} />
          </Button>
        </Stack>
      </Flex>
    </Card>
  );
}
