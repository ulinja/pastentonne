<script setup lang="ts">
import { FlexRender, createColumnHelper, getCoreRowModel, useVueTable } from "@tanstack/vue-table";
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
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.display({
    id: "delete",
    cell: ({ row }) => h(PasteListDeleteButton, { pasteId: row.original.id }),
  }),
];

// TODO: emit delete event from deletebutton and reload table data / rerender table
const table = useVueTable({
  data: pastes.value,
  columns: columns,
  getCoreRowModel: getCoreRowModel(),
});
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id" scope="col">
            <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
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
  </div>
</template>
