/**
 * TablePaginator
 * Creates a paginated view of all table data,
 * dividing all rows in tbody groups.
 */
const TablePaginator = (function () {
    const OPTIONS = [0, 16];

    const _$paginationTemplate = html`
        <ul>
            <li>
                <button type="button" value="__PAGE_TITLE__">
                    __PAGE_TITLE__
                </button>
            </li>
        </ul>
    `;

    const _$paginationInfoTemplate = html`
        <span>${"#"} tot en met ${"##"} van ${"###"} gegevens zichtbaar.</span>
    `;

    class _TablePaginator {
        constructor($table) {
            if (!$table) return;

            const self = this;

            this.$table = document.getElementById($table);
            this.$rangeSelector = document.getElementById(
                "table_paginator-show_options"
            );
            this.$info = document.getElementById("table_paginator-info");
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
            this.activePageIndex = 0;
            this.divisionRange = parseInt(this.$rangeSelector.value, 10);

            this.initiate();
        }

        initiate() {
            const self = this;

            this.$table.setAttribute("aria-describedby", this.$info.id);

            // Events
            this.$rangeSelector.addEventListener(
                "change",
                function handleChange(event) {
                    const newRange = event.target.value;

                    self.divisionRange = newRange;

                    self.divideRows(newRange);
                    self.render();
                }
            );

            this.$navigation.addEventListener(
                "click",
                function handleClick(event) {
                    const $target = event.target;

                    if ($target.nodeName === "BUTTON") {
                        self.openPage($target.value);
                        $target
                            .closest("ul")
                            .querySelector("button.active")
                            .classList.toggle("active");
                        $target.classList.toggle("active");
                    }
                }
            );

            self.divideRows(this.divisionRange);
            self.render();
        }

        divideRows(rowAmount = 0) {
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
            this.renderInfo();
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
            const self = this;
            const $previousContainer = this.$navigation.firstChild;
            const $optionContainer = _$paginationTemplate().querySelector("ul");
            const $optionTemplate =
                $optionContainer.querySelector("li");

            $optionContainer.innerHTML = this.pages
                .map(function createPagination(page, index) {
                    const $option = $optionTemplate.cloneNode(true);

                    if (index === self.activePageIndex) {
                        $option
                            .querySelector("button")
                            .classList.add("active");
                    }
                    return $option.outerHTML.replace(
                        /__PAGE_TITLE__/g,
                        index + 1
                    );
                })
                .join("");

            if ($previousContainer) {
                this.$navigation.replaceChild(
                    $optionContainer,
                    $previousContainer
                );
            } else {
                this.$navigation.appendChild($optionContainer);
            }
        }

        renderInfo() {
            const _$info = _$paginationInfoTemplate();
            const { activePageIndex, divisionRange } = this;
            const totalRows = this.dataRows.length;
            const firstRow = 1 + activePageIndex * divisionRange;
            const lastRow = firstRow + this.pages[activePageIndex].length - 1;
            const infoString = _$info.textContent
                .replace("#", firstRow)
                .replace("##", lastRow)
                .replace("###", totalRows);

            _$info.firstChild.innerHTML = infoString;

            this.$info.innerHTML = "";
            this.$info.appendChild(_$info);
        }

        openPage(pageNumber) {
            const pageIndex = pageNumber - 1;
            const previousPageIndex = this.activePageIndex;

            if (pageIndex === previousPageIndex) {
                return;
            }

            this.activePageIndex = pageIndex;

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

            this.renderInfo();
        }
    }

    function html(strings, ...values) {
        const $template = document.createElement("template");
        $template.innerHTML = String.raw(strings, ...values).replace(
            /\s{2,}/g,
            ""
        );

        return () => $template.content.cloneNode(true);
    }

    return _TablePaginator;
})();
