<script setup lang="ts">
import {
  FlexRender,
  createColumnHelper,
  getCoreRowModel,
  useVueTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/vue-table";
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
    header: "Created",
    cell: (info) => formatDate(info.getValue(), false),
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
    },
  },
  onSortingChange: (updaterOrValue) => {
    sorting.value = typeof updaterOrValue === "function" ? updaterOrValue(sorting.value) : updaterOrValue;
  },
});
</script>

<template>
  <div class="flex max-w-5xl flex-col items-center justify-center">
    <Input v-model="filter" type="text" placeholder="Search..." class="max-w-64 place-self-start" />
    <Table class="h-90 table-fixed">
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            scope="col"
            :class="{ 'cursor-pointer select-none': header.column.getCanSort() }"
            @click="header.column.getToggleSortingHandler()?.($event)"
          >
            <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
            <Icon v-if="header.column.getIsSorted() === 'asc'" name="mdi:chevron-up" class="inline size-3" />
            <Icon v-else-if="header.column.getIsSorted() === 'desc'" name="mdi:chevron-down" class="inline size-3" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
          <TableCell
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            :class="{
              truncate: ['name', 'content'].includes(cell.column.id),
              'text-center align-middle': cell.column.id === 'delete',
            }"
          >
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <div class="flex items-center justify-center">
      <Button variant="ghost" :disabled="!table.getCanPreviousPage()" @click="table.setPageIndex(0)">
        <Icon name="mdi:chevron-double-left" />
      </Button>
      <Button variant="ghost" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
        <Icon name="mdi:chevron-left" />
      </Button>
      <p>
        Page {{ table.getState().pagination.pageIndex + 1 }} of {{ table.getPageCount() }} -
        {{ table.getFilteredRowModel().rows.length }} items
      </p>
      <Button variant="ghost" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
        <Icon name="mdi:chevron-right" />
      </Button>
      <Button variant="ghost" :disabled="!table.getCanNextPage()" @click="table.setPageIndex(table.getPageCount() - 1)">
        <Icon name="mdi:chevron-double-right" />
      </Button>
    </div>
  </div>
</template>
