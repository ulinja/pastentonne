<script setup lang="ts">
import { FlexRender, createColumnHelper, getCoreRowModel, useVueTable, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/vue-table";
import type { SortingState } from "@tanstack/vue-table";
import PasteListDeleteButton from "./delete-button.vue";
import NameLink from "./name-link.vue";

interface Props {
  pastes: DbTextPaste[];
}
const props = defineProps<Props>();
const { pastes } = toRefs(props);

const columnHelper = createColumnHelper<DbTextPaste>();
const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: ({ row }) =>
      h(NameLink, {
        pasteId: row.original.id,
        pasteName: row.original.name,
      }),
  }),
  columnHelper.accessor("content", {
    header: "Content",
    cell: (info) => truncateString(info.getValue()),
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.display({
    id: "delete",
    cell: ({ row }) => h(PasteListDeleteButton, { pasteId: row.original.id }),
    enableSorting: false,
  }),
];

const sorting = ref<SortingState>([]);
const filter = ref("");

// TODO: emit delete event from deletebutton and reload table data / rerender table
const table = useVueTable({
  data: pastes.value,
  columns: columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  initialState: {
    pagination: {
      pageSize: 5,
    },
  },
  state: {
    get sorting() {
      return sorting.value;
    },
    get globalFilter() {
      return filter.value;
    }
  },
  onSortingChange: updaterOrValue => {
    sorting.value = typeof updaterOrValue === "function"
      ? updaterOrValue(sorting.value)
      : updaterOrValue
  },
});
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <Input type="text" v-model="filter" placeholder="Search..." class="max-w-64 place-self-start" />
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            @click="header.column.getToggleSortingHandler()?.($event)"
            scope="col"
            :class="{ 'cursor-pointer select-none': header.column.getCanSort() }"
          >
            <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
            <Icon v-if="header.column.getIsSorted() === 'asc'" name="mdi:chevron-up" class="size-3 inline" />
            <Icon v-else-if="header.column.getIsSorted() === 'desc'" name="mdi:chevron-down" class="size-3 inline" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
          <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <div class="flex items-center justify-center">
      Page {{ table.getState().pagination.pageIndex + 1 }} of {{ table.getPageCount() }} - {{ table.getFilteredRowModel().rows.length }} items
    </div>
    <div class="flex items-center justify-center">
      <Button
        @click="table.setPageIndex(0)"
        :disabled="!table.getCanPreviousPage()"
      >
        First
      </Button>
      <Button
        @click="table.previousPage()"
        :disabled="!table.getCanPreviousPage()"
      >
        Prev
      </Button>
      <Button
        @click="table.nextPage()"
        :disabled="!table.getCanNextPage()"
      >
        Next
      </Button>
      <Button
        @click="table.setPageIndex(table.getPageCount() - 1)"
        :disabled="!table.getCanNextPage()"
      >
        Last
      </Button>
    </div>
  </div>
</template>
