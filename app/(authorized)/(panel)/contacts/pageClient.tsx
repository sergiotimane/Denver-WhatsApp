"use client"

import {
    ColumnDef, getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel, PaginationState, SortingState, useReactTable, VisibilityState
} from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from "react"
import { Contact } from "@/types/contact"
import Loading from "../../../loading"
import { AddContactDialog } from "./AddContactDialog"
import { ContactsTable } from "./ContactsTable"
import { fetchData, itemsPerPage } from "./fetchData"
import { AddBulkContactsDialog } from "./AddBulkContactsDialog"

export default function ContactsClient() {
    const columns = useMemo<ColumnDef<Contact>[]>(
        () => [
            // {
            //     id: "select",
            //     size: 40,
            //     header: ({ table }) => (
            //         <Checkbox
            //             checked={table.getIsAllPageRowsSelected()}
            //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            //             aria-label="Select all"
            //         />
            //     ),
            //     cell: ({ row }) => (
            //         <Checkbox
            //             checked={row.getIsSelected()}
            //             onCheckedChange={(value) => row.toggleSelected(!!value)}
            //             aria-label="Select row"
            //         />
            //     ),
            //     enableSorting: false,
            //     enableHiding: false,
            // },
            {
                accessorKey: "wa_id",
                header: "Number",
                size: 160,
                cell: ({ row }) => (
                    <div>{row.getValue("wa_id")}</div>
                ),
            },
            {
                accessorKey: "profile_name",
                header: 'Name',
                size: 280,
                cell: ({ row }) => <div>{row.getValue("profile_name")}</div>,
            },
            {
                accessorKey: "created_at",
                header: 'Created At',
                size: 280,
                cell: ({ row }) => <div>{row.getValue("created_at")}</div>,
            },
            {
                accessorKey: "tags",
                header: 'Tags',
                size: 280,
                cell: ({ row }) => <div>{(row.getValue('tags') as unknown as string[])?.join(", ")}</div>,
            },
            {
                id: "actions",
                size: 40,
                enableHiding: false,
                cell: ({ row }) => {
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Coming soon</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                },
            },
        ],
        []
    )

    const [{ pageIndex, pageSize }, setPagination] =
        React.useState<PaginationState>({
            pageIndex: 0,
            pageSize: itemsPerPage,
        })
    const [ searchFilter, setSearchFilter ] = useState("")

    const fetchDataOptions = {
        pageIndex,
        pageSize,
        searchFilter
    }

    const dataQuery = useQuery({
        queryKey: ['data', fetchDataOptions],
        queryFn: () => fetchData(fetchDataOptions),
        placeholderData: keepPreviousData
    })
    const defaultData = React.useMemo(() => [], [])

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable<Contact>({
        data: dataQuery.data?.rows ?? defaultData,
        columns,
        manualPagination: true,
        pageCount: dataQuery.data?.pageCount ?? -1,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            pagination,
        },
    })

    return (
        <div className="m-4 bg-white rounded-xl p-4">
            <div className="flex justify-between items-center py-4">
                <Input
                    placeholder="Search name..."
                    value={searchFilter}
                    onChange={(event) => setSearchFilter(event.target.value) }
                    className="max-w-sm"
                />
                <div className="space-x-2">
                    <AddBulkContactsDialog onSuccessfulAdd={dataQuery.refetch}>
                        <Button className="ml-auto">Add Bulk Contacts via CSV</Button>
                    </AddBulkContactsDialog>
                    <AddContactDialog onSuccessfulAdd={dataQuery.refetch}>
                        <Button className="ml-auto">Add Contact</Button>
                    </AddContactDialog>
                </div>
            </div>
            <div className="rounded-md border relative">
                {dataQuery.isLoading && <div className="absolute block w-full h-full bg-gray-500 opacity-30">
                    <Loading/>
                </div>}
                <ContactsTable table={table} totalColumns={columns.length} />
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                {/* <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected
                </div> */}
                {table.getPageCount() != -1 && <div className="text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>}
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
