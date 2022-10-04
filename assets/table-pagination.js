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

            const self = this;

            this.$table = document.getElementById($table);
            this.$rangeSelector = document.getElementById(
                "table_paginator-show_options"
            );

            this.dataRows = Array.from(this.$table.rows)
                .slice()
                .filter(function withoutHeadingRows(_row) {
                    return Array.from(_row.cells).some(function isDataCell(
                        cell
                    ) {
                        return cell.nodeName === "TD";
                    });
                });
            this.pages = [];
            this.activePage = 0;

            this.initiate();
        }

        initiate() {
            const self = this;
            const initialRange = this.$rangeSelector.value || 0;

            self.divideRows(initialRange);
            self.renderTable();

            // Events
            this.$rangeSelector.addEventListener(
                "change",
                function handleChange(event) {
                    self.divideRows(event.target.value);
                    self.renderTable();
                }
            );
        }

        divideRows(rowAmount = 16) {
            const ROWS_PER_PAGE = rowAmount;
            const _rows = this.dataRows.slice();
            const rowCount = _rows.length;
            const divisionCount =
                rowAmount > 0 ? Math.ceil(rowCount / ROWS_PER_PAGE) : 1;
            const division = [];

            if (divisionCount > 1) {
                for (let index = 0; index < divisionCount; index++) {
                    Array.prototype.push.call(
                        division,
                        _rows.splice(0, ROWS_PER_PAGE)
                    );
                }
            } else {
                Array.prototype.push.call(
                    division,
                    _rows.splice(0, _rows.length)
                );
            }

            this.pages = division.slice();
        }

        renderTable() {
            const pageCount = this.pages.length;

            // Reset the table body
            Array.from(this.$table.tBodies).forEach((tbody) => {
                this.$table.removeChild(tbody);
            });

            // Insert new sectioning
            for (let index = 0; index < pageCount; index++) {
                const tableBodyPart = document.createElement("tbody");
                tableBodyPart.setAttribute("data-page-index", index);
                tableBodyPart.innerHTML = this.pages[index]
                    .map((row) => row.outerHTML)
                    .join("\n");

                this.$table.insertBefore(tableBodyPart, this.$table.tFoot);
            }
        }
    }

    return _TablePaginator;
})();
