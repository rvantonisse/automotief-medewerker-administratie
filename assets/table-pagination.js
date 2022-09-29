/**
 * TablePaginator
 * Creates a paginated view of all table data,
 * dividing all rows in tbody groups.
 */
const TablePaginator = (function () {
    const OPTIONS = [0, 16];

    class _TablePaginator {
        constructor($table) {
            if (!$table) return;

            this.$table = document.getElementById($table);

            this.pages = [];
            this.activePage = 0;

            this.divideRows();
            this.renderTable();
        }

        divideRows() {
            const ROWS_PER_PAGE = 16;
            const _rows = Array.from(this.$table.rows)
                .slice()
                .filter(function withoutHeadingRows(_row) {
                    return Array.from(_row.cells).some(function isDataCell(cell) {
                        return cell.nodeName === "TD";
                    });
                });
            const rowCount = _rows.length;
            const divisionCount = Math.ceil(rowCount / ROWS_PER_PAGE);
            const division = [];

            for (let index = 0; index < divisionCount; index++) {
                division.push(_rows.splice(0, ROWS_PER_PAGE));
            }

            this.pages = division;

            console.log(division);
        }

        renderTable() {
            const pageCount = this.pages.length;

            // Reset the table body
            Array.from(this.$table.tBodies).forEach(tbody => {
                this.$table.removeChild(tbody);
            });

            // Insert new sectioning
            for (let index = 0; index < pageCount; index++) {
                const tableBodyPart = document.createElement("tbody");
                tableBodyPart.setAttribute("data-page-index", index);
                tableBodyPart.innerHTML = this.pages[index].map((row) => row.outerHTML).join("\n");

                this.$table.insertBefore(tableBodyPart, this.$table.tFoot);
            }
        }
    }

    return _TablePaginator;
})();
