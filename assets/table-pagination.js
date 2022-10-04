/**
 * TablePaginator
 * Creates a paginated view of all table data,
 * dividing all rows in tbody groups.
 */
const TablePaginator = (function () {
    const OPTIONS = [0, 16];

    const _$paginationTemplate = document.createElement("template");
    _$paginationTemplate.innerHTML = `
        <ul><li><button type="button" value="__PAGE_TITLE__">__PAGE_TITLE__</button></li></ul>
    `;

    class _TablePaginator {
        constructor($table) {
            if (!$table) return;

            const self = this;

            this.$table = document.getElementById($table);
            this.$rangeSelector = document.getElementById(
                "table_paginator-show_options"
            );
            this.$navigation = document.getElementById(
                "table_paginator-pagination"
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
            self.render();

            // Events
            this.$rangeSelector.addEventListener(
                "change",
                function handleChange(event) {
                    self.divideRows(event.target.value);
                    self.render();
                }
            );

            this.$navigation.addEventListener(
                "click",
                function handleClick(event) {
                    const $target = event.target;

                    if ($target.nodeName === "BUTTON") {
                        self.openPage($target.value);
                    }
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

        render() {
            this.renderTable();
            this.renderPagination();
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

                if (index !== 0) {
                    tableBodyPart.setAttribute("hidden", "");
                }

                this.$table.insertBefore(tableBodyPart, this.$table.tFoot);
            }
        }

        renderPagination() {
            const $previousContainer = this.$navigation.firstChild;
            const $optionContainer = _$paginationTemplate.content
                .querySelector("ul")
                .cloneNode(true);
            const $optionTemplate =
                $optionContainer.querySelector("li").outerHTML;

            $optionContainer.innerHTML = this.pages
                .map(function createPagination(page, index) {
                    return $optionTemplate.replace(
                        /__PAGE_TITLE__/g,
                        index + 1
                    );
                })
                .join("");

            this.$navigation.replaceChild($optionContainer, $previousContainer);
        }

        openPage(pageNumber) {
            const pageIndex = pageNumber - 1;

            Array.prototype.forEach.call(
                this.$table.tBodies,
                function toggleVisibility($tBody, index) {
                    const tbodyIndex = parseInt($tBody.dataset.pageIndex, 10);

                    if (tbodyIndex === pageIndex) {
                        $tBody.removeAttribute("hidden");
                    } else {
                        $tBody.setAttribute("hidden", "");
                    }
                }
            );
        }
    }

    return _TablePaginator;
})();
